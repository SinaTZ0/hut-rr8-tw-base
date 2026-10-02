# Online Consultation Form

## Purpose

Let visitors submit a question for referral to the appropriate university unit or advisor. This document defines the submission fields, accepted values, validation rules, and consultation process.

This document does not define database persistence, server actions, CAPTCHA verification, tracking-code generation, or email/notification delivery.

## Submission fields

Use these field names as the contract for validation and future submission wiring.

| Name            | Persian name      | Required | Default   |
| --------------- | ----------------- | -------- | --------- |
| `gender`        | جنسیت             | Yes      | `unknown` |
| `age`           | سن                | Yes      | Empty     |
| `maritalStatus` | وضعیت تأهل        | Yes      | `unknown` |
| `email`         | پست الکترونیکی    | No       | Empty     |
| `mobile`        | شماره همراه       | No       | Empty     |
| `faculty`       | نام دانشکده       | Yes      | `unknown` |
| `major`         | نام رشته تحصیلی   | Yes      | `unknown` |
| `question`      | پرسش شما          | Yes      | Empty     |

### Accepted values

`unknown` (نامعین) is a valid value for each of the following fields. Persian meanings are provided alongside the submission values.

#### Gender (`gender`)

| Value     | Persian meaning |
| --------- | --------------- |
| `unknown` | نامعین          |
| `male`    | مرد             |
| `female`  | زن              |

#### Marital status (`maritalStatus`)

| Value     | Persian meaning |
| --------- | --------------- |
| `unknown` | نامعین          |
| `single`  | مجرد            |
| `married` | متأهل           |

#### Faculty (`faculty`)

| Value                   | Persian meaning |
| ----------------------- | --------------- |
| `unknown`               | نامعین          |
| `electrical-computer`   | برق و کامپیوتر  |
| `technical-engineering` | فنی و مهندسی    |
| `basic-sciences`        | علوم پایه       |

#### Major (`major`)

| Value                 | Persian meaning |
| --------------------- | --------------- |
| `unknown`             | نامعین          |
| `computer`            | کامپیوتر        |
| `electrical`          | برق             |
| `industrial`          | صنایع           |
| `polymer`             | پلیمر           |
| `civil`               | عمران           |
| `mechanical`          | مکانیک          |
| `engineering-physics` | فیزیک مهندسی    |
| `organic-chemistry`   | شیمی آلی        |

## Validation rules

Validate submissions using these rules unless the new project's product requirements override them:

| Field           | Rule                                                                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `gender`        | Must be one of the accepted gender values                                                                                                   |
| `age`           | Required; accept Persian/Arabic digits after normalization; value must be between 1 and 120                                                  |
| `maritalStatus` | Must be one of the accepted marital status values                                                                                           |
| `email`         | Optional; valid email; maximum 320 characters                                                                                               |
| `mobile`        | Optional; accept Iranian mobile format `09xxxxxxxxx` or `+989xxxxxxxxx`; allow Persian/Arabic digits and spaces/hyphens before normalization |
| `faculty`       | Must be one of the accepted faculty values                                                                                                  |
| `major`         | Must be one of the accepted major values                                                                                                    |
| `question`      | Required; 10–5000 characters after trimming                                                                                                 |

### Age entry

The age field accepts Latin, Persian, and Arabic digits and immediately displays them as Persian digits. Typing or pasting an edit containing any nondigit character rejects the entire edit and preserves the previous value. Clearing the field is allowed; required and range validation runs on the first blur, subsequent edits, and submission without clamping the entered value. The submitted age remains a string normalized to Latin digits.

### Mobile entry

The mobile field accepts only Latin, Persian, and Arabic digits and requests a numeric keyboard. Typing or pasting an edit containing letters, spaces, or symbols rejects the entire edit and preserves the previous value. Clearing the optional field is allowed. Enter the local `09xxxxxxxxx` format; submitted digits normalize to Latin digits.

### Client-side validation timing

Validate fields on the first blur, then on each edit, and again when the user submits. Delay displaying validation errors by 300 ms to avoid flicker during typing; clear corrected errors immediately. Submission validation remains immediate.

## Consultation process

- Academic information helps refer the question to the appropriate person or unit.
- Submitted questions are registered in the university system for review.
- A tracking code supports later follow-up after successful submission.
- Submitted information is used only to review and respond to the question.
