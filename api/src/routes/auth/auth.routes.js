import { Router } from "express";
import * as AuthController from "../../controllers/auth/auth.controller.js";

const router = Router();

router.post("/login", AuthController.login);
router.post("/refresh", AuthController.refresh);
router.post("/register", AuthController.register);
router.post("/logout", AuthController.logout);
router.post("/getUserData", AuthController.getUserData);

export default function authRoutes(app) {
  app.use("/api/auth", router);
}
