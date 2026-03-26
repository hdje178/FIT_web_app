import express from "express";
import * as controller from "../controllers/event.controller.js";
import { validate } from "../middleware/validate.js";
import {
    paramsEventSchema,
    queryEventSchema,
    createEventSchema,
    updateEventPatchSchema, updateEventPutSchema,
} from "../schemas/event.schemas.js";
const router = express.Router();

router.post(
  "/",
  validate({ body: createEventSchema }),
  controller.addEventController,
);

router.get(
  "/:id",
  validate({ params: paramsEventSchema }),
  controller.getEventByIDController,
);

router.get(
  "/",
  validate({ query: queryEventSchema }),
  controller.getEventsController,
);
router.put(
    "/:id", validate({ params: paramsEventSchema, body: updateEventPutSchema }),
    controller.updateEventPutController,
)
router.patch(
  "/:id",
  validate({ params: paramsEventSchema, body: updateEventPatchSchema }),
  controller.updateEventPatchController,
);


router.delete(
  "/:id",
  validate({ params: paramsEventSchema }),
  controller.deleteEventController,
);

export default router;
