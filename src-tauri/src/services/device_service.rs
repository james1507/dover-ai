use serde::Serialize;
use sysinfo::{Disks, System};
use std::process::Command;

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
pub fn get_system_info() -> SystemInfo {
    let mut sys = System::new_all();
    sys.refresh_all();

    SystemInfo {
        total_memory: get_total_memory(&sys),
        used_memory: get_used_memory(&sys),
        total_swap: get_total_swap(&sys),
        used_swap: get_used_swap(&sys),
        cpu_usage: get_cpu_usage(&sys),
        disk_space: get_disk_info(),
        cpu_name: get_cpu_name(&sys),
        gpu_name: get_gpu_name(),
        gpu_usage: get_gpu_usage(),
        system_name: System::name().unwrap_or_else(|| "Unknown OS".to_string()),
    }
}
