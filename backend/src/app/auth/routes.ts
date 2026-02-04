import express from "express";
import { authMiddleware } from "@/middleware";
import { resendVerificationEmail, session, signIn, signOut, signUp, verifyEmail } from "./handlers";

const router = express.Router();

router.post("/signup", signUp);

router.post("/signin", signIn);

router.post("/verify-email", verifyEmail);

router.post("/resend-verification", resendVerificationEmail);

router.get("/session", authMiddleware, session);

router.get("/signout", authMiddleware, signOut);

export { router as authRouter };
