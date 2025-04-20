import express from 'express';
import swaggerDocument from '../swagger.json'; 

const app = express();

// Ruta para servir el archivo swagger.json
app.get('/swagger.json', (req, res) => {
  res.json(swaggerDocument); // Swagger JSON se sirve desde esta ruta
});

// Ruta para servir Swagger UI desde un CDN
app.get('/docs', (req, res) => {
  const swaggerUIHtml = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Swagger UI</title>
        <link
          rel="stylesheet"
          href="https://unpkg.com/swagger-ui-dist/swagger-ui.css"
        />
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
        <script>
          window.onload = () => {
            SwaggerUIBundle({
              url: "/local/swagger.json",  // Ruta del JSON
              dom_id: "#swagger-ui",
            });
          };
        </script>
      </body>
    </html>
  `;
  res.send(swaggerUIHtml); // Enviar el HTML de Swagger UI desde el CDN
});

// Ruta de prueba
app.get('/hello', (req, res) => {
  res.json({ message: '¡Hola desde Lambda con Swagger!' });
});

export default app;
