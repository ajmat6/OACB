const nodemailer = require('nodemailer')

exports.generateOTP = () => {
    let otp = '';
    for (let i = 0; i <= 3; i++) {
        const randomValue = Math.round(Math.random() * 9);
        otp = otp + randomValue;
    }

    return otp;
}

exports.mailTransport = () => 
    nodemailer.createTransport({
        host: 'smtp.elasticemail.com',
        port: 2525,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD
        }
    })

exports.emailTemplate = OTP => {
    return `
    <!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="x-apple-disable-message-reformatting">
        <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">

        <meta name="color-scheme" content="light">
        <meta name="supported-color-schemes" content="light">

        
        <!--[if !mso]><!-->
          
          <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap">
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap">

          <style type="text/css">
          // TODO: fix me!
            @import url(https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap);
        </style>
        
        <!--<![endif]-->

        <!--[if mso]>
          <style>
              // TODO: fix me!
              * {
                  font-family: sans-serif !important;
              }
          </style>
        <![endif]-->
    
        
        <!-- NOTE: the title is processed in the backend during the campaign dispatch -->
        <title></title>

        <!--[if gte mso 9]>
        <xml>
            <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
        
    <style>
        :root {
            color-scheme: light;
            supported-color-schemes: light;
        }

        html,
        body {
            margin: 0 auto !important;
            padding: 0 !important;
            height: 100% !important;
            width: 100% !important;

            overflow-wrap: break-word;
            -ms-word-break: break-all;
            -ms-word-break: break-word;
            word-break: break-all;
            word-break: break-word;
        }


        

  center,
  #body_table{
    
  }

  .paragraph {
    font-size: 14px;
    font-family: Open Sans, sans-serif;
    color: #d4d4d4;
  }

  ul, ol {
    padding: 0;
    margin-top: 0;
    margin-bottom: 0;
  }

  li {
    margin-bottom: 0;
  }
 
  .list-block-list-outside-left li {
    margin-left: 20px;
  }

  .list-block-list-outside-right li {
    margin-right: 20px;
  }
  
  .heading1 {
    font-weight: 400;
    font-size: 32px;
    font-family: Verdana, sans-serif;
    color: #ffffff;
  }

  .heading2 {
    font-weight: 400;
    font-size: 28px;
    font-family: Open Sans, sans-serif;
    color: #ffffff;
  }

  .heading3 {
    font-weight: 400;
    font-size: 22px;
    font-family: Open Sans, sans-serif;
    color: #ffffff;
  }
  
  a {
    color: #f61945;
    text-decoration: none;
  }
  


        * {
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%;
        }

        div[style*="margin: 16px 0"] {
            margin: 0 !important;
        }

        #MessageViewBody,
        #MessageWebViewDiv {
            width: 100% !important;
        }

        table {
            border-collapse: collapse;
            border-spacing: 0;
            mso-table-lspace: 0pt !important;
            mso-table-rspace: 0pt !important;
        }
        table:not(.button-table) {
            border-spacing: 0 !important;
            border-collapse: collapse !important;
            table-layout: fixed !important;
            margin: 0 auto !important;
        }

        th {
            font-weight: normal;
        }

        tr td p {
            margin: 0;
        }

        img {
            -ms-interpolation-mode: bicubic;
        }

        a[x-apple-data-detectors],

        .unstyle-auto-detected-links a,
        .aBn {
            border-bottom: 0 !important;
            cursor: default !important;
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }

        .im {
            color: inherit !important;
        }

        .a6S {
            display: none !important;
            opacity: 0.01 !important;
        }

        img.g-img+div {
            display: none !important;
        }

        @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
            u~div .contentMainTable {
                min-width: 320px !important;
            }
        }

        @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
            u~div .contentMainTable {
                min-width: 375px !important;
            }
        }

        @media only screen and (min-device-width: 414px) {
            u~div .contentMainTable {
                min-width: 414px !important;
            }
        }
    </style>

    <style>
        @media only screen and (max-device-width: 600px) {
            .contentMainTable {
                width: 100% !important;
                margin: auto !important;
            }
            .single-column {
                width: 100% !important;
                margin: auto !important;
            }
            .multi-column {
                width: 100% !important;
                margin: auto !important;
            }
            .imageBlockWrapper {
                width: 100% !important;
                margin: auto !important;
            }
        }
        @media only screen and (max-width: 600px) {
            .contentMainTable {
                width: 100% !important;
                margin: auto !important;
            }
            .single-column {
                width: 100% !important;
                margin: auto !important;
            }
            .multi-column {
                width: 100% !important;
                margin: auto !important;
            }
            .imageBlockWrapper {
                width: 100% !important;
                margin: auto !important;
            }
        }
    </style>
    <style></style>
    
<!--[if mso | IE]>
    <style>
        .list-block-outlook-outside-left {
            margin-left: -18px;
        }
    
        .list-block-outlook-outside-right {
            margin-right: -18px;
        }

    </style>
<![endif]-->


    </head>

    <body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #000000;">
        <center role="article" aria-roledescription="email" lang="en" style="width: 100%; background-color: #000000;">
            <!--[if mso | IE]>
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" id="body_table" style="background-color: #000000;">
            <tbody>    
                <tr>
                    <td>
                    <![endif]-->
                        <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: auto;" class="contentMainTable">
                            <tr class="wp-block-editor-spacerblock-v1"><td style="background-color:#000000;line-height:50px;font-size:50px;width:100%;min-width:100%">&nbsp;</td></tr><tr><td style="padding-top:0;padding-left:0;padding-right:0;padding-bottom:0;background-color:#1C1B1E"><table role="presentation" class="multi-column" style="width:600px;border-collapse:collapse !important" cellpadding="0" cellspacing="0"><tbody><tr style="padding-top:0;padding-left:0;padding-right:0;padding-bottom:0" class="wp-block-editor-twocolumnsfiftyfiftyblock-v1"><td style="width:300px;float:left" class="wp-block-editor-column single-column"><table role="presentation" align="left" border="0" class="single-column" width="300" style="width:300px;float:left;border-collapse:collapse !important" cellspacing="0" cellpadding="0"><tbody><tr class="wp-block-editor-imageblock-v1"><td style="background-color:#1C1B1E;padding-top:0;padding-bottom:0;padding-left:0;padding-right:0" align="center"><table align="center" width="300" class="imageBlockWrapper" style="width:300px" role="presentation"><tbody><tr><td style="padding:0"><img src="https://api.smtprelay.co/userfile/d0c4ddc4-0276-455a-8512-7d208d1fc56a/Oldaryaconnect!.png" width="300" height="" alt="" style="border-radius:0px;display:block;height:auto;width:100%;max-width:100%;border:0" class="g-img"></td></tr></tbody></table></td></tr></tbody></table></td><td style="width:300px;float:left" class="wp-block-editor-column single-column"><table role="presentation" align="right" border="0" class="single-column" width="300" style="width:300px;float:left;border-collapse:collapse !important" cellspacing="0" cellpadding="0"><tbody><tr class="wp-block-editor-headingblock-v1"><td valign="top" style="background-color:#1C1B1E;display:block;padding-top:36px;padding-right:36px;padding-bottom:36px;padding-left:36px"><p style="font-family:Open Sans, sans-serif;line-height:1.15;font-size:22px;background-color:#1C1B1E;margin:0;word-break:normal" class="heading3"><strong>OldAryaConnect!</strong></p></td></tr><tr class="wp-block-editor-paragraphblock-v1"><td valign="top" style="padding:0px 36px 36px 36px;background-color:#1C1B1E"><p class="paragraph" style="font-family:Open Sans, sans-serif;line-height:2;font-size:14px;margin:0;word-break:normal">OTP for email verification on oldaryaconnect is ${OTP}<br></p></td></tr></tbody></table></td></tr></tbody></table></td></tr>
                        </table>
                    <!--[if mso | IE]>
                    </td>
                </tr>
            </tbody>
            </table>
            <![endif]-->
        </center>
    </body>
</html>
    `
}

