# TaroMausam

A production-ready full-stack Weather Forecasting Web Application built with Next.js 14 (App Router), Aceternity UI-inspired components, PostgreSQL, Prisma, and JWT authentication.

## Features

- **Real-Time Weather** — Temperature, humidity, wind, pressure, visibility via OpenWeather API
- **5-Day Forecast** — Animated horizontal cards with min/max temps and precipitation probability
- **Air Quality Index** — Color-coded AQI with PM2.5, PM10, NO2, ozone breakdown
- **Interactive Map** — Leaflet dark map with custom animated markers (SSR-disabled)
- **JWT Authentication** — Sign up, sign in, bcrypt password hashing, HTTP-only cookies
- **Favorite Cities** — Save cities to PostgreSQL, loaded per user on login
- **Recent Searches** — Locally stored recent city searches
- **Auto-detect Location** — Browser Geolocation API support
- **C / F Toggle** — Switch temperature units across all displays
- **Rate Limiting** — In-memory rate limiting on all API routes
- **Glassmorphism UI** — Dark glassmorphism design with Framer Motion animations

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Database | PostgreSQL |
| ORM | Prisma v5 |
| Auth | JWT + bcrypt |
| Validation | Zod |
| Maps | Leaflet (SSR-disabled) |
| Weather API | OpenWeather API |

## Project Structure

```
/app
  /signup             Sign up page
  /signin             Sign in page
  /dashboard          Main weather dashboard
  /api
    /auth
      /signup         POST: Create user
      /signin         POST: Authenticate user
      /logout         POST: Clear auth cookie
      /me             GET: Current user info
    /weather          GET: Current weather
    /forecast         GET: 5-day forecast
    /pollution        GET: Air quality data
    /favorites        GET/POST/DELETE: Favorite cities

/components
  /ui
    background-beams.tsx
    spotlight.tsx
    floating-navbar.tsx
    animated-button.tsx
    glass-card.tsx
    search-input.tsx
    grid-background.tsx
    card-hover-effect.tsx
    input.tsx
  CurrentWeatherCard.tsx
  ForecastSection.tsx
  AQICard.tsx
  WeatherMap.tsx        Leaflet map (dynamic import, ssr:false)
  WeatherIcon.tsx
  Providers.tsx

/lib
  prisma.ts             Prisma singleton
  auth.ts               JWT + bcrypt utilities
  weather.ts            OpenWeather API wrappers
  ratelimit.ts          In-memory rate limiter
  utils.ts              cn() Tailwind helper

/prisma
  schema.prisma         User, FavoriteCity, RecentSearch models

/middleware.ts          JWT route protection
/types/index.ts         Shared TypeScript types
```

## Setup Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/weather_app"
JWT_SECRET="your-super-secret-jwt-key-at-least-32-chars"
OPENWEATHER_API_KEY="your-api-key-from-openweathermap.org"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Get your OpenWeather API key at https://openweathermap.org/api (free tier: 60 calls/minute).

Run Prisma migrations:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 3. Run locally

```bash
npm run dev
```

Open http://localhost:3000

### Optional: Prisma Studio

```bash
npx prisma studio
```

## API Reference

### Auth (Public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/signup | Create account |
| POST | /api/auth/signin | Sign in |
| POST | /api/auth/logout | Sign out |
| GET | /api/auth/me | Get current user |

### Weather (Protected — requires auth cookie)

| Method | Endpoint | Params | Description |
|--------|----------|--------|-------------|
| GET | /api/weather | city or lat+lon | Current weather |
| GET | /api/forecast | city or lat+lon | 5-day forecast |
| GET | /api/pollution | city or lat+lon | Air quality |
| GET | /api/favorites | — | List favorites |
| POST | /api/favorites | body: {city,country,lat,lon} | Add favorite |
| DELETE | /api/favorites | ?id= | Remove favorite |

## Security

- JWT tokens signed with HS256, 7-day expiry
- bcrypt password hashing (12 salt rounds)
- HTTP-only cookies (XSS-safe)
- SameSite=lax (CSRF protection)
- Zod input validation on all endpoints
- Generic error messages to prevent user enumeration
- Rate limiting: 5 signup/min, 10 signin/min, 30 weather/min per IP/user
- API key never exposed to client
