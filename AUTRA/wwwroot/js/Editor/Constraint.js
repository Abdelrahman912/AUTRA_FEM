// Create the cone geometry and material
let hingeMaterial = new THREE.MeshPhongMaterial({ color: 0x6633ff });
let hingeGeometry = new THREE.ConeBufferGeometry(0.3, 0.3, 4);
let wireframeMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x6633ff, 
    wireframe: true 
});

class Constraint{
    constructor(ux,uy,uz){
        this.free = [ux,uy,uz]; //bool values (true -> free, false -> fixed)
    }
    isAllFree(){
        return this.free.every(f => f);
    }
}


class ConstraintViz {
    constructor(nodeId,position, ux, uy, uz) {
        this.nodeId = nodeId;
        this.group = new THREE.Group();
        this.position = position;

        // Create cones based on the ux, uy, uz values
        if (!ux) {
            this.addCone(new THREE.Vector3(1, 0, 0)); // X direction
        }
        if (!uy) {
            this.addCone(new THREE.Vector3(0, 0, 1)); // Y direction
        }
        if (!uz) {
            this.addCone(new THREE.Vector3(0, 1,0)); // Z direction
        }
    }

    addCone(direction) {
        // Create the wireframe material
        
    
        // Create the cone mesh with the wireframe material
        let cone = new THREE.Mesh(hingeGeometry, wireframeMaterial.clone());
        // TODO: make support outside the structure
        cone.position.copy(this.position); // copy means copy the components of positon to the cone.position
    
        // Use a quaternion to rotate the cone in the correct direction
        let quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
        cone.applyQuaternion(quaternion);

         // Enable shadow casting and receiving
        cone.castShadow = true;
        cone.receiveShadow = true;
    
        // Add the cone to the group
        this.group.add(cone);
    }
   
}