import { NextApiRequest, NextApiResponse } from 'next';
import { connectMongo } from '@/db/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { _id, name, address, date, startTime, endTime, concept, image, type } = req.body;

    if (!_id) {
      return res.status(400).json({ message: 'Event ID is required' });
    }

    const client = await connectMongo();
    const db = client.db();

    // Update the event in the database
    const result = await db.collection('events').updateOne(
      { _id: new ObjectId(_id) },
      {
        $set: {
          name,
          address,
          date,
          startTime,
          endTime,
          concept,
          image,
          type,
          updatedAt: new Date()
        }
      }
    );

    await client.close();

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (result.modifiedCount === 0) {
      return res.status(200).json({ message: 'No changes made to event' });
    }

    res.status(200).json({ 
      message: 'Event updated successfully',
      event: { _id, name, address, date, startTime, endTime, concept, image, type }
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Failed to update event' });
  }
} 