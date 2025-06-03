export type JWTPayloadType = {
    id: string;
    role: string;
    deviceId?: string;
};
export interface SalesData {
    [key: string]: string | number;
    sales: number;
}
