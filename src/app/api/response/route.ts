import { NextResponse } from "next/server";
import { Pool } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const timestamp = new Date().toISOString();

    // Check for Database URL (Neon / Netlify DB)
    const databaseUrl =
      process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;

    if (databaseUrl) {
      // Connect to Postgres
      const pool = new Pool({ connectionString: databaseUrl });

      // Create table if it doesn't exist
      await pool.query(`
        CREATE TABLE IF NOT EXISTS responses (
          id SERIAL PRIMARY KEY,
          accepted BOOLEAN NOT NULL,
          timestamp TEXT NOT NULL
        )
      `);

      // Insert response
      await pool.query(
        "INSERT INTO responses (accepted, timestamp) VALUES ($1, $2)",
        [body.accepted, timestamp],
      );

      // Close connection (serverless pool)
      await pool.end();

      return NextResponse.json({ success: true, method: "database" });
    } else {
      // Fallback to local JSON file (Development mode without DB)
      const dataDir = path.join(process.cwd(), "data");
      const filePath = path.join(dataDir, "responses.json");

      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
      }

      let responses = [];
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        responses = JSON.parse(fileContent);
      }

      const newResponse = { ...body, timestamp };
      responses.push(newResponse);
      fs.writeFileSync(filePath, JSON.stringify(responses, null, 2));

      return NextResponse.json({ success: true, method: "local_file" });
    }
  } catch (error) {
    console.error("Error saving response:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save response" },
      { status: 500 },
    );
  }
}
