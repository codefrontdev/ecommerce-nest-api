"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    const isProd = configService.get('NODE_ENV') === 'production';
                    const databaseUrl = configService.get('DB_URL');
                    return isProd
                        ? {
                            type: 'postgres',
                            url: databaseUrl,
                            ssl: { rejectUnauthorized: false },
                            autoLoadEntities: true,
                            synchronize: true,
                            logging: false,
                        }
                        : {
                            type: 'postgres',
                            host: configService.get('DB_HOST', 'localhost'),
                            port: configService.get('DB_PORT', 5432),
                            username: configService.get('DB_USER', 'postgres'),
                            password: configService.get('DB_PASSWORD', 'password'),
                            database: configService.get('DB_NAME', 'ecommerce_db'),
                            autoLoadEntities: true,
                            synchronize: true,
                            logging: true,
                        };
                },
            }),
        ],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map