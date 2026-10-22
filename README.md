# Grown-Ish

Landing page de talleres de habilidades para la vida adulta, basada en `grow-ish.pdf`. React construye la interfaz y Go sirve sus archivos estáticos. No requiere base de datos ni servicios externos.

## Evaluar con Docker

```bash
docker compose up -d --build
```

Abre **http://localhost:8091**. El puerto 8091 se eligió después de revisar los puertos y contenedores activos del equipo. Solo se publica en localhost.

```bash
docker compose ps
docker compose logs -f landing
docker compose down
```

Para usar otro puerto:

```bash
LANDING_PORT=8092 docker compose up -d
```

La primera construcción necesita conexión para descargar las imágenes y dependencias. Una vez construida, la página funciona sin recursos externos: las fuentes, ilustraciones y estilos están incluidos. No necesitas instalar Go ni Node para evaluarla con Docker.

## Contenido

- Logotipo tipográfico y hero shot ilustrado en SVG.
- Propuesta única: habilidades que no suelen enseñarse en el colegio, con práctica y acompañamiento cercano para jóvenes de 16 a 25 años.
- Los ocho talleres del documento; inicialmente se muestran tres y se pueden desplegar todos.
- Características y modalidades: presencial, virtual y videos.
- Validación basada en los hallazgos de las entrevistas exploratorias del PDF. Los encabezados resumen los hallazgos; no representan testimonios textuales ni resultados de clientes.
- Preguntas frecuentes desplegables, navegación móvil y llamados a la acción hacia los talleres.
- Diseño adaptable a móviles, teclado y preferencia de movimiento reducido.

No se implementan inscripciones, pagos ni formularios. Los precios y las fechas se identifican como pendientes de anuncio, ya que el PDF no los especifica.

## Identidad visual

Paleta del documento: azul `#436F8A`, verde `#438A5E`, verde claro `#BAC964` y beige `#F7FBE1`. Se complementa con tonos para las ilustraciones y texto.

El nombre final del PDF es **Grown-Ish**. El archivo del repositorio se llama `grow-ish.pdf`, pero el sitio utiliza el nombre de marca definido en el contenido.

El PDF muestra **Lucky** como referencia de tipografía, pero no adjunta la fuente ni su licencia. Se usa **Pacifico** como alternativa manuscrita para el logotipo y los acentos, y **DM Sans** para lectura. Ambas están alojadas localmente con sus licencias OFL en `web/public/fonts/`. Para una reproducción exacta de Lucky se necesita su archivo y licencia de uso web.

## Desarrollo local opcional

Requisitos: Node.js 24 y Go 1.22 o posterior.

```bash
npm ci
npm run dev
```

Para servir la compilación desde Go:

```bash
npm run build
go run ./cmd/server
```

Go utiliza el puerto 8080 por defecto; se puede ajustar con la variable `PORT`. Docker usa el puerto interno 8080 y el puerto externo 8091.

## Verificación visual y de interacción

Con la landing levantada:

```bash
node scripts/check-landing.mjs
```

Requiere las dependencias de desarrollo (`npm ci`) y Chromium de Playwright (`npx playwright install chromium`). El script acepta `BASE_URL` y `CHROMIUM_PATH`, comprueba navegación, talleres, FAQ, tamaños de pantalla y recursos; guarda capturas en `/tmp/grown-ish-qa`.
