var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'attribute vec4 a_Normal;\n' +
    
    'uniform mat4 u_MvpMatrix;\n' +
    'uniform mat4 u_NormalMatrix;\n' +
    'uniform vec3 u_LightColor;\n' +
    'uniform vec3 u_LightDirection;\n' +
    'uniform vec3 u_LightAmbient;\n'+
    'varying vec4 v_Color;\n' +
    'void main(){' +

    'gl_Position = u_MvpMatrix * a_Position;\n' +
    'vec4 normal = u_NormalMatrix * a_Normal;\n' +
    'float nDotL = max(dot(u_LightDirection,normalize(normal.xyz)),0.0);\n' +
    'vec3 diffuse = u_LightColor * vec3(a_Color) * nDotL;\n' +
    'vec3 ambient = u_LightAmbient*vec3(a_Color);\n'+
    'v_Color = vec4(diffuse+ambient,a_Color.a);\n' +
    '}'

var FSHADER_SOURCE =
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    'varying vec4 v_Color;\n' +
    'void main(){' +
    'gl_FragColor = v_Color;\n' +
    '}'

function main() {
    var canvas = document.getElementById('webgl')



    var gl = getWebGLContext(canvas)
    if (!gl) {
        console.log("fail to get the rendering context of canvas!");
        return;
    }

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log("fail to create initialize shader");
        return

    }

    var n = initVertexBuffers(gl)
    if (n < 0) {
        console.log("fail to create vertex buffer")
        return
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.enable(gl.DEPTH_TEST)

    var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix')
    var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix')
    var u_LightAmbient = gl.getUniformLocation(gl.program,'u_LightAmbient')
    if (!u_MvpMatrix) {
        console.log("fail to get the project matrix location")
        return
    }
    if (!u_NormalMatrix) {
        console.log("fail to get the pnormal matrix location")
        return
    }

    var u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor')
    var u_LightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection')
    if (!u_LightColor ) {
        console.log("fail to get the light color location")
        return
    }
    if (!u_LightDirection||!u_LightAmbient) {
        console.log("fail to get the light direction location")
        return
    }
    
    gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
    gl.uniform3f(u_LightAmbient,0.2,0.2,0.2)
    var lightDirection = new Vector3([0.5, 3.0, 4.0]);
    lightDirection.normalize();
    gl.uniform3fv(u_LightDirection, lightDirection.elements);


    var vpMatrix = new Matrix4();
    var MvpMatrix = new Matrix4();
    var modelMatrix = new Matrix4();
    var currentAngle = 0.0;
    var normalMatrix = new Matrix4();

    vpMatrix.setPerspective(30, 1, 1, 100)
    vpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0)
    var tick = function () {
        currentAngle = animate(currentAngle);
        modelMatrix.setRotate(currentAngle, 0, 1, 0);
        MvpMatrix.set(vpMatrix).multiply(modelMatrix)
        gl.uniformMatrix4fv(u_MvpMatrix, false, MvpMatrix.elements)

        normalMatrix.setInverseOf(modelMatrix)
        normalMatrix.transpose()
        gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements)


        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


        // Draw the triangles

        gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0)

        requestAnimationFrame(tick, canvas)

    }


    tick()




}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0,  // v0-v1-v2-v3 front
        1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0,  // v0-v3-v4-v5 right
        1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,  // v0-v5-v6-v1 up
        -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0,  // v1-v6-v7-v2 left
        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,  // v7-v4-v3-v2 down
        1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0
    ])

    var colors = new Float32Array([
        0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0,  // v0-v1-v2-v3 front(blue)
        0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4,  // v0-v3-v4-v5 right(green)
        1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4,  // v0-v5-v6-v1 up(red)
        1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4,  // v1-v6-v7-v2 left
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,  // v7-v4-v3-v2 down
        0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0   // v4-v7-v6-v5 back
    ])

    var normals = new Float32Array([    // Normal
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
        -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
        0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,  // v7-v4-v3-v2 down
        0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0   // v4-v7-v6-v5 back
    ]);
    var indices = new Uint8Array([       // Indices of the vertices
        0, 1, 2, 0, 2, 3,    // front
        4, 5, 6, 4, 6, 7,    // right
        8, 9, 10, 8, 10, 11,    // up
        12, 13, 14, 12, 14, 15,    // left
        16, 17, 18, 16, 18, 19,    // down
        20, 21, 22, 20, 22, 23     // back
    ]);
    var verticeColorBuffer = gl.createBuffer();
    if (!verticeColorBuffer) {
        console.log("fail to create vertexe buffer")
        return -1
    }
    var indiceBuffer = gl.createBuffer();
    if (!indiceBuffer) {
        console.log("fail to create indeixebuffer")
        return -1
    }
    if (!initArrayBuffer(gl, normals, 3, gl.FLOAT, 'a_Normal')) {
        return -1
    }
    if (!initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position')) {
        return -1
    }
    if (!initArrayBuffer(gl, colors, 3, gl.FLOAT, 'a_Color')) {
        return -1
    }


    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indiceBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

    return indices.length



}

function initArrayBuffer(gl, data, num, type, atrribute) {
    var buffer = gl.createBuffer()
    if (!buffer) {
        console.log("fail to creat buffer")
        return false
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)

    var a_attribute = gl.getAttribLocation(gl.program, atrribute)
    if (a_attribute < 0) {
        console.log("fail to get the location of " + atrribute)
        return false
    }
    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0)

    gl.enableVertexAttribArray(a_attribute)

    gl.bindBuffer(gl.ARRAY_BUFFER, null)
    return true;


}

var ANGLE_STEP = 30.0
var g_last = Date.now()

function animate(angle) {
    var now = Date.now()
    var elapsed = now - g_last
    g_last = now

    var newAngel = angle + (ANGLE_STEP * elapsed) / 1000.0
    return newAngel % 360
}

