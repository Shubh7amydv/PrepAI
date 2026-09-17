const express=require("express");

const authRouter=express.Router();
const authController=require("../controllers/auth.controllers");
const authMiddleware=require("../middlewares/auth.middlewares")


/**
 * @route POST api/auth/register
 * @access public
 * @description Used to register a user
 */
authRouter.post("/register", authController.registerUserController);

/**
 * @route POST api/auth/login
 * @access public
 * @description Used to login a user
 */
authRouter.post("/login",authController.loginUserController)

/**
 * @route POST api/auth/demo-login
 * @access public
 * @description Used to login as a demo/recruiter account
 */
authRouter.post("/demo-login", authController.demoLoginController)


/**
 * @route GET api/auth/logout
 * @access public
 * @description Used to logout a user
 */
authRouter.get("/logout",authController.logoutUserController)


/**
 * @route GET api/auth/get-me
 * @access public
 * @description Used to see a user
 */
authRouter.get("/get-me", authMiddleware.authUser, authController.getUserController)


module.exports=authRouter;