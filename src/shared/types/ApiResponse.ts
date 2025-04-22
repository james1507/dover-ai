export interface BaseApiResponse<T = any> {
    status: string;
    code: number;  
    msg: string;  
    data: T;       
}