# EmailJS Setup Guide

## 1. Create EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## 2. Create Email Service

1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your provider
5. Note down your **Service ID**

## 3. Create Email Template

1. Go to "Email Templates" in your dashboard
2. Click "Create New Template"
3. Use this template structure:

```
Subject: New Contact Form Submission - {{subject}}

From: {{user_name}} <{{user_email}}>
Subject: {{subject}}

Message:
{{message}}

---
This message was sent from your website contact form.
```

4. Note down your **Template ID**

## 4. Get Public Key

1. Go to "Account" > "General"
2. Find your **Public Key** (User ID)

## 5. Update Customer Service Page

Replace the placeholders in `/app/customer-service/page.jsx`:

```javascript
await emailjs.sendForm(
  "YOUR_SERVICE_ID", // Replace with your Service ID
  "YOUR_TEMPLATE_ID", // Replace with your Template ID
  form.current,
  {
    publicKey: "YOUR_PUBLIC_KEY", // Replace with your Public Key
  }
);
```

## 6. Test the Form

1. Fill out the contact form on your website
2. Check your email for the message
3. Verify all fields are being sent correctly

## Example Configuration

```javascript
await emailjs.sendForm("service_abc123", "template_xyz789", form.current, {
  publicKey: "user_def456",
});
```

## Troubleshooting

- Make sure your email service is properly configured
- Check that your template variables match the form field names
- Verify your public key is correct
- Check the browser console for any error messages
