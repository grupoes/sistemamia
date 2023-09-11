import axios from 'axios';
import { createWriteStream } from 'fs';

const token = 'EAALqfu5fdToBO4ZChxiynoV99ZARXPrkiDIfZA3fi1TRfeujYI2YlPzH9fUB8PF6BbWJAEowNhCprGP2LqZA9MhWcLcxgImVkk8LKKASpN23vtHVZA4JZC9z15pDLFe1AwXDIaLNAZA75PN4f9Ji25tGC5ue8ZA7jWEfHgo2oYZCSrIAFZAzJ3Nj86iCfJToOhZB83jZCvVheSZBOyuc04zxE';

const config = {
  method: 'get',
  responseType: 'stream', // Indica que la respuesta será un stream
  maxBodyLength: Infinity,
  url: 'https://lookaside.fbsbx.com/whatsapp_business/attachments/?mid=892868838855594&ext=1694467012&hash=ATuyF8cA5WysR2Il24VFxHPZwq3fYZUphc8CYluxp_R0pw',  // Asegúrate de reemplazar con tu URL
  headers: { 
    'Authorization': `Bearer ${token}`
  }
};

const makeRequest = async () => {
  try {
    const response = await axios.request(config);

    // Crea un write stream para guardar la respuesta en un archivo
    const writer = createWriteStream('mario.jpg'); // Cambia 'output_file.ext' por el nombre y extensión adecuados

    // Usa el stream de la respuesta para escribir en el archivo
    response.data.pipe(writer);

    // Maneja los eventos del stream
    writer.on('finish', () => {
      console.log('Archivo guardado exitosamente.');
    });
    writer.on('error', (error) => {
      console.error('Error al guardar el archivo:', error);
    });
  }
  catch (error) {
    if (error.response) {
       console.log('Data:', error.response.data);
       console.log('Status:', error.response.status);
       console.log('Headers:', error.response.headers);
    } else if (error.request) {
       console.log('Request:', error.request);
    } else {
       console.log('Error message:', error.message);
    }
  }
};

makeRequest();
