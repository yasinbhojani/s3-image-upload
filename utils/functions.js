import crypto from "crypto";

export const randomImageName = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString("hex");
};
