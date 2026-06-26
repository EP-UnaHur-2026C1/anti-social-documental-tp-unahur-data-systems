const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

const { app } = require('../src/main');
const { connectToDatabase, mongoose } = require('../src/db/mongodb');
const Usuario = require('../src/mongoSchemas/usuarioSchema');
const Post = require('../src/mongoSchemas/postSchema');
const Comentario = require('../src/mongoSchemas/comentarioSchema');
const PostImagen = require('../src/mongoSchemas/postImagenSchema');

const created = {
  usuarios: [],
  posts: [],
  comentarios: [],
  imagenes: []
};

const unique = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

test.before(async () => {
  await connectToDatabase();
});

test.after(async () => {
  if (created.comentarios.length > 0) {
    await Comentario.deleteMany({ _id: { $in: created.comentarios } });
  }

  if (created.imagenes.length > 0) {
    await PostImagen.deleteMany({ _id: { $in: created.imagenes } });
  }

  if (created.posts.length > 0) {
    await Post.deleteMany({ _id: { $in: created.posts } });
  }

  if (created.usuarios.length > 0) {
    await Usuario.deleteMany({ _id: { $in: created.usuarios } });
  }

  await mongoose.connection.close();
});

test('debe crear usuario y devolverlo por GET /api/usuarios/:id', async () => {
  const nickName = unique('endpoint-user');

  const createRes = await request(app)
    .post('/api/usuarios')
    .send({ nickName });

  assert.equal(createRes.statusCode, 201);
  assert.equal(createRes.body.nickName, nickName);

  const usuario = await Usuario.findOne({ nickName });
  assert.ok(usuario);
  created.usuarios.push(usuario._id);

  const byIdRes = await request(app).get(`/api/usuarios/${usuario._id}`);

  assert.equal(byIdRes.statusCode, 200);
  assert.equal(byIdRes.body.nickName, nickName);
});

test('debe crear post y comentario y mostrar el comentario en GET /api/posts/:postId', async () => {
  const nickName = unique('post-owner');

  await request(app)
    .post('/api/usuarios')
    .send({ nickName });

  const usuario = await Usuario.findOne({ nickName });
  assert.ok(usuario);
  created.usuarios.push(usuario._id);

  const postRes = await request(app)
    .post('/api/posts')
    .send({ descripcion: 'Post de prueba', usuarioId: usuario._id.toString() });

  assert.equal(postRes.statusCode, 201);
  assert.ok(postRes.body._id);
  created.posts.push(postRes.body._id);

  const comentarioRes = await request(app)
    .post(`/api/posts/${postRes.body._id}/comentarios`)
    .send({ contenido: 'Comentario visible', usuarioId: usuario._id.toString() });

  assert.equal(comentarioRes.statusCode, 201);
  assert.ok(comentarioRes.body._id);
  created.comentarios.push(comentarioRes.body._id);

  const getPostRes = await request(app).get(`/api/posts/${postRes.body._id}`);

  assert.equal(getPostRes.statusCode, 200);
  assert.equal(Array.isArray(getPostRes.body.comentarios), true);
  assert.equal(getPostRes.body.comentarios.length > 0, true);
  assert.equal(getPostRes.body.comentarios.some((c) => c.contenido === 'Comentario visible'), true);
});

test('debe crear/eliminar imagen y verla en GET /api/posts/:postId', async () => {
  const nickName = unique('img-owner');

  await request(app)
    .post('/api/usuarios')
    .send({ nickName });

  const usuario = await Usuario.findOne({ nickName });
  assert.ok(usuario);
  created.usuarios.push(usuario._id);

  const postRes = await request(app)
    .post('/api/posts')
    .send({ descripcion: 'Post con imagen', usuarioId: usuario._id.toString() });

  assert.equal(postRes.statusCode, 201);
  const postId = postRes.body._id;
  created.posts.push(postId);

  const createImgRes = await request(app)
    .post(`/api/posts/${postId}/imagenes`)
    .send({ url: 'https://example.com/imagen-1.jpg' });

  assert.equal(createImgRes.statusCode, 201);
  const imagenId = createImgRes.body._id;
  assert.ok(imagenId);
  created.imagenes.push(imagenId);

  const postWithImagesRes = await request(app).get(`/api/posts/${postId}`);
  assert.equal(postWithImagesRes.statusCode, 200);
  assert.equal(Array.isArray(postWithImagesRes.body.imagenes), true);
  assert.equal(postWithImagesRes.body.imagenes.some((img) => img._id === imagenId), true);

  const deleteRes = await request(app)
    .delete(`/api/posts/${postId}/imagenes/${imagenId}`);

  assert.equal(deleteRes.statusCode, 200);
});

test('debe seguir/dejar de seguir y reflejar posts en feed', async () => {
  const seguidorNick = unique('seguidor');
  const seguidoNick = unique('seguido');

  await request(app).post('/api/usuarios').send({ nickName: seguidorNick });
  await request(app).post('/api/usuarios').send({ nickName: seguidoNick });

  const seguidor = await Usuario.findOne({ nickName: seguidorNick });
  const seguido = await Usuario.findOne({ nickName: seguidoNick });

  assert.ok(seguidor);
  assert.ok(seguido);

  created.usuarios.push(seguidor._id, seguido._id);

  const postRes = await request(app)
    .post('/api/posts')
    .send({ descripcion: 'Post para feed', usuarioId: seguido._id.toString() });

  assert.equal(postRes.statusCode, 201);
  created.posts.push(postRes.body._id);

  const followRes = await request(app)
    .post('/api/usuarios/seguir')
    .send({ seguidorId: seguidor._id.toString(), seguidoId: seguido._id.toString() });

  assert.equal(followRes.statusCode, 200);

  const feedRes = await request(app).get(`/api/usuarios/${seguidor._id}/feed`);

  assert.equal(feedRes.statusCode, 200);
  assert.equal(Array.isArray(feedRes.body), true);
  assert.equal(feedRes.body.some((post) => post._id === postRes.body._id), true);

  const unfollowRes = await request(app)
    .post('/api/usuarios/dejar-seguir')
    .send({ seguidorId: seguidor._id.toString(), seguidoId: seguido._id.toString() });

  assert.equal(unfollowRes.statusCode, 200);
});
