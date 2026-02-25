import axios from 'axios'

const CLOUDINARY_API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
  console.warn('[v0] Cloudinary configuration incomplete')
}

export async function uploadImageToCloudinary(
  file: File
): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET || '')

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )

    return response.data.secure_url
  } catch (error) {
    console.error('[v0] Cloudinary upload error:', error)
    throw new Error('Failed to upload image')
  }
}

export function getCloudinaryUrl(publicId: string, options = {}) {
  const defaultOptions = {
    width: 500,
    height: 500,
    crop: 'fill',
    quality: 'auto',
    format: 'webp',
  }

  const params = new URLSearchParams({
    ...defaultOptions,
    ...options,
  })

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${params.toString()}/${publicId}`
}
