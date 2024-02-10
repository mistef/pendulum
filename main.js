import * as THREE from 'three'

const canvas = document.querySelector( '#canvasThree' )
const slider = document.querySelectorAll( '.slider' )
const infoText = document.querySelectorAll( '.infoText' )
const checkText = document.querySelectorAll( '.check' )
const fourthCol = document.querySelector( '#fourthCol' )


//the radius Slider/Text
// const radiusSlider = document.querySelector( '#radiusSlider' )
// const radiusText = document.querySelector( '#radiusText' )

// radiusSlider.addEventListener("input", function(){
//     let radius = this.value/1000;
//     parameters.radius = radius
//     radiusText.textContent = "Ακτίνα: " + (radius*100).toFixed(1).toString().replace(".", ",") + " cm";
//     obj.scale.setScalar(parameters.radius/0.02);
// })

//the mass Slider/Text
const massSlider = document.querySelector( '#massSlider' )
const massText = document.querySelector( '#massText' )

massSlider.addEventListener("input", function(){
    let mass = this.value/100;
    parameters.mass = mass
    massText.textContent = "Μάζα: " + Math.round(mass*1000) + " gr";
    lengthSlider.dispatchEvent(new Event("input"));


    //0x4066fd blue
    //red 0xfc330c
    let h1 = Math.round((0xf-0x2)*mass) + 0x2;
    let h2 = Math.round((0xc-0x0)*mass) + 0x0;
    let h3 = Math.round((0x3-0x6)*mass) + 0x6;
    let h4 = Math.round((0x3-0x6)*mass) + 0x6;
    let h5 = Math.round((0x0-0xf)*mass) + 0xf;
    let h6 = Math.round((0xc-0xd)*mass) + 0xd;

    let color = h6 + 0x10*h5 + 0x100*h4 + 0x1000*h3 + 0x10000*h2 + 0x100000*h1

    obj.material.color.setHex(color)

})

//the gravity Slider/Text
const gravitySlider = document.querySelector( '#gravitySlider' )
const gravityText = document.querySelector( '#gravityText' )

gravitySlider.addEventListener("input", function(){
    let gravity = this.value/100;
    parameters.gravity = -gravity
    gravityText.textContent = "g: " + (gravity).toFixed(2).toString().replace(".", ",") + " m/s²";



})

//the length Slider/Text
const lengthSlider = document.querySelector( '#lengthSlider' )
const lengthText = document.querySelector( '#lengthText' )

lengthSlider.addEventListener("input", function(){
    let length = this.value/100;
    parameters.length = length - parameters.radius;
    lengthText.textContent = "Μήκος: " + Math.round(this.value)+ " cm";

    if(solidRod){
        let mass = parameters.mass + parameters.rodMass;

        let radius = 1*parameters.rodMass/2 + parameters.mass*parameters.length
        radius /= mass;

        let momentRod = 1/3*parameters.rodMass*1*1
        let momentBall = parameters.mass*parameters.length*parameters.length;
        let moment = momentRod + momentBall;

        object.leq = moment/mass/radius

        //console.log(object.leq)
        //this is in order to not make the object jump
        let theta = Math.atan(-object.x/(object.topP - object.y));
        let delta = distanceString()-parameters.length
        object.x += Math.sin(theta)*delta
        object.y += Math.cos(theta)*delta
        obj.position.x = object.x
        obj.position.y = object.y
    }
    else{
        object.leq = parameters.length
    }

    if (parameters.time == 0 && distanceString() - parameters.length > 0.01){
        let theta = Math.atan(-object.x/(object.topP - object.y));
        let delta = distanceString()-parameters.length
        object.x += Math.sin(theta)*delta
        object.y += Math.cos(theta)*delta
        obj.position.x = object.x
        obj.position.y = object.y
    }
    else if (isStretched){
        let theta = Math.atan(-object.x/(object.topP - object.y));
        let delta = distanceString()-parameters.length
        object.x += Math.sin(theta)*delta
        object.y += Math.cos(theta)*delta
        obj.position.x = object.x
        obj.position.y = object.y
    }



    //the angle indicator length
    // dash.material.dispose();
    // let theta = Math.atan(object.x/(object.topP - object.y));
    // dash.geometry.attributes.position.setXYZ(0,  object.x, object.y, 0 );
    // dash.geometry.attributes.position.setXYZ(1,  object.x + Math.sin(theta), object.y - Math.cos(theta), 0 );
    // dash.geometry.attributes.position.needsUpdate = true;
    // dash.material = new THREE.LineDashedMaterial({ color: 0x3333aa, dashSize: 0.02, gapSize: 0.02});
    // material.needsUpdate = true

})

