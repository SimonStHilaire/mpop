# !/bin/bash

cd /home/pi/MediaPlayer
node . &

sleep 3

chromium-browser --kiosk --app --new-window --incognito --autoplay-policy=no-user-gesture-required "/home/pi/MediaPlayer/web/index.html" &

amixer set PCM - 100%

unclutter -idle 2 &
