// canvas.js
import { domElements } from "./utils.js";
export default class canvasBg {
    gridCanvas = domElements("#grid-canvas-bg");
    #gridCtx = this.gridCanvas.getContext('2d');
    #canvasHeight = 0;
    #canvasWidth = 0;
    #translate = {}
    drawGrid(scale, translate = {}) {
        this.#translate = translate
        const ctx = this.#gridCtx;
        this.#canvasWidth = this.gridCanvas.width;
        this.#canvasHeight = this.gridCanvas.height;
        const height = this.#canvasHeight;
        const width = this.#canvasWidth;
        ctx.clearRect(0, 0, width, height);

        // Background
        ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
        ctx.fillRect(0, 0, width, height);

        // Grid settings
        const BASE_SIZE = 40;
        const smallGridSize = BASE_SIZE / (5 * scale);
        let largeGridSize = BASE_SIZE * scale;
        largeGridSize = Math.min(Math.max(largeGridSize, 40), 60);

        const offsetX = translate.tx % smallGridSize;
        const offsetY = translate.ty % smallGridSize;
        this.#forLargeGrid(largeGridSize);
        this.#forSmallGrids(offsetX, offsetY, smallGridSize);

    }
    #forSmallGrids(offsetX, offsetY, smallGridSize) {
        let ctx = this.#gridCtx;
        // Small grid
        ctx.strokeStyle = '#4b556340';
        ctx.lineWidth = 0.5;
        const height = this.#canvasHeight;
        const width = this.#canvasWidth;
        for (let x = offsetX; x < width; x += smallGridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        for (let y = offsetY; y < height; y += smallGridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

    }
    #forLargeGrid(largeGridSize) {
        let ctx = this.#gridCtx;
        ctx.clearRect(0, 0, this.#canvasWidth, this.#canvasHeight);
        let translate = this.#translate;
        // Large grid (every 5 small grids)
        const largeOffsetX = translate.tx % largeGridSize;
        const largeOffsetY = translate.ty % largeGridSize;
        const height = this.#canvasHeight;
        const width = this.#canvasWidth;
        ctx.strokeStyle = '#4b556380';
        ctx.lineWidth = 1;

        for (let x = largeOffsetX; x < width; x += largeGridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        for (let y = largeOffsetY; y < height; y += largeGridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
    }
    resizeCanvases() {
        const container = domElements("#workflow-container");
        const rect = container.getBoundingClientRect();
        this.gridCanvas.width = rect.width;
        this.gridCanvas.height = rect.height;
        this.connectionsCanvas.width = rect.width;
        this.connectionsCanvas.height = rect.height;
    }
}
