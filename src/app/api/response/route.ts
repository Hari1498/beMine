import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const body = await request.json();
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
      timestamp: new Date().toISOString(),
    };

    responses.push(newResponse);
    fs.writeFileSync(filePath, JSON.stringify(responses, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to save response" },
      { status: 500 },
    );
  }
}
