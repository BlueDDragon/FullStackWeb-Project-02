export const commonConstants = {
    port: process.env.PORT ?? 3001,
    clientPort: process.env.CLIENT_PORT ?? 3000,
}

export const bcryptConstants = {
    round: process.env.BCRYPT_ROUND ?? 10,
}

export const jwtConstants = {
    secret: process.env.JWT_SECRET ?? "dev-secret-change-me",
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
}