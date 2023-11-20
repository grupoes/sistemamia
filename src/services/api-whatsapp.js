export const sendAudio = (url_audio, contacto) => {
    const dataFile = {
        messaging_product: "whatsapp",
        to: contacto,
        type: 'audio',
        audio: {
            link: url_audio
        }
    };
    
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: process.env.URL_MESSAGES,
        headers: { 
          'Authorization': 'Bearer '+process.env.TOKEN_WHATSAPP
        },
        data: dataFile
    };

    return config;
}