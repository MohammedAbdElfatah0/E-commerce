export const generateOtp = () => {
    return Math.ceil(Math.random() * 9999 + 10000);
}
export const expiredOtp = (time: number) => {
    return new Date(Date.now() + time * 60 * 1000);
}