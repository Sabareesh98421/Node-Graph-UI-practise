// workShop.js
import { cardWrapper, domElements, mainTag, workspace } from "./utils.js";
import { Node } from "./nodes.js"
import canvasBg from "./canvas.js";
import NodeConnection from "./nodeToNodeConnection.js";

export class WorkShop {
    /***
     * @type Set<Node>
     */
    nodes = new Set();
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
    connectionState = {
        startNode: null,
        endNode: null
    }
    constructor() {
        this.workSpaceSize = {
            height: mainTag().clientHeight,
            width: mainTag().clientWidth
        }
        this.#canvas = new canvasBg();
        // this.#canvas.drawGrid(this.#scale, this.#translate);
        workspace().addEventListener("wheel", (eve) => {
            if (!eve.ctrlKey) return
            eve.preventDefault();
            this.#zoom(eve.deltaY, eve);
        })
        workspace().style.transformOrigin = "0 0";
        this.nodes = this.#getNodesFromLocalStorage() || this.nodes;
        this.#createCards();


        // edge Connector Class 
        new NodeConnection()
    }


    #zoom(delta, event) {
        const workSpace = workspace();
        const rect = workSpace.getBoundingClientRect();

        const [newScale, oldScale] = this.#zoomFactor(delta)

        // Get current transform values
        const currentTransform = workSpace.style.transform || "translate(0px, 0px) scale(1)";
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
        nodeData.selfPosition = node.getSelfPosition();
        this.#addNodeToWorkshopList(node)
        // planning to create the self Conscious node
        let nodeEleRef = cardWrapper(node);
        // node.setSelfRefEle(nodeEleRef);
    }

    #createCards() {
        this.nodes.forEach(node => {
            // if (!(node instanceof Node)) { throw ReferenceError("the instanceof of the node is not node itslef") }
            let nodeEle = cardWrapper(node);
            // node.setSelfRefEle(nodeEle);
            nodeEle.addEventListener("click", (eve) => {
                this.handleNodeClick(eve, node)
            })
        })
    }

    #createConnection(targetedNode) {
        // if (!(targetedNode instanceof Node)) return;
        console.log(targetedNode)
        new NodeConnection(targetedNode);
    }

    #instanizerFromObjLit() {
        if (!(this.nodes.length)) return;
        this.nodes = new Set([...this.nodes].map(node =>
            new Node(node)
        ))
    }

    #getNodesFromLocalStorage() {
        let keyname = "nodes"
        this.nodes = new Set(JSON.parse(localStorage.getItem(keyname))) || this.nodes;
        this.#instanizerFromObjLit();

        return this.nodes
    }

    #setNodeInFromLocalStorage() {
        let keyName = "nodes";
        localStorage.setItem(keyName, JSON.stringify([...this.nodes]));
    }

    handleNodeClick(eve, node) {
        const target = eve.target;
        if (!(target instanceof HTMLDivElement)) {
            return null;
        }
        if (!(target.classList.contains("nodes"))) {
            return null;
        }
        console.log(target);
        console.warn(target.id);
        const state = this.connectionState;
        if (!state.startNode) {
            state.startNode = node;
            console.log(node.nodeId)
            return;
        }
        this.#setEndNode(state, node)
        this.#restStates()
    }
    #setEndNode(state, node) {
        // IDK the comparition check the node itself or the reference so I just use nodeID  just for my own consern if IAm wrong I am willingly to correct it 
        if (state.startNode && state.startNode.nodeId !== node.nodeId) {
            state.endNode = node
            this.#createConnection(state)
        }
    }
    #restStates() {
        this.connectionState = { startNode: null, endNode: null };
    }
}


