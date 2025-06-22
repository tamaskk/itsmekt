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
    
    // Migrate old format to new format if needed
    let migratedSettings = settings;
    if (settings && Array.isArray(settings.soundcloudLinks) && typeof settings.soundcloudLinks[0] === 'string') {
      // Convert old string format to new object format
      migratedSettings = {
        ...settings,
        soundcloudLinks: settings.soundcloudLinks.map(url => ({ title: '', url: url || '' }))
      };
      
      // Update the database with the new format (only if settings exist in DB)
      if ('_id' in settings) {
        const client2 = await connectMongo();
        const db2 = client2.db();
        await db2.collection('systemSettings').updateOne(
          { _id: settings._id },
          { $set: { soundcloudLinks: migratedSettings.soundcloudLinks } }
        );
        await client2.close();
      }
    }
    
    // Return default settings if none exist
    const defaultSettings = {
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
    
    res.status(200).json({ 
      settings: migratedSettings || defaultSettings 
    });
  } catch (error) {
    console.error('Error fetching system settings:', error);
    res.status(500).json({ message: 'Failed to fetch system settings' });
  }
} 