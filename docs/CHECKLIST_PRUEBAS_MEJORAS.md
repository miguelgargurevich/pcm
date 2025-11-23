# ✅ Checklist de Pruebas - Compromiso 2 (Mejoras)

## 🎯 Ambiente de Pruebas
- [ ] Backend corriendo: `cd backend/PCM.API && dotnet run`
- [ ] Frontend corriendo: `cd frontend && npm run dev`
- [ ] Usuario autenticado y en Dashboard

---

## 🔵 TEST 1: Botón de Editar Miembro

### Setup
1. [ ] Navegar a Compromiso 2 (Nuevo o existente)
2. [ ] Agregar un miembro:
   - DNI: 12345678
   - Nombre: Juan Carlos
   - Apellidos: García López
   - Cargo: Director de TI
   - Rol: Presidente
   - Email: juan.garcia@gob.pe
   - Teléfono: 987654321

### Prueba
3. [ ] Verificar que aparece icono de **lápiz azul** en la columna Acciones
4. [ ] Clic en el lápiz azul
5. [ ] **ESPERADO**: Modal se abre con título "Editar Miembro del Comité"
6. [ ] **ESPERADO**: Todos los campos están pre-llenados con datos del miembro
7. [ ] Cambiar Cargo a "Subdirector de TI"
8. [ ] Clic en botón "Guardar Cambios"
9. [ ] **ESPERADO**: Toast verde "Miembro actualizado exitosamente"
10. [ ] **ESPERADO**: Tabla muestra "Subdirector de TI"

**Status**: ⬜ No probado | ✅ Pasó | ❌ Falló

---

## 🔴 TEST 2: Confirmación Antes de Eliminar

### Prueba
1. [ ] Con al menos 1 miembro en la tabla
2. [ ] Clic en icono de **basura roja**
3. [ ] **ESPERADO**: Aparece modal de confirmación
4. [ ] **ESPERADO**: Mensaje "¿Está seguro de eliminar este miembro del comité?"
5. [ ] Clic en "Cancelar"
6. [ ] **ESPERADO**: Modal se cierra, miembro NO se elimina
7. [ ] Clic nuevamente en basura roja
8. [ ] Clic en "Confirmar" o "Aceptar"
9. [ ] **ESPERADO**: Toast "Miembro eliminado"
10. [ ] **ESPERADO**: Fila desaparece de la tabla

**Status**: ⬜ No probado | ✅ Pasó | ❌ Falló

---

## 🔢 TEST 3: Validación DNI - Solo 8 Dígitos Numéricos

### Prueba A: Bloqueo de letras
1. [ ] Abrir modal "Agregar Miembro"
2. [ ] En campo DNI, intentar escribir: "1234ABCD"
3. [ ] **ESPERADO**: Solo aparece "1234" (letras bloqueadas)

### Prueba B: Validación visual longitud
4. [ ] Escribir solo "1234567" (7 dígitos)
5. [ ] **ESPERADO**: Mensaje rojo debajo del campo: "El DNI debe tener 8 dígitos"
6. [ ] Completar todos los demás campos (válidos)
7. [ ] Clic en "Agregar Miembro"
8. [ ] **ESPERADO**: Toast rojo "El DNI debe contener exactamente 8 dígitos numéricos"
9. [ ] **ESPERADO**: Modal NO se cierra

### Prueba C: DNI válido
10. [ ] Agregar un dígito más: "12345678"
11. [ ] **ESPERADO**: Mensaje de error desaparece
12. [ ] Clic en "Agregar Miembro"
13. [ ] **ESPERADO**: Toast verde "Miembro agregado exitosamente"
14. [ ] **ESPERADO**: Miembro aparece en tabla

**Status**: ⬜ No probado | ✅ Pasó | ❌ Falló

---

## 📧 TEST 4: Validación Email Dominio @gob.pe

### Prueba A: Email no institucional
1. [ ] Abrir modal "Agregar Miembro"
2. [ ] DNI: 87654321
3. [ ] Completar nombre, apellidos, cargo, rol, teléfono
4. [ ] Email: "juan.garcia@gmail.com"
5. [ ] **ESPERADO**: Mensaje rojo debajo: "El correo debe ser del dominio @gob.pe"
6. [ ] Clic en "Agregar Miembro"
7. [ ] **ESPERADO**: Toast rojo "El correo debe ser del dominio @gob.pe"
8. [ ] **ESPERADO**: Modal NO se cierra

### Prueba B: Email institucional
9. [ ] Cambiar email a "juan.garcia@gob.pe"
10. [ ] **ESPERADO**: Mensaje de error desaparece
11. [ ] Clic en "Agregar Miembro"
12. [ ] **ESPERADO**: Toast verde, miembro se agrega

**Status**: ⬜ No probado | ✅ Pasó | ❌ Falló

---

## 🔐 TEST 5: DNI Único en el Comité

### Setup
1. [ ] Tener un miembro con DNI: 11111111

### Prueba A: DNI duplicado al crear
2. [ ] Clic en "Agregar Miembro"
3. [ ] Ingresar DNI: 11111111 (mismo del existente)
4. [ ] Completar demás campos (válidos)
5. [ ] Clic en "Agregar Miembro"
6. [ ] **ESPERADO**: Toast rojo "Ya existe un miembro con este DNI en el comité"
7. [ ] **ESPERADO**: Modal NO se cierra

