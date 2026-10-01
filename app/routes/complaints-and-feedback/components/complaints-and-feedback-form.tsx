import { zodResolver } from "@hookform/resolvers/zod";
import { isDefinedError } from "@orpc/client";
import { useMutation } from "@tanstack/react-query";
import { CircleAlert, LoaderCircle, Send } from "lucide-react";
import { useCallback, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useController, useForm, type FieldError as ReactHookFormFieldError, type FieldPath } from "react-hook-form";

import { Button } from "~/components/primitive/button/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/primitive/card/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "~/components/primitive/field/field";
import { Input } from "~/components/primitive/input/input";
import { NativeSelect, NativeSelectOption } from "~/components/primitive/native-select/native-select";
import { Textarea } from "~/components/primitive/textarea/textarea";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { orpc } from "~/orpc/client";
import { departmentValues, feedbackTypeValues } from "~/orpc/complaints-and-feedback/constants";

import {
  complaintsAndFeedbackFormSchema,
  emptyComplaintsAndFeedbackForm,
  type ComplaintsAndFeedbackFormValues,
} from "../schema";
import { SecurityChallenge, type SecurityChallengeHandle } from "./security-challenge";
import { SubmissionSuccess } from "./submission-success";

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
      <FieldLabel htmlFor={id}>
        {label}
        {optional ? <OptionalMarker /> : <RequiredMarker />}
      </FieldLabel>
      {children}
      <FieldError id={`${id}-error`} errors={error ? [error] : undefined} />
    </Field>
  );
}

const feedbackTypeLabels: Record<(typeof feedbackTypeValues)[number], string> = {
  complaint: "شکایات",
  suggestion: "پیشنهادات و انتقادات",
};

/*===== Submission Form =====*/

export function ComplaintsAndFeedbackForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const challengeRef = useRef<SecurityChallengeHandle>(null);
  const form = useForm<ComplaintsAndFeedbackFormValues>({
    defaultValues: emptyComplaintsAndFeedbackForm,
    mode: "onBlur",
    resolver: zodResolver(complaintsAndFeedbackFormSchema),
    shouldFocusError: true,
  });
  const challenge = useController({ control: form.control, name: "altcha" });
  const mutation = useMutation(orpc.complaintsAndFeedback.submit.mutationOptions());

  const updateChallenge = useCallback(
    (payload: string) => {
      challenge.field.onChange(payload);
      if (payload) form.clearErrors("altcha");
    },
    [challenge.field, form],
  );

  /*------ Server Error Handling ------*/

  function handleSubmissionError(submissionError: NonNullable<typeof mutation.error>) {
    if (isDefinedError(submissionError)) {
      switch (submissionError.code) {
        case "INVALID_ALTCHA":
          challengeRef.current?.reset();
          form.setError("altcha", { type: "server", message: submissionError.message });
          return;

        case "INVALID_INPUT": {
          const field = submissionError.data.field;

          if (field !== "altcha" && Object.hasOwn(emptyComplaintsAndFeedbackForm, field)) {
            form.setError(
              field as FieldPath<ComplaintsAndFeedbackFormValues>,
              {
                type: "server",
                message: submissionError.message,
              },
              { shouldFocus: true },
            );
            return;
          }
          break;
        }

        case "DATABASE_UNAVAILABLE":
          setFormError(submissionError.message);
          return;
      }
    }

    setFormError("ارسال پیام انجام نشد. لطفاً اتصال خود را بررسی کنید و دوباره تلاش کنید.");
  }

  /*------ Submission Lifecycle ------*/

  async function submit(values: ComplaintsAndFeedbackFormValues) {
    if (mutation.isPending) return;
    setFormError(null);

    try {
      await mutation.mutateAsync(values);
    } catch (error) {
      handleSubmissionError(error as NonNullable<typeof mutation.error>);
    }
  }

  function startNewSubmission() {
    setFormError(null);
    form.reset(emptyComplaintsAndFeedbackForm);
    mutation.reset();
    requestAnimationFrame(() => form.setFocus("firstName"));
  }

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    void form.handleSubmit(submit)(event);
  }

  if (mutation.data) {
    return <SubmissionSuccess trackingCode={mutation.data.trackingCode} onNewSubmission={startNewSubmission} />;
  }

  const { errors } = form.formState;

  return (
    <Card radius="lg">
      <form noValidate onSubmit={handleFormSubmit}>
        <CardHeader>
          <CardTitle render={<h2 id="complaint-form-title" />}>مشخصات درخواست</CardTitle>
          <CardDescription>اطلاعات تماس اختیاری است، اما در صورت درج می‌تواند به پیگیری بهتر کمک کند.</CardDescription>
        </CardHeader>
        <CardContent size="lg">
          <FieldGroup>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField id="firstName" label="نام" error={errors.firstName}>
                <Input
                  id="firstName"
                  required
                  autoComplete="given-name"
                  {...getFieldErrorProps({ id: "firstName", error: errors.firstName })}
                  {...form.register("firstName")}
                />
              </FormField>

              <FormField id="lastName" label="نام خانوادگی" optional error={errors.lastName}>
                <Input
                  id="lastName"
                  autoComplete="family-name"
                  {...getFieldErrorProps({ id: "lastName", error: errors.lastName })}
                  {...form.register("lastName")}
                />
              </FormField>

              <FormField id="mobile" label="شماره همراه" optional error={errors.mobile}>
                <Input
                  id="mobile"
                  type="tel"
                  inputMode="tel"
                  dir="ltr"
                  autoComplete="tel"
                  placeholder="۰۹۱۲۱۲۳۴۵۶۷"
                  {...getFieldErrorProps({ id: "mobile", error: errors.mobile })}
                  {...form.register("mobile")}
                />
              </FormField>

              <FormField id="email" label="ایمیل" optional error={errors.email}>
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

              <FormField id="studentId" label="شماره دانشجویی" optional error={errors.studentId}>
                <Input
                  id="studentId"
                  type="text"
                  inputMode="numeric"
                  dir="ltr"
                  {...getFieldErrorProps({ id: "studentId", error: errors.studentId })}
                  {...form.register("studentId")}
                />
              </FormField>

              <FormField id="feedbackType" label="نوع پیام" error={errors.feedbackType}>
                <NativeSelect
                  id="feedbackType"
                  required
                  className="w-full"
                  {...getFieldErrorProps({ id: "feedbackType", error: errors.feedbackType })}
                  {...form.register("feedbackType")}
                >
                  <NativeSelectOption value="">انتخاب کنید</NativeSelectOption>
                  {feedbackTypeValues.map((value) => (
                    <NativeSelectOption key={value} value={value}>
                      {feedbackTypeLabels[value]}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </FormField>

              <FormField
                id="department"
                label="واحد یا مسئول مرتبط"
                error={errors.department}
                className="sm:col-span-2"
              >
                <NativeSelect
                  id="department"
                  required
                  className="w-full"
                  {...getFieldErrorProps({ id: "department", error: errors.department })}
                  {...form.register("department")}
                >
                  <NativeSelectOption value="">انتخاب کنید</NativeSelectOption>
                  {departmentValues.map((department) => (
                    <NativeSelectOption key={department} value={department}>
                      {department}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </FormField>

              <FormField id="message" label="شرح پیام" error={errors.message} className="sm:col-span-2">
                <Textarea
                  id="message"
                  required
                  rows={7}
                  dir="auto"
                  placeholder="شکایت، پیشنهاد یا انتقاد خود را بنویسید…"
                  {...getFieldErrorProps({ id: "message", error: errors.message })}
                  {...form.register("message")}
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

            {formError && (
              <Alert variant="destructive">
                <CircleAlert aria-hidden="true" />
                <AlertTitle>ارسال ناموفق</AlertTitle>
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col-reverse items-start justify-between gap-4 border-t border-border pt-5 sm:flex-row sm:items-center">
              <p className="text-xs leading-6 text-muted-foreground">
                <span className="text-destructive" aria-hidden="true">
                  *
                </span>{" "}
                تکمیل این موارد الزامی است.
              </p>
              <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <>
                    <LoaderCircle className="animate-spin motion-reduce:animate-none" aria-hidden="true" />
                    در حال ارسال…
                  </>
                ) : (
                  <>
                    <Send aria-hidden="true" />
                    ثبت و ارسال پیام
                  </>
                )}
              </Button>
            </div>
          </FieldGroup>
        </CardContent>
      </form>
    </Card>
  );
}