//the checkbox for the angle meter
const rulerShow = document.querySelector( '#rulerShow' )
rulerShow.addEventListener("change", function(){
    if (rulerShow.checked){
        scene.add(angle);
    }
    else{
        scene.remove(angle);
    }
})

//the pressure Slider/Text
const pressureSlider = document.querySelector( '#pressureSlider' )
const pressureText = document.querySelector( '#pressureText' )

pressureSlider.addEventListener("input", function(){
    let pressure = this.value*this.value;
    parameters.pressure = pressure
    pressureText.textContent = "Αντίσταση αέρα: " + (pressure) + "x";
})

//the checkbox for the solid rod or Spring
const rodShow = document.querySelector( '#rodShow' )
rodShow.addEventListener("change", function(){
    if (rodShow.checked){
        scene.add(rod);
        scene.remove( rope );
        solidRod = true;
        
    }
    else{
        scene.remove(rod);
        scene.add( rope );
        solidRod = false;
    }
    lengthSlider.dispatchEvent(new Event("input"));
})


//the time Slider/Text
const timeSlider = document.querySelector( '#timeSlider' )
const timeText = document.querySelector( '#timeText' )

timeSlider.addEventListener("input", function(){
    let time = this.value/2;
    parameters.timeOn = time
    timeText.textContent = "Επιτάχυνση χρόνου: " + (time).toFixed(1).toString().replace(".", ",") + "x";

    if (!timeStopped){
        parameters.time = parameters.timeOn;
    }
})

//the oscilation counter Slider/Text
const oscSlider = document.querySelector( '#oscSlider' )
const oscText = document.querySelector( '#oscText' )
const oscTimeText = document.querySelector( '#oscTimeText' )

oscSlider.addEventListener("input", function(){
    parameters.oscillations = this.value
    oscText.textContent = "Ταλαντώσεις: " + Math.round(this.value);
    oscTimeText.textContent = "0/" + Math.round(this.value) + " \u2003 0,000s"
    parameters.timeCounter = 0;
    parameters.oscilationCounter = -0.1;
    counting = false;
})

//the error radio buttons
// document.querySelector( '#radio2' ).addEventListener("change", function(){
//     console.log(this.value);
// })
document.body.addEventListener('change', function (e) {
    let target = e.target;
    switch (target.id) {
        case 'radio2':
            //parameters.maxError = 2;
            parameters.maxError = 50;
            break;
        case 'radio5':
            //parameters.maxError = 5;
            parameters.maxError = 100;
            break;
        case 'radio10':
            //parameters.maxError = 10;
            parameters.maxError = 200;
            break;
    }
});

//the timer button
const resetButton = document.querySelector( '#resetButton' )

resetButton.addEventListener("click", function(){
    parameters.oscilationCounter = 0;
    parameters.timeCounter = 0;
    counting = true;
    parameters.errorFactor = 1 + (Math.random()-0.5)*parameters.maxError/100*2
    parameters.timeCounter = NormSInv(Math.random())*parameters.maxError//[Math.random() - 0.5]*200
    //console.log(NormSInv(Math.random())*100);
})

//the start stop time button
const buttonStartStop = document.querySelector( '#buttonStartStop' )
buttonStartStop.classList.toggle('active')

buttonStartStop.addEventListener("click", function(){
    if (buttonStartStop.classList.contains("active")){
        timeStopped = false;
    }
    else {
        timeStopped = true;
    }

    if (timeStopped){
        parameters.time = 0;
    }
    else{
        parameters.time = parameters.timeOn;
    }
})







const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } )
renderer.shadowMap.enabled = true

let object ={
    x:0,
    y:0.105-0.02+0.3,
    ux:0,
    uy:0,
    topP: 1.205,
    leq: 1
}

let parameters = {
    gravity : -9.81,
    mass : 0.5,
    length : 0.95,
    radius : 0.05,
    pressure : 1,
    rodMass : 0.1,
    time: 1,
    oscillations: 10,
    timeCounter: 0,
    oscilationCounter: -0.1,
    maxError: 2,
    errorFactor: 1,
    timeOn: 1
}

let holding = false;
let solidRod = false;
let counting = false;
let timeStopped = false;
let isStretched = true;

let moveMouse = new THREE.Vector2();
let clickMouse = new THREE.Vector2();
let raycaster = new THREE.Raycaster();

