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
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEvent'
 *           examples:
 *             valid:
 *               summary: Валідний приклад
 *               value:
 *                 name: "Conference 2026"
 *                 date: "2026-12-15T09:00:00.000Z"
 *                 location: "Kyiv, Hall A"
 *                 capacity: 150
 *                 description: "Annual tech conference"
 *             pastDate:
 *               summary: Невалідний — дата в минулому
 *               value:
 *                 name: "Old Conference"
 *                 date: "2020-01-01T09:00:00.000Z"
 *                 location: "Kyiv, Hall A"
 *                 capacity: 150
 *                 description: "Past event"
 *     responses:
 *       201:
 *         description: Створено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestPastDate'
 *       409:
 *         $ref: '#/components/responses/ConflictEventName'
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
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Подія знайдена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventResponse'
 *       404:
 *         description: Не знайдено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Пошук за назвою
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [number_sorter, name_sorter, capacity_sorter, date_sorter]
 *         description: Поле сортування
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Пропустити N елементів
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Кількість елементів на сторінку
 *     responses:
 *       200:
 *         description: Список подій
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedEventsResponse'
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
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEventPut'
 *           examples:
 *             valid:
 *               value:
 *                 name: "Conference 2026 v2"
 *                 date: "2026-12-20T09:00:00.000Z"
 *                 location: "Kyiv, Hall B"
 *                 capacity: 160
 *                 description: "Updated agenda"
 *             pastDate:
 *               value:
 *                 name: "Conference 2019"
 *                 date: "2019-12-20T09:00:00.000Z"
 *                 location: "Kyiv, Hall B"
 *                 capacity: 160
 *                 description: "Past date"
 *     responses:
 *       200:
 *         description: Оновлено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestPastDate'
 *       404:
 *         description: Не знайдено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put(
    "/:id", validate({ params: paramsEventSchema, body: updateEventPutSchema }),
    controller.updateEventPutController,
);

/**
 * @openapi
 * /api/events/{id}:
 *   patch:
 *     summary: Часткове оновлення події
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEventPatch'
 *           examples:
 *             valid:
 *               value: { date: "2026-11-20T09:30:00.000Z" }
 *             pastDate:
 *               value: { date: "2020-11-20T09:30:00.000Z" }
 *     responses:
 *       200:
 *         description: Оновлено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestPastDate'
 *       404:
 *         description: Не знайдено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Видалено (без тіла відповіді)
 *       404:
 *         description: Не знайдено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete(
  "/:id",
  validate({ params: paramsEventSchema }),
  controller.deleteEventController,
);

export default router;
