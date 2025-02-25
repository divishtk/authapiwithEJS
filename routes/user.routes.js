import { Router } from "express";
import { home, signup } from "../controllers/user.controller.js";

const router = Router();

router.route('/').get(home)
router.route('/signup').post(signup)


export default router