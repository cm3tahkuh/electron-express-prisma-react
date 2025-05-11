import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY as string;

interface Role {
  roleName: string;
}

interface User {
  id: number;
  login: string;
  role: Role;
}

export function generateToken(user: User): string {
  return jwt.sign({ user }, SECRET_KEY, { expiresIn: "1h" });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, SECRET_KEY) as JwtPayload;
  } catch (err) {
    return null;
  }
}
