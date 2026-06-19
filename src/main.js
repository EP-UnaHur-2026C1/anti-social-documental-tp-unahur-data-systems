const express = require('express');
const app = express();
const { connectToDatabase } = require('./db/mongodb')
const PORT = process.env.PORT ?? 3050;

app.use(express.json());



app.listen(PORT, async (err) => {
    if (err) {
        console.error(err.message);
        procces.exit(1);
    }
    try {
        await connectToDatabase();
        console.log(`App iniciada en localhost:${PORT}`);
    } catch (errorDb) {
        console.error(errorDb.message);
        process.exit(1);
    }
})