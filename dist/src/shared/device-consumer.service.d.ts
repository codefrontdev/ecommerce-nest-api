import { DeviceHistoryService } from 'src/deviceHistory/device-history.service';
export declare class DeviceConsumerService {
    private readonly connection;
    private readonly deviceHistoryService;
    private channel;
    constructor(connection: any, deviceHistoryService: DeviceHistoryService);
    private consumeMessages;
}
