import { Redis } from '@upstash/redis';

export const databaseName = process.env.NODE_ENV === 'development' ? 'todos-dev' : 'todos';
const redis = Redis.fromEnv();

export default redis;
