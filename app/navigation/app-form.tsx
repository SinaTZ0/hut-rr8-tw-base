import type { ComponentProps } from "react";
import { Form } from "react-router";

/*===== Application Navigation Form =====*/

/** Enables transitions for navigating submissions; fetcher submissions and document reloads stay Router-owned. */
export function AppForm({ viewTransition = true, ...props }: ComponentProps<typeof Form>) {
  return <Form {...props} viewTransition={viewTransition} />;
}
