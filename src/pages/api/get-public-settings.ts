import { NextApiRequest, NextApiResponse } from 'next';
import { connectMongo } from '@/db/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const client = await connectMongo();
    const db = client.db();
    
    // Get system settings from the database
    const settings = await db.collection('systemSettings').findOne({});
    
    await client.close();
    
    // Return only public settings (music links)
    const publicSettings = {
      soundcloudLinks: settings?.soundcloudLinks || [
        { title: '', url: '' },
        { title: '', url: '' },
        { title: '', url: '' }
      ],
      youtubeLink: settings?.youtubeLink || ''
    };
    
    res.status(200).json({ 
      settings: publicSettings 
    });
  } catch (error) {
    console.error('Error fetching public settings:', error);
    res.status(500).json({ message: 'Failed to fetch public settings' });
  }
} 