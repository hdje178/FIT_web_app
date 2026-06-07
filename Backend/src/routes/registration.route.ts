import express from "express";
import * as controller from "../controllers/registration.controller.js";
import { validate } from "../middleware/validate.js";
import {updateRegistrationPutSchema, createRegistrationSchema, updateRegistrationPatchSchema, paramsRegistrationSchema} from "../schemas/registration.schema.js"
import {authMiddleware} from "../middleware/auth.middleware.js";


const router = express.Router();

/**
 * @openapi
 * /api/registration:
 *   get:
 *     summary: Отримати всі реєстрації
 *     responses:
 *       200:
 *         description: Список реєстрацій
 */
router.get("/",authMiddleware, validate({}), (controller.getRegistrationController));
router.get("/me",authMiddleware, validate({}), controller.getMyRegistration )
/**
 * @openapi
 * /api/registration/{id}:
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
router.get("/:id",authMiddleware, validate({params: paramsRegistrationSchema}), (controller.getRegistrationByIdController));
/**
 * @openapi
 * /api/registration:
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
router.post("/",authMiddleware, validate({body: createRegistrationSchema}),(controller.addRegistrationController));

/**
 * @openapi
 * /api/registration/{id}:
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
router.patch("/:id",authMiddleware, validate({params: paramsRegistrationSchema, body: updateRegistrationPatchSchema}), (controller.updateRegistrationPatchController));

/**
 * @openapi
 * /api/registration/{id}:
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
router.put("/:id",authMiddleware, validate({params: paramsRegistrationSchema, body: updateRegistrationPutSchema}), (controller.updateRegistrationPutController));

/**
 * @openapi
 * /api/registration/{id}:
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
router.delete("/:id",authMiddleware, validate({params: paramsRegistrationSchema}), (controller.deleteRegistrationController));



export default router;