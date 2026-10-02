import { z } from "zod";

import { normalizeDigits, normalizeMobile } from "../../lib/form-normalization";
import { genderValues, maritalStatusValues, facultyValues, majorValues } from "./constants";

/*===== Service Field Rules =====*/

// Optional contacts become database nulls only after service validation succeeds.
export const consultationFieldsSchema = z.strictObject({
  gender: z.enum(genderValues, { error: "جنسیت را از گزینه‌های موجود انتخاب کنید." }),
  age: z
    .string()
    .trim()
    .transform(normalizeDigits)
    .refine(
      (value) => /^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= 120,
      "سن باید عددی صحیح بین ۱ تا ۱۲۰ باشد.",
    )
    .transform(Number),
  maritalStatus: z.enum(maritalStatusValues, { error: "وضعیت تأهل را از گزینه‌های موجود انتخاب کنید." }),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(320, "ایمیل نمی‌تواند بیشتر از ۳۲۰ نویسه باشد.")
    .refine((value) => value === "" || z.email().safeParse(value).success, "نشانی ایمیل معتبر نیست."),
  mobile: z
    .string()
    .trim()
    .transform(normalizeMobile)
    .refine((value) => value === "" || /^09\d{9}$/.test(value), "شماره همراه معتبر نیست."),
  faculty: z.enum(facultyValues, { error: "دانشکده را از گزینه‌های موجود انتخاب کنید." }),
  major: z.enum(majorValues, { error: "رشته تحصیلی را از گزینه‌های موجود انتخاب کنید." }),
  question: z
    .string()
    .trim()
    .min(10, "پرسش شما باید حداقل ۱۰ نویسه باشد.")
    .max(5000, "پرسش شما نمی‌تواند بیشتر از ۵۰۰۰ نویسه باشد."),
});
