use base64::Engine as _;
use bollard::container::{
    CreateContainerOptions, ListContainersOptions, RemoveContainerOptions, StartContainerOptions,
};
use bollard::image::CreateImageOptions;
use bollard::Docker;
use futures_util::stream::StreamExt;
use serde::{Deserialize, Serialize};
use std::default::Default;
use std::env;
use sysinfo::{Disks, System};
use tauri::{command, Emitter};
use std::process::Command;

#[derive(Serialize, Clone)] // Added Clone here
struct ProgressUpdate {
    message: String,
    percentage: f32,
}

#[command]
async fn pull_and_run_docker_image(
    image: String,
    app_handle: tauri::AppHandle,
) -> Result<String, String> {
    // Kiểm tra Docker có đang chạy không bằng cách chạy "docker info"
    let docker_info = std::process::Command::new("docker")
        .arg("info")
        .output()
        .map_err(|e| format!("Lỗi khi chạy docker info: {}", e))?;

    if !docker_info.status.success() {
        // Nếu Docker không chạy, thử khởi động Docker theo hệ điều hành
        #[cfg(target_os = "linux")]
        let start_cmd = std::process::Command::new("systemctl")
            .args(&["start", "docker"])
            .status();

        #[cfg(target_os = "macos")]
        let start_cmd = std::process::Command::new("open")
            .args(&["-a", "Docker"])
            .status();

        #[cfg(target_os = "windows")]
        let start_cmd = std::process::Command::new("powershell")
            .args(&[
                "Start-Process",
                r#""C:\Program Files\Docker\Docker\Docker Desktop.exe""#,
            ])
            .status();

        match start_cmd {
            Ok(status) if status.success() => {
                // Chờ một chút để Docker khởi động, sau đó kiểm tra liên tục cho đến khi Docker hoạt động
                let max_attempts = 10; // Thử trong tối đa 10 giây
                let mut attempts = 0;
                loop {
                    let info = std::process::Command::new("docker").arg("info").output();

                    if let Ok(info) = info {
                        if info.status.success() {
                            break;
                        }
                    }

                    attempts += 1;
                    if attempts >= max_attempts {
                        return Err("Docker không khởi động hoàn toàn trong thời gian quy định."
                            .to_string());
                    }
                    std::thread::sleep(std::time::Duration::from_secs(1));
                }
            }
            _ => {
                return Err("Docker không chạy và không thể khởi động được.".to_string());
            }
        }
    }

    let docker = Docker::connect_with_local_defaults()
        .map_err(|e| format!("Failed to connect to Docker: {}", e))?;

    app_handle
        .emit(
            "docker_progress",
            ProgressUpdate {
                message: "Checking existing containers...".to_string(),
                percentage: 0.0,
            },
        )
        .map_err(|e| format!("Failed to emit progress: {}", e))?;

    let container_name = format!("{}_container", image.replace(":", "_").replace("/", "_"));

    let existing_containers = docker
        .list_containers::<String>(None)
        .await
        .map_err(|e| format!("Failed to list containers: {}", e))?;

    for container in &existing_containers {
        if let (Some(names), Some(id)) = (&container.names, &container.id) {
            if names.contains(&format!("/{}", container_name)) {
                if container.state.as_deref() != Some("running") {
                    app_handle
                        .emit(
                            "docker_progress",
                            ProgressUpdate {
                                message: "Starting existing container...".to_string(),
                                percentage: 50.0,
                            },
                        )
                        .map_err(|e| format!("Failed to emit progress: {}", e))?;
                    docker
                        .start_container(id, None::<StartContainerOptions<String>>)
                        .await
                        .map_err(|e| format!("Failed to start existing container: {}", e))?;
                }
                app_handle
                    .emit(
                        "docker_progress",
                        ProgressUpdate {
                            message: "Container ready".to_string(),
                            percentage: 100.0,
                        },
                    )
                    .map_err(|e| format!("Failed to emit progress: {}", e))?;
                return Ok(id.clone());
            }
        }
    }

    app_handle
        .emit(
            "docker_progress",
            ProgressUpdate {
                message: "Checking for old containers to remove...".to_string(),
                percentage: 10.0,
            },
        )
        .map_err(|e| format!("Failed to emit progress: {}", e))?;

    let existing_list = docker
        .list_containers::<String>(Some(ListContainersOptions {
            all: true,
            ..Default::default()
        }))
        .await
        .map_err(|e| format!("Failed to list containers: {}", e))?;

    for cont in existing_list {
        if let (Some(names), Some(id)) = (cont.names, cont.id) {
            if names.contains(&format!("/{}", container_name)) {
                app_handle
                    .emit(
                        "docker_progress",
                        ProgressUpdate {
                            message: "Removing old container...".to_string(),
                            percentage: 20.0,
                        },
                    )
                    .map_err(|e| format!("Failed to emit progress: {}", e))?;
                docker
                    .remove_container(
                        &id,
                        Some(RemoveContainerOptions {
                            force: true,
                            ..Default::default()
                        }),
                    )
                    .await
                    .map_err(|e| format!("Failed to remove container: {}", e))?;
            }
        }
    }

    app_handle
        .emit(
            "docker_progress",
            ProgressUpdate {
                message: "Pulling Docker image...".to_string(),
                percentage: 30.0,
            },
        )
        .map_err(|e| format!("Failed to emit progress: {}", e))?;

    let options = Some(CreateImageOptions {
        from_image: image.clone(),
        ..Default::default()
    });

    let mut stream = docker.create_image(options, None, None);
    let mut layer_count = 0;
    let mut completed_layers = 0;

    // Count total layers first (approximation, as Docker doesn't provide exact total upfront)
    while let Some(result) = stream.next().await {
        match result {
            Ok(info) => {
                if info.id.is_some() {
                    layer_count += 1; // Count distinct layers
                }
                // let progress = if layer_count > 0 {
                //     (completed_layers as f32 / layer_count as f32) * 50.0 + 30.0
                // // 30-80% range for pulling
                // } else {
                //     30.0
                // };
                if let Some(progress_detail) = info.progress_detail {
                    if let (Some(current), Some(total)) =
                        (progress_detail.current, progress_detail.total)
                    {
                        let layer_progress =
                            (current as f32 / total as f32) * (50.0 / layer_count as f32);
                        let total_progress = 30.0
                            + (completed_layers as f32 / layer_count as f32) * 50.0
                            + layer_progress;
                        app_handle
                            .emit(
                                "docker_progress",
                                ProgressUpdate {
                                    message: format!("Pulling: {} of {}", current, total),
                                    percentage: total_progress.min(80.0), // Cap at 80% until pull completes
                                },
                            )
                            .map_err(|e| format!("Failed to emit progress: {}", e))?;
                    }
                }
                if info.status == Some("Download complete".to_string())
                    || info.status == Some("Pull complete".to_string())
                {
                    completed_layers += 1;
                }
            }
            Err(e) => return Err(format!("Failed to pull image: {}", e)),
        }
    }

    app_handle
        .emit(
            "docker_progress",
            ProgressUpdate {
                message: "Creating container...".to_string(),
                percentage: 85.0,
            },
        )
        .map_err(|e| format!("Failed to emit progress: {}", e))?;

    let options = Some(CreateContainerOptions {
        name: container_name.clone(),
        platform: None,
    });

    let host_config = bollard::models::HostConfig {
        port_bindings: Some(
            vec![(
                "5000/tcp".to_string(),
                Some(vec![bollard::models::PortBinding {
                    host_ip: Some("0.0.0.0".to_string()),
                    host_port: Some("5000".to_string()),
                }]),
            )]
            .into_iter()
            .collect(),
        ),
        ..Default::default()
    };

    let config = bollard::container::Config {
        image: Some(image.clone()),
        tty: Some(true),
        host_config: Some(host_config),
        ..Default::default()
    };

    let container = docker
        .create_container(options, config)
        .await
        .map_err(|e| format!("Failed to create container: {}", e))?;

    app_handle
        .emit(
            "docker_progress",
            ProgressUpdate {
                message: "Starting container...".to_string(),
                percentage: 95.0,
            },
        )
        .map_err(|e| format!("Failed to emit progress: {}", e))?;

    docker
        .start_container(&container.id, None::<StartContainerOptions<String>>)
        .await
        .map_err(|e| format!("Failed to start container: {}", e))?;

    app_handle
        .emit(
            "docker_progress",
            ProgressUpdate {
                message: "Container ready".to_string(),
                percentage: 100.0,
            },
        )
        .map_err(|e| format!("Failed to emit progress: {}", e))?;

    Ok(container.id)
}

