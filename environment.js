var r;
var checkpoint_bounds;
var checkpoint;


function initBounds() {
    checkpoint_bounds = new Array();
    r = 3.5;
    checkpoint_bounds.push(
        check_0
    );
    checkpoint_bounds.push(
        check_1
    );
    checkpoint_bounds.push(
        check_2
    );
    checkpoint = 0;
}

function updateCheckpoint(px, pz) {
    if (checkpoint === 0 && pz <= -154
        || checkpoint === 1 && px<=-5.5){
        checkpoint++;
        console.log(checkpoint)
        }
    
}

function checkEnvironmentLimit(px, pz) {
    // Verifico che il cofano e il bagagliaio (punti estremi) siano all'interno della strada
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
    let origin_bag = [px - px, pz - 3.5 - pz];
    // ruoto rispetto all'origine
    let origin_bag_rot = [origin_bag[1] * Math.cos(degToRad(facing) + 180) - origin_bag[0] * Math.sin(degToRad(facing) + 180),
    origin_bag[1] * Math.sin(degToRad(facing) + 180) + origin_bag[0] * Math.cos(degToRad(facing) + 180)];
    // traslo nel punto
    let pos_bag = [origin_bag_rot[1] + px, origin_bag_rot[0] + pz];

    return checkpoint_bounds[checkpoint](pos_cofano, pos_bag);
    
}

function RoadRender() {
    var road_matrix = m4.identity();
    /* bar_matrix = m4.translate(bar_matrix, -2, -2, -15);
    bar_matrix = m4.scale(bar_matrix, 0.2, 0.2, 0.2); */
    road_matrix = m4.scale(road_matrix, 0.05, 0.05, 0.05);
    road_matrix = m4.translate(road_matrix, 0, -30, 0);
    road_matrix = m4.yRotate(road_matrix, degToRad(90))
    gl.uniformMatrix4fv(_Mmatrix, false, road_matrix);
    drawObjectFill(objects, 'rettilineo', 0.7, 0.7, 0.7);
    drawObjectWire(objects, 'rettilineo')

    for (i = 0; i < 4; i++) {
        road_matrix = m4.copy(road_matrix);
        road_matrix = m4.translate(road_matrix, 661.5, 0, 0);
        gl.uniformMatrix4fv(_Mmatrix, false, road_matrix);
        drawObjectFill(objects, 'rettilineo', 0.7, 0.7, 0.7);
        drawObjectWire(objects, 'rettilineo');
    }

    road_matrix = m4.copy(road_matrix);
    road_matrix = m4.translate(road_matrix, 634.5, -99, -135);
    gl.uniformMatrix4fv(_Mmatrix, false, road_matrix);
    drawObjectFill(objects, 'curva', 0.7, 0.7, 0.7);
    drawObjectWire(objects, 'curva');

    road_matrix = m4.copy(road_matrix);
    road_matrix = m4.yRotate(road_matrix, degToRad(90))
    road_matrix = m4.translate(road_matrix, 677, 100, 110);
    gl.uniformMatrix4fv(_Mmatrix, false, road_matrix);
    drawObjectFill(objects, 'rettilineo', 0.7, 0.7, 0.7);
    drawObjectWire(objects, 'rettilineo');

    road_matrix = m4.copy(road_matrix);
    road_matrix = m4.translate(road_matrix, 0, 0, 661.5);
    gl.uniformMatrix4fv(_Mmatrix, false, road_matrix);
    drawObjectFill(objects, 'rettilineo', 0.7, 0.7, 0.7);
    drawObjectWire(objects, 'rettilineo');
}

function check_0(pos_cofano, pos_bag){
    let x_bound = [-6,8];
    let z_bound = [5,-Infinity]

    return pos_cofano[0] >= x_bound[0] && pos_cofano[0] <= x_bound[1]
            && pos_cofano[1] <= z_bound[0] && pos_cofano[1] >= z_bound[1]
            && pos_bag[0] >= x_bound[0] && pos_bag[0] <= x_bound[1]
            && pos_bag[1] <= z_bound[0] && pos_bag[1] >= z_bound[1];
}

function check_1(pos_cofano, pos_bag){
    let current_origin = [-6,-160];
    let raggio = 8-(-6);
    
    return distance(pos_cofano, current_origin) <= raggio &&
            distance(pos_bag, current_origin) <= raggio;
}

function check_2(pos_cofano, pos_bag){
    let x_bound = [-Infinity,8];
    let z_bound = [-155,-177]
    console.log(pos_cofano, pos_bag);
    return pos_cofano[0] >= x_bound[0] && pos_cofano[0] <= x_bound[1]
            && pos_cofano[1] <= z_bound[0] && pos_cofano[1] >= z_bound[1]
            && pos_bag[0] >= x_bound[0] && pos_bag[0] <= x_bound[1]
            && pos_bag[1] <= z_bound[0] && pos_bag[1] >= z_bound[1];
}

function distance(p1,p2){
    return Math.sqrt(Math.pow((p1[0]-p2[0]),2) + Math.pow((p1[1]-p2[1]),2));
}