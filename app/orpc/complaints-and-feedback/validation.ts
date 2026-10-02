import { z } from "zod";

import { normalizeDigits, normalizeMobile } from "../../lib/form-normalization";

import { departmentValues, feedbackTypeValues } from "./constants";

/*===== Service Field Rules =====*/

// Empty optional fields stay strings here; only the service converts them to database nulls.
export const complaintFieldsSchema = z.strictObject({
  firstName: z.string().trim().min(1, "وارد کردن نام الزامی است.").max(100, "نام نمی‌تواند بیشتر از ۱۰۰ نویسه باشد."),
  lastName: z.string().trim().max(100, "نام خانوادگی نمی‌تواند بیشتر از ۱۰۰ نویسه باشد."),
  mobile: z
    .string()
    .trim()
    .transform(normalizeMobile)
    .refine((value) => value === "" || /^09\d{9}$/.test(value), "شماره همراه معتبر نیست."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(320, "ایمیل نمی‌تواند بیشتر از ۳۲۰ نویسه باشد.")
    .refine((value) => value === "" || z.email().safeParse(value).success, "نشانی ایمیل معتبر نیست."),
  studentId: z
    .string()
    .trim()
    .transform(normalizeDigits)
    .refine((value) => value === "" || /^\d{3,30}$/.test(value), "شماره دانشجویی معتبر نیست."),
  department: z
    .string()
    .trim()
    .refine(
      (value) => departmentValues.includes(value as (typeof departmentValues)[number]),
      "واحد مورد نظر را انتخاب کنید.",
    ),
  feedbackType: z
    .string()
    .trim()
    .refine(
      (value) => feedbackTypeValues.includes(value as (typeof feedbackTypeValues)[number]),
      "نوع پیام را انتخاب کنید.",
    ),
  message: z
    .string()
    .trim()
    .min(10, "شرح پیام باید حداقل ۱۰ نویسه باشد.")
    .max(5000, "شرح پیام نمی‌تواند بیشتر از ۵۰۰۰ نویسه باشد."),
});
