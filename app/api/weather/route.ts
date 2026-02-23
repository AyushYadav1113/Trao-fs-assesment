import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { geocodeCity, getCurrentWeather } from "@/lib/weather";
import { rateLimit } from "@/lib/ratelimit";

export async function GET(request: NextRequest) {
  // Auth check
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Rate limiting
  const { success } = rateLimit(`weather:${user.userId}`, 30, 60 * 1000);
  if (!success) {
    return NextResponse.json(
      { success: false, error: "Rate limit exceeded. Please slow down." },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!city && (!lat || !lon)) {
    return NextResponse.json(
      { success: false, error: "Please provide a city name or coordinates." },
      { status: 400 }
    );
  }

  try {
    let latitude: number;
    let longitude: number;

    if (lat && lon) {
      latitude = parseFloat(lat);
      longitude = parseFloat(lon);

      if (isNaN(latitude) || isNaN(longitude)) {
        return NextResponse.json(
          { success: false, error: "Invalid coordinates." },
          { status: 400 }
        );
      }
    } else {
      const location = await geocodeCity(city!);
      if (!location) {
        return NextResponse.json(
          { success: false, error: `City "${city}" not found. Please try again.` },
          { status: 404 }
        );
      }
      latitude = location.lat;
      longitude = location.lon;
    }

    const weather = await getCurrentWeather(latitude, longitude);

    return NextResponse.json({ success: true, data: weather }, { status: 200 });
  } catch (error) {
    console.error("Weather API error:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch weather data.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
