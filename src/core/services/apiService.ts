import axios from 'axios';
import { appService } from "./appService";

class ApiService {
    async removeBackground(imageUrl: string) {
        try {
            const response = await axios.post(`http://127.0.0.1:5000/remove-bg`, {
                url: imageUrl
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export const apiService = new ApiService();
