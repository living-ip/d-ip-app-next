const { Storage } = require('@google-cloud/storage');

const getGCPCredentials = () => {
    // for Vercel, use environment variables
    return process.env.GCP_PRIVATE_KEY
      ? {
          credentials: {
            client_email: process.env.GCP_SERVICE_ACCOUNT_EMAIL,
            private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDyKUpA5VycRQyu\nAD3fV7z8jBMp91EJaTNDtCV2KLkgAPoZcjqivoTOAijHc7AoXLGSXIqE1YJwHbAp\nF7p/GRMVLsqi7jnZG75GqNvguHnriAo8hUvGOCDm/QKKeXPwUzc9eQWZu5GiYK9A\n/TYLzvuRecltdJ65v0Zx0Wa/wXUCqTSrsMgZLBPEzLu7oJqA6uF4upXxXVx7yx/L\n6qpcP5eFPwqyZyue2W74YSSckfgu9Bf3cb+h5yrvaSrZItA5LzN51SwXsQPjBWLZ\nj3eo+9POxk7zIxqUQfI7dDoEVDCEsgbKmXpbKD3lLHpSHbiY1bHNAWVN/K7gHtR9\nLB0vo5O/AgMBAAECggEAVXVs1uoafKuBhgZfz2nPL/De8nhtCL0vcj0o20IT0s+F\nc2V0e+pwQ6NPcNPK3vOXVueBms8ecSKJAHd3QVNAAMG6kTUxBQVdaOI+dlej7xLb\nSfBghVtZgSrYsrWZzL4RSIhlCZPAGWW1c2HoqNIqxXQNOatmOHbgDVqwwAstl/oe\n9PfwMwfVYC39iUiWbJBjx5Pdy4z0iyMcuGfc7rvERLcFsaRbj0MqTNMZXdY2jDWS\nds0XxJIE4CG+u4Mlnztx4UV4RHsms3e9mUa/76dwaYeSYPUXfOIYdYeL/0la+7lp\ncOFi8N5HF5az/lrwk30/v0Q5vUH52RNfOJYJdhBhQQKBgQD73qoa4zqDUV7axhhz\n63wpDnRJluMCUSj/dfFYk7uOkzAyixdMg5rXa72vVlRc0C0Wxkx1CA2ZROhu9zMM\nonMoXyAviEuxgDncjQK8/WDkAn9nZfmGFtlZe+WGGpP5Z2V7umfCB+OpK8o4fg2a\nDKfXXUIBaabF/zAysbwzrK+zmwKBgQD2Id6u3D3NSPnnE7+WMGjInsoAj31F+dh/\nfSav1vEYnRn5nk0oTDolrF5R7qsvIm3CoHVyE3+sj8ac65FbP/FtV+cW1o19FSdA\nVS33bwshMtGewcRzQvKWieVJ16CT2/0OW8kCxXwaSD2OuREa7zPtbMgOmelx69rL\nGqG+V4rcrQKBgQClGEkMItHh7d5tLNguc7cI+m6DJiJbDHQBL4ApfXy9cgFvv/hf\nsQw4FGlbmwzlYZeMjCLlu4eeZaqtwd92cq1lUyU3wvFKwjArP0sCMlvmWTTFw/QR\nTrzdiPbkNlu0aW/98Cu+5Yj3BLsi2I114sHJy1lOr8AfnKwtLo+cl5777QKBgD+q\nUyd34KSRE9Mp0IzQyMncCPRMKWNIVS/k93TUbFipimZ/BAZAcWn9RAh9a9otVaba\nSobPdF72cbF1XYv05kYaTrQhm0eXiSei4Nj36DEWLBKcnGwUDRvTX3PSSr70UGi+\nZShKXOePeBzK0hndddkcIkNknHXTRCz1HpFVo52hAoGBANlw2T5Bd3PA3ye9UauA\nWQlwOIJg9UPtVwVAeUFr9b+PrxvGpEhntPPmkktrMNaoXE1APZqzj2tM6OTMCI0U\nvCPcwMxJ7FmKg19VYVWEO6BwedSWZiuSzV2Qu27gSOgOscTCILlyhc0/fLoyrptC\ngrubGpqMU4lK12kdUps0bbqF\n-----END PRIVATE KEY-----\n",
          },
          projectId: process.env.GCP_PROJECT_ID,
        }
        // for local development, use gcloud CLI
      : {};
  };


const storage = new Storage(getGCPCredentials());

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
