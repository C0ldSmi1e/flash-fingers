import "server-only";
import { Resend } from "resend";
import { env } from "@/src/server/env";
import { UpstreamError } from "@/src/server/errors";

const resend = new Resend(env.RESEND_API_KEY);

// Plain-text only: every mail we send is a single link plus a sentence.
const sendEmail = async ({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) => {
  const { error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to,
    subject,
    text,
  });

  if (error) {
    throw new UpstreamError(`Failed to send email: ${error.message}`);
  }
};

export { sendEmail };
