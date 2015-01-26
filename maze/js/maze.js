function Maze(scene, rows, columns)
{
	this.scene   = scene;
	this.rows    = rows;
	this.columns = columns;

	// Walls removed during maze generation
	this.removed_walls  = [];

	// Path taken to walk the maze
	this.traversal_path = [];

	// Grid of cells that make up the maze
	this.cells = new Array(this.rows);
	for (var i = 0; i < this.rows; i++)
	{
		// Create a column of Cells
		this.cells[i] = new Array(this.columns);
		for (var j = 0; j < this.columns; j++)
		{
			this.cells[i][j] = new Cell(i,j);
		}
	}

	// Represents the maze runner
	this.player = null;
	this.destination_marker = null;

	// Keeps track of the number of moves
	this.player_moves = 0;

	// Slows down the movement of the player to make it easier to track
	// The higher the number, the slower the movement
	this.slow_animation = 4;

	this.x_increment = 0;
	this.y_increment = 0;

	// Player has found the destination of the maze
	this.found_destination = false;
}

Maze.DIRECTION =
{
	TOP    : 1,
	RIGHT  : 2,
	BOTTOM : 3,
	LEFT   : 4
};

Maze.prototype.get_rows = function()
{
	return this.rows;
}

Maze.prototype.get_columns = function()
{
	return this.columns;
}

Maze.prototype.next_removed_wall = function()
{
	var wall = null;
	if (this.removed_walls.length > 0)
	{
		wall = this.removed_walls.pop();
	}
	return wall;
}

Maze.prototype.next_cell_in_path = function()
{
	var cell = null;
	if (this.traversal_path.length > 0)
	{
		cell = this.traversal_path.pop();
	}
	return cell;
}

Maze.prototype.clear = function()
{
	for (var i = 0; i < this.rows; i++)
	{
		for (var j = 0; j < this.columns; j++)
		{
			this.cells[i][j].mark_unvisited();
		}
	}
}

Maze.prototype.build_horizontal_wall = function(geometry, material, x, y)
{
	var wall = new THREE.Mesh(geometry, material);
	wall.position.x = -this.columns + (Cell.WALL_LENGTH / 2) + (x * Cell.WALL_LENGTH);
	wall.position.y = Cell.WALL_LENGTH / 2;
	wall.position.z = -this.rows + (Cell.WALL_LENGTH / 2) + (y * Cell.WALL_LENGTH) - Cell.WALL_LENGTH / 2;
	return wall;
}

Maze.prototype.build_vertical_wall = function(geometry, material, x, y)
{
	var wall = new THREE.Mesh(geometry, material);
	wall.rotation.y = -Math.PI / 2;
	wall.position.x = -this.columns + (x * Cell.WALL_LENGTH);
	wall.position.y = Cell.WALL_LENGTH / 2;
	wall.position.z = -this.rows + (Cell.WALL_LENGTH / 2) + (y * Cell.WALL_LENGTH);
	return wall;
}

