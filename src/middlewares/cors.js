// cors.js
import cors from 'cors';

const corsOptions = {
  origin: 'https://console.firebase.google.com/project/whatsapp-api-data/overview', // Cambia esta URL con la URL correcta de Firebase Functions
  methods: 'GET, POST, PUT, DELETE',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
};

const corsMiddleware = cors(corsOptions);

export default corsMiddleware;
