const hexField = document.querySelector(".hexField");
const hexSubmit = document.querySelector(".hexSubmit");
const hexOutput = document.querySelector(".hexOutput");
const output24Bit = document.querySelector(".output24Bit");
const outputBox = document.querySelector(".colorBox.outputBox");
var colorBox = document.querySelector('.colorBox.inputBox');

hexField.addEventListener("keydown", function f(e) {
    if ((e && e.keyCode == 13) || e == 0) {
        convertColor();
        changeBoxColor(hexField.value);
    }
});
hexSubmit.addEventListener("click", function f(){
    convertColor();
    changeBoxColor(hexField.value);
});

function convertColor() {
    let val = String(hexField.value);

    if ((val[0] === "0" && (val[1] !== undefined && val[1].toLowerCase() === "x"))) {
        val = val.slice(2);
    } else if (val[0] === "#") {
        val = val.slice(1);
    }

    if (val === "") {
        printError();
        return;
    }

    if (val.length > 6) {
        printError();
        return;
    }

    // TODO?: check invalid characters  
    // if (!/[a-zA-Z0-9]/.test(val)) {
    //     console.log("what");
    // }

    let input = toInt(val, 16);
    input = RGB24ToVDPColor(input);
    let in2 = VDPColorToRGB24(input);

    hexOutput.textContent = "Converted (9-bit): 0x" + toHex(input) + " (decimal " + input + ")";
    output24Bit.textContent = "Re-converted (24-bit): 0x" + toHex(in2);
    outputBox.style.backgroundColor = "#" + (toHex(in2) === "0" ? "000000" : (toHex(in2).length != 6 ? (toHex(in2).length === 2 ? "0000" : "00") : "") + toHex(in2)) + "ff";
}

// From 'pal.h' in SGDK
// (https://github.com/Stephane-D/SGDK/blob/master/inc/pal.h)
function RGB24ToVDPColor(color) {
    return (((color >> ((2 * 8) + 4)) & 0x000E) | ((color >> ((1 * 4) + 4)) & 0x00E0) | ((color << 4) & 0x0E00));
}

// Probably more complex than it needs to be... 
function VDPColorToRGB24(color) {
    let b = color >> 8;
    let g = (color & 0x0F0) >> 4;
    let r = color & 0x00F;

    let b9Nibble = [b, g, r];

    //               R  G  B
    let b24Nibble = [0, 0, 0];
    
    for (i = 0; i < b9Nibble.length; i++) {
        switch (b9Nibble[i]) {
            // From this table: https://segaretro.org/Sega_Mega_Drive/Palettes_and_CRAM#Format
            case 0x0:
                b24Nibble[i] = 0x00;
                break;
            case 0x2:
                b24Nibble[i] = 0x34;
                break;
            case 0x4:
                b24Nibble[i] = 0x57;
                break;
            case 0x6:
                b24Nibble[i] = 0x74;
                break;
            case 0x8:
                b24Nibble[i] = 0x90; // BlastEm shows 0x95... emulator fault or wrong value in table?
                break;
            case 0xA:
                b24Nibble[i] = 0xAC;
                break;
            case 0xC:
                b24Nibble[i] = 0xCE;
                break;
            case 0xE:
                b24Nibble[i] = 0xFF;
                break;
            default:
                throw "something happened lol"; // Only the best error handling around here!
        }
    }

    // Opposite of b9Nibble (bgr)
    return ((b24Nibble[2] << 16) + (b24Nibble[1] << 8) + b24Nibble[0]);
}

 function toHex(value) {
    return value.toString(16);
 }
            
 function toInt(value) {
    return parseInt(value, 16);
 }

 function printError() {
    hexOutput.textContent = "Invalid input!";
    output24Bit.textContent = "Must consist of 1 to 6 characters (excluding. \'0x\' and \'#\')";
 }

 function changeBoxColor(color) {
    colorBox.style.background = color.toString();
}