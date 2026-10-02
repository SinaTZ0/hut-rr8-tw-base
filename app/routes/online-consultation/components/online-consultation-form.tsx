import { zodResolver } from "@hookform/resolvers/zod";
import { ORPCError } from "@orpc/client";
import { useMutation } from "@tanstack/react-query";
import { LoaderCircle, Send } from "lucide-react";
import { useCallback, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { useController, useForm, type FieldError as ReactHookFormFieldError, type FieldPath } from "react-hook-form";

import { SecurityChallenge, type SecurityChallengeHandle } from "~/components/forms/security-challenge";
import { SubmissionError, type SubmissionErrorContent } from "~/components/forms/submission-error";
import { SubmissionSuccess } from "~/components/forms/submission-success";
import styles from "~/components/forms/submission-view.module.css";
import { Button } from "~/components/primitive/button/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/primitive/card/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "~/components/primitive/field/field";
import { Input } from "~/components/primitive/input/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/primitive/select/select";
import { Textarea } from "~/components/primitive/textarea/textarea";
import { normalizeDigits } from "~/lib/form-normalization";
import { orpc } from "~/orpc/client";
import {
  genderValues,
  genderLabels,
  maritalStatusValues,
  maritalStatusLabels,
  facultyValues,
  facultyLabels,
  majorValues,
  majorLabels,
} from "~/orpc/online-consultation/constants";
import { errorDataSchema, type ErrorData } from "~/orpc/errors";

import {
  onlineConsultationFormSchema,
  emptyOnlineConsultationForm,
  type OnlineConsultationFormValues,
} from "../schema";

/*===== Field Presentation =====*/

function getFieldErrorProps({ id, error }: { id: string; error?: ReactHookFormFieldError }) {
  return {
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? `${id}-error` : undefined,
  };
}

function RequiredMarker() {
  return (
    <span className="text-destructive" aria-hidden="true">
      *
    </span>
  );
}

function OptionalMarker() {
  return <span className="text-xs font-normal text-muted-foreground">(اختیاری)</span>;
}

function FormField({
  id,
  label,
  optional = false,
  error,
  children,
  className,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: ReactHookFormFieldError;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Field data-invalid={Boolean(error)} className={className}>
      <FieldLabel id={`${id}-label`} htmlFor={id}>
        {label}
        {optional ? <OptionalMarker /> : <RequiredMarker />}
      </FieldLabel>
      {children}
      <FieldError id={`${id}-error`} errors={error ? [error] : undefined} />
    </Field>
  );
}

// Controllers register first; validation focus follows the visible field order instead.
const formFieldOrder = [
  "gender",
  "age",
  "maritalStatus",
  "email",
  "mobile",
  "faculty",
  "major",
  "question",
  "altcha",
] satisfies FieldPath<OnlineConsultationFormValues>[];

/*===== Submission Form =====*/

export function OnlineConsultationForm() {
  const [submissionError, setSubmissionError] = useState<SubmissionErrorContent | null>(null);
  const [submissionPending, setSubmissionPending] = useState(false);
  const challengeRef = useRef<SecurityChallengeHandle>(null);
  const submissionLock = useRef(false);
  const form = useForm<OnlineConsultationFormValues>({
    defaultValues: emptyOnlineConsultationForm,
    // Start validation on blur, then recheck edits without making the user leave the field.
    mode: "onTouched",
    delayError: 300,
    resolver: zodResolver(onlineConsultationFormSchema),
    shouldFocusError: false,
  });
  const challenge = useController({ control: form.control, name: "altcha" });
  const {
    field: { ref: genderRef, ...genderField },
  } = useController({ control: form.control, name: "gender" });
  const { field: ageField } = useController({ control: form.control, name: "age" });
  const { field: mobileField } = useController({ control: form.control, name: "mobile" });
  const {
    field: { ref: maritalStatusRef, ...maritalStatusField },
  } = useController({ control: form.control, name: "maritalStatus" });
  const {
    field: { ref: facultyRef, ...facultyField },
  } = useController({ control: form.control, name: "faculty" });
  const {
    field: { ref: majorRef, ...majorField },
  } = useController({ control: form.control, name: "major" });
  const mutation = useMutation(orpc.onlineConsultation.submit.mutationOptions());

  const updateChallenge = useCallback(
    (payload: string) => {
      // Reset events can arrive after setError; keep the server message until a new proof or submission.
      form.setValue("altcha", payload, { shouldDirty: true, shouldValidate: Boolean(payload) });
      if (payload) form.clearErrors("altcha");
    },
    [form],
  );

  /*------ Age Editing ------*/

  /** Keeps age digit-only and Persian while retaining the selection during digit conversion. */
  function handleAgeChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const digits = normalizeDigits(input.value);

    // Reject the whole edit so a pasted decimal cannot silently become another age.
    if (!/^\d*$/.test(digits)) {
      input.value = ageField.value;
      return;
    }

    const value = digits.replace(/[0-9]/g, (digit) => String.fromCharCode("۰".charCodeAt(0) + Number(digit)));
    if (input.value !== value) {
      const { selectionStart, selectionEnd, selectionDirection } = input;
      // Rewrite before notifying the form: same-value edits still normalize, and
      // React need not rewrite the DOM value and move the cursor to the end.
      input.value = value;
      input.setSelectionRange(selectionStart, selectionEnd, selectionDirection ?? undefined);
    }
    ageField.onChange(value);
  }

  /*------ Mobile Editing ------*/

  function handleMobileChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;

    // Accept Persian, Arabic, and Latin digits; reject non-digit typing and pastes.
    if (!/^\d*$/.test(normalizeDigits(input.value))) {
      input.value = mobileField.value;
      return;
    }

    mobileField.onChange(input.value);
  }

  /*------ Field Error Handling ------*/

  function focusFirstInvalidField(fields: string[]) {
    const firstInvalidField = formFieldOrder.find((field) => field !== "altcha" && fields.includes(field));
    if (firstInvalidField) form.setFocus(firstInvalidField);
  }

  function applyServerFieldErrors(fields: ErrorData["fields"]) {
    const invalidFields = formFieldOrder.filter((field) => Object.hasOwn(fields, field));
    if (Object.hasOwn(fields, "altcha")) challengeRef.current?.reset();

    for (const field of invalidFields) {
      form.setError(field, { type: "server", message: fields[field] });
    }
    // Form order determines focus, rather than the server's object entry order.
    focusFirstInvalidField(invalidFields);
    return invalidFields.length > 0;
  }

  function handleSubmissionError(error: unknown) {
    const parsed = errorDataSchema.safeParse(error instanceof ORPCError ? error.data : undefined);
    if (!parsed.success) {
      setSubmissionError({ message: "ارسال پرسش انجام نشد. لطفاً اتصال خود را بررسی کنید و دوباره تلاش کنید." });
      return;
    }

    const { fields, errors: diagnostics } = parsed.data;
    const hasFieldErrors = applyServerFieldErrors(fields);

    if (Object.keys(diagnostics).length > 0) {
      setSubmissionError({ message: "ارسال پرسش انجام نشد. لطفاً دوباره تلاش کنید.", errors: diagnostics });
    } else if (!hasFieldErrors || submissionError) {
      // Empty data or unfamiliar field names must not leave a failed submission silent.
      // A retry with only field errors still replaces the previous card's stale diagnostics.
      setSubmissionError({ message: "ارسال پرسش انجام نشد. لطفاً دوباره تلاش کنید." });
    }
  }

  /*------ Submission Lifecycle ------*/

  async function submit(values: OnlineConsultationFormValues) {
    // A synchronous guard also covers submissions queued before React commits disabled state.
    if (submissionLock.current || mutation.data) return;
    submissionLock.current = true;
    setSubmissionPending(true);

    try {
      await mutation.mutateAsync(values);
    } catch (error) {
      handleSubmissionError(error);
    } finally {
      // Replace any error content before revealing the card again.
      submissionLock.current = false;
      setSubmissionPending(false);
    }
  }

  function startNewSubmission() {
    setSubmissionError(null);
    form.reset(emptyOnlineConsultationForm);
    mutation.reset();
    requestAnimationFrame(() => form.setFocus("gender"));
  }

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    // Validation failures leave the existing error readable; only an actual retry blurs it.
    void form.handleSubmit(submit, (errors) => focusFirstInvalidField(Object.keys(errors)))(event);
  }

  if (mutation.data) {
    return (
      <div key="success" className={styles.view}>
        <SubmissionSuccess
          trackingCode={mutation.data.trackingCode}
          onNewSubmission={startNewSubmission}
          title="پرسش شما با موفقیت ثبت شد"
          newSubmissionLabel="ثبت پرسش جدید"
        />
      </div>
    );
  }

  const { errors } = form.formState;

  const formContent = (
    <Card radius="lg">
      <form noValidate onSubmit={handleFormSubmit}>
        <CardHeader>
          <CardTitle render={<h2 id="consultation-form-title" />}>فرم مشاوره آنلاین</CardTitle>
          <CardDescription>
            اطلاعات تماس اختیاری است. اطلاعات تحصیلی به ارجاع پرسش شما به فرد یا واحد مناسب کمک می‌کند.
          </CardDescription>
        </CardHeader>
        <CardContent size="lg">
          <FieldGroup>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField id="gender" label="جنسیت" error={errors.gender}>
                <Select
                  name={genderField.name}
                  required
                  items={genderLabels}
                  value={genderField.value}
                  onValueChange={(value) => genderField.onChange(value ?? "unknown")}
                  onOpenChange={(open) => {
                    // Portal focus movement should validate only after the selection closes.
                    if (!open) genderField.onBlur();
                  }}
                >
                  <SelectTrigger
                    id="gender"
                    ref={genderRef}
                    onBlur={(event) => {
                      if (event.currentTarget.getAttribute("aria-expanded") !== "true") genderField.onBlur();
                    }}
                    {...getFieldErrorProps({ id: "gender", error: errors.gender })}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent aria-labelledby="gender-label">
                    {genderValues.map((value) => (
                      <SelectItem key={value} value={value}>
                        {genderLabels[value]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField id="age" label="سن" error={errors.age}>
                <Input
                  id="age"
                  required
                  type="text"
                  inputMode="numeric"
                  dir="ltr"
                  {...getFieldErrorProps({ id: "age", error: errors.age })}
                  {...ageField}
                  onChange={handleAgeChange}
                />
              </FormField>

              <FormField id="maritalStatus" label="وضعیت تأهل" error={errors.maritalStatus}>
                <Select
                  name={maritalStatusField.name}
                  required
                  items={maritalStatusLabels}
                  value={maritalStatusField.value}
                  onValueChange={(value) => maritalStatusField.onChange(value ?? "unknown")}
                  onOpenChange={(open) => {
                    // Portal focus movement should validate only after the selection closes.
                    if (!open) maritalStatusField.onBlur();
                  }}
                >
                  <SelectTrigger
                    id="maritalStatus"
                    ref={maritalStatusRef}
                    onBlur={(event) => {
                      if (event.currentTarget.getAttribute("aria-expanded") !== "true") maritalStatusField.onBlur();
                    }}
                    {...getFieldErrorProps({ id: "maritalStatus", error: errors.maritalStatus })}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent aria-labelledby="maritalStatus-label">
                    {maritalStatusValues.map((value) => (
                      <SelectItem key={value} value={value}>
                        {maritalStatusLabels[value]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField id="email" label="پست الکترونیکی" optional error={errors.email}>
                <Input
                  id="email"
                  type="email"
                  dir="ltr"
                  autoComplete="email"
                  placeholder="example@hut.ac.ir"
                  {...getFieldErrorProps({ id: "email", error: errors.email })}
                  {...form.register("email")}
                />
              </FormField>

              <FormField id="mobile" label="شماره همراه" optional error={errors.mobile}>
                <Input
                  id="mobile"
                  type="tel"
                  inputMode="numeric"
                  dir="ltr"
                  autoComplete="tel"
                  placeholder="۰۹۱۲۱۲۳۴۵۶۷"
                  {...getFieldErrorProps({ id: "mobile", error: errors.mobile })}
                  {...mobileField}
                  onChange={handleMobileChange}
                />
              </FormField>

              <FormField id="faculty" label="نام دانشکده" error={errors.faculty}>
                <Select
                  name={facultyField.name}
                  required
                  items={facultyLabels}
                  value={facultyField.value}
                  onValueChange={(value) => facultyField.onChange(value ?? "unknown")}
                  onOpenChange={(open) => {
                    // Portal focus movement should validate only after the selection closes.
                    if (!open) facultyField.onBlur();
                  }}
                >
                  <SelectTrigger
                    id="faculty"
                    ref={facultyRef}
                    onBlur={(event) => {
                      if (event.currentTarget.getAttribute("aria-expanded") !== "true") facultyField.onBlur();
                    }}
                    {...getFieldErrorProps({ id: "faculty", error: errors.faculty })}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent aria-labelledby="faculty-label">
                    {facultyValues.map((value) => (
                      <SelectItem key={value} value={value}>
                        {facultyLabels[value]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField id="major" label="نام رشته تحصیلی" error={errors.major}>
                <Select
                  name={majorField.name}
                  required
                  items={majorLabels}
                  value={majorField.value}
                  onValueChange={(value) => majorField.onChange(value ?? "unknown")}
                  onOpenChange={(open) => {
                    // Portal focus movement should validate only after the selection closes.
                    if (!open) majorField.onBlur();
                  }}
                >
                  <SelectTrigger
                    id="major"
                    ref={majorRef}
                    onBlur={(event) => {
                      if (event.currentTarget.getAttribute("aria-expanded") !== "true") majorField.onBlur();
                    }}
                    {...getFieldErrorProps({ id: "major", error: errors.major })}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent aria-labelledby="major-label">
                    {majorValues.map((value) => (
                      <SelectItem key={value} value={value}>
                        {majorLabels[value]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField id="question" label="پرسش شما" error={errors.question} className="sm:col-span-2">
                <Textarea
                  id="question"
                  required
                  rows={7}
                  dir="auto"
                  placeholder="پرسش خود را بنویسید…"
                  {...getFieldErrorProps({ id: "question", error: errors.question })}
                  {...form.register("question")}
                />
              </FormField>
            </div>

            <FormField id="altcha" label="تأیید امنیتی" error={challenge.fieldState.error}>
              <SecurityChallenge
                ref={challengeRef}
                invalid={Boolean(challenge.fieldState.error)}
                describedBy={challenge.fieldState.error ? "altcha-error" : undefined}
                onChange={updateChallenge}
              />
            </FormField>

            <SubmissionError error={submissionError} pending={submissionPending} />

            <div className="flex flex-col-reverse items-start justify-between gap-4 border-t border-border pt-5 sm:flex-row sm:items-center">
              <p className="text-xs leading-6 text-muted-foreground">
                <span className="text-destructive" aria-hidden="true">
                  *
                </span>{" "}
                تکمیل این موارد الزامی است.
              </p>
              <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={submissionPending}>
                {submissionPending ? (
                  <>
                    <LoaderCircle className="animate-spin motion-reduce:animate-none" aria-hidden="true" />
                    در حال ارسال…
                  </>
                ) : (
                  <>
                    <Send aria-hidden="true" />
                    ثبت و ارسال پرسش
                  </>
                )}
              </Button>
            </div>
          </FieldGroup>
        </CardContent>
      </form>
    </Card>
  );

  // Distinct keys restart the entrance animation only when switching between form and success.
  return (
    <div key="form" className={styles.view}>
      {formContent}
    </div>
  );
}
