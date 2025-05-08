use serde::Serialize;
use sysinfo::{Disks, System};
use std::process::Command;
use parking_lot::Mutex;
use std::sync::Arc;
use tokio::task;

// Initialize system info handler
static SYSTEM: once_cell::sync::Lazy<Arc<Mutex<System>>> = once_cell::sync::Lazy::new(|| {
    Arc::new(Mutex::new(System::new_all()))
});

//
// Structs
//
#[derive(Clone, Serialize)]
pub struct DiskInfo {
    pub name: String,
    pub total_space: u64,
    pub available_space: u64,
}

#[derive(Clone, Serialize)]
pub struct SystemInfo {
    pub total_memory: u64,
    pub used_memory: u64,
    pub total_swap: u64,
    pub used_swap: u64,
    pub cpu_usage: f32,
    pub disk_space: Vec<DiskInfo>,
    pub cpu_name: String,
    pub gpu_name: Option<String>,
    pub gpu_usage: Option<f32>,
    pub system_name: String,
}

//
// CPU-related
//
fn get_cpu_usage(sys: &System) -> f32 {
    sys.cpus()
        .iter()
        .map(|cpu| cpu.cpu_usage())
        .sum::<f32>()
        / sys.cpus().len() as f32
}

fn get_cpu_name(sys: &System) -> String {
    sys.cpus()
        .first()
        .map(|cpu| cpu.brand().to_string())
        .unwrap_or_else(|| "Unknown CPU".to_string())
}

//
// RAM-related
//
fn get_total_memory(sys: &System) -> u64 {
    sys.total_memory()
}

fn get_used_memory(sys: &System) -> u64 {
    sys.used_memory()
}

fn get_total_swap(sys: &System) -> u64 {
    sys.total_swap()
}

fn get_used_swap(sys: &System) -> u64 {
    sys.used_swap()
}

//
// Disk-related
//
fn get_disk_info() -> Vec<DiskInfo> {
    let disks = Disks::new_with_refreshed_list();
    disks
        .iter()
        .map(|disk| DiskInfo {
            name: disk.name().to_str().unwrap_or("Unknown").to_string(),
            total_space: disk.total_space(),
            available_space: disk.available_space(),
        })
        .collect()
}

//
// GPU-related
//
fn get_gpu_name() -> Option<String> {
    let instance = wgpu::Instance::new(wgpu::InstanceDescriptor {
        backends: wgpu::Backends::all(),
        ..Default::default()
    });
    let adapter = instance
        .enumerate_adapters(wgpu::Backends::all())
        .into_iter()
        .next();
    adapter.map(|ad| ad.get_info().name)
}

fn get_gpu_usage() -> Option<f32> {
    if let Some(usage) = get_nvidia_gpu_usage() {
        return Some(usage);
    }
    if let Some(usage) = get_amd_gpu_usage() {
        return Some(usage);
    }
    if let Some(usage) = get_intel_gpu_usage() {
        return Some(usage);
    }
    None
}

fn get_nvidia_gpu_usage() -> Option<f32> {
    use nvml_wrapper::Nvml;
    let nvml = Nvml::init().ok()?;
    let device = nvml.device_by_index(0).ok()?;
    let utilization = device.utilization_rates().ok()?;
    Some(utilization.gpu as f32)
}

fn get_amd_gpu_usage() -> Option<f32> {
    let output = Command::new("radeontop")
        .arg("-d")
        .arg("-l1")
        .output()
        .ok()?;
    let stdout = String::from_utf8_lossy(&output.stdout);
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

fn get_intel_gpu_usage() -> Option<f32> {
    let output = Command::new("intel_gpu_top")
        .arg("-l")
        .output()
        .ok()?;
    let stdout = String::from_utf8_lossy(&output.stdout);
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

//
// System General Info
//
pub async fn get_system_info() -> SystemInfo {
    // Perform heavy operations in a separate thread
    let system_info = task::spawn_blocking(move || {
        let mut sys = SYSTEM.lock();
        
        // Use refresh_all() to update all system information at once
        sys.refresh_all();
        
        let cpu_usage = get_cpu_usage(&sys);
        let cpu_name = get_cpu_name(&sys);
        let total_memory = get_total_memory(&sys);
        let used_memory = get_used_memory(&sys);
        let total_swap = get_total_swap(&sys);
        let used_swap = get_used_swap(&sys);
        
        let disk_space = get_disk_info();
        let gpu_name = get_gpu_name();
        let gpu_usage = get_gpu_usage();
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
            gpu_usage,
            system_name,
        }
    }).await.unwrap_or_else(|_| SystemInfo {
        total_memory: 0,
        used_memory: 0,
        total_swap: 0,
        used_swap: 0,
        cpu_usage: 0.0,
        disk_space: vec![],
        cpu_name: "Error".to_string(),
        gpu_name: None,
        gpu_usage: None,
        system_name: "Unknown".to_string(),
    });

    system_info
}
