"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("tsconfig-paths/register");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const validation_pipe_1 = require("./pipes/validation.pipe");
const cookieParser = require("cookie-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api/v1');
    app.enableCors({
        origin: [
            'http://localhost:5173',
            'http://localhost:3000',
            'http://192.168.1.4:5173',
            'http://192.168.1.6:3000',
            'https://ecommerce-dash-app.netlify.app',
            'https://ecommerce-demo-v1.netlify.app/',
        ],
        allowedHeaders: 'Content-Type, Authorization',
        credentials: true,
    });
    app.use(cookieParser());
    app.useGlobalPipes(new validation_pipe_1.ValidationPipe());
    await app.listen(5000, '0.0.0.0');
}
bootstrap();
//# sourceMappingURL=main.js.map