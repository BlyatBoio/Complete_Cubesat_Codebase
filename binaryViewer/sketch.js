let infoWindows = [];
let selectedWindowID = 0;
let graphColors;
let windowIsMoved = false;
let hasSelected = false
let fileInp;
let loadFile;
let clearButton;
// Cubesat Specific Displays
let GPS_Display;
let ALT_Display;
let ACC_Display;
let GYRO_Display;
let MAG_Display;
let POWER_Display;
let SOLAR_Display;
let BAT_Display;
let ALG_Display;
// Cubesat Specific Data Sets
let GPS_Data;
let ALT_Data;
let ACC_Data;
let GYRO_Data;
let MAG_Data;
let POWER_Data;
let SOLAR_Data;
let BAT_Data;
let ALG_Data;

function setup()
{
  createCanvas(windowWidth, windowHeight);
  graphColors = [color(200, 0, 0), color(0, 200, 0), color(0, 0, 200), color(0), color(100), color(255), color(200), color(0), color(0)];
  fileInp = createFileInput(loadCubesatFile);
  fileInp.position(50, height - 70);
  clearButton = createButton("Clear Screen");
  clearButton.mousePressed(clearScreen);
  clearButton.position(200, height - 70);
  /*
  new infoWindow(100, 100, 200, 200, "Graph", "TEST DISPLAY", [randomSet(0, 100, 10), randomSet(0, 100, 10), randomSet(0, 100, 10)]);
  new infoWindow(400, 100, 200, 200, "Graph", "TEST DISPLAY", [randomSet(0, 100, 10), randomSet(0, 100, 10), randomSet(0, 100, 10)]);
  new infoWindow(700, 100, 200, 200, "Graph", "TEST DISPLAY", [randomSet(0, 100, 10), randomSet(0, 100, 10), randomSet(0, 100, 10)]);
  new infoWindow(100, 400, 200, 200, "Graph", "TEST DISPLAY", [randomSet(0, 100, 10), randomSet(0, 100, 10), randomSet(0, 100, 10)]);
  */
  defineCubesatDisplays();
}