const fov = 75;
const aspect = 4/3
const near = 0.1
const far = 10

const topCamera = 1.3;
const leftCamera = -29/24;

const camera = new THREE.OrthographicCamera( leftCamera,-leftCamera,topCamera,topCamera+(leftCamera*3/4*2), near, far)
//const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
//camera.position.z = 9
camera.position.z = 1.15
camera.position.y = 1.2/2 - 0.2
camera.position.x = 0


camera.position.y = 0.;
camera.lookAt( 0,0,0 )

const scene = new THREE.Scene()

const color = 0xFFFFFF;
const intensity = 2;
const light = new THREE.DirectionalLight( color, intensity );
light.position.set( 0, 2, 2 );
light.lookAt(0,0,0);
scene.add(light);

const lightAmbient = new THREE.AmbientLight( 0x999999 ); // white light
scene.add(lightAmbient);

scene.background = new THREE.Color( 0x7de9ff );

//this is the floor
const geometryFloor = new THREE.BoxGeometry( 10, 2, 1 ); 
const materialFloor = new THREE.MeshBasicMaterial({color: 0xf1b369});
const floor = new THREE.Mesh( geometryFloor, materialFloor );
scene.add( floor );
floor.position.y = -1;




const geometryPlane = new THREE.BoxGeometry( 5, 5, 0.001 ); 
const materialPlane = new THREE.MeshPhongMaterial({color: 0x44aa88, transparent: true});


const plane = new THREE.Mesh( geometryPlane, materialPlane );
scene.add( plane );
plane.position.y = 0.6;
plane.material.opacity = 0;


//this is the line that shows what angle does the object have
// var geometryDash = new THREE.BufferGeometry();
// geometryDash.vertices.push(new THREE.Vector3(0,0,0));
// geometryDash.vertices.push(new THREE.Vector3(1,0,0));


const pointsDash = [];
pointsDash.push(new THREE.Vector3(0,0,0));
pointsDash.push(new THREE.Vector3(parameters.length,0,0));



const geometryDash = new THREE.BufferGeometry().setFromPoints( pointsDash );
let materialDash = new THREE.LineDashedMaterial({ color: 0x3333aa, dashSize: 0.02, gapSize: 0.02});
const dash = new THREE.Line(geometryDash, materialDash);
dash.computeLineDistances();
scene.add(dash);



// const materialRope = new THREE.LineBasicMaterial({
// 	color: 0x0000ff
// });

// const points = [];
// points.push( new THREE.Vector3( 0, object.topP, 0 ) );
// points.push( new THREE.Vector3( 0, object.topP - parameters.length, 0 ) );
// const geometryRope = new THREE.BufferGeometry().setFromPoints( points );







const geometry = new THREE.SphereGeometry( parameters.radius, 32, 16 ); 
const material = new THREE.MeshPhongMaterial({color: 0x5255CD});
const obj = new THREE.Mesh( geometry, material );
scene.add( obj );

obj.position.y = 0.105-parameters.radius+0.3;
obj.position.x = 0;


addStand()


let [rope, ropeData] = createRope(parameters.length, 100);
scene.add( rope );




function addStand(){
    let standRadius = 0.01;
    let standheight = object.topP ;
    let standPosX = 0;
    
    const geometry = new THREE.CylinderGeometry( standRadius, standRadius, standheight, 32 );
    const material = new THREE.MeshPhongMaterial({color: 0x977a62});
    const stand = new THREE.Mesh( geometry, material );
    scene.add( stand );
    stand.position.y = standheight/2;
    stand.position.x = standPosX;
    stand.position.z = -0.1;

    const geometryC = new THREE.BoxGeometry( 0.02, 0.01, 0.11 );
    const materialC = new THREE.MeshPhongMaterial({color: 0xa78a72});
    const hang = new THREE.Mesh( geometryC, materialC );
    scene.add(hang)
    hang.position.y = standheight;
    hang.position.x = standPosX;
    hang.position.z = -0.05;

    const standFlg = new THREE.BoxGeometry( 0.13, 0.01, 0.13 );
    const materialF = new THREE.MeshPhongMaterial({color: 0x909090});
    const standFl = new THREE.Mesh( standFlg, materialF );
    scene.add(standFl)
    standFl.position.z = -0.05;
    
}

let angle;
addAngleMeter();

