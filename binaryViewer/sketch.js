let infoWindows = [];
let selectedWindowID = 0;
let graphColors;
let windowIsMoved = false;
let hasSelected = false

function setup()
{
  createCanvas(windowWidth, windowHeight);
  new infoWindow(100, 100, 200, 200, "Graph", "TEST DISPLAY", [randomSet(0, 100, 10), randomSet(0, 100, 10), randomSet(0, 100, 10)]);
  new infoWindow(400, 100, 200, 200, "Graph", "TEST DISPLAY", [randomSet(0, 100, 10), randomSet(0, 100, 10), randomSet(0, 100, 10)])
  new infoWindow(700, 100, 200, 200, "Graph", "TEST DISPLAY", [randomSet(0, 100, 10), randomSet(0, 100, 10), randomSet(0, 100, 10)])
  new infoWindow(100, 400, 200, 200, "Graph", "TEST DISPLAY", [randomSet(0, 100, 10), randomSet(0, 100, 10), randomSet(0, 100, 10)])
  graphColors = [color(200, 0, 0), color(0, 200, 0), color(0, 0, 200), color(0), color(100)];
}

function draw()
{
  background(0, 10, 50);
  for (let i = infoWindows.length-1; i >= 0; i--)
  {
    infoWindows[i].drawSelf();
  }

  for (let i = 0; i < infoWindows.length; i++)
  {
    infoWindows[i].checkSelect();
  }

  infoWindows[selectedWindowID].selectedInteractions();
  hasSelected = false;
}

function randomSet(min, max, leg)
{
  let arr = [];
  for (let i = 0; i < leg; i++)
  {
    arr.push(random(min, max));
  }
  return new dataSet(arr);
}

function getLockPosition(x, y, w, h, id, direction){
  let hasFoundLocation = false;

  // start with an offset from each given side of 0
  let checkX = 0;
  let checkY = 0;
  let totalCols = 0;

  // Depending on direction, align to a given position
  switch(direction){
    case "Left":
      // until checkX is off of the screen or not coliding with another infoWindow, apply an offset proportional to the width of the coliding
      while(hasFoundLocation == false){
        // ensure that no collisions occur
        totalCols = 0;
        // itterate over all windows to check for collisions
        for(let i = 0; i < infoWindows.length; i++){

          // collision check
          if(infoWindows[i].id != id && collc(checkX, y, w, h, infoWindows[i].x, infoWindows[i].y, infoWindows[i].w, infoWindows[i].h) == true){
            // apply an offset such that it aligns to the left of a colliding window
            let d = dist(x, 0, infoWindows[i].x + infoWindows[i].w, 0)
            checkX += d;
            totalCols ++;
            if(d < 1) return x + 1;
          }
        }
        // update "escape" variable
        if(totalCols == 0) {hasFoundLocation = true; break;}
        if(checkX > width) return x; // if it can not align to be on the screen, it simply wont change position
      }
      return checkX;
    case "Right":
      checkX = width - w;
      // until checkX is off of the screen or not coliding with another infoWindow, apply an offset proportional to the width of the coliding
      while(hasFoundLocation == false){
        // ensure that no collisions occur
        totalCols = 0;

        // itterate over all windows to check for collisions
        for(let i = 0; i < infoWindows.length; i++){
          
          // collision check
          if(infoWindows[i].id != id && collc(checkX, y, w, h, infoWindows[i].x, infoWindows[i].y, infoWindows[i].w, infoWindows[i].h) == true){
            // apply an offset such that it aligns to the left of a colliding window
            let d = dist(x + w, 0, infoWindows[i].x, 0);
            checkX -= d;
            totalCols ++;
            if(d < 1) return x - 1;
          }
        }
        // update "escape" variable
        if(totalCols == 0) {hasFoundLocation = true; break;}
        if(checkX < -w) return x; // if it can not align to be on the screen, it simply wont change position
      }
      return checkX;
    case "Up":
      // until checkX is off of the screen or not coliding with another infoWindow, apply an offset proportional to the width of the coliding
      while(hasFoundLocation == false){
        // ensure that no collisions occur
        totalCols = 0;
        // itterate over all windows to check for collisions
        for(let i = 0; i < infoWindows.length; i++){

          // collision check
          if(infoWindows[i].id != id && collc(x, checkY, w, h, infoWindows[i].x, infoWindows[i].y, infoWindows[i].w, infoWindows[i].h) == true){
            // apply an offset such that it aligns to the left of a colliding window
            let d = dist(y, 0, infoWindows[i].y + infoWindows[i].h, 0)
            checkY += d;
            totalCols ++;
            if(d < 1) return y + 1;
          }
        }
        // update "escape" variable
        if(totalCols == 0) {hasFoundLocation = true; break;}
        if(checkY > height) return y; // if it can not align to be on the screen, it simply wont change position
      }
      return checkY;
    case "Down":
      checkY = height - h;
      // until checkX is off of the screen or not coliding with another infoWindow, apply an offset proportional to the width of the coliding
      while(hasFoundLocation == false){
        // ensure that no collisions occur
        totalCols = 0;

        // itterate over all windows to check for collisions
        for(let i = 0; i < infoWindows.length; i++){
          
          // collision check
          if(infoWindows[i].id != id && collc(x, checkY, w, h, infoWindows[i].x, infoWindows[i].y, infoWindows[i].w, infoWindows[i].h) == true){
            // apply an offset such that it aligns to the left of a colliding window
            let d = dist(y + h, 0, infoWindows[i].y, 0);
            checkY -= d;
            totalCols ++;
            if(d < 1) return y - 1;
          }
        }
        // update "escape" variable
        if(totalCols == 0) {hasFoundLocation = true; break;}
        if(checkY < -h) return y; // if it can not align to be on the screen, it simply wont change position
      }
      return checkY;
  }
} 

