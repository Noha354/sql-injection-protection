import { NextResponse } from "next/server";
import { Client } from "pg";

export async function POST(req: Request) {
  const client = new Client({
    connectionString: process.env.NEXT_PUBLIC_DATABASE_URL,
  });

  try {
    const body = await req.json();
    const { email, password } = body;

    // Vulnerable query
    const query = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`;

    await client.connect();
    const res = await client.query(query);

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