function draw()
{
  background(0, 10, 50);
  for (let i = infoWindows.length - 1; i >= 0; i--)
  {
    infoWindows[i].drawSelf();
  }

  for (let i = 0; i < infoWindows.length; i++)
  {
    infoWindows[i].checkSelect();
  }

  if (infoWindows[selectedWindowID] != undefined) infoWindows[selectedWindowID].selectedInteractions();
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

function getLockPosition(x, y, w, h, id, direction)
{
  let hasFoundLocation = false;

  // start with an offset from each given side of 0
  let checkX = 0;
  let checkY = 0;
  let totalCols = 0;

  // Depending on direction, align to a given position
  switch (direction)
  {
    case "Left":
      // until checkX is off of the screen or not coliding with another infoWindow, apply an offset proportional to the width of the coliding
      while (hasFoundLocation == false)
      {
        // ensure that no collisions occur
        totalCols = 0;
        // itterate over all windows to check for collisions
        for (let i = 0; i < infoWindows.length; i++)
        {

          // collision check
          if (infoWindows[i].id != id && collc(checkX, y, w, h, infoWindows[i].x, infoWindows[i].y, infoWindows[i].w, infoWindows[i].h) == true)
          {
            // apply an offset such that it aligns to the left of a colliding window
            let d = dist(x, 0, infoWindows[i].x + infoWindows[i].w, 0)
            checkX += d;
            totalCols++;
            if (d < 1) return x + 1;
          }
        }
        // update "escape" variable
        if (totalCols == 0) { hasFoundLocation = true; break; }
        if (checkX > width) return x; // if it can not align to be on the screen, it simply wont change position
      }
      return checkX;
    case "Right":
      checkX = width - w;
      // until checkX is off of the screen or not coliding with another infoWindow, apply an offset proportional to the width of the coliding
      while (hasFoundLocation == false)
      {
        // ensure that no collisions occur
        totalCols = 0;

        // itterate over all windows to check for collisions
        for (let i = 0; i < infoWindows.length; i++)
        {

          // collision check
          if (infoWindows[i].id != id && collc(checkX, y, w, h, infoWindows[i].x, infoWindows[i].y, infoWindows[i].w, infoWindows[i].h) == true)
          {
            // apply an offset such that it aligns to the left of a colliding window
            let d = dist(x + w, 0, infoWindows[i].x, 0);
            checkX -= d;
            totalCols++;
            if (d < 1) return x - 1;
          }
        }
        // update "escape" variable
        if (totalCols == 0) { hasFoundLocation = true; break; }
        if (checkX < -w) return x; // if it can not align to be on the screen, it simply wont change position
      }
      return checkX;
    case "Up":
      // until checkX is off of the screen or not coliding with another infoWindow, apply an offset proportional to the width of the coliding
      while (hasFoundLocation == false)
      {
        // ensure that no collisions occur
        totalCols = 0;
        // itterate over all windows to check for collisions
        for (let i = 0; i < infoWindows.length; i++)
        {

          // collision check
          if (infoWindows[i].id != id && collc(x, checkY, w, h, infoWindows[i].x, infoWindows[i].y, infoWindows[i].w, infoWindows[i].h) == true)
          {
            // apply an offset such that it aligns to the left of a colliding window
            let d = dist(y, 0, infoWindows[i].y + infoWindows[i].h, 0)
            checkY += d;
            totalCols++;
            if (d < 1) return y + 1;
          }
        }
        // update "escape" variable
        if (totalCols == 0) { hasFoundLocation = true; break; }
        if (checkY > height) return y; // if it can not align to be on the screen, it simply wont change position
      }
      return checkY;
    case "Down":
      checkY = height - h;
      // until checkX is off of the screen or not coliding with another infoWindow, apply an offset proportional to the width of the coliding
      while (hasFoundLocation == false)
      {
        // ensure that no collisions occur
        totalCols = 0;

        // itterate over all windows to check for collisions
        for (let i = 0; i < infoWindows.length; i++)
        {

          // collision check
          if (infoWindows[i].id != id && collc(x, checkY, w, h, infoWindows[i].x, infoWindows[i].y, infoWindows[i].w, infoWindows[i].h) == true)
          {
            // apply an offset such that it aligns to the left of a colliding window
            let d = dist(y + h, 0, infoWindows[i].y, 0);
            checkY -= d;
            totalCols++;
            if (d < 1) return y - 1;
          }
        }
        // update "escape" variable
        if (totalCols == 0) { hasFoundLocation = true; break; }
        if (checkY < -h) return y; // if it can not align to be on the screen, it simply wont change position
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
    this.closeButton.mouseReleased(this.close);
    this.cbW = this.w / 10;
    this.cbh = this.h / 10;

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
    let totalCols = 0;
    for (let i = 0; i < this.id; i++)
    {
      if (infoWindows[i].id != this.id && collc(this.x + this.w - 30, this.y + 10, this.cbW, this.cbh, infoWindows[i].x, infoWindows[i].y, infoWindows[i].w, infoWindows[i].h) == true)
      {
        totalCols++;
        this.closeButton.hide();
        break;
      }
    }
    if (totalCols == 0) this.closeButton.show();

    switch (this.type)
    {
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

    if (mouseIsPressed && collc(this.x, this.y, this.w, this.h, mouseX, mouseY, 1, 1)) { windowIsMoved = true; this.moveBy(-(pwinMouseX - mouseX), -(pwinMouseY - mouseY)); }
    else windowIsMoved = false;

    this.x = constrain(this.x, 0, width - this.w);
    this.y = constrain(this.y, 0, height - this.h);
    this.w = constrain(this.w, 50, width);
    this.h = constrain(this.h, 50, height);
  }
  updateDataVals()
  {
    this.minValue = 100000;
    this.maxValue = -100000;
    this.maxLength = -100000;
    for (let i = 0; i < this.data.length; i++)
    {
      if (this.data[i].minValue < this.minValue) this.minValue = this.data[i].minValue;
      if (this.data[i].maxValue > this.maxValue) this.maxValue = this.data[i].maxValue;
      if (this.data[i].maxLength > this.maxLength) this.maxLength = this.data[i].maxLength;
    }
  }
  close()
  {
    infoWindows = del(infoWindows, this.id);
  }
}

function reOrderWindows(id)
{
  let newWindows = [];
  newWindows.push(infoWindows[id]);
  infoWindows[id].id = 0;
  infoWindows = del(infoWindows, id);
  for (let i = 0; i < infoWindows.length; i++)
  {
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
  addValue(value)
  {
    this.dataValues.push(value);
    this.minValue = arrMin(this.dataValues);
    this.maxValue = arrMax(this.dataValues);
    this.maxLength = this.dataValues.length;
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

function drawList(x, y, w, dataSets)
{
  let h = 0;
  for (let i2 = 0; i2 < dataSets.length; i2++)
  {
    let curData = dataSets[i2].data;

    let dataStr = "";
    text(curData, 1000, 400);
    for (let i = 0; i < curData.length; i++)
    {
      rect(100, 100, 100);
      if (i % 2 != 0) dataStr += ": ";

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

function loadBinaryFile(fileToLoad)
{
  console.log(fileToLoad);

  // separate the data tag from the actual data (data:application/octet-stream;base64, then lists data)
  let useableData = split(fileToLoad.data, ",")[1];
  console.log(useableData);

  // converts Base 64 to Ascii
  let asciiStr = atob(useableData);
  console.log(asciiStr);

  let binaryString = []; // whats actually used for later conversion
  let bString = ""; // exists for logging purposes

  // decode ascii into binary
  for (let i = 0; i < asciiStr.length; i++)
  {
    let value = asciiStr.charCodeAt(i); // Get Ascii values from the charachters in the ascii string
    let binaryValue = value.toString(2); // Convert Ascii values into binary (0, or 1)

    // apply binary value to the overall binary string and array
    binaryString.push(binaryValue);
    bString += binaryValue;
  }
  console.log(bString);

  // final conversion from binary to integers
  let finalStr = [];
  for (let i = 0; i < binaryString.length; i += 4)
  {
    // encoded in int-32, so individual bits wont give the full information (i+= 2 and the for loop)
    let bStr = "";
    for (let i2 = 0; i2 < 4; i2++)
    {
      bStr += binaryString[i + i2];
    }
    finalStr.push(parseInt(bStr, 2)); // parse int takes binary and converts it into an integer, adds to the final array
  }
  console.log(finalStr);
  return finalStr;
}

function loadCubesatFile(fileToLoad)
{
  let data = loadBinaryFile(fileToLoad);
  let newGPSData = data.slice(1, 6);
  let newAltData = data.slice(7, 12);
  let newAccData = data.slice(13, 16);
  let newGyroData = data.slice(17, 20);
  let newMagData = data.slice(21, 24);
  let newPowerData = data.slice(25, 28);
  let newSolarData = data.slice(29, 39);
  let newBatData = data.slice(40, 42);
  let newAlgData = data.slice(43, 49);

  console.log(GPS_Display);
  for (let i = 0; i < GPS_Display.data.length; i++)
  {
    GPS_Display.data[i].addValue(newGPSData[i]);
  }
  for (let i = 0; i < ALT_Display.data.length; i++)
  {
    ALT_Display.data[i].addValue(newAltData[i]);
  }
  for (let i = 0; i < ACC_Display.data.length; i++)
  {
    ACC_Display.data[i].addValue(newAccData[i]);
  }
  for (let i = 0; i < GYRO_Display.data.length; i++)
  {
    GYRO_Display.data[i].addValue(newGyroData[i]);
  }
  for (let i = 0; i < MAG_Display.data.length; i++)
  {
    MAG_Display.data[i].addValue(newMagData[i]);
  }
  for (let i = 0; i < POWER_Display.data.length; i++)
  {
    POWER_Display.data[i].addValue(newPowerData[i]);
  }
  for (let i = 0; i < SOLAR_Display.data.length; i++)
  {
    SOLAR_Display.data[i].addValue(newSolarData[i]);
  }
  for (let i = 0; i < BAT_Display.data.length; i++)
  {
    BAT_Display.data[i].addValue(newBatData[i]);
  }
  for (let i = 0; i < ALG_Display.data.length; i++)
  {
    ALG_Display.data[i].addValue(newAlgData[i]);
  }
  GPS_Display.updateDataVals();
  ALT_Display.updateDataVals();
  ACC_Display.updateDataVals();
  GYRO_Display.updateDataVals();
  MAG_Display.updateDataVals();
  POWER_Display.updateDataVals();
  SOLAR_Display.updateDataVals();
  BAT_Display.updateDataVals();
  ALG_Display.updateDataVals();

  console.log(GPS_Display);
}

function defineCubesatDisplays()
{
  GPS_Data = createSetArray(5);
  ALT_Data = createSetArray(5);
  ACC_Data = createSetArray(3);
  GYRO_Data = createSetArray(3);
  MAG_Data = createSetArray(3);
  POWER_Data = createSetArray(3);
  SOLAR_Data = createSetArray(9);
  BAT_Data = createSetArray(2);
  ALG_Data = createSetArray(7);

  GPS_Display = new infoWindow(0, 0, 250, 200, "Graph", "GPS Data", GPS_Data);
  ALT_Display = new infoWindow(250, 0, 250, 200, "Graph", "Altimeter Data", ALT_Data);
  ACC_Display = new infoWindow(500, 0, 250, 200, "Graph", "Accelerometer Data", ACC_Data);
  GYRO_Display = new infoWindow(750, 0, 250, 200, "Graph", "Gyroscope Data", GYRO_Data);
  MAG_Display = new infoWindow(1000, 0, 250, 200, "Graph", "Magnometer Data", MAG_Data);
  POWER_Display = new infoWindow(1250, 0, 250, 200, "Graph", "Power Data", POWER_Data);
  SOLAR_Display = new infoWindow(0, 200, 250, 200, "Graph", "Solar Data", SOLAR_Data);
  BAT_Display = new infoWindow(250, 200, 250, 200, "Graph", "Battery Data", BAT_Data);
  ALG_Display = new infoWindow(500, 200, 250, 200, "Graph", "Analog Data", ALG_Data);
}

function createSetArray(amnt)
{
  let returnArr = [];
  for (let i = 0; i < amnt; i++)
  {
    returnArr.push(new dataSet([]));
  }
  return returnArr;
}

function clearScreen()
{
  for (let i = 0; i < infoWindows.length; i++)
  {
    infoWindows[i].closeButton.remove();
  }
  infoWindows = [];
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