class infoWindow
{
  constructor(x, y, w, h, type, title, data)
  {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.type = type;
    this.title = title;
    this.data = data; // array of data set objects

    this.minValue = 100000;
    this.maxValue = -100000;
    this.maxLength = -100000;
    for (let i = 0; i < this.data.length; i++)
    {
      if (this.data[i].minValue < this.minValue) this.minValue = this.data[i].minValue;
      if (this.data[i].maxValue > this.maxValue) this.maxValue = this.data[i].maxValue;
      if (this.data[i].maxLength > this.maxLength) this.maxLength = this.data[i].maxLength;
    }

    this.closeButton = createButton("X");
    this.closeButton.position(this.x + this.w - 30, this.y + 10);
    this.closeButton.size(this.w / 10, this.h / 10);
    this.cbW = this.w/10;
    this.cbh = this.h/10;
    this.frame1 = true;
    this.closeButton.mousePressed(this.close());

    this.id = infoWindows.length;
    infoWindows.push(this);
  }
  drawSelf()
  {
    this.frame1 = false;
    fill(0, 5, 0);
    stroke(200);
    strokeWeight(5);
    rect(this.x, this.y, this.w, this.h);
    stroke(0);
    strokeWeight(1);
    fill(200);
    textSize(20);
    textAlign(CENTER);
    textWrap(WORD)
    text(this.title, this.x, this.y + 10, this.w);

    this.closeButton.position(this.x + this.w - 30, this.y + 10);
    let totalCols = 0;
    for(let i = 0; i < this.id; i++){
      if(infoWindows[i].id != this.id && collc(this.x + this.w - 30, this.y + 10, this.cbW, this.cbh, infoWindows[i].x, infoWindows[i].y, infoWindows[i].w, infoWindows[i].h) == true){
        totalCols ++;
        this.closeButton.hide();
        break;
      }
    }
    if(totalCols == 0) this.closeButton.show();

    switch(this.type){
      case "Graph":
        drawGraph(this.x + 10, this.y + 30, this.w - 20, this.h - 40, this.minValue, this.maxValue, this.maxLength, this.data);
        break;
      case "List":
        //drawList(this.x + 10, this.y + 20, this.w-20, this.data);
        break;
    }
  }
  checkSelect()
  {
    if (hasSelected == false && windowIsMoved == false && mouseIsPressed && collc(this.x, this.y, this.w, this.h, mouseX, mouseY, 1, 1) == true) this.select();
  }
  select()
  {
    hasSelected = true;
    reOrderWindows(this.id);
    selectedWindowID = this.id;
  }
  moveBy(x, y)
  {
    this.x += x;
    this.y += y;
  }
  scaleBy(x, y)
  {
    this.w += x;
    this.h += y;
  }
  selectedInteractions()
  {
    // movement
    let moveSpeed = 15;


    // movement key, if ctrl is pressed, lock to screen side, if alt is pressed, scale up, else, move by movement speed
    if (keyIsDown(39))
    {
      if (keyIsDown(17)) this.x = getLockPosition(this.x, this.y, this.w, this.h, this.id, "Right");
      else
      {
        if (keyIsDown(16)) this.scaleBy(moveSpeed, 0);
        else this.moveBy(moveSpeed, 0);
      }
    }
    if (keyIsDown(37))
    {
      if (keyIsDown(17)) this.x = getLockPosition(this.x, this.y, this.w, this.h, this.id, "Left");
      else
      {
        if (keyIsDown(16)) this.scaleBy(-moveSpeed, 0);
        else this.moveBy(-moveSpeed, 0);
      }
    }
    if (keyIsDown(40))
    {
      if (keyIsDown(17)) this.y = getLockPosition(this.x, this.y, this.w, this.h, this.id, "Down");
      else
      {
        if (keyIsDown(16)) this.scaleBy(0, moveSpeed);
        else this.moveBy(0, moveSpeed);
      }
    }
    if (keyIsDown(38))
    {
      if (keyIsDown(17)) this.y = getLockPosition(this.x, this.y, this.w, this.h, this.id, "Up");
      else
      {
        if (keyIsDown(16)) this.scaleBy(0, -moveSpeed);
        else this.moveBy(0, -moveSpeed);
      }
    }

    if (mouseIsPressed && collc(this.x, this.y, this.w, this.h, mouseX, mouseY, 1, 1)) {windowIsMoved = true; this.moveBy(-(pwinMouseX - mouseX), -(pwinMouseY - mouseY));}
    else windowIsMoved = false;

    this.x = constrain(this.x, 0, width - this.w);
    this.y = constrain(this.y, 0, height - this.h);
    this.w = constrain(this.w, 50, width);
    this.h = constrain(this.h, 50, height);
  }
  close()
  {
    if(this.frame1 == false){
      this.closeButton.remove();
      infoWindows = del(infoWindows, this.id);
    }
  }
}

