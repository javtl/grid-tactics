/**
 * Grid.js
 * Manages the 4x4 game board logic.
 */
export class Grid {
    constructor(size = 4) {
        this.size = size;
        this.cells = this.createEmptyGrid();
    }

    /**
     * Initializes a 2D array filled with null.
     * [ [null, null...], [null, null...] ]
     */
    createEmptyGrid() {
        return Array(this.size).fill(null).map(() => Array(this.size).fill(null));
    }

    /**
     * Places a card at specific coordinates.
     */
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

    /**
     * Returns all empty coordinates as an array of objects [{x, y}, ...]
     */
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
