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
 *     tags: [Registrations]
 *     responses:
 *       200:
 *         description: Список реєстрацій
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedRegistrationsResponse'
 */
router.get("/", validate({}), controller.getRegistrationController);

/**
 * @openapi
 * /api/registrations/{id}:
 *   get:
 *     summary: Отримати реєстрацію за ID
 *     tags: [Registrations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Реєстрація знайдена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegistrationResponse'
 *       404:
 *         description: Не знайдено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", validate({params: paramsRegistrationSchema}), controller.getRegistrationByIdController);

/**
 * @openapi
 * /api/registrations:
 *   post:
 *     summary: Створити реєстрацію
 *     tags: [Registrations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRegistration'
 *     responses:
 *       201:
 *         description: Створено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegistrationResponse'
 *       400:
 *         description: Некоректні дані
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", validate({body: createRegistrationSchema}), controller.addRegistrationController);

/**
 * @openapi
 * /api/registrations/{id}:
 *   patch:
 *     summary: Часткове оновлення реєстрації
 *     tags: [Registrations]
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
 *             $ref: '#/components/schemas/UpdateRegistrationPatch'
 *     responses:
 *       200:
 *         description: Оновлено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegistrationResponse'
 *       400:
 *         description: Некоректні дані
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Не знайдено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch("/:id", validate({params: paramsRegistrationSchema, body: updateRegistrationPatchSchema}), controller.updateRegistrationPatchController);

/**
 * @openapi
 * /api/registrations/{id}:
 *   put:
 *     summary: Повне оновлення реєстрації
 *     tags: [Registrations]
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
 *             $ref: '#/components/schemas/UpdateRegistrationPut'
 *     responses:
 *       200:
 *         description: Оновлено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegistrationResponse'
 *       400:
 *         description: Некоректні дані
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Не знайдено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/:id", validate({params: paramsRegistrationSchema, body: updateRegistrationPutSchema}), controller.updateRegistrationPutController);

/**
 * @openapi
 * /api/registrations/{id}:
 *   delete:
 *     summary: Видалити реєстрацію
 *     tags: [Registrations]
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
router.delete("/:id", validate({params: paramsRegistrationSchema}), controller.deleteRegistrationController);



export default router;