cd /d %~dp0

echo 🚀 Running Next.js Project...

start "" cmd /c "npm run dev"
timeout /t 2 >nul
start http://localhost:3000

exit