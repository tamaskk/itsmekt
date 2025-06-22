import { NextApiRequest, NextApiResponse } from 'next';
import { connectMongo } from '@/db/mongodb';
import { ObjectId } from 'mongodb';
import { ref, deleteObject } from 'firebase/storage';
import { storage } from '@/db/firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({ message: 'Event ID is required' });
    }

    const client = await connectMongo();
    const db = client.db();

    // First, get the event to find its image URL
    const event = await db.collection('events').findOne({ _id: new ObjectId(_id) });

    if (!event) {
      await client.close();
      return res.status(404).json({ message: 'Event not found' });
    }

    // Delete image from Firebase if it exists
    if (event.image && typeof event.image === 'string') {
      try {
        // Extract the path from the Firebase URL
        const url = new URL(event.image);
        const path = decodeURIComponent(url.pathname.split('/o/')[1]?.split('?')[0] || '');
        
        if (path) {
          const imageRef = ref(storage, path);
          await deleteObject(imageRef);
          console.log('Image deleted from Firebase');
        }
      } catch (error) {
        console.error('Error deleting image from Firebase:', error);
        // Continue with event deletion even if image deletion fails
      }
    }

    // Delete the event from MongoDB
    const result = await db.collection('events').deleteOne({ _id: new ObjectId(_id) });

    await client.close();

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ 
      message: 'Event deleted successfully',
      deletedEventId: _id
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Failed to delete event' });
  }
} 