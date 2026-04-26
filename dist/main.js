"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const path_1 = require("path");
const app_module_1 = require("./app.module");
const cors_config_1 = require("./config/cors.config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix("api");
    app.useStaticAssets((0, path_1.join)(process.cwd(), "uploads"), {
        prefix: "/uploads/",
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    app.enableCors((0, cors_config_1.getCorsOptions)());
    const port = Number(process.env.PORT ?? 3001);
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map