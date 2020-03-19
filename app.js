function grow(mesh, t) {
  var normalMatrixWorld = new THREE.Matrix3();
  mesh.geometry.computeVertexNormals();
  var vertices = mesh.geometry.vertices;
  var faces = mesh.geometry.faces;
  var matrixWorld = mesh.matrixWorld;

  normalMatrixWorld.getNormalMatrix(matrixWorld);

  for (var i = 0, l = faces.length; i < l; i ++) {
    var fv = new THREE.Vector3();
    var face = faces[ i ];

    fv.copy( face.normal ).applyMatrix3( normalMatrixWorld ).normalize();
    var indices = [face.a, face.b, face.c];
    var scale=0.1;

    for (var j = 0; j < 3; j ++) {
      var vv = new THREE.Vector3();
      var a0 = fv.angleTo(new THREE.Vector3(1, 0, 0));
      var a1 = fv.angleTo(new THREE.Vector3(0, 1, 0));
      var a2 = fv.angleTo(new THREE.Vector3(0, 0, 1));
      var r = Math.floor(Math.random() * (8 - 2)) + 1;

      vertices[ indices[ j ] ].applyMatrix4( matrixWorld );
      vertices[ indices[ j ] ].addScaledVector(
        fv,
        Math.sin(t)*0.03
      );
    }
  }

  mesh.geometry.verticesNeedUpdate = true;
}

var camera, scene, renderer;
var geometry, material, mesh;
var clock;

var boxs = 1;

init();
animate();

function divide(mesh, modifier){
  var modifier = new THREE.SubdivisionModifier(modifier);
  mesh.geometry = modifier.modify( mesh.geometry );
}

function foobar(mesh, t) {
  mesh.geometry = new THREE.BoxGeometry( boxs, boxs, boxs );
  divide(mesh, 2);
  grow(mesh, t);
  divide(mesh, 2);
}

function init() {

  clock = new THREE.Clock();

	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 100 );
	camera.position.z = 1;

	scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xd9b296 );

  var texture = new THREE.TextureLoader().load('texture-01.png');
	material = new THREE.MeshLambertMaterial({map: texture, transparent: true });
  material.side = THREE.DoubleSide;

	mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );

  foobar(mesh);

  var light = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
  scene.add(light);

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

}

function animate() {

	requestAnimationFrame( animate );

	mesh.rotation.x += 0.001;
	mesh.rotation.y += 0.002;

  foobar(mesh, clock.getElapsedTime());

	renderer.render( scene, camera );

}
