import { Router } from "express";
import { home, login, logout, signup } from "../controllers/user.controller.js";

const router = Router();

// router.route('/').get(home)
// router.route('/login').post(login)
// router.route('/signup').post(signup)
// router.route('/logout').get(logout)

export default router