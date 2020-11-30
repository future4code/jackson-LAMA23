import { CustomError } from "../error/CustomError"

export enum WeekDay {
    FRIDAY = "FRIDAY",
    SATURDAY = "SATURDAY",
    SUNDAY = "SUNDAY"
}

export class ClassShow {
    constructor(
        private id: string,
        private weekDay: WeekDay,
        private bandId: string,
        private startTime: number,
        private endTime: number
    ){}

    public getId = (): string => this.id
    public getWeekDay = (): WeekDay => this.weekDay
    public getBandId = (): string => this.bandId
    public getStartTime = (): number => this.startTime
    public getEndTime = (): number => this.endTime

    public setId = (id: string) => this.id = id
    public setWeekDay = (weekDay: WeekDay) => this.weekDay = weekDay
    public setBandId = (bandId: string) => this.bandId = bandId
    public setStartTime = (startTime: number) => this.startTime = startTime
    public setEndTime = (endTime: number) => this.endTime = endTime

    public static toWeekDayEnum(data?: any): WeekDay {
        switch(data) {
            case "FRIDAY":
                return WeekDay.FRIDAY
            case "SATURDAY":
                return WeekDay.SATURDAY
            case "SUNDAY":
                return WeekDay.SUNDAY
            default:
                throw new CustomError(422, "Invalid weekDay")
        }
    }

    public static toClassShow(data?: any) {
        return(data && new ClassShow(
            data.id,
            ClassShow.toWeekDayEnum(data.weekDay || data.week_day),
            data.bandId || data.band_id,
            data.startTime || data.start_time,
            data.endTime || data.end_time
        ))
    }
}

export interface ShowInputDTO {
    bandId: string,
    weekDay: WeekDay,
    startTime: number,
    endTime: number
}

export interface ShowOutputDTO {
    id: string,
    bandId: string,
    weekDay: WeekDay,
    startTime: number,
    endTime: number,
    musicGenre?: string,
    bandName?: string
}