require('dotenv').config();
const express = require('express');
const app = express();
const { connectToDatabase } = require('./db/mongodb');
const PORT = process.env.PORT ?? 3050;

const usuarioRoutes = require('./routes/usuarioRoutes');
const comentarioRoutes = require('./routes/comentarioRoutes');
const postRoutes = require('./routes/postRoutes');
const etiquetaRoutes = require('./routes/etiquetaRoutes');

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/usuarios', usuarioRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comentarios', comentarioRoutes);
app.use('/api/etiquetas', etiquetaRoutes);


app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.listen(PORT, async (err) => {
    if (err) {
        console.error(err.message);
        process.exit(1);
    }
    try {
        await connectToDatabase();
        console.log(`App iniciada en localhost:${PORT}`);
    } catch (errorDb) {
        console.error(errorDb.message);
        process.exit(1);
    }
})