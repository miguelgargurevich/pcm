✅ Base de datos configurada:

49 tablas creadas en plataforma_cumplimiento_digital
Perfiles insertados: Administrador, Entidad, Operador, Consulta
Clasificaciones creadas: Gobierno Nacional, Regional, Local
Ubigeo de Lima creado
Entidad PCM creada (ID: 1)
Usuario administrador creado
✅ Servidor API corriendo:

URL: http://localhost:5164
Swagger UI: http://localhost:5164 (está configurado en la raíz)
✅ Usuario de prueba:

Email: admin@pcm.gob.pe
Password: Admin123!
Perfil: Administrador
Entidad: Presidencia del Consejo de Ministros
✅ Endpoints disponibles:

POST /api/auth/login - Login con JWT
POST /api/auth/refresh - Refrescar token
POST /api/auth/change-password - Cambiar contraseña (requiere autenticación)
POST /api/auth/logout - Cerrar sesión
GET /api/auth/me - Obtener info del usuario autenticado
Puedes abrir http://localhost:5164 en tu navegador para ver el Swagger UI y probar el login con las credenciales del usuario administrador.