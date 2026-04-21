import { Entity } from './Entity';

export class CombatManager {
    constructor() {
        this.player = new Entity("Hero", 100, 15, 5);
        this.enemy = null;
        
        // [NUEVO] Almacén de recursos generados por el Grid
        this.pendingAtkBonus = 0; 
    }

    setEnemy(enemyEntity) {
        this.enemy = enemyEntity;
    }

    /**
     * [NUEVO] Recibe recursos desde el InputHandler/Grid al fusionar cartas
     * @param {string} type - Tipo de carta (WOOD, STONE)
     * @param {number} level - Nivel resultante de la fusión
     */
    addResourcesFromMerge(type, level) {
        // Multiplicador: a mayor nivel, mayor beneficio (escala lineal x5)
        const bonusValue = level * 5;

        if (type === 'WOOD') {
            // La madera se acumula como daño extra para el próximo executeTurn()
            this.pendingAtkBonus += bonusValue;
            console.log(`[COMBAT] Madera fusionada: +${bonusValue} ATK acumulado.`);
        } 
        else if (type === 'STONE') {
            // La piedra genera defensa inmediata que protege contra el próximo golpe enemigo
            this.player.addTempDef(bonusValue);
            console.log(`[COMBAT] Piedra fusionada: +${bonusValue} DEF aplicada.`);
        }
    }

    decideEnemyAction() {
        if (!this.enemy) return null;
        const healthPercent = this.enemy.getHealthStatus();

        if (healthPercent < 35) {
            return {
                type: 'DEFEND',
                value: 8,
                message: `${this.enemy.name} se pone en guardia!`
            };
        }

        return {
            type: 'ATTACK',
            value: this.enemy.atk,
            message: `${this.enemy.name} lanza un ataque feroz!`
        };
    }

    /**
     * Resuelve un turno aplicando los bonos acumulados del Grid
     */
    executeTurn() {
        if (!this.enemy || !this.player.isAlive()) return null;

        // --- 1. ACCIÓN DEL JUGADOR (Con Bonus de Madera) ---
        // El daño total es la suma de tu ataque base + todo lo mergeado en el grid
        const totalPlayerAtk = this.player.atk + this.pendingAtkBonus;
        const dmgToEnemy = this.enemy.takeDamage(totalPlayerAtk);
        
        // [IMPORTANTE] Tras usar el bono de madera, lo reseteamos para el siguiente turno
        const usedBonus = this.pendingAtkBonus;
        this.pendingAtkBonus = 0;

        // --- 2. ACCIÓN DEL ENEMIGO (IA) ---
        let dmgToPlayer = 0;
        let enemyActionReport = "";

        if (this.enemy.isAlive()) {
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

        return {
            playerDamageDealt: dmgToEnemy,
            bonusUsed: usedBonus, // Informamos cuánta madera se quemó en el ataque
            enemyDamageDealt: dmgToPlayer,
            enemyActionMsg: enemyActionReport,
            enemyAlive: this.enemy.isAlive(),
            playerAlive: this.player.isAlive(),
            enemyHP: this.enemy.currentHp,
            playerHP: this.player.currentHp
        };
    }
}