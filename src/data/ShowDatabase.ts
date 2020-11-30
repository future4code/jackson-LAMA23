import { BaseDatabase } from "./BaseDatabase";
import { ClassShow, ShowOutputDTO, WeekDay } from "../model/Show";
import { CustomError } from "../error/CustomError";

export class ShowDatabase extends BaseDatabase {

    public async createShow(
        show: ClassShow
    ): Promise<void> {
        try {
            await this.getConnection()
                .insert({
                    id: show.getId(),
                    band_id: show.getBandId(),
                    start_time: show.getStartTime(),
                    end_time: show.getEndTime(),
                    week_day: show.getWeekDay()
                })
                .into(this.tableNames.shows);
        } catch (error) {
            throw new Error(error.sqlMessage || error.message);
        }
    }

    public async getShowByTimes(
        startTime: number,
        endTime: number
    ): Promise<ShowOutputDTO[]> {
        try {
            const shows = await this.getConnection()
                .select("*")
                .andWhere("end_time", ">", `${startTime}`)
                .andWhere("start_time", "<", `${endTime}`)
                .from(this.tableNames.shows)

            return shows.map((show: any) => {
                return {
                    id: show.id,
                    bandId: show.bandId,
                    startTime: show.startTime,
                    endTime: show.endTime,
                    weekDay: show.weekDay

                }
            })

        } catch (error) {
            throw new Error(error.sqlMessage || error.message);
        }
    }

    public async getShowByWeekDayOrFail(
        weekDay: WeekDay
    ): Promise<ShowOutputDTO[]> {
        try {
            const shows = await this.getConnection().raw(
            `
                SELECT s.id as id, 
                    b.id as bandId, 
                    s.start_time as startTime, 
                    s.end_time as endTime, 
                    s.week_day as weekDay, 
                    b.music_genre as musicGenre
                FROM ${this.tableNames.shows} s 
                LEFT JOIN ${this.tableNames.bands} b ON b.id = s.band_id
                WHERE s.week_day = "${weekDay}"
                ORDER BY startTime ASC
            `
            )

            if (!shows.length) {
                throw new CustomError(`Unbale to found shows at ${weekDay}`, 400)
            }

            return shows[0].map((show: any) => {
                return {
                    id: show.id,
                    bandId: show.bandId,
                    startTime: show.startTime,
                    endTime: show.endTime,
                    weekDay: show.weekDay,
                    musicGenre: show.musicGenre

                }
            })

        } catch (error) {
            throw new Error(error.sqlMessage || error.message);
        }
    }

}

export default new ShowDatabase()