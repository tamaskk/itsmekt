import { NextApiRequest, NextApiResponse } from 'next';
import { connectMongo } from '@/db/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const client = await connectMongo();
    const db = client.db();
    
    // Fetch all events from the database
    const events = await db.collection('events').find({}).toArray();
    
    // Fetch system settings (single document)
    let systemSettings = await db.collection('systemSettings').findOne({}) || {
      soundcloudLinks: [
        { title: '', url: '' },
        { title: '', url: '' },
        { title: '', url: '' }
      ],
      youtubeLink: '',
      siteTitle: 'My Event Site',
      contactEmail: 'admin@example.com',
      maintenanceMode: false,
      theme: 'Light',
      primaryColor: '#3B82F6'
    };

    // Migrate old format to new format if needed
    if (systemSettings && Array.isArray(systemSettings.soundcloudLinks) && typeof systemSettings.soundcloudLinks[0] === 'string') {
      // Convert old string format to new object format
      const migratedSettings = {
        ...systemSettings,
        soundcloudLinks: systemSettings.soundcloudLinks.map(url => ({ title: '', url: url || '' }))
      };
      
      // Update the database with the new format (only if settings exist in DB)
      if ('_id' in systemSettings) {
        await db.collection('systemSettings').updateOne(
          { _id: systemSettings._id },
          { $set: { soundcloudLinks: migratedSettings.soundcloudLinks } }
        );
      }
      
      systemSettings = migratedSettings;
    }
    
    // Close the connection
    await client.close();
    
    // Return the events and system settings
    res.status(200).json({ events, systemSettings });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Failed to fetch events' });
  }
} 