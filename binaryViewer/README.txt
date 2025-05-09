What is the Binary Viewer?
  First and foremost, the binary viewer is meant to simplify the reading of local data from cubesats. 
  Without converting the binary into any other filetype, without any other program, it can be loaded and displayed in this application

How To open the app:
  1. Pre-requisites
    a. VS Code
    b. the VS Code extentions (p5.vscode, p5js live editor OR p5Canvas, both work)
  2. in VS Code, you can simply run the command >Create New p5js Project
  3. select a new folder to create this project in.
  4. Copy and paste the contents of sketch.js into the auto-generated sketch.js file created with the create new p5js project command
  5. ensure you delete the previous contents (the setup and draw functions)
  6. If you use p5js live Server, click the "Go Live" button in the bottom right
  7. If you use p5Canvas, hit the p5Canvas button in the bottom Left. 
  8. (Mouse / Control functionality is not functional in p5Canvas for an unknown reason)

How to Use:
  1. Loading Raw Binary Files
      a. click the button in the bottom left labled "Choose Files"
      b. click and drag to highlight all binary files you wish to load (Reccomended less than about 20)
  
  2. files will be loaded and automaticall fill in the cubesat specific windows.
  3. to load other files, you can reload the page and your loaded files will be removed from memory
  4. Controls
      a. ctrl + arrow keys locks a selected to a side of the screen
      b. Shift + arrow keys changes the size of the selected window (Locked to top left)
      c. arrow keys move the windows arround
      d. Click and drag functionality also exists
