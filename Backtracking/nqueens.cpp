#include <iostream>

using namespace std;

int absL(int n) {
	return n < 0 ? (n * -1) : n;
}

// Magnus Carlsen
class Magnus {
	enum STATES { OPEN, OCCUPIED, STRESSED };
	STATES ** chessBoard;

	unsigned int numOfQueens = 0;
	unsigned int numOfSolutions = 0;

	void makeChessBoard(unsigned int n) {
		if (n < 3) {
			throw "Error: The chessboard dimensions must be 4x4 or greater";
		}

		this->chessBoard = new STATES *[n];

		for (int i = 0; i < n; i++) {
			this->chessBoard[i] = new STATES[n];
			for (int j = 0; j < n; j++) {
				this->chessBoard[i][j] = this->OPEN;
			}
		}
	}

	void cleanChessBoard() {
		for (int i = 0; i < this->numOfQueens; i++) {
			delete [] this->chessBoard[i];
		}

		delete [] this->chessBoard;
	}

	public:
	Magnus(unsigned int n) {
		this->numOfQueens = n;
		this->makeChessBoard(n);
	}

	bool isStressed(unsigned int row, unsigned int col) {
		for (int i = 0; i < this->numOfQueens; i++) {
			for (int j = 0; j < this->numOfQueens; j++) {
				if (i == row && j == col) continue;

				if (this->chessBoard[i][j] == this->OCCUPIED) {
					if (i == row) {
						return true;
					}

					if (j == col) {
						return true;
					}

					if (absL(row - i) == absL(col - j)) {
						return true;
					}
				}
			}
		}

		return false;
	}

	void placeQueen(unsigned int row, unsigned int col) {
		if (row >= this->numOfQueens || row < 0 || col >= this->numOfQueens || col < 0) {
			throw "Error: Out Of Chessboard Bounds";
		}

		this->chessBoard[row][col] = this->OCCUPIED;
	}

	void removeQueen(unsigned int row, unsigned int col) {
		if (row >= this->numOfQueens || row < 0 || col >= this->numOfQueens || col < 0) {
			throw "Error: Out Of Chessboard Bounds";
		}

		this->chessBoard[row][col] = this->OPEN;
	}

	bool play(unsigned int row, unsigned int col) {
		if (row >= this->numOfQueens) {
			return true;
		}

		if (col >= this->numOfQueens) {
			return false;
		}

		for (int i = 0; i < this->numOfQueens; i++) {
			if (!isStressed(row, i)) {
				this->placeQueen(row, i);

				// Print Step Taken
				// this->printChessBoard();

				if (this->play(row + 1, i)) {
					this->numOfSolutions++;
					cout << "Solution Found!" << endl;
					// Print Solution
					this->printChessBoard();
					// Exit At First Solution
					// return true;
				}

				this->removeQueen(row, i);
			}
		}

		return false;
	}

	void printChessBoard() {
		cout << endl;

		for (int i = 0; i < this->numOfQueens + 2; i++) {
			for (int j = 0; j < this->numOfQueens + 2; j++) {
				if (i == 0 || j == 0 || i == (this->numOfQueens + 1) || j == (this->numOfQueens + 1)) {
					cout << "\xB1 ";
					continue;
				}

				switch (this->chessBoard[i - 1][j - 1]) {
					case this->OPEN:
						cout << "\xDB ";
					break;

					case this->OCCUPIED:
						cout << "\xB0 ";
					break;

					case this->STRESSED:
						cout << "\xDB ";
					break;
				}
			}

			cout << endl;
		}

		cout << endl;
	}

	void printNumOfSolutions() {
		cout << endl << "There are " << this->numOfSolutions << " possible solutions for " << this->numOfQueens << " queens on a chessboard of dimensions " << this->numOfQueens << "x" << this->numOfQueens << "." << endl;
	}

	~Magnus() {
		this->cleanChessBoard();
	}
};

int main () {
	Magnus carlsen = Magnus(4);

	carlsen.play(0, 0);
	carlsen.printNumOfSolutions();

	return 0;
}