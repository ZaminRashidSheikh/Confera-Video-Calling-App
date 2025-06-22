import { Router } from "express";
import { login, register } from "../controllers/user.controllers.js";
import { addToActivity, getAllActivity } from "../controllers/meeting.controllers.js";

const router = Router();

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/add_to_activity").post(addToActivity);
router.route("/get_all_activity").get(getAllActivity);

export default router;
