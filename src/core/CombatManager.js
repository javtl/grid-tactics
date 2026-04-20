import { Entity } from './Entity';

export class CombatManager {
    constructor() {
        this.player = new Entity("Hero", 100, 10, 5);
        this.enemy = null;
    }

    setEnemy(enemyEntity) {
        this.enemy = enemyEntity;
    }

    /**
     * Resuelve un turno de combate básico
     * @returns {Object} Un log de lo que ha pasado para la UI
     */
    executeTurn() {
        if (!this.enemy) return null;

        // 1. Jugador ataca al Enemigo
        const dmgToEnemy = this.enemy.takeDamage(this.player.atk);
        
        // 2. Si el enemigo sobrevive, contraataca
        let dmgToPlayer = 0;
        if (this.enemy.isAlive()) {
            dmgToPlayer = this.player.takeDamage(this.enemy.atk);
        }

        return {
            enemyHit: dmgToEnemy,
            playerHit: dmgToPlayer,
            enemyAlive: this.enemy.isAlive(),
            playerAlive: this.player.isAlive()
        };
    }
}