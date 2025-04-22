export interface RegisterPayload {
    name: string;
    age: number;
    email: string;
    address: string;
    role: "admin" | "user";
    password: string;
    balance: number;
    phone_number: number;
}

export interface UserData {
    id: number;
    name: string;
    age: number;
    email: string;
    address: string;
    role: string;
    balance: number;
    phone_number: number;
}

export interface AuthResponse {
    status: "success" | "error";
    code: number;
    msg: string;
    data: {
        access_token: string;
        refresh_token: string;
        user: UserData;
    } | null;
}