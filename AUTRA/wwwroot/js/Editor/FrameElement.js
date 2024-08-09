let lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
let zVector = new THREE.Vector3(0, 0, 1);
function SectionDimensions(depth) { //Calculate the dimensions relative to it depth
    this.clearHeight = depth || 0.5;
    this.flangeWidth = 0.5 * depth || 0.25;
    this.webThickness = 0.03 * depth || 0.02;
    this.flangeThickness = 0.06 * depth || 0.05;
}

function createShape(dimensions) { //draw section shape using its dimensions
    let shape = new THREE.Shape();
    let shiftX = -dimensions.flangeWidth / 2;
    let shiftY = -(dimensions.clearHeight / 2 + dimensions.flangeThickness);
    shape.moveTo(shiftX, shiftY);
    shape.lineTo(dimensions.flangeWidth + shiftX, 0 + shiftY);
    shape.lineTo(dimensions.flangeWidth + shiftX, dimensions.flangeThickness + shiftY);
    shape.lineTo(dimensions.flangeWidth - (dimensions.flangeWidth - dimensions.webThickness) / 2 + shiftX, dimensions.flangeThickness + shiftY);
    shape.lineTo(dimensions.flangeWidth - (dimensions.flangeWidth - dimensions.webThickness) / 2 + shiftX, dimensions.flangeThickness + dimensions.clearHeight + shiftY);
    shape.lineTo(dimensions.flangeWidth + shiftX, dimensions.flangeThickness + dimensions.clearHeight + shiftY);
    shape.lineTo(dimensions.flangeWidth + shiftX, dimensions.flangeThickness + dimensions.clearHeight + dimensions.flangeThickness + shiftY);
    shape.lineTo(0 + shiftX, dimensions.flangeThickness + dimensions.clearHeight + dimensions.flangeThickness + shiftY);
    shape.lineTo(0 + shiftX, dimensions.flangeThickness + dimensions.clearHeight + shiftY);
    shape.lineTo((dimensions.flangeWidth - dimensions.webThickness) / 2 + shiftX, dimensions.flangeThickness + dimensions.clearHeight + shiftY);
    shape.lineTo((dimensions.flangeWidth - dimensions.webThickness) / 2 + shiftX, dimensions.flangeThickness + shiftY);
    shape.lineTo(0 + shiftX, dimensions.flangeThickness + shiftY);
    shape.lineTo(0 + shiftX, 0 + shiftY);
    return shape;
}

let extrudeSettings = {
    steps: 1,
    bevelEnabled: false
};

function createExtrudedMesh(shape, length, material) {
    extrudeSettings.depth = length;
    return new THREE.Mesh(new THREE.ExtrudeBufferGeometry(shape, extrudeSettings), material);
}

let lineStart = new THREE.Vector3(0, 0, 0);
function createWireframe(startPoint, endPoint, material, rotation) { //Draw line at (0,0,0) and the translate and rotate it(the same as mesh)
    let length = endPoint.distanceTo(startPoint);
    let lineEnd = lineStart.clone().setZ(length);
    let geometry = new THREE.BufferGeometry().setFromPoints([lineStart, lineEnd]);
    let line = new THREE.Line(geometry, material);
    line.position.copy(startPoint);
    line.rotation.copy(rotation);
    return line;
}

class ElementData { //Data required for analysis and design
    constructor(E,A, startPoint, endPoint, startNode, endNode) {
        this.elementId = ++ElementData.elementId; 
        this.E = E; //Young's Modulus
        this.A = A; //Cross Sectional Area
        this.startNode = startNode ? { "$ref": startNode.data.$id } : null; // Reference to node in JSON scheme
        this.endNode = endNode ? { "$ref": endNode.data.$id } : null; // Reference to node in JSON scheme
        //this.lineLoads = [];
        this.length = parseFloat((startPoint.distanceTo(endPoint)).toPrecision(4));
    }
    static elementId = 0;
}

