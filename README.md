# 🔮 Grid Tactics (Tácticas de la Cuadrícula)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Phaser](https://img.shields.io/badge/Engine-Phaser_3-informational?style=flat&logo=phaser)](https://phaser.io/)
[![Vite](https://img.shields.io/badge/Tooling-Vite-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![Version](https://img.shields.io/badge/Version-1.0.0-blue)](https://github.com/javtl/grid-tactics)

**Grid Tactics** is a web-based strategic puzzle-RPG hybrid. It combines a 4x4 resource-merging grid with turn-based tactical combat. Players must merge resources (Wood, Stone, Mana) to generate Action Points and stats to defeat enemies in a progressive world map.

---

## 🏗️ Technical Architecture

This project is built with a **decoupled architecture** mindset, following a strict **Separation of Concerns (SoC)**. The core game logic is 100% independent of the rendering engine.

- **Engine:** [Phaser 3](https://phaser.io/) (WebGL/Canvas) for high-performance rendering.
- **Pattern:** MVC-inspired (Model-View-Controller).
    - `/core`: **The Model.** Pure logic (Grid, Cards). No dependencies on Phaser.
    - `/ui`: **The View/Controller.** Phaser-specific classes (UIManager, InputHandler) that translate logic into visuals.
    - `/data`: Static configurations and game balancing constants.

---

## 🚀 Project Milestone: Sprint 1 - Core Foundation & Interaction (v1.0.0)

We have successfully completed the foundational phase of the project, establishing a stable and interactive game loop.

### ✅ Completed in Sprint 1:
- [x] **GT-01: Architecture Setup:** Environment configuration with Vite and ES6 modular structure.
- [x] **GT-02: Data Layer:** Resource definitions and card scaling system.
- [x] **GT-03: Logic Layer:** 4x4 Grid system with coordinate mapping and cell state management.
- [x] **GT-04: Visual Layer:** Implementation of `UIManager` for dynamic rendering and card animations (Tweens).
- [x] **GT-05: Interaction System:** High-performance **Drag & Drop** mechanics with z-index management and snapback effects.

### 🔜 Upcoming: Sprint 2 - Gameplay & Progression
- [ ] **GT-06: Merge Logic:** Evaluation of card types for level-up mechanics.
- [ ] **GT-07: Resource Evolution:** Progressive stat scaling.
- [ ] **GT-08: Automatic Refill:** Dynamic board replenishment system.

---

## 🛠️ Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- npm

### Installation
1. Clone the repository:
```bash
git clone [https://github.com/javtl/grid-tactics.git](https://github.com/javtl/grid-tactics.git)
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

---

## 📈 Roadmap

- **Phase 1 (COMPLETED):** Core Foundation, UI Rendering, and Drag & Drop.
- **Phase 2:** Merge Mechanics, Combat Engine, and Enemy AI.
- **Phase 3:** Progression System (Map Nodes & Persistent Save).
- **Phase 4:** Polish, VFX, and SDK Integrations.

## ⚖️ License

This project is licensed under the **MIT License**.

-----
*Developed as a professional portfolio project focusing on clean code, performance, and game design patterns.*
```

¡Con este `README`, tu repositorio ya tiene una pinta increíble! **Sprint 1: Mission Accomplished.** 👾🏆
