let loader = new THREE.FontLoader();
let myFont;

loader.load('/lib/three.js/helvetiker_regular.typeface.json', function (font) {
    myFont = font;
    loader = null;
});


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
        this.headLength = length * 0.2;

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



class Load {
    constructor(magnitude, pattern) {
        this.magnitude = parseFloat((magnitude < 0 ? magnitude : -1 * magnitude).toFixed(3));
        this.pattern = pattern;
    }
    clone() {
        return new this.constructor(this.magnitude, this.pattern);
    }
    static distributeAreaLoad(areaDead, areaLive, secondaryBeams, otherCoord, secSpacings) {
        for (let k = 0; k < secondaryBeams.length; k++) {
            let beamsRow = secSpacings.length
            let deadMag = areaDead * 0.5 * secSpacings[0];
            let liveMag = areaLive * 0.5 * secSpacings[0];
            for (let i = 0; i < otherCoord.length - 1; i++) {
                console.log(i);
                secondaryBeams[k][i].addLoad(new LineLoad(deadMag, 'dead'), true)
                secondaryBeams[k][i].addLoad(new LineLoad(liveMag, 'live'), true)
                console.log(secondaryBeams[k][i * beamsRow].data.lineLoads)
            }

            for (let i = 1; i < secSpacings.length; i++) {
                deadMag = areaDead * 0.5 * (secSpacings[i - 1] + secSpacings[i]);
                liveMag = areaLive * 0.5 * (secSpacings[i - 1] + secSpacings[i]);
                for (let j = 0; j < otherCoord.length - 1; j++) {
                    console.log(i * (otherCoord.length - 1) + j);
                    secondaryBeams[k][i * (otherCoord.length - 1) + j].addLoad(new LineLoad(deadMag, 'dead'), true)
                    secondaryBeams[k][i * (otherCoord.length - 1) + j].addLoad(new LineLoad(liveMag, 'live'), true)
                    console.log(secondaryBeams[k][i * (otherCoord.length - 1) + j].data.lineLoads)
                }
            }

            deadMag = areaDead * 0.5 * secSpacings[secSpacings.length - 1];
            liveMag = areaLive * 0.5 * secSpacings[secSpacings.length - 1];
            for (let i = 0; i < otherCoord.length - 1; i++) {
                console.log(secondaryBeams[k].length - 1 - i);
                secondaryBeams[k][secondaryBeams[k].length-1- i].addLoad(new LineLoad(deadMag, 'dead'), true)
                secondaryBeams[k][secondaryBeams[k].length - 1 - i].addLoad(new LineLoad(liveMag, 'live'), true)
                console.log(secondaryBeams[k][secondaryBeams[k].length - 1 - i].data.lineLoads)
            }
        }
    }
}

class LineLoad extends Load {
    constructor(magnitude, pattern) {
        super(magnitude, pattern);
    }
    render(beam) {
        if (this.magnitude) {
            let height = (-0.42 * this.magnitude + 0.395);
            height = height < 0.5 ? 0.5 : height > 2.5 ? 2.5 : height;

            let mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(beam.data.length, height, 1, 1), loadMaterial.clone());

            let textGeometry = new THREE.TextBufferGeometry(`${(-1 * this.magnitude).toFixed(2)} t/m`, {
                font: myFont,
                size: 0.35 * height,
                height: 0,
                curveSegments: 3,
                bevelEnabled: false
            });
            let text = new THREE.Mesh(textGeometry, fontMaterial);
            text.position.x -= 0.5 * height;
            mesh.add(text);

            mesh.position.copy(beam.visual.mesh.position);
            mesh.position.add(beam.visual.direction.clone().multiplyScalar(0.5 * beam.data.length));
            mesh.position.y += 0.5 * height;
            mesh.rotateY(Math.PI / 2 - beam.visual.mesh.rotation.y);
            return mesh;
        } else
            return null;
    }
}

let direction = new THREE.Vector3(0, -1, 0);
class PointLoad  {
    constructor(nodeId,fx,fy,fz) {
        this.nodeId = nodeId;
        this.components = new THREE.Vector3(fx, fz, fy);
    }
    render(position) {
        let length = this.components.length();
        if(length < 0.1){
            length = 0.1;
        }else if (length < 2.5){
            length *= 0.5;
        }else if (length > 25){
            length *= 0.05;
        }else if (length > 250){
            length *= 0.005;
        }else if (length > 2500){
            length *= 0.0005;
        }else if (length > 25000){
            length *= 0.00005;
        } else {
            length *= 0.000025;
        }

        let  newPosition = position.add(this.components.clone().normalize().multiplyScalar(-0.1-length));

        //let arrow = new THREE.ArrowHelper(this.components.normalize(), position, length, 0xcc00ff);
        let arrow = new CustomArrow(this.nodeId,newPosition, this.components.normalize(), length);
        // let textGeometry = new THREE.TextBufferGeometry(`(${this.components.x},${this.components.y},${this.components.z})`, {
        //     font: myFont,
        //     size: 0.3,
        //     height: 0.01,
        //     curveSegments: 3,
        //     bevelEnabled: false
        // });
        // let text = new THREE.Mesh(textGeometry, fontMaterial);
        // //text.rotateX(Math.PI);
        // arrow.arrowGroup.add(text);
        return arrow;
        
    }
}
