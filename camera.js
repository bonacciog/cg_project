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
    //D=15; PHI=degToRad(40); THETA=degToRad(81);
    camera = [D * Math.sin(PHI) * Math.cos(THETA),
    D * Math.sin(PHI) * Math.sin(THETA),
    D * Math.cos(PHI)];

    target = [px, 0, pz];

    cameraMatrix = m4.lookAt(camera, target, up);
}