const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const botao = document.querySelector("#restart")
const score = document.querySelector(".score-value")
const finalScore = document.querySelector(".final-score > span")
let bestScore = document.querySelector("#bestscore")
const pause = document.querySelector(".pause")
const pausado = document.querySelector("#pause")
const start = document.querySelector("#start")
const menu = document.querySelector(".menu-screen")

const audiobck= new Audio('fundo.mp3')

const audiocomer = new Audio('som-jogo.mp3')

const size = 30

let temp = 150

let maior = 0

const inititalPosition = { x: 270, y: 240}

let snake = [inititalPosition]

const incrementScore = () => {
    score.innerText = +score.innerText + 10
    if(score.innerText == 50 || score.innerText == 100 || score.innerText == 150 || score.innerText == 250){
        temp -= 20
    }
}

const randomNumber = ( min, max) => {
    return Math.round(Math.random() * (max - min)  + min)
}

const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size)
    return Math.round(number / 30) * 30
}

const randomColor = () => {
    const red = randomNumber(0, 255)
    const green = randomNumber(0, 255)
    const blue = randomNumber(0, 255)

    return `rgb(${red}, ${green}, ${blue})`
}

const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
}
const food1 = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
}
const bonus = {
    x: randomPosition(),
    y: randomPosition(),
    color: "#f1af09"
}

let direction, loopID

const drawFood = () => {

    const {x, y, color} = food

    ctx.shadowColor = color
    ctx.shadowBlur = 50
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)
    ctx.shadowBlur = 0
}
const drawFood1 = () => {

    const {x, y, color} = food1

    ctx.shadowColor = color
    ctx.shadowBlur = 50
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)
    ctx.shadowBlur = 0
}

const drawBonus = () => {
    
    const {x, y, color} = bonus

    ctx.shadowColor = color
    ctx.shadowBlur = 20
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)
    ctx.shadowBlur = 0
}


const drawSnake = () => {
    let cor = randomColor()
    ctx.fillStyle = cor
    ctx.shadowColor = cor
    ctx.shadowBlur = 90

    snake.forEach((position, index) => {

        if(index == snake.length - 1){
            ctx.fillStyle = "white"
        }

        ctx.fillRect(position.x, position.y, size, size)
    })
}

const moveSnake = () =>{
    if(!direction) return

    const head = snake[snake.length - 1]

    if(direction == "right"){
        snake.push({x: head.x + size, y: head.y})
    }

    if(direction == "left"){
        snake.push({x: head.x - size, y: head.y})
    }

    if(direction == "down"){
        snake.push({x: head.x, y: head.y + size})
    }

    if(direction == "up"){
        snake.push({x: head.x, y: head.y - size})
    }

    snake.shift()

}

const drawGrid = () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = "#191919"

    for (let i = 30; i < canvas.width; i += 30){
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()
    }

    for (let n = 30; n < canvas.height; n += 30){
        ctx.beginPath()
        ctx.lineTo(0, n)
        ctx.lineTo(600, n)
        ctx.stroke()
    }
}

const checkEat = () => {
    const head = snake[snake.length - 1]

    if (head.x == food.x && head.y == food.y){
        snake.push(head)
        audiocomer.play()
        let x = randomPosition()
        let y = randomPosition()
        incrementScore()
        
        while (snake.find((position) => position.x == x && position.y == y)){
            x = randomPosition()
            y = randomPosition()
        }
        food.x = x
        food.y = y
        document.body.style.background = food.color
        food.color = randomColor()
    }
}
const checkEat1 = () => {
    const head = snake[snake.length - 1]

    if (head.x == food1.x && head.y == food1.y){
        snake.push(head)
        audiocomer.play()
        let x = randomPosition()
        let y = randomPosition()
        incrementScore()

        while (snake.find((position) => position.x == x && position.y == y || position.y == food.y && position.x == food.x)){
            x = randomPosition()
            y = randomPosition()
        }
        food1.x = x
        food1.y = y
        document.body.style.background = food.color
        food1.color = randomColor()
    } 
}
const checkBonus = () => {
    const head = snake[snake.length - 1]

    if (head.x == bonus.x && head.y == bonus.y){
        snake.shift(head)
        snake.shift(head)
        snake.shift(head)
        snake.shift(head)
        audiocomer.play()
        let x = randomPosition()
        let y = randomPosition()
        incrementScore()

        while (snake.find((position) => position.x == x && position.y == y || position.y == food.y && position.x == food.x)){
            x = randomPosition()
            y = randomPosition()
        }
        bonus.x = x
        bonus.y = y
        document.body.style.background = bonus.color
    } 
}

