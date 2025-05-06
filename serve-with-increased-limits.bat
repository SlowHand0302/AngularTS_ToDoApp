@echo off
echo Setting increased file handle limits for Node.js...
set NODE_OPTIONS=--max-old-space-size=4096 --max-http-header-size=16384
set UV_THREADPOOL_SIZE=64

echo Starting Angular application with increased memory and file handle limits...
call npm run start:high-memory