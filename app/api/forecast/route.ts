import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { geocodeCity, getForecast } from "@/lib/weather";
import { rateLimit } from "@/lib/ratelimit";

export async function GET(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { success } = rateLimit(`forecast:${user.userId}`, 20, 60 * 1000);
  if (!success) {
    return NextResponse.json(
      { success: false, error: "Rate limit exceeded." },
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
    } else {
      const location = await geocodeCity(city!);
      if (!location) {
        return NextResponse.json(
          { success: false, error: `City "${city}" not found.` },
          { status: 404 }
        );
      }
      latitude = location.lat;
      longitude = location.lon;
    }

    const forecast = await getForecast(latitude, longitude);

    return NextResponse.json({ success: true, data: forecast }, { status: 200 });
  } catch (error) {
    console.error("Forecast API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch forecast data." },
      { status: 500 }
    );
  }
}
