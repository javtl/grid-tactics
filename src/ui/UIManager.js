/**
 * UIManager.js
 * Handles the Cyber-Arcade visual layer, neons, and GT-11 VFX (Juice).
 */
export class UIManager {
    constructor(scene, grid) {
        this.scene = scene;
        this.grid = grid;
        this.cellSize = 120;
        this.offset = { x: 300, y: 180 };
        this.cardSprites = new Map();

        this.colors = {
            cyan: 0x00ffff,   
            pink: 0xff00ff,   
            lime: 0x39ff14,   
            grid: 0x1a1a2e,   
            neonStroke: 0x4ecdc4
        };
    }

    /**
     * [NUEVO GT-11] Crea una explosión de partículas estilo "Glitch/Pixel"
     */
    createMergeParticles(x, y, color) {
        // Creamos un gráfico simple para la partícula (un cuadrado de 4x4)
        const pixel = this.scene.add.graphics();
        pixel.fillStyle(color, 1);
        pixel.fillRect(0, 0, 6, 6);
        pixel.generateTexture('pixel_particle', 6, 6);
        pixel.destroy();

        const emitter = this.scene.add.particles(x, y, 'pixel_particle', {
            speed: { min: 100, max: 250 },
            angle: { min: 0, max: 360 },
            scale: { start: 1, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 500,
            gravityY: 150,
            blendMode: 'ADD',
            emitting: false
        });

        emitter.explode(20); // Dispara 20 partículas de golpe
        
        // Limpieza automática
        this.scene.time.delayedCall(600, () => emitter.destroy());
    }

    /**
     * [NUEVO GT-11] Texto flotante que sube y desaparece (Damage/Bonus)
     */
    showFloatingText(x, y, message, colorHex) {
        const text = this.scene.add.text(x, y, message, {
            fontSize: '28px',
            fontFamily: 'monospace',
            fill: colorHex,
            fontWeight: 'bold'
        }).setOrigin(0.5).setShadow(0, 0, colorHex, 10, true, true);

        this.scene.tweens.add({
            targets: text,
            y: y - 80,
            alpha: 0,
            duration: 800,
            ease: 'Cubic.easeOut',
            onComplete: () => text.destroy()
        });
    }

    /**
     * [NUEVO GT-11] Feedback de impacto en el combate
     */
    screenShake(intensity = 0.02, duration = 200) {
        this.scene.cameras.main.shake(duration, intensity);
    }

    drawGrid() {
        const graphics = this.scene.add.graphics();
        for (let y = 0; y < this.grid.size; y++) {
            for (let x = 0; x < this.grid.size; x++) {
                const px = this.offset.x + x * this.cellSize;
                const py = this.offset.y + y * this.cellSize;
                graphics.fillStyle(this.colors.grid, 0.8);
                graphics.fillRect(px, py, this.cellSize, this.cellSize);
                graphics.lineStyle(2, this.colors.neonStroke, 0.3);
                graphics.strokeRect(px, py, this.cellSize, this.cellSize);
            }
        }
    }

    createNeonHealthBar(x, y, width, height, label, color = 0x00ffff) {
        const container = this.scene.add.container(x, y);
        const text = this.scene.add.text(0, -25, label, {
            fontSize: '16px',
            fontFamily: 'monospace',
            fill: '#ffffff'
        }).setShadow(0, 0, `#${color.toString(16).padStart(6, '0')}`, 10, true, true);

        const bg = this.scene.add.graphics();
        bg.fillStyle(0x000000, 0.6);
        bg.fillRoundedRect(0, 0, width, height, 4);
        
        const bar = this.scene.add.graphics();
        container.add([text, bg, bar]);

        return {
            update: (current, max) => {
                const percentage = Math.max(0, current / max);
                bar.clear();
                bar.fillStyle(color, 0.3);
                bar.fillRoundedRect(-2, -2, (width * percentage) + 4, height + 4, 4);
                bar.fillStyle(color, 1);
                bar.fillRoundedRect(0, 0, width * percentage, height, 4);

                // [GT-11] Si la barra baja, disparar un pequeño shake local o flash
                if (percentage < 0.3) {
                    text.setTint(0xff0000); // Alerta roja si queda poca vida
                }
            }
        };
    }

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
                        scale: 1.15, // Un poco más de énfasis en el bounce
                        duration: 80,
                        yoyo: true
                    });
                }
            }
        };
    }

    renderCard(card, x, y) {
        const stats = card.getStats();
        const px = this.offset.x + (x * this.cellSize) + this.cellSize / 2;
        const py = this.offset.y + (y * this.cellSize) + this.cellSize / 2;

        const container = this.scene.add.container(px, py);
        const background = this.scene.add.rectangle(0, 0, 100, 100, stats.color).setStrokeStyle(4, 0xffffff, 0.8);
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

    updateCardVisual(x, y) {
        const card = this.grid.getCardAt(x, y);
        if (!card) return;

        const container = this.cardSprites.get(card.id);
        if (container) {
            const levelText = container.list[2];
            levelText.setText(`LVL ${card.level}`);

            this.scene.tweens.add({
                targets: container,
                scale: 1.4, // Merge más agresivo
                duration: 100,
                yoyo: true,
                ease: 'Cubic.easeInOut'
            });
        }
    }
}