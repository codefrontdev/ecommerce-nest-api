export declare class RabbitMQService {
    private readonly connection;
    private channel;
    constructor(connection: any);
    sendMessage(queue: string, message: any): Promise<void>;
}
