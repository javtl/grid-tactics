/**
 * Grid.js
 * Manages the 4x4 game board logic.
 */
export class Grid {
    constructor(size = 4) {
        this.size = size;
        this.cells = this.createEmptyGrid();
    }

    createEmptyGrid() {
        return Array(this.size).fill(null).map(() => Array(this.size).fill(null));
    }

    /**
     * Devuelve la carta en una posición específica.
     * Vital para que el InputHandler pueda comparar tipos.
     */
    getCardAt(x, y) {
        if (this.isWithinBounds(x, y)) {
            return this.cells[y][x];
        }
        return null;
    }

    /**
     * Elimina la referencia de una carta en el tablero lógico.
     * Se usa al fusionar para limpiar la celda de origen.
     */
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