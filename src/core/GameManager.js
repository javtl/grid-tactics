import { GAME_STATES } from '../data/GameStates';

export class GameManager {
    constructor() {
        this.currentState = GAME_STATES.IDLE;
        this.listeners = []; // Para avisar a la UI cuando cambie el estado
    }

    /**
     * Cambia el estado del juego y notifica a los interesados
     */
    setGameState(newState) {
        if (this.currentState === newState) return;
        
        console.log(`[GameManager] Transition: ${this.currentState} -> ${newState}`);
        this.currentState = newState;
        
        // Notificar a la UI o a otros controladores
        this.listeners.forEach(callback => callback(newState));
    }

    onStateChange(callback) {
        this.listeners.push(callback);
    }

    isPhase(phase) {
        return this.currentState === phase;
    }
}