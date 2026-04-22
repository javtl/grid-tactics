import { Entity } from './Entity';
import { ABILITIES } from '../data/AbilityDefinitions';

export class CombatManager {
    constructor() {
        this.player = new Entity("Hero", 100, 15, 5);
        this.enemy = null;
        this.pendingAtkBonus = 0; 
    }

    setEnemy(enemyEntity) {
        this.enemy = enemyEntity;
    }

    addResourcesFromMerge(type, level) {
        const bonusValue = level * 5;
        if (type === 'WOOD') {
            this.pendingAtkBonus += bonusValue;
        } 
        else if (type === 'STONE') {
            this.player.addTempDef(bonusValue);
        }
    }

    /**
     * [NUEVO GT-012] Ejecuta una habilidad específica.
     * Reemplaza la lógica de ataque automático por consumo selectivo.
     */
    executeAbility(abilityId) {
        if (!this.enemy || !this.player.isAlive()) return null;

        const ability = ABILITIES[abilityId];
        if (!ability) return null;

        // 1. VALIDACIÓN DE RECURSOS
        // Comprobamos si el jugador tiene suficiente ATK acumulado o DEF (tempDef)
        if (this.pendingAtkBonus < ability.cost.atk || this.player.tempDef < ability.cost.def) {
            console.log(`[COMBAT] Recursos insuficientes para ${ability.name}`);
            return { error: "RESOURCES_LOW", message: "ENERGÍA INSUFICIENTE" };
        }

        // 2. CONSUMO DE RECURSOS
        this.pendingAtkBonus -= ability.cost.atk;
        // La defensa se consume si la habilidad tiene un coste de defensa
        if (ability.cost.def > 0) {
            this.player.tempDef -= ability.cost.def;
        }

        let playerDamageDealt = 0;
        let shieldGained = 0;

        // 3. EJECUCIÓN DEL EFECTO DE LA HABILIDAD
        switch (ability.type) {
            case 'DAMAGE':
                // Daño base + (Poder de habilidad * 5)
                playerDamageDealt = this.player.atk + (ability.power * 5);
                this.enemy.takeDamage(playerDamageDealt);
                break;

            case 'SHIELD':
                // Aumenta la defensa temporal directamente
                shieldGained = ability.power;
                this.player.addTempDef(shieldGained);
                break;
        }

        // 4. RESPUESTA DEL ENEMIGO (IA)
        let enemyDamageDealt = 0;
        let enemyActionReport = "";

        if (this.enemy.isAlive()) {
            const action = this.decideEnemyAction();
            enemyActionReport = action.message;

            if (action.type === 'ATTACK') {
                enemyDamageDealt = this.player.takeDamage(action.value);
            } 
            else if (action.type === 'DEFEND') {
                this.enemy.addTempDef(action.value);
            }
        } else {
            enemyActionReport = `${this.enemy.name} ha sido eliminado.`;
        }

        return {
            abilityUsed: ability.name,
            playerDamageDealt,
            enemyDamageDealt,
            shieldGained,
            enemyActionMsg: enemyActionReport,
            enemyAlive: this.enemy.isAlive(),
            playerAlive: this.player.isAlive(),
            enemyHP: this.enemy.currentHp,
            playerHP: this.player.currentHp,
            pendingAtk: this.pendingAtkBonus,
            pendingDef: this.player.tempDef
        };
    }

    decideEnemyAction() {
        if (!this.enemy) return null;
        const healthPercent = this.enemy.getHealthStatus();

        if (healthPercent < 35) {
            return { type: 'DEFEND', value: 8, message: `${this.enemy.name} activa Firewall!` };
        }

        return { type: 'ATTACK', value: this.enemy.atk, message: `${this.enemy.name} lanza un Virus!` };
    }
}