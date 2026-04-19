/**
 * InputHandler.js
 * Manages Drag & Drop events and translates them to Grid actions.
 */
import { GAME_STATES } from '../data/GameStates';

export class InputHandler {
    // 1. Añadimos gameManager al constructor
    constructor(scene, grid, ui, gameManager) {
        this.scene = scene;
        this.grid = grid;
        this.ui = ui;
        this.gameManager = gameManager; // Referencia al orquestador
        this.setupEvents();
    }

    setupEvents() {
        this.scene.input.on('dragstart', (pointer, gameObject) => {
            // --- FILTRO DE ESTADO ---
            // Si no estamos en fase puzzle, bloqueamos cualquier interacción
            if (!this.gameManager.isPhase(GAME_STATES.PHASE_PUZZLE)) return;

            this.scene.children.bringToTop(gameObject);
            gameObject.setAlpha(0.8);
            gameObject.setScale(1.1); 
        });

        this.scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            // También protegemos el arrastre activo
            if (!this.gameManager.isPhase(GAME_STATES.PHASE_PUZZLE)) return;

            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.scene.input.on('dragend', (pointer, gameObject) => {
            // Protección final al soltar
            if (!this.gameManager.isPhase(GAME_STATES.PHASE_PUZZLE)) {
                this.snapBack(gameObject);
                return;
            }

            gameObject.setAlpha(1);
            gameObject.setScale(1);

            // Corrección de lógica de coordenadas (Uso de cellSize para precisión)
            const targetX = Math.floor((gameObject.x - this.ui.offset.x) / this.ui.cellSize);
            const targetY = Math.floor((gameObject.y - this.ui.offset.y) / this.ui.cellSize);
            
            // Lógica de retorno por defecto (hasta GT-09)
            this.snapBack(gameObject);
        });
    }

    snapBack(gameObject) {
        const ox = gameObject.getData('gridX');
        const oy = gameObject.getData('gridY');
        const px = this.ui.offset.x + (ox * this.ui.cellSize) + this.ui.cellSize / 2;
        const py = this.ui.offset.y + (oy * this.ui.cellSize) + this.ui.cellSize / 2;

        this.scene.tweens.add({
            targets: gameObject,
            x: px,
            y: py,
            duration: 200,
            ease: 'Power2'
        });
    }
}