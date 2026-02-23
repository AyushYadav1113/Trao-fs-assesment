import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signToken, createAuthCookieOptions } from "@/lib/auth";
import { rateLimit } from "@/lib/ratelimit";

const signinSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, "Password is required")
    .max(100),
});

export async function POST(request: NextRequest) {
  // Rate limiting - stricter for signin
  const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
  const { success } = rateLimit(`signin:${ip}`, 10, 60 * 1000);

  if (!success) {
    return NextResponse.json(
      { success: false, error: "Too many login attempts. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const validation = signinSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    const user = await prisma.user.findUnique({ where: { email } });

    // Generic error to prevent user enumeration
    const genericError = "Invalid email or password.";

    if (!user) {
      return NextResponse.json(
        { success: false, error: genericError },
        { status: 401 }
      );
    }

    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: genericError },
        { status: 401 }
      );
    }

    const token = signToken({ userId: user.id, email: user.email, name: user.name });

    const response = NextResponse.json(
      {
        success: true,
        message: "Signed in successfully",
        user: { id: user.id, name: user.name, email: user.email },
      },
      { status: 200 }
    );

    response.cookies.set(createAuthCookieOptions(token));

    return response;
  } catch (error) {
    console.error("Signin error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
