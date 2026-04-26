export const COZY_BOT_NAME = "Cozy Bot";
export const COZY_BOT_EMAIL = "cozybot@cozytalks.dev";

export function isCozyBotEmail(email: string) {
  return email.trim().toLowerCase() === COZY_BOT_EMAIL;
}
