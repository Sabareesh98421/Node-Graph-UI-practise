// nodeToNodeConnection.js
import { Node } from "./nodes.js";
import { svgLayer } from "./connectorUtils.js";
import { edgeAnchorPoints } from "./utils.js";
export default class NodeConnection {
    connector = {
        start: 0,
        end: 0 // another node's ID 
    }

    // this id Represent each edge of the nodes that this connects

    #id; // readonly

    /**
     * 
     * @param {Node} node 
     * @param {string} connectorType 
     */

    constructor(connector) {
        this.#setId()
        this.#setEventListenersToEdgeAnchors();
    }

    #draw() {
        let { SVG, styleSvg } = svgLayer();
        // calculate line position
        const x1 = startNode.x;
        const y1 = startNode.y;
        const x2 = endNode.x;
        const y2 = endNode.y;
        SVG.setAttribute("x1", x1);
        SVG.setAttribute("y1", y1);
        SVG.setAttribute("x2", x2);
        SVG.setAttribute("y2", y2);
        styleSvg(SVG); // default style
    }
    #setId() {
        this.#id = this.connector.start + "-" + this.connector.end;
    }
    get id() {
        return this.#id;
    }
    #handleMouseDown_StartAnchor(eve) {
        this.connector.start = this.#getAnchorId(eve.target);

    }
    #handleMouseUp_EndAnchor(eve) {
        const end = this.#getAnchorId(eve.target);
        if (this.#isBreakConnection(end)) return
        this.connector.end = end
    }
    #isBreakConnection(endAnchorId) {
        return this.connector.start === endAnchorId;
    }
    #getAnchorId(target) {
        return target.id.split("--")[0];
    }
    #setEventListenersToEdgeAnchors() {
        let edges = edgeAnchorPoints();
        edges.forEach((edge) => {
            edge.addEventListener("mousedown", (eve) => this.#handleMouseDown_StartAnchor(eve));
            edge.addEventListener("mousemove", (eve) => this.#draw(eve))
            edge.addEventListener("mouseup", (eve) => this.#handleMouseUp_EndAnchor(eve));
        })
    }
    // #isValid(connectorType) {
    //     if (this.validConnectorType.includes(connectorType)) {
    //         return connectorType
    //     }
    //     throw new ReferenceError("THe connector Type Must in two type either Input Or output, but Found " + connectorType)
    // }

}