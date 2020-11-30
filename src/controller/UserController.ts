import { Request, Response } from "express";
import { UserInputDTO, LoginInputDTO } from "../model/User";
import userBusiness, { UserBusiness } from "../business/UserBusiness";
import { BaseDatabase } from "../data/BaseDatabase";

export class UserController {
    constructor(
        private userBusiness: UserBusiness
    ){}

    public signup = async (req: Request, res: Response) => {
        try {
            const {email, name, password, role} = req.body

            const input: UserInputDTO = {
                email,
                name,
                password,
                role
            }

            const token = await this.userBusiness.createUser(input);

            res.status(200).send({ token });

        } catch (error) {
            res.status(400).send({ error: error.message });
        }

        await BaseDatabase.destroyConnection();
    }

    public login = async (req: Request, res: Response) => {

        try {
            const {email, password} = req.body

            const loginData: LoginInputDTO = {
                email,
                password
            };

            console.log(loginData)
           
            const token = await this.userBusiness.getUserByEmail(loginData);

            res.status(200).send({ token });

        } catch (error) {
            res.status(400).send({ error: error.message });
        }

        await BaseDatabase.destroyConnection();
    }

}

export default new UserController(userBusiness)