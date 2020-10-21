#include <iostream>

using namespace std;

struct Position {
	unsigned int row;
	unsigned int col;
};

enum STATES { OPEN, WALL, PATH, START, EXIT };

class MazeRunner {
	Position startPoint;

	unsigned int mazeSize = 0;
	STATES ** maze;
	STATES ** tmpMaze;

	void buildMaze(const unsigned int n) {
		this->mazeSize = n;
		this->maze = new STATES * [n];
		this->tmpMaze = new STATES * [n];

		for (int i = 0; i < n; i++) {
			this->maze[i] = new STATES[n];
			this->tmpMaze[i] = new STATES[n];
		}
	}

	void destroyMaze() {
		for (int i = 0; i < this->mazeSize; i++) {
			delete [] this->maze[i];
			delete [] this->tmpMaze[i];
		}

		delete [] this->maze;
		delete [] this->tmpMaze;
	}

	void plotMaze(STATES ** maze) {
		for (int i = 0; i < this->mazeSize; i++) {
			for (int j = 0; j < this->mazeSize; j++) {
				this->maze[i][j] = maze[i][j];
				this->tmpMaze[i][j] = maze[i][j];
			}
		}
	}

	void findStartPoint() {
		for (int i = 0; i < this->mazeSize; i++) {
			for (int j = 0; j < this->mazeSize; j++) {
				if (this->maze[i][j] == START) {
					this->startPoint = Position { (unsigned int) i, (unsigned int) j };
					return;
				}
			}
		}
	}

	void changeUnit(Position unitPosition, STATES state, bool inTmp = false) {
		const unsigned int row = unitPosition.row;
		const unsigned int col = unitPosition.col;

		if (row < 0 || col < 0 || row >= this->mazeSize || col >= this->mazeSize) {
			throw "Error: Unit Position lies outside bounds";
		}

		if (inTmp) {
			this->tmpMaze[row][col] = state;
		} else {
			this->maze[row][col] = state;
		}
	}

	public:
	MazeRunner(STATES ** maze, const unsigned int n) {
		this->buildMaze(n);
		this->plotMaze(maze);

		this->findStartPoint();
	}

	Position getStartPoint() {
		return this->startPoint;
	}

	bool findPath(const unsigned int row, const unsigned int col) {
		if (row < 0 || row >= this->mazeSize) {
			return false;
		}

		if (col < 0 || col >= this->mazeSize) {
			return false;
		}

		if (this->tmpMaze[row][col] == WALL) {
			return false;
		}

		if (this->maze[row][col] == PATH) {
			return true;
		}

		if (this->tmpMaze[row][col] == OPEN) {
			this->tmpMaze[row][col] = WALL;
		}
	
		if (this->tmpMaze[row][col] == EXIT) {
			this->maze[row][col] = PATH;

			return true;
		}

		if (findPath(row + 1, col)) {
			this->maze[row][col] = PATH;

			return true;
		}

		if (findPath(row, col + 1)) {
			this->maze[row][col] = PATH;

			return true;
		}

		if (findPath(row - 1, col)) {
			this->maze[row][col] = PATH;

			return true;
		}

		if (findPath(row, col - 1)) {
			this->maze[row][col] = PATH;

			return true;
		}

		return false;
	}

	void printMaze(bool isCopy = false) {
		cout << endl << endl;

		for (int i = 0; i < this->mazeSize + 2; i++) {
			for (int j = 0; j < this->mazeSize + 2; j++) {
				if (i == 0 || i == (this->mazeSize + 1)) {
					cout << "\xDF ";
					continue;
				}

				if (j == 0 || j == (this->mazeSize + 1)) {
					cout << "\xB0 ";
					continue;
				}

				switch ((isCopy ? this->tmpMaze[i - 1][j - 1] : this->maze[i - 1][j - 1])) {
					case OPEN:
						cout << " ";
					break;

					case WALL:
						cout << "\xBA";
					break;

					case PATH:
						cout << "\xB2";
					break;

					case START:
						cout << "S";
					break;

					case EXIT:
						cout << "E";
					break;
				}

				cout << " ";
			}

			cout << endl;
		}
	}


	~MazeRunner() {
		this->destroyMaze();
	}
};

int main () {
	const unsigned int SIZE = 8;
	const STATES STRT = START;

	STATES maze[SIZE][SIZE] = {
		{ EXIT, OPEN, OPEN, WALL, WALL, WALL, OPEN, OPEN },
		{ OPEN, WALL, WALL, OPEN, STRT, WALL, OPEN, OPEN },
		{ OPEN, WALL, OPEN, WALL, OPEN, WALL, OPEN, WALL },
		{ OPEN, WALL, OPEN, WALL, OPEN, OPEN, OPEN, WALL },
		{ OPEN, OPEN, OPEN, OPEN, OPEN, WALL, OPEN, OPEN },
		{ OPEN, OPEN, OPEN, WALL, OPEN, WALL, OPEN, WALL },
		{ OPEN, WALL, OPEN, WALL, OPEN, OPEN, OPEN, WALL },
		{ OPEN, WALL, OPEN, OPEN, OPEN, WALL, OPEN, OPEN }
	};

	STATES ** mazeCopy = new STATES * [SIZE];
	for (int i = 0; i < SIZE; i++) {
		mazeCopy[i] = new STATES[SIZE];
		for (int j = 0; j < SIZE; j++) {
			mazeCopy[i][j] = maze[i][j];
		}
	}

	MazeRunner rat = MazeRunner(mazeCopy, SIZE);
	Position startPoint = rat.getStartPoint();

	cout << "MAZE BEFORE WINPATH" << endl;
	rat.printMaze();
	rat.findPath(startPoint.row, startPoint.col);
	cout << "MAZE AFTER WINPATH" << endl;
	rat.printMaze();

	return 0;
}