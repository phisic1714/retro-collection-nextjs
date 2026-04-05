"use client";
import Image from "next/image";
import { Nostalgist } from "nostalgist";
import { useEffect, useState } from "react";
import gameList from "./util/gameList.json";
import { cn } from "@udecode/cn";
import { Button, TextField } from "@mui/material";
import { filter, sortBy, uniqBy } from "lodash";
import { readFile } from "node:fs";

export default function Home() {
  const [gameList, setGameList] = useState<{
    game_count: number;
    games: any[];
  }>({
    game_count: 0,
    games: [],
  });
  const [search, setSearch] = useState<string>("");
  const openGame = (appid: any) => {
    window.open(`steam://rungameid/${appid}`);
  };
  const getGameData = async (steamid: string) => {
    try {
      const res = await fetch(
        `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=FCC3F2B22BC76F9C8FCBEFFA2630E355&steamid=${steamid}&format=json&include_appinfo=true`,
      );
      const posts = await res.json();
      console.log("posts :>> ", posts);
      // setGameList(posts?.response);
      return posts?.response;
    } catch (error) {
      console.log(error);
    }
  };
  const fetchApi = async () => {
    const [list1, list2, list3] = await Promise.all([
      getGameData("76561198159881009"),
      getGameData("76561199223927734"),
      getGameData("76561199223700662"),
    ]);
    const combinedGames = uniqBy(
      [
        ...(list1?.games ?? []),
        ...(list2?.games ?? []),
        ...(list3?.games ?? []),
      ],
      "appid",
    );
    const jsonData = {
      game_count: combinedGames.length,
      games: sortBy(combinedGames, ["name"]),
    };
    await fetch("/api/save-game", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    });
    setGameList(jsonData);
  };
  const lists = filter(gameList?.games, function (o: any) {
    const name = String(o?.name ?? "").toLowerCase();
    const searchValue = search.toLowerCase();

    return search ? name.includes(searchValue) : name;
  });
  useEffect(() => {
    fetchApi();
  }, []);

  return (
    <>
      <TextField
        className="flex flex-1 w-"
        placeholder="ค้นหาเกม"
        value={search}
        onChange={(e: any) => setSearch(e.target.value)}
      ></TextField>
      <div className="grid grid-cols-4 gap-4  ">
        {lists?.map((v: any) => (
          <div key={v?.appid}>
            {v?.name}
            <Button
              onClick={() => {
                openGame(v?.appid);
              }}
            >
              <img
                src={`https://steamcdn-a.akamaihd.net/steam/apps/${v?.appid}/header.jpg`}
                onError={(e) => console.log("e :>> ", e)}
                alt={v?.name}
              ></img>
            </Button>
          </div>
        ))}
      </div>
    </>
  );
}
