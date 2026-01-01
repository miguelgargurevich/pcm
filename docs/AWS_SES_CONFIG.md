# 📧 Configuración AWS SES - Servicio de Correo Electrónico

Este documento describe la configuración de **AWS SES (Amazon Simple Email Service)** para el envío de correos electrónicos en la Plataforma de Cumplimiento Digital.

---

## 📋 Información General

| Parámetro | Valor |
|-----------|-------|
| **Servicio** | AWS SES (Amazon Simple Email Service) |
| **Región** | us-east-1 (N. Virginia) |
| **Dominio Verificado** | plataformacumplimientodigital.servicios.gob.pe |
| **Email Remitente** | notificaciones@plataformacumplimientodigital.servicios.gob.pe |
| **Access Key ID** | AKIA4TCYZV3ZROYMAUWM |
| **Ambiente** | Producción / Sandbox |

---

## 🔧 Configuración en appsettings.json

```json
{
  "Aws": {
    "AccessKeyId": "AKIA4TCYZV3ZROYMAUWM",
    "SecretAccessKey": "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",
    "Region": "us-east-1",
    "SesFromEmail": "notificaciones@plataformacumplimientodigital.servicios.gob.pe",
    "SesFromName": "Plataforma de Cumplimiento Digital - PCM",
    "FrontendUrl": "http://101.44.10.71:3000"
  }
}
```

---

## 🔐 Variables de Entorno (Docker)

Para configurar mediante variables de entorno en docker-compose:

```yaml
environment:
  - Aws__AccessKeyId=AKIA4TCYZV3ZROYMAUWM
  - Aws__SecretAccessKey=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
  - Aws__Region=us-east-1
  - Aws__SesFromEmail=notificaciones@plataformacumplimientodigital.servicios.gob.pe
  - Aws__SesFromName=Plataforma de Cumplimiento Digital - PCM
  - Aws__FrontendUrl=http://101.44.10.71:3000
```

---

## 📦 Dependencia NuGet

El paquete AWS SDK ya está agregado al proyecto:

```xml
<PackageReference Include="AWSSDK.SimpleEmail" Version="3.7.400.58" />
```

---

## 🚀 Implementación

El servicio `AwsSesEmailService` está implementado en:
```
backend/PCM.Infrastructure/Services/AwsSesEmailService.cs
```

### Prioridad de Servicios de Email

El sistema selecciona automáticamente el servicio de email en el siguiente orden:

1. **AWS SES** - Si `Aws:AccessKeyId` está configurado ✅ (Actual)
2. **SMTP** - Si `Smtp:Host` está configurado
3. **Resend** - Si `Resend:ApiKey` está configurado (fallback)

---

## ✉️ Tipos de Correos Enviados

### 1. Recuperación de Contraseña

- **Asunto**: "Recuperación de Contraseña - Plataforma de Cumplimiento Digital"
- **Contenido**: Email HTML con enlace de recuperación
- **Expiración del enlace**: 1 hora
- **Método**: `SendPasswordResetEmailAsync()`

### 2. Notificaciones de Cumplimiento

- **Asunto**: Personalizado según el tipo de notificación
- **Contenido**: Email HTML con detalles del cumplimiento
- **Método**: `SendEmailAsync()`

---

## 📊 Límites de AWS SES

### Modo Sandbox (Inicial)

- ✉️ **Límite de envío**: 200 emails por día
- 📈 **Tasa de envío**: 1 email por segundo
- 🎯 **Destinatarios**: Solo emails verificados
- ⚠️ **Restricción**: Requiere verificación de cada destinatario

### Modo Producción (Solicitar salida de Sandbox)

Para salir del modo Sandbox y aumentar límites:

1. Ir a AWS SES Console
2. Account Dashboard → Request production access
3. Completar formulario:
   - **Mail Type**: Transactional
   - **Website URL**: https://cumplimiento.pcm.gob.pe
   - **Use Case**: Sistema de notificaciones gubernamental
   - **Process for handling bounces**: Monitoreo automático con SNS

Después de aprobación:
- ✉️ **Límite**: 50,000 emails por día (escalable)
- 📈 **Tasa**: 14 emails por segundo (escalable)
- 🌍 **Destinatarios**: Cualquier email válido

---

## 🔍 Verificación de Funcionamiento

### 1. Verificar Configuración

