import mongoose from 'mongoose';

mongoose.set('strictQuery', false);

const MONGODB_URI = process.env.MONGODB_URI!.replace(
  '<password>',
  process.env.MONGODB_ADMIN_PASSWORD!
);

const mongoConnect = () => mongoose.connect(MONGODB_URI, {});

export default mongoConnect;
