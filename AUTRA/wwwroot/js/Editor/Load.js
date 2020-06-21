let loader = new THREE.FontLoader();
let myFont;

loader.load('/lib/three.js/helvetiker_regular.typeface.json', function (font) {
    myFont = font;
    loader = null;
});


let loadMaterial = new THREE.MeshBasicMaterial({ color: 0xcc0000, transparent: true, opacity: 0.3, side: THREE.DoubleSide });
let fontMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

class Load {
    constructor(magnitude, pattern) {
        this.magnitude = magnitude < 0 ? magnitude : -1 * magnitude;
        this.pattern = pattern;
    }
    clone() {
        return new this.constructor(this.magnitude, this.pattern);
    }
    static distributeAreaLoad(areaDead, areaLive, secondaryBeams, otherCoord, secSpacings) {
        for (let k = 0; k < secondaryBeams.length; k++) {
            debugger
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


            //for (let j = 1; j < secSpacings.length; j++) {
            //    deadMag = areaDead * 0.5 * (secSpacings[j] + secSpacings[j + 1]);
            //    liveMag = areaLive * 0.5 * (secSpacings[j] + secSpacings[j + 1]);
            //    for (let i = 0; i < otherCoord.length - 1; i++) {
            //        let n = j * (otherCoord.length - 1) + i;
            //        secondaryBeams[k][j * (otherCoord.length - 1) + i].addLoad(new LineLoad(deadMag, 'dead'), true)
            //        secondaryBeams[k][j * (otherCoord.length - 1) + i].addLoad(new LineLoad(liveMag, 'live'), true)
            //    }
            //}

            deadMag = areaDead * 0.5 * secSpacings[secSpacings.length - 1];
            liveMag = areaLive * 0.5 * secSpacings[secSpacings.length - 1];
            for (let i = 0; i < otherCoord.length - 1; i++) {
                console.log(secondaryBeams[k].length - 1 - i);
                secondaryBeams[k][secondaryBeams[k].length-1- i].addLoad(new LineLoad(deadMag, 'dead'), true)
                secondaryBeams[k][secondaryBeams[k].length - 1 - i].addLoad(new LineLoad(liveMag, 'live'), true)
                console.log(secondaryBeams[k][secondaryBeams[k].length - 1 - i].data.lineLoads)
            }
        }

        /*for (let i = 0; i < otherCoord.length - 1; i++) {
            for (let j = 1; j < secSpacing.length - 1; j++) {
                deadMag = dead * 0.5 * (secSpacing[j - 1] + secSpacing[j])
                deadMag = dead * 0.5 * (secSpacing[j - 1] + secSpacing[j])
                secondaryBeams[i * secSpacing.length + j].addLoad(new LineLoad(dead, 'dead'))
                secondaryBeams[i * secSpacing.length + j].addLoad(new LineLoad(live, 'live'))
            }
        }

        for (let i = 0; i < otherCoord.length - 1; i++) {
            secondaryBeams[i * secSpacing.length + secSpacing.length - 1].addLoad(new LineLoad(dead, 'dead'))
            secondaryBeams[i * secSpacing.length + secSpacing.length - 1].addLoad(new LineLoad(live, 'live'))
        }





        for (let j = 1; i < otherCoord.length; i++) {//otherCoord : coordinates in the direction perpendicular to mainbeams
            let s = 0.5 * (secSpacing[j - 1] + secSpacing[j]);
            let deadMag = s * dead;
            let liveMag = s * live;
            for (; j < secSpacing.length - 1; j++) {
                secondaryBeams[i * (otherCoord.length - 1) + j].addLoad(new LineLoad(deadMag, 'dead'))
                secondaryBeams[i * (otherCoord.length - 1) + j].addLoad(new LineLoad(liveMag, 'live'))
            }
        }*/
        //let linearDead = dead * secSpacing;
        //let linearLive = live * secSpacing;
        //for (let i = 0; i < secondaryBeams.length; i++) {
        //    let secBeams = secondaryBeams[i];
        //    for (let j = 0; j < noOfBoundary; j++) {
        //        secBeams[j].addLoad(new LineLoad(0.5 * linearDead, 'dead'));
        //        secBeams[j].addLoad(new LineLoad(0.5 * linearLive, 'live'));
        //    }
        //    let lowerLimit = secBeams.length - noOfBoundary;
        //    for (let j = lowerLimit; j < secBeams.length; j++) {
        //        secBeams[j].addLoad(new LineLoad(0.5 * linearDead, 'dead'));
        //        secBeams[j].addLoad(new LineLoad(0.5 * linearLive, 'live'));
        //    }
        //    for (let j = noOfBoundary; j < lowerLimit; j++) {
        //        secBeams[j].addLoad(new LineLoad(linearDead, 'dead'));
        //        secBeams[j].addLoad(new LineLoad(linearLive, 'live'));
        //    }
        //}
        console.log('///**************************************************************///')
        for (let i = 0; i < secondaryBeams[0].length; i++) {
            console.log(i);
            console.log(secondaryBeams[0][i].data.lineLoads);
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

            let textGeometry = new THREE.TextBufferGeometry(`${-1 * this.magnitude} t/m`, {
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
class PointLoad extends Load {
    constructor(magnitude, pattern) {
        super(magnitude, pattern);
    }
    render(position) {
        if (this.magnitude) {
            let height = (-0.42 * this.magnitude + 0.395);
            height = height < 0.5 ? 0.5 : height > 2.5 ? 2.5 : height;

            position.y += height + 0.075;

            let arrow = new THREE.ArrowHelper(direction, position, height, 0xcc00ff);
            let textGeometry = new THREE.TextBufferGeometry(`${this.magnitude * -1} t`, {
                font: myFont,
                size: 0.35 * height,
                height: 0,
                curveSegments: 3,
                bevelEnabled: false
            });
            let text = new THREE.Mesh(textGeometry, fontMaterial);
            text.rotateX(Math.PI);
            arrow.add(text);
            return arrow;
        }
        else
            return null;
    }
}
