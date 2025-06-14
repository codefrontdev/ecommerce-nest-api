import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AddAddressFieldsToOrders1749476099150 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
