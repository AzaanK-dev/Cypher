import mongoose from "mongoose";
// import dns from "node:dns";

// dns.setServers(["1.1.1.1", "8.8.8.8"]);

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

export async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to DB");
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '')
        connection.isConnected = db.connections[0].readyState
        console.log("DB connected successfully");

    } catch (err) {
        console.error("DB connection failed:", err);
        throw err;

    }
}