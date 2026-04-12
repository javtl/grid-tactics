/**
 * CardDefinitions.js
 * Contains all static data and constants for game resources.
 */

export const CARD_TYPES = {
    WOOD: 'wood',
    STONE: 'stone',
    MANA: 'mana'
};

export const CARD_DATA = {
    [CARD_TYPES.WOOD]: {
        name: 'Wood',
        baseValue: 10,
        statType: 'defense',
        color: 0x714e3b 
    },
    [CARD_TYPES.STONE]: {
        name: 'Stone',
        baseValue: 5,
        statType: 'attack',
        color: 0x808080 
    },
    [CARD_TYPES.MANA]: {
        name: 'Mana',
        baseValue: 1,
        statType: 'ap',
        color: 0x3498db 
    }
};