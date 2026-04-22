/**
 * Grid.js
 * Manages the 4x4 game board logic, merging, and swapping.
 */
export class Grid {
    constructor(size = 4) {
        this.size = size;
        this.cells = this.createEmptyGrid();
    }

    createEmptyGrid() {
        return Array(this.size).fill(null).map(() => Array(this.size).fill(null));
    }

    getCardAt(x, y) {
        if (this.isWithinBounds(x, y)) {
            return this.cells[y][x];
        }
        return null;
    }

    /**
     * Intercambia la posición de dos celdas.
     * Funciona tanto si hay cartas como si una celda está vacía.
     */
    swapCards(x1, y1, x2, y2) {
        if (!this.isWithinBounds(x1, y1) || !this.isWithinBounds(x2, y2)) return;

        const temp = this.cells[y1][x1];
        this.cells[y1][x1] = this.cells[y2][x2];
        this.cells[y2][x2] = temp;
    }

    /**
     * Ejecuta la fusión de dos cartas con suma aditiva de niveles.
     * VALIDA ESTRICTAMENTE que sean del mismo tipo.
     */
    mergeCards(fromX, fromY, toX, toY) {
        const sourceCard = this.getCardAt(fromX, fromY);
        const targetCard = this.getCardAt(toX, toY);

        // Bloqueo de seguridad: Si no son del mismo tipo, abortamos
        if (!sourceCard || !targetCard || sourceCard.type !== targetCard.type) {
            console.error("GRID_ERROR: Intento de merge ilegal entre tipos distintos");
            return null;
        }

        // FIX GT-012: Suma aditiva real
        targetCard.level += sourceCard.level;
        
        // Limpiamos el origen
        this.removeCard(fromX, fromY);
        
        return targetCard.level;
    }

    removeCard(x, y) {
        if (this.isWithinBounds(x, y)) {
            this.cells[y][x] = null;
        }
    }

    addCard(card, x, y) {
        if (this.isWithinBounds(x, y) && !this.cells[y][x]) {
            this.cells[y][x] = card;
            return true;
        }
        return false;
    }

    isWithinBounds(x, y) {
        return x >= 0 && x < this.size && y >= 0 && y < this.size;
    }

    getEmptyCells() {
        const empty = [];
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                if (!this.cells[y][x]) empty.push({ x, y });
            }
        }
        return empty;
    }
}