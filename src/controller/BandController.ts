import { Request, Response } from "express";
import { BandInputDTO } from "../model/Band";

import { BaseDatabase } from "../data/BaseDatabase";
import bandBusiness, { BandBusiness } from "../business/BandBusiness";


export class BandController {
    constructor(
        private bandBusiness: BandBusiness 
    ){}

    public registerBand = async (req: Request, res: Response) => {
        try {
            const token: string = req.headers.authorization as string

            const { name, genre, responsible } = req.body

            const input: BandInputDTO = {
                name,
                genre,
                responsible
            }
            
            await this.bandBusiness.registerBand(token, input)

            res.status(200).send("Band successfully registered")

        } catch (error) {
            const {code, message} = error
            res.status(code || 400).send({message})
        }

        await BaseDatabase.destroyConnection();
    }

    public getBand = async (req: Request, res: Response) => {
        try {
            const id: string = req.query.id as string
            const name: string = req.query.name as string

            const input = (id ?? name) as string
            
            const band = await this.bandBusiness.getBand(input)
            
            res.status(200).send(band)
        } catch (error) {
            const {code, message} = error
            res.status(code || 400).send({message})
        }
        
        await BaseDatabase.destroyConnection();
    }
}

export default new BandController(bandBusiness)