const MAX_TRIANGLES_VERTICES = 3;

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
    
    return objects;

}

/**
 * Get indices from mesh
 * @param {*} objects 
 * @param {*} object_name 
 */
function getIndices(objects, object_name) {
    var mesh = getMeshByName(objects, object_name);

    if (!mesh)
        return null;
    
    var indices = new Array();

    for (let i = 0; i < mesh.nface; i++)
        for (let k = 0; k < MAX_TRIANGLES_VERTICES; k++)
            indices.push(mesh.face[i].vert[k]);          

    return indices;

}

/**
 * Get vertices from mesh
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
        if (object_name.localeCompare(objects[i].object_name))
            return objects[i].mesh;
    return null;
}