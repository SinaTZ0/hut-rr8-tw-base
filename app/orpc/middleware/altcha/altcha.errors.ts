import { errorDataSchema } from "../../errors";

/*===== Shared Challenge Error Contract =====*/

export const altchaErrors = {
  INVALID_ALTCHA: {
    data: errorDataSchema,
    message: "اعتبارسنجی امنیتی نامعتبر یا منقضی شده است.",
  },
};
