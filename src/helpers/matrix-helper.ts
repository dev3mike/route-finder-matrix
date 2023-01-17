export function generateMatrix(m: number, n: number, numberOfNonTraversableCells: number) {
    const matrix: boolean[][] = [];
    for (let i = 0; i < m; i++) {
      matrix[i] = [];
      for (let j = 0; j < n; j++) {
        matrix[i][j] = true;
      }
    }
    
    // Add the non-traversable values to the matrix
    while (numberOfNonTraversableCells > 0) {
      const randomRow = Math.floor(Math.random() * m);
      const randomCol = Math.floor(Math.random() * n);
      if (matrix[randomRow][randomCol] !== false) {
        matrix[randomRow][randomCol] = false;
        numberOfNonTraversableCells--;
      }
    }
    return matrix;
}

export interface Coordinate {
    row: number;
    col: number;
}

export function findFastestRoute(matrix: boolean[][], source: Coordinate, destination: Coordinate): Coordinate[] {

    const matrixObject = {
        rows: matrix.length,
        cols: matrix[0].length,
        data: matrix
    }

    const queue = [source];
    const distances: number[][] = Array.from({ length: matrixObject.rows }, () => Array(matrixObject.cols).fill(Infinity));
    const parents: Coordinate[][] = Array.from({ length: matrixObject.rows }, () => Array(matrixObject.cols));
    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    distances[source.row][source.col] = 0;

    while (queue.length) {
      const current = queue.shift();
      if (current!.row === destination.row && current!.col === destination.col) {
        break;
      }
      for (const [row, col] of dirs) {
        const newRow = current!.row + row;
        const newCol = current!.col + col;
        if (newRow >= 0 && newRow < matrixObject.rows && newCol >= 0 && newCol < matrixObject.cols && matrixObject.data[newRow][newCol] && distances[newRow][newCol] === Infinity) {
          distances[newRow][newCol] = distances[current!.row][current!.col] + 1;
          parents[newRow][newCol] = current!;
          queue.push({ row: newRow, col: newCol });
        }
      }
    }
    if (distances[destination.row][destination.col] === Infinity) {
      return [];
    }
    const path = [];
    let current = destination;
    while (current.row !== source.row || current.col !== source.col) {
      path.unshift(current);
      current = parents[current.row][current.col];
    }
    path.unshift(source);
    return path;
}