class ElementVisual { // Visual data for editor
    constructor(startPoint, endPoint,  lineMaterial, direction, rotation) {
        this.direction = direction;
        this.wireframe = createWireframe(startPoint, endPoint, lineMaterial, rotation);
        //this.extruded = createExtrudedMesh(shape, length, meshMaterial);
        this.mesh = this.wireframe;                    //Currently rendered mesh
        //this.unusedMesh = this.extruded;               // not rendered currently
        //this.unusedMesh.userData = this.mesh.userData; //to save the same data at toggle view
        //this.temp = null;                              //Used to Swap Meshes at tougle view
        this.endPoint = endPoint;
        this.startPoint = startPoint;
        //this.sectionName = sectionName;
    }
}

let pointGeometry = new THREE.SphereBufferGeometry(0.05, 15, 15);
let pointMaterial = new THREE.MeshBasicMaterial({ color: 0xcc00dd });

class FrameElement {
    constructor(E,A, startPoint, endPoint, lineMaterial,  startNode, endNode, direction, rotation) {
        this.data = new ElementData(E,A, startPoint, endPoint, startNode, endNode); //Data to be sent to backend
        //Graphical representation
        this.visual = new ElementVisual(startPoint, endPoint,  lineMaterial,  direction,rotation);
        this.visual.mesh.userData.element = this;
    }
    move(displacement) {
        this.visual.endPoint.add(displacement);
        this.visual.mesh.position.add(displacement);

    }
    changeSection(section) {
        let dimensions = new SectionDimensions(parseInt(section.name.split('E')[1]) / 1000);
        let shape = createShape(dimensions);
        this.visual.extruded.geometry.dispose();
        extrudeSettings.depth = this.data.length;
        this.visual.extruded.geometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings);
        this.data.section = section.$id;
        this.visual.sectionName = section.name;
    }

    createresultNodes(stations, scale, domEvents, parent, action, unit, action2) {
        let name = action[0];
        for (let i = 0; i < stations.length; i++) {
            let point = new THREE.Mesh(pointGeometry, pointMaterial.clone());
            point.userData.otherColor = 0xffaa00;
            point.userData.value = `${name} = ${stations[i][action].toFixed(2)}  ${stations[i][action2] ? stations[i][action2].toFixed(2) : ""} ${unit}`
            point.userData.x = `${stations[i].x} m`
            point.position.set(stations[i].x, stations[i][action] * scale, 0);
            domEvents.addEventListener(point, 'mouseover', (event) => {
                let object = event.intersect.object;
                let temp = object.userData.otherColor;
                object.userData.otherColor = object.material.color.getHex();
                object.material.color.setHex(temp);
                $('#action').val(point.userData.value);
                $('#station').val(point.userData.x);
            })
            domEvents.addEventListener(point, 'mouseout', (event) => {
                let object = event.target;
                let temp = object.userData.otherColor;
                object.userData.otherColor = object.material.color.getHex();
                object.material.color.setHex(temp);
                $('#action').val('');
                $('#station').val('');
            })
            parent.add(point);
        }
    }
    static assignResults(elements, resultElements) {
        for (let i = 0; i < elements.length; i++) {
            elements[i].visual.strainingActions = resultElements[i].strainingActions;
            elements[i].visual.strainingActions.push(resultElements[i].combinedSA[0]);
        }
    }
}

function  createFrameElement(editor,E,A, startPoint, EndPoint, startNode, EndNode){
    let direction = (EndPoint.clone().sub(startPoint)).normalize();
    let rotation = new THREE.Euler(-1 * direction.angleTo(zVector), 0, 0);
    element =  new FrameElement(E,A, startPoint, EndPoint, lineMaterial, startNode, EndNode, direction, rotation);
    editor.addToGroup(element.visual.mesh, 'elements');
    editor.createPickingObject(element);
    // add textto denote element id
    let textGeometry = new THREE.TextBufferGeometry(`${element.data.elementId}`, {
        font: myFont,
        size: 0.2,
        height: 0,
        curveSegments: 3,
        bevelEnabled: false
    });
    let text = new THREE.Mesh(textGeometry, fontMaterial);
    text.position.copy(startPoint.clone().add(EndPoint).multiplyScalar(0.5));
    text.position.y += 0.1;
    editor.addToGroup(text, 'labels');
    return element;
}