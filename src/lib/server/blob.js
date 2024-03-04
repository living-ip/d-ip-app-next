const { Storage } = require('@google-cloud/storage');
const storage = new Storage();

/**
 * Uploads a base64 string to Google Cloud Storage
 * @param {string} base64String - The base64 string to upload
 * @param {string} fileName - Name of the file to be saved in the bucket
 */
export async function uploadBase64ToGCS(base64String, fileName) {
    const bucketName = 'livingip-cdn';
    try {
        const buffer = Buffer.from(base64String, 'base64');
        const bucket = storage.bucket(bucketName);
        const file = bucket.file(fileName);

        await file.save(buffer, {
            validation: 'md5'
        });

        console.log(`File ${fileName} uploaded to ${bucketName}.`);

        return `https://storage.googleapis.com/${bucketName}/${fileName}`;

    } catch (error) {
        console.error('Error uploading file to GCS:', error);
    }
}
