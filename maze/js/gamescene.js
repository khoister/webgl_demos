function GameScene(window, document, rows, columns)
{
	this.window = window;
	this.document = document;

	// create a scene, that will hold all our elements such as objects, cameras and lights.
	this.scene = new THREE.Scene();

	// create a camera, which defines where we're looking at.
	this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

	// create a render and set the size
	this.renderer = new THREE.WebGLRenderer();

	this.controls = null;

	this.rows     = rows;
	this.columns  = columns;
	this.maze     = null;
}

GameScene.prototype.initialize = function()
{
	// Create a full grid for the maze. There will be no paths yet.
	this.maze = new Maze(this.scene, this.rows, this.columns);

	// Put the maze runner at starting point
	var runner_color = new THREE.MeshLambertMaterial({color: 0x257737, side: THREE.DoubleSide});
	this.maze.add_player(runner_color, 0, 0);

	// Destination marker
	var dest_color = new THREE.MeshLambertMaterial({color: 0xE08428, side: THREE.DoubleSide});
	this.maze.add_destination_marker(dest_color, this.rows-1, this.columns-1);

	this.maze
		.initialize()
		.generate()
		.traverse();

	this.renderer.setClearColor(0xA5AFAD);
	this.renderer.setSize(window.innerWidth, window.innerHeight);
	this.renderer.shadowMapEnabled = true;

	// position and point the camera to the center of the scene
	this.scene.position.set(0,0,0)
	this.camera.position.set(-40,60,60);
	this.camera.lookAt(this.scene.position);

	// Track ball controls
	this.controls = new THREE.TrackballControls(this.camera);
	this.controls.target = new THREE.Vector3( 0.0, this.camera.position.y, 0.0 );
	this.controls.rotateSpeed  = 1.5;
	this.controls.zoomSpeed    = 1.5;
	this.controls.panSpeed     = 1.5;
	this.controls.staticMoving = true;
	this.controls.dynamicDampingFactor = 0.1;
	this.controls.addEventListener('change', this.renderer);

	// add spotlight for the shadows
	var spotLight = new THREE.SpotLight(0xffffff);
	spotLight.position.set(-200, 250, 80);
	spotLight.castShadow = true;
	this.scene.add(spotLight);

	var spotLight2 = new THREE.SpotLight(0xffffff);
	spotLight2.position.set(500, 250, 80);
	spotLight2.castShadow = true;
	this.scene.add(spotLight2);

	var directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
	directionalLight.position.set(-1000, 200, 50);
	this.scene.add(directionalLight);

	// add the output of the renderer to the html element
	this.document.getElementById("container").appendChild(this.renderer.domElement);
	this.window.addEventListener("resize", this.on_window_resize, false);

	// call the render function
	this.renderer.render(this.scene, this.camera);
	return this;
}

GameScene.prototype.on_window_resize = function()
{
	this.camera.aspect = this.window.innerWidth / this.window.innerHeight;
	this.camera.updateProjectionMatrix();
	this.renderer.setSize(this.window.innerWidth, this.window.innerHeight);
	this.controls.handleResize();
}

GameScene.prototype.animate = function()
{
	requestAnimationFrame(animate);
	this.camera.lookAt(this.scene.position);

	this.maze.animate();

	this.renderer.render(this.scene, this.camera);
	this.controls.update();
	return this;
}

