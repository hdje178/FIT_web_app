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

/**
 * @openapi
 * /api/events:
 *   post:
 *     summary: Створити подію
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               capacity:
 *                 type: number
 *     responses:
 *       201:
 *         description: Створено
 */
router.post(
  "/",
  validate({ body: createEventSchema }),
  controller.addEventController,
);

/**
 * @openapi
 * /api/events/{id}:
 *   get:
 *     summary: Отримати подію за ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Подія знайдена
 *       404:
 *         description: Не знайдено
 */
router.get(
  "/:id",
  validate({ params: paramsEventSchema }),
  controller.getEventByIDController,
);

/**
 * @openapi
 * /api/events:
 *   get:
 *     summary: Отримати всі події
 *     responses:
 *       200:
 *         description: Список подій
 */
router.get(
  "/",
  validate({ query: queryEventSchema }),
  controller.getEventsController,
);

/**
 * @openapi
 * /api/events/{id}:
 *   put:
 *     summary: Повне оновлення події
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Оновлено
 */
router.put(
    "/:id", validate({ params: paramsEventSchema, body: updateEventPutSchema }),
    controller.updateEventPutController,
)

/**
 * @openapi
 * /api/events/{id}:
 *   patch:
 *     summary: Часткове оновлення події
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Оновлено
 */
router.patch(
  "/:id",
  validate({ params: paramsEventSchema, body: updateEventPatchSchema }),
  controller.updateEventPatchController,
);

/**
 * @openapi
 * /api/events/{id}:
 *   delete:
 *     summary: Видалити подію
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Видалено
 */
router.delete(
  "/:id",
  validate({ params: paramsEventSchema }),
  controller.deleteEventController,
);

export default router;
