

/**
 * 
 * Reads from .obj file, loads the mesh 
 * and adds it to the objects list
 * @param {*} objects 
 * @param {*} object_name 
 * @param {*} obj_path 
 */
function addObject(object_name, obj_path, objects) {

    if (getMeshByName(objects, object_name) != null)
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
    mesh = ReadOBJ(data, mesh);

    // add edge
    mesh = LoadSubdivMesh(mesh);

    objects.push({
        name: object_name,
        mesh: mesh
    });

}

/**
 * Computes triangle indices from mesh
 * @param {*} objects 
 * @param {*} object_name 
 */
function getTriangleIndices(objects, object_name) {
    var mesh = getMeshByName(objects, object_name);

    if (!mesh)
        return null;

    var indices = new Array();

    for (let i = 0; i < mesh.nface; i++) {
        if (verticesNumberOnFace(mesh.face[i]) == 3) {
            indices.push(mesh.face[i].vert[0]);
            indices.push(mesh.face[i].vert[1]);
            indices.push(mesh.face[i].vert[2]);
        }
        else if (verticesNumberOnFace(mesh.face[i]) == 4) {
            indices.push(mesh.face[i].vert[0]);
            indices.push(mesh.face[i].vert[1]);
            indices.push(mesh.face[i].vert[2]);

            indices.push(mesh.face[i].vert[2]);
            indices.push(mesh.face[i].vert[3]);
            indices.push(mesh.face[i].vert[0]);
        }
    }
    return indices;
}

/**
 * Returns edge from mesh
 * @param {*} objects 
 * @param {*} object_name 
 */
function getEdges(objects, object_name) {
    var mesh = getMeshByName(objects, object_name);

    if (!mesh)
        return null;

    var edges = new Array();

    for (let i = 0; i < mesh.nedge; i++) {
        edges.push(mesh.edge[i].vert[0]);
        edges.push(mesh.edge[i].vert[1]);
    }
    return edges;
}

/**
 * Computes the number of vertex in a given face
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
 * Returns vertices from mesh
 * @param {*} objects 
 * @param {*} object_name 
 */
function getVertices(objects, object_name) {
    var mesh = getMeshByName(objects, object_name);

    if (!mesh)
        return null;

    var vertices = new Array();
    for (let i = 0; i < mesh.nvert; i++) {
        vertices.push(mesh.vert[i].x);
        vertices.push(mesh.vert[i].y);
        vertices.push(mesh.vert[i].z);
    }

    return vertices;
}

/**
 * Returns the object mesh using name as parameter
 * @param {*} objects 
 * @param {*} object_name 
 */
function getMeshByName(objects, object_name) {
    for (let i = 0; i < objects.length; i++)
        if (object_name===objects[i].name)
            return objects[i].mesh;
    return null;
}


/**
 * Generates an array of random colors
 * @param {*} vertices 
 */
function myMakeRandomVertexColors(vertices) {
    var colors = new Array();
    for (let i = 0; i + 3 < vertices.length; i = i + 3) {
        colors.push(Math.round((Math.random())));
        colors.push(Math.round((Math.random())));
        colors.push(Math.round((Math.random())));
    }
    return colors;
}

/**
 * Generates an array of given colors
 * @param {*} vertices 
 * @param {*} r 
 * @param {*} g 
 * @param {*} b 
 */
function makeGivenVertexColors(vertices, r, g, b) {

    var colors = new Array();
    for (let i = 0; i + 3 < vertices.length; i = i + 3) {
        colors.push(r);
        colors.push(g);
        colors.push(b);
    }
    return colors;
}