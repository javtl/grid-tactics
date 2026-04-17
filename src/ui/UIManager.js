/**
 * UIManager.js
 * Handles all visual representations of the game logic.
 */
export class UIManager {
    constructor(scene, grid) {
        this.scene = scene;
        this.grid = grid;
        this.cellSize = 120;
        this.offset = { x: 300, y: 180 };
        this.cardSprites = new Map(); 
    }

    drawGrid() {
        const graphics = this.scene.add.graphics();
        graphics.lineStyle(4, 0x444466);
        graphics.fillStyle(0x2e2e4e, 0.8);

        for (let y = 0; y < this.grid.size; y++) {
            for (let x = 0; x < this.grid.size; x++) {
                const px = this.offset.x + x * this.cellSize;
                const py = this.offset.y + y * this.cellSize;
                
                graphics.strokeRect(px, py, this.cellSize, this.cellSize);
                graphics.fillRect(px, py, this.cellSize, this.cellSize);
            }
        }
    }

    renderCard(card, x, y) {
        const stats = card.getStats();
        const px = this.offset.x + (x * this.cellSize) + this.cellSize / 2;
        const py = this.offset.y + (y * this.cellSize) + this.cellSize / 2;

        const container = this.scene.add.container(px, py);

        const background = this.scene.add.rectangle(0, 0, 100, 100, stats.color)
            .setStrokeStyle(4, 0xffffff);
        
        const label = this.scene.add.text(0, 0, stats.displayName[0], {
            fontSize: '40px',
            color: '#ffffff',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        container.add([background, label]);

        // --- NUEVAS LÍNEAS GT-05 ---
        
        // 1. Definir el área de impacto (Hit Area)
        container.setSize(100, 100); 

        // 2. Habilitar el objeto para que sea interactivo y arrastrable
        container.setInteractive({ draggable: true });

        // 3. Inyectar metadatos lógicos en el objeto visual
        container.setData('gridX', x);
        container.setData('gridY', y);
        container.setData('cardId', card.id);

        // ---------------------------
        
        container.setScale(0);
        this.scene.tweens.add({
            targets: container,
            scale: 1,
            duration: 200,
            ease: 'Back.easeOut'
        });

        this.cardSprites.set(card.id, container);
    }
}