import * as bcrypt from "bcrypt"
const saltOrRounds: number = 10;
//hash
export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, saltOrRounds);
}
//verify password
export const comperePassword = async (password: string, inputPassword: string) => {
    return await bcrypt.compare(password, inputPassword);
}