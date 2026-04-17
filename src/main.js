/**
 * main.js
 * Entry point for Grid Tactics.
 * Coordinates Logic, UI, and Input Handling.
 */
import Phaser from 'phaser';
import { Card } from './core/Card';
import { Grid } from './core/Grid';
import { UIManager } from './ui/UIManager';
import { InputHandler } from './ui/InputHandler'; // [NUEVO] Importamos el gestor de entrada
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
            // 1. Inicializamos los Controladores (Data & View)
            this.grid = new Grid(4);
            this.ui = new UIManager(this, this.grid);

            // 2. [NUEVO] Inicializamos el Gestor de Input
            // Le pasamos la escena (this), la lógica (grid) y la vista (ui)
            this.inputHandler = new InputHandler(this, this.grid, this.ui);

            // 3. Dibujamos el escenario base
            this.ui.drawGrid();

            // Cabecera
            this.add.text(512, 50, 'GRID TACTICS: INTERACTION LAYER', {
                fontSize: '28px',
                fill: '#4ecdc4',
                fontFamily: 'monospace'
            }).setOrigin(0.5);

            // 4. Lógica de Spawning
            const spawnCard = () => {
                const emptyCells = this.grid.getEmptyCells();
                
                if (emptyCells.length === 0) {
                    console.warn("Board Full!");
                    return;
                }

                const types = Object.values(CARD_TYPES);
                const randomType = types[Math.floor(Math.random() * types.length)];
                const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];

                const newCard = new Card(randomType);
                
                if (this.grid.addCard(newCard, x, y)) {
                    this.ui.renderCard(newCard, x, y);
                }
            };

            // 5. [AJUSTE] Interacción de Spawn
            // En lugar de capturar cualquier clic en la pantalla, creamos un botón.
            // Esto evita que al intentar arrastrar una carta, se cree otra accidentalmente.
            const spawnBtn = this.add.text(512, 700, '[ CLICK TO SPAWN CARD ]', {
                fontSize: '20px',
                fill: '#ffffff',
                backgroundColor: '#333355',
                padding: { x: 20, y: 10 }
            })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

            spawnBtn.on('pointerdown', () => spawnCard());
            
            // Spawn iniciales para probar el Drag & Drop
            spawnCard();
            spawnCard();
        }
    }
};

new Phaser.Game(config);