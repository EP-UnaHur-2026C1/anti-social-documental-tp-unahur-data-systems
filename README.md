[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/r_d7sOXe)
# UnaHur - Red Anti-Social - 2026 - C1

Se solicita el modelado y desarrollo de un sistema backend para una red social llamada **“UnaHur Anti-Social Net”**, inspirada en plataformas populares que permiten a los usuarios realizar publicaciones y recibir comentarios sobre las mismas.

![Imagen](./assets/ANTI-SOCIALNET.jpeg)

# Contexto del Proyecto

En una primera reunión con los sponsors del proyecto, se definieron los siguientes requerimientos para el desarrollo de un **MVP (Producto Mínimo Viable)**:

- El sistema debe permitir que un usuario registrado realice una publicación (post), incluyendo **obligatoriamente una descripción**. De forma opcional, se podrán asociar **una o más imágenes** a dicha publicación

- Las publicaciones pueden recibir **comentarios** por parte de otros usuarios.

- Las publicaciones pueden estar asociadas a **etiquetas (tags)**. Una misma etiqueta puede estar vinculada a múltiples publicaciones.

- Es importante que los **comentarios más antiguos que X meses** (valor configurable mediante variables de entorno, por ejemplo, 6 meses) **no se muestren** en la visualización de los posteos.

####

# Entidades y Reglas de Negocio

Los sponsors definieron los siguientes nombres y descripciones para las entidades:

- **User**: Representa a los usuarios registrados en el sistema. El campo `nickName` debe ser **único** y funcionará como identificador principal del usuario.

- **Post**: Publicación realizada por un usuario en una fecha determinada que contiene el texto que desea publicar. Puede tener **cero o más imágenes** asociadas. Debe contemplarse la posibilidad de **agregar o eliminar imágenes** posteriormente.

- **Post_Images**: Entidad que registra las imágenes asociadas a los posts. Para el MVP, solo se requiere almacenar la **URL de la imagen alojada**.

- **Comment**: Comentario que un usuario puede realizar sobre una publicación. Incluye la fecha en la que fue realizado y una indicación de si está **visible o no**, dependiendo de la configuración (X meses).

- **Tag**: Etiqueta que puede ser asignada a un post. Una etiqueta puede estar asociada a **muchos posts**, y un post puede tener **múltiples etiquetas**.

# Requerimientos Técnicos

1. **Modelado de Datos**

   - Diseñar el modelo documental que represente todas las entidades definidas por los sponsor del proyecto. Queda a su criterio si usan relaciones embebidas o relaciones referenciadas a otros documentos.

### Ejemplo referenciadas

![referenciadas](./assets/Referenciada.png)

2. **Desarrollo del Backend**

   - Crear los **endpoints CRUD** necesarios para cada entidad.

   - Implementar las rutas necesarias para gestionar las relaciones entre entidades (por ejemplo: asociar imágenes a un post, etiquetas a una publicación, etc.).

   - Desarrollar las validaciones necesarias para asegurar la integridad de los datos (schemas, validaciones de integridad referencial).

   - Desarrollar las funciones controladoras con una única responsabilidad evitando realizar comprobaciones innecesarias en esta parte del código.

3. **Configuración y Portabilidad**

   - La configuración de las variables del motor deben ser por configuración e instalación de dependencias adecuadas.

   - El sistema debe permitir configurar el **puerto de ejecución y variables de entorno** fácilmente.

4. **Documentación**

   - Generar la documentación de la API utilizando **Swagger (formato YAML)**, incluyendo todos los endpoints definidos.

5. **Colecciones de Prueba**

   - Entregar las colecciones necesarias para realizar pruebas (por ejemplo, colecciones de Postman o archivos JSON de ejemplo).

# Bonus

- Hace el upload de las imagenes que se asocian a un POST que lo guarden en una carpeta de imagenes dentro del servidor web.
- ¿Cómo modelarías que un usuario pueda "seguir" a otros usuarios, y a su vez ser seguido por muchos? Followers
- Con la información de los post no varia muy seguido que estrategias podrian utilizar la que la información no sea constantemente consultada desde la base de datos.

# Respuestas Bonus Teóricos

## 1) Modelado de Followers (seguir/ser seguido)

Para el MVP, se modeló la relación de seguimiento dentro de la entidad de usuario con dos arreglos de referencias:

- `seguidos`: usuarios a los que sigo.
- `seguidores`: usuarios que me siguen.

### Ventajas de esta estrategia

- Es simple de implementar y entender.
- Permite resolver rápido los casos de uso principales (seguir, dejar de seguir, ver feed).
- Evita joins complejos para un proyecto académico inicial.

### Flujo funcional

- Cuando A sigue a B:
   - Se agrega `B` en `A.seguidos`.
   - Se agrega `A` en `B.seguidores`.
- Cuando A deja de seguir a B:
   - Se elimina `B` de `A.seguidos`.
   - Se elimina `A` de `B.seguidores`.

### Escalabilidad (propuesta)

Si el volumen de usuarios creciera mucho, convendría pasar a una colección intermedia `followers` con documentos `{ followerId, followeeId, fecha }`, que escala mejor para grafos sociales grandes y permite indexar de forma más eficiente.

## 2) Estrategia para no consultar siempre la base de datos

Dado que los posts no cambian constantemente, se aplicó una estrategia de caché para lecturas frecuentes.

### Estrategia usada

- Caché en memoria para:
   - listado de posts,
   - detalle de post por id,
   - feed por usuario.
- TTL corto para evitar datos obsoletos (valor configurable en código).
- Invalidación de caché cuando hay cambios de escritura:
   - crear/editar/eliminar post,
   - asociar/desasociar etiqueta,
   - agregar/eliminar imagen,
   - acciones de seguimiento que afectan feed.

### Beneficios

- Reduce lecturas repetidas a MongoDB.
- Mejora tiempos de respuesta en endpoints de consulta.
- Mantiene consistencia razonable al invalidar en cada operación de escritura.

### Evolución recomendada

Para producción, reemplazar caché en memoria local por Redis, permitiendo compartir caché entre múltiples instancias del backend y mayor control de expiración e invalidación.