### Prueba B: Editar sin cambiar DNI (debe permitir)
8. [ ] Cancelar modal
9. [ ] Editar el miembro con DNI 11111111
10. [ ] Cambiar solo el Cargo (no tocar DNI)
11. [ ] Clic en "Guardar Cambios"
12. [ ] **ESPERADO**: Toast verde "Miembro actualizado exitosamente"
13. [ ] **ESPERADO**: Se permite guardar (mismo miembro)

### Prueba C: Editar cambiando a DNI duplicado
14. [ ] Agregar otro miembro con DNI: 22222222
15. [ ] Editar el miembro con DNI 11111111
16. [ ] Cambiar DNI a 22222222
17. [ ] Clic en "Guardar Cambios"
18. [ ] **ESPERADO**: Toast rojo "Ya existe un miembro con este DNI"

### Prueba D: Editar cambiando a DNI nuevo
19. [ ] Cambiar DNI a 33333333 (nuevo, no existe)
20. [ ] Clic en "Guardar Cambios"
21. [ ] **ESPERADO**: Toast verde, se permite guardar

**Status**: ⬜ No probado | ✅ Pasó | ❌ Falló

---

## 🎨 TEST 6: UX del Modal

### Prueba A: Títulos dinámicos
1. [ ] Clic en "Agregar Miembro"
2. [ ] **ESPERADO**: Título "Nuevo Miembro del Comité"
3. [ ] **ESPERADO**: Botón dice "Agregar Miembro"
4. [ ] Cancelar y editar un miembro existente
5. [ ] **ESPERADO**: Título "Editar Miembro del Comité"
6. [ ] **ESPERADO**: Botón dice "Guardar Cambios"

### Prueba B: Mensajes diferenciados
7. [ ] Agregar nuevo miembro (completo)
8. [ ] **ESPERADO**: Toast "Miembro agregado exitosamente"
9. [ ] Editar ese miembro
10. [ ] **ESPERADO**: Toast "Miembro actualizado exitosamente"

**Status**: ⬜ No probado | ✅ Pasó | ❌ Falló

---

## 🎯 TEST 7: Layout de Botones

### Prueba
1. [ ] Con 2+ miembros en la tabla
2. [ ] **ESPERADO**: Columna Acciones tiene 2 iconos horizontales:
   - Lápiz azul (izquierda)
   - Basura roja (derecha)
3. [ ] **ESPERADO**: Espaciado uniforme entre íconos
4. [ ] Hover sobre lápiz: **ESPERADO** cambia a azul más oscuro
5. [ ] Hover sobre basura: **ESPERADO** cambia a rojo más oscuro
6. [ ] Tooltip aparece: "Editar" / "Eliminar"

**Status**: ⬜ No probado | ✅ Pasó | ❌ Falló

---

## 🔄 TEST 8: Flujo Completo con Validaciones

### Escenario Real
1. [ ] Crear nuevo Compromiso 2
2. [ ] Intentar agregar miembro con DNI "ABC12345"
3. [ ] **ESPERADO**: Solo se escribe "12345"
4. [ ] Completar DNI a "12345678"
5. [ ] Email: "test@yahoo.com"
6. [ ] **ESPERADO**: Error de dominio @gob.pe
7. [ ] Corregir a "test@gob.pe"
8. [ ] Completar todos los campos, guardar
9. [ ] **ESPERADO**: Miembro se agrega
10. [ ] Intentar agregar otro con mismo DNI
11. [ ] **ESPERADO**: Error de duplicado
12. [ ] Cambiar DNI a "87654321"
13. [ ] Agregar segundo miembro
14. [ ] Editar primer miembro (cambiar cargo)
15. [ ] **ESPERADO**: Edición exitosa
16. [ ] Intentar eliminar un miembro
17. [ ] **ESPERADO**: Confirmación aparece
18. [ ] Confirmar eliminación
19. [ ] **ESPERADO**: Miembro se elimina
20. [ ] Guardar y avanzar a Paso 2
21. [ ] **ESPERADO**: Sin errores, avanza correctamente

**Status**: ⬜ No probado | ✅ Pasó | ❌ Falló

---

## 📊 Resumen de Pruebas

| # | Test | Status | Notas |
|---|------|--------|-------|
| 1 | Botón Editar | ⬜ | |
| 2 | Confirmación Eliminar | ⬜ | |
| 3 | DNI 8 Dígitos | ⬜ | |
| 4 | Email @gob.pe | ⬜ | |
| 5 | DNI Único | ⬜ | |
| 6 | UX Modal | ⬜ | |
| 7 | Layout Botones | ⬜ | |
| 8 | Flujo Completo | ⬜ | |

---

## 🐛 Bugs Encontrados

### Bug #1
- **Descripción**: 
- **Pasos para reproducir**: 
- **Comportamiento esperado**: 
- **Comportamiento actual**: 
- **Severidad**: Alta / Media / Baja

### Bug #2
- **Descripción**: 
- ...

---

## 💡 Mejoras Sugeridas

1. 
2. 
3. 

---

## ✅ Sign-off

- **Probado por**: _________________
- **Fecha**: _________________
- **Resultado**: ✅ APROBADO | ❌ RECHAZADO | 🔄 CON OBSERVACIONES
- **Comentarios**: 

---

## 📝 Notas Adicionales

- 
- 
- 

---

**Última actualización**: 22 de noviembre de 2025
**Versión**: 1.0 - Post Mejoras Críticas
