import jwt from "jsonwebtoken";

const secret = "mySecret";

export const sign = (payload: any) => {
  return jwt.sign(payload, secret);
};

export const verify = (token: string) => {
  return jwt.verify(token, secret);
};
