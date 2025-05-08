mod services;
use services::device_service;
use services::docker_service;
use services::file_service;
use services::log_service;
use std::default::Default;
use std::env;


/// There are all function that are used for docker

#[tauri::command]
async fn pull_and_run_docker_image(
    image: String,
    app_handle: tauri::AppHandle,
) -> Result<String, String> {
    docker_service::pull_and_run_docker_image(image, app_handle).await
}

#[tauri::command]
async fn copy_from_docker(
    container_name: String,
    container_path: String,
) -> Result<String, String> {
    docker_service::copy_from_docker(container_name, container_path).await
}

/// There are all function that are used for file

#[tauri::command]
async fn read_image_file(file_path: String) -> Result<String, String> {
    file_service::read_image_file(file_path).await
}

/// There are all function that are used for log

#[tauri::command]
fn log_message(message: String) {
    log_service::log_message(message);
}

/// There are all function that are used for device

#[tauri::command]
async fn get_system_info() -> device_service::SystemInfo {
    device_service::get_system_info().await
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
