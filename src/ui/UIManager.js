/**
 * UIManager.js
 * Handles the Cyber-Arcade visual layer, neons, and GT-12 Ability System.
 */
export class UIManager {
    constructor(scene, grid) {
        this.scene = scene;
        this.grid = grid;
        this.cellSize = 120;
        this.offset = { x: 300, y: 180 };
        
        // CAMBIO CRÍTICO: Usamos una matriz 2D para los sprites, igual que el Grid
        this.cardSprites = Array(this.grid.size).fill(null).map(() => Array(this.grid.size).fill(null));

        this.colors = {
            cyan: 0x00ffff,   
            pink: 0xff00ff,   
            lime: 0x39ff14,   
            grid: 0x1a1a2e,   
            neonStroke: 0x4ecdc4,
            disabled: 0x555555 
        };
    }

    /**
     * [NUEVO] El "Borrón y cuenta nueva". 
     * Elimina todos los sprites y los redibuja según la lógica actual del Grid.
     */
    refreshGridVisuals() {
        // 1. Limpiar todos los sprites existentes
        for (let y = 0; y < this.grid.size; y++) {
            for (let x = 0; x < this.grid.size; x++) {
                if (this.cardSprites[y][x]) {
                    this.cardSprites[y][x].destroy();
                    this.cardSprites[y][x] = null;
                }
            }
        }

        // 2. Dibujar lo que hay en el Grid lógico
        for (let y = 0; y < this.grid.size; y++) {
            for (let x = 0; x < this.grid.size; x++) {
                const card = this.grid.getCardAt(x, y);
                if (card) {
                    this.renderCard(card, x, y);
                }
            }
        }
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
        
        // Metadatos esenciales para el InputHandler
        container.setData('cardInstance', card); 
        container.setData('gridX', x);
        container.setData('gridY', y);

        // Guardar en nuestra matriz visual
        this.cardSprites[y][x] = container;

        // Animación de entrada
        container.setScale(0);
        this.scene.tweens.add({
            targets: container,
            scale: 1,
            duration: 200,
            ease: 'Back.easeOut'
        });
    }

    // --- SISTEMA DE HABILIDADES ---

    createAbilityButton(x, y, ability) {
        const btnColor = ability.type === 'DAMAGE' ? '#ff00ff' : '#39ff14';
        const container = this.scene.add.container(x, y);
        const bg = this.scene.add.rectangle(0, 0, 160, 50, 0x111122)
            .setStrokeStyle(2, ability.type === 'DAMAGE' ? 0xff00ff : 0x39ff14, 0.5);

        const nameText = this.scene.add.text(0, -8, ability.name, {
            fontSize: '14px', fontFamily: 'monospace', fill: btnColor, fontWeight: 'bold'
        }).setOrigin(0.5);

        const costLabel = ability.cost.atk > 0 ? `⚡${ability.cost.atk}` : `🛡️${ability.cost.def}`;
        const costText = this.scene.add.text(0, 12, `COST: ${costLabel}`, {
            fontSize: '11px', fontFamily: 'monospace', fill: '#cccccc'
        }).setOrigin(0.5);

        container.add([bg, nameText, costText]);
        container.setSize(160, 50);
        container.setInteractive({ useHandCursor: true });
        container.setData('cost', ability.cost);
        container.setData('mainColor', btnColor);

        return container;
    }

    refreshAbilityButtons(buttons, currentAtk, currentDef) {
        buttons.forEach(btn => {
            const cost = btn.getData('cost');
            const bg = btn.list[0];
            const isAffordable = currentAtk >= cost.atk && currentDef >= cost.def;

            if (isAffordable) {
                btn.setAlpha(1);
                btn.setInteractive();
                bg.setStrokeStyle(2, parseInt(btn.getData('mainColor').replace('#', '0x')), 1);
            } else {
                btn.setAlpha(0.3);
                btn.disableInteractive();
                bg.setStrokeStyle(2, 0x555555, 0.5);
            }
        });
    }

    // --- VFX Y OTROS ---

    createMergeParticles(x, y, color) {
        const emitter = this.scene.add.particles(x, y, 'pixel_particle', {
            speed: { min: 100, max: 250 },
            scale: { start: 1, end: 0 },
            lifespan: 500,
            gravityY: 150,
            emitting: false
        });
        emitter.explode(20);
        this.scene.time.delayedCall(600, () => emitter.destroy());
    }

    showFloatingText(x, y, message, colorHex) {
        const text = this.scene.add.text(x, y, message, {
            fontSize: '28px', fontFamily: 'monospace', fill: colorHex, fontWeight: 'bold'
        }).setOrigin(0.5);

        this.scene.tweens.add({
            targets: text,
            y: y - 80,
            alpha: 0,
            duration: 800,
            onComplete: () => text.destroy()
        });
    }

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
            fontSize: '16px', fontFamily: 'monospace', fill: '#ffffff'
        });
        const bg = this.scene.add.graphics();
        bg.fillStyle(0x000000, 0.6);
        bg.fillRoundedRect(0, 0, width, height, 4);
        const bar = this.scene.add.graphics();
        container.add([text, bg, bar]);

        return {
            update: (current, max) => {
                const percentage = Math.max(0, current / max);
                bar.clear();
                bar.fillStyle(color, 1);
                bar.fillRoundedRect(0, 0, width * percentage, height, 4);
            }
        };
    }

    createResourceDisplay(x, y, label, colorHex) {
        const text = this.scene.add.text(x, y, `${label}: 0`, {
            fontSize: '20px', fontFamily: 'monospace', fill: '#ffffff'
        }).setShadow(0, 0, colorHex, 12, true, true);

        return {
            update: (val) => {
                text.setText(`${label}: ${val}`);
            }
        };
    }
}