function addAngleMeter(){
    let width = 1.1 + 0.105
    let height = 1.1 + 0.105
    let posX = -width/2
    let posY = height/2



    let canvasAngle = document.createElement('canvas');
    let ctx = canvasAngle.getContext('2d');
    let textureAngle

    canvasAngle.width = 1100;
    canvasAngle.height = 1100;
    ctx.clearRect(0, 0, canvasAngle.height, canvasAngle.height);

    // Create the angle outline

    ctx.beginPath();
    ctx.fillStyle = "rgba(256, 256, 256, 0.3)"
    ctx.strokeStyle = "rgba(0, 0, 0, 1)"
    ctx.font = "35px Arial";
    ctx.arc(canvasAngle.width, 0, canvasAngle.width/1.085, 0, 2*Math.PI);
    ctx.rect(canvasAngle.width, 0, -canvasAngle.width, canvasAngle.height);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(0, 0, 256, 1)"




    for (let j = 0; j < 3; j++){    //draw three times because opacity stays low
        //draw the 10deg lines
        for (let i = 0; i<=90; i += 10){
            drawAngleLine(i, 30, canvasAngle.width/1.085)
        }

        //draw the 5deg lines
        for (let i = 0; i<=90; i += 5){
            drawAngleLine(i, 20, canvasAngle.width/1.085)
        }

        //draw the 1deg lines
        for (let i = 0; i<=90; i += 1){
            drawAngleLine(i, 10, canvasAngle.width/1.085)
        }

        //draw the 10deg Text
        for (let i = 10; i<90; i += 10){
            drawAngleText(i, 80, canvasAngle.width/1.085)
        }
    }





    function drawAngleLine(angle, length, radius){
        angle *= Math.PI/180
        let pY = radius*Math.sin(angle);
        let pX = canvasAngle.width - radius*Math.cos(angle);

        let pY2 = (radius+length)*Math.sin(angle);
        let pX2 = canvasAngle.width - (radius+length)*Math.cos(angle);
        ctx.beginPath();
        ctx.moveTo(pX, pY);
        ctx.lineTo(pX2, pY2);
        ctx.stroke();
    }

    function drawAngleText(angle, length, radius){
        let angleP = Math.PI/180*angle

        let pY2 = (radius+length)*Math.sin(angleP);
        let pX2 = canvasAngle.width - (radius+length)*Math.cos(angleP);

        ctx.fillText(90-angle, pX2, pY2);

    }

    // ctx.moveTo(0, 0);
    // ctx.lineTo(canvasAngle.width, canvasAngle.height/2);

    // // Draw the Path
    // ctx.stroke();

    textureAngle = new THREE.CanvasTexture(canvasAngle);


    const geometry = new THREE.BoxGeometry( width, height, 0.001, 32 );
    //const material = new THREE.MeshPhongMaterial({color: 0x808080});
    const material = new THREE.MeshBasicMaterial( { map: textureAngle, transparent: true } );
    angle = new THREE.Mesh( geometry, material );

    //scene.add(angle)
    angle.position.x = posX;
    angle.position.y = posY;


}

let rod;
createSolidRod()

function createSolidRod(){
    let radius = 0.005
    let maxlength = 1.01
    const geometry = new THREE.CylinderGeometry( radius, radius, maxlength, 32 );
    const material = new THREE.MeshPhongMaterial({color: 0xdddddd});
    rod = new THREE.Mesh( geometry, material );
    rod.position.y = object.topP-maxlength/2;
    rod.position.x = 0;
    rod.position.z = 0;
}


window.addEventListener('resize', function(){
    resizeCanvas()
});


function resizeCanvas(){
    canvas.style.width = "100%"
    canvas.style.height = "100%"

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    canvas.width = width;
    canvas.height = height;

    renderer.setSize( canvas.width, canvas.height)
    camera.updateProjectionMatrix()



    //change the classes in order to fit window     margin-top: 5%;
    for (let i = 0; i < infoText.length; i++){
        if (height < 900){
            infoText[i].style.marginTop = (5 - (900-height)/100).toString() + "%"
        }
        else{
            infoText[i].style.marginTop = "5%"
        }
    }

    for (let i = 0; i < slider.length; i++){
        if (height < 900){
            slider[i].style.marginTop = (5 - (900-height)/100).toString() + "%"
        }
        else{
            slider[i].style.marginTop = "5%"
        }
    }

    for (let i = 0; i < checkText.length; i++){
        if (height < 900){
            checkText[i].style.marginTop = (7 - (900-height)/80).toString() + "%"
        }
        else{
            checkText[i].style.marginTop = "7%"
        }
    }

    if (height < 900){
        fourthCol.style.width = (20 + 10*(900- height)/300).toString() + "%"
        document.querySelector( '#oscTimeText' ).style.marginBottom = (5-5*((900- height)/300)) + "%"
        document.querySelector( '#errorInfo' ).style.marginBottom = (3-3*((900- height)/300)) + "%"
    }
    else{
        fourthCol.style.width = "20%"
        document.querySelector( '#oscTimeText' ).style.marginBottom = "5%"
        document.querySelector( '#errorInfo' ).style.marginBottom = "3%"
    }

}


