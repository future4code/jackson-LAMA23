import express from "express";  
import BandController from "../controller/BandController";

export const bandRouter = express.Router();

bandRouter.post("/register", BandController.registerBand)
bandRouter.get("/getBand", BandController.getBand)