import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log('Connected to MongoDB')
  } catch (err) {
    console.log('Error connecting to MongoDB', err)
    throw err
  }
}

export default connectDB