const mailgun = require("mailgun-js");

async function sendEmail(object){
    const DOMAIN = "https://api.mailgun.net/v3/sandbox6ae133bd995b4d49adf9701917c2f62c.mailgun.org";
    const mg = mailgun({apiKey: "04b96ae86b3217411fba20cbc63cd4c5-62916a6c-68a6d92b", domain: DOMAIN});
        const data = {
      from: "Mailgun Sandbox <postmaster@sandbox6ae133bd995b4d49adf9701917c2f62c.mailgun.org>",
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