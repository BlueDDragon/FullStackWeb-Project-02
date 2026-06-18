export const portConstants = {
    port: process.env.PORT ?? 3001,
    clientPort: process.env.CLIENT_PORT ?? 3000,
}

export const domainConstants = {
    domain: `http://localhost`,
}

export const bcryptConstants = {
    round: process.env.BCRYPT_ROUND ?? 10,
}

export const jwtConstants = {
    secret: process.env.JWT_SECRET ?? "dev-secret-change-me",
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
}

export const uploadConstans = {
    dir: "uploads",
    profileDir: "uploads/user/profile",
    headerDir: "uploads/user/header",
    postDir: "uploads/user/post",
}