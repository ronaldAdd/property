const mailgun = require("mailgun-js");

async function sendEmail(object){
    const DOMAIN = "sandbox0151854f537b4baf8723f87da609cf5e.mailgun.org";
    const mg = mailgun({apiKey: "ae7d5a4d85bb30c614c763d1f99e2ed5-dbc22c93-a3d49750", domain: DOMAIN});
        const data = {
      from: "Mailgun Sandbox <postmaster@sandbox0151854f537b4baf8723f87da609cf5e.mailgun.org>",
      to: object[0].to,
      subject: object[0].subject,
      html: object[0].body
    };
    try{
        const result=await mg.messages().send(data);
        return (result.message);
    }catch(err){
        //insert sentry
        return (err.message);
    }
  }

  exports.sendEmail = sendEmail;