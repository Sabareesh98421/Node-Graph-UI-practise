// utils.js
export function body() {
    return document.body;
}
export function workspace(){
    return domElements("#workSpace");
}
export function domElements(selector, isEverything = false) {
    if (!isEverything) return document.querySelector(String(selector));
    return document.querySelectorAll(String(selector))

}
function cardHeader(title) {
    const header = document.createElement("div");
    header.setAttribute("class", "nodeHeader")
    header.textContent = title;
    header.style.borderBottom = "0.1px solid rgba(255,255,255,0.2)";
    return header;
}

function cardContent(data) {
    const main = document.createElement("section");
    main.setAttribute("class", "nodeMain")
    main.innerText = data;
    return main
}

export function card(node) {
    const el = document.createElement("div");
    el.className = "nodes";
    // el.id = "Node-" + node.nodeId
    el.style.left = node.selfPosition.x + "px";
    el.style.top = node.selfPosition.y + "px";
    el.id = `node-${node.nodeId}`;
    // el.textContent = node.displayName + "hi";
    setStyleToNode(el);
    domElements("#workSpace").appendChild(el);
    el.appendChild(cardHeader(node.displayName + " - " + node.nodeId));
    el.appendChild(cardContent(node.nodeData));
    new DragNDrop().setElement(el);
    return el;
}

function setStyleToNode(el) {
    el.style.background = "rgba(30,30,50,0.85)";
    el.style.border = "0.1px solid rgba(255,255,255,0.3)";
    el.style.borderRadius = "5px";
}






// an utils function for drag and drop this method is about to set in the add event listener 
export class DragNDrop {
    #isDragging = false;
    #offsetX = 0;
    #offsetY = 0;
    #node = null;
    #workspaceConfig = {
        maxX: 0,
        maxY: 0
    }
    constructor() {
        document.addEventListener("mousemove", (e) => this.drag(e));
        document.addEventListener("mouseup", () => this.drop()); // listen for mouseup, not mousedown
    }
    #enable() {
        if (!this.#node) return
        this.#node.addEventListener("mousedown", (eve) => this.grab(eve));
    }

    setElement(element) {
        this.#node = element;
        this.#enable()
    }
    grab(eve) {
        this.#isDragging = true;
        this.#offsetX = eve.clientX - this.#node.offsetLeft;
        this.#offsetY = eve.clientY - this.#node.offsetTop;
        this.#node.style.cursor = "grabbing";
    }
    drag(eve) {
        if (!this.#isDragging) return
        // Measure container size each time
        const workspace = document.querySelector("#workSpace");
        const maxX = workspace.clientWidth - this.#node.offsetWidth;
        const maxY = workspace.clientHeight - this.#node.offsetHeight;

        let newX = eve.clientX - this.#offsetX;
        let newY = eve.clientY - this.#offsetY;

        this.#node.style.left = Math.min(Math.max(0, newX), maxX) + "px";
        this.#node.style.top = Math.min(Math.max(0, newY), maxY) + "px";

    }
    drop() {
        if (!this.#isDragging) return;
        this.#isDragging = false;
        this.#node.style.cursor = "grab";
    }
}


