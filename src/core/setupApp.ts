import { store } from "@core/store/store";
import { setupAxiosInterceptors } from "@core/network/axios_network";

export function setupApp() {
  setupAxiosInterceptors(store);
  // Có thể thêm các logic khởi tạo khác ở đây sau này
} 