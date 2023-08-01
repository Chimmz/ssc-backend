import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

type CloudinaryFolder = 'users' | 'startup-logos';

class CloudinaryService {
  #config = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  };

  constructor() {
    cloudinary.config(this.#config);
  }

  async upload(folder: CloudinaryFolder, filePath: string): Promise<UploadApiResponse> {
    return await cloudinary.uploader.upload(filePath, { overwrite: true, folder });
  }
}

export default new CloudinaryService();
