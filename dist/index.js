"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const node_1 = require("vercel/node");
const core_1 = require("@nestjs/core");
require("tsconfig-paths/register");
const app_module_1 = require("./src/app.module");
let cachedServer;
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    await app.init();
    return app;
}
async function handler(req, res, callback) {
    if (!cachedServer) {
        const app = await bootstrap();
        const expressInstance = app.getHttpAdapter().getInstance();
        cachedServer = (0, node_1.createServer)(expressInstance);
    }
    return (0, node_1.proxy)(cachedServer, req, res, callback);
}
//# sourceMappingURL=index.js.map