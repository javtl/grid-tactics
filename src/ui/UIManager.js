/**
 * UIManager.js — Grid Tactics
 * Cyber-Arcade Visual Layer | Neons, Glitch VFX & Game Juice
 * ─────────────────────────────────────────────────────────────
 * Paleta canónica:
 *   ATK    : #ff00ff  (0xff00ff) Magenta Neón
 *   DEF    : #39ff14  (0x39ff14) Verde Cyber
 *   ENERGY : #00ffff  (0x00ffff) Cian
 */
export class UIManager {
    constructor(scene, grid) {
        this.scene  = scene;
        this.grid   = grid;
        this.cellSize = 120;
        this.offset   = { x: 300, y: 180 };
        this.cardSprites = new Map();

        // ── Paleta canónica ──────────────────────────────────────
        this.colors = {
            atk:       0xff00ff,   // Magenta
            def:       0x39ff14,   // Verde Cyber
            energy:    0x00ffff,   // Cian
            warn:      0xff6600,   // Naranja alerta
            gridBg:    0x020a12,
            gridLine:  0x0d2535,
            cardBg:    0x050e1a,
            white:     0xffffff,
        };
        this.hexStr = {
            atk:    '#ff00ff',
            def:    '#39ff14',
            energy: '#00ffff',
            warn:   '#ff6600',
            white:  '#ffffff',
        };

        // Texturas de partículas (se generan una vez)
        this._particleTexturesCreated = false;
    }

    // ════════════════════════════════════════════════════════════
    //  GRID
    // ════════════════════════════════════════════════════════════

    drawGrid() {
        const g = this.scene.add.graphics();

        for (let gy = 0; gy < this.grid.size; gy++) {
            for (let gx = 0; gx < this.grid.size; gx++) {
                const px = this.offset.x + gx * this.cellSize;
                const py = this.offset.y + gy * this.cellSize;

                // Fondo de celda — gradiente simulado con capas
                g.fillStyle(this.colors.gridBg, 0.95);
                g.fillRect(px, py, this.cellSize, this.cellSize);

                // Inner highlight (esquina sup-izq)
                g.fillStyle(this.colors.energy, 0.03);
                g.fillRect(px, py, this.cellSize, 2);
                g.fillRect(px, py, 2, this.cellSize);

                // Borde de celda neón
                g.lineStyle(1, this.colors.energy, 0.18);
                g.strokeRect(px, py, this.cellSize, this.cellSize);
            }
        }

        // Borde exterior del grid completo
        const totalW = this.grid.size * this.cellSize;
        const totalH = this.grid.size * this.cellSize;
        g.lineStyle(2, this.colors.energy, 0.6);
        g.strokeRect(this.offset.x, this.offset.y, totalW, totalH);

        // Segunda capa de borde exterior — glow simulado
        g.lineStyle(6, this.colors.energy, 0.08);
        g.strokeRect(
            this.offset.x - 3,
            this.offset.y - 3,
            totalW + 6,
            totalH + 6
        );
    }

    // ════════════════════════════════════════════════════════════
    //  CARTAS
    // ════════════════════════════════════════════════════════════

