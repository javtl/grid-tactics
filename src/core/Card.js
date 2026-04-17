/**
 * Card.js
 * Core class for card instances and logic.
 * Decoupled from Phaser rendering.
 */
import { CARD_DATA } from '../data/CardDefinitions';

export class Card {
    constructor(type, level = 1) {
        this.type = type;
        this.level = level;
        this.id = crypto.randomUUID(); 
    }

    /**
     * Increases the card level by 1.
     */
    upgrade() {
        this.level += 1;
    }

    /**
     * Returns the calculated stats for the current level.
     * @returns {Object} Card stats (name, value, type, color)
     */
    getStats() {
        const base = CARD_DATA[this.type];
        return {
            displayName: `${base.name} Lvl ${this.level}`,
            value: base.baseValue * this.level,
            type: base.statType,
            color: base.color
        };
    }
}