#[command]
async fn copy_from_docker(
    container_name: String,
    container_path: String,
) -> Result<String, String> {
    use std::env;
    use std::process::Command;

    let temp_dir = env::temp_dir();
    let file_name = container_path.split('/').last().unwrap_or("output.png");
    let output_path = temp_dir.join(file_name);

    let status = Command::new("docker")
        .args([
            "cp",
            &format!("{}:{}", container_name, container_path),
            output_path.to_str().unwrap(),
        ])
        .status()
        .map_err(|e| format!("Failed to execute docker cp: {}", e))?;

    if status.success() {
        Ok(output_path.to_str().unwrap().to_string())
    } else {
        Err(format!(
            "Failed to copy file from container: {}",
            container_name
        ))
    }
}

#[command]
async fn read_image_file(file_path: String) -> Result<String, String> {
    use std::fs;
    // Read the file from the system
    let data =
        fs::read(&file_path).map_err(|e| format!("Failed to read file {}: {}", file_path, e))?;
    // Encode to base64 using the STANDARD engine
    let encoded = base64::engine::general_purpose::STANDARD.encode(&data);
    Ok(encoded)
}

#[derive(Debug, Serialize, Deserialize)]
struct RemoveBgResponse {
    output_path: String,
}

#[command]
fn log_message(message: String) {
    println!("React log: {}", message);
}

