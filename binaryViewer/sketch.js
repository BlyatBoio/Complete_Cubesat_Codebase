let dataOrder = [];
let displayBlocks = [];
let clearButton;
let loadFileButton;
let loadClearButton;
let loadNoClearButton;
let chooseFileInp;
let inLoadMenu = false;
let clearWhenLoad = false;
let loadFiles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER);
  clearButton = createButton("Clear");
  clearButton.position(20, 20);
  clearButton.size(100, 25);
  clearButton.mousePressed(clearScreen);
 
  loadFileButton = createButton("Load File");
  loadFileButton.position(130, 20);
  loadFileButton.size(100, 25);
  loadFileButton.mousePressed(openLoadMenu);

  loadClearButton = createButton("Clear And Load");
  loadClearButton.position(width/2-150, height/2-25);
  loadClearButton.size(100, 50);
  loadClearButton.mousePressed(toggleClearLoad, true);
  loadClearButton.hide();
  
  loadNoClearButton = createButton("Load Without Clearing");
  loadNoClearButton.position(width/2+50, height/2-25);
  loadNoClearButton.size(100, 50);
  loadNoClearButton.mousePressed(toggleClearLoad, false);
  loadNoClearButton.hide();
  
  chooseFileInp = createFileInput(loadFromInp);
  chooseFileInp.position(width/2-50, height/2-25);
  chooseFileInp.size(100, 50);
  chooseFileInp.hide(100, 50);
}

function draw() {
  background(0, 10, 50);
  for(let i = 0; i < displayBlocks.length; i++){
    displayBlocks[i].drawSelf();
  }
}

function clearScreen(){
  displayBlocks = [];
  if(inLoadMenu == true) loadMenu();
}

function loadMenu(){
  background(50, 50, 50);
}

function openLoadMenu(){
  inLoadMenu = true;
  loadClearButton.show();
  loadNoClearButton.show();
}

function toggleClearLoad(state){
  if(state == undefined){
    clearWhenLoad = !clearWhenLoad;
    return;
  }
  clearWhenLoad = state;
  loadClearButton.hide();
  loadNoClearButton.hide();
  chooseFileInp.show();
}

function loadFromInp(file){
  loadFiles = file;
  if(clearWhenLoad == true) displayBlocks = [];
  chooseFileInp.hide();
  loadDataAsDisplay(file);
}

function loadDataAsDisplay(file){
  let x = 0;
  let y = 0;
  //for(let i2 = 0; i2 < files.length; i2++){
    let decodeData = decodeFile(file);
    for(let i = 0; i < decodeData.length; i++){
      x += 75;
      if(x + 75 > width){
        x = 0;
        y += 125
      }
      new dataDisplayBlock(x, y, 75, 125, decodeData[i].name, decodeData[i].getDisplayString());
    }
  //}
}

class dataDisplayBlock{
  constructor(x, y, w, h, title, displayData){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.title = title;
    this.displayData = displayData;
    this.id = displayBlocks.length;
    displayBlocks.push(this);
  }
  drawSelf(){
    fill(30);
    rect(this.x, this.y, this.w, this.h);
    fill(50, 200, 0);
    textSize(20);
    text(this.title, this.x + this.w/2, this.y + 10);
    textSize(15);
    text(this.displayData, this.x + this.w/2, this.y + this.h/2);
  }
  moveBy(x, y){
    this.x += x;
    this.y += y;
  }
  scaleBy(x, y, lockTo){
    switch(lockTo){
      case "topLeft":
        this.w += x;
        this.h += y;
        break;
      case "topRight":
        this.x -= x;
        this.w += x;
        this.y += y;
        break;
      case "botLeft":
        this.w += x;
        this.y -= y;
        this.h += y;
        break;
      case "botRight":
        this.x -= x;
        this.y -= y;
        this.w += x;
        this.h += y;
        break;
    }
  }
}

class objectData{
  constructor(name, dataNames, data){
    this.name = name;
    this.dataNames = dataNames;
    this.data = data;
  }
  getDisplayString(){
    let str = "";
    for(let i = 0; i < this.data.length; i++){
      str += this.dataNames[i] + ": " + this.data[i]
    }
    return str;
  }
}

function decodeFile(file){
  let data = [];
  for(let i = 0; i < file.data.length; i+=4){
    data.push(new objectData(dataNames[round(i/4)], ["a", "b", "c"], file.data.slice(i, i+4)));
  }
  return data;
}