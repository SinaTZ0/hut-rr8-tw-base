import { submitComplaintProcedure } from "./complaints-and-feedback/procedure";
import { os } from "./implementer.server";
import { standardizeErrorsMiddleware } from "./middleware/errors/errors.middleware";

/*===== API Router =====*/

// Router middleware wraps every procedure before input validation and feature middleware.
export const router = os.use(standardizeErrorsMiddleware).router({
  complaintsAndFeedback: {
    submit: submitComplaintProcedure,
  },
});
