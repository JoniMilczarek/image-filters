let image_one_input = document.getElementById("image-one");
let image_two_input = document.getElementById("image-two");

var submitImageOperation = function(event) {
    event.preventDefault();
    var functionName = $("form input:checked").attr("id");
    var img_one = document.getElementById('display-image-one');
    var img_two = document.getElementById('display-image-two');
    window[functionName](getImageData(img_one), getImageData(img_two));

}

image_one_input.onchange = event => {
    const output_img = document.getElementById("display-image-one");
    let file = image_one_input.files[0];

    if(file){
        output_img.src =  URL.createObjectURL(file);
    }
}

image_two_input.onchange = event => {
    const output_img = document.getElementById("display-image-two");
    let file = image_two_input.files[0];

    if(file){
        output_img.src =  URL.createObjectURL(file);
    }
}

var addition = (image_one, image_two) => {
    let image_temp = new Image();
    image_temp.width = image_one.width;
    image_temp.height = image_one.height;

    let finalImageData = getImageData(image_temp);

    let pixelsLenght = image_one.data.length;

    while(pixelsLenght--){
        finalImageData.data[pixelsLenght] = image_one.data[pixelsLenght] * 0.5 
            + image_two.data[pixelsLenght] * 0.5;
    }
    
    let finalImage = imageDataToImage(finalImageData);

    let outputResult = document.getElementById("display-image-result");
    outputResult.src = finalImage.src;

    openResultModal();
  
};


var subtraction = (image_one, image_two) => {

    let image_temp = new Image();
    image_temp.width = image_one.width;
    image_temp.height = image_one.height;

    let finalImageData = getImageData(image_temp);

    let pixelsLenght = image_one.data.length;

    while(pixelsLenght--){
        let subtractedPixel = image_one.data[pixelsLenght] - image_two.data[pixelsLenght] * 0.5;
        finalImageData.data[pixelsLenght] = resolveUnderflow(subtractedPixel);
    }
                    
    let finalImage = imageDataToImage(finalImageData);

    let outputResult = document.getElementById("display-image-result");
    outputResult.src = finalImage.src;

    openResultModal();
};

var multiplication = (image_one, image_two) => {
    let image_temp = new Image();
    image_temp.width = image_one.width;
    image_temp.height = image_one.height;

    let finalImageData = getImageData(image_temp);

    let pixelsLenght = image_one.data.length;

    while(pixelsLenght--){
        let pixelMultiplied = (image_one.data[pixelsLenght] * 0.15) * (image_two.data[pixelsLenght] * 0.15);
        finalImageData.data[pixelsLenght] = truncateValues(pixelMultiplied);
    }

    let finalImage = imageDataToImage(finalImageData);

    let outputResult = document.getElementById("display-image-result");
    outputResult.src = finalImage.src;

    openResultModal();
};


var division = (image_one, image_two) => {
    let image_temp = new Image();
    image_temp.width = image_one.width;
    image_temp.height = image_one.height;

    let finalImageData = getImageData(image_temp);

    let pixelsLenght = image_one.data.length;

    for(let i = 0; i < pixelsLenght; i+=4){
        let red = Math.ceil(image_one.data[i] / image_two.data[i]);
        let green = Math.ceil(image_one.data[i + 1] / image_two.data[i + 1]);
        let blue = Math.ceil(image_one.data[i + 2] / image_two.data[i + 2]);
        //let alpha = Math.ceil(image_one.data[i + 3] / image_two.data[i + 3]);
        let alpha = 180;

        finalImageData.data[i] = red;
        finalImageData.data[i + 1] = green;
        finalImageData.data[i + 2] = blue;
        finalImageData.data[i + 3] = alpha;
    }
    
    let finalImage = imageDataToImage(finalImageData);

    let outputResult = document.getElementById("display-image-result");
    outputResult.src = finalImage.src;

    openResultModal();
};

var average = (image_one, image_two) => {
    addition(image_one, image_two);
};

