//https://threejsfundamentals.org/threejs/lessons/threejs-picking.html

let loader = new THREE.FontLoader();
let myFont;

loader.load('/lib/three.js/helvetiker_regular.typeface.json',  (font) =>  {
    myFont = font;
    loader = null;


(function () {
    let exampleId = parseInt($('#exampleId').val());

    //#region  Shared variables
    let editor;
    let nodes = new Array(), grids;
    let trussElements = new Array(), sections = new Array();
    let canvas, domEvents;
    let levels, material, projectProperties, loadCombo;
    let draw = false, drawingPoints = [];
    let sectionId = 0;
    let boundingLength = 10; // initial value, change once grids are made.
    let deformedNodes = null;
    let deformedElements = null;
    let forcesScale = 1e-4;
    //#endregion

    function smallTetraeder() {
        // example of a small tetraeder (basic code)
        coordX = [-7.5, 0, 7.5];
        coordZ = [-4.33,0,8.66];
        levels = [0, 12.25]
        setMaxLength(coordX, coordZ, levels);
        grids = new Grid(coordX, coordZ, 4.5, levels);
        editor.init(coordX[coordX.length - 1], coordZ[coordZ.length - 1]); //Setup editor
        editor.addToGroup(grids.gridLines, 'grids'); //Add x-grids to scene (as a group)this.meshInX
        editor.addToGroup(grids.gridNames, 'grids'); //Add z-grids to scene (as a group)
        editor.addToGroup(grids.axes, 'axes');
        editor.addToGroup(grids.dimensions, 'dimensions');

        let lb = 15.0;
        let r = 457.2 / 2000;
        let t = 10.0 / 1000;
        let a = Math.PI * (r * r - (r - t) * (r - t));
        let e = 210000000000;

        let n1 = Node.create(0, lb * Math.sqrt(2.0 / 3.0), 0, null, editor, nodes);
        let n2 = Node.create(0.0, 0, lb / Math.sqrt(3), null, editor, nodes);
        let n3 = Node.create(-lb / 2, 0, -lb / Math.sqrt(12.0), null, editor, nodes);
        let n4 = Node.create(lb / 2, 0, -lb / Math.sqrt(12.0), null, editor, nodes);



      
        let e1 = createFrameElement(editor, e, a, n1.data.position, n2.data.position, n1, n2);
        trussElements.push(e1);

        let e2 = createFrameElement(editor, e, a, n1.data.position, n3.data.position, n1, n3);
        trussElements.push(e2);

        let e3 = createFrameElement(editor, e, a, n1.data.position, n4.data.position, n1, n4);
        trussElements.push(e3);

        let e4 = createFrameElement(editor, e, a, n2.data.position, n3.data.position, n2, n3);
        trussElements.push(e4);

        let e5 = createFrameElement(editor, e, a, n3.data.position, n4.data.position, n3, n4);
        trussElements.push(e5);

        let e6 = createFrameElement(editor, e, a, n4.data.position, n2.data.position, n4, n2);
        trussElements.push(e6);




        // constraints 
        let c2 = new Constraint(false, false, false);
        n2.data.constraint = c2;
        let c2Viz = new ConstraintViz(n2.data.id, n2.data.position.clone(), false, false, false);
        editor.visualObjects.Constraints.push(c2Viz);
        editor.addToGroup(c2Viz.group, 'constraints');


        let c3 = new Constraint(false, false, false);
        n3.data.constraint = c3;
        let c3Viz = new ConstraintViz(n3.data.id, n3.data.position.clone(), false, false, false);
        editor.visualObjects.Constraints.push(c3Viz);
        editor.addToGroup(c3Viz.group, 'constraints');


        let c4 = new Constraint(true, true, false);
        n4.data.constraint = c4;
        let c4Viz = new ConstraintViz(n4.data.id, n4.data.position.clone(), true, true, false);
        editor.visualObjects.Constraints.push(c4Viz);
        editor.addToGroup(c4Viz.group, 'constraints');


        // Add Nodal Loads
        let fx = 0;
        let fy = -20000;
        let fz = -100000;
        let f1 = new THREE.Vector3(fx, fy, fz);
        n1.data.force = f1;
        let pointLoad = new PointLoad(nodeId, fx, fy, fz);
        //let loadIndex = node.addLoad(pointLoad, replace);
        // add arrowgroup to visualObjects
        let arrow = pointLoad.render(n1.data.position.clone(), boundingLength);
        editor.visualObjects.Loads.push(arrow);
        editor.addToGroup(arrow.arrowGroup, 'loads');

    }


    function init() {
        editor = new Editor(); //Instantiate editor
        canvas = editor.renderer.domElement;
        let path = $('#projectName').val();
        $('#projectName').remove();
        if (exampleId > 0) {
            //showInfoModal('Small Tateraeder');
            switch (exampleId) {
                case 1:
                    smallTetraeder(); //Small Tetraeder example
                default:
            }
        }
        else if (path) {
            $('#staticBackdrop').modal('show');
            $.ajax({
                url: `${path}`,
                success: function (data) {
                    debugger
                    retrocycle(data);
                    buildModel(data);
                    $('#staticBackdrop').modal('hide');
                },
                error: function (x, y, err) {
                    debugger
                    showInfoModal('Something went wrong, please try again');
                }
            });
        }
        else
            $('#modalDivDetails').css('display', 'block');
    }

    

    function buildModel(model) {
        editor.init(model.grids.coordX[model.grids.coordX.length - 1], model.grids.coordZ[model.grids.coordZ.length - 1]); //Setup editor
        grids = new Grid(model.grids.coordX, model.grids.coordZ, 4.5, model.grids.levels);
        levels = grids.levels;
        editor.addToGroup(grids.gridLines, 'grids'); //Add x-grids to scene (as a group)this.meshInX
        editor.addToGroup(grids.gridNames, 'grids'); //Add z-grids to scene (as a group)
        editor.addToGroup(grids.axes, 'grids'); //Add z-grids to scene (as a group)
        editor.addToGroup(grids.dimensions, 'dimensions');
        projectProperties = model.projectProperties;
        material = model.material
        sections = model.sections;
        for (let i = 0; i < sections.length; i++) {
            sections[i].material = { $ref: "m" };
        }
        sectionId = parseInt(sections[sections.length - 1].$id); //Set the sectionId variable to the latest id in the model
        Node.generate(nodes, model.nodes, editor);
        secondaryBeams.push(Beam.generate(model.secondaryBeams, editor));
        mainBeams.push(Beam.generate(model.mainBeams, editor));
        columns.push(Column.generate(model.columns, editor));
        loadCombo = model.loadCombination;
        confirmCloseWindow();
    }
    function setMaxLength(coordX, coordZ, levels) {

        maxX = coordX[coordX.length - 1]
        maxZ = coordZ[coordZ.length - 1]
        maxY = levels[levels.length - 1]
        boundingLength = Math.max(maxX, maxZ, maxY);
    }
    $('#createGrids').click(function () {
        if ($("#form2StructureData").valid()) {
            $('#modalDivDetails').hide();
            $('#staticBackdrop').modal('show');
            let secSpacing, coordX, coordZ;
            coordX = getCoords($('#spaceX').val()); //Get X-coordinates from X-spacings
            coordZ = getCoords($('#spaceZ').val()); //Get Z-coordinates from Z-spacings
            levels = getCoords($('#spaceY').val()); //Get Y-coordinates from Y-spacings
            setMaxLength(coordX, coordZ, levels);
            grids = new Grid(coordX, coordZ, 4.5, levels);
            editor.init(coordX[coordX.length - 1], coordZ[coordZ.length - 1]); //Setup editor
            editor.addToGroup(grids.gridLines, 'grids'); //Add x-grids to scene (as a group)this.meshInX
            editor.addToGroup(grids.gridNames, 'grids'); //Add z-grids to scene (as a group)
            editor.addToGroup(grids.axes, 'axes');
            editor.addToGroup(grids.dimensions, 'dimensions');




            material = { $id: 'm', E: $('#modulus').val() };
            sections.push({ $id: `${sectionId += 1}`, A: $('#crossA').val(), material: { $ref: 'm' } });


            if (document.getElementById("ns").checked) { //Draw elements and nodes
                //creating and adding the Hinged-Nodes to MainNodes Array
                let nodesResult = createNodes(editor, coordX, levels, coordZ);
                nodes = nodes.concat(nodesResult);
            }
            
            $('#staticBackdrop').modal('hide');
            confirmCloseWindow();
        }
        else {
            $('#modalDivDetails').show();
        }
    })

   

    //Turn spacings into coordinates
    function getCoords(input) {
        let coord = [], space, number, sum = 0;
        if (input.includes('*')) { //Equal spacing
            [number, space] = input.split('*').map(s => parseFloat(s));
        }
        else { //Variable spacing
            space = input.split(' ').map(s => parseFloat(s));
            number = space.length;
        }
        number++; //Coordinates are greater than spacings by 1
        for (var i = 0; i < number; i++) {
            coord[i] = sum;
            sum += space[i] ?? space;
        }
        return coord;
    }

    init();

    canvas.addEventListener('mousemove', function (event) {
        editor.pick(event);
    });

    let initialPosition;
    let multiple = false;
    canvas.onmousedown = function (event) {
        initialPosition = editor.setPickPosition(event);
    }

    let finalPosition;
    canvas.onmouseup = function (event) {
        finalPosition = editor.setPickPosition(event);
        if (initialPosition.x === finalPosition.x && initialPosition.y === finalPosition.y) {
            editor.select(event, multiple);
            if (draw) {
                if (editor.picker.selectedObject.size == 1) {
                    for (let item of editor.picker.selectedObject) {
                        if (item.userData.node) {
                            drawingPoints.push(item.userData.node);
                            drawingPoints[0].visual.mesh.material.color.setHex(0xcc0000); //Highlight the first node
                        }
                    }
                    if (drawingPoints.length === 2) {
                        drawElement();
                    }
                }
            }
        }
        else {
            let rectWidth = Math.abs(finalPosition.x - initialPosition.x),
                rectHeight = Math.abs(finalPosition.y - initialPosition.y);
            //The start position of the rectangle sholud be the top left corner
            if (finalPosition.x < initialPosition.x)
                initialPosition.x = finalPosition.x;
            if (finalPosition.y < initialPosition.y)
                initialPosition.y = finalPosition.y;
            editor.selectByArea(initialPosition, rectWidth, rectHeight, multiple);
        }
    }

    window.addEventListener('keyup', function (event) {
        switch (event.key) {
            case 'Delete':
                deleteElement();
                break;
            case 'm':
                move();
                break;
            case 'c':
                copy();
                break;
            case 'd':
                draw = draw ? false : true;
                break;
            case 'Control':
                multiple = false;
                break;
        }
    });

    window.onkeydown = (event) => {
        if (event.key === 'Control')
            multiple = true;
    }

   


    // draw element function
    function drawElement() {
        let element;
        let sectionName = $('#drawSection').val();
        let sectionObject = sections.find(s => s.name === sectionName); //Check if section already exists
        if (!sectionObject) { //If not existing , create one
            sectionObject = {
                $id: `${sectionId += 1000}`, name: sectionName, material: { $ref: 'm' }
            };
            sections.push(sectionObject);
        }
        let start = drawingPoints[0], end = drawingPoints[1];
        if (drawingPoints[1].data.position.y < drawingPoints[0].data.position.y) {
            start = drawingPoints[1];
            end = drawingPoints[0];
        }
        let index = levels.indexOf(end.data.position.y) - 1;
        if (index < 0) {
            drawingPoints = [];
            showInfoModal('please use one of the predefined levels');
            return;
        }
        else {
            let beam = editor.getIntersected(start.data.position.clone(), start.visual.mesh.userData.picking);
            if (beam) {
                Beam.switchType(beam.userData.element, secondaryBeams[index], mainBeams[index]);
            }
            beam = editor.getIntersected(end.data.position.clone(), end.visual.mesh.userData.picking);
            if (beam) {
                Beam.switchType(beam.userData.element, secondaryBeams[index], mainBeams[index]);
            }

            if (start.data.position.x == end.data.position.x &&
                start.data.position.z == end.data.position.z) { //Check if the element is vertical(column)
                element = drawColumnByTwoPoints(sectionObject, start, end);
                columns[index].push(element);
            }
            else {//Element is not vertical (Beam)
                element = drawBeamByTwoPoints(sectionObject, drawingPoints[0], drawingPoints[1]);
                secondaryBeams[index].push(element);
            }
            editor.addToGroup(element.visual.mesh, 'elements');
            editor.createPickingObject(element);
            drawingPoints[0].visual.mesh.material.color.setHex(0xffcc00); //Restore the first node color
            editor.picker.unselect(); // Unselect the second node
            drawingPoints = [];
        }
    }

    window.deleteElement = function () {
        for (let item of editor.picker.selectedObject) {
           
            if (item.userData.element instanceof FrameElement) {
                editor.removeFromGroup(item, 'elements');
                trussElements = trussElements.filter(e => e.data.elementId !== item.userData.element.data.elementId);
                console.log("trussElements after deletion");
                console.log(trussElements);
                // remove element label from the scene
                editor.removeFromGroup(item.userData.element.visual.label, 'labels');
                // renumber the elements
                renumberElements(trussElements);
            }
            else if (item.userData.node instanceof Node) {
                // check whether any element is connected to the node
                // if connected, prevent deletion and show a message
                // if not connected, delete the node
                let exisitingEles = trussElements.find(e => e.data.startNode.data.id === item.userData.node.data.id || e.data.endNode.data.id === item.userData.node.data.id);
                if (exisitingEles) {
                    showInfoModal('Node is connected to an element, please delete the element first');
                    return;
                }
                editor.removeFromGroup(item, 'nodes');
                let index = nodes.indexOf(item.userData.node)
                nodes.splice(index, 1);
                let text = item.userData.node.visual.label;
                editor.removeFromGroup(text, 'labels');
                renumberNodes(nodes);
                removeNodeBoundaryConditions(editor, item.userData.node);
            }
        }
        editor.picker.selectedObject.clear();
    }

    window.move = function () {
        let displacement = new THREE.Vector3(parseFloat($('#xMove').val()) || 0, parseFloat($('#yMove').val()) || 0, parseFloat($('#zMove').val()) || 0)
        for (let item of editor.picker.selectedObject) {
            if (item.userData.element) {//Beams or Cloumns only
                item.userData.element.move(displacement);
                let newStartPosition = item.position;
                let newEndPosition = item.userData.element.visual.endPoint;
                let levelIndex = levels.indexOf(newEndPosition.y) - 1;
                if (levelIndex > -1) {
                    //Check if nodes already exist at the new position or create new ones.
                    getElementNodes(newStartPosition, newEndPosition, item.userData.element, levelIndex);
                    item.userData.picking.position.copy(newStartPosition);
                }
                else {
                    item.userData.element.move(displacement.multiplyScalar(-1));
                    showInfoModal('please move elements to one of the predefined levels');
                }
            }
        }
    }

    window.copy = function () {
        let displacement = new THREE.Vector3(parseFloat($('#xCopy').val()) || 0, parseFloat($('#yCopy').val()) || 0, parseFloat($('#zCopy').val()) || 0)
        let replication = parseInt($('#Replication').val());
        for (let item of editor.picker.selectedObject) {
            if (item.userData.element) { //Beams or Cloumns only
                let element = item.userData.element;
                for (var i = 0; i < replication; i++) {
                    element = element.clone();
                    element.move(displacement);

                    let levelIndex = levels.indexOf(element.visual.endPoint.y) - 1;
                    if (levelIndex > -1) {
                        //Check if nodes already exist at the new position or create new ones.
                        getElementNodes(element.visual.mesh.position, element.visual.endPoint, element, levelIndex);
                        if (element instanceof Beam)
                            secondaryBeams[levelIndex].push(element);
                        else
                            columns[levelIndex].push(element);

                        editor.addToGroup(element.visual.mesh, 'elements');
                        editor.createPickingObject(element);
                    }
                    else {
                        element.move(displacement.multiplyScalar(-1));
                        showInfoModal('please move elements to one of the predefined levels');
                    }
                }
            }
        }
    }

    function getElementNodes(newStartPosition, newEndPosition, element, levelIndex) {
        //Search for the new nodes in the existing nodes
        let newStartNode = nodes.find(n => n.data.position.equals(newStartPosition));
        let newEndNode = nodes.find(n => n.data.position.equals(newEndPosition));

        if (!newStartNode) { //If it doesn't exist create one
            newStartNode = Node.create(newStartPosition.x, newStartPosition.y, newStartPosition.z,
                null, editor, nodes);
            let beam = editor.getIntersected(newStartNode.data.position.clone());
            if (beam) { //Add the created node to the innerNodes of the beam it intersects(if any)
                Beam.switchType(beam.userData.element, secondaryBeams[levelIndex], mainBeams[levelIndex]);
                beam.userData.element.data.innerNodes.push({ '$ref': newStartNode.data.$id });
            }
        }

        if (!newEndNode) {//If it doesn't exist create one
            newEndNode = Node.create(newEndPosition.x, newEndPosition.y, newEndPosition.z, null, editor, nodes);
            beam = editor.getIntersected(newEndNode.data.position.clone());
            if (beam) {//Add the created node to the innerNodes of the beam it intersects(if any)
                Beam.switchType(beam.userData.element, secondaryBeams[levelIndex], mainBeams[levelIndex]);
                beam.userData.element.data.innerNodes.push({ '$ref': newEndNode.data.$id });
            }
        }
        element.data.startNode = { "$ref": newStartNode.data.$id };
        element.data.endNode = { "$ref": newEndNode.data.$id };
    }

    window.toggle = () => editor.toggleBeams();//Toggle elements between wireFrame and extruded view
        window.measure = () => {//Measure distance between two nodes
        let points = [];
        if (editor.picker.selectedObject.size == 2) {
            for (let item of editor.picker.selectedObject) {
                if (item.userData.node)
                    points.push(item.userData.node.data.position);
                else {
                    showInfoModal('Please select two nodes before running the command');
                    return
                }
            }
            $('#distance').val(`${points[0].distanceTo(points[1]).toFixed(2)} m`);
        }
        else {
            showInfoModal('Please select two nodes before running the command');
        }
    }

    window.addLineLoad = function () { //Adds a LineLoad to the selected beam(s)
        editor.clearGroup('loads');
        let replace = $('#replaceLineLoad').prop('checked'); //Wether to replace the existing load (if any) or add to it
        let load = new LineLoad(parseFloat($('#lineLoad').val()), $('#lineLoadCase').val());
        for (let element of editor.picker.selectedObject) {
            if (element.userData.element instanceof Beam) {
                let beam = element.userData.element;
                let loadIndex = beam.addLoad(load, replace);
                editor.addToGroup(beam.data.lineLoads[loadIndex].render(beam), 'loads')
            }
        }
    }

    window.addPointLoad = function () { //Adds a PointLoad to the selected node(s)
        //editor.clearGroup('loads');
        // get node id
        let nodeId = $('#loadNodeId').val();
        //get the crosponding node
        let node = nodes.find(n => n.data.id === nodeId);
        //check if the node exists
        if (!node) {
            showInfoModal('Node not found');
            return;
        }
        // get the load value (i.e. fx, fy, fz)
        let fx = $('#fx').val();
        let fy = $('#fy').val();
        let fz = $('#fz').val();
        let newForce = new THREE.Vector3(parseFloat(fx), parseFloat(fy), parseFloat(fz));
        //check if the node has a none zero force and if so we need to remove it from the scene
        if (node.data.force.length() > 0) {
            //remove the existing load from the scene
            // get arrow from the visualObjects using nodeid
            let arrow = editor.visualObjects.Loads.find(v => v.nodeId === nodeId);
            console.log(arrow);
            // remove the arrow from the scene
            editor.removeFromGroup(arrow.arrowGroup, 'loads');
            // remove the arrow from the visualObjects
            editor.visualObjects.Loads = editor.visualObjects.Loads.filter(v => v.nodeId !== nodeId);
            console.log(editor.visualObjects.Loads);
        }
        node.data.force = newForce;
        if (newForce.length() > 0) {
            let pointLoad = new PointLoad(nodeId,fx, fy, fz);
            //let loadIndex = node.addLoad(pointLoad, replace);
            // add arrowgroup to visualObjects
            let arrow = pointLoad.render(node.data.position.clone(),boundingLength);
            editor.visualObjects.Loads.push(arrow);
            editor.addToGroup(arrow.arrowGroup, 'loads')
        }
        
    }
    window.endPointLoad = function () {
        // Hide this div: pointLoadDetails
        $('#pointLoadDetails').css('display', 'none');
    }

    window.hideLoads = function () { //Hide all loads in the selected case
        editor.hideGroup('loads');
        $('#hideLoadIcon').css('display', 'none');
        $('#showLoadIcon').css('display', 'block');
    }

    window.showLoads = function () { // Visualize all load in the selected case
        editor.showGroup('loads');
        $('#showLoadIcon').css('display', 'none');
        $('#hideLoadIcon').css('display', 'block');
    }
    window.showLabels = function () { //Visualize all labels in the selected case
        editor.showGroup('labels');
        $('#showLabelIcon').css('display', 'none');
        $('#hideLabelIcon').css('display', 'block');
    }
    window.hideLabels = function () {
        editor.hideGroup('labels');
        $('#hideLabelIcon').css('display', 'none');
        $('#showLabelIcon').css('display', 'block');
    }
    window.showConstraints = function () { //Visualize all constraints in the selected case
        editor.showGroup('constraints');
        $('#showConstraintIcon').css('display', 'none');
        $('#hideConstraintIcon').css('display', 'block');
    }
    window.hideConstraints = function () {
        editor.hideGroup('constraints');
        $('#hideConstraintIcon').css('display', 'none');
        $('#showConstraintIcon').css('display', 'block');
    }

    window.endConstraint = function () {
        $('#constraintsDetails').css('display', 'none');
    }

    window.addConstraint = function () {
        //get node id
        let nodeId = $('#constraintNodeId').val();
        //get the crosponding node
        let node = nodes.find(n => n.data.id === nodeId);
        //check if the node exists
        if (!node) {
            showInfoModal('Node not found');
            return;
        }
        //  get constraint values (i.e. ux, uy, uz)
        // value is string (Free -> true, Fixed -> false)
        // get string value and convert it to boolean
        let ux = $('#ux').val() === 'Free' ? true : false;
        let uy = $('#uy').val() === 'Free' ? true : false;
        let uz = $('#uz').val() === 'Free' ? true : false;
        console.log(ux, uy, uz);
        console.log(typeof($('#ux').val()));
        // create constraint object
        let constraint = new Constraint(ux, uy, uz);
        // check if the node has a constraint that at least one of its values is false
        if (!node.data.constraint.isAllFree()) {
            // remove the existing constraint from the scene
            // get constraint from the visualObjects using nodeid
            console.log(editor.visualObjects.Constraints);
            let constraintViz = editor.visualObjects.Constraints.find(v => v.nodeId === nodeId);
            // remove the constraint from the scene
            editor.removeFromGroup(constraintViz.group, 'constraints');
            // remove the constraint from the visualObjects
            editor.visualObjects.Constraints = editor.visualObjects.Constraints.filter(v => v.nodeId !== nodeId);
            console.log(editor.visualObjects.Constraints);
        }
        node.data.constraint = constraint;
        console.log(constraint.isAllFree());
        if (!constraint.isAllFree()) {
            // add constraint to visualObjects
            let constraintViz = new ConstraintViz(nodeId, node.data.position.clone(), ux, uy, uz);
            editor.visualObjects.Constraints.push(constraintViz);
            editor.addToGroup(constraintViz.group, 'constraints');
            console.log(constraintViz);
        }
    }

    window.changeSection = function () {
        let sectionName = $('#section').val();
        let existingSection = sections.find(s => s.name == sectionName);//Check if the section already exists
        if (!existingSection) {//if not already existing, create a new one
            existingSection = { $id: `${sectionId += 1000}`, name: sectionName, material: { $ref: 'm' } };
            sections.push(existingSection);
        }
        for (let item of editor.picker.selectedObject) {
            if (item.userData.element) { // Beams and columns only
                item.userData.element.changeSection(existingSection);
            }
        }
    }

    window.addNodeToBeam = function () {
        let distances = $('#nodeToBeam').val().split(',').map(d => this.parseFloat(d));
        let element, createdNode;
        for (let item of editor.picker.selectedObject) {
            if (item.userData.element instanceof Beam) {
                element = item.userData.element;
                for (var i = 0; i < distances.length; i++) {
                    let displacement = element.visual.direction.clone().multiplyScalar(distances[i]);
                    let nodePosition = item.position.clone().add(displacement);

                    createdNode = Node.create(nodePosition.x, nodePosition.y, nodePosition.z,
                        null, editor, nodes);
                    element.data.innerNodes.push({ $ref: createdNode.data.$id });
                }
            }
        }
    }

    window.createNode = function () { //Create a node by coordinates
        let node = Node.create(parseFloat($('#nodeXCoord').val()),
            parseFloat($('#nodeYCoord').val()), parseFloat($('#nodeZCoord').val()), null, editor, nodes);

        let beam = editor.getIntersected(node.data.position.clone()); //Beam mesh
        if (beam && beam.userData.element instanceof Beam) {
            beam = beam.userData.element;
            beam.data.innerNodes.push({ "$ref": node.data.$id }); //Add the node to the beam inner nodes
        }
    }
    window.endDrawNode = function () {
        $('#addNodeCoordDetails').css('display', 'none');
    }

    window.startDrawMode = () => 
    {
        // get start node id
        // get end node id
        // get cross section area
        // get modulus of elasticity
        // draw frame element
        let startNodeId = $('#startNodeNumber').val();
        let endNodeId = $('#endNodeNumber').val();
        // check if start node and end node are the same
        if (startNodeId === endNodeId) {
            showInfoModal('Start node and end node cannot be the same');
            return;
        }
        // get cross section area
        let crossSectionArea = $('#crossSectionalArea').val();
        // check cross section area is number greater than zero
        if (isNaN(crossSectionArea) || crossSectionArea <= 0) {
            showInfoModal('Cross section area must be a number greater than zero');
            return;
        }
        // get modulus of elasticity
        let modulusOfElasticity = $('#modulusOfElasticity').val();
        // check modulus of elasticity is number greater than zero
        if (isNaN(modulusOfElasticity) || modulusOfElasticity <= 0) {
            showInfoModal('Modulus of elasticity must be a number greater than zero');
            return;
        }
        // get start node
        let startNode = nodes.find(n => n.data.id === startNodeId);
        // check node exists
        if (!startNode) {
            showInfoModal('Start node does not exist');
            return;
        }
        // get end node
        let endNode = nodes.find(n => n.data.id === endNodeId);
        // check node exists
        if (!endNode) {
            showInfoModal('End node does not exist');
            return;
        }
        // start draw frame element
        
        // get start node position
        let startPosition = startNode.data.position;
        // get end node position
        let endPosition = endNode.data.position;
        // get direction
        let element = createFrameElement(editor, modulusOfElasticity, crossSectionArea, startPosition, endPosition, startNode, endNode);
        trussElements.push(element);
        console.log("Add element to truss elements");
        console.log(trussElements);
    }
    window.endDrawMode = () => {
        //  hide this div drawElementDetails
        $('#drawElementDetails').css('display', 'none');
        // draw = false;
        // if (drawingPoints[0])
        //     drawingPoints[0].visual.mesh.material.color.setHex(0xffcc00); //Restore the first node color

        // drawingPoints = [];
    }

    function createModel() { //Serialize model components to JSON
        console.log("Creating model");
        let model = {
            nodes: [], 
            trussElements: [], 
        };
        //model.projectProperties = projectProperties;
        for (var i = 0; i < nodes.length; i++) {
            model.nodes.push(nodes[i].data);
        }
        //for (var i = 0; i < trussElements.length; i++) {
        //    model.trussElements.push(trussElements[i].data);
        //}
        trussElements.forEach(e => model.trussElements.push(elementDataToDto(e.data)));
        // model.grids.cxs = grids.cxs; //For Tekla
        // model.grids.cys = grids.cys; //For Tekla
        // model.grids.coordX = grids.coordX; //For model re-openning
        // model.grids.coordZ = grids.coordZ; //For model re-openning
        // model.grids.levels = grids.levels; //For Tekla & model re-openning
        console.log("json");
        return JSON.stringify(model);
    }

    window.solve = function () { //Send data to server  
        $('#staticBackdrop').modal('show');
        editor.clearGroup('loads');
        $.ajax({
            url: `/Editor/Solve`,
            type: "POST",
            contentType: 'application/json',
            data: createModel(),
            success: function (res) {
                if (domEvents)
                    domEvents.destroy();//Clear old events (if existing)
                domEvents = new THREEx.DomEvents(editor.renderedCamera, canvas);

                res = JSON.parse(res);
               // editor.hideGroup('nodes');
                analysisResult.style.display = 'block';
                
                FrameElement.assignResults(trussElements, res.elementForces); 
                Node.assignResults(nodes, res.nodalDisplacements);
                deformedNodes = Node.createDeformedNodes(nodes, 10000, editor);
                deformedElements = FrameElement.createDeformedElements(trussElements, 10000, editor);
                FrameElement.drawElementForces(trussElements,forcesScale, editor);
                $('#staticBackdrop').modal('hide')
            },
            error: function (x, y, res) {
                $('#staticBackdrop').modal('hide')
                showInfoModal('Something went wrong. Please try again');
            }
        });
    }


    window.showDeformedShape = function () {
        
        flipDiv('#deformedShapeDetails');
        editor.hideGroup('elementFroces');
        editor.showGroup('deformedShape');
    }

    window.showElementForces = function () {
        flipDiv('#eleAxialForceDetails');
        editor.hideGroup('deformedShape');
        editor.showGroup('elementFroces');
    }

    window.showUndeformedShape = function () {
        $('#eleAxialForceDetails').css('display', 'none');
        $('#deformedShapeDetails').css('display', 'none');
        editor.hideGroup('deformedShape');
        editor.hideGroup('elementFroces');

    }


    //used to toggle between dark and light themes
    window.darkTheme = () => editor.darkTheme();

    window.lightTheme = () => editor.lightTheme();

    window.screenshot = () => editor.screenshot();

    window.hideDimensions = () => {
        editor.hideGroup('dimensions');
        $('#hideDims').css('display', 'none');
        $('#showDims').css('display', 'block');
    }

    window.showDimensions = () => {
        editor.showGroup('dimensions');
        $('#showDims').css('display', 'none');
        $('#hideDims').css('display', 'block');
    }

    // show and hide grids
    window.showGrids = () => {
        editor.showGroup('grids');
        $('#showGrids').css('display', 'none');
        $('#hideGrids').css('display', 'block');
    }

    window.hideGrids = () => {
        editor.hideGroup('grids');
        $('#hideGrids').css('display', 'none');
        $('#showGrids').css('display', 'block');
    }

   

    

    window.changeView = () => {
        let view = $('#view').val();
        if (view)
            editor.changeView(grids, view);
    }
    
    })();
});