@echo off
REM Windows cwd shim: `npx @kensaurus/cursor-kenji` from this clone
REM ends up as `cmd /c cursor-kenji`, which looks in the current directory.
node "%~dp0bin\cursor-kenji.js" %*
