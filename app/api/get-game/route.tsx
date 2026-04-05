import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const steamid = req.nextUrl.searchParams.get("steamid");

  const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=7D2F717C79F8FD0F1D11BC7A3A5F4CE8&steamid=${steamid}&format=json&include_appinfo=true`;

  const res = await fetch(url);
  const data = await res.json();

  return Response.json(data);
}
