import dotenv from "dotenv";
dotenv.config();
import { AxiosRequestConfig } from "axios";
import { EmailJobSchemaType } from "../../../backend/src/schema";
import { executeHttpRequest } from "./common";
import Mailjet, { Message } from "node-mailjet";
import { logger } from "../utils/logger";

const mailjet = new Mailjet({
  apiKey: process.env.MAILJET_APIKEY_PUBLIC || "your-api-key",
  apiSecret: process.env.MAILJET_APIKEY_PRIVATE || "your-api-secret",
});

export async function EmailExecutors(job: EmailJobSchemaType) {
  try {
    const request = await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "automate@sauravs.me",
            Name: "Automate",
          },
          To: [
            {
              Email: job.input.reciepents,
              Name: job.input.reciepents,
            },
          ],
          Subject: job.input.subject,
          TextPart: job.input.body,
        },
      ],
    });
    logger.info(request.body);
    const res = {
      success: true,
    } as EmailJobSchemaType["output"];
    return {
      key: job.key,
      success: true,
      result: res,
    };
  } catch (error) {
    logger.error(error);
    return {
      key: job.key,
      success: false,
      result: {
        success: false,
      } as EmailJobSchemaType["output"],
    };
  }
}

const EmailJobdata: EmailJobSchemaType = {
  key: "email",
  input: {
    reciepents: "sauravtest.mitsogo@gmail.com",
    body: "hello this is a test",
    subject: "test subject",
  },
};

EmailExecutors(EmailJobdata);
