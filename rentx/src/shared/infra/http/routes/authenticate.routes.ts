import { Router } from "express";

import { AuthenticateUserUseController } from "@modules/accounts/useCases/authenticateUser/AuthenticateUserController";

const authenticateRoutes = Router();

const authenticateUserController = new AuthenticateUserUseController();

authenticateRoutes.post("/sessions", authenticateUserController.handle);

export { authenticateRoutes };
