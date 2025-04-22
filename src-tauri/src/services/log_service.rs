pub fn log_message(message: String) {
    // Chuyển message về chữ thường để so sánh
    let lower = message.to_lowercase();
    if lower.contains("error") || lower.contains("fail") || lower.contains("lỗi") {
        // Màu đỏ
        println!("\x1b[1;31m[ERROR]\x1b[0m \x1b[1;31m{}\x1b[0m", message);
    } else {
        // Màu vàng/xanh lá
        println!("\x1b[1;33m[LOG]\x1b[0m \x1b[1;32m{}\x1b[0m", message);
    }
}
