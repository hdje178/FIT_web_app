import express from "express";
import * as controller from "../controllers/registration.controller.js";
import { validate } from "../middleware/validate.js";
import {updateRegistrationPutSchema, createRegistrationSchema, updateRegistrationPatchSchema, paramsRegistrationSchema} from "../schemas/registration.schema.js"


const router = express.Router();

/**
 * @openapi
 * /api/registrations:
 *   get:
 *     summary: Отримати всі реєстрації
 *     responses:
 *       200:
 *         description: Список реєстрацій
 */
router.get("/", validate({}), controller.getRegistrationController);

/**
 * @openapi
 * /api/registrations/{id}:
 *   get:
 *     summary: Отримати реєстрацію за ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Реєстрація знайдена
 *       404:
 *         description: Не знайдено
 */
router.get("/:id", validate({params: paramsRegistrationSchema}), controller.getRegistrationByIdController);

/**
 * @openapi
 * /api/registrations:
 *   post:
 *     summary: Створити реєстрацію
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               eventId:
 *                 type: string
 *               status:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Створено
 */
router.post("/", validate({body: createRegistrationSchema}), controller.addRegistrationController);

/**
 * @openapi
 * /api/registrations/{id}:
 *   patch:
 *     summary: Часткове оновлення реєстрації
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
router.patch("/:id", validate({params: paramsRegistrationSchema, body: updateRegistrationPatchSchema}), controller.updateRegistrationPatchController);

/**
 * @openapi
 * /api/registrations/{id}:
 *   put:
 *     summary: Повне оновлення реєстрації
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
router.put("/:id", validate({params: paramsRegistrationSchema, body: updateRegistrationPutSchema}), controller.updateRegistrationPutController);

/**
 * @openapi
 * /api/registrations/{id}:
 *   delete:
 *     summary: Видалити реєстрацію
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
router.delete("/:id", validate({params: paramsRegistrationSchema}), controller.deleteRegistrationController);



export default router;