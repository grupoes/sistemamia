export const jsonTemplate = (tipoCabecera, numero, nombre, link, parametros) => {
    let headerJson = "";

    if(tipoCabecera === 'video') {
        headerJson = [
            {
                "type": "header",
                "parameters": [
                    {
                        "type": "video",
                        "video": {
                            "link": link
                        }
                    }
                ]
            },
            {
                "type": "body",
                "parameters": parametros
            }
        ]

    } else if(tipoCabecera === 'image') {
        headerJson = [
            {
                "type": "header",
                "parameters": [
                    {
                        "type": "image",
                        "image": {
                            "link": link
                        }
                    }
                ]
            },
            {
                "type": "body",
                "parameters": parametros
            }
        ]
    } else if(tipoCabecera === 'document') {
        headerJson = [
            {
                "type": "header",
                "parameters": [
                    {
                        "type": "document",
                        "document": {
                            "link": link
                        }
                    }
                ]
            },
            {
                "type": "body",
                "parameters": parametros
            }
        ]

    } else {
        
        headerJson = [
            {
                "type": "body",
                "parameters": parametros
            }
        ]

    }

    const jsonPlantilla = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": numero,
        "type": "template",
        "template": {
            "name": nombre,
            "language": { "code": "es" },
            "components": headerJson
        }
    };

    return jsonPlantilla;
}