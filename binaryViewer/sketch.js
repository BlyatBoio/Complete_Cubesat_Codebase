let infoWindows = [];
let selectedWindowID = 0;
let graphColors;

function setup()
{
  createCanvas(windowWidth, windowHeight);
  new infoWindow(100, 100, 200, 200, "Graph", "TEST DISPLAY", [randomSet(0, 100, 10), randomSet(0, 100, 10), randomSet(0, 100, 10)]);
  new infoWindow(400, 100, 200, 200, "Graph", "TEST DISPLAY", [randomSet(0, 100, 10), randomSet(0, 100, 10), randomSet(0, 100, 10)])
  graphColors = [color(200, 0, 0), color(0, 200, 0), color(0, 0, 200), color(0), color(100)];
}


function draw()
{
  background(0, 10, 50);
  for (let i = 0; i < infoWindows.length; i++)
  {
    infoWindows[i].drawSelf();
    infoWindows[i].checkSelect();
  }
  infoWindows[selectedWindowID].selectedInteractions();
  //drawGraph(400, 300, 400, 200, 0, 10, 0, 20, [seta, setb]);
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
    this.closeButton.mousePressed(this.close);

    this.id = infoWindows.length;
    infoWindows.push(this);
  }
  drawSelf()
  {
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

    if (this.type == "Graph")
    {
      drawGraph(this.x + 10, this.y + 30, this.w - 20, this.h - 40, this.minValue, this.maxValue, this.maxLength, this.data);
    }
  }
  checkSelect()
  {
    if (mouseIsPressed && collc(this.x, this.y, this.w, this.h, mouseX, mouseY, 1, 1) == true) this.select();
  }
  select()
  {
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
      if (keyIsDown(17)) this.x = width - this.w;
      else
      {
        if (keyIsDown(16)) this.scaleBy(moveSpeed, 0);
        else this.moveBy(moveSpeed, 0);
      }
    }
    if (keyIsDown(37))
    {
      if (keyIsDown(17)) this.x = 0;
      else
      {
        if (keyIsDown(16)) this.scaleBy(-moveSpeed, 0);
        else this.moveBy(-moveSpeed, 0);
      }
    }
    if (keyIsDown(40))
    {
      if (keyIsDown(17)) this.y = height - this.h;
      else
      {
        if (keyIsDown(16)) this.scaleBy(0, moveSpeed);
        else this.moveBy(0, moveSpeed);
      }
    }
    if (keyIsDown(38))
    {
      if (keyIsDown(17)) this.y = 0;
      else
      {
        if (keyIsDown(16)) this.scaleBy(0, -moveSpeed);
        else this.moveBy(0, -moveSpeed);
      }
    }


    if (mouseIsPressed && collc(this.x, this.y, this.w, this.h, mouseX, mouseY, 1, 1)) this.moveBy(-(pwinMouseX - mouseX), -(pwinMouseY - mouseY));


    this.x = constrain(this.x, 0, width - this.w);
    this.y = constrain(this.y, 0, height - this.h);
    this.w = constrain(this.w, 50, width);
    this.h = constrain(this.h, 50, height);
  }
  close()
  {
    infoWindows = del(infoWindows, this.id);
  }
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
  return (x + w > x2 && x < x2 + w2 && y + h > y2 && y < y2 + h);
}
