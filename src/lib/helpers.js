import {centerCrop, makeAspectCrop} from "react-image-crop";
import {useEffect} from "react";

export const centerAspectCrop = (
    mediaWidth,
    mediaHeight,
    aspect
) => (
    centerCrop(
        makeAspectCrop(
            {
              unit: '%',
              width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight
    )
)

export const canvasPreview = async (
    image,
    canvas,
    crop,
    scale = 1
) => {
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('no 2d contex')
  }

  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height

  const pixelRatio = window.devicePixelRatio

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio)
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio)

  ctx.scale(pixelRatio, pixelRatio)
  ctx.imageSmoothingQuality = 'high'

  const cropX = crop.x * scaleX
  const cropY = crop.y * scaleY

  const centerX = image.naturalWidth / 2
  const centerY = image.naturalHeight / 2

  ctx.save()

  // 5) Move the crop origin to the canvas origin (0,0)
  ctx.translate(-cropX, -cropY)
  // // 4) Move the origin to the center of the original position
  ctx.translate(centerX, centerY)
  // // 2) Scale the image
  ctx.scale(scale, scale)
  // // 1) Move the center of the image to the origin (0,0)
  ctx.translate(-centerX, -centerY)
  ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
  )

  ctx.restore()
}

export const useDebounceEffect = (
    fn,
    waitTime,
    deps
) => {
  useEffect(() => {
    const t = setTimeout(() => {
      fn.apply(undefined, deps)
    }, waitTime)

    return () => {
      clearTimeout(t)
    }
  }, deps)
}