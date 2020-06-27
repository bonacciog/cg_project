/**
 * Questo file gestisce tutto ciò che riguarda l'ambiente
 * circostante alla macchina:
 * -disegna l'ambiente
 * -verifica che la posizione dell'auto sia corretta ai fini del gioco
 * 
 *  Il videogioco è composto da vari checkpoint (da non confondere,
 *  non sono un punto di ripartenza in caso di sconfitta) che identificano
 *  ognuno una parte del tracciato. Le parti del tracciato si contraddistinguono
 *  per la diversità di limiti.
 *  Esempio:
 *  Checkpoint 0 -> primo rettilineo (limiti cordinate bordi)
 *  Checkpoint 1 -> prima curva (limiti bordi curva, diversi da prima)
 *  ...
 * 
 * @author Giovanni Bonaccio 
 */

var r, r_baricentro;
var checkpoint_bounds;
var checkpoint;
var obstacles;
var raggio_cono, raggio_auto;


/**
 * Inizializza tutti i limiti presenti nel gioco
 */
function initBounds() {
    checkpoint_bounds = new Array();
    r = 3.5; r_baricentro = 0.7;
    checkpoint_bounds.push(
        check_StraightRoad_0
    );
    checkpoint_bounds.push(
        check_Curve_0
    );
    checkpoint_bounds.push(
        check_StraightRoad_1
    );
    checkpoint_bounds.push(
        check_Curve_1
    );
    checkpoint_bounds.push(
        check_StraightRoad_2
    );
    checkpoint_bounds.push(
        check_Curve_2
    );
    checkpoint_bounds.push(
        check_StraightRoad_3
    );
    checkpoint_bounds.push(
        check_Curve_3
    );
    checkpoint_bounds.push(
        check_Curve_4
    );
    checkpoint_bounds.push(
        check_StraightRoad_4
    );
    checkpoint_bounds.push(
        check_Parking_0
    );
    checkpoint_bounds.push(
        check_Parking_1
    );
    checkpoint = 0;
    raggio_cono = 0.35; raggio_auto = 2.3;
    obstacles = new Array();
    obstacles.push({
        x: -130,
        z: -292.5
    });
    obstacles.push({
        x: -150,
        z: -297.5
    });
    obstacles.push({
        x: -170,
        z: -292.5
    });
    obstacles.push({
        x: -190,
        z: -297.5
    });
    obstacles.push({
        x: -210,
        z: -292.5
    });
    obstacles.push({
        x: -230,
        z: -297.5
    });
    obstacles.push({
        x: -250,
        z: -292.5
    });
    obstacles.push({
        x: -270,
        z: -297.5
    });

}

/**
 * Aggiorna il checkpoint in base alla posizione dell'auto
 * @param {*} px 
 * @param {*} pz 
 */
function updateCheckpoint(px, pz) {
    if (checkpoint === 0 && pz <= -154
        || checkpoint === 1 && px <= -20
        || checkpoint === 2 && px <= -87
        || checkpoint === 3 && pz <= -190
        || checkpoint === 4 && pz <= -223
        || checkpoint === 5 && px >= -98
        || checkpoint === 6 && px >= -83
        || checkpoint === 7 && pz <= -266
        || checkpoint === 8 && px <= -84
        || checkpoint === 9 && px <= -315
        || checkpoint === 10 && px <= -344) {
        checkpoint++;
        console.log(checkpoint)
    }
    
}
/**
 * Calcola i punti estremi dell'auto (cofano e bagagliaio) ruotandoli
 * del facing, chiamando in base al checkpoint, la relativa funzione che 
 * verifica che i due punti rispettino i limiti del tracciato in cui si trova.
 * Calcola inoltre il baricentro dell'auto, utile per verificare che l'auto non
 * tocchi i coni.
 * -Per i rettilinei l'auto dev'essere all'interno di un range.
 * -Per le curve l'auto dev'essere in un range di punti che corrispondono a
 * una parte dei punti del raggio della circonferenza formata dalla curva.
 * -Per i coni la distanza dal centro del cono al centro dell'auto, dev'essere
 * maggiore della somma del raggio cono + raggio auto.
 * 
 * @param {*} px 
 * @param {*} pz 
 */

