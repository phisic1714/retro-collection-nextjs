export const getSteamGames = async (steamid: string) => {
  try {
    const res = await fetch(
      `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=FCC3F2B22BC76F9C8FCBEFFA2630E355&steamid=${steamid}&format=json&include_appinfo=true`,
    );
    const posts = await res.json();
    // setGameList(posts?.response);
    return posts?.response;
  } catch (error) {
    console.log(error);
  }
};
export const updateData = async (jsonData: any) => {
  try {
    const response = await fetch("../api/save-game", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    });
    console.log("res :>> ", response);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error reading JSON:", error);
  }
};
export const getLoadData = async () => {
  try {
    const response = await fetch("../api/list-game");
    console.log("res :>> ", response);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error reading JSON:", error);
  }
};
