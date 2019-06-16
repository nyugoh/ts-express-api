import {Router} from "express";
import {AuthController, IndexController} from "./controllers";

const router: any = Router();

// router.use("/", IndexController.index);
// router.use("**", IndexController.notFound);
router.post("/signup", AuthController.signup);
router.post("/login", AuthController.login);
router.post("/recover-password", AuthController.recoverPassword);

export default router;