Maze.prototype.initialize = function()
{
	var geometry = new THREE.PlaneGeometry(Cell.WALL_LENGTH, Cell.WALL_LENGTH);
	var blue     = new THREE.MeshLambertMaterial({color: 0x0000FF, side: THREE.DoubleSide}); // BLUE
	var red      = new THREE.MeshLambertMaterial({color: 0xFF0000, side: THREE.DoubleSide}); // RED

	// Set neighbors for each cell
	for (var i = 0; i < this.columns; i++)
	{
		for (var j = 0; j < this.rows; j++)
		{
			var current_cell = this.cells[i][j];
			var material = (j%2 == 0) ? blue : red;

			// Left-most column
			if (i == 0)
			{
				// Build a left wall
				var left_wall = this.build_vertical_wall(geometry, material, i, j);
				this.scene.add(left_wall);

				// Build a right wall
				var right_wall = this.build_vertical_wall(geometry, material, i+1, j);
				this.scene.add(right_wall);

				// Add just the right neighbor
				current_cell.set_right_neighbor(this.cells[i+1][j]);

				current_cell.set_left_wall(left_wall);
				current_cell.set_right_wall(right_wall);
			}
			// Right-most column
			else if (i == this.columns-1)
			{
				// Build a right wall
				var right_wall = this.build_vertical_wall(geometry, material, i+1, j);
				this.scene.add(right_wall);

				// Add just the left neighbor
				current_cell.set_left_neighbor(this.cells[i-1][j]);

				current_cell.set_right_wall(right_wall);
				current_cell.set_left_wall(this.cells[i-1][j].get_right_wall());
			}
			else
			{
				// Build a right wall
				var right_wall = this.build_vertical_wall(geometry, material, i+1, j);
				this.scene.add(right_wall);

				// Cell is a non-edge cell, add both left and right neighbors
				current_cell.set_left_neighbor(this.cells[i-1][j]);
				current_cell.set_right_neighbor(this.cells[i+1][j]);

				current_cell.set_left_wall(this.cells[i-1][j].get_right_wall());
				current_cell.set_right_wall(right_wall);
			}

			material = (i%2 == 0) ? blue : red;

			// Top-most row
			if (j == 0)
			{
				// Build a top wall
				var top_wall = this.build_horizontal_wall(geometry, material, i, j);
				this.scene.add(top_wall);

				// Build a bottom wall
				var bottom_wall = this.build_horizontal_wall(geometry, material, i, j+1);
				this.scene.add(bottom_wall);

				current_cell.set_top_wall(top_wall);
				current_cell.set_bottom_wall(bottom_wall);

				// Add just the bottom neighbor
				current_cell.set_bottom_neighbor(this.cells[i][j+1]);
			}
			// Bottom-most row
			else if (j == this.rows-1)
			{
				// Build a bottom wall
				var bottom_wall = this.build_horizontal_wall(geometry, material, i, j+1);
				this.scene.add(bottom_wall);

				current_cell.set_top_wall(this.cells[i][j-1].get_bottom_wall());
				current_cell.set_bottom_wall(bottom_wall);

				// Add just the top neighbor
				current_cell.set_top_neighbor(this.cells[i][j-1]);
			}
			else
			{
				// Build a bottom wall
				var bottom_wall = this.build_horizontal_wall(geometry, material, i, j+1);
				this.scene.add(bottom_wall);

				current_cell.set_top_wall(this.cells[i][j-1].get_bottom_wall());
				current_cell.set_bottom_wall(bottom_wall);

				// Cell is a non-edge cell, add both top and bottom neighors
				current_cell.set_top_neighbor(this.cells[i][j-1]);
				current_cell.set_bottom_neighbor(this.cells[i][j+1]);
			}
		}
	}
	return this;
}

Maze.get_random_neighbor = function(l, u)
{
	// Random number between l (inclusive) and u (exclusive)
	return Math.floor(Math.random() * (u - l)) + l;
}

// Get a random list of directions
Maze.get_direction_list = function()
{
	var directions = [Maze.DIRECTION.TOP, Maze.DIRECTION.RIGHT, Maze.DIRECTION.BOTTOM, Maze.DIRECTION.LEFT];

	for (var i = 0; i < directions.length; ++i)
	{
		var r = Maze.get_random_neighbor(i, directions.length);

		var t = directions[i];
		directions[i] = directions[r];
		directions[r] = t;
	}
	return directions;
}

Maze.prototype.internal_generate = function(current_cell)
{
	current_cell.mark_visited();

	if (current_cell.has_unvisited_neighbor())
	{
		var directions = Maze.get_direction_list();

		var next_neighbor = null;
		for (var i = 0; i < directions.length; i++)
		{
			var direction = directions[i];

			switch (direction)
			{
				case Maze.DIRECTION.TOP:
					next_neighbor = current_cell.get_top_neighbor();
					break;
				case Maze.DIRECTION.RIGHT:
					next_neighbor = current_cell.get_right_neighbor();
					break;
				case Maze.DIRECTION.BOTTOM:
					next_neighbor = current_cell.get_bottom_neighbor();
					break;
				case Maze.DIRECTION.LEFT:
					next_neighbor = current_cell.get_left_neighbor();
					break;
				default:
					break;
			}

			// Found an unvisited neighbor
			if (next_neighbor != null && !next_neighbor.is_visited())
			{
				var wall_to_remove = null;
				switch (direction)
				{
					case Maze.DIRECTION.TOP:
						wall_to_remove = current_cell.get_top_wall();
						current_cell.set_top_wall(null);
						next_neighbor.set_bottom_wall(null);
						break;
					case Maze.DIRECTION.RIGHT:
						wall_to_remove = current_cell.get_right_wall();
						current_cell.set_right_wall(null);
						next_neighbor.set_left_wall(null);
						break;
					case Maze.DIRECTION.BOTTOM:
						wall_to_remove = current_cell.get_bottom_wall();
						current_cell.set_bottom_wall(null);
						next_neighbor.set_top_wall(null);
						break;
					case Maze.DIRECTION.LEFT:
						wall_to_remove = current_cell.get_left_wall();
						current_cell.set_left_wall(null);
						next_neighbor.set_right_wall(null);
						break;
					default:
						break;
				}

				// Remove the wall between the current cell and the neighbor
				this.removed_walls.push(wall_to_remove);

				// The neighbor cell is now the current cell
				this.internal_generate(next_neighbor);
			}
		}
	}
}