    /**
     * Renderiza una carta con estética Cyber. El brillo del neón
     * escala con el nivel de la carta.
     */
    renderCard(card, x, y) {
        const stats = card.getStats();
        const px = this.offset.x + x * this.cellSize + this.cellSize / 2;
        const py = this.offset.y + y * this.cellSize + this.cellSize / 2;

        const container = this.scene.add.container(px, py);

        // ── Glow exterior (escala con nivel) ─────────────────
        const glowAlpha = Math.min(0.08 + card.level * 0.04, 0.35);
        const glowSize  = 54 + card.level * 4;
        const glow = this.scene.add.graphics();
        glow.fillStyle(stats.color, glowAlpha);
        glow.fillCircle(0, 0, glowSize);

        // ── Fondo de carta ───────────────────────────────────
        const bg = this.scene.add.graphics();
        // Base oscura
        bg.fillStyle(this.colors.cardBg, 1);
        bg.fillRoundedRect(-50, -50, 100, 100, 6);
        // Tinte de color de tipo (sutil)
        bg.fillStyle(stats.color, 0.08);
        bg.fillRoundedRect(-50, -50, 100, 100, 6);
        // Diagonal highlight
        bg.fillStyle(0xffffff, 0.03);
        bg.fillTriangle(-50, -50, 50, -50, -50, 50);

        // ── Bordes de neón (multi-capa) ──────────────────────
        const borderAlpha = Math.min(0.5 + card.level * 0.12, 1);
        const border = this.scene.add.graphics();
        // Outer glow ring
        border.lineStyle(6, stats.color, 0.15);
        border.strokeRoundedRect(-52, -52, 104, 104, 8);
        // Main border
        border.lineStyle(2, stats.color, borderAlpha);
        border.strokeRoundedRect(-50, -50, 100, 100, 6);
        // Inner accent line
        border.lineStyle(1, stats.color, 0.3);
        border.strokeRoundedRect(-46, -46, 92, 92, 4);

        // Esquinas decorativas (corner brackets)
        const cornerLen = 12;
        const cornerColor = stats.color;
        const cornerAlph  = Math.min(0.8 + card.level * 0.05, 1);
        border.lineStyle(2, cornerColor, cornerAlph);
        // TL
        border.beginPath(); border.moveTo(-50, -38); border.lineTo(-50, -50); border.lineTo(-38, -50); border.strokePath();
        // TR
        border.beginPath(); border.moveTo(38, -50);  border.lineTo(50, -50);  border.lineTo(50, -38);  border.strokePath();
        // BL
        border.beginPath(); border.moveTo(-50, 38);  border.lineTo(-50, 50);  border.lineTo(-38, 50);  border.strokePath();
        // BR
        border.beginPath(); border.moveTo(38, 50);   border.lineTo(50, 50);   border.lineTo(50, 38);   border.strokePath();

        // ── Icono / Letra principal ──────────────────────────
        const colorStr = `#${stats.color.toString(16).padStart(6, '0')}`;
        const label = this.scene.add.text(0, -10, stats.displayName[0], {
            fontSize:   '38px',
            fontFamily: "'Orbitron', monospace",
            color:      this.hexStr.white,
            fontWeight: '700',
            stroke:     colorStr,
            strokeThickness: Math.min(1 + card.level, 5),
        })
        .setShadow(0, 0, colorStr, 14 + card.level * 4, true, true)
        .setOrigin(0.5);

        // ── Nivel ────────────────────────────────────────────
        const levelBg = this.scene.add.graphics();
        levelBg.fillStyle(stats.color, 0.2);
        levelBg.fillRoundedRect(-22, 26, 44, 18, 3);
        levelBg.lineStyle(1, stats.color, 0.6);
        levelBg.strokeRoundedRect(-22, 26, 44, 18, 3);

        const levelText = this.scene.add.text(0, 35, `LVL ${card.level}`, {
            fontSize:   '11px',
            fontFamily: "'Roboto Mono', monospace",
            color:      colorStr,
            fontWeight: '500',
        })
        .setShadow(0, 0, colorStr, 6, true, true)
        .setOrigin(0.5);

        container.add([glow, bg, border, label, levelBg, levelText]);
        container.setSize(100, 100);
        container.setInteractive({ draggable: true });
        container.setData('cardInstance', card);
        container.setData('gridX', x);
        container.setData('gridY', y);
        container.setData('cardId', card.id);

        // ── Animación de entrada ─────────────────────────────
        container.setScale(0).setAlpha(0);
        this.scene.tweens.add({
            targets:  container,
            scale:    1,
            alpha:    1,
            duration: 250,
            ease:     'Back.easeOut',
        });

        // ── Respiración de brillo (cartas de nivel alto) ─────
        if (card.level >= 3) {
            this.scene.tweens.add({
                targets:  glow,
                alpha:    { from: glowAlpha * 0.5, to: glowAlpha },
                duration: 1200 - card.level * 80,
                yoyo:     true,
                repeat:   -1,
                ease:     'Sine.easeInOut',
            });
        }

        this.cardSprites.set(card.id, container);
    }

    updateCardVisual(x, y) {
        const card = this.grid.getCardAt(x, y);
        if (!card) return;

        const container = this.cardSprites.get(card.id);
        if (!container) return;

        // Actualiza el texto de nivel (índice 5 = levelText)
        const levelText = container.list[5];
        if (levelText) levelText.setText(`LVL ${card.level}`);

        // Bump de escala post-merge
        this.scene.tweens.add({
            targets:  container,
            scale:    { from: 1, to: 1.35 },
            duration: 120,
            yoyo:     true,
            ease:     'Cubic.easeInOut',
        });
    }

