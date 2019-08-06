var cells = [];
var wind;
var correct, lives;
var primeNum = [2, 3, 5, 7, 11, 13];
var score, bg;
function preload()
{
    soundFormats('mp3','wav');
    
    //load sounds here
    coinSound = loadSound('assets/coin-get.ogg');
    gameOver = loadSound('assets/game-fail.wav');
    win = loadSound('assets/win.wav');
}

function setup() {     
  createCanvas(800, 600);
    correct = 0; //correct and mistake answers are 0 when the game start 
    mistake = 0;
    // loading background images 
    bg = loadImage('assets/bg.jpg');
    // adding 15 random cells with slightly different colors  
    for(var i = 0; i < 15; i++){
        var cell = new Cell(7, 700);
        cell.number=i;
        cells.push(cell);
        cell.color = color(222, random(100, 200), 11);
       
    }
}

function draw() {
  background(bg);
  //  adding wind and friction to the cells
  for (var i=0; i<cells.length; i++){
    wind = p5.Vector.sub(cells[i].loc);
    wind.setMag(random(-0.8, 0.8));
    
    cells[i].applyForce(wind);
    var friction = cells[i].speed.copy();
    friction.mult(-1);
    friction.normalize();
    friction.mult(0.03);
    cells[i].applyForce(friction);
    cells[i].checkCollisions(i)
    cells[i].run();
  }
    //showing number of mistakes as a ellipse on the screen
    textSize(20);
    fill(0);
    text("Mistakes:", 605, 27);
    fill(245, 0, 0);
    for(var i = 0; i < mistake; i++){
        ellipse(700+20*i, 23, 16)
    }
    //showing number of mistakes as a ellipse on the screen
    
    textSize(20);
    fill(0);
    text("Correct:", 15, 27);
    fill(0, 255, 0)  
    for(var i = 0; i < correct; i++){
        ellipse(99+20*i, 23, 16)
    }
    // if correct or mistake answers are more than 5 game ends.
    if(correct > 5 || mistake > 5){
        // calculating the score as a percentage 
        var cal = 100/(correct + mistake);
        score = Math.floor(cal * correct); //change it to integer 
        fill(0);
        rect(0,0, 800, 600);
        fill(255);
        textSize(43);
        text("Your score is %" + score, 222, 400); // showing your score 
        //if the score is more than 50% you pass
        if(score >= 50){ 
            text("Congratulations you pass!", 222, 300);
            win.play();
        }
        //if the score is less than 50% you fail
         if(score < 50){
            text("Unfortunately you fail!", 222, 300);
             
        }
    }
}

function Cell(_m, _loc) {
  this.speed = createVector(random(-1,1), random(-1,1));
  this.loc = createVector(random(_loc), _loc / 2) || createVector(random(width), height / 2);
  this.acceleration = createVector(0, 0);
  this.mass = _m || 3;
  this.diam = this.mass * 10;
  this.number = 0;
  
  this.checkCollisions = function(id){
      for(var i = 0; i < cells.length; i++){
            if(id != i){
            var d = dist(cells[i].loc.x, cells[i].loc.y, this.loc.x, this.loc.y);

            if(d <= this.diam/2 + cells[i].diam/2){

                var force = p5.Vector.sub(cells[i].loc, this.loc);
                force.setMag(0.8);
                cells[i].applyForce(force);
            }
        }
    }
  }
  
  this.run = function() {
    this.draw();
    this.move();
    this.checkBorders();
   
  }

  this.draw = function() {
      
    this.diam = this.mass * 10;
    for(let i = 0; i < cells.length; i++){
        fill(this.color);
        noStroke();        
        ellipse(this.loc.x, this.loc.y, this.diam, this.diam);
        fill(255);
        textSize(19);
        text(this.number, this.loc.x, this.loc.y)
    }
  }

  this.move = function() {
    this.speed.add(this.acceleration);
    this.loc.add(this.speed);
    this.acceleration.mult(0);
  }

  this.checkBorders = function() {     
    if (this.loc.x > width-this.diam/2) {
      this.loc.x = width-this.diam/2;
      this.speed.x *= -1;
    } else if (this.loc.x < this.diam/2) {
      this.speed.x *= -1;
      this.loc.x = this.diam/2;
    }
    if (this.loc.y > height-this.diam/2) {
      this.speed.y *= -1;
      this.loc.y = height-this.diam/2;
    }
     else if (this.loc.y < this.diam/2) {
      this.speed.y *= -1;
      this.loc.y = this.diam/2;
    }
  }

  this.applyForce = function(f) {
    var adjustedForce = f.copy();
    adjustedForce.div(this.mass);
    this.acceleration.add(adjustedForce);
  }
}
function mouseClicked(){
    for(let cell of cells){
        var d =dist(mouseX, mouseY, cell.loc.x, cell.loc.y)
        // if we click on the prime number it changes to green and correct answer would be + 1
        if(d < 35){
            if(primeNum.includes(cell.number)){
                cell.color = color(0, 255, 0);
                coinSound.play();
                correct +=1;
                }
            
            else{
                // if we click on the not a prime number it changes to red and correct answer would be - 1     
                cell.color = color(255, 0, 0)
                gameOver.play();
                mistake += 1;
            }
        } 
    }
}
