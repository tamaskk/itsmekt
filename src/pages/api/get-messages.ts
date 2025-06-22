import { connectMongo } from "@/db/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const client = await connectMongo();
    const db = client.db();

    const messages = await db.collection('messages').find({}).toArray();

    await client.close();

    res.status(200).json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
  }
}

export default handler;