import { z } from "zod";

import { normalizeDigits, normalizeMobile } from "~/lib/form-normalization";

import { departmentValues, feedbackTypeValues } from "~/orpc/complaints-and-feedback/constants";

/*===== Form Validation =====*/

// Form rules are intentionally independent of service validation so each boundary can evolve separately.
export const complaintsAndFeedbackFormSchema = z.strictObject({
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
  altcha: z.string().min(1, "لطفاً تأیید امنیتی را انجام دهید.").max(8192),
});

/*===== Form Values =====*/

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
