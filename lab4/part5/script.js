const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// Set canvas size to window size
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// Utility functions
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomRGB() {
  // Generate a random color string
  return `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`;
}

// Ball class with properties and methods
class Ball {
  constructor(x, y, velX, velY, color, size) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
    this.exists = true;  // New property: ball starts as "existing" (not popped)
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() {
    // Bounce off walls by inverting velocity when hitting edges
    if (this.x + this.size >= width || this.x - this.size <= 0) {
      this.velX = -this.velX;
    }
    if (this.y + this.size >= height || this.y - this.size <= 0) {
      this.velY = -this.velY;
    }
    // Move the ball by its velocity
    this.x += this.velX;
    this.y += this.velY;
  }

  collisionDetect() {
    // Change colors if this ball collides with another existing ball
    for (const otherBall of balls) {
      if (otherBall !== this && otherBall.exists) {
        const dx = this.x - otherBall.x;
        const dy = this.y - otherBall.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.size + otherBall.size) {
          // Collision detected: both balls change to a random color
          this.color = otherBall.color = randomRGB();
        }
      }
    }
  }
}

// Create an array of balls
const balls = [];
while (balls.length < 25) {
  const size = random(10, 20);
  const ball = new Ball(
    random(size, width - size),
    random(size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomRGB(),
    size
  );
  balls.push(ball);
}

// Player class (the controllable circle)
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
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();  // Draw as an outline (not filled in)
  }

  checkBounds() {
    // Prevent the player from going off the canvas
    if (this.x - this.size < 0) this.x = this.size;
    if (this.x + this.size > width) this.x = width - this.size;
    if (this.y - this.size < 0) this.y = this.size;
    if (this.y + this.size > height) this.y = height - this.size;
  }

  setControls() {
    // Keyboard controls for player movement (WASD or arrow keys)
    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "a":
        case "ArrowLeft":
          this.x -= this.speed;
          break;
        case "d":
        case "ArrowRight":
          this.x += this.speed;
          break;
        case "w":
        case "ArrowUp":
          this.y -= this.speed;
          break;
        case "s":
        case "ArrowDown":
          this.y += this.speed;
          break;
      }
    });
  }

  collisionDetect() {
    // Check for collision with any balls and "pop" them
    for (const ball of balls) {
      if (ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.size + ball.size) {
          ball.exists = false;  // The ball is popped (removed from game)
        }
      }
    }
  }
}

// Instantiate the player in the center of the screen
const player = new Player(width / 2, height / 2);
player.setControls();

// Animation loop to update the game frame-by-frame
function loop() {
  // Semi-transparent background to create motion trails effect
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);

  // Draw, update, and check collisions for each active ball
  for (const ball of balls) {
    if (ball.exists) {
      ball.draw();
      ball.update();
      ball.collisionDetect();
    }
  }

  // Draw and update the player (evil circle)
  player.draw();
  player.checkBounds();
  player.collisionDetect();

  requestAnimationFrame(loop);  // Keep the loop running
}

// Start the animation loop
loop();
