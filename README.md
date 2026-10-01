# Gwent Desktop

A standalone, desktop port of the Gwent Classic minigame from The Witcher 3: Wild Hunt, built with Electron.js.

## Features
- **Standalone Desktop App:** Enjoy Gwent as a native desktop application.
- **Persistent Fullscreen:** Automatically opens in fullscreen mode and remembers your preference via a built-in settings toggle.
- **Smoother Animations:** Overhauled UI and card animations with buttery smooth cubic-bezier transitions.
- **Original Experience:** Authentic rules and card mechanics true to the original minigame.

## Project Structure
```text
gwent-desktop/
├── package.json
├── src/
│   ├── main/                 # Electron main process
│   │   ├── main.js           # App entry point
│   │   └── settings.js       # Persistent user settings
│   └── renderer/             # Frontend UI (HTML, CSS, JS)
│       ├── index.html        
│       ├── assets/           # Images, SVGs, and SFX
│       ├── css/              # Stylesheets
│       └── js/               # Game logic modules
```

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Navigate to the project directory:
   ```bash
   cd gwent-desktop
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App
Start the Electron app in development mode:
```bash
npm start
```
