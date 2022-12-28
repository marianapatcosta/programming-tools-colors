/* Elements */
var dropArea = document.getElementById('drag-area');
var imageUrlInput = document.getElementById('image-url');
var imageUploadInput = document.getElementById('image-upload');
var imagePreview = document.getElementById('image-preview');
var getColorsButton = document.getElementById('generate-button');
var colorsContainer = document.getElementById('colors');
var rgbColor = document.getElementById('rgb-color');
var hexColor = document.getElementById('hex-color');
var copyRgbButton = document.getElementById('copy-rgb');
var copyHexButton = document.getElementById('copy-hex');
imagePreview.classList.add('hidden');
colorsContainer.classList.add('hidden');
getColorsButton === null || getColorsButton === void 0 ? void 0 : getColorsButton.setAttribute('disabled', 'disabled');
var BLACK_COLOR_ID = '0-0-0';
var WHITE_COLOR_ID = '255-255-255';
var imageUrl = '';
var reset = function () {
    imageUrl = '';
    colorsContainer.classList.add('hidden');
    getColorsButton === null || getColorsButton === void 0 ? void 0 : getColorsButton.setAttribute('disabled', 'disabled');
    imagePreview.src = '';
    imagePreview.classList.add('hidden');
    imageUrlInput.value = '';
};
var getImageUrl = function (file) {
    if (!file)
        return;
    if (imageUrl) {
        reset();
    }
    if (!file.type.includes('image')) {
        alert("Invalid file: please upload only image files.");
        return;
    }
    var reader = new FileReader();
    reader.addEventListener('loadend', function () {
        imageUrl = reader.result;
        getColorsButton === null || getColorsButton === void 0 ? void 0 : getColorsButton.removeAttribute('disabled');
        imagePreview.src = imageUrl;
        imagePreview.classList.remove('hidden');
    });
    reader.readAsDataURL(file);
};
var handleDrag = function (event) {
    event.preventDefault();
    event.stopPropagation();
    dropArea.classList.add('dragging');
};
var handleDragIn = function (event) {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.items && event.dataTransfer.items.length) {
        dropArea.classList.add('dragging');
    }
};
var handleDragOut = function (event) {
    event.preventDefault();
    event.stopPropagation();
    dropArea.classList.remove('dragging');
};
var handleDrop = function (event) {
    event.preventDefault();
    event.stopPropagation();
    dropArea.classList.remove('dragging');
    if (event.dataTransfer.files && event.dataTransfer.files.length) {
        getImageUrl(event.dataTransfer.files[0]);
        event.dataTransfer.clearData();
    }
};
var handleDragAreaClick = function () {
    imageUploadInput.click();
};
var handleUpload = function (event) {
    if (!event.target.files)
        return;
    getImageUrl(event.target.files[0]);
};
var handleUrlInput = function (event) {
    if (!event.target.value && imageUrl) {
        reset();
        return;
    }
    if (!event.target.validity.valid) {
        alert("Please enter a valid URL.");
        getColorsButton === null || getColorsButton === void 0 ? void 0 : getColorsButton.setAttribute('disabled', 'disabled');
        return;
    }
    imageUrl = event.target.value;
    getColorsButton === null || getColorsButton === void 0 ? void 0 : getColorsButton.removeAttribute('disabled');
};
var renderImage = function () {
    if (!imageUrl) {
        return;
    }
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var image = new Image();
    image.crossOrigin = 'Anonymous';
    image.src = imageUrl;
    image.onload = function () {
        canvas.height = image.height;
        canvas.width = image.width;
        context.drawImage(image, 0, 0);
        var imageData = context.getImageData(0, 0, image.width, image.height).data;
        getDominantColor(imageData);
    };
    image.onerror = function () {
        alert('Dominant color not found. Please check your source.');
    };
};
var rgbToHex = function (r, g, b) {
    return "#".concat([r, g, b].map(function (x) { return Number(x).toString(16).padStart(2, '0'); }).join(''));
};
var renderDominantColor = function (dominantColor) {
    var _a = dominantColor.split('-'), r = _a[0], g = _a[1], b = _a[2];
    var hexDominant = rgbToHex(r, g, b);
    var rgbDominant = "rgb(".concat(r, ", ").concat(g, ", ").concat(b, ")");
    colorsContainer.classList.remove('hidden');
    rgbColor.innerText = rgbDominant;
    hexColor.innerText = hexDominant;
};
var getDominantColor = function (imageData) {
    var colorMap = {};
    for (var i = 0; i < imageData.length; i += 4) {
        var r = imageData[i];
        var g = imageData[i + 1];
        var b = imageData[i + 2];
        var rgb = "".concat(r, "-").concat(g, "-").concat(b);
        if (rgb in colorMap) {
            colorMap[rgb].count = colorMap[rgb].count + 1;
        }
        else {
            colorMap[rgb] = { rgb: rgb, count: 1 };
        }
    }
    var dominantColor = Object.values(colorMap)
        .sort(function (a, b) { return b.count - a.count; })
        .find(function (color) { return color.rgb !== BLACK_COLOR_ID && color.rgb !== WHITE_COLOR_ID; });
    if (!dominantColor) {
        dominantColor = Object.values(colorMap).sort(function (a, b) { return b.count - a.count; })[0];
    }
    if (dominantColor) {
        return renderDominantColor(dominantColor.rgb);
    }
    alert('Dominant color not found. Please check your source.');
};
var handleCopyToClipboard = function (value) {
    if (!navigator) {
        return;
    }
    navigator.clipboard.writeText(value);
    alert("".concat(value, " copied to clipboard!"));
};
getColorsButton === null || getColorsButton === void 0 ? void 0 : getColorsButton.addEventListener('click', renderImage);
imageUrlInput === null || imageUrlInput === void 0 ? void 0 : imageUrlInput.addEventListener('change', handleUrlInput);
imageUploadInput === null || imageUploadInput === void 0 ? void 0 : imageUploadInput.addEventListener('change', handleUpload);
dropArea === null || dropArea === void 0 ? void 0 : dropArea.addEventListener('dragenter', handleDragIn);
dropArea === null || dropArea === void 0 ? void 0 : dropArea.addEventListener('dragleave', handleDragOut);
dropArea === null || dropArea === void 0 ? void 0 : dropArea.addEventListener('dragover', handleDrag);
dropArea === null || dropArea === void 0 ? void 0 : dropArea.addEventListener('drop', handleDrop);
dropArea === null || dropArea === void 0 ? void 0 : dropArea.addEventListener('click', handleDragAreaClick);
copyRgbButton === null || copyRgbButton === void 0 ? void 0 : copyRgbButton.addEventListener('click', function () {
    return handleCopyToClipboard(rgbColor.innerText);
});
copyHexButton === null || copyHexButton === void 0 ? void 0 : copyHexButton.addEventListener('click', function () {
    return handleCopyToClipboard(hexColor.innerText);
});
