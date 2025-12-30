# 📦 Transferir Proyecto al Servidor Linux

Si necesitas transferir el proyecto desde tu Mac al servidor Linux del cliente.

---

## Opción 1: Transferencia por SCP (Recomendado)

### Paso 1: Empaquetar el proyecto (desde tu Mac)

```bash
cd "/Users/miguelfernandezgargurevich/Library/Mobile Documents/com~apple~CloudDocs/Personal/Proyectos/repositorios/PCM"

# Crear archivo comprimido excluyendo archivos innecesarios
tar czf pcm-deploy.tar.gz \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='bin' \
  --exclude='obj' \
  --exclude='dist' \
  --exclude='.DS_Store' \
  --exclude='*.log' \
  .

# Verificar tamaño
ls -lh pcm-deploy.tar.gz
```

### Paso 2: Transferir al servidor

```bash
# Reemplaza con las credenciales del servidor del cliente
SERVER_USER="usuario"
SERVER_IP="101.44.10.71"
SERVER_PATH="/opt"

# Transferir archivo
scp pcm-deploy.tar.gz ${SERVER_USER}@${SERVER_IP}:/tmp/

# Opcional: Copiar también el script de inicio
scp start-server-docker.sh ${SERVER_USER}@${SERVER_IP}:/tmp/
```

### Paso 3: Descomprimir en el servidor (desde SSH en el servidor)

```bash
# Conectar al servidor
ssh usuario@101.44.10.71

# En el servidor:
sudo mkdir -p /opt/pcm
cd /opt/pcm
sudo tar xzf /tmp/pcm-deploy.tar.gz
sudo chown -R $USER:$USER /opt/pcm
sudo chmod +x start-server-docker.sh

# Limpiar archivo temporal
rm /tmp/pcm-deploy.tar.gz
```

---

## Opción 2: Clonar desde GitHub (Si el servidor tiene acceso)

```bash
# En el servidor:
ssh usuario@101.44.10.71

# Clonar repositorio
cd /opt
sudo git clone https://github.com/miguelgargurevich/pcm.git
cd pcm
sudo chown -R $USER:$USER /opt/pcm
sudo chmod +x start-server-docker.sh
```

---

## Opción 3: Usar rsync (Sincronización)

```bash
# Desde tu Mac:
rsync -avz --progress \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude 'bin' \
  --exclude 'obj' \
  --exclude 'dist' \
  "/Users/miguelfernandezgargurevich/Library/Mobile Documents/com~apple~CloudDocs/Personal/Proyectos/repositorios/PCM/" \
  usuario@101.44.10.71:/opt/pcm/
```

---

## Verificación Post-Transferencia

```bash
# En el servidor, verificar que los archivos estén completos
cd /opt/pcm

# Verificar archivos clave
ls -la docker-compose.server.yml
ls -la Dockerfile.local
ls -la start-server-docker.sh
ls -la backend/PCM.API/appsettings.Docker.json
ls -la frontend/Dockerfile

# Dar permisos de ejecución al script
chmod +x start-server-docker.sh

# Ver estructura
tree -L 2 -d  # Si tree está instalado
# o
find . -maxdepth 2 -type d
```

---

## Siguiente Paso

Una vez transferido, sigue la guía en `DESPLIEGUE_SERVIDOR_CLIENTE.md` o ejecuta:

```bash
cd /opt/pcm
./start-server-docker.sh
```
