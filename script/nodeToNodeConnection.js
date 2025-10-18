// nodeToNodeConnection.js
import { Node } from "./nodes.js"
export default class NodeConnection {
    connector = {
        start: [Node.nodeId],
        end: [Node.nodeId] // another node's ID 
    }
    connectorType = "input" || "output"; // like an tuple.
    id; // readonly
    /**
     * As for now I get nodes data fully after some while we rewfactor it for my conveance only 
     */
    constructor() {
        this.id = this.connector.start[0]; // indicates the connector is belong to which id(similar foreign key ) Origin link;
    }
    draw() {

    }
    curveyDraw() {

    }

    #createSvg() {

    }
    // if this is an input then how the data must be passed ? 
    // does am I been considered about the data? I am just an visualize to the dev/user that the data flows through me so, am I actually carrying data or just pretend to share the data between nodes?

    // ANS: NO,you just pretend bruh!!.
}