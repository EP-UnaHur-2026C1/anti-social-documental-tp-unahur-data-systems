# API de Anti-Social Net

## Descripción
Esta API permite crear usuarios, publicar posts, agregar comentarios, asociar etiquetas e imágenes, además de seguir usuarios y ver un feed personalizado.

## Requisitos
- Node.js 18+
- MongoDB en ejecución
- npm
- Docker Desktop (opcional, recomendado para levantar MongoDB)

## Variables de entorno
Crear un archivo `.env` con:

```env
PORT=3050
MONGO_URL=mongodb://admin:admin123@127.0.0.1:27017/antisocial?authSource=admin
TIEMPO_MAX_COMENTARIO=6
```

## Instalación

### Inicialización rápida (recomendada con Docker)

1. Instalar dependencias:

```bash
npm install
```

2. Levantar MongoDB con Docker Compose:

```bash
docker compose up -d
```

3. Iniciar la API:

```bash
npm run dev
```

4. Verificar que la API esté disponible en:

```text
http://localhost:3050/api-docs
```

### Inicialización local (sin Docker)

1. Asegurarse de tener MongoDB levantado en `localhost:27017` con las credenciales configuradas en `MONGO_URL`.
2. Instalar dependencias y arrancar la API:

```bash
npm install
npm run dev
```

### Comandos útiles de Docker

Levantar servicios:

```bash
docker compose up -d
```

Ver estado:

```bash
docker compose ps
```

Ver logs de Mongo:

```bash
docker compose logs -f mongo
```

Apagar servicios:

```bash
docker compose down
```

## Swagger y OpenAPI
- UI de Swagger: `http://localhost:3050/api-docs`
- Especificación OpenAPI: `src/docs/openapi.yaml`

## Endpoints principales

### Usuarios
- `GET /api/usuarios`
- `GET /api/usuarios/:id`
- `POST /api/usuarios`
- `PUT /api/usuarios/:id`
- `DELETE /api/usuarios/:id`
- `POST /api/usuarios/seguir`
- `POST /api/usuarios/dejar-seguir`
- `GET /api/usuarios/:id/feed`

### Posts
- `GET /api/posts`
- `GET /api/posts/:postId`
- `POST /api/posts`
- `PUT /api/posts/:postId`
- `DELETE /api/posts/:postId`
- `POST /api/posts/:postId/etiquetas`
- `DELETE /api/posts/:postId/etiquetas/:etiquetaId`
- `POST /api/posts/:postId/imagenes`
- `POST /api/posts/:postId/imagenes/upload`
- `DELETE /api/posts/:postId/imagenes/:imagenId`

### Comentarios
- `GET /api/comentarios`
- `GET /api/comentarios/:comentarioId`
- `PUT /api/comentarios/:comentarioId`
- `DELETE /api/comentarios/:comentarioId`
- `POST /api/posts/:postId/comentarios`

## Reglas de negocio
- Un usuario debe tener un `nickName` único.
- Un post requiere descripción.
- Los comentarios visibles dependen de `TIEMPO_MAX_COMENTARIO`.
- Una imagen puede subirse al servidor y quedar disponible en la carpeta `uploads/posts`.

## Bonus implementados
- Seguidores y seguidos en el modelo de usuario.
- Subida de imágenes al servidor.
- Caché simple en memoria para posts y feed.

## Documentación Swagger
La documentación está disponible en:

```text
http://localhost:3050/api-docs
```

## Colección Postman
Se incluye una colección lista para importar en:

```text
docs/postman/Anti-Social.postman_collection.json
```

Y un entorno de Postman en:

```text
docs/postman/Anti-Social.postman_environment.json
```

Variables recomendadas en Postman:
- `baseUrl`: `http://localhost:3050`
- `usuarioId`: id de un usuario existente
- `otroUsuarioId`: id del usuario a seguir
- `postId`: id de un post existente

## Ejemplos de uso

### Crear usuario

Request:

```http
POST /api/usuarios
Content-Type: application/json

{
	"nickName": "vegeta"
}
```

Response esperada (201):

```json
{
	"nickName": "vegeta",
	"seguidos": [],
	"seguidores": []
}
```

### Crear post

Request:

```http
POST /api/posts
Content-Type: application/json

{
	"descripcion": "Entrenando para el torneo",
	"usuarioId": "TU_USUARIO_ID"
}
```

Response esperada (201):

```json
{
	"_id": "...",
	"descripcion": "Entrenando para el torneo",
	"usuarioId": "TU_USUARIO_ID",
	"etiquetas": []
}
```

### Comentar un post

Request:

```http
POST /api/posts/{postId}/comentarios
Content-Type: application/json

{
	"contenido": "Buen post!",
	"usuarioId": "TU_USUARIO_ID"
}
```

Response esperada (201):

```json
{
	"_id": "...",
	"contenido": "Buen post!",
	"usuarioId": "TU_USUARIO_ID",
	"postId": "TU_POST_ID"
}
```

### Seguir usuario

Request:

```http
POST /api/usuarios/seguir
Content-Type: application/json

{
	"seguidorId": "ID_USUARIO_A",
	"seguidoId": "ID_USUARIO_B"
}
```

Response esperada (200):

```json
{
	"message": "Ahora seguís a 'nickDelUsuario' correctamente."
}
```

### Obtener feed

Request:

```http
GET /api/usuarios/{id}/feed
```

Response esperada (200):

```json
[
	{
		"_id": "...",
		"descripcion": "...",
		"usuarioId": {
			"_id": "...",
			"nickName": "..."
		}
	}
]
```

### Subir imagen de post (bonus)

Request:

```http
POST /api/posts/{postId}/imagenes/upload
Content-Type: multipart/form-data

campo: imagen (file)
```

Response esperada (201):

```json
{
	"_id": "...",
	"url": "/uploads/posts/TU_POST_ID/imagen-...jpg",
	"postId": "TU_POST_ID"
}
```