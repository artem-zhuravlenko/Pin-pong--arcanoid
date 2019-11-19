// "use strict"
let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");

canvas.width = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;

canvas.height = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;

let player = {
  x: canvas.width / 2 - 100/2,
  y: canvas.height - 40,
  width: 100,
  height: 10,
  color: "#505050",
},

ball = {
  x: player.x + player.width / 2,
  y: player.y - 15,
  radius: 15,
  color: "#a04040",
  attached: true,
  type: "Normal",
  speedX: 4,
  speedY: 4            
},

brick = {
  row: 5,
  col: 3,
  H_distance: 30,
  V_distance: 20,
  width: (canvas.width - 30 * 6) / 5,
  height: 40,
  color: "#404040",
  text: 15,

  bricks: [],

  fillArray(){
    for(let i = 0; i < brick.row; i++){
      brick.bricks[i] = [];
      for(let j = 0; j < brick.col; j++){
        brick.bricks[i][j] = {x: 0, y: 0, visable: false,};
      }
    }
  },

  fillCoordinats(brick){
    for(let i = 0; i < brick.row; i++){
      for(let j = 0; j < brick.col; j++){
        brick.bricks[i][j].x = brick.H_distance + (brick.width  + brick.H_distance) * i;
        brick.bricks[i][j].y = brick.V_distance + (brick.height + brick.V_distance) * j;
        brick.bricks[i][j].visable = true;
      }
    }
    // brick.bricks[1][1].visable = false;
  }
}

draw = {
  rect (x, y, width, height, color){
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
    ctx.fill();
  },

  circle(x, y, radius, color){
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x, y, radius, 0, 2*Math.PI, true);
    ctx.fill(); 
  },

  field (brick){
    for(let i = 0; i < brick.row; i++){
      for(let j = 0; j < brick.col; j++){
        if(brick.bricks[i][j].visable == true){
          draw.rect(brick.bricks[i][j].x, brick.bricks[i][j].y, brick.width, brick.height, brick.color);
        }
      }
    }
  },
};


move = {
  left: false,
  right: false,

  player:  function(event) {


    let keyState = (event.type == "keydown") ? true : false;



    switch(event.keyCode){
      case 32:
      case 38:
        ball.attached = false;
        break;
      case 37:
        move.left = keyState;
        // alert("Hi");
        break;
        case 39: 
        // alert("Hellow");
        move.right = keyState;
        break;
        break;  
    }
  },
      
  attachedOrNot(player, ball){
    if(ball.attached == true){
      ball.x = player.x + player.width / 2;
      ball.y = player.y - 15;
    }else{
      ball.x += ball.speedX;
      ball.y -= ball.speedY;
    }
  },
};

collide = {
  signChange(ball, n){
    if(n == 1){
      ball.speedX *= -1;
    }else{
      ball.speedY *= -1;
    }
  },
  
  collideRight(ball){
    if(ball.x + ball.radius >= canvas.width){
      collide.signChange(ball, 1);
    }
  },

  collideTop (ball){
    if(ball.y - ball.radius <= 0){
      collide.signChange(ball, 2);
    }
  },

  collideLeft(ball){
    if(ball.x - ball.radius <= 0){
      collide.signChange(ball, 1);
    }
  },

  collidePlayer(ball, player){
    if(player.x < ball.x && player.x + player.width > ball.x 
      && player.y <  ball.y + ball.radius
      && player.y + player.height > ball.y + ball.radius){
        collide.signChange(ball, 2);
    }
  },

  collideBrick(ball, brick){
    let x, y;
    x = Math.floor((ball.x - brick.H_distance) / (brick.H_distance + brick.width ));
    y = Math.floor((ball.y - brick.V_distance) / (brick.V_distance + brick.height)); 
    
    
    if(y <= 2 && y >= 0 && x <= 4 && x >= 0){
      if(brick.bricks[x][y].visable){
        brick.bricks[x][y].visable = false;
        brick.text -= 1;
      }
    }
  },

  borderPlayer(brick){
    if(player.x < 0){
      player.x = 0;
    }
    if(player.x + player.width > canvas.width){
      player.x = canvas.width - player.width;
    }
  },

  collide(ball, brick, player){
    // console.log("Hi");
    collide.collideRight(ball);
    collide.collideTop(ball);
    collide.collideLeft(ball);
    
    collide.collideBrick(ball, brick);
    collide.borderPlayer(brick);
    utility.gameover(ball);
    utility.win(brick);

    collide.collidePlayer(ball, player);
  },
}

utility = {
  textWidth(phrase, fontsize){
    let ml = 0.2645833333333;
    phrase += '';
    return phrase.split('').length*fontsize*ml;
   },

   gameover(ball){
    if(ball.y - ball.radius > canvas.height){
      brick.text = "Game Over!"
      utility.message(brick.text);
      ball.speedX = 0;
      ball.speedY = 0;
      setTimeout(()=>{utility.reset(brick)}, 4000);
    }
  },

  win(brick){ 
    if(brick.text == 0){
      brick.text = "You Win!";
      utility.message(brick.text);
      ball.speedX = 0;
      ball.speedY = 0;
      setTimeout(()=>{utility.reset(brick)}, 4000);  
    }
  }, 
  
  message(num){
    ctx.fillStyle = "#c5c5c5";
    ctx.beginPath();
    if(isNaN(num)){
      ctx.font = `${canvas.width / num.length}px Aerial`;
      ctx.fillText(num, canvas.width / 2 - utility.textWidth(num, canvas.width / num.length), canvas.height / 2)
    }else{
      ctx.font = "100px Aerial";
      toString(num);
      ctx.fillText(('0'+ num).slice(-2), canvas.width / 2 - utility.textWidth(num, 100), canvas.height / 2 - 50);
    }
  },
  
  reset(){
    brick.fillCoordinats(brick);
    player.x = canvas.width / 2 - 100/2;
    player.y = canvas.height - 40;
    ball.x = player.x + player.width / 2;
    ball.y = player.y - ball.radius;
    ball.attached = true;
    brick.text = 15;
    ball.speedX = 4;
    ball.speedY = -4;
  },
}

brick.fillArray();  
brick.fillCoordinats(brick);

function loop(){

  
  if(move.right) {
    player.x += 4;
  }
  if(move.left){
    player.x -= 4;
  }
  //Canvas
  draw.rect(0, 0, canvas.width, canvas.height, "#e0e0e0");
  //Player
  draw.rect(player.x, player.y, player.width, player.height, player.color);
  //Message
  utility.message(brick.text);
  //Ball
  draw.circle(ball.x, ball.y, ball.radius, ball.color);
  //Bricks
  draw.field(brick);
  
  
  move.attachedOrNot(player, ball);
  
  collide.collide(ball, brick, player);


  window.requestAnimationFrame(loop);
}

// window.addEventListener("mousedown", move.player);
window.addEventListener("keydown", move.player);
window.addEventListener("keyup", move.player);
window.requestAnimationFrame(loop);


//widow.innerWith