import { User, UserRole, UserInputDTO, LoginInputDTO } from "../src/model/User";
import { UserBusiness } from "../src/business/UserBusiness";


const userDatabase = {
    createUser: jest.fn(async (user: User) => { }),
    getUserByEmail: jest.fn((email: string) => {
        if ("teste@gmail.com") {
            return User.toUserModel({
                id: "id teste",
                name: "nome teste",
                email,
                password: "123456",
                userRole: UserRole.ADMIN

            })
        } else {
            throw new Error("Unable to found user with email")
        }
    })
}

const authenticator = {
    generateToken: jest.fn((payload: { id: string, role: UserRole }) => "token-gerado"),
    getData: jest.fn((token: string) => {
        switch (token) {
            case "userToken":
                return { id: "id", role: "NORMAL" }
            case "adminToken":
                return { id: "id", role: "ADMIN" }
            default:
                return undefined
        }

    })
}

const idGenerator = {
    generate: jest.fn(() => "id-gerado")
}

const hashManager = {
    hash: jest.fn((password: string) => "hash-gerada"),
    compare: jest.fn((text: string, hash: string) => text === "12345" ? true : false)
}

const userBusiness = new UserBusiness(
    userDatabase as any,
    idGenerator as any,
    hashManager as any,
    authenticator as any
)

describe("Signup", () => {
    test("Error when 'name' is empty", async () => {
        expect.assertions(2)

        const user: UserInputDTO = {
            name: "",
            email: "magali@gmail.com",
            password: "123456",
            role: "NORMAL"
        }

        try {
            await userBusiness.createUser(user)
        } catch (error) {
            expect(error.statusCode).toBe(422)
            expect(error.message).toBe("'name', 'emai',  'password' and 'role' are required")
        }
    })

    test("Error when 'email' is empty", async () => {
        expect.assertions(2)

        const user: UserInputDTO = {
            name: "Magali",
            email: "",
            password: "123456",
            role: "NORMAL"
        }
        try {
            await userBusiness.createUser(user)
        } catch (error) {
            expect(error.statusCode).toBe(422)
            expect(error.message).toBe("'name', 'emai',  'password' and 'role' are required")
        }
    })

    test("Error when 'password' is empty", async () => {
        expect.assertions(2)

        const user: UserInputDTO = {
            name: "Magali",
            email: "magali@gmail.com",
            password: "",
            role: "NORMAL"
        }
        try {
            await userBusiness.createUser(user)
        } catch (error) {
            expect(error.statusCode).toBe(422)
            expect(error.message).toBe("'name', 'emai',  'password' and 'role' are required")
        }
    })
    
    test("When 'role' is empty", async () => {
        expect.assertions(2)

        const user: UserInputDTO = {
            name: "Magali",
            email: "magali@gmail.com",
            password: "123456",
            role: ""
        }
        try {
            await userBusiness.createUser(user)
    
        } catch (error) {
            expect(error.message).toBe("'name', 'emai',  'password' and 'role' are required")
            expect(error.statusCode).toBe(422)
        }
    })


    test("Error when 'email' is invalid", async () => {
        expect.assertions(2)

        const user: UserInputDTO = {
            name: "Magali",
            email: "magaligmail.com",
            password: "123456",
            role: "NORMAL"
        }
        try {
            await userBusiness.createUser(user)
        } catch (error) {
            expect(error.statusCode).toBe(422)
            expect(error.message).toBe("Invalid email")
        }
    })

    test("Error when 'password' is invalid", async () => {
        expect.assertions(2)

        const user: UserInputDTO = {
            name: "Magali",
            email: "magali@gmail.com",
            password: "12",
            role: "NORMAL"
        }
        try {
            await userBusiness.createUser(user)
        } catch (error) {
            expect(error.statusCode).toBe(422)
            expect(error.message).toBe("Invalid password")
        }
    })


    test("Success case", async () => {
        expect.assertions(1)

        const user: UserInputDTO = {
            name: "Magali",
            email: "magali@gmail.com",
            password: "123456",
            role: "NORMAL"
        }
        try {
            const result = await userBusiness.createUser(user)
            expect(result).toBe("token-gerado")
        } catch (error) {

        }
    })
})