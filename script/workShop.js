// workShop.js
import { card, domElements } from "./utils.js";
import { Node } from "./nodes.js"
import canvasBg from "./canvas.js";
export class WorkShop {
    /***
     * @type Array<Node>
     */
    nodes = []
    #scale = 1;
    #translate = {
        tx: 0,
        ty: 0
    };
    workSpaceSize = {
        height: 0,
        width: 0
    }
    #canvas = null;
    constructor() {
        this.workSpaceSize = {
            height: domElements("main").clientHeight,
            width: domElements("main").clientWidth
        }
        this.#canvas = new canvasBg();
        // this.#canvas.drawGrid(this.#scale, this.#translate);
        this.#getWorkspace().addEventListener("wheel", (eve) => {
            if (!eve.ctrlKey) return
            eve.preventDefault();
            this.#zoom(eve.deltaY, eve);
        })
        this.#getWorkspace().style.transformOrigin = "0 0";
        this.nodes = this.#getNodesFromLocalStorage() || this.nodes;
        this.#createCards();
    }

    #getWorkspace() {
        return domElements("#workSpace")
    }
    #zoom(delta, event) {
        const workspace = this.#getWorkspace();
        const rect = workspace.getBoundingClientRect();

        const [newScale, oldScale] = this.#zoomFactor(delta)

        // Get current transform values
        const currentTransform = workspace.style.transform || "translate(0px, 0px) scale(1)";
        const translateMatch = currentTransform.match(/translate\(([-0-9.]+)px,\s*([-0-9.]+)px\)/);
        console.log(translateMatch)
        const tx = translateMatch ? parseFloat(translateMatch[1]) : 0;
        const ty = translateMatch ? parseFloat(translateMatch[2]) : 0;

        // Mouse position relative to workspace
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        // Content point under mouse (before zoom)
        const contentX = (mouseX - tx) / oldScale;
        const contentY = (mouseY - ty) / oldScale;

        // New translation to keep content point under mouse
        this.#setNewTransForm(mouseX, mouseY, contentX, contentY, newScale);

        // Apply transform
        // this.#applyTransform(workspace, newScale);
        // Update each node's position (infinite space illusion)
        this.#updateAllNodePositions();

    }

    #setNewTransForm(mouseX, mouseY, contentX, contentY, newScale) {
        this.#translate.tx = mouseX - contentX * newScale;
        this.#translate.ty = mouseY - contentY * newScale;

    }
    #zoomFactor(delta) {
        // Zoom factor
        const scaleAmount = delta > 0 ? 0.9 : 1.1;
        const oldScale = this.#scale || 1;
        const newScale = Math.min(Math.max(oldScale * scaleAmount, 0.1), 5); // Limit: 0.1x to 5x
        this.#scale = newScale;
        return [newScale, oldScale]
    }
    // ADD THIS NEW METHOD
    #updateAllNodePositions() {
        const nodeElements = domElements(".nodes", true);
        nodeElements.forEach((nodeEl) => {
            console.log(nodeEl.id)
            const nodeId = parseInt(nodeEl.id);
            const node = this.nodes.find(n => n.id === nodeId);

            if (node) {
                // Calculate screen position from world position
                const screenX = node.selfPosition.x * this.#scale + this.#translate.tx;
                const screenY = node.selfPosition.y * this.#scale + this.#translate.ty;

                // Update node position WITHOUT scaling the node itself
                nodeEl.style.left = screenX + "px";
                nodeEl.style.top = screenY + "px";
                nodeEl.style.transform = "none"; // Ensure no transform on node
            }
        });
    }
    #addNodeToWorkshopList(nodes) {

        // this.#checkIsValidArgumentsType(node, { type: Array, of: Node });
        if (!(Array.isArray(nodes))) {
            this.nodes.push(nodes)
            this.#setNodeInFromLocalStorage();
            return;
        }
        nodes.forEach(() => {
            this.nodes.push(nodes)
        })
        this.#setNodeInFromLocalStorage();
        return;
    }
    // this is redundant done by willingly 
    addNodeToWorkshopList(nodes) {
        // this.#checkIsValidArgumentsType(node, { type: Array, of: Node });
        if (!(Array.isArray(nodes))) {
            this.nodes.push(nodes)
            this.#setNodeInFromLocalStorage();
            return;
        }
        nodes.forEach(() => {
            this.nodes.push(nodes)
        })
        this.#setNodeInFromLocalStorage();
        return;
    }


    createNode() {
        let randomNumber = Math.floor(Math.random() * 100)
        let nodeData = {
            name: "Node",
            data: randomNumber,
            boundary: {
                height: this.workSpaceSize.height,
                width: this.workSpaceSize.width
            }
        };

        let node = new Node(nodeData);
        card(node);
        this.#addNodeToWorkshopList(node)
    }
    #createCards() {
        this.nodes.forEach(node => {
            card(node);
        })
    }
    #getNodesFromLocalStorage() {
        let keyname = "nodes"
        return JSON.parse(localStorage.getItem(keyname));
    }
    #setNodeInFromLocalStorage() {
        let keyName = "nodes";
        localStorage.setItem(keyName, JSON.stringify(this.nodes));
    }
}



// waste of times
function typeCheckForCollections(value, expectedType) {
    // Case 1: Expected a collection (like Array<Node>)
    if (expectedType.type !== Array) throw new TypeError("the collection is not in an Array")
    if (!Array.isArray(value))
        throw new TypeError(`Expected an Array, got ${value?.constructor?.name || typeof value}`);

    if (expectedType.of) {
        for (const item of value) {
            // this.#checkIsValidArgumentsType(item, expectedType.of);
        }
    }
    return;
}
function checkIsValidArgumentsType(value, expectedType) {
    // if (typeof expectedType === "object") return this.#typeCheckForCollections(value, expectedType);

    // Case 2: Expected a plain Array
    if (expectedType === Array) {
        if (!Array.isArray(value))
            throw new TypeError(`Expected value to be an Array`);
        return;
    }

    // Case 3: Expected a specific class (Node, etc.)
    // Make sure expectedType is callable (constructor)
    if (typeof expectedType !== "function") {
        throw new TypeError(`Invalid type passed to type checker: ${expectedType}`);
    }
    // Case 4: Expected a class instance (like Node)
    if (!(value instanceof expectedType)) {
        throw new TypeError(`Expected instance of ${expectedType.name}, got ${value?.constructor?.name || typeof value}`);
    }
}