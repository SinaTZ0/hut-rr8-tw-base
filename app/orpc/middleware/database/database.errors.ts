import { errorDataSchema } from "../../errors";

/*===== Shared Database Error Contract =====*/

export const databaseErrors = {
  DATABASE_UNAVAILABLE: {
    data: errorDataSchema,
    message:
      "پایگاه داده در حال حاضر در دسترس نیست. لطفاً کمی بعد دوباره تلاش کنید. اگر مشکل ادامه داشت، به پشتیبانی اطلاع دهید.",
  },
};
