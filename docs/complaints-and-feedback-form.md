# Complaints and Feedback Form

## Purpose

Build the Persian, right-to-left form UI for `app/routes/complaints-and-feedback.tsx`.

The page lets visitors submit a complaint, suggestion, or criticism to the university. This brief documents the visible form, its copy, fields, select options, client-side feedback, and responsive behavior.

This document does not define database persistence, server actions, CAPTCHA verification, tracking-code generation, or email/notification delivery.

## Page language and layout

- Set the document/page direction to `rtl` and the language to Persian (`fa`).
- Render the existing shared site header above the page and the shared footer/floating links below it when those components exist in the new project.
- Keep the form accessible from the page's main content using a skip link such as `پرش به محتوای اصلی`.
- Use a calm university visual style: deep teal/blue branding, teal accents, gold highlights, surface-colored cards, rounded corners, and clear focus states.
- Use a two-column desktop layout:
  - Main column: the form card.
  - Secondary column: the request-follow-up guide.
- At widths below approximately `900px`, stack the columns and place the guide before the form.
- At widths below approximately `640px`, make the form fields and action area single-column and make the submit button full width.

## Visible page copy

### Hero

- Eyebrow: `سامانه ارتباط با دانشگاه`
- Heading: `ثبت شکایات و پیشنهادات`
- Lead: `دیدگاه‌ها و تجربه‌های خود را با ما در میان بگذارید تا برای بهبود خدمات دانشگاه بررسی و پیگیری شود.`

### Form section

- Eyebrow: `فرم ارتباط`
- Heading: `پیام خود را ثبت کنید`
- Intro: `لطفاً اطلاعات زیر را با دقت وارد کنید. موارد ستاره‌دار الزامی هستند.`
- Form card heading: `مشخصات درخواست`
- Form card description: `اطلاعات تماس اختیاری است، اما در صورت درج می‌تواند به پیگیری بهتر کمک کند.`
- Optional marker: `(اختیاری)`
- Required marker: `*`
- Required-fields note: `* تکمیل این موارد الزامی است.`
- Submit button: `ثبت و ارسال پیام`

## Form fields

Use the field names and IDs below exactly so the new form has a stable contract for validation and future submission wiring.

| Name / ID      | Control            | Persian label         | Required | Placeholder / notes                                                                   |
| -------------- | ------------------ | --------------------- | -------- | ------------------------------------------------------------------------------------- |
| `firstName`    | Text input         | `نام`                 | Yes      | Use `given-name` autocomplete.                                                        |
| `lastName`     | Text input         | `نام خانوادگی`        | No       | Use `family-name` autocomplete.                                                       |
| `mobile`       | Telephone input    | `شماره همراه`         | No       | Use `tel` input mode, left-to-right direction, and placeholder `۰۹۱۲۱۲۳۴۵۶۷`.         |
| `email`        | Email input        | `ایمیل`               | No       | Use left-to-right direction, email autocomplete, and placeholder `example@hut.ac.ir`. |
| `studentId`    | Numeric text input | `شماره دانشجویی`      | No       | Use numeric input mode and left-to-right direction.                                   |
| `department`   | Select             | `واحد یا مسئول مرتبط` | Yes      | Initial option must be `انتخاب کنید` with an empty value.                             |
| `feedbackType` | Select             | `نوع پیام`            | Yes      | Initial option must be `انتخاب کنید` with an empty value.                             |
| `message`      | Textarea           | `شرح پیام`            | Yes      | Placeholder: `شکایت، پیشنهاد یا انتقاد خود را بنویسید…`.                              |

### Select: department

The initial empty option is:

```text
value: ""
label: انتخاب کنید
```

Render these options in this order. For this select, each option's value is the same Persian string as its label.