    // ════════════════════════════════════════════════════════════
    //  PARTÍCULAS DE MERGE
    // ════════════════════════════════════════════════════════════

    /**
     * Explosión de partículas multi-tamaño y multi-color.
     * @param {number} x       Posición X del centro
     * @param {number} y       Posición Y del centro
     * @param {number} baseColor Color base (hex Phaser) de la carta
     */
    createMergeParticles(x, y, baseColor) {
        this._ensureParticleTextures();

        const neonPool = [
            0xff00ff, // ATK Magenta
            0x39ff14, // DEF Verde
            0x00ffff, // Energy Cian
            0xffffff, // Blanco puro
            0xff6600, // Naranja
        ];

        // Aseguramos que el color base siempre esté en la mezcla
        const colorPool = [baseColor, ...neonPool].filter(
            (c, i, arr) => arr.indexOf(c) === i
        );

        // ── Ring flash (destello de impacto) ─────────────────
        const flash = this.scene.add.graphics();
        flash.lineStyle(3, baseColor, 1);
        flash.strokeCircle(x, y, 10);
        this.scene.tweens.add({
            targets:  flash,
            scaleX:   5, scaleY: 5,
            alpha:    0,
            duration: 300,
            ease:     'Cubic.easeOut',
            onComplete: () => flash.destroy(),
        });

        // ── Emitters por tamaño (pixel, grano fino, grueso) ──
        const sizeKeys = ['px_2', 'px_4', 'px_8'];
        const configs  = [
            { key: 'px_2', count: 30, speed: [80, 200],  life: 400 },
            { key: 'px_4', count: 18, speed: [120, 280], life: 550 },
            { key: 'px_8', count:  8, speed: [60,  160], life: 700 },
        ];

        configs.forEach(cfg => {
            const pickedColor = colorPool[
                Math.floor(Math.random() * colorPool.length)
            ];

            const emitter = this.scene.add.particles(x, y, cfg.key, {
                speed:     { min: cfg.speed[0], max: cfg.speed[1] },
                angle:     { min: 0, max: 360 },
                scale:     { start: 1.2, end: 0 },
                alpha:     { start: 1, end: 0 },
                tint:      colorPool, // Phaser rota entre los colores
                lifespan:  cfg.life,
                gravityY:  200,
                blendMode: 'ADD',
                emitting:  false,
            });

            emitter.explode(cfg.count);

            this.scene.time.delayedCall(cfg.life + 100, () => {
                if (emitter && emitter.active) emitter.destroy();
            });
        });

        // ── Shockwave text ────────────────────────────────────
        this.showFloatingText(x, y - 10, 'MERGE!', this.hexStr.energy);
    }

    /** Genera las texturas de partículas una sola vez */
    _ensureParticleTextures() {
        if (this._particleTexturesCreated) return;
        this._particleTexturesCreated = true;

        [[2, 'px_2'], [4, 'px_4'], [8, 'px_8']].forEach(([size, key]) => {
            if (this.scene.textures.exists(key)) return;
            const g = this.scene.add.graphics();
            g.fillStyle(0xffffff, 1);
            g.fillRect(0, 0, size, size);
            g.generateTexture(key, size, size);
            g.destroy();
        });
    }

    // ════════════════════════════════════════════════════════════
    //  TEXTO FLOTANTE
    // ════════════════════════════════════════════════════════════

    showFloatingText(x, y, message, colorHex) {
        const text = this.scene.add.text(x, y, message, {
            fontSize:   '26px',
            fontFamily: "'Orbitron', monospace",
            color:      colorHex,
            fontWeight: '700',
            stroke:     '#000000',
            strokeThickness: 3,
        })
        .setOrigin(0.5)
        .setShadow(0, 0, colorHex, 16, true, true);

        this.scene.tweens.add({
            targets:  text,
            y:        y - 90,
            alpha:    0,
            scaleX:   { from: 1.2, to: 0.8 },
            scaleY:   { from: 1.2, to: 0.8 },
            duration: 900,
            ease:     'Cubic.easeOut',
            onComplete: () => text.destroy(),
        });
    }

    // ════════════════════════════════════════════════════════════
    //  SCREEN SHAKE
    // ════════════════════════════════════════════════════════════

    screenShake(intensity = 0.02, duration = 200) {
        this.scene.cameras.main.shake(duration, intensity);
    }

    // ════════════════════════════════════════════════════════════
    //  RESOURCE DISPLAY  (ATK / DEF)
    // ════════════════════════════════════════════════════════════

