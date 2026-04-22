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

    /**
     * FIX: Suma de recursos. 
     * Si fusionas LVL 4 + LVL 8, el "level" recibido es 12. 
     * El bonusValue debe ser consistente.
     */
    addResourcesFromMerge(type, level) {
        // Multiplicamos por 5 el nivel resultante de la fusión
        const bonusValue = level * 5;
        
        if (type === 'WOOD') {
            this.pendingAtkBonus += bonusValue;
        } 
        else if (type === 'STONE') {
            // Aseguramos que la defensa temporal del Entity se sume correctamente
            this.player.addTempDef(bonusValue);
        }
    }

    /**
     * Ejecuta una habilidad.
     * Corregido el consumo de recursos para evitar valores negativos.
     */
    executeAbility(abilityId) {
        if (!this.enemy || !this.player.isAlive()) return null;

        const ability = ABILITIES[abilityId];
        if (!ability) {
            console.error(`Habilidad ${abilityId} no encontrada`);
            return null;
        }

        // 1. VALIDACIÓN ESTRICTA
        const atkCost = ability.cost.atk || 0;
        const defCost = ability.cost.def || 0;
        const playerDef = this.player.tempDef || 0;

        if (this.pendingAtkBonus < atkCost || playerDef < defCost) {
            return { error: "RESOURCES_LOW" };
        }

        // 2. CONSUMO (Garantizando que no bajen de 0)
        this.pendingAtkBonus = Math.max(0, this.pendingAtkBonus - atkCost);
        this.player.tempDef = Math.max(0, playerDef - defCost);

        let playerDamageDealt = 0;
        let shieldGained = 0;

        // 3. EFECTO
        switch (ability.type) {
            case 'DAMAGE':
                // Daño = Atk Base + (Poder * 5)
                playerDamageDealt = this.player.atk + (ability.power * 5);
                this.enemy.takeDamage(playerDamageDealt);
                break;

            case 'SHIELD':
            case 'DEFENSE':
                shieldGained = ability.power;
                this.player.addTempDef(shieldGained);
                break;
        }

        // 4. RESPUESTA ENEMIGA
        let enemyDamageDealt = 0;
        let enemyActionReport = "";

        if (this.enemy.isAlive()) {
            const action = this.decideEnemyAction();
            enemyActionReport = action.message;

            if (action.type === 'ATTACK') {
                // takeDamage devuelve el daño REAL tras mitigar con defensa
                enemyDamageDealt = this.player.takeDamage(action.value);
            } 
            else if (action.type === 'DEFEND') {
                this.enemy.addTempDef(action.value);
            }
        } else {
            enemyActionReport = `${this.enemy.name} OFFLINE.`;
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
        const healthPercent = (this.enemy.currentHp / this.enemy.maxHp) * 100;

        // Lógica de "Desesperación": si tiene poca vida, se defiende más
        if (healthPercent < 30) {
            return { type: 'DEFEND', value: 15, message: `${this.enemy.name} activa RECOVERY.BAT` };
        }

        return { type: 'ATTACK', value: this.enemy.atk, message: `${this.enemy.name} ejecuta KILL_PROCESS` };
    }
}