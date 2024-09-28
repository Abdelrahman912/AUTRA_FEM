//// Create the cone geometry and material
//let hingeMaterial = new THREE.MeshPhongMaterial({ color: 0x6633ff });
//let hingeGeometry = new THREE.ConeBufferGeometry(0.3, 0.3, 4);
//let wireframeMaterial = new THREE.MeshBasicMaterial({ 
//    color: 0x6633ff, 
//    wireframe: true 
//});



// Create the updated cone geometry and material
let hingeMaterial = new THREE.MeshPhongMaterial({ color: 0x6633ff, shininess: 100 }); // Solid material with shininess for realism

// Update cone geometry: Taller and narrower
let hingeGeometry = new THREE.ConeBufferGeometry(0.15, 0.6, 16); // Narrower (0.15 radius), taller (0.6 height), and smoother (16 segments)

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
        let offsetDistance = 0.2; 

        // Create the cone mesh with the wireframe material
        let cone = new THREE.Mesh(hingeGeometry, hingeMaterial.clone());

        // Copy the node's position to the cone position, then add an offset
        let offsetPosition = direction.clone().normalize().multiplyScalar(-offsetDistance);
        cone.position.copy(this.position).add(offsetPosition); // Position the cone after the node

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