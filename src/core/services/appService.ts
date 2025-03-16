import { invoke } from "@tauri-apps/api/core";

class AppService {
    async appLog(message: string): Promise<string> {
        try {
            const data = await invoke<string>("log_message", { message });
            return data;
        } catch (error) {
            console.error("Error reading image file:", error);
            throw error;
        }
    }
}

export const appService = new AppService();