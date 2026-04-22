# 🔮 Grid Tactics (Tácticas de la Cuadrícula)

[](https://opensource.org/licenses/MIT)
[](https://phaser.io/)
[](https://vitejs.dev/)
[](https://github.com/javtl/grid-tactics)

**Grid Tactics** is a web-based strategic puzzle-RPG hybrid. It combines a 4x4 resource-merging grid with turn-based tactical combat. Players must merge resources (Wood, Stone, Mana) to generate Action Points and stats to defeat enemies in a progressive world map.

-----

## 🏗️ Technical Architecture

This project is built with a **decoupled architecture** mindset, following a strict **Separation of Concerns (SoC)**. The core game logic is 100% independent of the rendering engine.

  - **Engine:** [Phaser 3](https://phaser.io/) (WebGL/Canvas).
  - **Architecture:** Pure JavaScript Logic (`/core`) + Phaser Rendering Layer (`/ui`).
  - **Core Loop:** **Merge Phase** (Puzzle) → **Sync Phase** (Resource Transfer) → **Combat Phase** (Turn-based RPG).

-----

## ✅ Project Milestone: Sprint 2 - Combat & AI Core (v1.1.0)

We have successfully completed the second major phase, integrating a functional combat engine and a reactive enemy AI.

### Completed in Sprint 2:

  - [x] **GT-06: State Machine:** Implementation of `GameManager` to control Phase Transitions (Puzzle ↔ Combat).
  - [x] **GT-07: Combat Engine:** Developed `CombatManager` and `Entity` classes with damage mitigation and defense logic.
  - [x] **GT-08: Enemy AI v1:** Created behavioral logic for the "Goblin Raider", including a decision tree for attack/defense stances based on HP thresholds.
  - [x] **GT-09: Resource Sync:** Established the bridge between Grid merges and Combat stats (Wood → ATK, Stone → DEF).

### 🔜 Upcoming: Sprint 3 - Progression & VFX

  - [ ] **GT-10: Health Bars & UI:** Dynamic visual feedback for combat damage.
  - [ ] **GT-11: Loot System:** Rewards for defeating enemies.
  - [ ] **GT-12: VFX & Particles:** Visual juice for merges and impacts.

-----

## 🧠 Core Mechanics: Resource Synchronization

The game features a unique link between the puzzle board and the combat results:

| Resource | Action | Combat Effect |
| :--- | :--- | :--- |
| **WOOD** (Madera) | Merge | Accumulates **Attack Bonus** for the next turn. |
| **STONE** (Piedra) | Merge | Grants immediate **Temporary Defense**. |
| **LEVELS** | Scaling | Higher card levels multiply resource efficiency (Level \* 5). |

-----

## 🛠️ Development Setup

### Prerequisites

  - [Node.js](https://nodejs.org/) (Latest LTS)
  - npm

### Quick Start

1.  Clone the repository:

<!-- end list -->

```bash
git clone https://github.com/javtl/grid-tactics.git
```

2.  Install & Start:

<!-- end list -->

```bash
npm install && npm run dev
```

-----

## 📈 Roadmap

  - **Phase 1 (COMPLETED):** Core Foundation, UI Rendering, and Drag & Drop.
  - **Phase 2 (COMPLETED):** Combat Engine, Enemy AI, and Resource Sync.
  - **Phase 3:** Progression, Visual Feedback (HP Bars), and Game Over/Victory states.
  - **Phase 4:** Polish, SFX, and Map Nodes.

## ⚖️ License

This project is licensed under the **MIT License**.

-----

*Developed with a focus on Clean Code, Design Patterns (Mediator, State), and performance optimization.*

-----
