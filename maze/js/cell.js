function Cell(x, y)
{
	this.visited         = false;

	this.neighbor_top    = null;
	this.neighbor_bottom = null;
	this.neighbor_left   = null;
	this.neighbor_right  = null;
	
	// A cell knows it's location in a grid
	this.x               = x;
	this.y               = y;
	
	// Walls belonging to this cell.
	// NOTE: Walls could be shared with neighbors
	this.wall_top        = null;
	this.wall_bottom     = null;
	this.wall_left       = null;
	this.wall_right      = null;
}

// The length (and height) of a wall
Cell.WALL_LENGTH = 2;

Cell.prototype.get_top_neighbor = function()
{
	return this.top_neighbor;
}

Cell.prototype.get_bottom_neighbor = function()
{
	return this.bottom_neighbor;
}

Cell.prototype.get_left_neighbor = function()
{
	return this.left_neighbor;
}

Cell.prototype.get_right_neighbor = function()
{
	return this.right_neighbor;
}

Cell.prototype.set_top_neighbor = function(neighbor)
{
	this.top_neighbor = neighbor;
}

Cell.prototype.set_bottom_neighbor = function(neighbor)
{
	this.bottom_neighbor = neighbor;
}

Cell.prototype.set_left_neighbor = function(neighbor)
{
	this.left_neighbor = neighbor;
}

Cell.prototype.set_right_neighbor = function(neighbor)
{
	this.right_neighbor = neighbor;
}

Cell.prototype.get_top_wall = function()
{
	return this.wall_top;
}

Cell.prototype.get_bottom_wall = function()
{
	return this.wall_bottom;
}

Cell.prototype.get_left_wall = function()
{
	return this.wall_left;
}

Cell.prototype.get_right_wall = function()
{
	return this.wall_right;
}

Cell.prototype.set_top_wall = function(wall)
{
	this.wall_top = wall;
}

Cell.prototype.set_bottom_wall = function(wall)
{
	this.wall_bottom = wall;
}

Cell.prototype.set_left_wall = function(wall)
{
	this.wall_left = wall;
}

Cell.prototype.set_right_wall = function(wall)
{
	this.wall_right = wall;
}

Cell.prototype.is_visited = function()
{
	return this.visited;
}

Cell.prototype.mark_visited = function()
{
	this.visited = true;
}

Cell.prototype.mark_unvisited = function()
{
	this.visited = false;
}

Cell.prototype.has_unvisited_neighbor = function()
{
	return(
	(this.get_top_neighbor()    != null && this.get_top_neighbor().is_visited()    == false) ||
	(this.get_bottom_neighbor() != null && this.get_bottom_neighbor().is_visited() == false) ||
	(this.get_left_neighbor()   != null && this.get_left_neighbor().is_visited()   == false) ||
	(this.get_right_neighbor()  != null && this.get_right_neighbor().is_visited()  == false));
}

