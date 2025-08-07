export async function onRequestPost(context) {
  try {
    // Get form data from the request
    const formData = await context.request.formData();
    
    const submission = {
      timestamp: new Date().toISOString(),
      name: formData.get('name'),
      email: formData.get('email'),
      role: formData.get('role'),
      message: formData.get('message'),
      ip: context.request.headers.get('CF-Connecting-IP') || 'unknown',
      userAgent: context.request.headers.get('User-Agent') || 'unknown'
    };

    // Basic validation
    if (!submission.name || !submission.email || !submission.role || !submission.message) {
      return new Response(JSON.stringify({
        success: false,
        message: 'All fields are required.'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(submission.email)) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Please enter a valid email address.'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Format the submission for logging
    const logEntry = `
=== NEW APPLICATION ===
Date: ${submission.timestamp}
Name: ${submission.name}
Email: ${submission.email}
Role: ${submission.role}
Message: ${submission.message}
IP: ${submission.ip}
User Agent: ${submission.userAgent}
========================

`;

    // In a real Cloudflare Pages environment, you'd use KV storage or Durable Objects
    // For now, we'll use the KV namespace if available, otherwise return success
    try {
      if (context.env.FORM_SUBMISSIONS) {
        // Store in Cloudflare KV
        const key = `submission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await context.env.FORM_SUBMISSIONS.put(key, JSON.stringify(submission));
      }
    } catch (kvError) {
      console.error('KV storage error:', kvError);
      // Continue anyway - don't fail the request
    }

    // Send email notification (you can integrate with services like SendGrid, Mailgun, etc.)
    // For now, we'll just log it
    console.log('New form submission:', submission);

    return new Response(JSON.stringify({
      success: true,
      message: 'Thank you for your application! We\'ll review it and get back to you soon.'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error('Form submission error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      message: 'There was an error processing your application. Please try again.'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// Handle OPTIONS requests for CORS
export async function onRequestOptions() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
} 