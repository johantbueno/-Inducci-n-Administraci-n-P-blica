# Curso de Inducción a la Administración Pública

## Descripción

Sitio web interactivo para el curso de Inducción a la Administración Pública, desarrollado por el Facilitador Johan Tapia, PhD.

## Características

- ✅ **Diseño Responsivo** - Compatible con todos los dispositivos
- ✅ **Interfaz Moderna** - Con colores institucionales azul y blanco
- ✅ **Contenido Completo** - Todas las unidades del manual de inducción
- ✅ **Casos Prácticos** - Ejemplos interactivos de aplicación
- ✅ **Navegación Intuitiva** - Estructura organizada por unidades
- ✅ **Efectos Visuales** - Animaciones y transiciones modernas
- ✅ **Progreso del Curso** - Sistema de seguimiento de avance
- ✅ **Accesibilidad** - Cumple con estándares de accesibilidad web

## Estructura del Proyecto

```
/
├── index.html          # Página principal
├── unidad1.html        # Unidad I: Nociones sobre Organización del Estado
├── unidad2.html        # Unidad II: Fines del Estado y Administración Pública
├── unidad3.html        # Unidad III: Marco Jurídico de la Administración Pública
├── ley4108.html        # Régimen de Función Pública (Ley 41-08)
├── casos.html          # Casos Prácticos y Ejemplos
├── glosario.html       # Glosario de Términos
├── main.js            # JavaScript principal
├── design.md          # Documentación de diseño
└── README.md          # Este archivo
```

## Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Estilos y animaciones
- **Tailwind CSS** - Framework de CSS utility-first
- **JavaScript ES6** - Funcionalidad interactiva
- **Font Awesome** - Iconos vectoriales
- **Google Fonts** - Tipografías (Inter y Source Sans Pro)


4. **Acceder al sitio:**
   - URL: `https://TU-USUARIO.github.io/inap-induccion-administracion-publica/`

### Opción 2: Servidor Local

1. **Requisitos previos:**
   - Python 3.x o Node.js instalado

2. **Servidor Python:**
   ```bash
   # En la carpeta del proyecto
   python -m http.server 8000
   # Acceder en: http://localhost:8000
   ```

3. **Servidor Node.js:**
   ```bash
   # Instalar serve globalmente
   npm install -g serve
   
   # En la carpeta del proyecto
   serve -s . -p 8000
   # Acceder en: http://localhost:8000
   ```

## Personalización

### Colores Institucionales

Los colores del INAP están definidos en CSS custom properties:

```css
:root {
    --primary-blue: #1e3a8a;      /* Azul institucional */
    --secondary-blue: #3b82f6;    /* Azul claro */
    --white: #ffffff;             /* Blanco */
    --gray-50: #f8fafc;           /* Gris muy claro */
}
```

### Contenido del Curso

Para modificar el contenido:

1. **Editar páginas HTML** - Cada unidad está en su propio archivo HTML
2. **Actualizar casos prácticos** - Modificar `casos.html`
3. **Agregar nuevo contenido** - Seguir la estructura existente

### Imágenes y Recursos

- Las imágenes deben colocarse en la carpeta `resources/`
- Optimizar imágenes para web (formato WebP o JPG comprimido)
- Usar nombres descriptivos en minúsculas

## Mantenimiento

### Actualización de Contenido

1. **Verificar legislación vigente** - Asegurar que la información esté actualizada
2. **Revisar enlaces** - Verificar que todos los enlaces funcionen
3. **Actualizar casos** - Mantener ejemplos relevantes

### Seguridad

- No incluir información sensible o confidencial
- Validar formularios si se agregan
- Usar HTTPS en producción

## Créditos

- **Facilitador:** Johan Tapia, PhD
- **Versión:** 2.0
- **Fecha:** Noviembre 2025

## Licencia

Este proyecto es un recurso educativo. Uso permitido para fines educativos y capacitación de servidores públicos.

## Contacto

📧 **Email:** jtapia@inap.gob.do  
📞 **Teléfono:** 809-868-4994  
🌐 **Web:** Recurso educativo digital  
📍 **Ubicación:** República Dominicana

---

**¡Éxito en tu carrera como Servidor Público!**

"El servicio público es el honor más alto que se le puede conferir a un ciudadano: la confianza del pueblo." - Johan Tapia, PhD