function checkEnvironmentLimit(px, pz) {

    // Verifico che il cofano e il bagagliaio (punti estremi) siano all'interno della strada ed eviti ostacoli
    /* =================================== COFANO ==========================================*/
    // Rotazione rispetto a un punto
    // traslo nell'origine
    let origin_cofano = [px - px, pz - r - pz];
    // ruoto rispetto all'origine
    let origin_cofano_rot = [origin_cofano[1] * Math.cos(degToRad(facing)) - origin_cofano[0] * Math.sin(degToRad(facing)),
    origin_cofano[1] * Math.sin(degToRad(facing)) + origin_cofano[0] * Math.cos(degToRad(facing))];
    // traslo nel punto
    let pos_cofano = [origin_cofano_rot[1] + px, origin_cofano_rot[0] + pz];

    /* =================================== BARICENTRO =======================================*/
    // Calcolo baricentro dell'auto per poi verificare distanza con oggetti
    // Rotazione rispetto a un punto
    let origin_bar = [px - px, pz - r_baricentro - pz];
    // ruoto rispetto all'origine
    let origin_bar_rot = [origin_bar[1] * Math.cos(degToRad(facing)) - origin_bar[0] * Math.sin(degToRad(facing)),
    origin_bar[1] * Math.sin(degToRad(facing)) + origin_bar[0] * Math.cos(degToRad(facing))];
    // traslo nel punto
    let pos_bar = [origin_bar_rot[1] + px, origin_bar_rot[0] + pz];


    /* =================================== BAGAGLIAIO =======================================*/
    // Rotazione rispetto a un punto
    // traslo nell'origine
    let origin_bag = [px - px, pz - r - pz];
    // ruoto rispetto all'origine
    let origin_bag_rot = [origin_bag[1] * Math.cos(degToRad(facing) + 180) - origin_bag[0] * Math.sin(degToRad(facing) + 180),
    origin_bag[1] * Math.sin(degToRad(facing) + 180) + origin_bag[0] * Math.cos(degToRad(facing) + 180)];
    // traslo nel punto
    let pos_bag = [origin_bag_rot[1] + px, origin_bag_rot[0] + pz];



    return checkpoint_bounds[checkpoint](pos_cofano, pos_bag) && checkObstacles(pos_bar);

}

/**
 * Renderizza la pista
 */
