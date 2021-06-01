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
        html: `Hi <strong>%name%</strong>,
            <br /> <br /> 
            Someone replied to a request you sent.
            <br/>Please visit your inbox to read this reply.
            <br /> <br /> 
            <br /> Kinder Words
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
