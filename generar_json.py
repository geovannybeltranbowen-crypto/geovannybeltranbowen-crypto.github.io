import os
import json
from datetime import datetime
from pathlib import Path

def generar_json(carpeta_imagenes, archivo_salida):
    """Genera un archivo JSON con la información de las imágenes"""
    productos = []
    
    # Verificar que la carpeta existe
    if not os.path.exists(carpeta_imagenes):
        print(f"⚠️ Carpeta {carpeta_imagenes} no existe - Creando...")
        os.makedirs(carpeta_imagenes, exist_ok=True)
        print(f"✅ Carpeta {carpeta_imagenes} creada")
        return
    
    # Listar archivos de imagen
    extensiones = ['.jpg', '.jpeg', '.png', '.webp', '.JPG', '.JPEG', '.PNG', '.WEBP']
    archivos = []
    
    for f in os.listdir(carpeta_imagenes):
        if any(f.lower().endswith(ext) for ext in extensiones):
            archivos.append(f)
    
    print(f"📂 Encontrados {len(archivos)} archivos en {carpeta_imagenes}")
    
    for archivo in archivos:
        try:
            # Extraer información del nombre del archivo
            nombre_sin_extension = Path(archivo).stem
            partes = nombre_sin_extension.split('_')
            
            # Si tiene formato: marca_modelo_precio
            if len(partes) >= 3:
                marca = partes[0].capitalize()
                modelo = partes[1].capitalize()
                precio = partes[2]
                
                nombre = f"{marca} {modelo}"
                descripcion = f"Computadora {marca} modelo {modelo}"
            else:
                # Si no sigue el formato, usar el nombre completo
                nombre = nombre_sin_extension.replace('_', ' ').title()
                descripcion = "Producto disponible"
                precio = "Consultar"
            
            # Obtener fecha de modificación
            ruta_completa = os.path.join(carpeta_imagenes, archivo)
            fecha_mod = os.path.getmtime(ruta_completa)
            fecha = datetime.fromtimestamp(fecha_mod).strftime('%d/%m/%Y')
            
            producto = {
                "imagen": archivo,
                "nombre": nombre,
                "precio": precio,
                "descripcion": descripcion,
                "fecha": fecha
            }
            productos.append(producto)
            print(f"  ✅ Procesado: {archivo}")
            
        except Exception as e:
            print(f"  ❌ Error con {archivo}: {e}")
    
    # Crear carpeta datos si no existe
    os.makedirs(os.path.dirname(archivo_salida), exist_ok=True)
    
    # Guardar JSON
    with open(archivo_salida, 'w', encoding='utf-8') as f:
        json.dump(productos, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Generado {archivo_salida} con {len(productos)} productos")

# Configuración y ejecución
if __name__ == "__main__":
    print("🔄 GENERANDO ARCHIVOS JSON...")
    print("=" * 50)
    
    # Crear carpetas necesarias
    os.makedirs("imagenes/promociones", exist_ok=True)
    os.makedirs("imagenes/inventario", exist_ok=True)
    os.makedirs("datos", exist_ok=True)
    
    generar_json("imagenes/promociones", "datos/promociones.json")
    generar_json("imagenes/inventario", "datos/inventario.json")
    
    print("=" * 50)
    print("✨ ¡PROCESO COMPLETADO CON ÉXITO!")
    print("📂 Revisa la carpeta 'datos' para ver los archivos JSON")