function RoadRender() {
    var road_matrix = m4.identity();
    /* bar_matrix = m4.translate(bar_matrix, -2, -2, -15);
    bar_matrix = m4.scale(bar_matrix, 0.2, 0.2, 0.2); */
    road_matrix = m4.scale(road_matrix, 0.05, 0.05, 0.05);
    road_matrix = m4.translate(road_matrix, 0, -30, 0);
    road_matrix = m4.yRotate(road_matrix, degToRad(90))
    gl.uniformMatrix4fv(_MVmatrix, false, road_matrix);
    drawObjectTexture(objects, 'bordi', 3);
    drawObjectTexture(objects, 'strada', 0);


    road_matrix = m4.copy(road_matrix);
    road_matrix = m4.translate(road_matrix, 661.5, 0, 0);
    gl.uniformMatrix4fv(_MVmatrix, false, road_matrix);
    drawObjectTexture(objects, 'bordi', 3);
    drawObjectTexture(objects, 'strada', 0);

    road_matrix = m4.copy(road_matrix);
    road_matrix = m4.translate(road_matrix, 661.5, 0, 0);
    gl.uniformMatrix4fv(_MVmatrix, false, road_matrix);
    drawObjectTexture(objects, 'bordi', 3);
    drawObjectTexture(objects, 'strada', 0);

    road_matrix = m4.copy(road_matrix);
    road_matrix = m4.translate(road_matrix, 661.5, 0, 0);
    gl.uniformMatrix4fv(_MVmatrix, false, road_matrix);
    drawObjectTexture(objects, 'bordi', 3);
    drawObjectTexture(objects, 'strada', 0);

    road_matrix = m4.copy(road_matrix);
    road_matrix = m4.translate(road_matrix, 661.5, 0, 0);
    gl.uniformMatrix4fv(_MVmatrix, false, road_matrix);
    drawObjectTexture(objects, 'bordi', 3);
    drawObjectTexture(objects, 'strada', 0);


    road_matrix = m4.copy(road_matrix);
    road_matrix = m4.translate(road_matrix, 634.5, -99, -135);
    gl.uniformMatrix4fv(_MVmatrix, false, road_matrix);
    drawObjectTexture(objects, 'curva', 4);

    road_matrix = m4.copy(road_matrix);
    road_matrix = m4.yRotate(road_matrix, degToRad(90))
    road_matrix = m4.translate(road_matrix, 677, 100, 110);
    gl.uniformMatrix4fv(_MVmatrix, false, road_matrix);
    drawObjectTexture(objects, 'bordi', 3);
    drawObjectTexture(objects, 'strada', 0);

    road_matrix = m4.copy(road_matrix);
    road_matrix = m4.translate(road_matrix, 661.5, 0, 0);
    gl.uniformMatrix4fv(_MVmatrix, false, road_matrix);
    drawObjectTexture(objects, 'bordi', 3);
    drawObjectTexture(objects, 'strada', 0);

    road_matrix = m4.copy(road_matrix);
    road_matrix = m4.translate(road_matrix, 605, -99, 140);
    road_matrix = m4.yRotate(road_matrix, degToRad(90))
    gl.uniformMatrix4fv(_MVmatrix, false, road_matrix);
    drawObjectTexture(objects, 'curva', 4);

    road_matrix = m4.copy(road_matrix);
    road_matrix = m4.translate(road_matrix, -636, 99.5, 135);
    gl.uniformMatrix4fv(_MVmatrix, false, road_matrix);
    drawObjectTexture(objects, 'bordi', 3);
    drawObjectTexture(objects, 'strada', 0);

    road_matrix = m4.copy(road_matrix);
    road_matrix = m4.translate(road_matrix, -655, -99, -110);
    road_matrix = m4.yRotate(road_matrix, degToRad(-90))
    gl.uniformMatrix4fv(_MVmatrix, false, road_matrix);
    drawObjectTexture(objects, 'curva', 4);

    road_matrix = m4.copy(road_matrix);
    road_matrix = m4.translate(road_matrix, -685, 0, 305);
    road_matrix = m4.yRotate(road_matrix, degToRad(180))
    gl.uniformMatrix4fv(_MVmatrix, false, road_matrix);
    drawObjectTexture(objects, 'curva', 4);

    road_matrix = m4.copy(road_matrix);
    road_matrix = m4.translate(road_matrix, -27, 0, -660);
    road_matrix = m4.yRotate(road_matrix, degToRad(90))
    gl.uniformMatrix4fv(_MVmatrix, false, road_matrix);
    drawObjectTexture(objects, 'curva', 4);

    road_matrix = m4.copy(road_matrix);
    road_matrix = m4.translate(road_matrix, 110, 99.5, -680);
    road_matrix = m4.yRotate(road_matrix, degToRad(90))
    gl.uniformMatrix4fv(_MVmatrix, false, road_matrix);
    drawObjectTexture(objects, 'bordi', 3);
    drawObjectTexture(objects, 'strada', 0);

    road_matrix = m4.copy(road_matrix);
    road_matrix = m4.translate(road_matrix, 661.5, 0, 0);
    gl.uniformMatrix4fv(_MVmatrix, false, road_matrix);
    drawObjectTexture(objects, 'bordi', 3);
    drawObjectTexture(objects, 'strada', 0);

    road_matrix = m4.copy(road_matrix);
    road_matrix = m4.translate(road_matrix, 661.5, 0, 0);
    gl.uniformMatrix4fv(_MVmatrix, false, road_matrix);
    drawObjectTexture(objects, 'bordi', 3);
    drawObjectTexture(objects, 'strada', 0);

    road_matrix = m4.copy(road_matrix);
    road_matrix = m4.translate(road_matrix, 661.5, 0, 0);
    gl.uniformMatrix4fv(_MVmatrix, false, road_matrix);
    drawObjectTexture(objects, 'bordi', 3);
    drawObjectTexture(objects, 'strada', 0);

    road_matrix = m4.copy(road_matrix);
    road_matrix = m4.translate(road_matrix, 661.5, 0, 0);
    gl.uniformMatrix4fv(_MVmatrix, false, road_matrix);
    drawObjectTexture(objects, 'bordi', 3);
    drawObjectTexture(objects, 'strada', 0);

    road_matrix = m4.copy(road_matrix);
    road_matrix = m4.translate(road_matrix, 661.5, 0, 0);
    gl.uniformMatrix4fv(_MVmatrix, false, road_matrix);
    drawObjectTexture(objects, 'bordi', 3);
    drawObjectTexture(objects, 'strada', 0);

    road_matrix = m4.copy(road_matrix);
    road_matrix = m4.translate(road_matrix, 661.5, 0, 0);
    gl.uniformMatrix4fv(_MVmatrix, false, road_matrix);
    drawObjectTexture(objects, 'bordi', 3);
    drawObjectTexture(objects, 'strada', 0);


    obstacles.forEach(element => {
        var obs_matrix = m4.identity();
        obs_matrix = m4.translate(obs_matrix, element.x, -1, element.z);
        obs_matrix = m4.scale(obs_matrix, 0.5, 0.5, 0.5)
        gl.uniformMatrix4fv(_MVmatrix, false, obs_matrix);
        drawObjectFill(objects, 'cono', 1, 0.46, 0.08);
    });

    var parking_matrix = m4.identity();
    parking_matrix = m4.translate(parking_matrix, -356.5, -1.5, -301);
    parking_matrix = m4.scale(parking_matrix, 20, 20, 20)
    parking_matrix = m4.yRotate(parking_matrix, degToRad(90))
    gl.uniformMatrix4fv(_MVmatrix, false, parking_matrix);
    drawObjectTexture(objects, 'parcheggio', 1);

    var house_matrix = m4.identity();
    house_matrix = m4.translate(house_matrix, 22, -0.5, 0)
    //house_matrix = m4.scale(house_matrix, 5, 5, 5)
    //house_matrix = m4.yRotate(house_matrix, degToRad(90));
    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix);
    drawObjectTexture(objects, 'casa', 8);

     var house_matrix1 = m4.identity();
     house_matrix1 = m4.translate(house_matrix1, -122, -0.5, -156)
    //house_matrix = m4.scale(house_matrix, 5, 5, 5)
    house_matrix1 = m4.yRotate(house_matrix1, degToRad(45));
    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix1);
    drawObjectTexture(objects, 'casa', 6);

    house_matrix = m4.copy(house_matrix);;
    house_matrix = m4.translate(house_matrix, -44, 0, 0)
    //house_matrix = m4.scale(house_matrix, 5, 5, 5)
    //house_matrix = m4.yRotate(house_matrix, degToRad(90));
    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix);
    drawObjectTexture(objects, 'casa', 7);

    house_matrix = m4.copy(house_matrix);
    house_matrix = m4.translate(house_matrix, 0, 0, -30)
    //house_matrix = m4.scale(house_matrix, 5, 5, 5)
    // house_matrix = m4.yRotate(house_matrix, degToRad(90));
    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix);
    drawObjectTexture(objects, 'casa', 6);

    house_matrix = m4.copy(house_matrix);
    house_matrix = m4.translate(house_matrix, 44, 0, 0)
    //house_matrix = m4.scale(house_matrix, 5, 5, 5)
    // house_matrix = m4.yRotate(house_matrix, degToRad(90));
    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix);
    drawObjectTexture(objects, 'casa', 6);

    house_matrix = m4.copy(house_matrix);;
    house_matrix = m4.translate(house_matrix, 0, 0, -30)
    //house_matrix = m4.scale(house_matrix, 5, 5, 5)
    //house_matrix = m4.yRotate(house_matrix, degToRad(90));
    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix);
    drawObjectTexture(objects, 'casa', 8);

    house_matrix = m4.copy(house_matrix);;
    house_matrix = m4.translate(house_matrix, -44, 0, 0)
    //house_matrix = m4.scale(house_matrix, 5, 5, 5)
    //house_matrix = m4.yRotate(house_matrix, degToRad(90));
    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix);
    drawObjectTexture(objects, 'casa', 7);

    house_matrix = m4.copy(house_matrix);
    house_matrix = m4.translate(house_matrix, 0, 0, -30)
    //house_matrix = m4.scale(house_matrix, 5, 5, 5)
    // house_matrix = m4.yRotate(house_matrix, degToRad(90));
    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix);
    drawObjectTexture(objects, 'casa', 6);

    house_matrix = m4.copy(house_matrix);
    house_matrix = m4.translate(house_matrix, 44, 0, 0)
    //house_matrix = m4.scale(house_matrix, 5, 5, 5)
    // house_matrix = m4.yRotate(house_matrix, degToRad(90));
    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix);
    drawObjectTexture(objects, 'casa', 8);

    house_matrix = m4.copy(house_matrix);;
    house_matrix = m4.translate(house_matrix, 0, 0, -30)
    //house_matrix = m4.scale(house_matrix, 5, 5, 5)
    //house_matrix = m4.yRotate(house_matrix, degToRad(90));
    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix);
    drawObjectTexture(objects, 'casa', 8);

    house_matrix = m4.copy(house_matrix);;
    house_matrix = m4.translate(house_matrix, -44, 0, 0)
    //house_matrix = m4.scale(house_matrix, 5, 5, 5)
    //house_matrix = m4.yRotate(house_matrix, degToRad(90));
    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix);
    drawObjectTexture(objects, 'casa', 7);

    house_matrix = m4.copy(house_matrix);
    house_matrix = m4.translate(house_matrix, 0, 0, -28)
    //house_matrix = m4.scale(house_matrix, 5, 5, 5)
    // house_matrix = m4.yRotate(house_matrix, degToRad(90));
    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix);
    drawObjectTexture(objects, 'casa', 6);

    house_matrix = m4.copy(house_matrix);
    house_matrix = m4.translate(house_matrix, 44, 0, 0)
    //house_matrix = m4.scale(house_matrix, 5, 5, 5)
    // house_matrix = m4.yRotate(house_matrix, degToRad(90));
    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix);
    drawObjectTexture(objects, 'casa', 7);

    house_matrix = m4.copy(house_matrix);
    house_matrix = m4.translate(house_matrix, -5, 0, -30)
    //house_matrix = m4.scale(house_matrix, 5, 5, 5)
    house_matrix = m4.yRotate(house_matrix, degToRad(45));
    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix);
    drawObjectTexture(objects, 'casa', 8);



    house_matrix = m4.copy(house_matrix);
    house_matrix = m4.yRotate(house_matrix, degToRad(-45));
    house_matrix = m4.translate(house_matrix, -30, 0, -13)
    //house_matrix = m4.scale(house_matrix, 5, 5, 5)

    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix);
    drawObjectTexture(objects, 'casa', 6);

    house_matrix = m4.copy(house_matrix);
    house_matrix = m4.translate(house_matrix, -44, 0, 44)
    //house_matrix = m4.scale(house_matrix, 5, 5, 5)
    // house_matrix = m4.yRotate(house_matrix, degToRad(90));
    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix);
    drawObjectTexture(objects, 'casa', 6);

    house_matrix = m4.copy(house_matrix);
    house_matrix = m4.translate(house_matrix, 0, 0, -44)
    //house_matrix = m4.scale(house_matrix, 5, 5, 5)
    // house_matrix = m4.yRotate(house_matrix, degToRad(90));
    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix);
    drawObjectTexture(objects, 'casa', 8);

    house_matrix = m4.copy(house_matrix);
    house_matrix = m4.translate(house_matrix, -30, 0, 0)
    //house_matrix = m4.scale(house_matrix, 5, 5, 5)
    // house_matrix = m4.yRotate(house_matrix, degToRad(90));
    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix);
    drawObjectTexture(objects, 'casa', 7);

    house_matrix = m4.copy(house_matrix);
    house_matrix = m4.translate(house_matrix, 0, 0, 44)
    //house_matrix = m4.scale(house_matrix, 5, 5, 5)
    // house_matrix = m4.yRotate(house_matrix, degToRad(90));
    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix);
    drawObjectTexture(objects, 'casa', 8);

    house_matrix = m4.copy(house_matrix);
    house_matrix = m4.translate(house_matrix, -46, 0, -44)
    //house_matrix = m4.scale(house_matrix, 5, 5, 5)
    // house_matrix = m4.yRotate(house_matrix, degToRad(90));
    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix);
    drawObjectTexture(objects, 'casa', 6);

    house_matrix = m4.copy(house_matrix);
    house_matrix = m4.translate(house_matrix, 0, 0, -30)
    //house_matrix = m4.scale(house_matrix, 5, 5, 5)
    // house_matrix = m4.yRotate(house_matrix, degToRad(90));
    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix);
    drawObjectTexture(objects, 'casa', 8);

    house_matrix = m4.copy(house_matrix);
    house_matrix = m4.translate(house_matrix, 44, 0, 0)
    //house_matrix = m4.scale(house_matrix, 5, 5, 5)
    // house_matrix = m4.yRotate(house_matrix, degToRad(90));
    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix);
    drawObjectTexture(objects, 'casa', 6);

    house_matrix = m4.copy(house_matrix);
    house_matrix = m4.translate(house_matrix, -34, 0, -38)
    //house_matrix = m4.scale(house_matrix, 5, 5, 5)
    house_matrix = m4.yRotate(house_matrix, degToRad(45));
    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix);
    drawObjectTexture(objects, 'casa', 7);

    house_matrix = m4.copy(house_matrix);

    //house_matrix = m4.scale(house_matrix, 5, 5, 5)
    house_matrix = m4.yRotate(house_matrix, degToRad(-45));

    house_matrix = m4.translate(house_matrix, 30, 0, -10)
    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix);
    drawObjectTexture(objects, 'casa', 7);

    house_matrix = m4.copy(house_matrix);
    house_matrix = m4.translate(house_matrix, 44, 0, 38)
    //house_matrix = m4.scale(house_matrix, 5, 5, 5)
    house_matrix = m4.yRotate(house_matrix, degToRad(45));
    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix);
    drawObjectTexture(objects, 'casa', 7);

    house_matrix = m4.copy(house_matrix);
    house_matrix = m4.yRotate(house_matrix, degToRad(-45));
    house_matrix = m4.translate(house_matrix, 10, 0, -38)
    //house_matrix = m4.scale(house_matrix, 5, 5, 5)

    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix);
    drawObjectTexture(objects, 'casa', 6);

    house_matrix = m4.copy(house_matrix);
    house_matrix = m4.translate(house_matrix, -10, 0, -38)
    house_matrix = m4.yRotate(house_matrix, degToRad(45));
    //house_matrix = m4.scale(house_matrix, 5, 5, 5)

    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix);
    drawObjectTexture(objects, 'casa', 8);

    house_matrix = m4.copy(house_matrix);
    //house_matrix = m4.scale(house_matrix, 5, 5, 5)
    house_matrix = m4.yRotate(house_matrix, degToRad(-45));

    house_matrix = m4.translate(house_matrix, -30, 0, -10)
    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix);
    drawObjectTexture(objects, 'casa', 7);

    house_matrix = m4.copy(house_matrix);

    house_matrix = m4.translate(house_matrix, -30, 0, 0)
    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix);
    drawObjectTexture(objects, 'casa', 6);
    house_matrix = m4.copy(house_matrix);

    house_matrix = m4.translate(house_matrix, -30, 0, 0)
    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix);
    drawObjectTexture(objects, 'casa', 6);

    house_matrix = m4.copy(house_matrix);
    house_matrix = m4.translate(house_matrix, -30, 0, 44)
    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix);
    drawObjectTexture(objects, 'casa', 6);

    house_matrix = m4.copy(house_matrix);
    house_matrix = m4.translate(house_matrix, 0, 0, -44)
    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix);
    drawObjectTexture(objects, 'casa', 8);

    house_matrix = m4.copy(house_matrix);
    house_matrix = m4.translate(house_matrix, -30, 0, 0)
    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix);
    drawObjectTexture(objects, 'casa', 7);
    
    house_matrix = m4.copy(house_matrix);
    house_matrix = m4.translate(house_matrix, 0, 0, 44)
    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix);
    drawObjectTexture(objects, 'casa', 6);

    house_matrix = m4.copy(house_matrix);
    house_matrix = m4.translate(house_matrix, -30, 0, 0)
    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix);
    drawObjectTexture(objects, 'casa', 8);

     house_matrix = m4.copy(house_matrix);
    house_matrix = m4.translate(house_matrix, 0, 0, -44)
    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix);
    drawObjectTexture(objects, 'casa', 7);

    house_matrix = m4.copy(house_matrix);
    house_matrix = m4.translate(house_matrix, -30, 0, 0)
    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix);
    drawObjectTexture(objects, 'casa', 6);

    house_matrix = m4.copy(house_matrix);
    house_matrix = m4.translate(house_matrix, 0, 0, 44)
    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix);
    drawObjectTexture(objects, 'casa', 8);

    house_matrix = m4.copy(house_matrix);
    house_matrix = m4.translate(house_matrix, -30, 0, 0)
    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix);
    drawObjectTexture(objects, 'casa', 6);

    house_matrix = m4.copy(house_matrix);
    house_matrix = m4.translate(house_matrix, 0, 0, -44)
    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix);
    drawObjectTexture(objects, 'casa', 6);

    house_matrix = m4.copy(house_matrix);
    house_matrix = m4.translate(house_matrix, -30, 0, 0)
    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix);
    drawObjectTexture(objects, 'casa', 7);
    house_matrix = m4.copy(house_matrix);
    house_matrix = m4.translate(house_matrix, -30, 0, 0)
    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix);
    drawObjectTexture(objects, 'casa', 6);
    house_matrix = m4.copy(house_matrix);
    house_matrix = m4.translate(house_matrix, -30, 0, 0)
    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix);
    drawObjectTexture(objects, 'casa', 7);
    house_matrix = m4.copy(house_matrix);
    house_matrix = m4.translate(house_matrix, -13, 0, 20)
    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix);
    drawObjectTexture(objects, 'casa', 8);
    house_matrix = m4.copy(house_matrix);
    house_matrix = m4.translate(house_matrix, 0, 0, 20)
    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix);
    drawObjectTexture(objects, 'casa', 7);

    house_matrix = m4.copy(house_matrix);
    house_matrix = m4.translate(house_matrix, 20, 0, 22)
    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix);
    drawObjectTexture(objects, 'casa', 6);

    house_matrix = m4.copy(house_matrix);
    house_matrix = m4.translate(house_matrix, 20, 0, 0)
    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix);
    drawObjectTexture(objects, 'casa', 7);

    house_matrix = m4.copy(house_matrix);
    house_matrix = m4.translate(house_matrix, 20, 0, 0)
    gl.uniformMatrix4fv(_MVmatrix, false, house_matrix);
    drawObjectTexture(objects, 'casa', 8);


}


