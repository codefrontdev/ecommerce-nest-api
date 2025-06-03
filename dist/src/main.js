"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("tsconfig-paths/register");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const validation_pipe_1 = require("./@core/pipes/validation.pipe");
const cookie_parser_1 = require("cookie-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: [
            'http://localhost:5173',
            'http://localhost:3000',
            'http://192.168.1.4:5173',
            'http://192.168.1.6:3000',
            'https://ecommerce-dash-app.netlify.app',
        ],
        allowedHeaders: 'Content-Type, Authorization',
        credentials: true,
    });
    app.use((0, cookie_parser_1.default)());
    app.useGlobalPipes(new validation_pipe_1.ValidationPipe());
    if (process.env.NODE_ENV !== 'production') {
        await app.listen(3000);
    }
    return app;
}
bootstrap();
//# sourceMappingURL=main.js.map