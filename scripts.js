let image_one_input = document.getElementById("image-one");
let image_pt2 = document.getElementById("image");
let image_two_input = document.getElementById("image-two");
google.charts.load("current", { packages: ["corechart"] });

var submitImageOperation = function(event) {
    event.preventDefault();
    var functionName = $("#form input:checked").attr("id");
    var img_one = document.getElementById('display-image-one');
    var img_two = document.getElementById('display-image-two');
    window[functionName](getImageData(img_one), getImageData(img_two));

}

var submitImageOperationPt2 = function(event) {
    event.preventDefault();
    var functionName = $("#form2 input:checked").attr("id");
    var img = document.getElementById('image-pt2');
    console.log(functionName);
    window[functionName](getImageData(img).data, img.width, 3, img.height);
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

image_pt2.onchange = event => {
    const output_img = document.getElementById("image-pt2");
    let file = image_pt2.files[0];

    if(file){
        output_img.src = URL.createObjectURL(file);
    }
}

var histograma = (matrix, width, convolucao, height) => {
    const [histogramResult, oldDistribution] = histogram(matrix, width);
    const [, newDistribution] = histogram(histogramResult, width);
    const oldChartValues = transformToDrawChart(oldDistribution);
    const newChartValues = transformToDrawChart(newDistribution);
    drawChart(oldChartValues, '(before)', 'histograma_before');
    drawChart(newChartValues, '(after)', 'histograma_after');
    matrixToImage(histogramResult, width, height);
}

var media = (matrix, width, convolucao, height) => {
    matrixToImage(averageFilter(matrix, width, convolucao), width, height);
}

var minimo = (matrix, width, convolucao, height) => {
    matrixToImage(minimumFilter(matrix, width, convolucao), width, height);
}

var maximo = (matrix, width, convolucao, height) => {
    matrixToImage(maximumFilter(matrix, width, convolucao), width, height);
}

var mediana = (matrix, width, convolucao, height) => {
    matrixToImage(medianFilter(matrix, width, convolucao), width, height);
}

var ordem = (matrix, width, convolucao, height) => {
    matrixToImage(orderFilter(matrix, width, convolucao), width, height);
}

var conservativa = (matrix, width, convolucao, height) => {
    matrixToImage(conservativeSmoothing(matrix, width, convolucao), width, height);
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



$('input[type=radio][name=group]').change(function() {
    if ($(this).attr("id") == 'pt-1') {
        $(".pt-1").show();
        $(".pt-2").hide();
    } else if ($(this).attr("id") == 'pt-2') {
        $(".pt-2").show();
        $(".pt-1").hide();
    }
});



 // início utils


 function matrixToImageData(matrix, width, height) {
    const typedArray = new Uint8ClampedArray(matrix.length);
    for (let i = 0; i < matrix.length - 4; i += 4) {
      typedArray[i] = matrix[i];
      typedArray[i+ 1] = matrix[i + 1];
      typedArray[i + 2] = matrix[i + 2];
      typedArray[i + 3] = 255;
    }

    const imgData = new ImageData(typedArray, width, height);

    return imgData;
}

function matrixToImage(matrix, width, height){
    const imageData = matrixToImageData(matrix, width, height);
    const image = imageDataToImage(imageData);

    showResult(image);
}

function showResult(image) {
    let outputResult = document.getElementById("display-image-result");
    outputResult.src = image.src;
    openResultModal();
}

function flatten(flipped) {
    return flipped.reduce((acc, curr) => acc = [...acc, ...curr], []);
}


function flattenV2(arr) {
    const result = [];
    arr.forEach(line => line.forEach(pixelChunk => pixelChunk.forEach(pixelVal => result.push(pixelVal))));

    return result;
}


function separateMatrixIntoLines(matrix, width) {
    const result = [];
    
    for (let i = 0; i < matrix.length; i += width * 4) {
        result.push(matrix.slice(i, i + width * 4));
    }

    return result;
}

function separateChunkIntoPixels(matrix) {
    return matrix.map(line => {
        const newLine = [];
        for (let i = 0; i < line.length; i += 4) {
        const pixelChunk = [line[i], line[i + 1], line[i + 2], line[i + 3]];
        newLine.push(pixelChunk);
        }

        return newLine;
    });
}

const transformToDrawChart = (arr) => arr.map((item, idx) => [idx, item]);

function drawChart(values, title, divId) {
    const data = google.visualization.arrayToDataTable([
      ["Pixel Value", "Quantity"],
      ...values
    ]);

    const options = {
      title,
      legend: { position: "none" },
    };

    const chart = new google.visualization.ColumnChart(
      document.getElementById(divId)
    );
    chart.draw(data, options);
  }

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



function conservativeSmoothing(matrix, width, filterSize) {
    const lineSeparated = separateMatrixIntoLines(matrix, width);
    const lineAndChunkSeparated = separateChunkIntoPixels(lineSeparated);
    const kernelSize = (filterSize - 1) / 2;
    const img2 = JSON.parse(JSON.stringify(lineAndChunkSeparated));
  
    for (let i = kernelSize; i< lineAndChunkSeparated.length - kernelSize; i++) {
      for (let j = kernelSize; j < lineAndChunkSeparated[i].length - kernelSize; j++) {
        let maximumValue = [0, 0, 0, 0];
        let minimumValue = [256, 256, 256, 256];
  
        for (let l = i - kernelSize; l <= i + kernelSize; l++) {
          for (let m = j - kernelSize; m <= j + kernelSize; m++) {
            if (lineAndChunkSeparated[l] && lineAndChunkSeparated[l][m] && !(i === l && j === m)) {
              lineAndChunkSeparated[l][m].forEach((pixelVal, idx) => {
                if (maximumValue[idx] < pixelVal) {
                  maximumValue[idx] = pixelVal;
                }
  
                if (minimumValue[idx] > pixelVal) {
                  minimumValue[idx] = pixelVal;
                }
              });
            }
          }
        }
  
        lineAndChunkSeparated[i][j].forEach((pixelVal, idx) => {
          if (pixelVal > maximumValue[idx]) {
            img2[i][j][idx] = maximumValue[idx];    
          }
  
          if (pixelVal < minimumValue[idx]) {
            img2[i][j][idx] = minimumValue[idx];    
          }
        });
  
        img2[i][j][3] = 255;
      }
    }
  
    return flattenV2(lineAndChunkSeparated);  
  }
  
  function averageFilter(matrix, width, filterSize = 3) {
    const lineSeparated = separateMatrixIntoLines(matrix, width);
    const lineAndChunkSeparated = separateChunkIntoPixels(lineSeparated);
    const img2 = JSON.parse(JSON.stringify(lineAndChunkSeparated));
    const kernelSize = (filterSize - 1) / 2;
    const totalPixelCount = filterSize * filterSize;
  
    for (let i = kernelSize; i < lineAndChunkSeparated.length - kernelSize; i++) {
      for (let j = kernelSize; j < lineAndChunkSeparated[i].length - kernelSize; j++) {
        let totalPixelSum = [0, 0, 0, 0];
  
        for (let l = i - kernelSize; l <= i + kernelSize; l++) {
          for (let m = j - kernelSize; m <= j + kernelSize; m++) {
            totalPixelSum[0] += lineAndChunkSeparated[l][m][0];
            totalPixelSum[1] += lineAndChunkSeparated[l][m][1];
            totalPixelSum[2] += lineAndChunkSeparated[l][m][2];
          }
        }
  
        img2[i][j][0] = totalPixelSum[0] / totalPixelCount;
        img2[i][j][1] = totalPixelSum[1] / totalPixelCount;
        img2[i][j][2] = totalPixelSum[2] / totalPixelCount;
        img2[i][j][3] = 255;
      }
    }
  
    return flattenV2(img2);
  }
  
  function minimumFilter(matrix, width, filterSize) {
    const lineSeparated = separateMatrixIntoLines(matrix, width);
    const lineAndChunkSeparated = separateChunkIntoPixels(lineSeparated);
    const img2 = JSON.parse(JSON.stringify(lineAndChunkSeparated));
    const kernelSize = (filterSize - 1) / 2;
  
    for (let i = kernelSize; i < lineAndChunkSeparated.length - kernelSize; i++) {
      for (let j = kernelSize; j < lineAndChunkSeparated[i].length - kernelSize; j++) {
        let totalPixelSum = [[], [], [], []];
  
        for (let l = i - kernelSize; l <= i + kernelSize; l++) {
          for (let m = j - kernelSize; m <= j + kernelSize; m++) {
            if (l == i && m == j) {
              continue;
            } else {
              totalPixelSum[0].push(lineAndChunkSeparated[l][m][0]);
              totalPixelSum[1].push(lineAndChunkSeparated[l][m][1]);
              totalPixelSum[2].push(lineAndChunkSeparated[l][m][2]);
            }
          }
        }
  
        img2[i][j][0] = Math.min(...totalPixelSum[0]);
        img2[i][j][1] = Math.min(...totalPixelSum[1]);
        img2[i][j][2] = Math.min(...totalPixelSum[2]);
        img2[i][j][3] = 255;
      }
    }
  
    return flattenV2(img2);
  }

  function maximumFilter(matrix, width, filterSize) {
    const lineSeparated = separateMatrixIntoLines(matrix, width);
    const lineAndChunkSeparated = separateChunkIntoPixels(lineSeparated);
    const img2 = JSON.parse(JSON.stringify(lineAndChunkSeparated));
    const kernelSize = (filterSize - 1) / 2;
  
    for (let i = kernelSize; i < lineAndChunkSeparated.length - kernelSize; i++) {
      for (let j = kernelSize; j < lineAndChunkSeparated[i].length - kernelSize; j++) {
        let totalPixelSum = [[], [], [], []];
  
        for (let l = i - kernelSize; l <= i + kernelSize; l++) {
          for (let m = j - kernelSize; m <= j + kernelSize; m++) {
            if (l == i && m == j) {
              continue;
            } else {
              totalPixelSum[0].push(lineAndChunkSeparated[l][m][0]);
              totalPixelSum[1].push(lineAndChunkSeparated[l][m][1]);
              totalPixelSum[2].push(lineAndChunkSeparated[l][m][2]);
            }
          }
        }
  
        img2[i][j][0] = Math.max(...totalPixelSum[0]);
        img2[i][j][1] = Math.max(...totalPixelSum[1]);
        img2[i][j][2] = Math.max(...totalPixelSum[2]);
        img2[i][j][3] = 255;
      }
    }
  
    return flattenV2(img2);
  }

  function orderFilter(matrix, width, order = 1, filterSize=3) {
    const lineSeparated = separateMatrixIntoLines(matrix, width);
    const lineAndChunkSeparated = separateChunkIntoPixels(lineSeparated);
    const img2 = JSON.parse(JSON.stringify(lineAndChunkSeparated));
    const kernelSize = (filterSize - 1) / 2;
  
    for (let i = kernelSize; i < lineAndChunkSeparated.length - kernelSize; i++) {
      for (let j = kernelSize; j < lineAndChunkSeparated[i].length - kernelSize; j++) {
        let median = [[], [], [], []];
        for (let l = i - kernelSize; l <= i + kernelSize; l++) {
          for (let m = j - kernelSize; m <= j + kernelSize; m++) {
            lineAndChunkSeparated[l][m].forEach((pixelVal, idx) => {
              median[idx].push(pixelVal);
            });
          }
        }
  
        median.forEach(arr => arr.sort());
        img2[i][j][0] = median[0][order];
        img2[i][j][1] = median[1][order];
        img2[i][j][2] = median[2][order];
        img2[i][j][3] = 255;
      }
    }
  
    return flattenV2(img2);  
  }
  
  function medianFilter(matrix, width, filterSize=3) {
    const lineSeparated = separateMatrixIntoLines(matrix, width);
    const lineAndChunkSeparated = separateChunkIntoPixels(lineSeparated);
    const img2 = JSON.parse(JSON.stringify(lineAndChunkSeparated));
    const kernelSize = (filterSize - 1) / 2;
  
    for (let i = kernelSize; i < lineAndChunkSeparated.length - kernelSize; i++) {
      for (let j = kernelSize; j < lineAndChunkSeparated[i].length - kernelSize; j++) {
        let median = [[], [], [], []];
        for (let l = i - kernelSize; l <= i + kernelSize; l++) {
          for (let m = j - kernelSize; m <= j + kernelSize; m++) {
            lineAndChunkSeparated[l][m].forEach((pixelVal, idx) => {
              median[idx].push(pixelVal);
            });
          }
        }
  
        median.forEach(arr => arr.sort());
        img2[i][j][0] = median[0][Math.floor(median[0].length / 2)];
        img2[i][j][1] = median[1][Math.floor(median[1].length / 2)];
        img2[i][j][2] = median[2][Math.floor(median[2].length / 2)];
        img2[i][j][3] = 255;
      }
    }
  
    return flattenV2(img2);  
  }

  function histogram(matrix, width) {
    let minValue = 9999999999;
    const pixelCount = [];
    const cumulative = [];
    const newImagePixels = [];
  
    for (let i = 0; i < 256; i++) {
      pixelCount[i] = 0;
      cumulative[i] = 0;
    }
  
    for (let i = 0; i < matrix.length; i += 4) {
      pixelCount[matrix[i]]++;
    }
  
    for (let i = 0; i < pixelCount.length; i++) {
      if (i === 0) {
        cumulative[i] = pixelCount[i];
        continue;
      }
  
      cumulative[i] = cumulative[i - 1] + pixelCount[i];
    }
  
    minValue = cumulative[0];
  
    for (let i = 0; i < matrix.length; i += 4) {
      const firstDivision = cumulative[matrix[i]] - minValue;
      const squaredWidth = width * width;
      const secondDivision = squaredWidth - minValue;
  
      const result = Math.floor((firstDivision / secondDivision) * 255);
      newImagePixels[i] = result;
      newImagePixels[i + 1] = result;
      newImagePixels[i + 2] = result;
      newImagePixels[i + 3] = 255;
    }
  
    return [newImagePixels, pixelCount];
  }