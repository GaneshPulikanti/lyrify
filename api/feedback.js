export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, error: 'Method not allowed' }));
    return;
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
    } else if (!body) {
      // Parse body stream if not pre-parsed
      body = await new Promise((resolve) => {
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve({});
          }
        });
      });
    }

    const { category, message, contact, rating } = body || {};

    if (!message || message.trim().length === 0) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, error: 'Feedback message cannot be empty' }));
      return;
    }

    const feedbackEntry = {
      timestamp: new Date().toISOString(),
      category: category || 'Feature Request',
      rating: rating || 'Good',
      message: message.trim(),
      contact: contact ? contact.trim() : 'Anonymous',
      userAgent: req.headers['user-agent'] || 'Unknown'
    };

    console.log('==============================================');
    console.log('💡 NEW USER FEEDBACK RECEIVED [LYRIFY STUDIO]');
    console.log(`⏰ Time:     ${feedbackEntry.timestamp}`);
    console.log(`📂 Category: ${feedbackEntry.category}`);
    console.log(`⭐ Rating:   ${feedbackEntry.rating}`);
    console.log(`👤 Contact:  ${feedbackEntry.contact}`);
    console.log(`📝 Message:  ${feedbackEntry.message}`);
    console.log('==============================================');

    // Forward to an external webhook (e.g. Discord, Telegram, or Formspree) if set in environment
    const webhookUrl = process.env.FEEDBACK_WEBHOOK_URL || process.env.DISCORD_WEBHOOK;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: `**💡 New Lyrify Feedback!**\n**Category:** ${feedbackEntry.category}\n**Rating:** ${feedbackEntry.rating}\n**Contact:** ${feedbackEntry.contact}\n**Message:**\n>>> ${feedbackEntry.message}`
          })
        });
      } catch (err) {
        console.warn('Webhook delivery error:', err);
      }
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      success: true,
      message: 'Thank you! Your feedback has been received and will help improve Lyrify.'
    }));
  } catch (error) {
    console.error('Feedback submission error:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, error: 'Failed to process feedback' }));
  }
}
