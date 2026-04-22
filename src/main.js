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
import { ABILITIES } from './data/AbilityDefinitions'; // <--- Importamos el catálogo

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
            // --- 1. INICIALIZACIÓN ---
            this.grid = new Grid(4);
            this.gameManager = new GameManager();
            this.combatManager = new CombatManager();
            this.gameManager.combatManager = this.combatManager;

            const virus = new Entity("TARGET_VIRUS.SYS", 120, 15, 5);
            this.combatManager.setEnemy(virus);

            this.ui = new UIManager(this, this.grid);
            this.inputHandler = new InputHandler(this, this.grid, this.ui, this.gameManager);

            // --- 2. CONFIGURACIÓN INICIAL ---
            this.gameManager.setGameState(GAME_STATES.PHASE_PUZZLE);
            this.ui.drawGrid();

            this.add.text(512, 40, '--- GRID TACTICS: TERMINAL ---', {
                fontSize: '32px', fill: '#ffffff', fontFamily: 'monospace'
            }).setOrigin(0.5).setShadow(0, 0, '#00ffff', 15, true, true);

            // --- 3. UI DE ESTADO Y RECURSOS ---
            this.playerHB = this.ui.createNeonHealthBar(100, 560, 300, 15, "USER_CORE.EXE", 0x00ffff);
            this.enemyHB = this.ui.createNeonHealthBar(624, 560, 300, 15, "TARGET_VIRUS.SYS", 0xff00ff);

            this.atkDisplay = this.ui.createResourceDisplay(100, 610, "⚡ ATK_BUFF", "#00ffff");
            this.defDisplay = this.ui.createResourceDisplay(100, 645, "🛡️ DEF_NET", "#39ff14");

            // --- 4. [NUEVO GT-012] GENERACIÓN DINÁMICA DE HABILIDADES ---
            this.abilityButtons = [];
            const startX = 640; 
            
            // Iteramos sobre el objeto ABILITIES para crear un botón por cada una
            Object.values(ABILITIES).forEach((ability, index) => {
                const btn = this.ui.createAbilityButton(startX + (index * 175), 710, ability);
                
                btn.on('pointerdown', () => {
                    const result = this.combatManager.executeAbility(ability.id);
                    
                    if (result && !result.error) {
                        // Feedback de combate
                        this.ui.screenShake(0.015, 120);
                        
                        if (result.playerDamageDealt > 0) {
                            this.ui.showFloatingText(774, 500, `-${result.playerDamageDealt} HP`, "#ff00ff");
                        }
                        if (result.shieldGained > 0) {
                            this.ui.showFloatingText(250, 500, `+${result.shieldGained} DEF`, "#39ff14");
                        }

                        // Respuesta del enemigo (si ha sobrevivido)
                        if (result.enemyDamageDealt > 0) {
                            this.time.delayedCall(300, () => {
                                this.ui.showFloatingText(250, 500, `-${result.enemyDamageDealt} HP`, "#ff5555");
                            });
                        }

                        // Actualizar barras
                        this.playerHB.update(result.playerHP, this.combatManager.player.maxHp);
                        this.enemyHB.update(result.enemyHP, this.combatManager.enemy.maxHp);

                        // Refrescar recursos y botones (porque hemos gastado energía)
                        this.events.emit('updateUIResources');

                        if (!result.enemyAlive) {
                            this.ui.showFloatingText(774, 450, "SYSTEM_DELETED", "#ffffff");
                        }
                    }
                });

                this.abilityButtons.push(btn);
            });

            // --- 5. SISTEMA DE SPAWNING ---
            const spawnCard = () => {
                const emptyCells = this.grid.getEmptyCells();
                if (emptyCells.length === 0) return;
                const types = Object.values(CARD_TYPES);
                const randomType = types[Math.floor(Math.random() * types.length)];
                const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                const newCard = new Card(randomType);
                if (this.grid.addCard(newCard, x, y)) this.ui.renderCard(newCard, x, y);
            };

            const spawnBtn = this.add.text(350, 710, '[ GENERATE_DATA ]', {
                fontSize: '18px', fontFamily: 'monospace', fill: '#00ffff', 
                backgroundColor: '#111122', padding: { x: 15, y: 8 }
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            spawnBtn.on('pointerdown', () => spawnCard());

            // --- 6. EVENTO DE ACTUALIZACIÓN DE INTERFAZ ---
            this.events.on('updateUIResources', () => {
                const atk = this.combatManager.pendingAtkBonus;
                const def = this.combatManager.player.tempDef;

                this.atkDisplay.update(atk);
                this.defDisplay.update(def);
                
                // Actualizar visualmente qué botones podemos pagar
                this.ui.refreshAbilityButtons(this.abilityButtons, atk, def);
            });
            
            // Inicio de partida
            for(let i=0; i<4; i++) spawnCard();
            this.events.emit('updateUIResources'); // Sincronización inicial
        },

        update: function() {
            // Ya no hace falta polling constante, usamos eventos por eficiencia.
        }
    }
};

new Phaser.Game(config);