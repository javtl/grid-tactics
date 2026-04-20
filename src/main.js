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
            // --- 1. INICIALIZACIÓN DE CORE (DATA & LOGIC) ---
            this.grid = new Grid(4);
            this.gameManager = new GameManager();
            
            // Inicializamos el Motor de Combate
            this.combatManager = new CombatManager();

            // Seteamos un enemigo de prueba (Goblin con IA reactiva)
            const goblin = new Entity("Goblin Saqueador", 60, 12, 2);
            this.combatManager.setEnemy(goblin);

            // --- 2. INICIALIZACIÓN DE CONTROLADORES ---
            this.ui = new UIManager(this, this.grid);
            
            // Inyectamos el gameManager para el control de fases
            this.inputHandler = new InputHandler(this, this.grid, this.ui, this.gameManager);

            // --- 3. CONFIGURACIÓN INICIAL ---
            this.gameManager.setGameState(GAME_STATES.PHASE_PUZZLE);

            // --- 4. RENDERIZADO INICIAL ---
            this.ui.drawGrid();

            this.add.text(512, 50, 'GRID TACTICS: ENEMY AI ACTIVE (v1)', {
                fontSize: '28px',
                fill: '#4ecdc4',
                fontFamily: 'monospace'
            }).setOrigin(0.5);

            // --- 5. LÓGICA DE INTERFAZ Y SPAWNING ---
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

            // Botón de Spawn
            const spawnBtn = this.add.text(350, 700, '[ SPAWN CARD ]', {
                fontSize: '20px', fill: '#ffffff', backgroundColor: '#333355', padding: { x: 20, y: 10 }
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            spawnBtn.on('pointerdown', () => spawnCard());

            // --- 6. BOTÓN DE TEST DE COMBATE (CON IA) ---
            const fightBtn = this.add.text(674, 700, '[ TEST COMBAT TURN ]', {
                fontSize: '20px', fill: '#ffffff', backgroundColor: '#882222', padding: { x: 20, y: 10 }
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            fightBtn.on('pointerdown', () => {
                const result = this.combatManager.executeTurn();
                
                if (result) {
                    console.log(`%c 🧠 IA: ${result.enemyActionMsg}`, "color: #ffcc00; font-weight: bold;");
                    console.table({
                        "Daño al Goblin": result.playerDamageDealt,
                        "Daño al Héroe": result.enemyDamageDealt,
                        "HP Goblin": result.enemyHP,
                        "HP Héroe": result.playerHP
                    });

                    if (!result.enemyAlive) {
                        console.log("%c 🏆 ¡VICTORIA! El enemigo ha caído.", "color: #00ff00; font-size: 14px;");
                        fightBtn.disableInteractive().setAlpha(0.5);
                    }
                }
            });
            
            spawnCard();
            spawnCard();
        }
    }
};

new Phaser.Game(config);