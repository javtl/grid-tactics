import Phaser from 'phaser';
import { Card } from './core/Card';
import { Grid } from './core/Grid';
import { UIManager } from './ui/UIManager';
import { InputHandler } from './ui/InputHandler';
import { GameManager } from './core/GameManager'; // [NUEVO]
import { GAME_STATES } from './data/GameStates';   // [NUEVO]
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
            // --- 1. INICIALIZACIÓN DE CORE (DATA) ---
            this.grid = new Grid(4);
            
            // --- 2. INICIALIZACIÓN DE CONTROLADORES ---
            // IMPORTANTE: Primero el GameManager para que los demás puedan consultarlo
            this.gameManager = new GameManager();
            
            this.ui = new UIManager(this, this.grid);
            
            // Inyectamos el gameManager en el InputHandler (Inyección de dependencias)
            this.inputHandler = new InputHandler(this, this.grid, this.ui, this.gameManager);

            // --- 3. CONFIGURACIÓN INICIAL ---
            // Establecemos el estado inicial: Estamos listos para jugar al puzzle
            this.gameManager.setGameState(GAME_STATES.PHASE_PUZZLE);

            // --- 4. RENDERIZADO INICIAL ---
            this.ui.drawGrid();

            this.add.text(512, 50, 'GRID TACTICS: GAME MANAGER MODE', {
                fontSize: '28px',
                fill: '#4ecdc4',
                fontFamily: 'monospace'
            }).setOrigin(0.5);

            // --- 5. LÓGICA DE SPAWNING ---
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

            const spawnBtn = this.add.text(512, 700, '[ CLICK TO SPAWN CARD ]', {
                fontSize: '20px', fill: '#ffffff', backgroundColor: '#333355', padding: { x: 20, y: 10 }
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            spawnBtn.on('pointerdown', () => spawnCard());
            
            spawnCard();
            spawnCard();
        }
    }
};

new Phaser.Game(config);