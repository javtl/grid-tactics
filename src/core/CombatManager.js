import { Entity } from './Entity';

export class CombatManager {
    constructor() {
        this.player = new Entity("Hero", 100, 15, 5); // Stats base del héroe
        this.enemy = null;
    }

    setEnemy(enemyEntity) {
        this.enemy = enemyEntity;
    }

    /**
     * Lógica de Inteligencia Artificial (IA) v1
     * @returns {Object} La acción decidida por el enemigo
     */
    decideEnemyAction() {
        if (!this.enemy) return null;

        const healthPercent = this.enemy.getHealthStatus();

        // 1. COMPORTAMIENTO DEFENSIVO: Si tiene poca vida (< 35%)
        if (healthPercent < 35) {
            return {
                type: 'DEFEND',
                value: 8, // Aumenta su defensa este turno
                message: `${this.enemy.name} se pone en guardia!`
            };
        }

        // 2. COMPORTAMIENTO OFENSIVO: Por defecto, ataca
        return {
            type: 'ATTACK',
            value: this.enemy.atk,
            message: `${this.enemy.name} lanza un ataque feroz!`
        };
    }

    /**
     * Resuelve un turno de combate completo
     * @returns {Object} Informe detallado de acciones para la UI
     */
    executeTurn() {
        if (!this.enemy || !this.player.isAlive()) return null;

        // --- 1. ACCIÓN DEL JUGADOR ---
        // Por ahora el jugador siempre ataca (se conectará al Grid en el GT-09)
        const dmgToEnemy = this.enemy.takeDamage(this.player.atk);
        
        // --- 2. ACCIÓN DEL ENEMIGO (IA) ---
        let dmgToPlayer = 0;
        let enemyActionReport = "";

        if (this.enemy.isAlive()) {
            // El enemigo "piensa"
            const action = this.decideEnemyAction();
            enemyActionReport = action.message;

            if (action.type === 'ATTACK') {
                dmgToPlayer = this.player.takeDamage(action.value);
            } 
            else if (action.type === 'DEFEND') {
                this.enemy.addTempDef(action.value);
            }
        } else {
            enemyActionReport = `${this.enemy.name} ha sido derrotado!`;
        }

        // 3. RETORNO DE DATOS (DTO)
        return {
            playerDamageDealt: dmgToEnemy,
            enemyDamageDealt: dmgToPlayer,
            enemyActionMsg: enemyActionReport,
            enemyAlive: this.enemy.isAlive(),
            playerAlive: this.player.isAlive(),
            enemyHP: this.enemy.currentHp,
            playerHP: this.player.currentHp
        };
    }
}