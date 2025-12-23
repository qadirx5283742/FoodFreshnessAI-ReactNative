import { Client, Databases, Storage } from 'react-native-appwrite';

const config = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
    usersCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
    scansCollectionId: process.env.EXPO_PUBLIC_APPWRITE_SCANS_COLLECTION_ID!,
    bucketId: process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID!,
};

const client = new Client();

client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setPlatform('com.sp22.foodfreshnessai'); // Platform ID from app.json

export const databases = new Databases(client);
export const storage = new Storage(client);

export const APPWRITE_CONFIG = config;

export default client;