/* FUNZIONI PER LA VERIFICA DEI LIMITI, UNO PER OGNI FASE DEL TRACCIATO */

function checkObstacles(car_center) {
    let isDistant = true;
    for (let i = 0; i < obstacles.length; i++) {
        let current_origin = [obstacles[i].x, obstacles[i].z];
        if (distance(car_center, current_origin) < raggio_cono + raggio_auto) {
            isDistant = false;
            console.log(isDistant, distance(car_center, current_origin));
        }

    }

    return isDistant;
}

function check_StraightRoad_0(pos_cofano, pos_bag) {
    let x_bound = [-6, 8];
    let z_bound = [5, -Infinity]

    return pos_cofano[0] >= x_bound[0] && pos_cofano[0] <= x_bound[1]
        && pos_cofano[1] <= z_bound[0] && pos_cofano[1] >= z_bound[1]
        && pos_bag[0] >= x_bound[0] && pos_bag[0] <= x_bound[1]
        && pos_bag[1] <= z_bound[0] && pos_bag[1] >= z_bound[1];
}

function check_Curve_0(pos_cofano, pos_bag) {
    let current_origin = [-20, -148];
    let raggio = [16, 33];

    return distance(pos_cofano, current_origin) <= raggio[1]
        && distance(pos_bag, current_origin) <= raggio[1]
        && distance(pos_cofano, current_origin) >= raggio[0]
        && distance(pos_bag, current_origin) >= raggio[0];
}

