import './style.css'
import { BLOCK_SIZE, BOARD_WIDTH, BOARD_HEIGHT, EVENT_MOVEMENTS } from './const'

// 1. Inicializar el CANVAS
const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d') 
const $score = document.querySelector('span')

let score = 0

canvas.width = BLOCK_SIZE *  BOARD_WIDTH
canvas.height = BLOCK_SIZE * BOARD_HEIGHT

context.scale(BLOCK_SIZE, BLOCK_SIZE)

// 3. Board
const board = createBoard(BOARD_WIDTH, BOARD_HEIGHT)
function createBoard (width, height) {
  return Array(height).fill().map(() => Array(width).fill(0))
}

// 4. Pieza Player
const piece = {
  position: {x: 5, y: 5},
  shape: [
    [1, 1],
    [1, 1]
  ]
}

// 6. Random Pieces
const PIECES = [
  [
    [1, 1],
    [1, 1]
  ],
   [
    [1, 1, 1, 1]
  ],
  [
    [0, 1, 0],
    [1, 1, 1]
  ],
  [
    [1, 1, 0],
    [0, 1, 1]
  ],
  [
    [1, 0],
    [0, 0],
    [1, 1]
  ],
  [
    [0, 1],
    [0, 1],
    [0, 1]
  ]
]


// 2. Game Loop - LA CLAVE
// function update() {
//  draw()
//  window.requestAnimationFrame(update)
// }

// 5. Auto Drop
let dropCounter = 0
let lastTime = 0

function update(time = 0) {
  const deltaTime = time - lastTime 
  lastTime = time 

  dropCounter += deltaTime

  if(dropCounter > 1000){
    piece.position.y++
    dropCounter = 0

    if(checkColision()){
      piece.position.y--
      solidifyPiece()
      removeRows()
    }
  }

  draw()
  window.requestAnimationFrame(update)
}


function draw() {
  context.fillStyle = '#000'
  context.fillRect(0, 0, canvas.width, canvas.height)

  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if(value === 1){
        context.fillStyle = 'yellow'
        context.fillRect(x, y, 1, 1)
      }
    })
  })

   piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if(value){
        context.fillStyle = 'red'
        context.fillRect(x + piece.position.x, y + piece.position.y, 1, 1)
      }
    })
  })

  document.querySelector('span').innerText = score
}

document.addEventListener('keydown', event => {
  if(event.key === EVENT_MOVEMENTS.LEFT) {
    piece.position.x--
    if(checkColision()){
      piece.position.x++
    }
  } 
  if(event.key === EVENT_MOVEMENTS.RIGHT) {
    piece.position.x++
    if(checkColision()){
      piece.position.x--
    }
  } 
  if(event.key === EVENT_MOVEMENTS.DOWN) {
    piece.position.y++
    if(checkColision()){
       piece.position.y--
       solidifyPiece()
       removeRows()
    }
  } 

  if(event.key === 'ArrowUp') {
    const rotated = []

    for (let i = 0; i < piece.shape[0].length; i++) {
      const row = []
      
      for (let j = piece.shape.length - 1; j >= 0; j--) {
      row.push(piece.shape[j][i])
    }

    rotated.push(row)
    }

    const previousShape = piece.shape
    piece.shape = rotated
    if(checkColision()){
      piece.shape = previousShape
    }
  }
})

function checkColision() {
  return piece.shape.find((row, y) => {
    return row.find((value, x) => {
      return (
        value !== 0 && 
        board[y + piece.position.y]?.[x + piece.position.x] !== 0
      )
    })
  })
}

function solidifyPiece() {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        board[y + piece.position.y][x + piece.position.x] = 1
      }
    })
  })
  

  // reset position
  piece.position.x = Math.floor(BOARD_WIDTH / 2 - 2)
  piece.position.y = 0
  // get random shape
  piece.shape = PIECES[Math.floor(Math.random() * PIECES.length)]
  // gameover
  if(checkColision()) {
    window.alert('Game over!! Sorry!')
    board.forEach((row) => row.fill(0))
  }

}

function removeRows() {
  const rowsToRemove = []

  board.forEach((row, y) => {
    if(row.every(value => value === 1)) {
      rowsToRemove.push(y)
    }
  })
  rowsToRemove.forEach(y => {
    board.splice(y, 1)
    const newRow = Array(BOARD_WIDTH).fill(0)
    board.unshift(newRow)
    score += 10
  })
}

const $section = document.querySelector('section')

$section.addEventListener('click', () => {
  update()

  $section.remove()
  const audio = new window.Audio('./Tetris.mp3')
  audio.volume = 0.7
  audio.play()
   
})

