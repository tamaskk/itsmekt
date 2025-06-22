import { NextApiRequest, NextApiResponse } from 'next';
import { connectMongo } from '@/db/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const client = await connectMongo();
    const db = client.db();
    
    // Create message object
    const messageData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      status: 'new', // 'new' or 'read'
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert message into database
    const result = await db.collection('messages').insertOne(messageData);
    
    await client.close();
    
    res.status(201).json({ 
      message: 'Message sent successfully',
      messageId: result.insertedId 
    });
  } catch (error) {
    console.error('Error adding message:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
} 