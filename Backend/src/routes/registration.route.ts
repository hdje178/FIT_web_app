import express from "express";
import * as controller from "../controllers/registration.controller.js";
import { validate } from "../middleware/validate.js";
import {updateRegistrationPutSchema, createRegistrationSchema, updateRegistrationPatchSchema, paramsRegistrationSchema} from "../schemas/registration.schema.js"


const router = express.Router();

router.get("/", validate({}), controller.getRegistrationController);
router.get("/:id", validate({params: paramsRegistrationSchema}), controller.getRegistrationByIdController);
router.post("/", validate({body: createRegistrationSchema}), controller.addRegistrationController);
router.patch("/:id", validate({params: paramsRegistrationSchema, body: updateRegistrationPatchSchema}), controller.updateRegistrationPatchController);
router.put("/:id", validate({params: paramsRegistrationSchema, body: updateRegistrationPutSchema}), controller.updateRegistrationPutController);
router.delete("/:id", validate({params: paramsRegistrationSchema}), controller.deleteRegistrationController);



export default router;