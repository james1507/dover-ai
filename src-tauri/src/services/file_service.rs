use base64::Engine as _;

pub async fn read_image_file(file_path: String) -> Result<String, String> {
    use std::fs;
    // Read the file from the system
    let data =
        fs::read(&file_path).map_err(|e| format!("Failed to read file {}: {}", file_path, e))?;
    // Encode to base64 using the STANDARD engine
    let encoded = base64::engine::general_purpose::STANDARD.encode(&data);
    Ok(encoded)
}