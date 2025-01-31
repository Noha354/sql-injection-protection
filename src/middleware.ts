import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Common SQL injection patterns
const sqlInjectionPatterns = [
  /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bDELETE\b|\bUPDATE\b)/i,
  /(--|#|\/\*|\*\/)/, // Comment-based SQL injection
  /(\bDROP\b|\bALTER\b|\bEXEC\b|\bOR\b|\bAND\b)/i, // Additional risky keywords
  /('.+--|".+--|;.*--)/, // Termination-based injection
];

export async function middleware(req: NextRequest) {
  if (req.method === "POST") {
    try {
      const body = await req.json();
      const values = Object.values(body).join(" ");

      if (sqlInjectionPatterns.some((pattern) => pattern.test(values))) {
        console.warn("🚨 SQL Injection Attempt Blocked:", values);
        return NextResponse.json(
          {
            error:
              "Malicious input detected. 🚨 SQL Injection Attempt Blocked by middleware",
          },
          { status: 403 }
        );
      }
    } catch (error) {
      console.error("Error parsing request body:", error);
    }
  }

  return NextResponse.next();
}

// ✅ Apply middleware ONLY to the secure endpoints
export const config = {
  matcher: ["/api/secure-login"],
};
