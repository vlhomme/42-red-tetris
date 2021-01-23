import React, {useState, useEffect} from 'react'
import { connect } from 'react-redux'

const PIECES = [
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  [
    [ 1, 1],
    [ 1, 1],
  ],
  [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
]

// let emptyBoard = [];
// for (let i = 0; i < 20; i++) {
//   let array2 = [];
//   for (let j = 0; j < 10; j++) {
//     if (i <= 1 && j >= 4 && j < 6) {
//       array2.push(1)
//     } else {
//       array2.push(0);
//     }
//   }
//   emptyBoard.push(array2);
// }

const getEmptyBoard = () => {
  return Array.from(
    {length: 20}, () => Array(10).fill(0)
  );
}

const giveRandomPiece = () => {
  return PIECES[Math.floor(Math.random()*7)];
}

// make it 3 times to go in the other direction (shit but works)
const pivot = (matrix) => matrix[0].map((val, index) => matrix.map(row => row[index]).reverse())

const putPieceAtTheTop = (piece, array) => {
  // what is the middle ?
  // the middle is x = 3 y = 0 if the piece is 3 or 4 long and x = 2 y = 0 if the piece is 2 long
  const calculateOffsetToPutMiddle = (piece) => {
    return (piece[0].length > 2 ? 3 : 4);
  }
  const offset = calculateOffsetToPutMiddle(piece);

  // place the piece in the middle
  let placeSucceded = false;
  let counter = 0;
  let arrayOfCoordinate = [];
  for (let index = 0; index < piece.length; index++) {
    const element = piece[index];
    for (let jindex = 0; jindex < element.length; jindex++) {
      const value = element[jindex];
      if (value > 0) {
        // try to place if place succeeds 4 times then place succed
        if (array[index][jindex + offset] + value == 1) {
          counter++;
          arrayOfCoordinate.push([index, jindex + offset]);
          // array[index][jindex + offset] = 2;
        }
      }
    }
  }

  placeSucceded = counter == 4;

  if (!placeSucceded) {
    return array
  } else {
    let newArray = array.map((arr) =>  arr.slice());
    for (let index = 0; index < arrayOfCoordinate.length; index++) {
      const element = arrayOfCoordinate[index];
      newArray[element[0]][element[1]] = 2;
    }
    return newArray
  }
}

const pieceIsMoving = (array) => {
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    for (let jindex = 0; jindex < element.length; jindex++) {
      const jelement = element[jindex];
      if (jelement === 2) {
        return true;
      }
    }
  }
  return false;
}

const putPieceDown = (array) => {
  let placeSucceded = false;
  let counter = 0;
  let arrayOfCoordinate = [];
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    for (let jindex = 0; jindex < element.length; jindex++) {
      const value = element[jindex];
      if (value == 2 && index < (array.length - 1) && (array[index + 1][jindex] == 0 || array[index + 1][jindex] == 2)) {
        counter++;
        arrayOfCoordinate.push([index + 1, jindex]);
      }
    }
  }

  placeSucceded = counter == 4;
  let newArray = array.map((arr) =>  arr.slice());
  if (!placeSucceded){
    for (let index = 0; index < newArray.length; index++) {
      const element = newArray[index];
      for (let jindex = 0; jindex < element.length; jindex++) {
        const value = element[jindex];
        if (value == 2) {
          newArray[index][jindex] = 1;
        }
      }
    }
    return newArray;
  } else {
    for (let index = 0; index < newArray.length; index++) {
      const element = newArray[index];
      for (let jindex = 0; jindex < element.length; jindex++) {
        const value = element[jindex];
        if (value == 2) {
          newArray[index][jindex] = 0;
        }
      }
    }
    for (let index = 0; index < arrayOfCoordinate.length; index++) {
      const element = arrayOfCoordinate[index];
      newArray[element[0]][element[1]] = 2;
    }
    return newArray
  }
}

const movePieceSide = (direction, array) => {
  const chooseDirection = (direction, index) => {
    if (direction == 'right') {
      return index + 1
    } else if (direction == 'left') {
      return index - 1
    }
  }

  // check if move piece side is possible
  let placeSucceded = false;
  let counter = 0;
  let arrayOfCoordinate = [];
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    for (let jindex = 0; jindex < element.length; jindex++) {
      const value = element[jindex];
      if (value == 2 && (chooseDirection(direction, jindex)) < 10 && (element[chooseDirection(direction, jindex)] == 2 || element[chooseDirection(direction, jindex)] == 0)) {
        counter++;
        arrayOfCoordinate.push([index, chooseDirection(direction, jindex)]);
      }
    }
  }

  // move piece if it is possible
  placeSucceded = counter == 4;
  let newArray = array.map((arr) =>  arr.slice());
  if (!placeSucceded){
    return newArray;
  } else {
    // removes the previous moving one
    for (let index = 0; index < newArray.length; index++) {
      const element = newArray[index];
      for (let jindex = 0; jindex < element.length; jindex++) {
        const value = element[jindex];
        if (value == 2) {
          newArray[index][jindex] = 0;
        }
      }
    }
    // place the new moving one
    for (let index = 0; index < arrayOfCoordinate.length; index++) {
      const element = arrayOfCoordinate[index];
      newArray[element[0]][element[1]] = 2;
    }
    return newArray
  }
}

