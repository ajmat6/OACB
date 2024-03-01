const express = require('express');
const mongoose = require('mongoose');
const app = express();
const env = require('dotenv');
const cors = require('cors');
const path = require('path')
const cron = require('node-cron')
const User = require('./models/User')

env.config({ path: path.resolve(__dirname, '.env') });


// Routes import:
const userRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');
const itemRoutes = require('./routes/items');

mongoose.connect(
    `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.kfhqqjb.mongodb.net/?retryWrites=true&w=majority`,
    {
        useNewUrlParser:true,
        useUnifiedTopology:true,
    }
)
.then(() => {
    console.log("Database Connected");
})

app.use(cors({"origin": "*"}))


app.use(express.json());
app.use(cors());
app.use('/public', express.static(path.join(__dirname, 'uploads')))

app.use('/oldarya', userRoutes);
app.use('/oldarya', notesRoutes);
app.use('/oldarya', itemRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
})

// Cron job for deleting users who do not verify them in one hour automatically:
// npm install node-cron
cron.schedule('0 * * * *', async () => {
    try {
      // Calculate the timestamp one hour ago
      const oneHourAgo = new Date();
      oneHourAgo.setHours(oneHourAgo.getHours() - 1);
  
      // Find unverified users created more than one hour ago
      const unverifiedUsers = await User.find({
        verified: false,
        createdAt: { $lt: oneHourAgo }
      });
  
      // Delete the unverified users
      await User.deleteMany({
        verified: false,
        createdAt: { $lt: oneHourAgo }
      });
  
      console.log(`Deleted ${unverifiedUsers.length} unverified users older than one hour.`);
    } catch (error) {
      console.error('Error deleting unverified users:', error);
    }
  });