function requireEnv(key: string): string {
  const value = process.env[key];
  if (value === undefined || value === '') {
    throw new Error(`Missing required env: ${key}`);
  }
  return value;
}

export const portConstants = {
    port: Number(requireEnv("PORT")),
    clientPort: Number(requireEnv("CLIENT_PORT")),
}

export const domainConstants = {
    domain: `http://localhost`,
    clientDomain: ``,
}

export const bcryptConstants = {
    round: Number(requireEnv("BCRYPT_ROUND")),
}

export const jwtConstants = {
    secret: requireEnv("JWT_SECRET"),
    expiresIn: requireEnv("JWT_EXPIRES_IN"),
}

export const uploadConstants = {
    dir: "uploads",
    profileDir: "uploads/user/profile",
    headerDir: "uploads/user/header",
    postDir: "uploads/post",
}