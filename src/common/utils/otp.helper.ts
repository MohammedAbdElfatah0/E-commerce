export const generateOtp = () => {
    return Math.floor(10000 + Math.random() * 90000);//5 digit otp
}
export const expiredOtp = (time: number) => {
    return new Date(Date.now() + time * 60 * 1000);
}