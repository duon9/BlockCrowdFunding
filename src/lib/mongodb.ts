import { MongoClient, Db } from 'mongodb'

const MONGODB_URI = process.env.DATABASE_URL

if (!MONGODB_URI && process.env.NODE_ENV !== 'production') {
  console.warn('Missing environment variable: "DATABASE_URL"')
}

interface MongoConnection {
  client: MongoClient
  db: Db
}

let cachedConnection: MongoConnection | null = null

export async function connectToDatabase(): Promise<MongoConnection> {
  if (cachedConnection) {
    return cachedConnection
  }

  if (!MONGODB_URI) {
    throw new Error('Invalid/missing environment variable: "DATABASE_URL"')
  }

  const client = new MongoClient(MONGODB_URI as string)

  try {
    await client.connect()
    const db = client.db()

    cachedConnection = {
      client,
      db,
    }

    return cachedConnection
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
    throw error
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (cachedConnection) {
    await cachedConnection.client.close()
    cachedConnection = null
  }
}