function check_StraightRoad_1(pos_cofano, pos_bag) {
    let x_bound = [-Infinity, 8];
    let z_bound = [-155, -177.5]

    return pos_cofano[0] >= x_bound[0] && pos_cofano[0] <= x_bound[1]
        && pos_cofano[1] <= z_bound[0] && pos_cofano[1] >= z_bound[1]
        && pos_bag[0] >= x_bound[0] && pos_bag[0] <= x_bound[1]
        && pos_bag[1] <= z_bound[0] && pos_bag[1] >= z_bound[1];
}

function check_Curve_1(pos_cofano, pos_bag) {
    let current_origin = [-89, -192];
    let raggio = [16.2, 32.3];

    return distance(pos_cofano, current_origin) <= raggio[1]
        && distance(pos_bag, current_origin) <= raggio[1]
        && distance(pos_cofano, current_origin) >= raggio[0]
        && distance(pos_bag, current_origin) >= raggio[0];

}

function check_StraightRoad_2(pos_cofano, pos_bag) {
    let x_bound = [-118.4, -104.5];
    let z_bound = [-177, -Infinity]

    return pos_cofano[0] >= x_bound[0] && pos_cofano[0] <= x_bound[1]
        && pos_cofano[1] <= z_bound[0] && pos_cofano[1] >= z_bound[1]
        && pos_bag[0] >= x_bound[0] && pos_bag[0] <= x_bound[1]
        && pos_bag[1] <= z_bound[0] && pos_bag[1] >= z_bound[1];

}

