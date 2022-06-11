const functions = require('@google-cloud/functions-framework');
const escapeHtml = require('escape-html');
const nodemailer = require('nodemailer');
const cors = require('cors')({origin: true});

const  transporter = nodemailer.createTransport({
    service: "<PROVEDOR_AQUI>", //[hotmail, gmail]
      auth: {
        user: "<SEU_EMAIL@DOMINIO.COM>",
        pass: "<EMAIL_PWD>"
      }
  });


// HTTP Cloud Function.
functions.http('sendMail', (req, res) => {

    res.set('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') {
      // Send response to OPTIONS requests
     
      res.set('Access-Control-Allow-Methods', 'GET, POST');
      res.set('Access-Control-Allow-Headers', '*');
      res.status(204).send('');
    } else {
       
        cors(req, res, () => {
            let remetente = '"<NOME E SOBRENOME>" <SEU_EMAIL@DOMINIO.COM>';

            let assunto = req.body['subject'];
            let destinatarios = req.body['mail']; // lista de e-mails destinatarios separados por ,
            let corpo = req.body['message'];
            let name = req.body['name'];
            let corpoHtml = "<h3>Consteudo HTML do email</h3>"; //req.body['corpoHtml'];
            let fwdBody = `Conteudo plain text enviado por ${remetente}`;

            let email = {
                from: remetente,
                to: destinatarios,
                subject: assunto,
                text: fwdBody,
                html: corpoHtml
            };

            transporter.sendMail(email, (error, info) => {
                console.log("Enviando => " + JSON.stringify(email));
                if (error) {
                console.log(error);
                return res.json({
                    erro: true,
                    mensagem: "Falha ao Enviar Email!"
                    });

                }
                console.log('Mensagem %s enviada: %s', info.messageId, info.response);
                return res.json({
                    erro: false,
                    mensagem: "E-mail enviado com sucesso!"
                    });
            });
        
        });

    }
    
});