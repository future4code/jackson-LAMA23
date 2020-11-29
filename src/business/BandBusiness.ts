import { BandInputDTO, ClassBand } from "../model/Band";

import idGenerator, { IdGenerator } from "../services/IdGenerator";
import authenticator, { Authenticator } from "../services/Authenticator";
import bandDatabase, { BandDatabase } from "../data/BandDatabase";
import { CustomError } from "../error/CustomError";

export class BandBusiness {
    constructor(
        private authenticator: Authenticator,
        private idGenerator: IdGenerator,
        private bandDatabase: BandDatabase
    ) { }

    public registerBand = async (
        token: string,
        band: BandInputDTO
    ): Promise<void> => {
        try {
            const accessToken = this.authenticator.getData(token)

            if (accessToken.role !== "ADMIN") {
                throw new CustomError("Unauthorized", 401)
            }

            const { name, genre, responsible } = band

            if (
                !name ||
                !genre ||
                !responsible
            ) {
                throw new CustomError("'name', 'genre' and 'responsible' are required", 422)
            }

            const id = this.idGenerator.generate();

            await this.bandDatabase.registerBand(
                ClassBand.toBand({
                    ...band,
                    id
                })!
            )

        } catch (error) {
            throw new CustomError(error.message, error.code)
        }
    }


    public getBand = async (
        input: string
    ): Promise<ClassBand> => {
        try {
            if (!input) {
                throw new CustomError("Invalid input", 422);
            }

            const band = await this.bandDatabase.getBand(input)

            if (!band) {
                throw new CustomError("Band not found", 404);
            }

            return band
        } catch (error) {
            throw new CustomError(error.message, error.code)
        }
    }
}

export default new BandBusiness(
    authenticator,
    idGenerator,
    bandDatabase
)