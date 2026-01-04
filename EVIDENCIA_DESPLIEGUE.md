# 📋 EVIDENCIA DE DESPLIEGUE - Plataforma de Cumplimiento Digital

**Fecha:** 3 de enero de 2026  
**Servidor:** 101.44.1.6 (ecs-cumplimiento-web)  
**Arquitectura:** Linux x86_64  

---

## ✅ RESUMEN EJECUTIVO

La Plataforma de Cumplimiento Digital (PCM) ha sido desplegada exitosamente en el servidor del cliente con todos los servicios operativos.

---

## 🐳 ESTADO DE CONTENEDORES DOCKER

**Verificado:** 3 de enero de 2026, 11:14 CST

```
NAMES                 STATUS                      PORTS
pcm-frontend-server   Up 30 minutes              0.0.0.0:3000->80/tcp, [::]:3000->80/tcp
pcm-backend-server    Up 30 minutes              0.0.0.0:5164->5164/tcp, [::]:5164->5164/tcp
```

### Uso de Recursos

| Contenedor | CPU | Memoria | Red I/O | Estado |
|------------|-----|---------|---------|--------|
| pcm-frontend-server | 0.00% | 9.7 MB / 3.4 GB (0.27%) | 2.81 KB / 1.31 KB | ✅ Running |
| pcm-backend-server | 0.01% | 100.5 MB / 3.4 GB (2.85%) | 23.9 KB / 12.6 KB | ✅ Running |

---

## 🔍 HEALTH CHECK - BACKEND API

**Endpoint:** http://localhost:5164/health  
**Status Code:** 200 OK  
**Timestamp:** 2026-01-03T03:14:32.283951Z

```json
{
  "status": "healthy",
  "timestamp": "2026-01-03T03:14:32.283951Z",
  "database": "connected",
  "environment": "Docker"
}
```

✅ **Backend API operativa**  
✅ **Conexión a base de datos establecida**  
✅ **Ambiente: Docker**

---

## 🌐 FRONTEND - DISPONIBILIDAD

**Endpoint:** http://localhost:3000  
**Status Code:** 200 OK  
**Server:** nginx/1.29.4  
**Content-Type:** text/html  
**Content-Length:** 793 bytes  

```
HTTP/1.1 200 OK
Server: nginx/1.29.4
Date: Sat, 03 Jan 2026 03:14:35 GMT
Content-Type: text/html
Content-Length: 793
Last-Modified: Sat, 03 Jan 2026 02:42:57 GMT
Connection: keep-alive
ETag: "69588231-319"
Accept-Ranges: bytes
```

✅ **Frontend sirviendo correctamente**  
✅ **Nginx operativo**

---

## 🗄️ CONECTIVIDAD BASE DE DATOS

**PostgreSQL Server:** 101.44.10.71:5432  
**Status:** ✅ Accesible  

```
✅ PostgreSQL accesible en 101.44.10.71:5432
```

**Base de Datos:** pcd_plataforma  
**Version:** PostgreSQL 15.15  

---

## 🖥️ INFORMACIÓN DEL SISTEMA

**Hostname:** ecs-cumplimiento-web  
**IP Addresses:**
- 172.16.240.191 (privada)
- 172.17.0.1 (docker0)
- 172.18.0.1 (docker network)

**Uptime:** 22 días, 7 horas

### Recursos del Sistema

| Recurso | Uso | Total | Porcentaje |
|---------|-----|-------|------------|
| **Memoria** | 1.2 GB | 3.4 GB | ~35% |
| **Disco** | 8.7 GB | 50 GB | 19% |
| **Load Average** | 0.00, 0.00, 0.01 | - | Normal |

---

## 🔐 PRUEBA DE AUTENTICACIÓN

### Endpoint de Login
**URL:** POST http://localhost:5164/api/Auth/login  
**Content-Type:** application/json

### Credenciales de Prueba Verificadas
- **Usuario:** admin.test@pcm.gob.pe
- **Contraseña:** Admin123!
- **Status:** ✅ Login exitoso
- **Token JWT:** Generado correctamente

---

## 📊 PUERTOS EXPUESTOS Y ACCESIBILIDAD

| Servicio | Puerto Host | Puerto Container | Protocolo | Acceso |
|----------|-------------|------------------|-----------|--------|
| Frontend | 3000 | 80 | HTTP | ✅ Activo |
| Backend API | 5164 | 5164 | HTTP | ✅ Activo |
| Nginx | 80 | - | HTTP | ✅ Activo |

---

## 🔒 CONFIGURACIÓN DE ACCESO TEMPORAL

Para acceso desde el exterior (temporal vía túnel SSH):

```bash
ssh -i ~/.ssh/pcm-server.pem -L 8080:localhost:3000 -L 8081:localhost:5164 -N root@101.44.1.6 &
```

**URLs Temporales:**
- Frontend: http://localhost:8080
- Backend API: http://localhost:8081

---

## ⚠️ PENDIENTES PARA ACCESO PÚBLICO

Para permitir acceso público directo desde Internet:

1. **Configurar reglas de firewall en el proveedor de nube:**
   - Abrir puerto 80 (HTTP)
   - Abrir puerto 443 (HTTPS) cuando se configure SSL
   - Permitir tráfico desde 0.0.0.0/0 (todas las IPs)

2. **Implementar certificado SSL:**
   - Instalar certificado SSL/TLS
   - Configurar Nginx para HTTPS
   - Redirigir HTTP → HTTPS

3. **Configurar DNS:**
   - Apuntar dominio institucional al servidor
   - Actualizar variables de entorno con el dominio final

---

## ✅ CHECKLIST DE VERIFICACIÓN COMPLETADO

- [x] Docker instalado y funcional
- [x] Contenedores backend y frontend corriendo
- [x] Health check del backend respondiendo
- [x] Frontend accesible y sirviendo archivos
- [x] Conexión a PostgreSQL establecida
- [x] Nginx operativo en puerto 80
- [x] Login de usuarios funcionando
- [x] Generación de tokens JWT exitosa
- [x] Logs de contenedores sin errores críticos

---

## 📝 NOTAS ADICIONALES

1. **Arquitectura:** Despliegue multi-contenedor con Docker Compose
2. **Ambiente:** Producción (Docker)
3. **Base de Datos:** Externa (no containerizada)
4. **Almacenamiento:** Volúmenes Docker para persistencia
5. **Logs:** Disponibles vía `docker logs [container_name]`

---

## 🎯 CONCLUSIÓN

✅ **DESPLIEGUE EXITOSO**

Todos los componentes de la Plataforma de Cumplimiento Digital están operativos y funcionando correctamente en el servidor del cliente. El sistema está listo para uso interno y solo requiere configuración de firewall para acceso público.

---

**Generado:** 3 de enero de 2026  
**Próxima revisión:** Después de configurar acceso público y SSL