```bash
# Ver logs del backend
docker logs pcm-backend-server | grep "AWS SES"

# Debe mostrar:
# 📧 AWS SES Email Service inicializado
# Region: us-east-1
# From: Plataforma de Cumplimiento Digital - PCM <notificaciones@plataformacumplimientodigital.servicios.gob.pe>
```

### 2. Probar Envío de Email

Usar el endpoint de recuperación de contraseña:

```bash
curl -X POST http://localhost:5164/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "usuario@ejemplo.com"}'
```

### 3. Verificar en Logs

```bash
docker logs pcm-backend-server -f

# Buscar:
# 📤 Enviando email via AWS SES
# ✅ Email enviado exitosamente via AWS SES
# MessageId: XXXXXXXXXXXXX
```

---

## ⚠️ Troubleshooting

### Error: "Email address is not verified"

**Causa**: El email del destinatario no está verificado en modo Sandbox.

**Solución**:
1. Ir a AWS SES Console → Verified identities
2. Create identity → Email address
3. Ingresar el email del destinatario
4. Confirmar el email de verificación
5. Intentar enviar nuevamente

**Solución Permanente**: Solicitar salida de Sandbox (ver sección anterior)

### Error: "InvalidClientTokenId"

**Causa**: Access Key ID incorrecto o inválido.

**Solución**:
1. Verificar `Aws:AccessKeyId` en appsettings.json
2. Regenerar credenciales en AWS IAM si es necesario

### Error: "SignatureDoesNotMatch"

**Causa**: Secret Access Key incorrecto.

**Solución**:
1. Verificar `Aws:SecretAccessKey` en appsettings.json
2. Asegurarse de que no tenga espacios al inicio/final

### Error: "MessageRejected: Email address is not verified"

**Causa**: Email remitente no verificado en SES.

**Solución**:
1. Verificar que el dominio `plataformacumplimientodigital.servicios.gob.pe` esté verificado en AWS SES
2. Si no está verificado, seguir proceso de verificación de dominio en AWS

---

## 📈 Monitoreo

### Ver Estadísticas en AWS Console

1. Ir a AWS SES Console
2. Sección "Sending statistics"
3. Ver métricas:
   - Emails enviados
   - Bounces (rebotes)
   - Complaints (quejas)
   - Delivery rate

### Configurar Alarmas CloudWatch

```bash
# Crear alarma para bounces altos
aws cloudwatch put-metric-alarm \
  --alarm-name "SES-High-Bounce-Rate" \
  --alarm-description "Alerta cuando bounce rate > 5%" \
  --metric-name Reputation.BounceRate \
  --namespace AWS/SES \
  --statistic Average \
  --period 300 \
  --evaluation-periods 1 \
  --threshold 0.05 \
  --comparison-operator GreaterThanThreshold
```

---

## 🔐 Seguridad

### Buenas Prácticas

1. ✅ **Rotar credenciales** cada 90 días
2. ✅ **Usar IAM Role** en producción (en lugar de Access Key)
3. ✅ **Configurar SNS** para notificaciones de bounces/complaints
4. ✅ **Monitorear** métricas de reputación
5. ✅ **Implementar** manejo de bounces automático

### Permisos IAM Requeridos

El usuario IAM debe tener la política `AmazonSESFullAccess` o permisos específicos:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ses:SendEmail",
        "ses:SendRawEmail"
      ],
      "Resource": "*"
    }
  ]
}
```

---

## 📝 Logs de Email

Todos los envíos se registran en los logs del backend:

```bash
# Ver todos los envíos de email
docker logs pcm-backend-server | grep "📤 Enviando email"

# Ver emails exitosos
docker logs pcm-backend-server | grep "✅ Email enviado"

# Ver errores de envío
docker logs pcm-backend-server | grep "❌ Error al enviar email"
```

---

## 🔄 Migración desde SMTP

Si anteriormente usabas SMTP, los cambios necesarios son:

1. ✅ Comentar/remover sección `Smtp` en appsettings.json
2. ✅ Agregar sección `Aws` con credenciales SES
3. ✅ El código automáticamente detecta y usa AWS SES
4. ✅ Reconstruir y reiniciar contenedor

No se requieren cambios en el código de la aplicación.

---

## 📞 Soporte

Para issues relacionados con AWS SES:

1. **Documentación oficial**: https://docs.aws.amazon.com/ses/
2. **Límites y cuotas**: https://docs.aws.amazon.com/ses/latest/dg/quotas.html
3. **Best practices**: https://docs.aws.amazon.com/ses/latest/dg/best-practices.html

---

**Última actualización**: 31 de diciembre de 2025
