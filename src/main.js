import AppwriteService from './appwrite.js';
import { HfInference } from '@huggingface/inference';


export default async ({ req, res, log, error }) => {
  const hf = new HfInference(process.env.HUGGING_FACE_API_KEY);
  const databaseId = process.env.APPWRITE_DATABASE_ID ?? '67486793003703b3bac7';
  const collectionId = process.env.APPWRITE_COLLECTION_ID ?? '674867b000385dc5ae5b';
  const bucketId = process.env.APPWRITE_BUCKET_ID ?? 'imageRecognition';
  
  // Initialize Appwrite service
  const appwrite = new AppwriteService();

  // Allows using direct execution or file create event
  const fileId = req.body.$id || req.body.imageId;
  if (!fileId) return res.text('Bad request', 400);

  if ( req.body.bucketId && req.body.bucketId != bucketId) return res.text('Bad request', 400);

  // Get file from Appwrite storage
  const file = await appwrite.getFile(bucketId, fileId);

  const result = await hf.objectDetection({ data: file, model: 'facebook/detr-resnet-50' });


  const imageLabel = await appwrite.createImageLabels(databaseId, collectionId, fileId, result);

  log('Image ' + fileId + ' detected', result);
  return res.json(result);
}
