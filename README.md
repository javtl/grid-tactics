# 🔮 Grid Tactics (Tácticas de la Cuadrícula)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Phaser](https://img.shields.io/badge/Engine-Phaser_3-informational?style=flat&logo=phaser)](https://phaser.io/)
[![Vite](https://img.shields.io/badge/Tooling-Vite-646CFF?style=flat&logo=vite)](https://vitejs.dev/)

**Grid Tactics** is a web-based strategic puzzle-RPG hybrid. It combines a 4x4 resource-merging grid with turn-based tactical combat. Players must merge resources (Wood, Stone, Mana) to generate Action Points and stats to defeat enemies in a progressive world map.

---

## 🏗️ Technical Architecture

This project is built with a **decoupled architecture** mindset, a key focus for professional software engineering. The core game logic is independent of the rendering engine, allowing for better maintainability and potential unit testing.

- **Engine:** [Phaser 3](https://phaser.io/) for high-performance Canvas 2D rendering.
- **Tooling:** [Vite](https://vitejs.dev/) for fast development and optimized ES6 bundling.
- **Language:** JavaScript (ES6+ Modules).
- **Pattern:** Separation of Concerns (SoC).
    - `/core`: Pure logic classes (Grid, Combat, Cards).
    - `/scenes`: Phaser-specific orchestration and visuals.
    - `/data`: Static configurations and game balancing constants.

---

## 🚀 Current Status: [Sprint 1 - Core Foundation]

The project is currently in its early development phase (**MVP Phase**).

- [x] **GT-01: Architecture Setup:** Environment configuration and project skeleton.
- [x] **GT-02: Data Layer:** Implementing card definitions and resource scaling.
- [x] **GT-03: Logic Layer:** Developing the 4x4 grid merging algorithm.
- [ ] Starting Sprint 2...

---

## 🛠️ Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- npm or yarn

### Installation
1. Clone the repository:
```bash
   git clone https://github.com/javtl/grid-tactics.git
```

2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

-----

## 📈 Roadmap & Goals

  - **Phase 1:** Core loop (Merge + Combat).
  - **Phase 2:** Progression (Map Nodes + Saving).
  - **Phase 3:** Monetization (CrazyGames SDK Integration).
  - **Phase 4:** Polish & VFX.

## ⚖️ License

This project is licensed under the **MIT License** - see the [LICENSE](https://www.google.com/search?q=LICENSE) file for details.

-----

*Developed as a professional portfolio project focusing on clean code and game design patterns.*

