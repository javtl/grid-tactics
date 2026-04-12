/**
 * main.js
 * Entry point for Grid Tactics.
 * Integrates Phaser with the core logic layer.
 */
import Phaser from 'phaser';
import { Card } from './core/Card';
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
            // 1. Initialize a test Card (Core Logic)
            const myCard = new Card(CARD_TYPES.WOOD, 1);
            const stats = myCard.getStats();

            // 2. Display System Info
            this.add.text(512, 100, 'GRID TACTICS: CORE READY', {
                fontSize: '24px',
                fill: '#4ecdc4',
                fontFamily: 'monospace'
            }).setOrigin(0.5);

            // 3. Display Card Data (Data Layer Test)
            const cardText = this.add.text(512, 384, '', {
                fontSize: '32px',
                fill: '#ffffff',
                align: 'center'
            }).setOrigin(0.5);

            // Function to update the visual representation
            const refreshUI = () => {
                const s = myCard.getStats();
                cardText.setText([
                    `Resource: ${s.displayName}`,
                    `Value: ${s.value} ${s.type.toUpperCase()}`,
                    `ID: ${myCard.id.substring(0, 8)}...`
                ]);
                cardText.setColor(`#${s.color.toString(16)}`);
            };

            refreshUI();

            // 4. Interaction Test: Click to upgrade card logic
            this.input.on('pointerdown', () => {
                myCard.upgrade();
                refreshUI();
                console.log(`Updated: ${myCard.getStats().displayName}`);
            });

            this.add.text(512, 600, 'Click anywhere to test card upgrade logic', {
                fontSize: '16px',
                fill: '#aaaaaa'
            }).setOrigin(0.5);
        }
    }
};

new Phaser.Game(config);