function reOrderWindows(id){
  let newWindows = [];
  newWindows.push(infoWindows[id]);
  infoWindows[id].id = 0;
  infoWindows = del(infoWindows, id);
  for(let i = 0; i < infoWindows.length; i++){
    infoWindows[i].id = newWindows.length;
    newWindows.push(infoWindows[i]);
  }
  //reverse(newWindows);
  infoWindows = newWindows;
}

class dataSet
{
  constructor(dataValues)
  {
    this.dataValues = dataValues;
    this.maxLength = this.dataValues.length;
    this.minValue = arrMin(dataValues);
    this.maxValue = arrMax(dataValues);
  }
}

// find the minimum and maximum values in a data array
function arrMin(arr)
{
  let min = arr[0];
  for (let i = 0; i < arr.length; i++)
  {
    if (arr[i] < min) min = arr[i];
  }
  return min;
}

function arrMax(arr)
{
  let max = arr[0];
  for (let i = 0; i < arr.length; i++)
  {
    if (arr[i] > max) max = arr[i];
  }
  return max;
}

function drawGraph(x, y, w, h, minValue, maxValue, length, dataSets)
{
  // background
  fill(220);
  rect(x, y, w, h);
  let xScale = w / length / 2
  let yScale = h / length / 2
  textSize(xScale / 2);
  textAlign(LEFT);
  fill(0);
  for (let i = 0; i < w; i += w / length)
  {
    line(x + i, y, x + i, y + h);
    if (i != 0) text(round(i / (w / length)), x + i + xScale / 2, y + h - yScale / 4);
  }
  for (let i = 0; i < h; i += h / length)
  {
    line(x, y + i, x + w, y + i);
    text(round(maxValue - map(i, -h / length, h, 0, maxValue)), x + xScale / 4, y + i + (2 * yScale) - yScale / 2);
  }
  for (let i = 0; i < dataSets.length; i++)
  {
    let curData = dataSets[i].dataValues
    stroke(graphColors[i])
    let prevPoint = createVector(0, 0);
    for (let i2 = 0; i2 < curData.length; i2++)
    {
      let newX = x + (xScale * 2) + map(i2, 0, curData.length, 0, w);
      let newY = y + h - map(curData[i2], minValue, maxValue, yScale * 2, h);
      strokeWeight(10);
      if (dist(mouseX, mouseY, newX, newY) < 15)
      {
        strokeWeight(20);
        push();
        strokeWeight(0);
        fill(graphColors[i]);
        textAlign(CENTER);
        stroke(0);
        text(i2 + ", " + round(curData[i2] * 100) / 100, newX, newY - 30);
        pop();
      }
      point(newX, newY);
      strokeWeight(3);
      if (linePoint(prevPoint.x, prevPoint.y, newX, newY, mouseX, mouseY)) { strokeWeight(8) }
      if (i2 != 0) line(prevPoint.x, prevPoint.y, newX, newY);
      prevPoint.x = newX;
      prevPoint.y = newY;
    }
  }
}

function drawList(x, y, w, dataSets){
  let h = 0;
  for(let i2 = 0; i2 < dataSets.length; i2++){
    let curData = dataSets[i2].data;

    let dataStr = "";
    text(curData, 1000, 400);
    for(let i = 0; i < curData.length; i++){
      rect(100, 100, 100);  
      if(i%2!=0) dataStr += ": ";
      
    }
    h += 20 * round(textWidth(dataStr) / w);
  
    fill(255);
    stroke(0);
    textSize(15);
    text(dataStr, x, y, w);
  }
  fill(20);
  rect(x, y, w, h);
}

function del(arr, id)
{
  let newArr = [];
  for (let i = 0; i < arr.length; i++)
  {
    if (i != id) newArr.push(arr[i]);
    if (i > id) arr[i].id--;
  }
  if (selectedWindowID > id) selectedWindowID--;
  return newArr;
}

function linePoint(x, y, x2, y2, px, py)
{
  let d1 = dist(px, py, x, y);
  let d2 = dist(px, py, x2, y2);
  let d3 = dist(x, y, x2, y2);
  return (d1 + d2 < d3 + 10);
}

function collc(x, y, w, h, x2, y2, w2, h2)
{
  return (x + w > x2 && x < x2 + w2 && y + h > y2 && y < y2 + h2);
}
