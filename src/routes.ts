import {Router} from "express";
import {AuthController, IndexController} from "./controllers";

const router: any = Router();

router.get("/", IndexController.index);

/*
* Auth routes
* login, signup, forgot-password, reset-password
* */
router.group('/api/auth', (router: Router) => {
    router.post("/signup", AuthController.signup);
    router.post("/login", AuthController.login);
    router.post("/forgot-password", AuthController.recoverPassword); // Send email with reset link
    router.get("/reset-password", AuthController.resetPassword); // link opened from email, sends reset form
    router.post("/reset-password", AuthController.resetPassword); // update the password
});

router.use("**", IndexController.notFound);

export default router;
