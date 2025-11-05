// nodes.js
import { domElements } from "./utils.js";

export class Node {
    #selfRef

    static nodeId = 0;
    // to know those nodes are available or not 
    connectionPoints = {
        left: false,
        right: false,
        top: false,
        bottom: false
    };
    constructor(props) {
        this.nodeId = ++Node.nodeId;
        this.displayName = props.name.trim();
        this.nodeData = props.data;
        // default position
        this.selfPosition = {
            x: 150,
            y: 150
        };
        // multi direction connector
        this.edge = 0;
        // four directional edge connection
        this.leftEdgeIsConnected = false;
        this.rightEdgeIsConnected = false;
        this.topEdgeIsConnected = false;
        this.bottomEdgeIsConnected = false;
        // always next to the previous node then its not over laying it 
        this.spawnNodeInRandomLocation();
        this.connectedNodesId = [];
        // optional: pass boundary from WorkShop
        this.boundary = props.boundary;
        this.#setConnectorEventLogic()

    }
    connect(connectedNodeId) {
        this.connectedNodesId.push(connectedNodeId);
    }
    getSelfPosition(){
        return this.selfPosition;
    }
    spawnNodeInRandomLocation() {
        if (this.nodeId == 1) return;
        if (Math.random() < 0.5) {
            this.selfPosition.x += this.$ensureNodeSpawnPositionRestricted(Math.random() * 50, "x");
        } else {
            this.selfPosition.y += this.$ensureNodeSpawnPositionRestricted(Math.random() * 50, "y");
        }

    }
    setNewPositions(newX, newY) {
        this.selfPosition = {
            x: newX,
            y: newY
        }
    }
    #setConnectorEventLogic() {
        if (!(this.#selfRef instanceof HTMLElement)) return;
        this.#selfRef.addEventListener("click", () => { })
    }

    $ensureNodeSpawnPositionRestricted(calculatedValue, axis = "x") {
        if (this.nodeId === 1 || !this.boundary) return;
        const max = axis === "x" ? this.boundary.width : this.boundary.height
        return calculatedValue < max ? calculatedValue : max - 10
    }
    get connectionPoints() {
        const node = domElements(`#node-${this.nodeId}`);
        if (!node) return null;
        if ((node instanceof NodeList)) return null;

        const rect = node.getBoundingClientRect();
        return {
            output: { x: rect.right, y: rect.top + rect.height / 2 },
            input: { x: rect.LEFT, y: rect.top + rect.height / 2 }
        }
    }

    get selfRefEle() {
        return this.#selfRef
    }
    set setSelfRefEle(node) {
        if (!(node instanceof HTMLElement)) throw new TypeError("The node is not HTML Element")
        if (!(node.classList.contains("nodes"))) {
            throw new ReferenceError("the selectedNode is not the node ")
        }
        this.#selfRef = node;
    }
}

