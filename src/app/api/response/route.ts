import { NextResponse } from "next/server";
import { Pool } from "@neondatabase/serverless";
import fs from "node:fs";
import path from "node:path";

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
          timestamp TEXT NOT NULL,
          message TEXT,
          media_content TEXT,
          media_type TEXT
        )
      `);

      // Auto-migrate: Add columns if they don't exist (for existing tables)
      try {
        await pool.query(
          `ALTER TABLE responses ADD COLUMN IF NOT EXISTS message TEXT`,
        );
        await pool.query(
          `ALTER TABLE responses ADD COLUMN IF NOT EXISTS media_content TEXT`,
        );
        await pool.query(
          `ALTER TABLE responses ADD COLUMN IF NOT EXISTS media_type TEXT`,
        );
      } catch (e) {
        // Ignore errors if columns exist
      }

      // Insert response
      await pool.query(
        "INSERT INTO responses (accepted, timestamp, message, media_content, media_type) VALUES ($1, $2, $3, $4, $5)",
        [
          body.accepted,
          timestamp,
          body.message || "",
          body.media_content || "",
          body.media_type || "",
        ],
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

      const newResponse = {
        ...body,
        timestamp,
        message: body.message,
        media_content: body.media_content ? "(Base64 Media Content)" : null,
      };
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
export async function GET() {
  try {
    const databaseUrl =
      process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;

    if (databaseUrl) {
      const pool = new Pool({ connectionString: databaseUrl });
      // Fetch all responses ordered by ID descending
      const result = await pool.query(
        "SELECT * FROM responses ORDER BY id DESC",
      );
      await pool.end();
      return NextResponse.json(result.rows);
    } else {
      // Local file fallback
      const filePath = path.join(process.cwd(), "data", "responses.json");
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        return NextResponse.json(JSON.parse(fileContent).reverse());
      }
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error("Error fetching responses:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 },
    );
  }
}
