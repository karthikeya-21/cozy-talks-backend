"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COZY_BOT_EMAIL = exports.COZY_BOT_NAME = void 0;
exports.isCozyBotEmail = isCozyBotEmail;
exports.COZY_BOT_NAME = "Cozy Bot";
exports.COZY_BOT_EMAIL = "cozybot@cozytalks.dev";
function isCozyBotEmail(email) {
    return email.trim().toLowerCase() === exports.COZY_BOT_EMAIL;
}
//# sourceMappingURL=cozy-bot.constants.js.map