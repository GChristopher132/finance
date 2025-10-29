"use server";

import { Resend } from 'resend';

// Initialize Resend with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

// The main server action function
export async function sendEmail(formData) {
  // Extract data from formData
  const fullName = formData.get('fullName');
  const email = formData.get('email');
  const phone = formData.get('phone');
  const howHear = formData.get('howHear');
  const message = formData.get('message');

  // Simple server-side validation
  if (!fullName || !email || !howHear || !message) {
    return { success: false, error: 'Please fill out all required fields.' };
  }

  // Get the current year
  const currentYear = new Date().getFullYear();

  // Create a well-formatted HTML body for the email
  const htmlBody = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Form Submission</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f4; -webkit-font-smoothing: antialiased;">
      
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td style="padding: 20px 0;">
            
            <!--[if (gte mso 9)|(IE)]>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
            <tr>
            <td align="center" valign="top">
            <![endif]-->
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
              
              <!-- Header with Logo -->
              <tr>
                <td align="center" style="background-color: #0A2342; padding: 20px;">
                  <!-- 
                    IMPORTANT: This URL MUST be an absolute path to your logo on your live website.
                    This example assumes your site is: https://www.bankschanneladvisors.com
                    We've added ?raw=true to bypass Vercel's image optimization for this email.
                  -->
                  <img 
                    src="https://www.bankschanneladvisors.com/images/banks-channel-logo.png?raw=true" 
                    alt="Banks Channel Advisors Logo" 
                    width="200" 
                    style="display: block; width: 200px; max-width: 100%;"
                  >
                </td>
              </tr>
    
              <!-- Body Content -->
              <tr>
                <td style="padding: 30px 40px; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; line-height: 1.6; color: #333; font-size: 16px;">
                  <h2 style="color: #0A2342; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; margin-top: 0;">New Contact Form Submission</h2>
                  <p style="color: #555;">You have received a new message from your website contact form.</p>
                  <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;" />
                  
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size: 16px;">
                    <tr>
                      <td style="padding: 5px 0; color: #555;" width="190" valign="top"><strong>Full Name:</strong></td>
                      <td style="padding: 5px 0; color: #333;" valign="top">${String(fullName)}</td>
                    </tr>
                    <tr>
                      <td style="padding: 5px 0; color: #555;" width="190" valign="top"><strong>Email:</strong></td>
                      <td style="padding: 5px 0; color: #333;" valign="top"><a href="mailto:${String(email)}" style="color: #5097C9; text-decoration: none;">${String(email)}</a></td>
                    </tr>
                    <tr>
                      <td style="padding: 5px 0; color: #555;" width="190" valign="top"><strong>Phone:</strong></td>
                      <td style="padding: 5px 0; color: #333;" valign="top">${String(phone) || 'Not provided'}</td>
                    </tr>
                    <tr>
                      <td style="padding: 5px 0; color: #555;" width="190" valign="top"><strong>How did they hear about us?</strong></td>
                      <td style="padding: 5px 0; color: #333;" valign="top">${String(howHear)}</td>
                    </tr>
                  </table>
                  
                  <h3 style="color: #0A2342; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; margin-top: 25px; margin-bottom: 10px;">Message:</h3>
                  <p style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; border: 1px solid #ddd; color: #333; margin: 0;">
                    ${String(message).replace(/\n/g, '<br>')}
                  </p>
                </td>
              </tr>
    
              <!-- Footer -->
              <tr>
                <td align="center" style="padding: 20px 30px; background-color: #f9f9f9; border-top: 1px solid #eeeeee; color: #777; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size: 12px;">
                  <p style="margin: 0;">&copy; ${currentYear} Banks Channel Advisors, LLC. All Rights Reserved.</p>
                </td>
              </tr>
            </table>
            <!--[if (gte mso 9)|(IE)]>
            </td>
            </tr>
            </table>
            <![endif]-->
          </td>
        </tr>
      </table>
    
    </body>
    </html>
  `;

  try {
    // Send the email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Website Contact <website@bankschanneladvisors.com>', // Must be a verified domain in Resend
      to: ['andrew@bankschanneladvisors.com'], // Your email address
      subject: `New Contact Form Submission from ${String(fullName)}`,
      reply_to: String(email), // Set the reply-to to the user's email
      html: htmlBody,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: 'Failed to send email.' };
    }

    // Email sent successfully
    return { success: true };
  } catch (exception) {
    console.error('Email sending exception:', exception);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

