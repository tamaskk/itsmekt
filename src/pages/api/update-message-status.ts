import { NextApiRequest, NextApiResponse } from 'next';
import { connectMongo } from '@/db/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { messageId, status } = req.body;

    if (!messageId) {
      return res.status(400).json({ message: 'Message ID is required' });
    }

    if (!status || !['new', 'read'].includes(status)) {
      return res.status(400).json({ message: 'Status must be "new" or "read"' });
    }

    const client = await connectMongo();
    const db = client.db();

    // Update message status
    const result = await db.collection('messages').updateOne(
      { _id: new ObjectId(messageId) },
      {
        $set: {
          status,
          updatedAt: new Date()
        }
      }
    );

    await client.close();

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.status(200).json({ 
      message: 'Message status updated successfully',
      status 
    });
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({ message: 'Failed to update message status' });
  }
} 