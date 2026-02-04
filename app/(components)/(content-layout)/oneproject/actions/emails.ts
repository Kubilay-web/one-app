"use server";

import { InvoiceLink } from "../components/email-templates/InvoiceLink";
import db from "@/app/lib/db"
import { Resend } from "resend";
import { revalidatePath } from "next/cache";
import { InvoiceDetails } from "../types/types";
import { getNormalDate } from "../lib/getNormalDate";
import ClientInvitation, {
  InvitationProps,
} from "../components/email-templates/ClientInvitation";


import { ExistingUser } from "./users";
import MemberInvitation from "../components/email-templates/MemberInvitation";
import {
  sendGeneralEmail,
  sendToClientList,
  sendToEmailList,
} from "../components/email-templates/html";

import { FileProps } from "../components/FormInputs/MultipleFileUploader";


const resend = new Resend(process.env.RESEND_API_KEY);
export async function sendInvoiceLink(
  data: InvoiceDetails,
  invoiceLink: string
) {
  try {
    const date = getNormalDate(data.invoice.date);
    const title = `Payment Invoice for the ${data.invoice.title} Made on ${date}`;
    const preview = `Payment Invoice for the ${data.invoice.title} Made on ${date}`;
    const username = data.user?.name ?? "";
    const clientMail = data.client?.email ?? "desishub.info@gmail.com";
    await resend.emails.send({
      from: "Project Pro <jb@desishub.com>",
      to: clientMail,
      subject: `Invoice for the Payment Made on ${date}`,
      react: InvoiceLink({ invoiceLink, title, preview, username }),
    });
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function sendClientInvitation(data: InvitationProps) {
  try {
    const loginLink = data.loginLink;
    await resend.emails.send({
      from: "Project Pro <jb@desishub.com>",
      to: data.loginEmail,
      subject: `Invitation to collaborate on ${data.projectName}`,
      react: ClientInvitation({
        clientName: data.clientName,
        projectName: data.projectName,
        message: data.message,
        loginEmail: data.loginEmail,
        loginPassword: data.loginPassword,
        loginLink,
      }),
    });
  } catch (error) {
    console.log(error);
    return null;
  }
}
export type InvitationDetailsProps = {
  projectName: string;
  projectOwner: string;
  projectOwnerId: string;
  loginLink: string;
};
export async function sendMemberInvitation(
  members: ExistingUser[],
  projectData: InvitationDetailsProps
) {
  const message =
    "Iam excited to have you on board! Please login below to access the project workspace.";
  const mails = members.map((member) => {
    return {
      from: "Project Pro <jb@desishub.com>",
      to: member.email,
      subject: `Invitation to ${projectData.projectName}`,
      react: MemberInvitation({
        memberName: member.name,
        projectName: projectData.projectName,
        message: message,
        loginLink: projectData.loginLink,
        projectOwner: projectData.projectOwner,
      }),
    };
  });
  try {
    // Create the Guest project
    members.map(async (member) => {
      const res = await db.guestProject.create({
        data: {
          projectLink: projectData.loginLink,
          projectName: projectData.projectName,
          guestName: member.name,
          projectOwner: projectData.projectOwner,
          gustId: member.id,
          ownerId: projectData.projectOwnerId,
        },
      });
      console.log(res);
    });
    const res = await resend.batch.send(mails);
    console.log(res);
  } catch (error) {
    console.log(error);
    return null;
  }
}
export interface GeneralMailProps {
  subject: string;
  body: string;
  email: string | string[];
  recipientName: string;
  files?: FileProps[];
}
export async function sendSingleEmail(mailData: GeneralMailProps) {
  const { subject, body, email, recipientName, files } = mailData;
  try {
    // send the mail
    const { data, error } = await resend.emails.send({
      from: "JB Web Developer <jb@desishub.com>",
      to: email,
      subject,
      html: sendGeneralEmail({ subject, body, recipientName }),
      attachments: files
        ? files.map((item) => {
            return {
              path: item.url,
              filename: item.title,
            };
          })
        : undefined,
    });

    if (error) {
      console.log(error);
      return {
        error: error,
        status: 500,
        data: null,
      };
    }
    console.log(data);
    return {
      error: null,
      status: 200,
      data,
    };
  } catch (error) {
    console.log(error);
  }
}
export async function sendToClients(mailData: GeneralMailProps) {
  const { subject, body, email } = mailData;
  const emails = email as string[];
  try {
    // send the mail
    const { data, error } = await resend.batch.send(
      emails.map((mail) => {
        const recipientName = mail.split("@")[0];
        return {
          from: "JB Web Developer <jb@desishub.com>",
          to: mail,
          subject,
          html: sendToClientList({ subject, body, recipientName }),
        };
      })
    );

    if (error) {
      console.log(error);
      return {
        error: error,
        status: 500,
        data: null,
      };
    }
    console.log(data);
    return {
      error: null,
      status: 200,
      data,
    };
  } catch (error) {
    console.log(error);
  }
}
export async function sendToMailList(mailData: GeneralMailProps) {
  const { subject, body, email } = mailData;
  const emails = email as string[];
  console.log(emails);

  try {
    // send the mail
    const { data, error } = await resend.batch.send(
      emails.map((mail) => {
        const recipientName = mail.split("@")[0];
        return {
          from: "JB Web Developer <jb@desishub.com>",
          to: mail,
          subject,
          html: sendToEmailList({ subject, body, recipientName }),
        };
      })
    );

    if (error) {
      console.log(error);
      return {
        error: error,
        status: 500,
        data: null,
      };
    }
    console.log(data);
    return {
      error: null,
      status: 200,
      data,
    };
  } catch (error) {
    console.log(error);
  }
}
