import { Router } from "express";
import { getHomeData } from "../controller/home.controller.js";

const router = Router();

router.get("/", getHomeData);

export default router;
