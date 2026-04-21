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
    backgroundColor: '#0a0a12',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: {
        create: function() {
            // --- 1. INICIALIZACIÓN DE LÓGICA Y DATOS ---
            this.grid = new Grid(4);
            this.gameManager = new GameManager();
            this.combatManager = new CombatManager();
            this.gameManager.combatManager = this.combatManager;

            const goblin = new Entity("TARGET_VIRUS.SYS", 100, 12, 3);
            this.combatManager.setEnemy(goblin);

            // --- 2. INICIALIZACIÓN DE INTERFAZ Y CONTROL ---
            this.ui = new UIManager(this, this.grid);
            this.inputHandler = new InputHandler(this, this.grid, this.ui, this.gameManager);

            // --- 3. CONFIGURACIÓN INICIAL ---
            this.gameManager.setGameState(GAME_STATES.PHASE_PUZZLE);
            this.ui.drawGrid();

            // Título Arcade
            this.add.text(512, 40, '--- GRID TACTICS: TERMINAL ---', {
                fontSize: '32px',
                fill: '#ffffff',
                fontFamily: 'monospace'
            }).setOrigin(0.5).setShadow(0, 0, '#00ffff', 15, true, true);

            // --- 4. ELEMENTOS DE UI NEÓN ---
            this.playerHB = this.ui.createNeonHealthBar(100, 560, 300, 15, "USER_CORE.EXE", 0x00ffff);
            this.enemyHB = this.ui.createNeonHealthBar(624, 560, 300, 15, "TARGET_VIRUS.SYS", 0xff00ff);

            this.atkDisplay = this.ui.createResourceDisplay(100, 610, "⚡ ATK_BUFF", "#00ffff");
            this.defDisplay = this.ui.createResourceDisplay(100, 645, "🛡️ DEF_NET", "#39ff14");

            this.playerHB.update(this.combatManager.player.currentHp, this.combatManager.player.maxHp);
            this.enemyHB.update(this.combatManager.enemy.currentHp, this.combatManager.enemy.maxHp);

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

            const spawnBtn = this.add.text(350, 710, '[ GENERATE_DATA ]', {
                fontSize: '18px', 
                fontFamily: 'monospace',
                fill: '#00ffff', 
                backgroundColor: '#111122', 
                padding: { x: 15, y: 8 }
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            spawnBtn.on('pointerdown', () => spawnCard());

            // --- 6. BOTÓN DE COMBATE (Con Juice GT-11) ---
            const fightBtn = this.add.text(674, 710, '[ EXECUTE_ATTACK ]', {
                fontSize: '18px', 
                fontFamily: 'monospace',
                fill: '#ff00ff', 
                backgroundColor: '#221122', 
                padding: { x: 15, y: 8 }
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            fightBtn.on('pointerdown', () => {
                const result = this.combatManager.executeTurn();
                
                if (result) {
                    // [GT-11] FEEDBACK VISUAL DE IMPACTO
                    this.ui.screenShake(0.015, 150); // Vibración de cámara
                    
                    // Mostrar daño sobre el enemigo
                    this.ui.showFloatingText(774, 500, `-${result.playerDamageDealt} HP`, "#ff00ff");
                    
                    // Si el enemigo nos golpea, mostrar daño sobre el jugador
                    if (result.enemyDamageDealt > 0) {
                        this.scene.time.delayedCall(200, () => {
                            this.ui.showFloatingText(250, 500, `-${result.enemyDamageDealt} HP`, "#ff5555");
                        });
                    }

                    // Actualizar Barras de Vida
                    this.playerHB.update(result.playerHP, this.combatManager.player.maxHp);
                    this.enemyHB.update(result.enemyHP, this.combatManager.enemy.maxHp);

                    // Resetear displays tras combate
                    this.atkDisplay.update(0);
                    this.defDisplay.update(this.combatManager.player.tempDef);

                    if (!result.enemyAlive) {
                        this.ui.showFloatingText(774, 450, "SYSTEM_DELETED", "#ffffff");
                        fightBtn.disableInteractive().setAlpha(0.5).setText("[ TARGET_DELETED ]");
                    }
                }
            });

            // --- 7. BUCLE DE ACTUALIZACIÓN DE RECURSOS ---
            this.events.on('updateUIResources', () => {
                this.atkDisplay.update(this.combatManager.pendingAtkBonus);
                this.defDisplay.update(this.combatManager.player.tempDef);
            });
            
            for(let i=0; i<3; i++) spawnCard();
        },

        update: function() {
            if (this.atkDisplay && this.defDisplay) {
                this.atkDisplay.update(this.combatManager.pendingAtkBonus);
                this.defDisplay.update(this.combatManager.player.tempDef);
            }
        }
    }
};

new Phaser.Game(config);