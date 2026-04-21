/**
 * Entity.js
 * Base class for all combatants (Player & Enemies).
 * Handles stats, health management, and damage mitigation.
 */
export class Entity {
    constructor(name, hp, atk, def) {
        this.name = name;
        this.maxHp = hp;
        this.currentHp = hp;
        this.atk = atk;
        this.def = def;
        
        // [NUEVO GT-08] Buffs temporales
        // Se resetean después de recibir daño o al final del turno.
        this.tempDef = 0; 
    }

    /**
     * Calculates and applies damage after mitigation.
     * @param {number} amount - Raw damage incoming.
     * @returns {number} The final damage dealt.
     */
    takeDamage(amount) {
        // Cálculo de mitigación sumando defensa base + defensa extra del turno
        const totalDefense = this.def + this.tempDef;
        const finalDamage = Math.max(1, amount - totalDefense);
        
        this.currentHp = Math.max(0, this.currentHp - finalDamage);

        // [IMPORTANTE] La defensa temporal suele consumirse tras el impacto
        this.tempDef = 0; 

        return finalDamage;
    }

    /**
     * Adds extra defense for the current turn.
     * Used by AI to "Defend" or by Player via Stone Merges.
     */
    addTempDef(amount) {
        this.tempDef += amount;
        console.log(`[${this.name}] Gains +${amount} temporary defense!`);
    }

    isAlive() {
        return this.currentHp > 0;
    }

    getHealthStatus() {
        return (this.currentHp / this.maxHp) * 100;
    }
}