// "use server";

// import jwt from "jsonwebtoken";

// export interface TokenData {
//   roomId: string;
//   userName: string;
//   role: string;
// }

// export async function generateSecureToken(data: TokenData) {
//   const { roomId, userName, role } = data;

//   const secret = process.env.HMS_SECRET;
//   const apiKey = process.env.NEXT_PUBLIC_HMS_API_KEY;

//   if (!secret || !apiKey) {
//     return { error: "Missing HMS API credentials", status: 500, data: null };
//   }

//   try {
//     const token = jwt.sign(
//       {
//         access_key: apiKey,
//         room_id: roomId,
//         user_id: userName,
//         role: role,
        
//       },
//       secret,
//       { algorithm: "HS256", expiresIn: "24h" },
//     );

//     return {
//       error: null,
//       status: 200,
//       token: token,
//     };
//   } catch (error) {
//     return {
//       error: "Token generation failed",
//       status: 200,
//       token: null,
//     };
//   }
// }

// export async function createRoom(roomName: string) {
//   const secret = process.env.HMS_SECRET;

//   console.log("Room Name --", roomName);

//   const token= jwt.sign({
//     access_key: apiKey,
//     type:"management"

//   },

//   secret,
//   {algorithm:"HS256",expiresIn:"1h"}


// )

//   try {
//     const response = await fetch("https://api.100ms.live/v2/rooms", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },

//       body: JSON.stringify({
//         name: roomName,
//         description: "Doctor-Patient Appoinment Room",
//         template: "default_template",
//       }),
//     });

//     const roomData = await response.json();

//     console.log("RoomData-->", roomData);

//     if (response.ok) {
//       return { roomId: roomData.id, status: 200, error: null };
//     } else {
//       return { roomId: roomData.id, status: 500, error: roomData };
//     }
//   } catch (error) {
//     return { roomId: null, status: 500, error: "Room creation failed" };
//   }
// }







"use server";

interface CreateRoomResult {
  roomId: string | null;
  error: any;
}

interface TokenResult {
  token: string | null;
  error: any;
}

/**
 * ROOM OLUŞTURMA (v2 API)
 */
export async function createRoom(roomName: string): Promise<CreateRoomResult> {
  const managementToken = process.env.HMS_MANAGEMENT_TOKEN;
  const templateId = process.env.HMS_TEMPLATE_ID;

  if (!managementToken || !templateId) {
    return { roomId: null, error: "Missing HMS credentials" };
  }

  try {
    const response = await fetch("https://api.100ms.live/v2/rooms", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${managementToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: roomName,
        template_id: templateId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { roomId: null, error: data };
    }

    return { roomId: data.id, error: null };
  } catch (error) {
    return { roomId: null, error };
  }
}

/**
 * AUTH TOKEN ALMA (v2 API - DOĞRU IMPLEMENTASYON)
 */



interface TokenResult {
  token: string | null;
  error: any;
}

import jwt from "jsonwebtoken";


// export async function generateAuthToken(
//   roomId: string,
//   role: "host" | "guest"
// ): Promise<TokenResult> {
//   try {
//     const accessKey = process.env.HMS_API_KEY!;
//     const secret = process.env.HMS_SECRET!;

//     const payload = {
//       access_key: accessKey,
//       room_id: roomId,
//       user_id: `${role}-${Date.now()}`,
//       role: role,
//       type: "app",
//       version: 2,
//       iat: Math.floor(Date.now() / 1000),
//       nbf: Math.floor(Date.now() / 1000),
//     };

//     const token = jwt.sign(payload, secret, {
//       algorithm: "HS256",
//       expiresIn: "24h",
//       jwtid: Math.random().toString(36).substring(2),
//     });

//     return { token, error: null };
//   } catch (error: any) {
//     return { token: null, error: error.message };
//   }
// }




export async function generateAuthToken(
  roomId: string,
  role: "host" | "guest"
): Promise<TokenResult> {
  try {
    const accessKey = process.env.HMS_API_KEY!;
    const secret = process.env.HMS_SECRET!;

    const now = Math.floor(Date.now() / 1000);

    const payload = {
      access_key: accessKey,
      room_id: roomId,
      user_id: `${role}-${Date.now()}`,
      role: role,
      type: "app",
      version: 2,
      iat: now - 5,        // 5 saniye geriden başlat
      exp: now + 60 * 60,  // 1 saat
    };

    const token = jwt.sign(payload, secret, {
      algorithm: "HS256",
      jwtid: crypto.randomUUID(),
    });

    return { token, error: null };
  } catch (error: any) {
    return { token: null, error: error.message };
  }
}


