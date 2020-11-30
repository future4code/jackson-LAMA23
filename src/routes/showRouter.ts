import express from "express";  
import ShowController from "../controller/ShowController";

export const showRouter = express.Router();

showRouter.post("/create", ShowController.createShow)
showRouter.get("/getShowsByWeekDay", ShowController.getShowByWeekDay)
