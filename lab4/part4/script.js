const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// set canvas size to window size
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);


// utility functions
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomRGB() {
  // commas make it work everywhere
  return `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`;
}

// single Ball class with ALL methods
class Ball {
  constructor(x, y, velX, velY, color, size) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() {
    if (this.x + this.size >= width) {
      this.velX = -this.velX;
    }

    if (this.x - this.size <= 0) {
      this.velX = -this.velX;
    }

    if (this.y + this.size >= height) {
      this.velY = -this.velY;
    }

    if (this.y - this.size <= 0) {
      this.velY = -this.velY;
    }

    this.x += this.velX;
    this.y += this.velY;
  }

  collisionDetect() {
    for (const ball of balls) {
      if (!(this === ball) && ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.color = this.color = randomRGB();
        }
      }
    }
  }
}

// create balls
const balls = [];

while (balls.length < 25) {
  const size = random(10, 20);
  const ball = new Ball(
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomRGB(),
    size
  );

  balls.push(ball);
}
class Player {
  constructor(x, y, size = 20, speed = 15, color = "white") {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.color = color;
  }

  draw() {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }

  checkBounds() {
    if (this.x - this.size < 0) this.x = this.size;
    if (this.x + this.size > width) this.x = width - this.size;
    if (this.y - this.size < 0) this.y = this.size;
    if (this.y + this.size > height) this.y = height - this.size;
  }

  setControls() {
    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "a": // left
        case "ArrowLeft":
          this.x -= this.speed;
          break;
        case "d": // right
        case "ArrowRight":
          this.x += this.speed;
          break;
        case "w": // up
        case "ArrowUp":
          this.y -= this.speed;
          break;
        case "s": // down
        case "ArrowDown":
          this.y += this.speed;
          break;
      }
    });
  }

  // pop balls we touch
  collisionDetect() {
    for (const ball of balls) {
      if (ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.exists = false; // "pop" the ball
        }
      }
    }
  }
}

// make the player start in the middle
const player = new Player(width / 2, height / 2);
player.setControls();


// animation loop
function loop() {
  ctx.fillStyle = "rgb(0 0 0 / 25%)";
  ctx.fillRect(0, 0, width, height);

  for (const ball of balls) {
    ball.draw();
    ball.update();
    ball.collisionDetect();
  }
    // player
  player.draw();
  player.checkBounds();
  player.collisionDetect();

  requestAnimationFrame(loop);
}

loop();
