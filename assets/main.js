const rulesBtn = document.getElementById('rules-btn');
const close = document.getElementById('close');
const rules = document.getElementById('rules');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

/*
$(document).ready(function() {
    $(".rules-btn").click(function() {
        $('.rules.show').toggleClass("active")

    })
})
*/
//create ball props

let score = 0;

const brickRow = 9;
const brickColoum = 5;


//create brick info

const brickInfo = {
    w: 70,
    h: 20,
    padding: 10,
    offsetX: 45,
    offsetY: 60,
    visible: true

}

//create bricks

const bricks = [];
for (let i = 0; i < brickRow; i++) {
    bricks[i] = [];
    for(let j = 0; j < brickColoum; j++) {
        const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
        const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
        bricks[i][j] = {x, y , ...brickInfo}
    }
    
}

//console.log(bricks)



//create ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 10,
    speed: 4,
    dx: 4,
    dy: -4
}

//create paddle props
const paddle = {
    x: canvas.width/2 - 40,
    y: canvas.height - 20,
    w: 80,
    h: 10,
    speed: 8,
    dx: 0

}

//create ball
function createBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = 'coral'
    ctx.fill();
    ctx.closePath()
}
//create paddle 
function createPaddle(){
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h)
    ctx.fillStyle = 'coral'
    ctx.fill();
    ctx.closePath()
};
//create score 
function createScore() {
    ctx.font = '20px arial';
    ctx.fillStyle =  '#fff'
    ctx.fillText(`score:${score} ` ,canvas.width - 100, 30)
}

//build bricks
function drawBricks() {

bricks.forEach(column => {
    column.forEach(element => {
        ctx.beginPath();
        ctx.rect(element.x, element.y, element.w, element.h )
        ctx.fillStyle = element.visible ? 'coral' : 'transparent';
        ctx.fill();
        ctx.closePath();
    })

})

}

function draw() {

    ctx.clearRect(0,0, canvas.width, canvas.height)


createBall()
createPaddle()
createScore()
drawBricks()
}

//move paddle
function movePaddle() {

    paddle.x += paddle.dx;

    if(paddle.x + paddle.w > canvas.width  ) {
        paddle.x = canvas.width - paddle.w;
    }

    if(paddle.x < 0 ) {
        paddle.x = 0
    }

}

//move ball
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    //wall collinson(right/left)
    if(ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
        ball.dx *=  -1;

    }

    //wall collinson(top/bottom)
    if(ball.y + ball.size > canvas.height || ball.y - ball.size < 0){
        ball.dy *= -1
    }

    if(ball.x - ball.size > paddle.x && 
        ball.x + ball.size < paddle.x + paddle.w &&
        ball.y + ball.size > paddle.y) {
            ball.dy = -ball.speed
        }

        //briks collison

        bricks.forEach(column => {
            column.forEach(brick => {
                if(brick.visible) {
                    if(
                        ball.x - ball.size > brick.x && //left brick check
                        ball.x + ball.size < brick.x + brick.w &&//right side brick check
                        ball.y + ball.size > brick.y &&
                        ball.y - ball.size < brick.y + brick.h//top side brick check

                     ) {
                         ball.dy *= -1;
                         brick.visible = false;
                         
                         increaseScore()
                     }
                }
            })
        })

        //lose the ball
        if(ball.y + ball.size > canvas.height) {
            showAllBricks();
            score = 0;
        }
 
 
     }
    //console.log(ball.x, ball.y)

    //score details 
    function increaseScore() {
        score++;

        if(score % (brickRow * brickRow) === 0 ){
            showAllBricks();
        }
    }

    function showAllBricks() {
        bricks.forEach(column => {
            column.forEach(brick => {
                brick.visible = true;



            })
        })
    }
//update canvas animation everything
function update() {
    movePaddle() ;
    moveBall()

    draw()

    requestAnimationFrame(update)


}
update();

function keyUp(e) {
    if(e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'Left' || e.key === 'ArrowLeft' ){
        paddle.dx = 0;


    }

  //  console.log(e.key)
}

function keyDown(e) {
    if(e.key === 'Right' || e.key === 'ArrowRight') {
        paddle.dx = paddle.speed;
    } else if(e.key === 'Left' || e.key === 'ArrowLeft'){
        paddle.dx = -paddle.speed;

    }



   // console.log(e.key)
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp)

rulesBtn.addEventListener('click', () => {
    rules.classList.add('show')
})
close.addEventListener('click', () => {
    rules.classList.remove('show')
})