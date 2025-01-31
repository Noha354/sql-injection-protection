# SQL Injection Protection in Our Application

## Introduction

SQL injection (SQLi) is a common web security vulnerability that allows an attacker to manipulate SQL queries by injecting malicious SQL code through user input fields. Our application implements strong security measures to prevent SQLi attacks using middleware and parameterized queries.

---

## How SQL Injection is Blocked

Our application ensures security through:

1. **Middleware Protection** - A middleware function scans and sanitizes incoming requests to block SQLi attempts.
2. **Parameterized Queries** - Prepared statements prevent malicious SQL code from being executed.
3. **Input Validation & Sanitization** - Ensuring only valid data is processed.

---

## Middleware Protection

The middleware is applied to secure endpoints where database interactions occur. It intercepts requests and checks for malicious patterns.

### Middleware Function (Example in Next.js API Route)

```typescript
import { NextRequest, NextResponse } from 'next/server';

// Simple SQL Injection Pattern Check
const sqlInjectionPatterns = [
  /('.+--)|(;.+--)|(OR.+=.+)/i,  // Detects common SQLi patterns
  /UNION.*SELECT/i,                        // Detects UNION-based attacks
  /INSERT.*INTO/i,                         // Detects INSERT injections
  /DELETE.*FROM/i,                         // Detects DELETE injections
  /DROP.*TABLE/i                            // Detects DROP table attacks
];

export function middleware(req: NextRequest) {
  try {
    const urlParams = new URL(req.url).searchParams;
    for (const [key, value] of urlParams.entries()) {
      if (sqlInjectionPatterns.some(pattern => pattern.test(value))) {
        return NextResponse.json({ message: "SQL Injection attempt detected!" }, { status: 403 });
      }
    }
    const body = req.body ? JSON.parse(req.body) : {};
    for (const key in body) {
      if (typeof body[key] === 'string' && sqlInjectionPatterns.some(pattern => pattern.test(body[key]))) {
        return NextResponse.json({ message: "SQL Injection attempt detected!" }, { status: 403 });
      }
    }
  } catch (error) {
    console.error("Middleware error:", error);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/secure-endpoint'],
};
```

### How the Middleware Works:

- Parses the request body and URL parameters to extract all values.
- Checks the input against common SQLi patterns.
- Blocks the request with a `403 Forbidden` response if a pattern matches.
- Allows safe requests to proceed.

---

## Using Parameterized Queries for SQL Injection Prevention

A parameterized query ensures that user inputs are treated as **data**, not executable SQL commands.

### Example: Secure Login Query

```typescript
import { NextResponse } from "next/server";
import { Client } from "pg";

export async function POST(req: Request) {
  const client = new Client({
    connectionString: process.env.NEXT_PUBLIC_DATABASE_URL,
  });

  try {
    const body = await req.json();
    const { email, password } = body;

    // Secure query with parameterized inputs
    const query = "SELECT * FROM users WHERE email = $1 AND password = $2";
    const values = [email, password];

    await client.connect();
    const res = await client.query(query, values);

    if (res.rows.length > 0) {
      return NextResponse.json({
        message: "Login successful",
        user: res.rows[0],
      });
    } else {
      return NextResponse.json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  } finally {
    await client.end();
  }
}
```

### Example: Insecure Query (Vulnerable to SQL Injection)

```typescript
const query = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`;
```

### Comparison:

| Query Type               | Security Level | Risk                  |
| ------------------------ | -------------- | --------------------- |
| **Parameterized Query**  | Secure         | No SQL injection risk |
| **String Concatenation** | Vulnerable     | Allows SQL injection  |

### Why Parameterized Queries are Secure:

- **Precompiled Queries:** The SQL engine treats input values as data, not SQL commands.
- **Prevents Injection:** Even if an attacker tries to inject malicious SQL, it is treated as a string, preventing execution.
- **Performance Optimization:** Prepared queries are optimized and reused.

---

## Testing the Protection

You can test by entering malicious SQL in input fields:

| Malicious Input                 | Expected Behavior                                 |
| ------------------------------- | ------------------------------------------------- |
| `' OR '1'='1' --`               | Middleware blocks with `403 Forbidden`            |
| `'; DROP TABLE users; --`       | Middleware blocks with `403 Forbidden`            |
| `<script>alert('XSS')</script>` | Middleware blocks if XSS filtering is implemented |

---

## Conclusion

By combining middleware-based filtering and parameterized queries, our application effectively mitigates SQL injection attacks. This ensures a robust and secure authentication system, protecting sensitive user data from unauthorized access.
