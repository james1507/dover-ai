import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

interface ProgressUpdate {
    message: string;
    percentage: number;
}

class DockerService {
    async pullAndRunImage(
        image: string,
        onProgress?: (progress: ProgressUpdate) => void
    ): Promise<string> {
        try {
            if (onProgress) {
                const unlisten = await listen<ProgressUpdate>("docker_progress", (event) => {
                    onProgress(event.payload);
                });

                const containerId = await invoke<string>("pull_and_run_docker_image", { image });
                console.log("Container started with ID:", containerId);
                unlisten();
                return containerId;
            } else {
                const containerId = await invoke<string>("pull_and_run_docker_image", { image });
                console.log("Container started with ID:", containerId);
                return containerId;
            }
        } catch (error) {
            console.error("Error pulling or running Docker image:", error);
            throw error;
        }
    }

    async copyFromDocker(containerName: string, containerPath: string): Promise<string> {
        try {
            const outputPath = await invoke<string>("copy_from_docker", {
                containerName,
                containerPath,
            });
            console.log("File copied from container:", outputPath);
            return outputPath;
        } catch (error) {
            console.error("Error copying file from Docker container:", error);
            throw error;
        }
    }

    async readImageFile(filePath: string): Promise<string> {
        try {
            const base64Image = await invoke<string>("read_image_file", { filePath });
            return base64Image;
        } catch (error) {
            console.error("Error reading image file:", error);
            throw error;
        }
    }
}

export const dockerService = new DockerService();