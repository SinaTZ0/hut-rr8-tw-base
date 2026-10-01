# Complaints and Feedback Form

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

### Submission behavior

Automatic mutation retries are disabled. A successful submission returns its tracking code, and an accepted security
challenge cannot create another submission. The browser RPC client aborts requests after 30 seconds.

### RPC error data

Every procedure error uses `data: { errors: Record<string, string>, fields: Record<string, string> }`.
The outermost router middleware standardizes input/output validation errors, feature middleware failures,
and handler exceptions. Malformed HTTP bodies are handled by oRPC before procedure middleware runs;
the form uses its general fallback message when a response has no standardized data.
The `fields` map contains field names and Persian validation messages, including `altcha` for security
challenge errors. Domain validation returns all invalid fields, keeping the first message for each field.

The `errors` map contains diagnostic titles and technical messages. When populated, the form shows a
general Persian destructive alert containing a collapsed technical-details accordion with a button to copy this map as JSON.
Field errors and technical diagnostics display independently, including together when both maps have entries.
Retries clear prior diagnostics; failures preserve entered form values.

Server failures include the RPC code, procedure, debugging guidance, and an error ID correlated with
server logs. Database failures additionally include a recognized availability code. Raw exceptions,
stack traces, database queries, and submitted values are not automatically returned to the browser.

### Shared validation

`validation.ts` owns the field rules and digit, mobile, and email normalization shared by the
browser and service. The route adds its challenge field; the service converts empty optional values into database
nulls. The API contract validates the request shape, and the service validates domain values.

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
