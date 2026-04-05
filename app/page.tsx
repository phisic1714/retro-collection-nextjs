"use client";
import Image from "next/image";
import { Nostalgist } from "nostalgist";
import { useEffect, useState } from "react";
import { cn } from "@udecode/cn";
import { Button, Slider, TextField } from "@mui/material";
import { filter, sortBy, uniqBy } from "lodash";
import { readFile } from "node:fs";
import { getLoadData, getSteamGames, updateData } from "./fetch/fetchData";

export default function Home() {
  const [gameList, setGameList] = useState<{
    game_count: number;
    games: any[];
  }>({
    game_count: 0,
    games: [],
  });
  const [search, setSearch] = useState<string>("");
  const [span, setSpan] = useState<number>(4);
  const colClass: Record<number, string> = {
    2: "grid-cols-2",
    4: "grid-cols-4",
    6: "grid-cols-6",
    8: "grid-cols-8",
    10: "grid-cols-10",
    12: "grid-cols-12",
  };
  const openGame = (appid: any) => {
    window.open(`steam://rungameid/${appid}`);
  };
  const fetchSteamGames = async () => {
    const [list1, list2, list3] = await Promise.all([
      getSteamGames("76561198159881009"),
      getSteamGames("76561199223927734"),
      getSteamGames("76561199223700662"),
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
    await updateData(jsonData);
  };
  const fetchGameJson = async () => {
    const jsonData = await getLoadData();
    setGameList(jsonData);
  };
  const lists = filter(gameList?.games, function (o: any) {
    const name = String(o?.name ?? "").toLowerCase();
    const searchValue = search.toLowerCase();

    return search ? name.includes(searchValue) : name;
  });
  useEffect(() => {
    fetchSteamGames();
  }, []);
  useEffect(() => {
    fetchGameJson();
  }, []);
  return (
    <>
      <TextField
        className="flex flex-1 w-1/2"
        placeholder="ค้นหาเกม"
        value={search}
        onChange={(e: any) => setSearch(e.target.value)}
        size="small"
      ></TextField>
      <Slider
        defaultValue={4}
        min={2}
        max={12}
        step={2}
        value={span}
        onChange={(_, v) => setSpan(v as number)}
        valueLabelDisplay="auto"
        marks
        size="small"
      ></Slider>
      <div className={cn("grid gap-4", colClass?.[span])}>
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
