/**
 * InputHandler.js
 * Bridges Grid interaction with Combat resources and triggers VFX.
 */
import { GAME_STATES } from '../data/GameStates';

export class InputHandler {
    constructor(scene, grid, ui, gameManager) {
        this.scene = scene;
        this.grid = grid;
        this.ui = ui;
        this.gameManager = gameManager; 
        this.setupEvents();
    }

    setupEvents() {
        this.scene.input.on('dragstart', (pointer, gameObject) => {
            if (!this.gameManager.isPhase(GAME_STATES.PHASE_PUZZLE)) return;
            this.scene.children.bringToTop(gameObject);
            gameObject.setAlpha(0.8);
            gameObject.setScale(1.1); 
        });

        this.scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            if (!this.gameManager.isPhase(GAME_STATES.PHASE_PUZZLE)) return;
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.scene.input.on('dragend', (pointer, gameObject) => {
            if (!this.gameManager.isPhase(GAME_STATES.PHASE_PUZZLE)) {
                this.snapBack(gameObject);
                return;
            }

            gameObject.setAlpha(1);
            gameObject.setScale(1);

            const targetX = Math.floor((gameObject.x - this.ui.offset.x) / this.ui.cellSize);
            const targetY = Math.floor((gameObject.y - this.ui.offset.y) / this.ui.cellSize);

            const success = this.tryMerge(gameObject, targetX, targetY);

            if (!success) {
                this.snapBack(gameObject);
            }
        });
    }

    /**
     * Intenta fusionar la carta arrastrada con una en el destino.
     * [HOTFIX] Implementa lógica Math.max para evitar pérdida de niveles.
     */
    tryMerge(draggedObject, tx, ty) {
        if (!this.grid.isWithinBounds(tx, ty)) return false;

        const originX = draggedObject.getData('gridX');
        const originY = draggedObject.getData('gridY');

        if (originX === tx && originY === ty) return false;

        const targetCard = this.grid.getCardAt(tx, ty);
        const draggedCard = draggedObject.getData('cardInstance');

        if (targetCard && targetCard.type === draggedCard.type) {
            
            // --- [HOTFIX: MEJORANDO LA LÓGICA DE PROGRESIÓN] ---
            // Tomamos el nivel más alto de las dos cartas y le sumamos 1.
            // Esto evita que Nivel 5 + Nivel 1 resulte en Nivel 2.
            const newLevel = Math.max(targetCard.level, draggedCard.level) + 1;
            targetCard.level = newLevel;

            // Lógica de COMBATE: Sincronizar recursos con el nuevo nivel
            this.gameManager.combatManager.addResourcesFromMerge(targetCard.type, targetCard.level);

            // Lógica de GRID: Eliminar la carta vieja del sistema de datos
            this.grid.removeCard(originX, originY);

            // VFX: Partículas de Glitch
            if (this.ui.createMergeParticles) {
                this.ui.createMergeParticles(
                    draggedObject.x, 
                    draggedObject.y, 
                    targetCard.getStats().color
                );
            }

            // VFX: Texto flotante (Bonus)
            const bonusLabel = targetCard.type === 'WOOD' ? '⚡ ATK++' : '🛡️ DEF++';
            const bonusColor = targetCard.type === 'WOOD' ? '#00ffff' : '#39ff14';
            if (this.ui.showFloatingText) {
                this.ui.showFloatingText(draggedObject.x, draggedObject.y, bonusLabel, bonusColor);
            }

            // Lógica VISUAL: Destruir el objeto arrastrado y refrescar el destino
            draggedObject.destroy();
            this.ui.updateCardVisual(tx, ty);

            this.scene.events.emit('updateUIResources');

            return true; 
        }

        return false;
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
            ease: 'Back.easeOut'
        });
    }
}