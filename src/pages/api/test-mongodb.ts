import { NextApiRequest, NextApiResponse } from 'next';
import { connectMongo } from '@/db/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Test connection
    const client = await connectMongo();
    const db = client.db();
    
    // List all collections
    const collections = await db.listCollections().toArray();
    
    await client.close();
    
    res.status(200).json({ 
      message: 'MongoDB connection successful',
      collections: collections.map(col => col.name),
      messagesCollectionExists: collections.some(col => col.name === 'messages')
    });
  } catch (error) {
    console.error('MongoDB connection test failed:', error);
    
    res.status(500).json({ 
      message: 'MongoDB connection test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 