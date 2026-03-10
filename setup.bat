@echo off
echo ==============================
echo   SkillSphere — Setup Script
echo ==============================
echo.

echo [1/4] Installing backend dependencies...
cd backend
call npm install
echo Done!

echo.
echo [2/4] Installing frontend dependencies...
cd ..\frontend
call npm install
echo Done!

echo.
echo ==============================
echo   Setup Complete!
echo ==============================
echo.
echo Now open TWO terminals and run:
echo.
echo   Terminal 1 (backend):
echo     cd backend
echo     npm run dev
echo.
echo   Terminal 2 (frontend):
echo     cd frontend
echo     npm start
echo.
echo Don't forget to add your API key to backend\.env !
echo.
pause
