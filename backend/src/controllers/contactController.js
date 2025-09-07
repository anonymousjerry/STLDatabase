const submitContact = async (req, res) => {
  try {
    const { name, email, message, recaptchaToken } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Here you would typically save to database or send email
    // For now, we'll just log the contact submission
    console.log('Contact form submission:', {
      name,
      email,
      message,
      timestamp: new Date().toISOString()
    });

    res.status(200).json({
      success: true,
      message: 'Contact form submitted successfully'
    });

  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const sendWelcomeEmail = async (req, res) => {
  try {
    const { name, email, recaptchaToken, provider } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // For Google users, skip reCAPTCHA validation
    if (provider === 'google') {
      console.log('Welcome email for Google user (skipping reCAPTCHA):', {
        name,
        email,
        provider,
        timestamp: new Date().toISOString()
      });
    } else {
      // For regular users, validate reCAPTCHA
      if (!recaptchaToken) {
        return res.status(400).json({
          success: false,
          message: 'reCAPTCHA token is required'
        });
      }
      
      console.log('Welcome email for regular user:', {
        name,
        email,
        recaptchaToken,
        timestamp: new Date().toISOString()
      });
    }

    // Here you would typically send the welcome email
    // For now, we'll just log the welcome email request
    console.log('Welcome email sent successfully:', {
      name,
      email,
      provider: provider || 'regular',
      timestamp: new Date().toISOString()
    });

    res.status(200).json({
      success: true,
      message: 'Welcome email sent successfully'
    });

  } catch (error) {
    console.error('Welcome email error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  submitContact,
  sendWelcomeEmail
};
