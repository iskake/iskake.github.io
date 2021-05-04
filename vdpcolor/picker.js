// TODO: use node module instead (avoid third party cookies from 'unpkg.com')
// import Picker from 'vanilla-picker';

var colorBox = document.querySelector('.colorBox.inputBox');
var inputField = document.querySelector('.hexField');
var picker = new Picker(colorBox);

picker.onChange = function(color) {
    colorBox.style.background = color.rgbaString;
};

picker.onDone = function(color) {
    inputField.value = color.hex.slice(0, color.hex.length - 2);
};