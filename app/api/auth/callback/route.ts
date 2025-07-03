import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 1️⃣ Exchange code for access_token
  const tokenRes = await fetch(`https://id.twitch.tv/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.TWITCH_CLIENT_ID!,
      client_secret: process.env.TWITCH_CLIENT_SECRET!,
      code,
      grant_type: "authorization_code",
      redirect_uri: process.env.TWITCH_REDIRECT_URI!,
    }),
  });

  if (!tokenRes.ok) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const tokenData = await tokenRes.json();
  const access_token = tokenData.access_token;
  const refresh_token = tokenData.refresh_token;
  const expires_in = tokenData.expires_in;

  // 2️⃣ Get Twitch user info
  const userRes = await fetch(`https://api.twitch.tv/helix/users`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Client-Id": process.env.TWITCH_CLIENT_ID!,
    },
  });

  if (!userRes.ok) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const userData = (await userRes.json()).data[0];
  const providerAccountId = userData.id;

  // 3️⃣ Upsert user in Prisma
  const user = await prisma.user.upsert({
    where: {
      email: userData.email,
    },
    update: {
      name: userData.display_name,
      image: userData.profile_image_url,
      accounts: {
        upsert: {
          where: {
            provider_providerAccountId: {
              provider: "twitch",
              providerAccountId,
            },
          },
          update: {
            access_token,
            refresh_token,
            expires_at: Math.floor(Date.now() / 1000) + expires_in,
          },
          create: {
            provider: "twitch",
            providerAccountId,
            access_token,
            refresh_token,
            expires_at: Math.floor(Date.now() / 1000) + expires_in,
            type: "oauth",
          },
        },
      },
    },
    create: {
      email: userData.email,
      name: userData.display_name,
      image: userData.profile_image_url,
      accounts: {
        create: {
          provider: "twitch",
          providerAccountId,
          access_token,
          refresh_token,
          expires_at: Math.floor(Date.now() / 1000) + expires_in,
          type: "oauth",
        },
      },
    },
  });

  // 4️⃣ Create signed session cookie
  const sessionToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  (await cookies()).set("session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  // 5️⃣ Redirect to /
  return NextResponse.redirect(new URL("/login", req.url));
}
