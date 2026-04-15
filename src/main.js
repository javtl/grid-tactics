/**
 * main.js
 * Entry point for Grid Tactics.
 * Logic & UI Coordination.
 */
import Phaser from 'phaser';
import { Card } from './core/Card';
import { Grid } from './core/Grid';
import { UIManager } from './ui/UIManager';
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
            // 1. Inicializamos los Controladores
            this.grid = new Grid(4);
            this.ui = new UIManager(this, this.grid);

            // 2. Dibujamos el escenario base
            this.ui.drawGrid();

            // 3. Cabecera (UI Fija)
            this.add.text(512, 50, 'GRID TACTICS: VISUAL LAYER', {
                fontSize: '28px',
                fill: '#4ecdc4',
                fontFamily: 'monospace'
            }).setOrigin(0.5);

            // 4. Lógica de Spawning (Coordinada)
            const spawnCard = () => {
                const emptyCells = this.grid.getEmptyCells();
                
                if (emptyCells.length === 0) {
                    console.warn("Board Full!");
                    return;
                }

                // Lógica de datos
                const types = Object.values(CARD_TYPES);
                const randomType = types[Math.floor(Math.random() * types.length)];
                const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];

                const newCard = new Card(randomType);
                
                // Si la lógica permite añadirla...
                if (this.grid.addCard(newCard, x, y)) {
                    // ...la UI se encarga de representarla
                    this.ui.renderCard(newCard, x, y);
                    console.log(`Spawned ${randomType} at [${x}, ${y}]`);
                }
            };

            // 5. Interacción
            this.input.on('pointerdown', () => spawnCard());

            this.add.text(512, 700, 'Click to spawn a card with animation', {
                fontSize: '18px',
                fill: '#aaaaaa'
            }).setOrigin(0.5);
            
            // Spawn inicial
            spawnCard();
        }
    }
};

new Phaser.Game(config);