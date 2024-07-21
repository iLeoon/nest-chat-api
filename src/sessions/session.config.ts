import { ConnectMongoOptions } from 'connect-mongo/build/main/lib/MongoStore';
export default {
  mongoUrl: process.env.MONGO_URI,
  dbName: process.env.NODE_ENV === 'test' ? 'chat-app-test' : 'chat-app',
} as ConnectMongoOptions;
