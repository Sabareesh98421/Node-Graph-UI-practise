// index.js
import { card, domElements } from "./utils.js"
import { WorkShop } from "./workShop.js";
import { Node } from "./nodes.js";

function getAddNodeButton(){
    return domElements("#createNode");
}

const wS = new WorkShop();

getAddNodeButton().addEventListener("click",()=>{
    wS.createNode(); 
})



const wSBoundary = {
    height: wS.workSpaceSize.height,
    width: wS.workSpaceSize.width
}

let node1 = {
    name: "Node",
    data: "2",
    boundary: wSBoundary
};

// const node = new Node(node1);
// // card(node);
// const node2 = new Node(node1)
// card(node2)
// wS.addNodeToWorkshopList([node, node2])

// console.log(wS.nodes)