function calculateObjectPosition(dt){
    dt = dt>parameters.time*50 ? parameters.time*50 : dt;
    dt/=1000;

    if (holding == true){
        return
    }

    let steps = 100;
    for (let i = 0; i<steps; i++){
        positionStep(dt/steps);
    }

    obj.position.x = object.x;

    if(object.y >= object.topP){
        object.y = object.topP
        object.ux = 0;
        object.uy = 0;
    }
    obj.position.y = object.y;

}

function positionStep(dt){
    let force = {
        x: 0,
        y: parameters.gravity*parameters.mass
    }
    force.y *= parameters.length/object.leq

    //calculate the Foce of the String
    let fcoef = solidRod==true ? 10000 : 1000;
    let fString = fcoef*(distanceString()-parameters.length);
    fString = fString > 0 ? fString : 0;
    let theta = Math.atan(-object.x/(object.topP - object.y));
    force.x += Math.sin(theta)*fString;
    force.y += Math.cos(theta)*fString;

    //object.ux /= 1+(fString*fString/10000)*Math.sin(theta);
    //object.uy /= 1+(fString*fString/10000)*Math.cos(theta);
    //console.log(fString*fString)  0 to 400

    //Calculate the resistance due to the stretching of the string
    if (fString){
        let uString = Math.sin(theta)*object.ux+Math.cos(theta)*object.uy
        let resString = -50*uString

        force.x += Math.sin(theta)*resString;
        force.y += Math.cos(theta)*resString;
    }


    //add the air resistance
    let dragC = 1/2*1.3*0.47*parameters.radius*parameters.radius*Math.PI*parameters.pressure
    dragC *= (solidRod) ? 1.5 : 2;
    force.x += -object.ux*Math.abs(object.ux)*dragC -object.ux*dragC
    force.y += -object.uy*Math.abs(object.uy)*dragC -object.ux*dragC

    object.ux += force.x/parameters.mass*dt
    object.uy += force.y/parameters.mass*dt

    object.x += object.ux*dt
    object.y += object.uy*dt

}


let oldTime = 0;
function render( time ) {
    const delta = time - oldTime; //in ms
    oldTime = time;

    let xprev = object.x;
    for (let i = 0; i < 2*parameters.time; i++){
        calculateObjectPosition(delta/2);
    }


    if (counting){
        //console.log(parameters.oscilationCounter)
        if(xprev/object.x < 0){
            parameters.oscilationCounter += 1;
            if (Math.round(parameters.oscilationCounter - 1) >= 2*Math.round(parameters.oscillations)){
                counting = false;
            }
        }
        if (parameters.oscilationCounter > 0){
            parameters.timeCounter += delta*parameters.time;//*parameters.errorFactor
        }
        let timeShow = (parameters.oscilationCounter - 1)/2
        timeShow = timeShow < 0 ? 0 : timeShow
        if (parameters.timeCounter>200){
            oscTimeText.textContent = Math.floor(timeShow) + "/" + Math.round(parameters.oscillations) + " \u2003 "+ (parameters.timeCounter/1000).toFixed(3).toString().replace(".", ",") +"s"
        }
        else{
            oscTimeText.textContent = Math.floor(timeShow) + "/" + Math.round(parameters.oscillations) + " \u2003 "+ (0/1000).toFixed(3).toString().replace(".", ",") +"s"
        }
    }



    if (!solidRod){
        let topP = { x: 0, y: object.topP}
        let obP = { x: object.x, y: object.y}
    
        updateRope(ropeData, topP, obP);
    }
    else{
        updateRod(Math.atan(object.x/(object.topP - object.y)));
    }



    //console.log(object.x + ", " + object.y)

    if (object.y >= 1 && object.x == 0){
        object.x = 0.001;
    }


    let theta = Math.atan(object.x/(object.topP - object.y));
    dash.geometry.attributes.position.setXYZ(0,  0, object.topP, 0 );
    dash.geometry.attributes.position.setXYZ(1,  0 + 1.12*Math.sin(theta), object.topP - 1.12*Math.cos(theta), 0 );
    dash.geometry.attributes.position.needsUpdate = true;

    if(rulerShow.checked && theta < 0 && distanceString()*1.01>parameters.length){
        dash.visible = true;
    }
    else{
        dash.visible = false;
    }

    renderer.render( scene, camera )



    requestAnimationFrame( render )
}

