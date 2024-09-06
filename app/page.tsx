import Image from "next/image";
import { Nostalgist } from 'nostalgist'

const getGameData = async () => {
  // try {
  const res = await fetch(process.env.URL + "/database", { cache: "no-store" })
  return res.json()
  // } catch (error) {
  // console.log(error)
  // }
}

export default async function Home() {
  const Game = await getGameData()
  return (
    <main>
      <div className="flex flex-row grid grid-cols-4 gap-4 flex items-center">

        <>{Game.map((t: any) => (
          <div className="border border-current	 rounded-lg shadow-2xl text-center">
            <img src={t.ImageURL} alt="Game Cover" className="object-contain  h-48 w-96"/>
            {t.Title}</div>

        ))}
        </>
      </div>

    </main>
  );
}
