const app = require('./webapi/express-app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`[Bootstrap] Servidor de Acopio escuchando en el puerto ${PORT} (Clean Architecture)`);
});