const rotatePiece = (direction, array, piece) => {
  // console.log(piece) 
  //1. on va spot le coin à partir duquel le carré commence
  // retour : coordine du point
  let transform = {x: 0, y: 0};
  let coordinates = {x: 0, y: 0};
  for (let index = 0; index < piece.length; index++) {
    const element = piece[index];
    for (let jindex = 0; jindex < element.length; jindex++) {
      const value = element[jindex];
      if (value == 1) {
        transform = {
          x: jindex,
          y: index
        }
        break;
      }
    }
  }
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    for (let jindex = 0; jindex < element.length; jindex++) {
      const value = element[jindex];
      if (value == 2){
        // apply transformation to find coordinate from first 2 find
        coordinates = {
          x: jindex - transform.x,
          y: index - transform.y
        }
      }
    }
  }

  //2. on tourne la pièce
  const newPiece = pivot(piece);

  //3. on essaie de remettre la pièce tournée en partant du coin où elle est
  let placeSucceded = false;
  let counter = 0;
  let arrayOfCoordinate = [];
  for (let index = 0; index < newPiece.length; index++) {
    const element = newPiece[index];
    for (let jindex = 0; jindex < element.length; jindex++) {
      const value = element[jindex];
      if (value == 1) {
        let valueToBeReplaced = array[coordinates.y + index][coordinates.x + jindex]
        // if value == 2 ça veux dire que c'est la piece qui bouge donc ok
        // is value == 0 ça veux dire que c'est du vide donc ok
        if (valueToBeReplaced == 2 || valueToBeReplaced == 0) {
          counter++;
          arrayOfCoordinate.push([index, jindex]);
        }
      }
    }
  }

  placeSucceded = counter == 4;
  //4. si ça marche on change le tableau sinon on change rien
  let newArray = array.map((arr) =>  arr.slice());
  if (!placeSucceded) {
    return {success: false, data: newArray};
  } else {
    // removes the previous moving one
    for (let index = 0; index < newArray.length; index++) {
      const element = newArray[index];
      for (let jindex = 0; jindex < element.length; jindex++) {
        const value = element[jindex];
        if (value == 2) {
          newArray[index][jindex] = 0;
        }
      }
    }

    // put the new moving one
    for (let index = 0; index < newPiece.length; index++) {
      const element = newPiece[index];
      for (let jindex = 0; jindex < element.length; jindex++) {
        const value = element[jindex];
        if (value == 1) {
          newArray[coordinates.y + index][coordinates.x + jindex] = 2;
        }
      }
    }

    return {success: true, data: newArray};
  }

}

const movePiece = (event, array, piece) => {
  // console.log(array)
  let newArray = array.map((arr) =>  arr.slice());
  let success = false;
  if (event && event.code && event.code == "ArrowRight") {
    newArray = movePieceSide('right', array);
    success = true;
  }
  else if (event && event.code && event.code == "ArrowLeft") {
    newArray = movePieceSide('left', array);
    success = true;
  }
  else if (event && event.code && event.code == "ArrowDown") {
    const result = rotatePiece('clockwise', array, piece);
    newArray = result.data;
    success = result.success;
  }
  else if (event && event.code && event.code == "KeyR") {
    const result = rotatePiece('clockwise', array, piece);
    newArray = result.data;
    success = result.success;
  }
  else if (event && event.code && event.code == "ArrowUp") {
    const result = rotatePiece('antiClockwise', array, piece);
    newArray = result.data;
    success = result.success;
  }

  return {success: success, data: newArray};
}

const INTERVAL = 300;

const App = ({message}) => {
  console.log(message);

  const [array, _setArray] = useState(getEmptyBoard());
  const [piece, _setPiece] = useState(giveRandomPiece());
  const [change, setChange] = useState(true);

  const arrayRef = React.useRef(array);
  const setArray = data => {
    arrayRef.current = data;
    _setArray(data);
  };
  const pieceRef = React.useRef(piece);
  const setPiece = data => {
    pieceRef.current = data;
    _setPiece(data);
  };

  // moving piece should be 2
  // static piece should be 1

  // at regular interval we should
  //    - either make the piece go down
  //    - or get a new piece

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      console.log('This will run every second!');
      setChange(i % 2 === 0)
      i++;
    }, INTERVAL);
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    // do we have a piece moving ?
    let newArray;
    if (pieceIsMoving(array)){
      // yes
      // can the piece move again?
      // yes
      // make it fall
      // no
      // create a new piece and place it moving at the top
      newArray = putPieceDown(array)
    } else {
      const newPiece = giveRandomPiece();
      setPiece(newPiece);
      newArray = putPieceAtTheTop(newPiece, array);
    }
    setArray(newArray);
  }, [change])
  

  const handleKeyDown = (event) => {
    const result = movePiece(event, arrayRef.current, pieceRef.current)
    setArray(result.data);
    if (result.success && (event.code == "ArrowUp" || event.code == "KeyR")) {
      setPiece(pivot(pieceRef.current))
    }
    // if (event && event.code && (event.code == "ArrowUp" || event.code == "ArrowDown")) {
    //   if (event.code == "ArrowUp") {
    //     setPiece(pivot(pieceRef))
    //   } else {
    //     setPiece(pivot(pivot(pivot(pieceRef))))
    //   }
    // }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div style={{boxShadow: "0px 0px 12px 1px #539df1", width: '420px', outline: "1px solid #b0c4ff" }}>
      {array.map((el, index) => {
        return (
          <div key={index} style={{display: "flex"}}>
            {el.map((element, jindex) => {
              // position x, y
              const position = `${jindex}, ${index}`
              if (element == 0){
              return(
                <div key={jindex} className={position} style={{height: '40px', width: '40px', boxShadow: "0px 0px 12px 1px #539df1", margin: "1px"}}></div>
              )} else {
              return (<div key={jindex} className={position} style={{height: '40px', width: '40px', boxShadow: "0px 0px 12px 1px #539df1", backgroundColor: "purple", margin: "1px"}}></div>) }
            })}
          </div>
        )
      })}
    </div>
  )
}

const mapStateToProps = (state) => {
  return state
}
export default connect(mapStateToProps, null)(App)


