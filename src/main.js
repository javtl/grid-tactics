import Phaser from 'phaser';
import { Card } from './core/Card';
import { Grid } from './core/Grid';
import { Entity } from './core/Entity';
import { CombatManager } from './core/CombatManager';
import { UIManager } from './ui/UIManager';
import { InputHandler } from './ui/InputHandler';
import { GameManager } from './core/GameManager';
import { GAME_STATES } from './data/GameStates';
import { CARD_TYPES } from './data/CardDefinitions';

const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#1a1a2e',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: {
        create: function() {
            // --- 1. INICIALIZACIÓN DE LOGICA Y DATOS ---
            this.grid = new Grid(4);
            this.gameManager = new GameManager();
            this.combatManager = new CombatManager();

            // [IMPORTANTE] Inyectamos el combatManager en el gameManager
            // Esto permite que el InputHandler lo encuentre fácilmente
            this.gameManager.combatManager = this.combatManager;

            // Configuración del enemigo (Stats para probar el escalado de daño)
            const goblin = new Entity("Goblin Saqueador", 100, 12, 3);
            this.combatManager.setEnemy(goblin);

            // --- 2. INICIALIZACIÓN DE INTERFAZ Y CONTROL ---
            this.ui = new UIManager(this, this.grid);
            this.inputHandler = new InputHandler(this, this.grid, this.ui, this.gameManager);

            // --- 3. CONFIGURACIÓN INICIAL ---
            this.gameManager.setGameState(GAME_STATES.PHASE_PUZZLE);

            // --- 4. RENDERIZADO ---
            this.ui.drawGrid();

            this.add.text(512, 50, 'GRID TACTICS: RESOURCE SYNC ACTIVE', {
                fontSize: '28px',
                fill: '#4ecdc4',
                fontFamily: 'monospace'
            }).setOrigin(0.5);

            // --- 5. SISTEMA DE SPAWNING ---
            const spawnCard = () => {
                const emptyCells = this.grid.getEmptyCells();
                if (emptyCells.length === 0) return;

                const types = Object.values(CARD_TYPES);
                const randomType = types[Math.floor(Math.random() * types.length)];
                const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];

                const newCard = new Card(randomType);
                if (this.grid.addCard(newCard, x, y)) {
                    this.ui.renderCard(newCard, x, y);
                }
            };

            const spawnBtn = this.add.text(350, 700, '[ SPAWN CARD ]', {
                fontSize: '20px', fill: '#ffffff', backgroundColor: '#333355', padding: { x: 20, y: 10 }
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            spawnBtn.on('pointerdown', () => spawnCard());

            // --- 6. BOTÓN DE COMBATE (Con Log de Recursos) ---
            const fightBtn = this.add.text(674, 700, '[ EXECUTE ATTACK ]', {
                fontSize: '20px', fill: '#ffffff', backgroundColor: '#882222', padding: { x: 20, y: 10 }
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            fightBtn.on('pointerdown', () => {
                const result = this.combatManager.executeTurn();
                
                if (result) {
                    console.log(`%c ⚔️ TURNO DE COMBATE ⚔️ `, "background: #222; color: #bada55");
                    
                    // Si usamos madera, mostramos cuánto daño extra hubo
                    if (result.bonusUsed > 0) {
                        console.log(`%c 🔥 ¡ATAQUE CARGADO! Madera usada: +${result.bonusUsed} ATK`, "color: #ffaa00");
                    }

                    console.log(`🧠 IA: ${result.enemyActionMsg}`);
                    console.table({
                        "Daño Final": result.playerDamageDealt,
                        "Bono Aplicado": result.bonusUsed,
                        "HP Enemigo": result.enemyHP,
                        "HP Héroe": result.playerHP
                    });

                    if (!result.enemyAlive) {
                        console.log("🏆 Enemigo derrotado.");
                        fightBtn.disableInteractive().setAlpha(0.5);
                    }
                }
            });
            
            spawnCard();
            spawnCard();
            spawnCard();
        }
    }
};

new Phaser.Game(config);