requestAnimationFrame( render )

resizeCanvas();

window.addEventListener('mousedown', event => {
    // Check if it picks the object
    raycaster.setFromCamera(moveMouse, camera);
    const intersect = raycaster.intersectObject( obj );

    if (intersect.length ){
        //intersect[0].object.material.color.set( 0xff0000 );
        holding = true;
        object.ux = 0;
        object.uy = 0;
    }

});

window.addEventListener('mouseup', event => {
    holding = false;
});

canvas.addEventListener('mouseleave', event => {
    holding = false;
});



window.addEventListener('mousemove', event => {
    moveMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    moveMouse.x*= window.innerWidth/canvas.width
    //console.log(window.innerWidth);
    //console.log(canvas.width)
    moveMouse.y = - (event.clientY / canvas.height) * 2 + 1;
    //moveMouse.y*= window.innerHeight/canvas.height
    //moveMouse.y += window.innerHeight-canvas.height;
    if (holding){
        raycaster.setFromCamera(moveMouse, camera);
        const intersect = raycaster.intersectObject( plane );
        //console.log(raycaster.ray.direction.x);
        //move the object to the mouse position
        //obj.position.x = raycaster.ray.direction.x
        //obj.position.y = intersect[0].point.x
        //console.log(intersect[0].point.x);


        obj.position.x = intersect[0].point.x
        object.x = intersect[0].point.x

        obj.position.y = intersect[0].point.y
        object.y = intersect[0].point.y

        if (intersect[0].point.y > object.topP ){
            obj.position.y = object.topP
            object.y = object.topP
        }

        if (distanceString() > parameters.length){
            let theta = Math.atan(-object.x/(object.topP - object.y));
            let delta = distanceString()-parameters.length
            object.x += Math.sin(theta)*delta
            object.y += Math.cos(theta)*delta
            obj.position.x = object.x
            obj.position.y = object.y
        }

        if (solidRod){
            let theta = Math.atan(-object.x/(object.topP - object.y));
            let delta = distanceString()-parameters.length
            object.x += Math.sin(theta)*delta
            object.y += Math.cos(theta)*delta
            obj.position.x = object.x
            obj.position.y = object.y

        }



        //obj.position.z = intersect[0].point.z
    }
});

function distanceString(){
    let x = object.x
    let y = object.y
    let top = object.topP

    return Math.sqrt((x-0)*(x-0) + (y-top)*(y-top))- parameters.radius
}



//This is the rope stuff I hope this will work


function createRope(length, segments ){
    const points = [];
    let ropeData = new Array();

    let segmentLength = length/segments;

    for (let i = 0; i <= segments; i++){
        let vertex = {   
            x : 0, // current position
            y : i*segmentLength,
            z : 0,
            lx : 0,  // last position This point is not moving hence the last pos 
            ly : i*segmentLength,  // is the same as the current
            lz : 0
        }
        points.push( new THREE.Vector3( vertex.x, vertex.y, 0 ) );
        ropeData.push(vertex);
    }
    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    const material = new THREE.LineBasicMaterial({
        color: 0x000000
    });
    const line = new THREE.Line( geometry, material );
    return [line, ropeData];

}


