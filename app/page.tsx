import Image from "next/image";
import { Nostalgist } from 'nostalgist'

const getGameData = async () => {
  try {
    const res = await fetch(process.env.URL+"/database/", { cache: "no-store" })
    return res.json()
  } catch (error) {
    console.log(error)
  }
}

export default async function Home() {

  const Game  = await getGameData()
  console.log(Game)
  return (
    <main>

      <>{Game.map((t:any) => (
        <div className="flex flex-row grid grid-cols-4 gap-4">
          <div className="border border-current	 rounded-lg shadow-2xl">{t.Title}</div>

        </div>
      ))}
      </>
    </main>
  );
}
