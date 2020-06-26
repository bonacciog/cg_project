// car2.js
// implementazione dei metodi

// STATO DELLA MACCHINA
// (DoStep fa evolvere queste variabili nel tempo)
var px, py, pz, facing; // posizione e orientamento
var mozzo, sterzo; // stato interno
var vx, vy, vz; // velocita' attuale

// queste di solito rimangono costanti
var velSterzo, velRitornoSterzo, accMax, attrito,
  grip, raggio,
  attritoX, attritoY, attritoZ; // attriti
var key;
// da invocare quando e' stato premuto/rilasciato il tasto numero "keycode"
/* function EatKey(keycode, keymap, pressed_or_released)
{
  for (var i=0; i<4; i++){
    if (keycode==keymap[i]) key[i]=pressed_or_released;
  }
} */

// DoStep: facciamo un passo di fisica (a delta-t costante)
//
// Indipendente dal rendering.
//
// ricordiamoci che possiamo LEGGERE ma mai SCRIVERE
// la struttura controller da DoStep
function CarDoStep() {
  // computiamo l'evolversi della macchina

  var vxm, vym, vzm; // velocita' in spazio macchina

  // da vel frame mondo a vel frame macchina
  var cosf = Math.cos(facing * Math.PI / 180.0);
  var sinf = Math.sin(facing * Math.PI / 180.0);
  vxm = +cosf * vx - sinf * vz;
  vym = vy;
  vzm = +sinf * vx + cosf * vz;

  // gestione dello sterzo
  if (key[1]) sterzo += velSterzo;
  if (key[3]) sterzo -= velSterzo;
  sterzo *= velRitornoSterzo; // ritorno a volante fermo

  if (key[0]) vzm -= accMax; // accelerazione in avanti
  if (key[2]) vzm += accMax; // accelerazione indietro

  // attriti (semplificando)
  vxm *= attritoX;
  vym *= attritoY;
  vzm *= attritoZ;

  // l'orientamento della macchina segue quello dello sterzo
  // (a seconda della velocita' sulla z)
  facing = facing - (vzm * grip) * sterzo;

  // rotazione mozzo ruote (a seconda della velocita' sulla z)
  var da; //delta angolo
  da = (180.0 * vzm) / (Math.PI * raggio);
  mozzo += da;

  // ritorno a vel coord mondo
  vx = +cosf * vxm + sinf * vzm;
  vy = vym;
  vz = -sinf * vxm + cosf * vzm;

  // posizione = posizione + velocita * delta t (ma e' delta t costante)
  px += vx;
  py += vy;
  pz += vz;
}

//function drawCube(); // questa e' definita altrove (quick hack)
//void drawAxis(); // anche questa

// // disegna una ruota come due cubi intersecati a 45 gradi
/* function drawWheel() {
  mo_matrix1 = m4.scale(mo_matrix1, 1, 1.0 / Math.sqrt(2.0), 1.0 / Math.sqrt(2.0));
  gl.uniformMatrix4fv(gl.getUniformLocation(shaderprogram, "modelViewMatrix"), false, mo_matrix1);
  drawCube();

  mo_matrix1 = m4.xRotate(mo_matrix1, degToRad(45));
  gl.uniformMatrix4fv(gl.getUniformLocation(shaderprogram, "modelViewMatrix"), false, mo_matrix1);
  drawCube();
} */

function CarInit() {
  // inizializzo lo stato della macchina
  px = py = pz = facing = 0; // posizione e orientamento
  mozzo = sterzo = 0;   // stato
  vx = vy = vz = 0;      // velocita' attuale
  // inizializzo la struttura di controllo
  key = [false, false, false, false];

  //velSterzo = 3.4;         // A
  velSterzo = 1;       // A
  velRitornoSterzo = 0.93; // B, sterzo massimo = A*B / (1-B)

  //accMax = 0.0011;
  accMax = 0.0035;

  // attriti: percentuale di velocita' che viene mantenuta
  // 1 = no attrito
  // <<1 = attrito grande
  attritoZ = 0.991;  // piccolo attrito sulla Z (nel senso di rotolamento delle ruote)
  attritoX = 0.8;  // grande attrito sulla X (per non fare slittare la macchina)
  attritoY = 1.0;  // attrito sulla y nullo

  // Nota: vel max = accMax*attritoZ / (1-attritoZ)
  raggio = 0.40
  /*   raggioRuotaA = 0.25;
    raggioRuotaP = 0.30; */

  grip = 0.45; // quanto il facing macchina si adegua velocemente allo sterzo
}
// disegna carlinga composta da 1 cubo traslato e scalato
/* function drawCarlinga(model_matrix) {
  // vado al frame pezzo_A
  mo_matrix1 = m4.copy(model_matrix);
  //mo_matrix1=m4.scale(mo_matrix1, 0.25 , 0.14 , 1);
  gl.uniformMatrix4fv(gl.getUniformLocation(shaderprogram, "modelViewMatrix"), false, mo_matrix1);

  //drawCube();

} */

