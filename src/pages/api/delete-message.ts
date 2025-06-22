import { NextApiRequest, NextApiResponse } from 'next';
import { connectMongo } from '@/db/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { messageId } = req.body;

    if (!messageId) {
      return res.status(400).json({ message: 'Message ID is required' });
    }

    const client = await connectMongo();
    const db = client.db();

    // Delete message from database
    const result = await db.collection('messages').deleteOne({
      _id: new ObjectId(messageId)
    });

    await client.close();

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.status(200).json({ 
      message: 'Message deleted successfully',
      deletedMessageId: messageId
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Failed to delete message' });
  }
} 