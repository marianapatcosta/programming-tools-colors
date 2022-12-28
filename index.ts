/* Elements */
const dropArea = document.getElementById('drag-area')
const imageUrlInput = document.getElementById('image-url') as HTMLInputElement
const imageUploadInput = document.getElementById('image-upload')
const imagePreview = document.getElementById(
  'image-preview'
) as HTMLImageElement
const getColorsButton = document.getElementById('generate-button')
const colorsContainer = document.getElementById('colors')
const rgbColor = document.getElementById('rgb-color')
const hexColor = document.getElementById('hex-color')
const copyRgbButton = document.getElementById('copy-rgb')
const copyHexButton = document.getElementById('copy-hex')

imagePreview.classList.add('hidden')
colorsContainer.classList.add('hidden')
getColorsButton?.setAttribute('disabled', 'disabled')

const BLACK_COLOR_ID = '0-0-0'
const WHITE_COLOR_ID = '255-255-255'
let imageUrl = ''

const reset = () => {
  imageUrl = ''
  colorsContainer.classList.add('hidden')
  getColorsButton?.setAttribute('disabled', 'disabled')
  imagePreview.src = ''
  imagePreview.classList.add('hidden')
  imageUrlInput.value = ''
}

const getImageUrl = (file) => {
  if (!file) return
  if (imageUrl) {
    reset()
  }

  if (!file.type.includes('image')) {
    alert(`Invalid file: please upload only image files.`)
    return
  }
  const reader = new FileReader()
  reader.addEventListener('loadend', () => {
    imageUrl = reader.result as string
    getColorsButton?.removeAttribute('disabled')
    imagePreview.src = imageUrl
    imagePreview.classList.remove('hidden')
  })

  reader.readAsDataURL(file)
}

const handleDrag = (event) => {
  event.preventDefault()
  event.stopPropagation()
  dropArea.classList.add('dragging')
}

const handleDragIn = (event) => {
  event.preventDefault()
  event.stopPropagation()
  if (event.dataTransfer.items && event.dataTransfer.items.length) {
    dropArea.classList.add('dragging')
  }
}

const handleDragOut = (event) => {
  event.preventDefault()
  event.stopPropagation()
  dropArea.classList.remove('dragging')
}

const handleDrop = (event) => {
  event.preventDefault()
  event.stopPropagation()
  dropArea.classList.remove('dragging')
  if (event.dataTransfer.files && event.dataTransfer.files.length) {
    getImageUrl(event.dataTransfer.files[0])
    event.dataTransfer.clearData()
  }
}

const handleDragAreaClick = () => {
  imageUploadInput.click()
}

const handleUpload = (event) => {
  if (!event.target.files) return
  getImageUrl(event.target.files[0])
}

const handleUrlInput = (event) => {
  if (!event.target.value && imageUrl) {
    reset()
    return
  }
  if (!event.target.validity.valid) {
    alert(`Please enter a valid URL.`)
    getColorsButton?.setAttribute('disabled', 'disabled')
    return
  }

  imageUrl = event.target.value
  getColorsButton?.removeAttribute('disabled')
}

const renderImage = () => {
  if (!imageUrl) {
    return
  }
  const canvas = document.createElement('canvas')

  const context = canvas.getContext('2d')
  const image = new Image()
  image.crossOrigin = 'Anonymous'
  image.src = imageUrl
  image.onload = () => {
    canvas.height = image.height
    canvas.width = image.width
    context!.drawImage(image, 0, 0)

    const imageData = context!.getImageData(
      0,
      0,
      image.width,
      image.height
    ).data

    getDominantColor(imageData)
  }

  image.onerror = () => {
    alert('Dominant color not found. Please check your source.')
  }
}

const rgbToHex = (r: string, g: string, b: string): string =>
  `#${[r, g, b].map((x) => Number(x).toString(16).padStart(2, '0')).join('')}`

const renderDominantColor = (dominantColor: string) => {
  const [r, g, b] = dominantColor.split('-')
  const hexDominant = rgbToHex(r, g, b)
  const rgbDominant = `rgb(${r}, ${g}, ${b})`
  colorsContainer.classList.remove('hidden')
  rgbColor.innerText = rgbDominant
  hexColor.innerText = hexDominant
}

const getDominantColor = (imageData: Uint8ClampedArray) => {
  const colorMap = {} as { [key: string]: { rgb: string; count: number } }
  for (let i = 0; i < imageData.length; i += 4) {
    const r = imageData[i]
    const g = imageData[i + 1]
    const b = imageData[i + 2]
    const rgb = `${r}-${g}-${b}`

    if (rgb in colorMap) {
      colorMap[rgb].count = colorMap[rgb].count + 1
    } else {
      colorMap[rgb] = { rgb, count: 1 }
    }
  }
  let dominantColor = Object.values(colorMap)
    .sort((a, b) => b.count - a.count)
    .find(
      (color) => color.rgb !== BLACK_COLOR_ID && color.rgb !== WHITE_COLOR_ID
    )
  if (!dominantColor) {
    dominantColor = Object.values(colorMap).sort((a, b) => b.count - a.count)[0]
  }

  if (dominantColor) {
    return renderDominantColor(dominantColor.rgb)
  }
  alert('Dominant color not found. Please check your source.')
}

const handleCopyToClipboard = (value) => {
  if (!navigator) {
    return
  }

  navigator.clipboard.writeText(value)
  alert(`${value} copied to clipboard!`)
}

getColorsButton?.addEventListener('click', renderImage)

imageUrlInput?.addEventListener('change', handleUrlInput)
imageUploadInput?.addEventListener('change', handleUpload)

dropArea?.addEventListener('dragenter', handleDragIn)
dropArea?.addEventListener('dragleave', handleDragOut)
dropArea?.addEventListener('dragover', handleDrag)
dropArea?.addEventListener('drop', handleDrop)
dropArea?.addEventListener('click', handleDragAreaClick)

copyRgbButton?.addEventListener('click', () =>
  handleCopyToClipboard(rgbColor.innerText)
)
copyHexButton?.addEventListener('click', () =>
  handleCopyToClipboard(hexColor.innerText)
)
