import cloudinary from "../config/cloudinary";

//helper upload ke cloudinaary via stream buffer
export const uploadToCloudinary = (
    fileBuffer: Buffer,
    folder: string = "posts"
): Promise<{ secure_url: string; public_id: string }> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folder,            //nama folder tujuan 
                resource_type: "image",    // eksplisit tentukan tipe resource sebagai gambar 
            },
            (error: any, result: any) => {
                if (error || !result) return reject(error);
                resolve({
                    secure_url: result.secure_url,
                    public_id: result.public_id,
                });
            }
        );
        uploadStream.end(fileBuffer);
    });
};

//delete from cloudinary 
export const deleteFromCloudinary = (
    publicId: string 
): Promise<void> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(
            publicId,
            {
                resource_type: "image",
            },
            (error) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve();
            }
        );
    });
}