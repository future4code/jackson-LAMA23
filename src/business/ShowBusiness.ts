import bandDatabase, { BandDatabase } from "../data/BandDatabase";
import authenticator, { Authenticator } from "../services/Authenticator";
import idGenerator, { IdGenerator } from "../services/IdGenerator";
import showDatabase, { ShowDatabase } from "../data/ShowDatabase";
import { ShowInputDTO, ClassShow, WeekDay } from "../model/Show";
import { CustomError } from "../error/CustomError";
import { ClassBand } from "../model/Band";

export class ShowBusiness {
    constructor(
        private authenticator: Authenticator,
        private idGenerator: IdGenerator,
        private showDatabase: ShowDatabase,
        private bandDatabase: BandDatabase
    ) { }

    public createShow = async (
        token: string,
        input: ShowInputDTO
    ): Promise<void> => {
        try {
            const accessToken = this.authenticator.getData(token)

            if (accessToken.role !== "ADMIN") {
                throw new CustomError(401, "Unauthorized")
            }

            const { bandId, weekDay, startTime, endTime } = input

            if (
                !bandId ||
                !weekDay ||
                !startTime ||
                !endTime
            ) {
                throw new CustomError(422, "'bandId', 'weekDay', 'startTime' and 'endTime' are required")
            }

            if (startTime < 8 || endTime > 23 || startTime >= endTime) {
                throw new CustomError(417, "Invalid times to createShow")
            }

            if (!Number.isInteger(startTime) || !Number.isInteger(endTime)) {
                throw new CustomError(417, "Times should be integer to createShow")
            }

            const band: ClassBand = await this.bandDatabase.getBand(bandId)

            if (!band) {
                throw new CustomError(404, "Band not found");
            }

            const registerShow = await this.showDatabase.getShowByTimes(startTime, endTime)

            if (registerShow.length) {
                throw new CustomError(404, "No more shows can be created as this time");
            }

            const id = this.idGenerator.generate();

            await this.showDatabase.createShow(
                ClassShow.toClassShow({
                    ...input,
                    id
                })
            )
        } catch (error) {
            throw new CustomError(error.statusCode, error.message)
        }
    }

    public getShowByWeekDay = async (
        weekDay: WeekDay
    ): Promise<any> => {
        try {
            if (!weekDay) {
                throw new CustomError(422, "Invalid input")
            }

            const shows = await this.showDatabase.getShowByWeekDayOrFail(weekDay)

            return { result: shows }

        } catch (error) {
            throw new CustomError(error.statusCode, error.message)
        }
    }
}

export default new ShowBusiness(
    authenticator, 
    idGenerator,
    showDatabase,
    bandDatabase
)