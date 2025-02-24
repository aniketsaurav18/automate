"use client";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { JobDataType } from "@/types";

export type EmailJobDataType = Extract<JobDataType, { key: "email" }>;

interface EmailComposerProps {
  jobData: JobDataType | null;
}

// Validation Function
const validateEmailJob = (
  to: string,
  subject: string,
  body: string
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!to) {
    errors.to = "Recipient is required.";
  }

  if (!subject) {
    errors.subject = "Subject is required.";
  }

  if (!body) {
    errors.body = "Message body is required.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const EmailComposer = forwardRef(
  ({ jobData }: EmailComposerProps, ref) => {
    const [to, setTo] = useState("");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");

    // Error States
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
      if (!jobData) {
        return;
      }
      const data = jobData as EmailJobDataType;
      setTo(data.input.reciepents);
      setSubject(data.input.subject);
      setBody(data.input.body);
    }, [jobData]);

    useImperativeHandle(ref, () => ({
      submitHandler: () => {
        const { isValid, errors } = validateEmailJob(to, subject, body);

        if (!isValid) {
          setErrors(errors);
          console.log("Validation failed:", errors);
          return null;
        }

        const emailJob = {
          key: "email",
          input: {
            reciepents: to,
            subject: subject,
            body: body,
          },
        } as EmailJobDataType;

        console.log("httpform job::", emailJob);
        return emailJob;
      },
    }));

    return (
      <div className="space-y-4 p-4">
        <div>
          <Label htmlFor="to">To:</Label>
          <Input
            id="to"
            type="email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
            className={`w-full ${errors.to ? "border-red-500" : ""}`}
          />
          {errors.to && (
            <p className="text-red-500 text-sm mt-1">{errors.to}</p>
          )}
        </div>
        <div>
          <Label htmlFor="subject">Subject:</Label>
          <Input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className={`w-full ${errors.subject ? "border-red-500" : ""}`}
          />
          {errors.subject && (
            <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
          )}
        </div>
        <div>
          <Label htmlFor="body">Message:</Label>
          <Textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            className={`w-full h-32 ${errors.body ? "border-red-500" : ""}`}
          />
          {errors.body && (
            <p className="text-red-500 text-sm mt-1">{errors.body}</p>
          )}
        </div>
      </div>
    );
  }
);

EmailComposer.displayName = "EmailComposer";
