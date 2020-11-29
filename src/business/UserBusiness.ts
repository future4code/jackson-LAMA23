import { UserInputDTO, LoginInputDTO, User } from "../model/User";
import idGenerator, { IdGenerator } from "../services/IdGenerator";
import hashManager, { HashManager } from "../services/HashManager";
import authenticator, { Authenticator } from "../services/Authenticator";
import userDatabase, { UserDatabase } from "../data/UserDatabase";
import { CustomError } from "../error/CustomError";

export class UserBusiness {

    constructor(
        private idGenerator: IdGenerator,
        private hashManager: HashManager,
        private authenticator: Authenticator,
        private userDatabase: UserDatabase
    ) { }

    public createUser = async (user: UserInputDTO): Promise<any> => {
        try {
            const { name, email, password, role } = user

            if (
                !name ||
                !email ||
                !password ||
                !role
            ) {
                throw new CustomError("'name', 'emai',  'password' and 'role' are required", 422)
            }

            if (password.length < 6) {
                throw new CustomError("Invalid password", 400)
            }

            if (!email.includes("@")) {
                throw new CustomError("Invalid email", 400)
            }

            const id = this.idGenerator.generate();

            const hashPassword = await this.hashManager.hash(password);

            await this.userDatabase.createUser(
                new User(
                    id,
                    name,
                    email,
                    hashPassword,
                    User.stringToUserRole(role)
                )
            );

            const accessToken = this.authenticator.generateToken({
                id,
                role
            });

            return accessToken;
        } catch (error) {
            throw new CustomError(error.message, error.code)
        }
    }

    public getUserByEmail = async (user: LoginInputDTO): Promise<any> => {
        try {
            const { email, password } = user

            const userFromDB = await this.userDatabase.getUserByEmail(email);

            const hashCompare = await this.hashManager.compare(
                password,
                userFromDB.getPassword()
            );

            const accessToken = this.authenticator.generateToken({
                id: userFromDB.getId(),
                role: userFromDB.getRole()
            });

            if (!hashCompare) {
                throw new Error("Invalid Password!");
            }

            return accessToken;
        } catch (error) {
            throw new CustomError(error.message, error.code)
        }

    }
}

export default new UserBusiness(
    idGenerator,
    hashManager,
    authenticator,
    userDatabase
)