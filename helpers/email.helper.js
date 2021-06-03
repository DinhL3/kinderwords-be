const mailgun = require("mailgun-js");
const Template = require("../models/Template");
const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

const emailHelper = {};
const emailInternalHelper = {};

emailInternalHelper.createTemplatesIfNotExists = async () => {
  try {
    let template = await Template.findOne({
      template_key: "reply_notification_email",
    });
    if (!template) {
      await Template.create({
        name: "Reply Notification Email Template",
        template_key: "reply_notification_email",
        description: "This template is used when a user replies to a request",
        from: "Kinder Words <admin@kinderwords.com>",
        subject: "Someone replied to your request!",
        variables: ["name"],
        html: `<div style="width=100%; font-family: Comic Neue, cursive; padding:0; margin: 0; display: flex; color:white">
        <div style="width=310px; margin: auto; background: linear-gradient(
          to bottom,
          hsl(310, 50%, 10%),
          hsl(325, 50%, 15%),
          hsl(340, 50%, 20%)
        ); padding: 4rem 2rem; box-shadow: 3px 5px 15px 5px rgba(0, 0, 0, 0.419);">
          <h1 style="display: block; border-bottom: 1px solid hsla(310, 10%, 50%, 0.5); text-align:center; margin: 0 0 1rem 0; padding-bottom: 1rem;">[KINDER WORDS]</h1>
          Hi %name%,
                  <br /> <br /> 
                  Someone replied to a request you sent.
                  <br/>Please visit your inbox to read this reply.
                  <br/>
          <div style="display:flex;">
          <a href="https://kinder-words.netlify.app/inbox" target="_blank" style="display: block; margin: 1rem 0; padding: 0.5em; color: white; text-decoration: none; border: 1px solid white;">Go to Inbox</a>
            </div>
                  Kinder Words
          </div>
                  </div>
            `,
      });
    }
  } catch (err) {
    console.log(error);
  }
};

emailHelper.renderEmailTemplate = async (
  template_key,
  variablesObj,
  toEmail
) => {
  const template = await Template.findOne({ template_key });
  if (!template) {
    return { error: "Invalid Template Key" };
  }
  const data = {
    from: template.from,
    to: toEmail,
    subject: template.subject,
    html: template.html,
  };
  for (let index = 0; index < template.variables.length; index++) {
    let key = template.variables[index];
    if (!variablesObj[key]) {
      return {
        error: `Invalid variable key: Missing ${template.variables[index]}`,
      };
    }
    let re = new RegExp(`%${key}%`, "g");
    data.subject = data.subject.replace(re, variablesObj[key]);
    data.html = data.html.replace(re, variablesObj[key]);
  }
  return data;
};

emailHelper.send = (data) => {
  mg.messages().send(data, function (error, info) {
    if (error) {
      console.log(error);
    }
    console.log(info);
  });
};

module.exports = {
  emailInternalHelper,
  emailHelper,
};
