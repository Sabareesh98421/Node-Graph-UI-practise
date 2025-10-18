// connectorUtils.js
import { workspace } from "./utils.js";
function svgConnector(attribute = {}, tag = "svg") {
    const SVG_NS = 'http://www.w3.org/2000/svg';
    const SVG = document.createElementNS(SVG_NS, tag);
    Object.keys(attribute).forEach((key) => {
        SVG.setAttribute(key, attribute[key])
    })
    return SVG;

}



function svgLayer() {
    const SVG = svgConnector({ height: "100%", width: "100%" })

    const container = workspace();
    styleSvg(SVG);
    container.append(SVG)
}
function styleSvg(SVG) {
    if (!(SVG instanceof SVGGraphicsElement)) {
        throw new TypeError(`ExpectedElement is SVG `)
    }
    const svgStyle = SVG.style;
    svgStyle.position = "absolute";
    svgStyle.top = 0;
    svgStyle.left = 0;
    svgStyle.pointerEvents = "none";


}