import { os } from "./implementer";
import { submitComplaintProcedure } from "./complaints-and-feedback/complaints-and-feedback.procedure";
import { performanceMiddleware } from "./middleware/performance.middleware";
import { unexpectedErrorMiddleware } from "./middleware/unexpected-error.middleware";

/*===== API Router =====*/

export const router = os
  .use(unexpectedErrorMiddleware)
  .use(performanceMiddleware)
  .router({
    complaintsAndFeedback: {
      submit: submitComplaintProcedure,
    },
  });
