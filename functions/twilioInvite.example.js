/**
 * Example Firebase Cloud Function / Express handler for Twilio SMS invites.
 * Deploy this on a secure backend. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM.
 *
 * npm i twilio firebase-functions firebase-admin
 */

/* eslint-disable @typescript-eslint/no-var-requires */
const functions = require('firebase-functions');
const twilio = require('twilio');

exports.sendInviteSms = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method not allowed');
    return;
  }

  const { to, babyName, shareUrl, inviterName } = req.body || {};
  if (!to || !shareUrl) {
    res.status(400).json({ error: 'to and shareUrl are required' });
    return;
  }

  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  const body = `${inviterName || 'A parent'} invited you to BabyBliss memories for ${
    babyName || 'their baby'
  }: ${shareUrl}`;

  try {
    const message = await client.messages.create({
      to,
      from: process.env.TWILIO_FROM,
      body,
    });
    res.json({ sid: message.sid });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Twilio error' });
  }
});
