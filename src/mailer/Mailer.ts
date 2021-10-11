import sendmail from "sendmail";

const mailer = sendmail({silent: true});

/**
 * Envia um e-mail para o dono da aplicação com nome de usuário,
 * nota e comentário enviado.
 * @param rate
 * @param comment
 * @param user
 */
const sendRate = (rate: number | string, comment: string, user: string) => {
    mailer({
        from: "noreply@erpbackend.com",
        to: "carlosbda99@hotmail.com",
        subject: "Avaliação Shortener",
        html: `
    <!DOCTYPE html>
      <html lang="pt">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body>
            <div>
                <h1>Shortener</h1>
                <p>Olá Henrique. Você recebeu uma avaliação de ${user} para a aplicação "Shortener URL":</p>
                <p>Nota: ${rate}</p>
                <p>Comentário:</p>
                <div>
                  <p class="italic justify">${comment}</p>
                </div>
            </div>
        </body>
        <style>
            h1 {
                border-bottom: solid 1px gray;
            }
        
            p {
                margin: 5px;
            }
            div {
                max-width: 300px;
            }

            .italic {
                font-style: italic;
            }

            .justify {
                text-align: justify;
            }
        </style>
      </html>
    `
    }, (err, reply) => {
        console.log(err);
        console.log(reply);
    });
};

/**
 * Envia e-mail com nova senha
 * @param password
 * @param user
 * @param to
 */
const sendNewPass = (password: string, user: string, to: string) => {
    mailer({
        from: "noreply@sue.com",
        to,
        subject: "Reset de senha - Shortener",
        html: `
    <!DOCTYPE html>
      <html lang="pt">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body>
            <div>
                <h1>Shortener</h1>
                <p>Olá ${user}.</p>
                <p>Sua nova senha é <span class="italic">${password}</span></p>
            </div>
        </body>
        <style>
            h1 {
                border-bottom: solid 1px gray;
            }
        
            p {
                margin: 5px;
            }
            
            div {
                max-width: 300px;
            }
            
            .italic {
                font-style: italic;
            }
        </style>
      </html>
    `
    }, (err, reply) => {
        console.log(err);
        console.log(reply);
    });
};

export {sendRate, sendNewPass};