function updateRope(data, objP, topP){
    let segments = data.length -1;
    let segmentLength = parameters.length/segments*0.8;

    // if (distanceString/parameters.length > 0.9){
    //     segmentLength /= 1
    // }
    //console.log(segmentLength);

    
    let gravity = 0.0001*parameters.gravity*parameters.time;
    let drag = -0.01;
    // //first and last points
    // data[0].lx = data[0].x;
    // data[0].x = objP.x;
    // data[0].ly = data[0].y;
    // data[0].y = objP.y;
    // data[0].lz = data[0].z;
    // data[0].z = 0;
    // rope.geometry.attributes.position.setXYZ(0,  objP.x, objP.y, 0 );

    // data[segments].lx = data[segments].x;
    // data[segments].x = topP.x;
    // data[segments].ly = data[segments].y;
    // data[segments].y = topP.y;
    // data[segments].lz = data[segments].z;
    // data[segments].z = 0;
    // rope.geometry.attributes.position.setXYZ(segments,  topP.x, topP.y, 0 );

    
    for (let i = 0; i <= segments; i++){
        //Verlet integration
        let x = data[i].x + (data[i].x - data[i].lx)*(1 + drag);
        let y = data[i].y + (data[i].y - data[i].ly)*(1 + drag) + gravity;
        let z = data[i].z + (data[i].z - data[i].lz)*(1 + drag);

        // if(i == 0){
        //     let distance = distanceBetweenPoints(data[0].x, data[0].y, data[0].z, topP.x, topP.y, 0)
        //     let theta = Math.atan(-(objP.x - data[0].x)/(objP.y - data[0].y));
        //     x += Math.sin(theta)*0.05*distance - (data[i].x - data[i].lx)*0.1
        //     y += Math.cos(theta)*0.05*distance - (data[i].x - data[i].lx)*0.1
        // }

        data[i].lx = data[i].x;
        data[i].x = x;
        data[i].ly = data[i].y;
        data[i].y = y;
        data[i].lz = data[i].z;
        data[i].z = z;
    }


    for (let j = 0; j < 100; j++){
        data[0].x = objP.x
        data[0].y = objP.y
        data[segments].x = topP.x
        data[segments].y = topP.y
        for (let i = 0; i < segments; i++){
            //the distance Betewen two concequetive points has to be equal to segment Length
            let p1 = data[i];
            let p2 = data[i+1];
            let distance = distanceBetweenPoints(p1.x , p1.y, p1.z, p2.x, p2.y, p2.z);
    
            let fraction = ((segmentLength - distance) / distance) / (2);
            //console.log(fraction);
            let dx = (p2.x - p1.x)*fraction;
            let dy = (p2.y - p1.y)*fraction;
            let dz = (p2.z - p1.z)*fraction;
    
            //Modify p1
            p1.x -= dx;
            p1.y -= dy;
            p1.z -= dz;
    
            //pass new variables to array
            data[i].x = p1.x;
            data[i].y = p1.y;
            data[i].z = p1.z;
    
            //Modify the next point
    
            p2.x += dx;
            p2.y += dy;
            p2.z += dz;
    
            data[i+1].x = p2.x;
            data[i+1].y = p2.y;
            data[i+1].z = p2.z;
        }

    }

    //do the thing for the last section
    //let distance = distanceBetweenPoints(data[segments].x , data[segments].y, data[segments].z, data[segments-1].x, data[segments-1].y, data[segments-1].z);
    //let fraction = ((segmentLength - distance) / distance) / 2;
    //data[segments].x += (data[segments].x - data[segments-1].x)*fraction*2;
    //data[segments].y += (data[segments].y - data[segments-1].y)*fraction*2;
    //data[segments].z += (data[segments].z - data[segments-1].z)*fraction*2;

    isStretched = false;
    for (let i = 0; i < segments; i++){
        let ratio = distanceString()/parameters.length;

        if (ratio > 0.99){
            isStretched = true;
            let theta = Math.atan(object.x/(object.topP - object.y));
            let x = segmentLength/0.78*i*Math.sin(theta);
            let y = -segmentLength/0.78*i*Math.cos(theta) + objP.y;
            rope.geometry.attributes.position.setXYZ( i, x, y, 0 );
        }
        else{
            rope.geometry.attributes.position.setXYZ( i, data[i].x, data[i].y, data[i].z );
        }

    }
    rope.geometry.attributes.position.setXYZ( segments, object.x, object.y, 0 );

    //depending on the distance modify the values to come closer to the center line
    // let ratio = distanceString()/parameters.length;

    // let theta = Math.atan(-object.x/(object.topP - object.y));
    
    // for (let i = 0; i <= segments; i++){
    //     let d = Math.sin(theta)*(objP.y-data[i].y) - Math.cos(theta)*(objP.x-data[i].x)
    //     let delt = d*(ratio);

    //     let x = data[i].x - delt*Math.cos(theta)
    //     let y = data[i].y -  delt*Math.sin(theta)


    //     rope.geometry.attributes.position.setXYZ( i, x, y, data[i].z );


    // }

    rope.geometry.attributes.position.needsUpdate = true;
    //console.log(data[9].y)


}

function distanceBetweenPoints(x1, y1, z1, x2, y2, z2){
    return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) + (z1-z2)*(z1-z2));
}

