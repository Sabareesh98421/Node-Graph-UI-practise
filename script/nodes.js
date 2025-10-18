// nodes.js

export class Node {

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

    }
    connect(connectedNodeId) {
        this.connectedNodesId.push(connectedNodeId);
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
    $ensureNodeSpawnPositionRestricted(calculatedValue, axis = "x") {
        if (this.nodeId === 1 || !this.boundary) return;
        const max = axis === "x" ? this.boundary.width : this.boundary.height
        return calculatedValue < max ? calculatedValue : max - 10
    }
    // serialization
    toJson() {

        // return { ...this }
        return JSON.stringify(this);
    }
    static fromJSON(jsonedNode) {
        const node = Object.create(Node.prototype);
        Object.assign(node, jsonedNode);

        // static NodeId counter Update
        if (node.nodeId >= Node.nodeId) {
            Node.nodeId = node.nodeId;
        }
        return node;
    }
}

