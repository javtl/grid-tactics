/**
 * main.js
 * Entry point for Grid Tactics.
 * Validation for Grid Logic and Coordinate System.
 */
import Phaser from 'phaser';
import { Card } from './core/Card';
import { Grid } from './core/Grid';
import { CARD_TYPES, CARD_DATA } from './data/CardDefinitions';

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
            // 1. Initialize Core Grid
            this.grid = new Grid(4);
            const cellSize = 120;
            const offset = { x: 300, y: 180 };

            // 2. UI Header
            this.add.text(512, 50, 'GRID TACTICS: MATRIX TEST', {
                fontSize: '28px',
                fill: '#4ecdc4',
                fontFamily: 'monospace'
            }).setOrigin(0.5);

            // 3. Draw Grid Background (Visual Debug)
            const graphics = this.add.graphics();
            graphics.lineStyle(2, 0x444466);

            for (let y = 0; y < 4; y++) {
                for (let x = 0; x < 4; x++) {
                    graphics.strokeRect(offset.x + x * cellSize, offset.y + y * cellSize, cellSize, cellSize);
                }
            }

            // 4. Spawn Logic Function
            const spawnCard = () => {
                const emptyCells = this.grid.getEmptyCells();
                
                if (emptyCells.length === 0) {
                    console.warn("Board Full!");
                    return;
                }

                // Pick random type and empty cell
                const types = Object.values(CARD_TYPES);
                const randomType = types[Math.floor(Math.random() * types.length)];
                const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];

                // Logic: Add to Grid
                const newCard = new Card(randomType);
                this.grid.addCard(newCard, x, y);

                // Visual: Add to Phaser
                const cardStats = newCard.getStats();
                const textX = offset.x + (x * cellSize) + cellSize / 2;
                const textY = offset.y + (y * cellSize) + cellSize / 2;

                this.add.text(textX, textY, cardStats.displayName[0], { 
                    fontSize: '40px', 
                    color: `#${cardStats.color.toString(16)}` 
                }).setOrigin(0.5);

                console.log(`Spawned ${randomType} at [${x}, ${y}]`);
            };

            // 5. Interaction: Click to spawn
            this.input.on('pointerdown', () => spawnCard());

            this.add.text(512, 700, 'Click to spawn a card in a random empty cell', {
                fontSize: '18px',
                fill: '#aaaaaa'
            }).setOrigin(0.5);
            
            // Initial spawn
            spawnCard();
        }
    }
};

new Phaser.Game(config);