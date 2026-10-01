import { COMMON_ERROR_STATUS_MAP } from "@orpc/client";
import { z } from "zod";

/*===== Shared Public Error Data =====*/

// Empty maps keep general diagnostics and field validation independent.
export const errorDataSchema = z.object({
  errors: z.record(z.string(), z.string()),
  fields: z.record(z.string(), z.string()),
});

export type ErrorData = z.infer<typeof errorDataSchema>;

/*===== Shared HTTP Status Mapping =====*/

export const rpcErrorStatusMap = {
  ...COMMON_ERROR_STATUS_MAP,
  BAD_REQUEST: 422,
  INVALID_INPUT: 422,
  INVALID_ALTCHA: 422,
  DATABASE_UNAVAILABLE: 503,
};

/*===== Built-in Error Contracts =====*/

export const commonErrors = Object.fromEntries(
  Object.keys(COMMON_ERROR_STATUS_MAP).map((code) => [code, { data: errorDataSchema }]),
) as { [Code in keyof typeof COMMON_ERROR_STATUS_MAP]: { data: typeof errorDataSchema } };
