# Hardware Schematic

Representative circuit for one office room (2 fans + 3 lights) using ESP32.

- Live simulation: https://wokwi.com/projects/468546753796945921
- `sketch.ino` — firmware logic (reads switch state, drives LED, calculates power draw)
- `diagram.json` — Wokwi circuit layout (importable directly into wokwi.com)

## Pin Mapping

| Component | ESP32 Pin | Type |
|---|---|---|
| Light 1 switch | GPIO 12 | Input (pull-up) |
| Light 2 switch | GPIO 14 | Input (pull-up) |
| Light 3 switch | GPIO 27 | Input (pull-up) |
| Fan 1 switch | GPIO 25 | Input (pull-up) |
| Fan 2 switch | GPIO 26 | Input (pull-up) |
| Light 1 LED (red) | GPIO 2 | Output |
| Light 2 LED (red) | GPIO 4 | Output |
| Light 3 LED (red) | GPIO 5 | Output |
| Fan 1 LED (blue) | GPIO 18 | Output |
| Fan 2 LED (blue) | GPIO 19 | Output |