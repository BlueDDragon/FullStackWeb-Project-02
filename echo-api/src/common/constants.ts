const defaultError = (() => { throw new Error()});

export const portConstants = {
    port: Number(process.env.PORT) || defaultError(),
    clientPort: Number(process.env.CLIENT_PORT) || defaultError(),
}

export const domainConstants = {
    domain: `http://localhost`,
    clientDomain: ``,
}

export const bcryptConstants = {
    round: Number(process.env.BCRYPT_ROUND) || defaultError(),
}

export const jwtConstants = {
    secret: process.env.JWT_SECRET || defaultError(),
    expiresIn: process.env.JWT_EXPIRES_IN || defaultError(),
}

export const uploadConstants = {
    dir: "uploads",
    profileDir: "uploads/user/profile",
    headerDir: "uploads/user/header",
    postDir: "uploads/post",
}