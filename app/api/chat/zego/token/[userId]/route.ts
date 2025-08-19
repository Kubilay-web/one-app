import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;
  const appId = Number(process.env.ZEGO_APP_ID);
  const serverSecret = process.env.ZEGO_SERVER_SECRET!;
  const effectiveTime = 3600;

  const ctime = Math.floor(Date.now() / 1000);
  const expire = ctime + effectiveTime;
  const nonce = Math.floor(Math.random() * 1000000);

  const data = {
    app_id: appId,
    user_id: userId,
    nonce,
    ctime,
    expire,
    payload: "",
  };

  const plainText = JSON.stringify(data);
  const signature = crypto
    .createHmac("sha256", serverSecret)
    .update(plainText)
    .digest("hex");

  const token = Buffer.from(`${plainText}.${signature}`).toString("base64");

  return NextResponse.json({ token, data, signature });
}
