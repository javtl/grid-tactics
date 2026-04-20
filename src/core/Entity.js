export class Entity {
    constructor(name, hp, atk, def) {
        this.name = name;
        this.maxHp = hp;
        this.currentHp = hp;
        this.atk = atk;
        this.def = def;
    }

    takeDamage(amount) {
        // Lógica de mitigación: Daño final = daño - defensa
        const finalDamage = Math.max(1, amount - this.def);
        this.currentHp = Math.max(0, this.currentHp - finalDamage);
        return finalDamage;
    }

    isAlive() {
        return this.currentHp > 0;
    }
}