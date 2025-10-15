// index.js
import { card, domElements } from "./utils.js"



class WorkShop {
    /***
     * @type Array<Node>
     */
    nodes = []
    #scale = 1
    workSpaceSize = {
        height: 0,
        width: 0
    }
    constructor() {
        this.workSpaceSize = {
            height: domElements("main").clientHeight,
            width: domElements("main").clientWidth
        }

        this.#getWorkspace().addEventListener("wheel", (eve) => {
            if (!eve.ctrlKey) return
            eve.preventDefault();
            this.#zoom(eve.deltaY, eve);
        })

    }

    #getWorkspace() {
        return domElements("#workSpace")
    }
    #zoom(delta, event) {
        const workspace = this.#getWorkspace();
        const rect = workspace.getBoundingClientRect();

        // Zoom factor
        const scaleAmount = delta > 0 ? 0.9 : 1.1;
        const oldScale = this.#scale || 1;
        const newScale = Math.min(Math.max(oldScale * scaleAmount, 0.1), 5); // Limit: 0.1x to 5x
        this.#scale = newScale;

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
        const newTx = mouseX - contentX * newScale;
        const newTy = mouseY - contentY * newScale;

        // Apply transform
        workspace.style.transform = `translate(${newTx}px, ${newTy}px) scale(${newScale})`;
        workspace.style.transformOrigin = "0 0";
    }
}

class Node {

    static nodeId = 0;

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

    }
    connect(connectedNodeId) {
        this.connectedNodesId.push(connectedNodeId);
    }
    spawnNodeInRandomLocation() {
        if (this.nodeId == 1) return;
        if (Math.random() < 0.5) {
            this.selfPosition.x += this.$ensureNodeSpawnPositionRestricted(Math.random() * 50, "x");
        } else {
            this.selfPosition.y += this.selfPosition.y += this.$ensureNodeSpawnPositionRestricted(Math.random() * 50, "y");
        }

    }
    setNewPositions(newX, newY) {
        this.selfPosition = {
            x: newX,
            y: newY
        }
    }
    $ensureNodeSpawnPositionRestricted(calculatedValue, axis = "x") {
        if (this.nodeId === 1 || !this.boundary) return;
        const max = axis === "x" ? this.boundary.width : this.boundary.height
        return calculatedValue < max ? calculatedValue : max - 10
    }
}



const wS = new WorkShop();
const wSBoundary = {
    height: wS.workSpaceSize.height,
    width: wS.workSpaceSize.width
}

let node1 = {
    name: "Node",
    data: "2",
    boundary: wSBoundary
};

const node = new Node(node1);
card(node);
const node2 = new Node(node1)
card(node2)
