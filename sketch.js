var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;
var feed;


//create feed and lastFed variable here
var feedtime, lastfeed ;

function preload(){
sadDog=loadImage("happy dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //create feed the dog button here

  feed=createButton("Feed Dog");
  feed.position(700,95);
  feed.mousePressed(feeddog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  foodObj.display();

  //write code to read fedtime value from the database 
  
   feedtime = database.ref('FeedTime');
   feedtime.on("value",function(data){
     lastfeed = data.val();
     console.log(lastfeed);
   });
  
  
  
  //write code to display text lastFed time here
fill("black");
textSize(15);
if(lastfeed>=12){
text( "last feed: " + lastfeed%12 + "PM" , 600,95 )
}else if(lastfeed == 0) {
  text( "last feed: 12 AM "  , 600,95 )
}else {
  text( "last feed: " + lastfeed + "AM" , 600,95 )
}
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  console.log(foodS);
  foodObj.updateFoodStock(foodS);
}


function feeddog(){
  dog.addImage(happyDog);
  console.log("feed dog called ");

  //write code here to update food stock and last fed time
  var stockVal =  foodObj.getFoodStock();
  console.log(foodObj.getFoodStock());
  if(stockVal<=0){
    console.log("lowstock");
    foodObj.updateFoodStock(stockVal+1)
  } 
  else{
    console.log("adding to stock");
    foodObj.updateFoodStock(stockVal-1)
  }

  database.ref('/').update({
    'Food': foodObj.getFoodStock(),
    'FeedTime': hour()
  });

}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}


