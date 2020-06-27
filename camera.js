/**
 * Questo file gestisce la posizione e l'obiettivo di tutte
 * le possibili telecamere nel gioco:
 * -default: segue l'auto stando sempre dietro a essa
 * -highstatic: smette di muoversi, quindi rimane ferma puntando l'auto (utile per il parcheggio)
 * -oncar: segue l'auto e si trova sul tettuccio
 * -debug: non segue l'auto e si trova in alto puntando la pista, utile per una fase di debug.
 *         Con i tasti numerici 5,2,1,3 (a destra della tastiera) si può muovere la camera.
 *         Inoltre questa modalità risponde alla modifica dei valori di PHI, THETA e D usando i 
 *         i tasti nella pagina o il mouse (cliccando e muovendo). 
 * 
 * @author Giovanni Bonaccio 
 */

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