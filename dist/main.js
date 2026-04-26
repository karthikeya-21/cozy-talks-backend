"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const path_1 = require("path");
const app_module_1 = require("./app.module");
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
    app.enableCors({
        origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
        credentials: true,
    });
    const port = Number(process.env.PORT ?? 3001);
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map