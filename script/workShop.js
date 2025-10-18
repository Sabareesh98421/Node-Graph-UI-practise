// workShop.js
import { card, domElements } from "./utils.js";
import { Node } from "./nodes.js"
import canvasBg from "./canvas.js";
export class WorkShop {
    /***
     * @type Set<Node>
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
        if (Array.isArray(nodes)) return this.#setArrayOFNodesToWorkSpaceList(nodes);
        if (!(nodes instanceof Node)) throw new TypeError("The node must be an instanceof Node")
        this.nodes.add(nodes)

        
        this.#setNodeInFromLocalStorage();
        return;
    }
    #setArrayOFNodesToWorkSpaceList(nodes) {
        nodes.forEach((node) => {
            if (!(node instanceof Node)) throw new TypeError("The node must be an instanceof Node")
            this.nodes.add(node)
        })
        this.#setNodeInFromLocalStorage();

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
        this.nodes = new Set(JSON.parse(localStorage.getItem(keyname))) || this.nodes;
        // return this.#covertParsedJsonToNodeInstance();
        return this.nodes;
    }

    #covertParsedJsonToNodeInstance() {
        this.nodes.map((eachNode) => JSON.parse(eachNode));
        return this.nodes;
    }

    #setNodeInFromLocalStorage() {
        let keyName = "nodes";
        localStorage.setItem(keyName, JSON.stringify([...this.nodes]));
    }
}


