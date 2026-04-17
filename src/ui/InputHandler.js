/**
 * InputHandler.js
 * Manages Drag & Drop events and translates them to Grid actions.
 */
export class InputHandler {
    constructor(scene, grid, ui) {
        this.scene = scene;
        this.grid = grid;
        this.ui = ui;
        this.setupEvents();
    }

    setupEvents() {
        this.scene.input.on('dragstart', (pointer, gameObject) => {
            this.scene.children.bringToTop(gameObject);
            gameObject.setAlpha(0.8);
            gameObject.setScale(1.1); // Efecto visual de "levantar" la carta
        });

        this.scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.scene.input.on('dragend', (pointer, gameObject) => {
            gameObject.setAlpha(1);
            gameObject.setScale(1);

            // Calcular a qué celda está intentando ir (Coordenadas Píxel -> Lógicas)
            const targetX = Math.floor((gameObject.x - this.ui.offset.x) / this.ui.offset.x); // Simplificado
            const targetY = Math.floor((gameObject.y - this.ui.offset.y) / this.ui.offset.y); // Simplificado
            
            // Aquí irá la lógica de Merge en el futuro. 
            // Por ahora, si no es válido, vuelve a su sitio:
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