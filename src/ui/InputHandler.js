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

            // Intentamos procesar la acción
            const actionTaken = this.handleInteraction(gameObject, targetX, targetY);

            if (!actionTaken) {
                this.snapBack(gameObject);
            }
        });
    }

    handleInteraction(draggedObject, tx, ty) {
        if (!this.grid.isWithinBounds(tx, ty)) return false;

        const originX = draggedObject.getData('gridX');
        const originY = draggedObject.getData('gridY');
        const draggedCard = draggedObject.getData('cardInstance');
        const targetCard = this.grid.getCardAt(tx, ty);

        if (originX === tx && originY === ty) return false;

        // --- LÓGICA DE FUSIÓN (MISMO TIPO) ---
        if (targetCard && targetCard.type === draggedCard.type) {
            const sumLevel = this.grid.mergeCards(originX, originY, tx, ty);
            
            // Sincronizar recursos
            this.gameManager.combatManager.addResourcesFromMerge(targetCard.type, sumLevel);
            
            // VFX
            this.triggerMergeVFX(draggedObject, targetCard);

            // IMPORTANTE: En lugar de manipular sprites aquí, 
            // delegamos el redibujado total a la UI para evitar "fantasmas"
            this.ui.refreshGridVisuals(); 
            
            this.scene.events.emit('updateUIResources');
            return true;
        }

        // --- LÓGICA DE INTERCAMBIO O MOVER (TIPOS DISTINTOS O VACÍO) ---
        // Si llegamos aquí, o el tipo es distinto o la celda está vacía.
        // grid.swapCards maneja ambos casos perfectamente.
        this.grid.swapCards(originX, originY, tx, ty);
        
        // Redibujamos todo el tablero según el nuevo estado del Grid
        this.ui.refreshGridVisuals();
        
        return true;
    }

    triggerMergeVFX(draggedObject, targetCard) {
        const stats = targetCard.getStats();
        if (this.ui.createMergeParticles) {
            this.ui.createMergeParticles(draggedObject.x, draggedObject.y, stats.color);
        }
        const bonusLabel = targetCard.type === 'WOOD' ? '⚡ ATK++' : '🛡️ DEF++';
        if (this.ui.showFloatingText) {
            this.ui.showFloatingText(draggedObject.x, draggedObject.y, bonusLabel, stats.colorText || "#ffffff");
        }
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