import { connectMongo } from "@/db/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { name, address, date, startTime, endTime, concept, type, image } = req.body;

    const client = await connectMongo();
    const db = client.db();
    const collection = db.collection("events");

    const event = { name, address, date, startTime, endTime, concept, type, image, createdAt: new Date() };

    const result = await collection.insertOne(event);

    res.status(200).json({ message: "Event added successfully", event: result.insertedId });
}

export default handler;     