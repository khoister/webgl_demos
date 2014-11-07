function Ball(scene, material, maze_width, maze_height, x, y)
{
	this.scene       = scene;
	this.maze_width  = maze_width;
	this.maze_height = maze_height;

	var geometry = new THREE.SphereGeometry(0.5, 10, 10);
	this.sphere = new THREE.Mesh(geometry, material);
	this.sphere.position.x = -maze_width + (Cell.WALL_LENGTH / 2) + (x * Cell.WALL_LENGTH);
	this.sphere.position.y = Cell.WALL_LENGTH / 2;
	this.sphere.position.z = -maze_height + (Cell.WALL_LENGTH / 2) + (y * Cell.WALL_LENGTH);
	
	this.scene.add(this.sphere);
}

Ball.prototype.get_row_position = function()
{
	return (Math.round(this.sphere.position.z) + this.maze_height - Cell.WALL_LENGTH / 2) / Cell.WALL_LENGTH;
}

Ball.prototype.get_column_position = function()
{
	return (Math.round(this.sphere.position.x) + this.maze_width - Cell.WALL_LENGTH / 2) / Cell.WALL_LENGTH;
}

Ball.prototype.get_x_position = function()
{
	return this.sphere.position.x;
}

Ball.prototype.get_y_position = function()
{
	// The row position of the maze is actually the Z-axis
	return this.sphere.position.z;
}

Ball.prototype.calc_x_position = function(column)
{
	return -this.maze_width + (Cell.WALL_LENGTH / 2) + (column * Cell.WALL_LENGTH);
}

Ball.prototype.calc_y_position = function(row)
{
	return -this.maze_height + (Cell.WALL_LENGTH / 2) + (row * Cell.WALL_LENGTH);
}

Ball.prototype.update_position = function(x_increment, y_increment)
{
	this.sphere.position.x += x_increment;
	this.sphere.position.z += y_increment;
}