    /**
     * Muestra un contador de recurso con flash de color cuando sube.
     * @param {number} x
     * @param {number} y
     * @param {string} label     'ATK' | 'DEF' | etc.
     * @param {string} colorHex  Color neón base (p.ej. '#ff00ff')
     * @returns {{ update(val): void, setMaxed(bool): void }}
     */
    createResourceDisplay(x, y, label, colorHex) {
        const container = this.scene.add.container(x, y);

        // Fondo del panel
        const panelBg = this.scene.add.graphics();
        this._drawPanelBg(panelBg, colorHex, 110, 40);

        // Etiqueta
        const labelText = this.scene.add.text(-48, -8, label, {
            fontSize:   '11px',
            fontFamily: "'Orbitron', monospace",
            color:      colorHex,
            fontWeight: '700',
            alpha:      0.7,
        }).setShadow(0, 0, colorHex, 6, true, true);

        // Valor numérico
        const valueText = this.scene.add.text(48, 0, '0', {
            fontSize:   '22px',
            fontFamily: "'Orbitron', monospace",
            color:      '#ffffff',
            fontWeight: '900',
        })
        .setShadow(0, 0, colorHex, 10, true, true)
        .setOrigin(1, 0.5);

        container.add([panelBg, labelText, valueText]);

        let prevVal = 0;

        return {
            update: (val) => {
                valueText.setText(String(val));

                if (val > prevVal) {
                    // ── Flash a color 'energía' al subir ─────
                    this.scene.tweens.add({
                        targets:  valueText,
                        scale:    { from: 1.5, to: 1 },
                        duration: 200,
                        ease:     'Back.easeOut',
                    });
                    // Destello de color → blanco → color base
                    valueText.setColor(this.hexStr.energy);
                    this.scene.time.delayedCall(80, () => {
                        valueText.setColor('#ffffff');
                        valueText.setShadow(0, 0, colorHex, 10, true, true);
                    });
                } else if (val < prevVal) {
                    // Flash rojo al bajar
                    valueText.setColor(this.hexStr.warn);
                    this.scene.tweens.add({
                        targets:  valueText,
                        scale:    { from: 0.85, to: 1 },
                        duration: 150,
                        ease:     'Cubic.easeOut',
                    });
                    this.scene.time.delayedCall(150, () => {
                        valueText.setColor('#ffffff');
                    });
                }
                prevVal = val;
            },
            setMaxed: (isMaxed) => {
                if (isMaxed) {
                    this.scene.tweens.add({
                        targets:  valueText,
                        alpha:    { from: 0.6, to: 1 },
                        duration: 400,
                        yoyo:     true,
                        repeat:   -1,
                        ease:     'Sine.easeInOut',
                    });
                } else {
                    this.scene.tweens.killTweensOf(valueText);
                    valueText.setAlpha(1);
                }
            },
        };
    }

    // ════════════════════════════════════════════════════════════
    //  NEON HEALTH BAR  (componente de hardware futurista)
    // ════════════════════════════════════════════════════════════