function updateRopeCat(data, topP, objP){
    let segs = data.length -1;
    //first and last points
    data[0].x = objP.x;
    data[0].y = objP.y;
    data[0].z = 0;
    rope.geometry.attributes.position.setXYZ(0,  objP.x, objP.y, 0 );

    data[segs].x = topP.x;
    data[segs].y = topP.y;
    data[segs].z = 0;
    rope.geometry.attributes.position.setXYZ(segs,  topP.x, topP.y, 0 );

    //find the catenary equation

    let b = 1;//starting value
    let s = parameters.length + parameters.radius+0.01;
    let u = topP.y - objP.y
    let h = Math.abs(objP.x)
    if (h <= 0.01){
        h = 0.01;
    }

    for (let i = 0; i < 10; i++){
        let fx = 1/Math.sqrt(2*b*Math.sinh(1/2/b) - 1) - 1/Math.sqrt(Math.sqrt(s*s-u*u)/h-1)
        let fdx = (1/2/b*Math.cosh(1/2/b)-Math.sinh(1/2/b))/Math.pow(2*b*Math.sinh(1/2/b)-1,3/2)
        b -= fx/fdx
    }

    //console.log(b);

    for (let i = 1; i<segs; i++){
        let x = i/segs*h
        //console.log(x)
        let y = b*h*Math.cosh(x/b/h)
        //console.log(x)

        data[i].x = x
        data[i].y = y

    }

    for (let i = 1; i < segs; i++){
        rope.geometry.attributes.position.setXYZ( i, data[i].x, data[i].y, data[i].z );
    }
    
}

function updateRopeSec(data, topP, objP){
    let segs = data.length -1;
    //first and last points
    data[0].x = objP.x;
    data[0].y = objP.y;
    data[0].z = 0;
    rope.geometry.attributes.position.setXYZ(0,  objP.x, objP.y, 0 );

    data[segs].x = topP.x;
    data[segs].y = topP.y;
    data[segs].z = 0;
    rope.geometry.attributes.position.setXYZ(segs,  topP.x, topP.y, 0 );

    //find the equation

    let b = 1;//starting value
    let s = parameters.length + parameters.radius+0.01;
    let u = topP.y - objP.y
    let h = Math.abs(objP.x)
    if (h <= 0.01){
        h = 0.01;
    }

    for (let i = 0; i < 10; i++){
        let fx = 1/Math.sqrt(2*b*Math.sinh(1/2/b) - 1) - 1/Math.sqrt(Math.sqrt(s*s-u*u)/h-1)
        let fdx = (1/2/b*Math.cosh(1/2/b)-Math.sinh(1/2/b))/Math.pow(2*b*Math.sinh(1/2/b)-1,3/2)
        b -= fx/fdx
    }

    //console.log(b);

    for (let i = 1; i<segs; i++){
        let x = i/segs*h
        //console.log(x)
        let y = b*h*Math.cosh(x/b/h)
        //console.log(x)

        data[i].x = x
        data[i].y = y

    }

    for (let i = 1; i < segs; i++){
        rope.geometry.attributes.position.setXYZ( i, data[i].x, data[i].y, data[i].z );
    }
    
}

function updateRod(angle){
    //from -90 to +90 degs
    //angle *= Math.PI/180
    rod.rotation.z = (angle)

    rod.position.x = Math.sin(angle)/2;
    rod.position.y = object.topP - Math.cos(angle)/2;

}

function NormSInv(p) {
    var a1 = -39.6968302866538, a2 = 220.946098424521, a3 = -275.928510446969;
    var a4 = 138.357751867269, a5 = -30.6647980661472, a6 = 2.50662827745924;
    var b1 = -54.4760987982241, b2 = 161.585836858041, b3 = -155.698979859887;
    var b4 = 66.8013118877197, b5 = -13.2806815528857, c1 = -7.78489400243029E-03;
    var c2 = -0.322396458041136, c3 = -2.40075827716184, c4 = -2.54973253934373;
    var c5 = 4.37466414146497, c6 = 2.93816398269878, d1 = 7.78469570904146E-03;
    var d2 = 0.32246712907004, d3 = 2.445134137143, d4 = 3.75440866190742;
    var p_low = 0.02425, p_high = 1 - p_low;
    var q, r;
    var retVal;

    if ((p < 0) || (p > 1))
    {
        alert("NormSInv: Argument out of range.");
        retVal = 0;
    }
    else if (p < p_low)
    {
        q = Math.sqrt(-2 * Math.log(p));
        retVal = (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
    }
    else if (p <= p_high)
    {
        q = p - 0.5;
        r = q * q;
        retVal = (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q / (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
    }
    else
    {
        q = Math.sqrt(-2 * Math.log(1 - p));
        retVal = -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
    }

    return retVal;
}
