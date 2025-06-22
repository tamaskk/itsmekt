import { NextApiRequest, NextApiResponse } from 'next';
import { connectMongo } from '@/db/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { 
      soundcloudLinks, 
      youtubeLink, 
      siteTitle, 
      contactEmail, 
      maintenanceMode, 
      theme, 
      primaryColor 
    } = req.body;

    const client = await connectMongo();
    const db = client.db();

    // Update or insert system settings
    await db.collection('systemSettings').updateOne(
      {},
      { $set: {
        soundcloudLinks: soundcloudLinks || [
          { title: '', url: '' },
          { title: '', url: '' },
          { title: '', url: '' }
        ],
        youtubeLink: youtubeLink || '',
        siteTitle: siteTitle || 'My Event Site',
        contactEmail: contactEmail || 'admin@example.com',
        maintenanceMode: maintenanceMode || false,
        theme: theme || 'Light',
        primaryColor: primaryColor || '#3B82F6',
        updatedAt: new Date()
      } },
      { upsert: true }
    );

    await client.close();

    res.status(200).json({ message: 'System settings updated successfully' });
  } catch (error) {
    console.error('Error updating system settings:', error);
    res.status(500).json({ message: 'Failed to update system settings' });
  }
} 