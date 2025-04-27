Included in this section of the repository is everything software related to the cubesat itself, the files that go onboard, the base code for the sat itself, and the bootloaders needed to run micropython

1. Bootloaders:
    On a basic factory ready pi pico, no files will remain and it will be reset every time it is powered off and back on again
    To add MicroPython or to ensure python can run on the pico itself, follow instructions in the bootloader-files secion
2. Exemplar Files:
    Unless you make critical changes to the onboard code, copy/pasting every file from exemplar-cubesat-files onto the board and following the instructions will ensure a functional cubesat
3. Avionics.py
    A sepperate example copy of the code meant for larger edits without testing onboard the cubesat or as a possible reversion
    