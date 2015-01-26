'use strict';

Physijs.scripts.worker = 'js/physijs/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

var container;
var camera, scene, control, renderer, material_depth;
var light_1, light_2, light_rotation_1 = 0, light_rotation_2 = 0;
var postprocessing = {};
var controls;


function init()
{
	container = document.getElementById('container');

	/* Camera */
	camera = new THREE.PerspectiveCamera(45.0, window.innerWidth / window.innerHeight, 0.05, 1000);
	camera.position.set( 0.0, 6, 25 );

	/* Track ball controls */
	controls = new THREE.TrackballControls( camera );
	controls.target 		= new THREE.Vector3( 0.0, camera.position.y, 0.0 );
	controls.rotateSpeed 	= 1.5;
	controls.zoomSpeed 		= 1.5;
	controls.panSpeed 		= 1.5;
	controls.staticMoving 	= true;
	controls.dynamicDampingFactor = 0.1;
	controls.addEventListener( 'change', render );

	/* Create the scene, tied to gravity */
	scene = new Physijs.Scene();
	scene.setGravity( new THREE.Vector3( 0, -10.0, 0 ));
	scene.addEventListener( 'update', function() {
		scene.simulate( undefined, 1 );
	} );
	
	material_depth = new THREE.MeshDepthMaterial();

	scene.add( createGroundPlane() );

	/* Create drops */
	for ( var i = 0; i < 100; i++ )  
		scene.add( createDrop() );

	scene.add( new THREE.AmbientLight( 0xCCCCCC ) );
	scene.add( light_1 = createShadowedLight( 100, 100, 200, 0xffffff, 1.35 ) );
	scene.add( light_2 = createShadowedLight( 50, 100, 80, 0xffaa00, 1 ) );

	/* Create our renderer */
	renderer = new THREE.WebGLRenderer( {antialias: false} );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.gammaInput  = true;
	renderer.gammaOutput = true;
	renderer.shadowMapEnabled  = true;
	renderer.shadowMapCullFace = THREE.CullFaceBack;


	container.appendChild( renderer.domElement );
	window.addEventListener( 'resize', onWindowResize, false );

	scene.simulate();
}



/**
*  Create object that drops from the heaven! 
*/
function createDrop() {
	var color = new THREE.Color( Math.random() * 1.0, Math.random() * 1.0, Math.random() * 1.0 );
	var material = Physijs.createMaterial(
		new THREE.MeshPhongMaterial( {
			ambient  : color,
			color    : color,
			specular : 0xAAAAAA,
			shininess: 100
		} ),
		0.6, 1.0
	);

	/* Create spheres */
	var drop = new Physijs.SphereMesh(
		new THREE.SphereGeometry( 0.5, 10, 10 ),
		material, 1.2
	);

	/* Randomly position drops in the sky */
	drop.position.set(
		Math.random() * 30 - 15.0,
		Math.random() * 20 + 30.0,
		Math.random() * 30 - 15.0
	);

	drop.receiveShadow 	= true;
	drop.castShadow 	= true;
	return drop
}


/**
* Create the ground plane
*/
function createGroundPlane() {
	var ground_material = Physijs.createMaterial(
		new THREE.MeshPhongMaterial( {
			ambient : 0x999999,
			color   : 0x999999,
			specular: 0x101010
		} ),
		1.0, 1.0
	);

	var ground = new Physijs.BoxMesh( new THREE.BoxGeometry( 40, 0.1, 40 ), ground_material, 0 );
	ground.position.set( 0, -0.5, 0 );
	ground.receiveShadow = true;

	return ground;
}


/**
* Creates directional light that casts shadows
*/
function createShadowedLight( x, y, z, color, intensity ) {
	var directional_light = new THREE.DirectionalLight( color, intensity );
	directional_light.position.set( x, y, z );
	directional_light.castShadow = true;

	/* Parameters for shadow casting */
	var d = 15.0;
	directional_light.shadowCameraLeft   = -d;
	directional_light.shadowCameraRight  =  d;
	directional_light.shadowCameraTop    =  d;
	directional_light.shadowCameraBottom = -d;

	directional_light.shadowCameraNear 	= 0.1;
	directional_light.shadowCameraFar 	= 300;

	directional_light.shadowMapWidth 	= 1024 * 0.7;
	directional_light.shadowMapHeight 	= 1024 * 0.7;

	directional_light.shadowBias 	 	= -0.0001;
	directional_light.shadowDarkness 	= 0.65;

	return directional_light;
}

/**
* Handles window resize
*/
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );

	controls.handleResize();
}

function animate() {
	requestAnimationFrame( animate );
	render();
	controls.update();

}

function render() {
	light_1.position.x = 100.0 * Math.cos( light_rotation_1 );
	light_1.position.z = 200.0 * Math.sin( light_rotation_1 );

	light_2.position.x = 50 * Math.cos( light_rotation_2 );
	light_2.position.z = 80 * Math.sin( light_rotation_2 );
	
	light_rotation_1 += 0.001;
	light_rotation_2 += 0.01;

	/* Render the scene to both color and depth textures first */
	renderer.clear();
	scene.overrideMaterial = null;
	renderer.render(scene, camera);
}


init();
animate();