function check_Curve_2(pos_cofano, pos_bag) {
    let current_origin = [-87, -227];
    let raggio = [17.9, 34.8];

    return distance(pos_cofano, current_origin) <= raggio[1]
        && distance(pos_bag, current_origin) <= raggio[1]
        && distance(pos_cofano, current_origin) >= raggio[0]
        && distance(pos_bag, current_origin) >= raggio[0];

}
function check_StraightRoad_3(pos_cofano, pos_bag) {
    let x_bound = [-110, Infinity];
    let z_bound = [-242, -255.5]

    
    return pos_cofano[0] >= x_bound[0] && pos_cofano[0] <= x_bound[1]
        && pos_cofano[1] <= z_bound[0] && pos_cofano[1] >= z_bound[1]
        && pos_bag[0] >= x_bound[0] && pos_bag[0] <= x_bound[1]
        && pos_bag[1] <= z_bound[0] && pos_bag[1] >= z_bound[1]

}


function check_Curve_3(pos_cofano, pos_bag) {
    let current_origin = [-87, -270];
    let raggio = [17, 34];

    return distance(pos_cofano, current_origin) <= raggio[1]
        && distance(pos_bag, current_origin) <= raggio[1]
        && distance(pos_cofano, current_origin) >= raggio[0]
        && distance(pos_bag, current_origin) >= raggio[0];

}



