// connectorUtils.js
import { svg, workspace } from "./utils.js";

export function svgLayer() {
    const SVG = svg();
    const container = workspace();
    // default styling
    styleSvg(SVG);
    container.append(SVG)
    /**
     * I wonder that if I can export as an object then I can simply call the styleSvg to edit according to the node placements right ? 
     * from this return I can have the default style and yet I can edit it from outside here I just passed the reference so it not a recursion technically
     * 
     * */
    return { SVG, styleSvg }
}


function styleSvg(SVG, attribute = { position: { x: 0, y: 0 }, definePath: '', color: 'black' }) {
    if (!(SVG instanceof SVGElement)) {
        throw new TypeError(`ExpectedElement is SVG `)
    }
    const svgStyle = SVG.style;
    svgStyle.position = "absolute";
    svgStyle.top = attribute.position.y || 0;
    svgStyle.left = attribute.position.x || 0;
    svgStyle.pointerEvents = "none";
    SVG.setAttribute('d', attribute.definePath);
    SVG.setAttribute('stroke', attribute.color);
    SVG.setAttribute('class', 'connection-line');
    SVG.setAttribute('stroke-dasharray', '10 5');
}