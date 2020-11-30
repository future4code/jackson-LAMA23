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
                throw new CustomError(401, "Unauthorized")
            }

            const { name, genre, responsible } = band

            if (
                !name ||
                !genre ||
                !responsible
            ) {
                throw new CustomError(422, "'name', 'genre' and 'responsible' are required")
            }

            const id = this.idGenerator.generate();

            await this.bandDatabase.registerBand(
                ClassBand.toBand({
                    ...band,
                    id
                })!
            )

        } catch (error) {
            throw new CustomError(error.statusCode, error.message)
        }
    }


    public getBand = async (
        input: string
    ): Promise<ClassBand> => {
        try {
            if (!input) {
                throw new CustomError(422, "Invalid input");
            }

            const band = await this.bandDatabase.getBand(input)

            if (!band) {
                throw new CustomError(404, "Band not found");
            }

            return band
        } catch (error) {
            throw new CustomError(error.statusCode, error.message)
        }
    }
}

export default new BandBusiness(
    authenticator,
    idGenerator,
    bandDatabase
)