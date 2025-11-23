#!/usr/bin/env python3
"""
Script para insertar los formularios Com13-Com21 en el archivo CumplimientoNormativoDetalle.jsx
"""

import os

# Rutas
base_path = "/Users/miguelfernandezgargurevich/Library/Mobile Documents/com~apple~CloudDocs/Personal/Proyectos/repositorios/PCM"
jsx_file = os.path.join(base_path, "frontend/src/pages/CumplimientoNormativoDetalle.jsx")
forms_file = os.path.join(base_path, "ui_forms_com13_21.txt")

# Leer el archivo JSX
with open(jsx_file, 'r', encoding='utf-8') as f:
    jsx_lines = f.readlines()

# Leer el archivo de formularios
with open(forms_file, 'r', encoding='utf-8') as f:
    forms_content = f.read()

# Encontrar la línea donde insertar (buscar el comentario "COMPROMISO 1 y OTROS")
insert_line = None
for i, line in enumerate(jsx_lines):
    if "// COMPROMISO 1 y OTROS: Datos del Líder" in line:
        # Insertar 2 líneas antes (antes del ") : (")
        insert_line = i - 2
        break

if insert_line is None:
    print("❌ No se encontró la línea de inserción")
    exit(1)

print(f"📍 Insertando en la línea {insert_line + 1}")
print(f"Línea encontrada: {jsx_lines[insert_line].strip()}")
print(f"Línea siguiente: {jsx_lines[insert_line + 1].strip()}")

# Insertar el contenido
jsx_lines.insert(insert_line + 1, forms_content)

# Guardar el archivo
with open(jsx_file, 'w', encoding='utf-8') as f:
    f.writelines(jsx_lines)

print(f"✅ Inserción completada")
print(f"📏 Total líneas: {len(jsx_lines)}")