var blending = (image_one, image_two, k = 10) => {
    let image_temp = new Image();
    image_temp.width = image_one.width;
    image_temp.height = image_one.height;

    let finalImageData = getImageData(image_temp);

    let pixelsLenght = image_one.data.length;

    while(pixelsLenght--){
        let pixelMultiplied = (image_one.data[pixelsLenght] * (1 - k)) + (image_two.data[pixelsLenght] * (1 - k));
        finalImageData.data[pixelsLenght] = Math.abs(truncateValues(pixelMultiplied));
    }

    let finalImage = imageDataToImage(finalImageData);

    let outputResult = document.getElementById("display-image-result");
    outputResult.src = finalImage.src;

    openResultModal();
};

var not = (image_one, image_two) => {
    let image_temp = new Image();
    image_temp.width = image_one.width;
    image_temp.height = image_one.height;

    let finalImageData = getImageData(image_temp);

    let pixelsLenght = image_one.data.length;

    while(pixelsLenght--){
        let pixelMultiplied = (image_one.data[pixelsLenght]) + (image_two.data[pixelsLenght]);
        finalImageData.data[pixelsLenght] = 255 - resolveOverflow(pixelMultiplied);
    }

    let finalImage = imageDataToImage(finalImageData);

    let outputResult = document.getElementById("display-image-result");
    outputResult.src = finalImage.src;

    openResultModal();
};

var or = (image_one, image_two) => {
    let image_temp = new Image();
    image_temp.width = image_one.width;
    image_temp.height = image_one.height;

    let finalImageData = getImageData(image_temp);

    let pixelsLenght = image_one.data.length;

    while(pixelsLenght--){
        let pixelMultiplied = (image_one.data[pixelsLenght]) | (image_two.data[pixelsLenght]);
        finalImageData.data[pixelsLenght] = pixelMultiplied;
    }

    let finalImage = imageDataToImage(finalImageData);

    let outputResult = document.getElementById("display-image-result");
    outputResult.src = finalImage.src;

    openResultModal();
};
    
var and = (image_one, image_two) => {
    let image_temp = new Image();
    image_temp.width = image_one.width;
    image_temp.height = image_one.height;

    let finalImageData = getImageData(image_temp);

    let pixelsLenght = image_one.data.length;

    while(pixelsLenght--){
        let pixelMultiplied = (image_one.data[pixelsLenght]) & (image_two.data[pixelsLenght]);
        finalImageData.data[pixelsLenght] = pixelMultiplied;
    }

    let finalImage = imageDataToImage(finalImageData);

    let outputResult = document.getElementById("display-image-result");
    outputResult.src = finalImage.src;

    openResultModal();
};

var xor = (image_one, image_two) => {
    let image_temp = new Image();
    image_temp.width = image_one.width;
    image_temp.height = image_one.height;

    let finalImageData = getImageData(image_temp);

    let pixelsLenght = image_one.data.length;

    while(pixelsLenght--){
        let pixelMultiplied = (image_one.data[pixelsLenght]) ^ (image_two.data[pixelsLenght] * 0.3);
        finalImageData.data[pixelsLenght] = resolveOverflow(pixelMultiplied);
    }

    let finalImage = imageDataToImage(finalImageData);

    let outputResult = document.getElementById("display-image-result");
    outputResult.src = finalImage.src;

    openResultModal();
};

function getImageData(image) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    canvas.width = image.width;
    canvas.height = image.height;

    context.drawImage(image, 0, 0, image.width, image.height);

    const imageDataObj = context.getImageData(0, 0, image.width, image.height);
    
    return imageDataObj;
}

function truncateValues(value) {
    return value > 255 ? 255 : value;
}

function resolveOverflowToMinimun(value) {
    return value > 255 ? 0 : value;
}

function resolveOverflow(value){
    if(value === Infinity) {
        return 255;
    }

    return value > 255 ? value % 255 : value;
}
function resolveUnderflow(value) {
    return value < 0 ? 0 : value;
}

function imageDataToImage(imagedata) {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    canvas.width = imagedata.width;
    canvas.height = imagedata.height;
    ctx.putImageData(imagedata, 0, 0);

    let image = new Image();
    image.src = canvas.toDataURL();

    return image;
}

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems, {});
});

function getModalInstance() {
    let modal = document.getElementById('result-modal');
    return M.Modal.getInstance(modal);
}


function openResultModal() {
    getModalInstance().open();
}

function closeResultModal() {
    getModalInstance().close();
}
