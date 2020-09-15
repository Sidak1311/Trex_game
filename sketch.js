var trex, trex_running, trex_collided, gameOver, restart;
var ground, invisibleGround, groundImage, overImage, buttonImage;
var cloud, cloud_img
var obstacle, obs_img1, obs_img2,obs_img3,obs_img4,obs_img5,obs_img6
var cloud_gr, obs_gr
var score, gameState, dieSound, checkpointSound, jumpSound, hi;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  cloud_img = loadImage("cloud.png");
  obs_img1 = loadImage("obstacle1.png");
  obs_img2 = loadImage("obstacle2.png");
  obs_img3 = loadImage("obstacle3.png");
  obs_img4 = loadImage("obstacle4.png");
  obs_img5 = loadImage("obstacle5.png");
  obs_img6 = loadImage("obstacle6.png");
  overImage = loadImage("gameOver.png");
  buttonImg = loadImage("restart.png");
  dieSound = loadSound("die.mp3")
  checkpointSound = loadSound("checkPoint.mp3");
  jumpSound = loadSound("jump.mp3");
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("lol", trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -6;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  gameOver = createSprite(300,100);
  gameOver.addImage("overImage", overImage)
  gameOver.visible = false;
  gameOver.scale = 0.6;
  
  restart = createSprite(300,130);
  restart.addImage("restartImage", buttonImg);
  restart.visible = false;
  restart.scale = 0.6;
  
  cloud_gr = new Group();
  obs_gr = new Group();
  
  score = 0
  hi = 0
  gameState = "play"
}

function draw() {
  //console.log(trex.y);
  background(255);
  text("Score: "+score,500,50);
  text("High: "+hi, 400,50);
  trex.collide(invisibleGround);
  if(gameState === "play"){
    if(keyDown("space") && trex.y >= 160) {
      trex.velocityY = -13;
      jumpSound.play();
    }
    trex.velocityY = trex.velocityY + 0.8
    ground.velocityX = -(6 + 3*score/100);
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    score = score+1
    spawnClouds();
    spawnObstacles();
    if(score % 100 === 0){
       checkpointSound.play(); 
    }
    if(obs_gr.isTouching(trex)){
       gameState = "end" 
        dieSound.play();
    }
  }else if(gameState === "end"){
    ground.velocityX = 0;
    trex.changeAnimation("lol");
    trex.velocityY = 0
    obs_gr.setVelocityXEach(0);
    cloud_gr.setVelocityXEach(0);
    obs_gr.setLifetimeEach(-9999999999999999999999);
    cloud_gr.setLifetimeEach(-999999999999999999);
    restart.visible = true;
    gameOver.visible = true;
    if(mousePressedOver(restart)){
      reset();
    }
  }

    


    
    //console.log(getFrameRate());
    

    drawSprites();
  
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloud_img);
    cloud.scale = 0.5;
    cloud.velocityX = -(3 + 3*score/100);
    cloud_gr.add(cloud);
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -(6 + 3*score/100);
    obs_gr.add(obstacle);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1: obstacle.addImage(obs_img1);
      break;
      case 2: obstacle.addImage(obs_img2);
      break;
      case 3: obstacle.addImage(obs_img3);
      break;
      case 4: obstacle.addImage(obs_img4);
      break;
      case 5: obstacle.addImage(obs_img5);
      break;
      case 6: obstacle.addImage(obs_img6);
      break;
      default: break; 
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 100;
  }
}

function reset(){
  gameState = "play";
  
  gameOver.visible = false;
  restart.visible = false;
  
  obs_gr.destroyEach();
  cloud_gr.destroyEach();
  
  trex.changeAnimation("running");
  
  if(score > hi){
   hi = score; 
  }
  score = 0;
}