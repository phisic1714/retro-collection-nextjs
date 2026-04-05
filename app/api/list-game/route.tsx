// /app/api/game-list/route.ts
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  const filePath = path.join(process.cwd(), "app/util/gameList.json");
  const json = fs.readFileSync(filePath, "utf-8");

  return NextResponse.json(JSON.parse(json));
}