const checkColision = () => {
    const head = snake[snake.length - 1]
    const nackIndex = snake.length - 2
    const parede = canvas.width - size
    const wallCollison = head.x < 0 || head.x > parede || head.y < 0 || head.y > parede

    const selfColision = snake.find((position, index ) => {
        return position.x == head.x && position.y == head.y && index < nackIndex  
    })


    if (wallCollison || selfColision){
        gameOver()
    }
}

const gameOver = () => {
    direction = undefined
    menu.style.display = "flex"
    finalScore.innerText = score.innerText
    if (finalScore.innerText > maior){
        maior = finalScore.innerText
        bestScore.innerText = maior
    }
    canvas.style.filter = "blur(5px)"
    temp = 150
    drawBonus()
}

const gameLoop = () =>{
    clearInterval(loopID)
    ctx.clearRect(0, 0, 600, 600)
    drawGrid()
    moveSnake()
    drawFood()
    checkEat()
    drawSnake()
    checkColision()
    audiobck.play()
    if(score.innerText >= 100){
        drawFood1()
        checkEat1()
    }
    if(score.innerText >= 200){
        drawBonus()
        checkBonus()
        drawFood1()
        checkEat1()
    }
    loopID = setTimeout(() => {
        gameLoop()
    }, temp)
}

gameLoop()



document.addEventListener("keydown", ({ key}) => {

    if(key == "ArrowRight" && direction != "left"){
        direction = "right"
    }
    if(key == "ArrowLeft" && direction != "right"){
        direction = "left"
    }
    if(key == "ArrowUp" && direction != "down"){
        direction = "up"
    }
    if(key == "ArrowDown" && direction != "up"){
        direction = "down"
    }
})

botao.addEventListener("click", () => {
    score.innerText = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"
    snake = [inititalPosition]
})

function up(){
    if(direction != "down"){
      direction = "up"
    }
  }
  function down(){
    if(direction != "up"){
    direction = "down"
    }
  }
  function left(){
    if(direction != "right"){
    direction = "left"
    }
  }
  function right(){
    if(direction != "left"){
    direction = "right"
    }
  }

pausado.addEventListener("click", () => {
    direction = undefined
    pause.style.display = "flex"
    canvas.style.filter = "blur(5px)"
    document.addEventListener("keydown", ({ key}) => {

        if(key == "ArrowRight" && direction != "left"){
            direction = ""
        }
        if(key == "ArrowLeft" && direction != "right"){
            direction = ""
        }
        if(key == "ArrowUp" && direction != "down"){
            direction = ""
        }
        if(key == "ArrowDown" && direction != "up"){
            direction = ""
        }
    })
})
start.addEventListener("click", () => {
    direction = undefined
    pause.style.display = "none"
    canvas.style.filter = "none"
    document.addEventListener("keydown", ({ key}) => {

        if(key == "ArrowRight" && direction != "left"){
            direction = "right"
        }
        if(key == "ArrowLeft" && direction != "right"){
            direction = "left"
        }
        if(key == "ArrowUp" && direction != "down"){
            direction = "up"
        }
        if(key == "ArrowDown" && direction != "up"){
            direction = "down"
        }
    })
})
