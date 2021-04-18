var dog, sadDog, happyDog, database;
var numFood, foodStock;
var addingFood;
var foodObj;

var feed, lastFed, noFood;

var dateFunction, day, month, date, year, hour, minutes, timeText;

function preload() {
  sadDog = loadImage("Dog.png");
  happyDog = loadImage("happy dog.png");
}

function setup() {
  database = firebase.database();
  createCanvas(1000, 400);

  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  dog = createSprite(800, 200, 150, 150);
  dog.addImage(sadDog);
  dog.scale = 0.15;

  feed = createButton("Feed the Dog");
  feed.position(700, 95);
  feed.mousePressed(feedDog)

  addingFood = createButton("Add Food");
  addingFood.position(800, 95);
  addingFood.mousePressed(addFood);

  numFood = foodObj.getFoodStock();
}

function draw() {
  background(245, 132, 14);
  foodObj.display();

  //write code to read fedtime value from the database 
  database.ref('lastFed').on("value", function (data) {
    lastFed = data.val();
  })

  //write code to display text lastFed time here
  fill("black");
  textSize(15);
  text("Last fed" + lastFed, 300, 27);

  
  if(numFood === 0 && noFood === true) {
    push();
    fill("white");
    ellipse(785, 100, 150, 60);
    pop();
    line(786, 131, 768, 168);
    text("No more food!", 730, 104);
  }

  drawSprites();
  //console.log(lastFed);
}

//function to read food Stock
function readStock(data) {
  numFood = data.val();
  foodObj.updateFoodStock(numFood);
}


function feedDog() {
  dog.addImage(happyDog);

  //write code here to update food stock and last fed time
  if (numFood <= 0) {
    numFood *= 0;
    dog.addImage(sadDog);
    noFood = true;
  }
  else if (numFood > 0) {
    foodObj.deductFood();
    numFood -= 1;
  }
  database.ref('/').update({
    Food: numFood
  });

  dateFunction = Date();
  day = dateFunction.slice(0, 3);
  month = dateFunction.slice(4, 7);
  date = dateFunction.slice(8, 10);
  year = dateFunction.slice(11, 15);
  hour = dateFunction.slice(16, 18);
  minutes = dateFunction.slice(19, 21);

  if (hour === "00" || hour === "01" || hour === "02" || hour === "03" || hour === "04" || hour === "05" || hour === "06" || hour === "07" || hour === "08" || hour === "09" || hour === "10" || hour === "11") {
    lastFed = " at " + hour + ":" + minutes + " AM, on " + day + ", " + date + " " + month + ", " + year;
  }
  else if (hour === "12") {
    lastFed = " at " + hour + ":" + minutes + " PM, on " + day + ", " + date + " " + month + ", " + year;
  }
  else if (hour === "13" || hour === "14" || hour === "15" || hour === "16" || hour === "17" || hour === "18" || hour === "19" || hour === "20" || hour === "21" || hour === "22" || hour === "23") {
    hour -= 12
    lastFed = " at " + hour + ":" + minutes + " PM, on " + day + ", " + date + " " + month + ", " + year;
  }

  database.ref('/').update({
    lastFed: lastFed
  });
}


//function to add food in stock
function addFood() {
  numFood++;
  database.ref('/').update({
    Food: numFood
  });
}
