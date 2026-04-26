"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeModule = void 0;
const common_1 = require("@nestjs/common");
const messages_module_1 = require("../messages/messages.module");
const chat_gateway_1 = require("./chat.gateway");
const realtime_events_service_1 = require("./realtime-events.service");
let RealtimeModule = class RealtimeModule {
};
exports.RealtimeModule = RealtimeModule;
exports.RealtimeModule = RealtimeModule = __decorate([
    (0, common_1.Module)({
        imports: [(0, common_1.forwardRef)(() => messages_module_1.MessagesModule)],
        providers: [chat_gateway_1.ChatGateway, realtime_events_service_1.RealtimeEventsService],
        exports: [realtime_events_service_1.RealtimeEventsService],
    })
], RealtimeModule);
//# sourceMappingURL=realtime.module.js.map