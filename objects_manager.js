/**
 * Questo file utilizza la libreria glm_light (prettamente modificata 
 * per recuperare facce poligonali, normali e tex cord)
 * e prepara gli oggetti per essere poi disegnati con webgl
 * 
 * @author Giovanni Bonaccio 
 */

/**
 * 
 * Apre il file con JQuery.ajax, 
 * richiama la glm_light che carica obj, 
 * aggiunge oggetto alla lista di objects
 * @param {*} objects 
 * @param {*} object_name 
 * @param {*} obj_path 
 */
function addObject(object_name, obj_path, texflag, objects) {

    if (getObjectByName(objects, object_name) != null)
        return;

    var jqXHR = $.ajax({
        async: false,
        url: obj_path,
        success: function (data) {
            return data;
        }
    });

    var data = jqXHR.responseText;

    var mesh = new subd_mesh();

    // parse obj from glm_light library
    mesh = ReadOBJ(data, mesh, texflag);

    // add edge
    mesh = LoadSubdivMesh(mesh);

    objects.push({
        name: object_name,
        mesh: mesh,
        vertices: getVertices(mesh),
        indices: getTriangleIndices(mesh),
        texcoords: texflag ? getTexCoords(mesh) : null,
        positions: getPositions(mesh),
        normals: getNormals(mesh)
    });


}


/**
 * Calcola gli indici delle facce dalla mesh caricata tramite glm_light
 * @param {*} objects 
 * @param {*} object_name 
 */
function getTriangleIndices(mesh, nome) {
    if (!mesh)
        return null;

    var indices = new Array();

    for (let i = 0; i <= mesh.nface; i++) {

        for (let k = 1; k < verticesNumberOnFace(mesh.face[i]) - 1; k++) {
            indices.push(mesh.face[i].vert[0]);
            indices.push(mesh.face[i].vert[k]);
            indices.push(mesh.face[i].vert[k + 1]);
        }
    }
    return indices;
}

/**
 * Riordina tex cord dalla mesh caricata tramite glm_light
 * @param {*} mesh 
 */
function getTexCoords(mesh) {
    if (!mesh)
        return null;

    let tex_cords_splitted = splitBy2(mesh.texcoords.texcoords);
    var texcoords = new Array();
    let texcoords_faces = mesh.texcoords.texcoords_face;
    for (let i = 0; i < texcoords_faces.length; i++) {
        let cur_face = texcoords_faces[i].texface;

        for (let k = 1; k < cur_face.length - 1; k++) {
            texcoords.push(cur_face[0]);
            texcoords.push(cur_face[k]);
            texcoords.push(cur_face[k + 1]);
        }
    }

    texcoords = convertToCoords2(tex_cords_splitted, texcoords);

    return texcoords;

}

/**
 * Riordina normali dalla mesh caricata tramite glm_light
 * @param {*} mesh 
 */
function getNormals(mesh) {
    if (!mesh)
        return null;

    let normals_splitted = splitBy3(mesh.normals.normals);
    var normals = new Array();
    let normals_faces = mesh.normals.normals_face;
    for (let i = 0; i < normals_faces.length; i++) {
        let cur_face = normals_faces[i].norface;

        for (let k = 1; k < cur_face.length - 1; k++) {
            normals.push(cur_face[0]);
            normals.push(cur_face[k]);
            normals.push(cur_face[k + 1]);
        }
    }

    normals_splitted.unshift({
        coord: [NaN, NaN, NaN]
    });

    normals = convertToCoords3(normals_splitted, normals);

    return normals;

}


/**
 * Riordina position dalla mesh caricata tramite glm_light
 * @param {*} mesh 
 */

function getPositions(mesh) {
    if (!mesh)
        return null;

    var indices = getTriangleIndices(mesh);

    var vertices = splitBy3(getVertices(mesh));

    var positions = convertToCoords3(vertices, indices);

    return positions;
}

/**
 * Ritorna vertici della mesh
 * @param {*} objects 
 * @param {*} object_name 
 */
function getVertices(mesh) {
    if (!mesh)
        return null;

    var vertices = new Array();
    for (let i = 0; i <= mesh.nvert; i++) {
        vertices.push(mesh.vert[i].x);
        vertices.push(mesh.vert[i].y);
        vertices.push(mesh.vert[i].z);
    }

    return vertices;
}

/*================ FUNZIONI AUSILIARIE ALLE FUNZIONI SOPRA ====================== */

/**
 * 
 * @param {*} array 
 */
function splitBy3(array) {
    var result = new Array();

    for (let i = 0; i < array.length; i = i + 3) {
        result.push({
            coord: [array[i], array[i + 1], array[i + 2]]
        })
    }
    return result;
}

/**
 * 
 * @param {*} vertices 
 * @param {*} indices 
 */
function convertToCoords3(vertices, indices) {
    var result = new Array();

    for (let i = 0; i < indices.length; i++) {
        result.push(vertices[indices[i]].coord[0]);
        result.push(vertices[indices[i]].coord[1]);
        result.push(vertices[indices[i]].coord[2]);
    }

    return result;
}

/**
 * 
 * @param {*} tex_cords_splitted 
 * @param {*} texcoords 
 */
function convertToCoords2(tex_cords_splitted, texcoords) {
    var result = new Array();

    for (let i = 0; i < texcoords.length; i++) {
        result.push(tex_cords_splitted[texcoords[i]].coord[0]);
        result.push(tex_cords_splitted[texcoords[i]].coord[1]);
    }
    return result;
}

/**
 * 
 * @param {*} array 
 */
function splitBy2(array) {
    var result = new Array();
    result.push({
        coord: [NaN, NaN]
    });
    for (let i = 0; i < array.length; i = i + 2) {
        result.push({
            coord: [array[i], array[i + 1]]
        })
    }
    return result;
}


/**
 * 
 * @param {*} face 
 */
function verticesNumberOnFace(face) {
    var count = 0;
    for (let i = 0; i < face.vert.length; i++) {
        if (face.vert[i] > 0)
            count++;
    }
    return count;
}



/**
 * 
 * @param {*} objects 
 * @param {*} object_name 
 */
function getObjectByName(objects, object_name) {
    for (let i = 0; i < objects.length; i++)
        if (object_name === objects[i].name)
            return objects[i];
    return null;
}


/**
 * 
 * @param {*} vertices 
 */
function myMakeRandomVertexColors(vertices) {
    var colors = new Array();
    for (let i = 0; i < vertices.length; i = i + 3) {
        colors.push(Math.round((Math.random())));
        colors.push(Math.round((Math.random())));
        colors.push(Math.round((Math.random())));
    }
    return colors;
}

/**
 * 
 * @param {*} vertices 
 * @param {*} r 
 * @param {*} g 
 * @param {*} b 
 */
function makeGivenVertexColors(vertices, r, g, b) {

    var colors = new Array();
    for (let i = 0; i < vertices.length; i = i + 3) {
        colors.push(r);
        colors.push(g);
        colors.push(b);
    }
    return colors;
}
