import axios from 'axios';
import { appService } from "./appService";

class ApiService {

    async removeBackground(imageUrl: string) {
        try {
            const response = await axios.post(`http://127.0.0.1:5000/remove-bg`, {
                url: imageUrl
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            appService.appLog(`API response: ${JSON.stringify(response.data)}`);

            return response.data;
        } catch (error) {

            appService.appLog(`API error: ${error}`);
            throw error;
        }
    }
}

export const apiService = new ApiService();
