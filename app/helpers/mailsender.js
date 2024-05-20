"use strict";
// const { rejects } = require("assert");
const nodemailer = require("nodemailer");
// const { resolve } = require("path");

// sender = 'mtca.noreply@gouv.bj', senderFullname = 'MTCA NoReply', 
exports.sendMail = async(
  receiver, receiverFullname = '', subject = '', text='',htmlText='', buttonShow = true, buttonText= 'Continuez',buttonLink='',attachedFile=null, attachedFileName='', sav=false, savInfos) => {
  // console.log('sav :::::::::::::::::::::::::::::::: ', sav, savInfos)

  let templateCurrent = `

  <!doctype html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

    <head>
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style type="text/css">
        #outlook a {
          padding: 0;
        }

        body {
          margin: 0;
          padding: 0;
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }

        table,
        td {
          border-collapse: collapse;
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
        }

        img {
          border: 0;
          height: auto;
          line-height: 100%;
          outline: none;
          text-decoration: none;
          -ms-interpolation-mode: bicubic;
        }

        p {
          display: block;
          margin: 13px 0;
        }
      </style>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500&display=swap" rel="stylesheet" type="text/css">
      <style type="text/css">
        @import url(https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500&display=swap);
      </style>
      <style type="text/css">
        @media only screen and (min-width:480px) {
          .mj-column-per-100 {
            width: 100% !important;
            max-width: 100%;
          }
        }
      </style>
      <style type="text/css">
        @media only screen and (max-width:480px) {
          table.mj-full-width-mobile {
            width: 100% !important;
          }

          td.mj-full-width-mobile {
            width: auto !important;
          }
        }
      </style>
      <style type="text/css">
        a,
        span,
        td,
        th {
          -webkit-font-smoothing: antialiased !important;
          -moz-osx-font-smoothing: grayscale !important;
        }
      </style>
    </head>

    <body style="background-color:#f3f3f5;">
      
      <div style="background-color:#f3f3f5;">
        <div style="margin:0px auto;max-width:600px;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
            <tbody>
              <tr>
                <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                  <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                      <tr>
                        <td style="font-size:0px;word-break:break-word;">
                          <div style="height:20px;"> &nbsp; </div>
                        </td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style="background:#007137 top center auto repeat;margin:0px auto;border-radius:4px 4px 0 0;max-width:600px;">
          <div style="line-height:0;font-size:0;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#007137 url(https://www.transparenttextures.com/patterns/brushed-alum.png) top center / auto repeat;width:100%;border-radius:4px 4px 0 0;">
              <tbody>
                <tr>
                  <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                    <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                        <tr>
                          <td style="font-size:0px;word-break:break-word;">
                            <div style="height:20px;"> &nbsp; </div>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                            <div style="font-family:Poppins, Helvetica, Arial, sans-serif;font-size:24px;font-weight:700;line-height:30px;text-align:center;color:#ffffff;">
                              <p style="margin: 0;">Plateforme de gestion des statistiques du tourisme du Bénin</p>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;border-radius:0 0 4px 4px;max-width:600px;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;border-radius:0 0 4px 4px;">
            <tbody>
              <tr>
                <td style="direction:ltr;font-size:0px;padding:40px 10px 20px 10px;text-align:center;">
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;">
            <tbody>
              <tr>
                <td style="direction:ltr;font-size:0px;padding:0px;text-align:center;">
                  <div style="margin:0px auto;max-width:600px;">
                    <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                      <tbody>
                        <tr>
                          <td style="direction:ltr;font-size:0px;padding:20px 0;padding-top:0;text-align:center;">
                            <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                              <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                                <tr>
                                  <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                    <div style="font-family:Poppins, Helvetica, Arial, sans-serif;font-size:20px;font-weight:300;line-height:30px;text-align:left;color:#003366;">

      <p style="margin: 0;">`+ htmlText +`</p>

</div>
</td>
</tr>


<tr>
<td align="left" vertical-align="middle" style="font-size:0px;padding:10px 25px;word-break:break-word;">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
  <tr>
    <td align="center" bgcolor="#043768" role="presentation" style="border:none;border-radius:3px;cursor:auto;mso-padding-alt:10px 25px;background:#043768;" valign="middle">

      <a href="`+ buttonLink +`" style="word-break: normal; display: inline-block; background: #043768; color: white; font-family: Poppins, Helvetica, Arial, sans-serif; font-size: 18px; font-weight: normal; line-height: 30px; margin: 0; text-decoration: none; text-transform: none; padding: 10px 25px; mso-padding-alt: 0px; border-radius: 3px;" target="_blank">`+ buttonText +`</a>

                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>



                              </table>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style="background:#043768;background-color:#043768;margin:0px auto;max-width:600px;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#043768;background-color:#043768;width:100%;">
            <tbody>
              <tr>
                <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                  <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:center;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:Poppins, Helvetica, Arial, sans-serif;font-size:12px;font-weight:100;line-height:30px;text-align:center;color:#ffffff;">
                            <p style="margin: 0;"> Vous recevez cet e-mail car vous vous êtes inscrit sur la plateforme de gestion des statistiques du tourisme du Bénin <br> 
                            Si vous n'êtes pas concerné par ce mail, veuillez l'ignorer.
                            <br> 

                            <hr> Copyright © 2022, Plateforme de gestion des statistiques du tourisme du Bénin, All rights reserved.
                            </p>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </div>
                  </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style="margin:0px auto;max-width:600px;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
            <tbody>
              <tr>
                <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                  <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                      <tr>
                        <td style="font-size:0px;word-break:break-word;">
                          <div style="height:1px;"> &nbsp; </div>
                        </td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </body>

    </html>
  
    `

    let templateSAV = null

    if( savInfos ) {
      templateSAV =`
  
      <!doctype html>
        <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    
        <head>
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style type="text/css">
            #outlook a {
              padding: 0;
            }
    
            body {
              margin: 0;
              padding: 0;
              -webkit-text-size-adjust: 100%;
              -ms-text-size-adjust: 100%;
            }
    
            table,
            td {
              border-collapse: collapse;
              mso-table-lspace: 0pt;
              mso-table-rspace: 0pt;
            }
    
            img {
              border: 0;
              height: auto;
              line-height: 100%;
              outline: none;
              text-decoration: none;
              -ms-interpolation-mode: bicubic;
            }
    
            p {
              display: block;
              margin: 13px 0;
            }
          </style>
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500&display=swap" rel="stylesheet" type="text/css">
          <style type="text/css">
            @import url(https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500&display=swap);
          </style>
          <style type="text/css">
            @media only screen and (min-width:480px) {
              .mj-column-per-100 {
                width: 100% !important;
                max-width: 100%;
              }
            }
          </style>
          <style type="text/css">
            @media only screen and (max-width:480px) {
              table.mj-full-width-mobile {
                width: 100% !important;
              }
    
              td.mj-full-width-mobile {
                width: auto !important;
              }
            }
          </style>
          <style type="text/css">
            a,
            span,
            td,
            th {
              -webkit-font-smoothing: antialiased !important;
              -moz-osx-font-smoothing: grayscale !important;
            }
          </style>
        </head>
    
        <body style="background-color:#f3f3f5;">
          
          <div style="background-color:#f3f3f5;">
            <div style="margin:0px auto;max-width:600px;">
              <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                <tbody>
                  <tr>
                    <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                      <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                          <tr>
                            <td style="font-size:0px;word-break:break-word;">
                              <div style="height:20px;"> &nbsp; </div>
                            </td>
                          </tr>
                        </table>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style="background:#007137 top center auto repeat;margin:0px auto;border-radius:4px 4px 0 0;max-width:600px;">
              <div style="line-height:0;font-size:0;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#007137 url(https://www.transparenttextures.com/patterns/brushed-alum.png) top center / auto repeat;width:100%;border-radius:4px 4px 0 0;">
                  <tbody>
                    <tr>
                      <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                        <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                            <tr>
                              <td style="font-size:0px;word-break:break-word;">
                                <div style="height:20px;"> &nbsp; </div>
                              </td>
                            </tr>
                            <tr>
                              <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                <div style="font-family:Poppins, Helvetica, Arial, sans-serif;font-size:24px;font-weight:700;line-height:30px;text-align:center;color:#ffffff;">
                                  <p style="margin: 0;">Plateforme de gestion des statistiques du tourisme du Bénin</p>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;border-radius:0 0 4px 4px;max-width:600px;">
              <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;border-radius:0 0 4px 4px;">
                <tbody>
                  <tr>
                    <td style="direction:ltr;font-size:0px;padding:40px 10px 20px 10px;text-align:center;">
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
              <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;">
                <tbody>
                  <tr>
                    <td style="direction:ltr;font-size:0px;padding:0px;text-align:center;">
                      <div style="margin:0px auto;max-width:600px;">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                          <tbody>
                            <tr>
                              <td style="direction:ltr;font-size:0px;padding:20px 0;padding-top:0;text-align:center;">
                                <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
  
  
  
                                    <tr>
                                      <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                        <div style="font-family:Poppins, Helvetica, Arial, sans-serif;font-size:20px;font-weight:300;line-height:30px;text-align:left;color:#003366;">
    
          <p style="margin: 0;"> Nom et Prénom(s) : `+ savInfos.nomPrenoms+`</p>

          </div>
        </td>
      </tr>
      <tr>
        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
          <div style="font-family:Poppins, Helvetica, Arial, sans-serif;font-size:20px;font-weight:300;line-height:30px;text-align:left;color:#003366;">

          <p style="margin: 0;"> Email : ` + savInfos.mail + `</p>

          </div>
        </td>
      </tr>
      <tr>
        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
          <div style="font-family:Poppins, Helvetica, Arial, sans-serif;font-size:20px;font-weight:300;line-height:30px;text-align:left;color:#003366;">

          <p style="margin: 0;"> Sujet : `+ savInfos.sujet +`</p>

          </div>
        </td>
      </tr>

      <tr>
        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
          <div style="font-family:Poppins, Helvetica, Arial, sans-serif;font-size:20px;font-weight:300;line-height:30px;text-align:left;color:#003366;">

          <p style="margin: 0;">`+ htmlText +`</p>
    
                                        </div>
                                      </td>
                                    </tr>
  
  
  
                                  </table>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style="background:#043768;background-color:#043768;margin:0px auto;max-width:600px;">
              <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#043768;background-color:#043768;width:100%;">
                <tbody>
                  <tr>
                    <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                      <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:center;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                          <tr>
                            <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                              <div style="font-family:Poppins, Helvetica, Arial, sans-serif;font-size:12px;font-weight:100;line-height:30px;text-align:center;color:#ffffff;">
                                <p style="margin: 0;"> 
                                  Copyright © 2022, Plateforme de gestion des statistiques du tourisme du Bénin, All rights reserved.
                                </p>
                              </div>
                            </td>
                          </tr>
                        </table>
                      </div>
                      </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style="margin:0px auto;max-width:600px;">
              <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                <tbody>
                  <tr>
                    <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                      <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                          <tr>
                            <td style="font-size:0px;word-break:break-word;">
                              <div style="height:1px;"> &nbsp; </div>
                            </td>
                          </tr>
                        </table>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </body>
    
        </html>
      
        `
    }
    

  return new Promise(async(resolve, reject) => {
    try{

      //----------- mailtrap
      // let transporter = nodemailer.createTransport({
      //   host: "smtp.mailtrap.io",
      //   port: 2525,
      //   secure: false,
      //   auth: {
      //     user: "d00e158e4add19",
      //     pass: "fec046df86196e"
      //   }
      // });

      // ----------- gouv  djessiagli@gmail.com    aagli@asin.bj
      let transporter = nodemailer.createTransport({
        // host: "mailbackend.gouv.bj",
        host: "mail.gouv.bj",
        port: 587, //25
        auth: {
          user: "mtca.noreply@gouv.bj",
          pass: "@dm1nistrat0r"
        },
        secure: false, // use TLS
        secureConnection: false, // TLS requires secureConnection to be false
        tls: {
          // do not fail on invalid certs
          rejectUnauthorized: false
        },
        debug:true
        // authMethod:'NTLM',
        // ignoreTLS: false,
      });

      // ----------- jos
      // let transporter = nodemailer.createTransport({
      //   host: "smtp.gmail.com",
      //   port: 587,
      //   secure: false,
      //   auth: {
      //     user: "wjospy@gmail.com",
      //     pass: "jetvoxtvhetgwudt"
      //   }
      // });

      console.log(' --- transporter: ', transporter);
      
      var mailOptions = {
        from: 'mtca.noreply@gouv.bj',
        to: receiver,
        subject: subject,
        text: text,
        html: sav ? templateSAV : templateCurrent,
        attachments: attachedFile ? [
          {   
            filename: attachedFileName,
            path: attachedFile,
            contentType: 'application/pdf'
          },
        ] : []
      };

      // console.log('mailOptions: ', mailOptions)

      await transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log('❌ Email not sent :  ' + JSON.stringify(error));
          reject(error);
        } else {
          console.log('✅ Email sent :  ' + JSON.stringify(info));
          resolve(true);
        }
      });
    }catch (error) {console.log('error ', error)}
  })
}