Maze.prototype.generate = function()
{
	// Convert from 3D coordinates to (row, column) to get the starting cell
	var start_x = this.player.get_row_position();
	var start_y = this.player.get_column_position();

	this.internal_generate(this.cells[start_x][start_y]);
	this.removed_walls.reverse();
	return this;
}

Maze.prototype.internal_traverse = function(current_cell, x, y)
{
	current_cell.mark_visited();

	if (current_cell.x == x && current_cell.y == y)
	{
		// Found the destination. Done.
		return true;
	}

	var directions = Maze.get_direction_list();

	var next_neighbor = null;
	var neighboring_wall = null;

	for (var i = 0; i < directions.length; i++)
	{
		var direction = directions[i];

		switch (direction)
		{
			case Maze.TOP:
				next_neighbor = current_cell.get_top_neighbor();
				neighboring_wall = current_cell.get_top_wall(); 
				break;
			case Maze.DIRECTION.RIGHT:
				next_neighbor = current_cell.get_right_neighbor();
				neighboring_wall = current_cell.get_right_wall();
				break;
			case Maze.DIRECTION.BOTTOM:
				next_neighbor = current_cell.get_bottom_neighbor();
				neighboring_wall = current_cell.get_bottom_wall();
				break;
			case Maze.DIRECTION.LEFT:
				next_neighbor = current_cell.get_left_neighbor();
				neighboring_wall = current_cell.get_left_wall();
				break;
			default:
				break;
		}

		// Found an open corridor to walk through
		if (neighboring_wall == null && next_neighbor != null && !next_neighbor.is_visited())
		{
			// Walk to the neighboring cell
			this.traversal_path.push(next_neighbor);

			// Return immediately if we reached the destination
			if (this.internal_traverse(next_neighbor, x, y))
				return true;
		}
	}

	// Encountered a dead end. Need to backtrack.
	// Put this cell in the path so we can animate the backtracking.
	this.traversal_path.push(current_cell);
	return false;
}

Maze.prototype.traverse = function()
{
	this.clear();

	// Convert from 3D coordinates to (row, column) to get the starting cell
	var start_x = this.player.get_row_position();
	var start_y = this.player.get_column_position();

	this.internal_traverse(
		this.cells[start_x][start_y],
		this.destination_marker.get_x_position(),
		this.destination_marker.get_y_position());

	// Since the path coordinates are popped (as in a stack using Array.pop),
	// the traversal path is reversed.
	this.traversal_path.reverse();
	return this;
}

Maze.prototype.add_player = function(material, x, y)
{
	this.player = new Ball(this.scene, material, this.rows, this.columns, x, y);
}

Maze.prototype.add_destination_marker = function(material, x, y)
{
	this.destination_marker = new Ball(this.scene, material, this.rows, this.columns, x, y);
}

Maze.prototype.animate = function()
{
	if (this.found_destination)
	{
		return;
	}

	var wall_to_remove = this.next_removed_wall();
	if (wall_to_remove != null)
	{
		// Animate the maze construction
		this.scene.remove(wall_to_remove);
		delete wall_to_remove;
	}
	else
	{
		// Maze contruction animation is complete.
		// Now, traverse the maze
		if (this.player_moves++ % this.slow_animation == 0)
		{
			var cell = this.next_cell_in_path();
			if (cell != null)
			{
				var old_x = Math.round(this.player.get_x_position());
				var old_y = Math.round(this.player.get_y_position());

				var new_x = this.player.calc_x_position(cell.x);
				var new_y = this.player.calc_y_position(cell.y);
					
				this.x_increment = (new_x - old_x) / this.slow_animation;
				this.y_increment = (new_y - old_y) / this.slow_animation;
			}
			else
			{
				this.found_destination = true;
				return;
			}
		}
		this.player.update_position(this.x_increment, this.y_increment);
	}
}

