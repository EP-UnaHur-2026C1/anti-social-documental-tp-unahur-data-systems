require('dotenv').config();
const express = require('express');
const app = express();
const { connectToDatabase } = require('./db/mongodb');
const path = require('path');
const PORT = process.env.PORT ?? 3050;

const usuarioRoutes = require('./routes/usuarioRoutes');
const comentarioRoutes = require('./routes/comentarioRoutes');
const postRoutes = require('./routes/postRoutes');
const etiquetaRoutes = require('./routes/etiquetaRoutes');

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use('/api/usuarios', usuarioRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comentarios', comentarioRoutes);
app.use('/api/etiquetas', etiquetaRoutes);


app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

const startServer = async () => {
    await connectToDatabase();
    const server = app.listen(PORT, () => {
        console.log(`App iniciada en localhost:${PORT}`);
    });

    return server;
};

if (require.main === module) {
    startServer().catch((errorDb) => {
        console.error(errorDb.message);
        process.exit(1);
    });
}

module.exports = { app, startServer };