| Value and label                             |
| ------------------------------------------- |
| `رسیدگی به شکایات`                          |
| `ریاست دانشگاه`                             |
| `مدیر گروه نظارت و ارزیابی`                 |
| `معاونت اداری و مالی`                       |
| `رئیس نهاد دانشگاه`                         |
| `معاون آموزشی و پژوهشی`                     |
| `مدیر حراست`                                |
| `مدیر آموزش`                                |
| `مدیر گروه ریاضی`                           |
| `مدیر گروه مهندسی برق- مخابرات و الکترونیک` |
| `مدیر گروه مهندسی برق - کنترل و قدرت`       |
| `مدیر گروه عمران`                           |
| `مدیر گروه معارف`                           |
| `مدیر گروه صنایع`                           |
| `مدیر گروه مهندسی کامپیوتر`                 |
| `مدیر گروه شیمی`                            |

### Select: feedback type

The initial empty option is:

```text
value: ""
label: انتخاب کنید
```

Render these options in this order:

| Value        | Persian label          |
| ------------ | ---------------------- |
| `complaint`  | `شکایات`               |
| `suggestion` | `پیشنهادات و انتقادات` |

## Client-side form behavior

- Start all fields empty, including both selects.
- Show `(اختیاری)` beside optional field labels and `*` beside required field labels.
- Validate on blur and again when the user submits.
- Keep each validation message directly below its control.
- Mark invalid controls with `aria-invalid="true"` and connect them to their error message through `aria-describedby`.
- Preserve user-entered values when validation fails.
- Use a visible focus ring for keyboard users.
- Do not use placeholder text as a replacement for a visible label.
- Keep mobile, email, student ID, and message controls left-to-right where that improves readability; keep their labels and surrounding layout right-to-left.

### Recommended validation rules

These are the current UI validation expectations and should be reproduced unless the new project's product requirements override them:

| Field          | Rule                                                                                                                                         | Suggested Persian error                                                               |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `firstName`    | Required; maximum 100 characters                                                                                                             | `وارد کردن نام الزامی است.` / `نام نمی‌تواند بیشتر از ۱۰۰ نویسه باشد.`                |
| `lastName`     | Optional; maximum 100 characters                                                                                                             | `نام خانوادگی نمی‌تواند بیشتر از ۱۰۰ نویسه باشد.`                                     |
| `mobile`       | Optional; accept Iranian mobile format `09xxxxxxxxx` or `+989xxxxxxxxx`; allow Persian/Arabic digits and spaces/hyphens before normalization | `شماره همراه معتبر نیست.`                                                             |
| `email`        | Optional; valid email; maximum 320 characters                                                                                                | `نشانی ایمیل معتبر نیست.` / `ایمیل نمی‌تواند بیشتر از ۳۲۰ نویسه باشد.`                |
| `studentId`    | Optional; 3–30 digits after digit normalization                                                                                              | `شماره دانشجویی معتبر نیست.`                                                          |
| `department`   | Must be one of the listed department options                                                                                                 | `واحد مورد نظر را انتخاب کنید.`                                                       |
| `feedbackType` | Must be `complaint` or `suggestion`                                                                                                          | `نوع پیام را انتخاب کنید.`                                                            |
| `message`      | Required; 10–5000 characters                                                                                                                 | `شرح پیام باید حداقل ۱۰ نویسه باشد.` / `شرح پیام نمی‌تواند بیشتر از ۵۰۰۰ نویسه باشد.` |

## Request-follow-up guide

Place a visually distinct guide card beside the form:

- Eyebrow: `راهنمای ثبت درخواست`
- Heading: `درخواست شما چگونه پیگیری می‌شود؟`
- Intro: `پس از ارسال موفق، کد پیگیری یکتای خود را مشاهده و ذخیره کنید.`

Show these three numbered steps:

1. **فرم را کامل کنید** — `موضوع و واحد مرتبط را انتخاب کنید و شرح روشنی از پیام خود بنویسید.`
2. **پیام ارسال می‌شود** — `درخواست شما در سامانه دانشگاه ثبت و برای بررسی آماده می‌شود.`
3. **کد پیگیری را نگه دارید** — `کد نمایش‌داده‌شده را برای مراجعات بعدی کپی کنید.`

Privacy note: `اطلاعات شما فقط برای بررسی و پیگیری درخواست ثبت‌شده استفاده می‌شود.`