// disegna Car
function CarRender(allowed_movement) {
  // sono nello spazio mondo

  //  drawAxis(); // disegno assi spazio mondo
  //  glPushMatrix();


  mo_matrix = m4.translate(mo_matrix, px, py, pz);
  mo_matrix = m4.yRotate(mo_matrix, degToRad(facing));



  // sono nello spazio MACCHINA
  //drawAxis(); // disegno assi spazio macchina
  gl.uniformMatrix4fv(_MVmatrix, false, mo_matrix);
  //drawObjectTexture(objects, "chassis_body", 2);
  drawObjectTexture(objects, 'chassis_body',2);  
  drawObjectFill(objects, 'chassis_o', 0, 0, 0);
  //drawObjectWire(objects, 'chassis');

  // ruota posteriore S
  mo_matrix1 = m4.copy(mo_matrix);
  // setta la posizione giusta rispetto alla carlinga
  mo_matrix1 = m4.translate(mo_matrix1, -0.4, -0.6, 0.35);

  mo_matrix1 = m4.translate(mo_matrix1, -0.58, +raggio - 0.28, +0.8);
  mo_matrix1 = m4.xRotate(mo_matrix1, degToRad(mozzo));
  gl.uniformMatrix4fv(_MVmatrix, false, mo_matrix1);
  //  drawCube();
  drawObjectFill(objects, 'ruota_posteriore');
  //drawObjectWire(objects, 'ruota_posteriore');

  // ruota posteriore D
  mo_matrix1 = m4.copy(mo_matrix);
  // setta la posizione giusta rispetto alla carlinga
  mo_matrix1 = m4.translate(mo_matrix1, 0.8, -0.35, 0.35)
  mo_matrix1 = m4.zRotate(mo_matrix1, degToRad(180));

  mo_matrix1 = m4.translate(mo_matrix1, -0.58, +raggio - 0.28, +0.8);
  mo_matrix1 = m4.xRotate(mo_matrix1, degToRad(mozzo));
  gl.uniformMatrix4fv(_MVmatrix, false, mo_matrix1);
  //  drawCube();
  drawObjectFill(objects, 'ruota_posteriore');
  //drawObjectWire(objects, 'ruota_posteriore');

  // ruota anteriore S
  mo_matrix1 = m4.copy(mo_matrix);
  // setta la posizione giusta rispetto alla carlinga
  mo_matrix1 = m4.translate(mo_matrix1, -0.4, -0.5, -1.4)

  mo_matrix1 = m4.translate(mo_matrix1, -0.58, +raggio - 0.28, -0.55);
  mo_matrix1 = m4.yRotate(mo_matrix1, degToRad(sterzo));
  mo_matrix1 = m4.xRotate(mo_matrix1, degToRad(mozzo));
  gl.uniformMatrix4fv(_MVmatrix, false, mo_matrix1);
  //  drawCube();
  drawObjectFill(objects, 'ruota_anteriore');
  //drawObjectWire(objects, 'ruota_anteriore');

  // ruota anteriore D
  mo_matrix1 = m4.copy(mo_matrix);
  // setta la posizione giusta rispetto alla carlinga
  mo_matrix1 = m4.translate(mo_matrix1, 0.65, -0.25, -1.5)
  mo_matrix1 = m4.zRotate(mo_matrix1, degToRad(180));

  mo_matrix1 = m4.translate(mo_matrix1, -0.58, +raggio - 0.28, -0.55);
  mo_matrix1 = m4.yRotate(mo_matrix1, degToRad(-sterzo));
  mo_matrix1 = m4.xRotate(mo_matrix1, degToRad(mozzo));
  gl.uniformMatrix4fv(_MVmatrix, false, mo_matrix1);
  //  drawCube();
  drawObjectFill(objects, 'ruota_anteriore');
  //drawObjectWire(objects, 'ruota_anteriore');
}
