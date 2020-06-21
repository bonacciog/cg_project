var cx,cz;
var keyCamera;

function initDebugCamera(){
    cx=cz=0;
    keyCamera = [false,false,false,false];
    D=80; PHI=degToRad(90); THETA=degToRad(90);
}

var setCamera = {
    'default': setDefaultCamera,
    'highstatic': setHighAndStaticCamera,
    'oncar': setCameraOnTheCar,
    'debug': setDebugCamera
}

function setDefaultCamera() {
    target = [px, 0, pz - 4];

    camera = m4.subtractVectors(target, dst, camera)

    cameraMatrix = m4.lookAt(camera, target, up);

    cameraMatrix = m4.yRotate(cameraMatrix, degToRad(facing));

    cameraMatrix = m4.translate(cameraMatrix, 0, 5, 18.5);
}

function setHighAndStaticCamera() {

    target = [px, 0, pz - 4];

    cameraMatrix = m4.lookAt(camera, target, up);

    cameraMatrix = m4.translate(cameraMatrix, 0, 5, 18.5);
}


function setCameraOnTheCar() {
    target = [px, 0, pz - 4];

    camera = m4.subtractVectors(target, dst, camera)

    cameraMatrix = m4.lookAt(camera, target, up);

    cameraMatrix = m4.yRotate(cameraMatrix, degToRad(facing));

    cameraMatrix = m4.translate(cameraMatrix, 0, 1.5, 0.05);
}

function setDebugCamera() {
    if (keyCamera[1]) cx -= 2;
    if (keyCamera[3]) cx += 2;
  
    if (keyCamera[0]) cz += 2; 
    if (keyCamera[2]) cz -= 2; 
    
    camera = [D * Math.sin(PHI) * Math.cos(THETA),
    D * Math.sin(PHI) * Math.sin(THETA),
    D * Math.cos(PHI)];
        
    target = [0, 0, -4];

    cameraMatrix = m4.lookAt(camera, target, up);
    cameraMatrix = m4.translate(cameraMatrix, cx,cz,0)
}