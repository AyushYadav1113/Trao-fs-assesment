import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const addFavoriteSchema = z.object({
  city: z.string().min(1).max(100).trim(),
  country: z.string().max(10).optional(),
  lat: z.number().optional(),
  lon: z.number().optional(),
});

export async function GET() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const favorites = await prisma.favoriteCity.findMany({
    where: { userId: user.userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ success: true, data: favorites });
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const validation = addFavoriteSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { success: false, error: "Invalid data", details: validation.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await prisma.favoriteCity.findFirst({
    where: { userId: user.userId, city: { equals: validation.data.city, mode: "insensitive" } },
  });

  if (existing) {
    return NextResponse.json({ success: false, error: "City already in favorites" }, { status: 409 });
  }

  const favorite = await prisma.favoriteCity.create({
    data: { userId: user.userId, ...validation.data },
  });

  return NextResponse.json({ success: true, data: favorite }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });
  }

  await prisma.favoriteCity.deleteMany({
    where: { id, userId: user.userId },
  });

  return NextResponse.json({ success: true, message: "Removed from favorites" });
}
