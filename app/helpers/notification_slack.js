'use strict';

const slackWebhookUrl = 'https://hooks.slack.com/services/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';
const Wreck = require('@hapi/wreck');

exports.send_log = (message) => {
  return new Promise(async function(resolve, reject) {
    // console.log('message::: ❌ ❌ ❌', message);
    const payload = { text: message, };
    try {
        const result = await Wreck.post(slackWebhookUrl, {
            payload: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' },
        });
        return resolve({
          statusCode: 200,
          result
        });
    } catch (error) {
        console.error('Erreur lors de l\'envoi de la notification Slack', error);
        reject(error)
    }
  });
};