    /**
     * Barra de vida con estética de "módulo de hardware" futurista.
     */
    createNeonHealthBar(x, y, width, height, label, color = this.colors.energy) {
        const colorHex = `#${color.toString(16).padStart(6, '0')}`;
        const container = this.scene.add.container(x, y);

        // ── Panel exterior ───────────────────────────────────
        const panelH  = height + 28;
        const panelBg = this.scene.add.graphics();
        // Sombra exterior (glow)
        panelBg.lineStyle(6, color, 0.1);
        panelBg.strokeRoundedRect(-4, -24, width + 8, panelH + 4, 5);
        // Fondo
        panelBg.fillStyle(0x020810, 0.92);
        panelBg.fillRoundedRect(-2, -22, width + 4, panelH, 4);
        // Borde principal
        panelBg.lineStyle(1, color, 0.5);
        panelBg.strokeRoundedRect(-2, -22, width + 4, panelH, 4);
        // Acento superior
        panelBg.lineStyle(2, color, 0.9);
        panelBg.beginPath();
        panelBg.moveTo(0, -22);
        panelBg.lineTo(width * 0.4, -22);
        panelBg.strokePath();
        // Triángulo decorativo
        panelBg.fillStyle(color, 0.7);
        panelBg.fillTriangle(0, -22, 8, -22, 0, -15);

        // ── Etiqueta ─────────────────────────────────────────
        const labelText = this.scene.add.text(6, -17, label, {
            fontSize:   '10px',
            fontFamily: "'Orbitron', monospace",
            color:      colorHex,
            fontWeight: '700',
        }).setShadow(0, 0, colorHex, 6, true, true);

        // ── Contador numérico ─────────────────────────────────
        const valueText = this.scene.add.text(width - 2, -17, '100/100', {
            fontSize:   '9px',
            fontFamily: "'Roboto Mono', monospace",
            color:      '#88aacc',
        }).setOrigin(1, 0);

        // ── Track de barra ───────────────────────────────────
        const trackBg = this.scene.add.graphics();
        trackBg.fillStyle(0x000000, 0.8);
        trackBg.fillRoundedRect(0, 0, width, height, 3);
        trackBg.lineStyle(1, color, 0.25);
        trackBg.strokeRoundedRect(0, 0, width, height, 3);

        // Marcas de graduación
        const ticks = 5;
        for (let i = 1; i < ticks; i++) {
            const tx = (width / ticks) * i;
            trackBg.lineStyle(1, color, 0.15);
            trackBg.beginPath();
            trackBg.moveTo(tx, 0);
            trackBg.lineTo(tx, height);
            trackBg.strokePath();
        }

        // ── Barra de vida dinámica ────────────────────────────
        const bar = this.scene.add.graphics();

        container.add([panelBg, labelText, valueText, trackBg, bar]);

        // Estado interno
        let currentPct = 1;
        let warnMode   = false;

        return {
            update: (current, max) => {
                const pct = Math.max(0, Math.min(1, current / max));
                valueText.setText(`${current}/${max}`);

                // Color de la barra según % de vida
                const barColor = pct > 0.5 ? color
                               : pct > 0.25 ? this.colors.warn
                               : 0xff2222;

                bar.clear();

                // Glow de la barra
                bar.fillStyle(barColor, 0.12);
                bar.fillRoundedRect(-1, -1, (width * pct) + 2, height + 2, 3);

                // Barra principal
                bar.fillStyle(barColor, 1);
                bar.fillRoundedRect(0, 0, width * pct, height, 3);

                // Highlight superior (brillo)
                bar.fillStyle(0xffffff, 0.15);
                bar.fillRoundedRect(0, 0, width * pct, Math.max(1, height * 0.3), 2);

                // Modo alerta (< 30%) — texto parpadeante
                if (pct < 0.3 && !warnMode) {
                    warnMode = true;
                    labelText.setColor('#ff2222');
                    labelText.setShadow(0, 0, '#ff2222', 10, true, true);
                    this.scene.tweens.add({
                        targets:  labelText,
                        alpha:    { from: 1, to: 0.3 },
                        duration: 400,
                        yoyo:     true,
                        repeat:   -1,
                    });
                } else if (pct >= 0.3 && warnMode) {
                    warnMode = false;
                    this.scene.tweens.killTweensOf(labelText);
                    labelText.setAlpha(1);
                    labelText.setColor(colorHex);
                    labelText.setShadow(0, 0, colorHex, 6, true, true);
                }

                currentPct = pct;
            },
        };
    }

    // ════════════════════════════════════════════════════════════
    //  ABILITY BUTTONS
    // ════════════════════════════════════════════════════════════