exports.resetPasswordTemplate = URL => {
    return `
    <!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="x-apple-disable-message-reformatting">
        <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">

        <meta name="color-scheme" content="light">
        <meta name="supported-color-schemes" content="light">

        
        <!--[if !mso]><!-->
          
          <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap">
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap">

          <style type="text/css">
          // TODO: fix me!
            @import url(https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap);
        </style>
        
        <!--<![endif]-->

        <!--[if mso]>
          <style>
              // TODO: fix me!
              * {
                  font-family: sans-serif !important;
              }
          </style>
        <![endif]-->
    
        
        <!-- NOTE: the title is processed in the backend during the campaign dispatch -->
        <title></title>

        <!--[if gte mso 9]>
        <xml>
            <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
        
    <style>
        :root {
            color-scheme: light;
            supported-color-schemes: light;
        }

        html,
        body {
            margin: 0 auto !important;
            padding: 0 !important;
            height: 100% !important;
            width: 100% !important;

            overflow-wrap: break-word;
            -ms-word-break: break-all;
            -ms-word-break: break-word;
            word-break: break-all;
            word-break: break-word;
        }


        

  center,
  #body_table{
    
  }

  .paragraph {
    font-size: 14px;
    font-family: Open Sans, sans-serif;
    color: #d4d4d4;
  }

  ul, ol {
    padding: 0;
    margin-top: 0;
    margin-bottom: 0;
  }

  li {
    margin-bottom: 0;
  }
 
  .list-block-list-outside-left li {
    margin-left: 20px;
  }

  .list-block-list-outside-right li {
    margin-right: 20px;
  }
  
  .heading1 {
    font-weight: 400;
    font-size: 32px;
    font-family: Verdana, sans-serif;
    color: #ffffff;
  }

  .heading2 {
    font-weight: 400;
    font-size: 28px;
    font-family: Open Sans, sans-serif;
    color: #ffffff;
  }

  .heading3 {
    font-weight: 400;
    font-size: 22px;
    font-family: Open Sans, sans-serif;
    color: #ffffff;
  }
  
  a {
    color: #f61945;
    text-decoration: none;
  }
  


        * {
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%;
        }

        div[style*="margin: 16px 0"] {
            margin: 0 !important;
        }

        #MessageViewBody,
        #MessageWebViewDiv {
            width: 100% !important;
        }

        table {
            border-collapse: collapse;
            border-spacing: 0;
            mso-table-lspace: 0pt !important;
            mso-table-rspace: 0pt !important;
        }
        table:not(.button-table) {
            border-spacing: 0 !important;
            border-collapse: collapse !important;
            table-layout: fixed !important;
            margin: 0 auto !important;
        }

        th {
            font-weight: normal;
        }

        tr td p {
            margin: 0;
        }

        img {
            -ms-interpolation-mode: bicubic;
        }

        a[x-apple-data-detectors],

        .unstyle-auto-detected-links a,
        .aBn {
            border-bottom: 0 !important;
            cursor: default !important;
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }

        .im {
            color: inherit !important;
        }

        .a6S {
            display: none !important;
            opacity: 0.01 !important;
        }

        img.g-img+div {
            display: none !important;
        }

        @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
            u~div .contentMainTable {
                min-width: 320px !important;
            }
        }

        @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
            u~div .contentMainTable {
                min-width: 375px !important;
            }
        }

        @media only screen and (min-device-width: 414px) {
            u~div .contentMainTable {
                min-width: 414px !important;
            }
        }
    </style>

    <style>
        @media only screen and (max-device-width: 600px) {
            .contentMainTable {
                width: 100% !important;
                margin: auto !important;
            }
            .single-column {
                width: 100% !important;
                margin: auto !important;
            }
            .multi-column {
                width: 100% !important;
                margin: auto !important;
            }
            .imageBlockWrapper {
                width: 100% !important;
                margin: auto !important;
            }
        }
        @media only screen and (max-width: 600px) {
            .contentMainTable {
                width: 100% !important;
                margin: auto !important;
            }
            .single-column {
                width: 100% !important;
                margin: auto !important;
            }
            .multi-column {
                width: 100% !important;
                margin: auto !important;
            }
            .imageBlockWrapper {
                width: 100% !important;
                margin: auto !important;
            }
        }
    </style>
    <style></style>
    
<!--[if mso | IE]>
    <style>
        .list-block-outlook-outside-left {
            margin-left: -18px;
        }
    
        .list-block-outlook-outside-right {
            margin-right: -18px;
        }

    </style>
<![endif]-->


    </head>

    <body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #000000;">
        <center role="article" aria-roledescription="email" lang="en" style="width: 100%; background-color: #000000;">
            <!--[if mso | IE]>
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" id="body_table" style="background-color: #000000;">
            <tbody>    
                <tr>
                    <td>
                    <![endif]-->
                        <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: auto;" class="contentMainTable">
                            <tr class="wp-block-editor-spacerblock-v1"><td style="background-color:#000000;line-height:50px;font-size:50px;width:100%;min-width:100%">&nbsp;</td></tr><tr><td style="padding-top:0;padding-left:0;padding-right:0;padding-bottom:0;background-color:#1C1B1E"><table role="presentation" class="multi-column" style="width:600px;border-collapse:collapse !important" cellpadding="0" cellspacing="0"><tbody><tr style="padding-top:0;padding-left:0;padding-right:0;padding-bottom:0" class="wp-block-editor-twocolumnsfiftyfiftyblock-v1"><td style="width:300px;float:left" class="wp-block-editor-column single-column"><table role="presentation" align="left" border="0" class="single-column" width="300" style="width:300px;float:left;border-collapse:collapse !important" cellspacing="0" cellpadding="0"><tbody><tr class="wp-block-editor-imageblock-v1"><td style="background-color:#1C1B1E;padding-top:0;padding-bottom:0;padding-left:0;padding-right:0" align="center"><table align="center" width="300" class="imageBlockWrapper" style="width:300px" role="presentation"><tbody><tr><td style="padding:0"><img src="https://api.smtprelay.co/userfile/d0c4ddc4-0276-455a-8512-7d208d1fc56a/Oldaryaconnect!.png" width="300" height="" alt="" style="border-radius:0px;display:block;height:auto;width:100%;max-width:100%;border:0" class="g-img"></td></tr></tbody></table></td></tr></tbody></table></td><td style="width:300px;float:left" class="wp-block-editor-column single-column"><table role="presentation" align="right" border="0" class="single-column" width="300" style="width:300px;float:left;border-collapse:collapse !important" cellspacing="0" cellpadding="0"><tbody><tr class="wp-block-editor-headingblock-v1"><td valign="top" style="background-color:#1C1B1E;display:block;padding-top:36px;padding-right:36px;padding-bottom:36px;padding-left:36px"><p style="font-family:Open Sans, sans-serif;line-height:1.15;font-size:22px;background-color:#1C1B1E;margin:0;word-break:normal" class="heading3"><strong>OldAryaConnect!</strong></p></td></tr><tr class="wp-block-editor-paragraphblock-v1"><td valign="top" style="padding:0px 36px 36px 36px;background-color:#1C1B1E"><p class="paragraph" style="font-family:Open Sans, sans-serif;line-height:2;font-size:14px;margin:0;word-break:normal">Hey! Dear user, your request for reset password for your oldaryaconnect account is successfully accepted and to change your password you have to follow below link ${URL}<br></p></td></tr></tbody></table></td></tr></tbody></table></td></tr>
                        </table>
                    <!--[if mso | IE]>
                    </td>
                </tr>
            </tbody>
            </table>
            <![endif]-->
        </center>
    </body>
</html>
    `
}