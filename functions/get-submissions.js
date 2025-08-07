export async function onRequestGet(context) {
  // Simple authentication - in production, use proper auth
  const authHeader = context.request.headers.get('Authorization');
  const expectedAuth = 'Bearer anomaly-admin-2024'; // Change this to a secure token
  
  if (authHeader !== expectedAuth) {
    return new Response('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Bearer'
      }
    });
  }

  try {
    if (!context.env.FORM_SUBMISSIONS) {
      return new Response(JSON.stringify({
        message: 'KV storage not configured',
        submissions: []
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // List all submissions from KV
    const list = await context.env.FORM_SUBMISSIONS.list();
    const submissions = [];

    for (const key of list.keys) {
      const submission = await context.env.FORM_SUBMISSIONS.get(key.name);
      if (submission) {
        submissions.push({
          key: key.name,
          data: JSON.parse(submission)
        });
      }
    }

    // Sort by timestamp (newest first)
    submissions.sort((a, b) => new Date(b.data.timestamp) - new Date(a.data.timestamp));

    return new Response(JSON.stringify({
      total: submissions.length,
      submissions: submissions
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Error retrieving submissions:', error);
    
    return new Response(JSON.stringify({
      error: 'Failed to retrieve submissions'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
} 