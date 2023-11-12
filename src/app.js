const express = require('express');
const mongoose = require('mongoose');
const app = express();
const env = require('dotenv');
const cors = require('cors');
const path = require('path')

env.config();

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

app.use(
    cors({
        "origin": "*"
    })
)


app.use(express.json());
// app.use(cors());
app.use('/public', express.static(path.join(__dirname, 'uploads')))

app.use('/oldarya', userRoutes);
app.use('/oldarya', notesRoutes);
app.use('/oldarya', itemRoutes);

app.listen(process.env.PORT || 3002, () => {
    console.log(`Server running on port ${process.env.PORT}`)
})