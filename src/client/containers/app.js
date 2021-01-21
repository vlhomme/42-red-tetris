import React, {useState} from 'react'
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

let emptyBoard = [];
for (let i = 0; i < 20; i++) {
  let array2 = [];
  for (let j = 0; j < 10; j++) {
    if (i == 10) {
      array2.push(1)
    } else {
      array2.push(0);
    }
  }
  emptyBoard.push(array2);
}

const giveRandomPiece = () => {
  return PIECES[Math.floor(Math.random()*7)];
}

const tiltPiece = (matrix) => matrix[0].map((val, index) => matrix.map(row => row[index]).reverse())

const App = ({message}) => {
  console.log(message);

  // const [array, setArray] = useState(emptyBoard);
  const array = emptyBoard;
  
  // let piece1 = giveRandomPiece();
  // console.log("🚀 ~ file: app.js ~ line 74 ~ App ~ piece1", piece1)
  // piece1 = tiltPiece(piece1)
  // console.log("🚀 ~ file: app.js ~ line 74 ~ App ~ piece1tilted", piece1)
  // piece1 = tiltPiece(piece1)
  // console.log("🚀 ~ file: app.js ~ line 74 ~ App ~ piece1tilted", piece1)
  // piece1 = tiltPiece(piece1)
  // console.log("🚀 ~ file: app.js ~ line 74 ~ App ~ piece1tilted", piece1)
  
  return (
    <div>
      {array.map((el, index) => {
        return (
          <div style={{display: "flex"}}>
            {el.map((element, jindex) => {
              // position x, y
              const position = `${jindex}, ${index}`
              if (element == 0){
              return(
                <div className={position} style={{height: '40px', width: '40px', boxShadow: "0px 0px 12px 1px rgba(0,64,255,1)", margin: "1px"}}></div>
              )} else {
              return (<div className={position} style={{height: '40px', width: '40px', boxShadow: "0px 0px 12px 1px rgba(0,64,255,1)", backgroundColor: "red", margin: "1px"}}></div>) }
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


