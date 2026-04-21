/**
 * UIManager.js
 * Handles the Cyber-Arcade visual layer, neons, and UI elements.
 */
export class UIManager {
    constructor(scene, grid) {
        this.scene = scene;
        this.grid = grid;
        this.cellSize = 120;
        this.offset = { x: 300, y: 180 };
        this.cardSprites = new Map();

        // [GT-10] Paleta de colores Neón
        this.colors = {
            cyan: 0x00ffff,   // Jugador / Madera
            pink: 0xff00ff,   // Enemigo
            lime: 0x39ff14,   // Defensa / Piedra
            grid: 0x1a1a2e,   // Fondo
            neonStroke: 0x4ecdc4
        };
    }

    /**
     * Dibuja el tablero con estilo de rejilla láser
     */
    drawGrid() {
        const graphics = this.scene.add.graphics();
        
        for (let y = 0; y < this.grid.size; y++) {
            for (let x = 0; x < this.grid.size; x++) {
                const px = this.offset.x + x * this.cellSize;
                const py = this.offset.y + y * this.cellSize;

                // Fondo de celda
                graphics.fillStyle(this.colors.grid, 0.8);
                graphics.fillRect(px, py, this.cellSize, this.cellSize);

                // Borde con brillo neón
                graphics.lineStyle(2, this.colors.neonStroke, 0.3);
                graphics.strokeRect(px, py, this.cellSize, this.cellSize);
            }
        }
    }

    /**
     * [NUEVO GT-10] Crea una barra de vida estilo tubo de neón
     */
    createNeonHealthBar(x, y, width, height, label, color = 0x00ffff) {
        const container = this.scene.add.container(x, y);

        const text = this.scene.add.text(0, -25, label, {
            fontSize: '16px',
            fontFamily: 'monospace',
            fill: '#ffffff'
        }).setShadow(0, 0, `#${color.toString(16)}`, 10, true, true);

        const bg = this.scene.add.graphics();
        bg.fillStyle(0x000000, 0.6);
        bg.fillRoundedRect(0, 0, width, height, 4);
        bg.lineStyle(2, 0x444444);
        bg.strokeRoundedRect(0, 0, width, height, 4);

        const bar = this.scene.add.graphics();
        container.add([text, bg, bar]);

        return {
            update: (current, max) => {
                const percentage = Math.max(0, current / max);
                bar.clear();
                // Brillo exterior
                bar.fillStyle(color, 0.3);
                bar.fillRoundedRect(-2, -2, (width * percentage) + 4, height + 4, 4);
                // Tubo central
                bar.fillStyle(color, 1);
                bar.fillRoundedRect(0, 0, width * percentage, height, 4);
            }
        };
    }

    /**
     * [NUEVO GT-10] Crea un contador de recursos con animación de escala
     */
    createResourceDisplay(x, y, label, colorHex) {
        const text = this.scene.add.text(x, y, `${label}: 0`, {
            fontSize: '20px',
            fontFamily: 'monospace',
            fill: '#ffffff'
        }).setShadow(0, 0, colorHex, 12, true, true);

        return {
            update: (val) => {
                text.setText(`${label}: ${val}`);
                if (val > 0) {
                    this.scene.tweens.add({
                        targets: text,
                        scale: 1.1,
                        duration: 50,
                        yoyo: true
                    });
                }
            }
        };
    }

    /**
     * Renderiza una carta con glow y metadatos
     */
    renderCard(card, x, y) {
        const stats = card.getStats();
        const px = this.offset.x + (x * this.cellSize) + this.cellSize / 2;
        const py = this.offset.y + (y * this.cellSize) + this.cellSize / 2;

        const container = this.scene.add.container(px, py);

        const background = this.scene.add.rectangle(0, 0, 100, 100, stats.color)
            .setStrokeStyle(4, 0xffffff, 0.8);
        
        const label = this.scene.add.text(0, -10, stats.displayName[0], {
            fontSize: '40px',
            fontFamily: 'monospace',
            color: '#ffffff',
            fontWeight: 'bold'
        }).setShadow(0, 0, '#ffffff', 8, true, true).setOrigin(0.5);

        const levelText = this.scene.add.text(0, 25, `LVL ${card.level}`, {
            fontSize: '16px',
            fontFamily: 'monospace',
            color: '#ffffff'
        }).setOrigin(0.5);

        container.add([background, label, levelText]);

        container.setSize(100, 100); 
        container.setInteractive({ draggable: true });

        // Guardamos la instancia de la carta para el Merge
        container.setData('cardInstance', card); 
        container.setData('gridX', x);
        container.setData('gridY', y);
        container.setData('cardId', card.id);

        container.setScale(0);
        this.scene.tweens.add({
            targets: container,
            scale: 1,
            duration: 200,
            ease: 'Back.easeOut'
        });

        this.cardSprites.set(card.id, container);
    }

    /**
     * [NUEVO] Actualiza visualmente una carta después de un Merge
     */
    updateCardVisual(x, y) {
        const card = this.grid.getCardAt(x, y);
        if (!card) return;

        const container = this.cardSprites.get(card.id);
        if (container) {
            // Actualizamos el texto del nivel (tercer elemento del contenedor)
            const levelText = container.list[2];
            levelText.setText(`LVL ${card.level}`);

            // Animación de "Flash" por subida de nivel
            this.scene.tweens.add({
                targets: container,
                scale: 1.3,
                duration: 100,
                yoyo: true,
                ease: 'Quad.easeInOut'
            });
        }
    }
}