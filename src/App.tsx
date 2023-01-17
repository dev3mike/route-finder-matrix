import './App.css';

import { Fragment, useMemo, useState } from 'react';
import { useScreen } from 'usehooks-ts';

import { Coordinate, findFastestRoute, generateMatrix } from './helpers/matrix-helper';

function Dot(props: {isTraversable: boolean, isSelected: boolean, isRoute: boolean, onClick: () => void}){
  return <div className={'dot ' + (props.isTraversable ? 'traversable' : 'nontraversable') + (props.isRoute ? ' route' : '') + (props.isSelected ? ' active' : '')} onClick={props.onClick}><span></span></div>
}

function App() {
  const windowSize = useScreen();
  const [startPosition, setStartPosition] = useState<Coordinate | null>(null);
  const [endPosition, setEndPosition] = useState<Coordinate | null>(null);
  const [route, setRoute] = useState<Coordinate[]>([]);

  const defaultM = 70;
  const defaultN = 50;
  const cellSize = 30;

  const m = Math.floor((windowSize?.height ?? defaultM)/cellSize);
  const n = Math.floor((windowSize?.width ?? defaultN)/cellSize);
  
  const numberOfNonTraversableItems = n * 2;

  const matrix : boolean[][] = useMemo(() => generateMatrix(m, n, numberOfNonTraversableItems), []);

  function handleOnClick(row: number, col: number){
    if(startPosition == null)
      setStartPosition({row, col});
    else if(endPosition == null)
      {
        setEndPosition({row, col});

        // Calculate fastest route
        const fastestRoute = findFastestRoute(matrix, startPosition, {row, col});
        setRoute(fastestRoute);
      }
    else
      {
        // Reset
        setEndPosition(null);
        setRoute([]);

        setStartPosition({row, col});
      }
  }

  function isSelected(row: number, col: number){
    if(
        (startPosition?.col == col && startPosition?.row == row) ||
        (endPosition?.col == col && endPosition?.row == row)
      )
      return true;

    return false;
  }

  return <Fragment>

    {matrix.map((row, rowIndex) => <div key={rowIndex} className='row'>
        {row.map((isTraversable, colIndex) => <Dot key={rowIndex+'-'+colIndex} isSelected={isSelected(rowIndex, colIndex)} isTraversable={isTraversable} isRoute={route.find(item => item.col == colIndex && item.row == rowIndex) ? true : false} onClick={() => isTraversable && handleOnClick(rowIndex, colIndex)} />)}
    </div>)}

  </Fragment>
}

export default App
