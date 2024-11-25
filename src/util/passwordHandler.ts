import { createHash, randomBytes } from "crypto";

export function hashPassword(password: string): string {
    const salt = randomBytes(16).toString("hex");
    const hash = createHash("sha256")
      .update(salt + password)
      .digest("hex");
    return salt + "-" + hash;
  }
  
export function verifyHashedPassword(
    inputPassword: string,
    hashedPassword: string
  ): boolean {
    const splittedHPassword = hashedPassword.split("-");
    const salt = splittedHPassword[0];
    const hash = splittedHPassword[1];
    const valueHash = createHash("sha256")
      .update(salt + inputPassword)
      .digest("hex");
    return hash === valueHash;
}