function check_Curve_4(pos_cofano, pos_bag) {
    let current_origin = [-89, -272.5];
    let raggio = [19, 35];

    return distance(pos_cofano, current_origin) <= raggio[1]
        && distance(pos_bag, current_origin) <= raggio[1]
        && distance(pos_cofano, current_origin) >= raggio[0]
        && distance(pos_bag, current_origin) >= raggio[0];

}

function check_StraightRoad_4(pos_cofano, pos_bag) {
    let x_bound = [-Infinity, -79];
    let z_bound = [-289, -302]

    if(!(pos_cofano[0] >= x_bound[0] && pos_cofano[0] <= x_bound[1]
        && pos_cofano[1] <= z_bound[0] && pos_cofano[1] >= z_bound[1]
        && pos_bag[0] >= x_bound[0] && pos_bag[0] <= x_bound[1]
        && pos_bag[1] <= z_bound[0] && pos_bag[1] >= z_bound[1]))
        console.log(pos_bag, pos_cofano)
    return pos_cofano[0] >= x_bound[0] && pos_cofano[0] <= x_bound[1]
        && pos_cofano[1] <= z_bound[0] && pos_cofano[1] >= z_bound[1]
        && pos_bag[0] >= x_bound[0] && pos_bag[0] <= x_bound[1]
        && pos_bag[1] <= z_bound[0] && pos_bag[1] >= z_bound[1];

}

