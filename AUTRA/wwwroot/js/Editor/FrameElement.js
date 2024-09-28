let lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
let elementFontMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
let zVector = new THREE.Vector3(0, 0, 1);



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
        this.startNode = startNode; /*? { "$ref": startNode.data.id } : null; // Reference to node in JSON scheme*/
        this.endNode = endNode;  /*?{ "$ref": endNode.data.id } : null; // Reference to node in JSON scheme*/
        //this.lineLoads = [];
        this.length = parseFloat((startPoint.distanceTo(endPoint)).toPrecision(4));
    }
    static elementId = 0;
}


function elementDataToDto(eleData) {
    return {
        elementId: eleData.elementId,
        E: eleData.E,
        A: eleData.A,
        startNodeId: eleData.startNode.data.id,
        endNodeId: eleData.endNode.data.id,
        length: eleData.length
    };

}


class ElementVisual { // Visual data for editor
    constructor(startPoint, endPoint,  lineMaterial, direction, rotation) {
        this.direction = direction;
        this.rotation = rotation;
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
        elements.forEach(e => {
                 let eleForce = resultElements.find(f => f.elementId == e.data.elementId);
                e.visual.strainingActions = eleForce.force;
            });
    }

    static createDeformedElements(elements,scale, editor) {
        let deformedElements = [];
        for (let i = 0; i < elements.length; i++) {
            let deformedStart = elements[i].data.startNode.data.position.clone().add(elements[i].data.startNode.visual.displacement.clone().multiplyScalar(scale));
            let deformedEnd = elements[i].data.endNode.data.position.clone().add(elements[i].data.endNode.visual.displacement.clone().multiplyScalar(scale));

            let direction = (deformedEnd.clone().sub(deformedStart)).normalize();
            // Compute quaternion rotation to align the element's direction with the calculated direction
            let quaternion = new THREE.Quaternion().setFromUnitVectors(zVector, direction);

            // Convert quaternion to Euler rotation
            let rotation = new THREE.Euler().setFromQuaternion(quaternion);

            let deformedElement = new FrameElement(elements[i].data.E, elements[i].data.A, deformedStart, deformedEnd,
                lineMaterial.clone(), elements[i].data.startNode, elements[i].data.endNode, elements[i].visual.direction,
                rotation);
             // set the deformed element if as the original element
            deformedElement.data.elementId = elements[i].data.elementId;
            // change color of deformed element to show the deformation (green color)
            deformedElement.visual.mesh.material.color.setHex(0x00ff00);

            
            editor.createPickingObject(deformedElement);
            editor.addToGroup(deformedElement.visual.mesh, 'deformedShape');
            deformedElements.push(deformedElement);
        }
        return deformedElements;
    }

   
    static drawElementForces(elements, scale, editor) {
        elements.forEach(element => {
            let force = element.visual.strainingActions; 
            let startPoint = element.visual.startPoint;
            let endPoint = element.visual.endPoint;

            // Create the force rectangle
            let forceRectangle = createForceRectangle(force, startPoint, endPoint, scale);

            
            editor.addToGroup(forceRectangle, 'elementFroces');
        });
        editor.hideGroup('elementFroces');
    }



}

function  createFrameElement(editor,E,A, startPoint, EndPoint, startNode, EndNode){
    let direction = (EndPoint.clone().sub(startPoint)).normalize();
    // Compute quaternion rotation to align the element's direction with the calculated direction
    let quaternion = new THREE.Quaternion().setFromUnitVectors(zVector, direction);

    // Convert quaternion to Euler rotation
    let rotation = new THREE.Euler().setFromQuaternion(quaternion);
    element =  new FrameElement(E,A, startPoint, EndPoint, lineMaterial.clone(), startNode, EndNode, direction, rotation);
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
    let text = new THREE.Mesh(textGeometry, elementFontMaterial);
    text.position.copy(startPoint.clone().add(EndPoint).multiplyScalar(0.5));
    text.position.y += 0.1;
    editor.addToGroup(text, 'labels');
    element.visual.label = text;
    return element;
}

// Renumber the elements
function renumberElements(elements) {
    for (let i = 0; i < elements.length; i++) {
        elements[i].data.elementId = i + 1;
        // update the text
        elements[i].visual.label.geometry.dispose();
        elements[i].visual.label.geometry = new THREE.TextBufferGeometry(`${elements[i].data.elementId}`, {
            font: myFont,
            size: 0.2,
            height: 0,
            curveSegments: 3,
            bevelEnabled: false
        });
    }
}


function createForceRectangle(force, startPoint, endPoint, scale) {
    let forceMagnitude = Math.abs(force); // Get the magnitude of the force
    let direction = new THREE.Vector3().subVectors(endPoint, startPoint).normalize();
    let length = startPoint.distanceTo(endPoint);

    // Define the width of the rectangle based on the force magnitude
    let width = forceMagnitude * scale; // Scale it appropriately

    // Create rectangle geometry
    let geometry = new THREE.PlaneBufferGeometry(length, width);

    // Determine the color based on force type (compression or tension)
    let color = force > 0 ? 0x0000ff : 0xff0000; // Blue for tension, red for compression
    let material = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide });

    // Create the mesh for the force rectangle
    let rectangle = new THREE.Mesh(geometry, material);

    // Position the rectangle between startPoint and endPoint
    let midPoint = startPoint.clone().add(endPoint).multiplyScalar(0.5);
    rectangle.position.copy(midPoint);

    // Align the rectangle along the direction of the element
    let quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 0, 0), direction);
    rectangle.setRotationFromQuaternion(quaternion);

    return rectangle;
}