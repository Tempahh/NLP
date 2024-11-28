import { Client, Databases, ID, Storage } from 'node-appwrite';

class AppwriteService {
  constructor() {
    const client = new Client();
    client.setEndpoint(process.env.APPWRITE_ENDPOINT ?? 'https://cloud.appwrite.io/v1')
      .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID || 'imageRecognition')
      .setKey(process.env.APPWRITE_API_KEY || 'standard_00900db8fea11cb45dc854ca83df13e3e03e9358e742710f23e6766726206a5566b0ec01940b8b80c34843307e8dadc23eb4c706d00232fd2e1c9a5311f41f755e66fce945451355ea199d0148467a6f2652a5397587a65508e0ca36a656db4d94819c45c086414ff018e5bd04f25de0c836a24c2bb027431c6080348e49a9ed');
    // Initialize services
    this.databases = new Databases(client);
    this.storage = new Storage(client);
  }

  async getFile(bucketId, fileId) {
    // Get file from Appwrite storage
    if (!bucketId || !fileId) {
      log('Bucket ID and File ID are required');
    }

    const file = await this.storage.getFileDownload(bucketId, fileId);

    if (!file) { log('File not found') } else return file 
  }

  async createImageLabels(databaseId, collectionId, imageId, labels)
    {
        await this.databases.createDocument( databaseId, collectionId, ID.unique(),{image: imageId, labels: JSON.stringify(labels)});
    }
}

export default AppwriteService;
