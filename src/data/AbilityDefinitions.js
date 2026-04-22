/**
 * AbilityDefinitions.js
 * Define el catálogo de habilidades disponibles y sus costes.
 */

export const ABILITIES = {
    BASIC_STRIKE: {
        id: 'BASIC_STRIKE',
        name: 'CRITICAL_HIT.EXE',
        cost: { atk: 10, def: 0 },
        power: 1.5, // Multiplicador de daño
        type: 'DAMAGE',
        description: 'Consume 10 de ATK para un golpe potente.'
    },
    CYBER_SHIELD: {
        id: 'CYBER_SHIELD',
        name: 'FIREWALL.PATCH',
        cost: { atk: 0, def: 15 },
        power: 20, // Puntos de escudo fijo
        type: 'SHIELD',
        description: 'Consume 15 de DEF para crear un escudo reforzado.'
    }
};