To eddit the groundstation, there is an absurd ammount of pre-requisites

1. Have an unblocked computer, lots of dependencies require system level command line permissions to function, and school computers will often not allow this
2. Python version 3.18 (later versions may work but I can not garuntee it)

Installing Other Dependancies:
    PIP: 
        1. Download the PIP setup file file from https://bootstrap.pypa.io/get-pip.py (pulled straight from the installer site)
        2. In cmd line, run the command "py get-pip.py" to run the python file that will install pip
        3. Ensure your python scripts folder is included in your system variables
            a. type in env and click enter
            b. click the button in the bottom right of the pop up
            c. double click the option labled "Path"
            d. Ensure one of the options follows the structure "C:\Users\Your_Name\AppData\Local\Programs\Python\Python38\Scripts\"
            e. If this is not included, follow the file path in file explorer and copy the file path from the top to ensure no misspsellings
            f.  Paste into a new path variable, and it is completed
    Extras:
        1. Run the commands "pip install pyqt5", "pip install pyserial==3.4" and "pip install pyinstaller"
            a. pyqt5 is a dependancy of the app.py file
            b. pyserial is the API used to communicate via radio coms with the cubesat while it is in the air
            c. pyinstaller allows us to compile our python code into an exe and actually edit the app itself

Compilation Setup:
    1. Create your folder to house your groundstation
    2. In said folder, include every file in the Ground_Station \ Editing folder besides the README
        
Making Changes And Compilation:
    1. Open app.py in your IDE of choice, make what changes you desire, ensure you save the .py file
    2. To compile, open CMD line and use CD to navigate to the root folder of your app.py file
    3. Run the command "pyinstaller --onefile app.py" 
        a. compiler --into one .exe --path file name
    4. Your compiled EXE will appear in a new folder named dist
    5. Ensure that you copy/paste the large.UI file into the dist Folder, the app will not run without it
    6. If you need to make changes or re-compile the app, simply running the same command will go through the same process, deleting old files and updating them to the new versions along the way
    

