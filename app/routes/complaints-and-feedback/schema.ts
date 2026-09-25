import { z } from "zod";

import { departmentValues, feedbackTypeValues } from "~/orpc/complaints-and-feedback/complaints-and-feedback.constants";

/*===== Input Normalization =====*/

function normalizeDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - "۰".charCodeAt(0)))
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - "٠".charCodeAt(0)));
}

function normalizeMobile(value: string) {
  const digits = normalizeDigits(value).replace(/[\s-]/g, "");
  return digits.startsWith("+98") ? `0${digits.slice(3)}` : digits;
}

/*===== Form Validation =====*/

export const complaintsAndFeedbackFormSchema = z.strictObject({
  firstName: z.string().trim().min(1, "وارد کردن نام الزامی است.").max(100, "نام نمی‌تواند بیشتر از ۱۰۰ نویسه باشد."),
  lastName: z.string().trim().max(100, "نام خانوادگی نمی‌تواند بیشتر از ۱۰۰ نویسه باشد."),
  mobile: z
    .string()
    .trim()
    .refine((value) => value === "" || /^09\d{9}$/.test(normalizeMobile(value)), "شماره همراه معتبر نیست."),
  email: z
    .string()
    .trim()
    .max(320, "ایمیل نمی‌تواند بیشتر از ۳۲۰ نویسه باشد.")
    .refine((value) => value === "" || z.email().safeParse(value).success, "نشانی ایمیل معتبر نیست."),
  studentId: z
    .string()
    .trim()
    .refine((value) => value === "" || /^\d{3,30}$/.test(normalizeDigits(value)), "شماره دانشجویی معتبر نیست."),
  department: z
    .string()
    .refine(
      (value) => departmentValues.includes(value as (typeof departmentValues)[number]),
      "واحد مورد نظر را انتخاب کنید.",
    ),
  feedbackType: z
    .string()
    .refine(
      (value) => feedbackTypeValues.includes(value as (typeof feedbackTypeValues)[number]),
      "نوع پیام را انتخاب کنید.",
    ),
  message: z
    .string()
    .trim()
    .min(10, "شرح پیام باید حداقل ۱۰ نویسه باشد.")
    .max(5000, "شرح پیام نمی‌تواند بیشتر از ۵۰۰۰ نویسه باشد."),
  altcha: z.string().min(1, "لطفاً تأیید امنیتی را انجام دهید."),
});

export type ComplaintsAndFeedbackFormValues = z.input<typeof complaintsAndFeedbackFormSchema>;

export const emptyComplaintsAndFeedbackForm: ComplaintsAndFeedbackFormValues = {
  firstName: "",
  lastName: "",
  mobile: "",
  email: "",
  studentId: "",
  department: "",
  feedbackType: "",
  message: "",
  altcha: "",
};
