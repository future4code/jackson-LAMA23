import { Request, Response } from "express";
import { BaseDatabase } from "../data/BaseDatabase";
import showBusiness, { ShowBusiness } from "../business/ShowBusiness";
import { ClassShow, ShowInputDTO } from "../model/Show";
import { ClassBand } from "../model/Band";

export class ShowController {
    constructor(
        private showBusiness: ShowBusiness 
    ){}

    public createShow = async (req: Request, res: Response) => {
        try {
            const token: string = req.headers.authorization as string
            const { weekDay, bandId, startTime, endTime } = req.body
            
            const day = ClassShow.toWeekDayEnum(weekDay)

            const input: ShowInputDTO = {
                weekDay: day,
                bandId,
                startTime,
                endTime
            }

            
            await this.showBusiness.createShow(token, input)

            res.status(200).send("Show successfully registered")

        } catch (error) {
            const {code, message} = error
            res.status(code || 400).send({message})
        }

        await BaseDatabase.destroyConnection();
    }

    public getShowByWeekDay = async (req: Request, res: Response) => {
        try {
            const weekDay = req.query.weekDay as string
            const day = ClassShow.toWeekDayEnum(weekDay)

            const shows = await this.showBusiness.getShowByWeekDay(day)

            res.status(200).send({ shows })
        } catch (error) {
            const {code, message} = error
            res.status(code || 400).send({message})
        }

        await BaseDatabase.destroyConnection();
    }


}

export default new ShowController(showBusiness)