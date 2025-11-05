import { Node } from "./nodes.js";

// utils.js
export function body() {
    return document.body;
}
export function svg() {
    return domElements("#nodeConnector");
}
export function workspace() {
    return domElements("#workSpace");
}
export function edgeAnchorPoints() {
    return domElements(".edgeConnector", true);
}
export function mainTag() {
    return domElements("main");
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
    console.table(node);
    const el = document.createElement("div");
    el.className = "nodes";
    el.id = "Node-" + node.nodeId
    // I moved this logic to the wrapper so I can add the edge's anchor point and I move the entire edge and node at my will, because the the edge are calculated from the anchors.

    // the below comment will may not deleted,that because it's for my understand  how things works
    // el.style.left = node.selfPosition.x + "px";
    // el.style.top = node.selfPosition.y + "px";
    el.id = `node-${node.nodeId}`;
    // el.textContent = node.displayName + "hi";
    setStyleToNode(el);
    // domElements("#workSpace").appendChild(el);
    el.appendChild(cardHeader(node.displayName + " - " + node.nodeId));
    el.appendChild(cardContent(node.nodeData));
    // new DragNDrop().setElement(el);
    return el;
}


/**
 * 
 * @param {Array<string>} requiredSpan 
 * @param {Node} node 
 * @returns Array<HTMLSpanElement>
 */
function createSpanTags(requiredSpan, node) {
    /**
     * @type Array<HTMLSpanElement>
     */
    let spansTags = [];

    requiredSpan.map((eachSpan, index) => {
        let [, , role] = eachSpan.split("-");
        let span = document.createElement("span");
        span.setAttribute("id", `node${node.nodeId}--${eachSpan}-${index}`);
        span.setAttribute("class", `spanTags  connector--${node.nodeId} edgeConnector ${role}`);
        // span.style[position] = "0px";
        // span.style[place] = "0px";
        spansTags.push(span);
    }
    )
    return spansTags;
}
/**
 * 
 * @param {Node} node 
 * @returns Array<HTMLSpanElement>
 */
function edgeAnchors(node) {
    // let edgeAnchorPoints=[right,left,top,bottom];
    // But CUrrently for testing we use only two point in and out points
    let edgeAnchorPoints = ["left-top-input", "left-bottom-output"];
    let spanTags = createSpanTags(edgeAnchorPoints, node);;
    return spanTags;
}

export function cardWrapper(node) {
    let nodeWrapper = document.createElement("div");
    let cardEl = card(node)
    nodeWrapper.setAttribute("class", "node-wrapper");
    nodeWrapper.style.left = node.selfPosition.x + "px";
    nodeWrapper.style.top = node.selfPosition.y + "px";
    nodeWrapper.id = `node-${node.nodeId}`;
    domAppend(nodeWrapper, cardEl)
    domAppend(nodeWrapper, edgeAnchors(node));
    domElements("#workSpace").appendChild(nodeWrapper);
    new DragNDrop().setElement(nodeWrapper);
    return nodeWrapper
}

function setStyleToNode(el) {
    el.style.background = "rgba(30,30,50,0.85)";
    el.style.border = "0.1px solid rgba(255,255,255,0.3)";
    el.style.borderRadius = "5px";
}

function domAppend(parentElement, child) {
    if (!(Array.isArray(child) || child instanceof HTMLElement)) throw new Error("the child must be an array or just plain html elements")
    if (Array.isArray(child)) {
        appendArrayOfChildHandler(parentElement, child);
    }
    else {
        // just append it

        parentElement.appendChild(child)
    }

}
function appendArrayOfChildHandler(parent, child) {
    child.map((eachSpan) =>
        parent.appendChild(eachSpan)
    )
}




// an utils function for drag and drop this method is about to set in the add event listener 
class DragNDrop {
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


