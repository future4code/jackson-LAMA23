import { BaseDatabase } from "./BaseDatabase";
import { ClassBand } from "../model/Band";
import { CustomError } from "../error/CustomError";

export class BandDatabase extends BaseDatabase {
    private static TABLE_NAME = "Lama_Bands"

    public async registerBand(
        band: ClassBand
    ): Promise<void> {
        try {
            await this.getConnection()
                .insert({
                    id: band.getId(),
                    name: band.getName(),
                    music_genre: band.getGenre(),
                    responsible: band.getResponsible()
                })
                .into(BandDatabase.TABLE_NAME);
        } catch (error) {
            throw new Error(error.sqlMessage || error.message);
        }
    }

    public async getBand(
        input: string
    ): Promise<ClassBand> {
        try {
            const result = await this.getConnection()
                .select("*")
                .from(BandDatabase.TABLE_NAME)
                .where({ id: input })
                .orWhere({ name: input });

            if (!result[0]) {
                throw new CustomError("Band not found", 404)
            }
            404

            return ClassBand.toBand(result[0])!

        } catch (error) {
            throw new Error(error.sqlMessage || error.message);
        }
    }


}

export default new BandDatabase()