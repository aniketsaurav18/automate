import { z } from "zod";

export const Apps = z.enum(["http", "webhook", "schedule", "email"]);

export const JobType = z.enum(["trigger", "action"]);

export const HttpJobSchema = z.object({
  key: z.literal("http"),
  input: z.object({
    url: z.string().url(),
    method: z.enum([
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
      "HEAD",
    ]),
    headers: z.record(z.string()),
    parameters: z.record(z.string()),
    body: z.string(),
  }),
  output: z
    .object({
      statusCode: z.number(),
      headers: z.record(z.string()),
      body: z.string(),
    })
    .optional(),
});

export const WebhookJobSchema = z.object({
  key: z.literal("webhook"),
  input: z.object({
    webhookUrl: z.string().url(),
  }),
  output: z
    .array(
      z.object({
        data: z.string(),
        type: z.enum(["json", "string", "number", "boolean"]),
      })
    )
    .optional(),
});

const FixedTimeSchema = z.object({
  dateTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date-time format",
  }),
  timeZoneOffset: z
    .string()
    .refine((val) => /^[+-](0[0-9]|1[0-4]):[0-5][0-9]$/.test(val), {
      message: "Invalid time zone offset format",
    }),
});

const IntervalSchema = z.object({
  unit: z.enum(["min", "hour", "day", "week", "month"]),
  value: z.number().int().positive(),
});

export const BaseScheduleSchema = z.object({
  key: z.literal("schedule"),
  type: z.enum(["fixed", "interval"]),
  fixedTime: FixedTimeSchema.optional(),
  interval: IntervalSchema.optional(),
});

export const ScheduleSchema = BaseScheduleSchema.refine(
  (data) => {
    if (data.type === "fixed" && !data.fixedTime) {
      return false;
    }
    if (data.type === "interval" && !data.interval) {
      return false;
    }
    return true;
  },
  {
    message:
      "Either 'fixedTime' or 'interval' must be provided based on the 'type'.",
    path: ["fixedTime", "interval"],
  }
);

export const EmailJobSchema = z.object({
  key: z.literal("email"),
  input: z.object({
    reciepents: z.string().email(),
    subject: z.string().max(255),
    body: z.string(),
    attatchments: z.string().url().optional(),
  }),
  output: z
    .object({
      success: z.boolean(),
    })
    .optional(),
});

export const JobDataSchema = z.discriminatedUnion("key", [
  HttpJobSchema,
  WebhookJobSchema,
  BaseScheduleSchema,
  EmailJobSchema,
]);