function check_Parking_0(pos_cofano, pos_bag) {
    let x_bound = [-Infinity, -300];
    let z_bound = [-289, -306]

    return pos_cofano[0] >= x_bound[0] && pos_cofano[0] <= x_bound[1]
        && pos_cofano[1] <= z_bound[0] && pos_cofano[1] >= z_bound[1]
        && pos_bag[0] >= x_bound[0] && pos_bag[0] <= x_bound[1]
        && pos_bag[1] <= z_bound[0] && pos_bag[1] >= z_bound[1];


}

function check_Parking_1(pos_cofano, pos_bag) {
    let x_bound = [-380, Infinity];
    let z_bound = [-281, -306];
    let parking_slot_x = [-370, -363];
    let parking_slot_z = [-266, -306];

    return (pos_cofano[0] >= x_bound[0] && pos_cofano[0] <= x_bound[1]
        && pos_cofano[1] <= z_bound[0] && pos_cofano[1] >= z_bound[1]
        && pos_bag[0] >= x_bound[0] && pos_bag[0] <= x_bound[1]
        && pos_bag[1] <= z_bound[0] && pos_bag[1] >= z_bound[1])
        || (pos_cofano[0] >= parking_slot_x[0] && pos_cofano[0] <= parking_slot_x[1]
            && pos_cofano[1] <= parking_slot_z[0] && pos_cofano[1] >= parking_slot_z[1]
            && pos_bag[0] >= parking_slot_x[0] && pos_bag[0] <= parking_slot_x[1]
            && pos_bag[1] <= parking_slot_z[0] && pos_bag[1] >= parking_slot_z[1]);


}

function distance(p1, p2) {
    return Math.sqrt(Math.pow((p1[0] - p2[0]), 2) + Math.pow((p1[1] - p2[1]), 2));
}

/**
 * Verifico che l'auto sia all'interno di quel quadrato
 * @param {*} px 
 * @param {*} pz 
 */
function checkWin(px,pz){
    let parking_slot_x = [-370, -363];
    let parking_slot_z = [-266, -282]
    console.log(px,pz)
    /* =================================== COFANO ==========================================*/
    // Rotazione rispetto a un punto
    // traslo nell'origine
    let origin_cofano = [px - px, pz - r - pz];
    // ruoto rispetto all'origine
    let origin_cofano_rot = [origin_cofano[1] * Math.cos(degToRad(facing)) - origin_cofano[0] * Math.sin(degToRad(facing)),
    origin_cofano[1] * Math.sin(degToRad(facing)) + origin_cofano[0] * Math.cos(degToRad(facing))];
    // traslo nel punto
    let pos_cofano = [origin_cofano_rot[1] + px, origin_cofano_rot[0] + pz];


    /* =================================== BAGAGLIAIO =======================================*/
    // Rotazione rispetto a un punto
    // traslo nell'origine
    let origin_bag = [px - px, pz - r - pz];
    // ruoto rispetto all'origine
    let origin_bag_rot = [origin_bag[1] * Math.cos(degToRad(facing) + 180) - origin_bag[0] * Math.sin(degToRad(facing) + 180),
    origin_bag[1] * Math.sin(degToRad(facing) + 180) + origin_bag[0] * Math.cos(degToRad(facing) + 180)];
    // traslo nel punto
    let pos_bag = [origin_bag_rot[1] + px, origin_bag_rot[0] + pz];


    return (pos_cofano[0] >= parking_slot_x[0] && pos_cofano[0] <= parking_slot_x[1]
        && pos_cofano[1] <= parking_slot_z[0] && pos_cofano[1] >= parking_slot_z[1]
        && pos_bag[0] >= parking_slot_x[0] && pos_bag[0] <= parking_slot_x[1]
        && pos_bag[1] <= parking_slot_z[0] && pos_bag[1] >= parking_slot_z[1]) && checkpoint === 11 ;
}