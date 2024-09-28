


let fontMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

let loadMaterial = new THREE.MeshStandardMaterial({ color: 0xcc0000, side: THREE.DoubleSide });

class CustomArrow {
    constructor(nodeId,startPoint, direction, length, shaftRadius = 0.015, headRadius = 0.025) {
        this.nodeId = nodeId;
        this.startPoint = startPoint;
        this.direction = direction.normalize();
        this.length = length;
        this.shaftRadius = shaftRadius;
        this.headRadius = headRadius;
        this.headLength = 0.1;

        this.arrowGroup = new THREE.Group();
        this.createArrow();
    }

    createArrow() {
        // Create the arrow shaft
        const shaftGeometry = new THREE.CylinderGeometry(this.shaftRadius, this.shaftRadius, this.length - this.headLength, 12);
        const shaft = new THREE.Mesh(shaftGeometry, loadMaterial);
        shaft.castShadow = true;
        shaft.receiveShadow = true;

        // Position the shaft
        shaft.position.copy(this.startPoint);
        shaft.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), this.direction);
        shaft.position.add(this.direction.clone().multiplyScalar((this.length - this.headLength) / 2));

        // // Create edges for the shaft
        // const shaftEdges = new THREE.EdgesGeometry(shaftGeometry);
        // const shaftLines = new THREE.LineSegments(shaftEdges, edgeMaterial);
        // shaftLines.position.copy(shaft.position);
        // shaftLines.quaternion.copy(shaft.quaternion);

        // Create the arrow head
        const headGeometry = new THREE.ConeGeometry(this.headRadius, this.headLength, 12);
        const head = new THREE.Mesh(headGeometry, loadMaterial);
        head.castShadow = true;
        head.receiveShadow = true;

        // Position the head
        head.position.copy(this.startPoint);
        head.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), this.direction);
        head.position.add(this.direction.clone().multiplyScalar(this.length - this.headLength / 2));

        // // Create edges for the head
        // const headEdges = new THREE.EdgesGeometry(headGeometry);
        // const headLines = new THREE.LineSegments(headEdges, edgeMaterial);
        // headLines.position.copy(head.position);
        // headLines.quaternion.copy(head.quaternion);

        // Add the shaft, head, and their edges to the arrow group
        this.arrowGroup.add(shaft);
        this.arrowGroup.add(head);
    }
}




let direction = new THREE.Vector3(0, -1, 0);
class PointLoad  {
    constructor(nodeId,fx,fy,fz) {
        this.nodeId = nodeId;
        this.components = new THREE.Vector3(fx, fz, fy);
    }
    render(position,boundingLength) {
        let length = this.components.length();
        while (length > boundingLength ) {
            length = (length / boundingLength) * 0.2;
        }
        length = Math.max(length, 0.5);

        let  newPosition = position.add(this.components.clone().normalize().multiplyScalar(-0.1-length));

        //let arrow = new THREE.ArrowHelper(this.components.normalize(), position, length, 0xcc00ff);
        let arrow = new CustomArrow(this.nodeId,newPosition, this.components.normalize(), length);
        
        return arrow;
        
    }
}
