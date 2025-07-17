import * as ImagePicker from 'expo-image-picker';

const CLOUDINARY_UPLOAD_PRESET = 'foodFindr';
const CLOUDINARY_CLOUD_NAME = 'djzy9hfvq';

/**
 * Opens the device's image library and lets the user pick an image.
 * Returns the local URI of the picked image, or null if canceled.
 */
export const pickImage = async (): Promise<string | null> => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.8,
  });

  if (!result.canceled && result.assets.length > 0) {
    return result.assets[0].uri;
  }
  return null;
};

/**
 * Uploads a local image URI to Cloudinary using an unsigned preset.
 * Returns the secure URL of the uploaded image.
 *
 * @param photoUri Local URI of the image
 */
export const uploadToCloudinary = async (photoUri: string): Promise<string> => {
  const data = new FormData();
  data.append('file', {
    uri: photoUri,
    type: 'image/jpeg',
    name: 'upload.jpg',
  } as any);

  data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  data.append('folder', 'userPFP');
  
  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: data,
  });

  const result = await response.json();

  if (!result.secure_url) {
    console.error('Cloudinary upload failed:', result);
    throw new Error('Cloudinary upload failed');
  }

  return result.secure_url;
};