    /**
     * Crea un botón de habilidad con borde de neón.
     * @param {number} x
     * @param {number} y
     * @param {string} text      Texto del botón
     * @param {'atk'|'def'} type Tipo para paleta de color
     * @param {Function} onClick Callback
     * @returns {{ setEnabled(bool): void }}
     */
    createAbilityButton(x, y, text, type, onClick) {
        const color    = this.colors[type] ?? this.colors.energy;
        const colorHex = this.hexStr[type]  ?? this.hexStr.energy;

        const container = this.scene.add.container(x, y);
        const W = 140, H = 38;

        // ── Fondo ─────────────────────────────────────────────
        const bg = this.scene.add.graphics();
        this._drawButtonBg(bg, color, W, H);

        // ── Texto ─────────────────────────────────────────────
        const label = this.scene.add.text(0, 0, text, {
            fontSize:   '12px',
            fontFamily: "'Orbitron', monospace",
            color:      colorHex,
            fontWeight: '700',
            letterSpacing: 1,
        })
        .setOrigin(0.5)
        .setShadow(0, 0, colorHex, 8, true, true);

        container.add([bg, label]);
        container.setSize(W, H);
        container.setInteractive();

        // ── Hover ─────────────────────────────────────────────
        container.on('pointerover', () => {
            if (!container.getData('enabled')) return;
            this.scene.tweens.add({
                targets: container, scale: 1.06,
                duration: 80, ease: 'Cubic.easeOut',
            });
            bg.clear();
            this._drawButtonBgHover(bg, color, W, H);
        });

        container.on('pointerout', () => {
            if (!container.getData('enabled')) return;
            this.scene.tweens.add({
                targets: container, scale: 1,
                duration: 80, ease: 'Cubic.easeOut',
            });
            bg.clear();
            this._drawButtonBg(bg, color, W, H);
        });

        // ── Click ──────────────────────────────────────────────
        container.on('pointerdown', () => {
            if (!container.getData('enabled')) return;
            this.scene.tweens.add({
                targets: container, scale: 0.92,
                duration: 50, yoyo: true,
            });
            this.scene.time.delayedCall(60, onClick);
        });

        container.setData('enabled', true);

        return {
            setEnabled: (enabled) => {
                container.setData('enabled', enabled);
                if (enabled) {
                    container.setAlpha(1);
                    label.setColor(colorHex);
                    label.setShadow(0, 0, colorHex, 8, true, true);
                    bg.clear();
                    this._drawButtonBg(bg, color, W, H);
                    this.scene.tweens.add({
                        targets: container,
                        scale:   { from: 1.08, to: 1 },
                        duration: 180, ease: 'Back.easeOut',
                    });
                } else {
                    container.setAlpha(0.38);
                    label.setColor('#445566');
                    label.setShadow(0, 0, '#000000', 0, false, false);
                    bg.clear();
                    this._drawButtonBgDisabled(bg, W, H);
                }
            },
        };
    }

    // ── Helpers internos para dibujar botones ──────────────────

    _drawButtonBg(g, color, W, H) {
        g.fillStyle(0x020810, 0.92);
        g.fillRoundedRect(-W / 2, -H / 2, W, H, 5);
        g.lineStyle(5, color, 0.12);
        g.strokeRoundedRect(-W / 2 - 2, -H / 2 - 2, W + 4, H + 4, 6);
        g.lineStyle(1.5, color, 0.85);
        g.strokeRoundedRect(-W / 2, -H / 2, W, H, 5);
        // Acento superior
        g.lineStyle(2, color, 1);
        g.beginPath();
        g.moveTo(-W / 2 + 6, -H / 2);
        g.lineTo(W / 4, -H / 2);
        g.strokePath();
    }

    _drawButtonBgHover(g, color, W, H) {
        g.fillStyle(color, 0.12);
        g.fillRoundedRect(-W / 2, -H / 2, W, H, 5);
        g.lineStyle(8, color, 0.2);
        g.strokeRoundedRect(-W / 2 - 3, -H / 2 - 3, W + 6, H + 6, 7);
        g.lineStyle(2, color, 1);
        g.strokeRoundedRect(-W / 2, -H / 2, W, H, 5);
        g.lineStyle(2, color, 1);
        g.beginPath();
        g.moveTo(-W / 2 + 6, -H / 2);
        g.lineTo(W / 3, -H / 2);
        g.strokePath();
    }

    _drawButtonBgDisabled(g, W, H) {
        g.fillStyle(0x050a0f, 0.85);
        g.fillRoundedRect(-W / 2, -H / 2, W, H, 5);
        g.lineStyle(1, 0x1a2535, 0.6);
        g.strokeRoundedRect(-W / 2, -H / 2, W, H, 5);
    }

    _drawPanelBg(g, colorHex, W, H) {
        const color = parseInt(colorHex.replace('#', '0x'), 16);
        g.fillStyle(0x020810, 0.88);
        g.fillRoundedRect(-W / 2, -H / 2, W, H, 4);
        g.lineStyle(1, color, 0.55);
        g.strokeRoundedRect(-W / 2, -H / 2, W, H, 4);
        g.lineStyle(3, color, 0.1);
        g.strokeRoundedRect(-W / 2 - 2, -H / 2 - 2, W + 4, H + 4, 5);
        // Acento
        g.lineStyle(2, color, 0.8);
        g.beginPath();
        g.moveTo(-W / 2 + 4, -H / 2);
        g.lineTo(-W / 2 + 28, -H / 2);
        g.strokePath();
    }
}