#[derive(Clone, Serialize)]
struct DiskInfo {
    name: String,
    total_space: u64,
    available_space: u64,
}

#[derive(Clone, Serialize)]
struct SystemInfo {
    total_memory: u64,
    used_memory: u64,
    total_swap: u64,
    used_swap: u64,
    cpu_usage: f32,
    disk_space: Vec<DiskInfo>,
    cpu_name: String,
    gpu_name: Option<String>,
    gpu_usage: Option<f32>,
    system_name: String,
}

#[tauri::command]
fn get_system_info() -> SystemInfo {
    let mut sys = System::new_all();
    sys.refresh_all(); // Làm mới thông tin hệ thống

    let cpu_usage = sys.cpus().iter().map(|cpu| cpu.cpu_usage()).sum::<f32>() / sys.cpus().len() as f32;
    let total_memory = sys.total_memory();
    let used_memory = sys.used_memory();
    let total_swap = sys.total_swap();
    let used_swap = sys.used_swap();

    let disks = Disks::new_with_refreshed_list();
    let disk_space: Vec<DiskInfo> = disks
        .iter()
        .map(|disk| DiskInfo {
            name: disk.name().to_str().unwrap_or("Unknown").to_string(),
            total_space: disk.total_space(),
            available_space: disk.available_space(),
        })
        .collect();

    let cpu_name = sys
        .cpus()
        .first()
        .map(|cpu| cpu.brand().to_string())
        .unwrap_or_else(|| "Unknown CPU".to_string());

    let gpu_name = get_gpu_name(); // Giả sử bạn đã có hàm này
    let gpu_usage = get_gpu_usage(); // Lấy GPU usage

    let system_name = System::name().unwrap_or_else(|| "Unknown OS".to_string());

    SystemInfo {
        total_memory,
        used_memory,
        total_swap,
        used_swap,
        cpu_usage,
        disk_space,
        cpu_name,
        gpu_name,
        gpu_usage, // Gán giá trị GPU usage vào đây
        system_name,
    }
}

fn get_gpu_name() -> Option<String> {
    let instance = wgpu::Instance::new(wgpu::InstanceDescriptor {
        backends: wgpu::Backends::all(),
        ..Default::default()
    });

    let adapter = instance.enumerate_adapters(wgpu::Backends::all())
        .into_iter()
        .next();

    adapter.map(|ad| ad.get_info().name)
}

fn get_gpu_usage() -> Option<f32> {
    // Thử NVIDIA
    if let Some(usage) = get_nvidia_gpu_usage() {
        return Some(usage);
    }
    // Thử AMD
    if let Some(usage) = get_amd_gpu_usage() {
        return Some(usage);
    }
    // Thử Intel
    if let Some(usage) = get_intel_gpu_usage() {
        return Some(usage);
    }
    // Nếu không có, trả về None
    None
}

// Hàm lấy GPU usage cho NVIDIA
fn get_nvidia_gpu_usage() -> Option<f32> {
    use nvml_wrapper::Nvml;
    let nvml = Nvml::init().ok()?;
    let device = nvml.device_by_index(0).ok()?;
    let utilization = device.utilization_rates().ok()?;
    Some(utilization.gpu as f32)
}

// Hàm lấy GPU usage cho AMD (dùng radeontop)
fn get_amd_gpu_usage() -> Option<f32> {
    let output = Command::new("radeontop")
        .arg("-d")  // Dump dữ liệu
        .arg("-l1") // Giới hạn 1 lần đo
        .output()
        .ok()?;
    let stdout = String::from_utf8_lossy(&output.stdout);
    // Phân tích output, ví dụ: "gpu 45.00%"
    if let Some(line) = stdout.lines().find(|l| l.contains("gpu")) {
        let parts: Vec<&str> = line.split_whitespace().collect();
        if let Some(usage_str) = parts.get(1) {
            if let Ok(usage) = usage_str.parse::<f32>() {
                return Some(usage);
            }
        }
    }
    None
}

// Hàm lấy GPU usage cho Intel (dùng intel_gpu_top)
fn get_intel_gpu_usage() -> Option<f32> {
    let output = Command::new("intel_gpu_top")
        .arg("-l") // Liệt kê dữ liệu
        .output()
        .ok()?;
    let stdout = String::from_utf8_lossy(&output.stdout);
    // Phân tích output, ví dụ: "Render/3D/0 45.00%"
    if let Some(line) = stdout.lines().find(|l| l.contains("Render/3D/0")) {
        let parts: Vec<&str> = line.split_whitespace().collect();
        if let Some(usage_str) = parts.get(1) {
            if let Ok(usage) = usage_str.parse::<f32>() {
                return Some(usage);
            }
        }
    }
    None
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            pull_and_run_docker_image,
            copy_from_docker,
            read_image_file,
            log_message,
            get_system_info,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
