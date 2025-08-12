# Privacy Policy with Integrated Contact Form

This component combines a comprehensive privacy policy with an integrated contact form specifically designed for privacy-related inquiries.

## Features

### Privacy Policy Content

- Complete privacy policy with 9 sections covering all major privacy aspects
- GDPR and CCPA compliance information
- Clear explanation of data collection, usage, and user rights
- Professional formatting with proper typography

### Integrated Contact Form

- **Privacy-focused contact form** embedded within the privacy policy
- **Advanced form validation** with real-time error handling
- **EmailJS integration** for secure email delivery
- **Loading states** with spinner animations
- **Success/error messaging** with visual feedback
- **Form reset** after successful submission
- **Responsive design** that works on all devices

### Privacy-Specific Features

- **Privacy Officer Contact** section with dedicated contact information
- **Privacy inquiry types** dropdown with options like:
  - Data Access Request
  - Data Deletion Request
  - Data Correction Request
  - Opt-out Request
  - Privacy Policy Questions
  - Other Privacy Concerns
- **Privacy rights summary** displayed prominently
- **Response time information** (Within 30 days)
- **Compliance badges** (GDPR & CCPA)

## Usage

```jsx
import PrivacyPolicy from "./components/PrivacyPolicy";

function App() {
  return (
    <div>
      <PrivacyPolicy />
    </div>
  );
}
```

## Setup Requirements

1. **Install EmailJS**:

   ```bash
   npm install @emailjs/browser
   ```

2. **Environment Variables** - Add to your `.env.local`:

   ```
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id_here
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id_here
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key_here
   ```

3. **EmailJS Setup**:
   - Create account at [emailjs.com](https://emailjs.com)
   - Set up email service (Gmail, Outlook, etc.)
   - Create email template
   - Get your service ID, template ID, and public key

## Email Template Variables

Your EmailJS template should include these variables:

- `{{user_name}}` - User's full name
- `{{user_email}}` - User's email address
- `{{phone}}` - User's phone number (optional)
- `{{subject}}` - Privacy inquiry type
- `{{message}}` - Detailed privacy inquiry

## Customization

### Contact Information

Update the placeholder contact information in the component:

- Replace `[email]` with your actual email
- Replace `[phone_number]` with your phone number
- Replace `[address]`, `[city]`, `[country]` with your address

### Privacy Policy Content

Modify the privacy policy sections to match your specific:

- Data collection practices
- Legal compliance requirements
- Company policies
- Contact information

### Styling

The component uses Tailwind CSS classes. You can customize:

- Colors by changing color classes (blue-600, green-100, etc.)
- Spacing with margin/padding classes
- Typography with font and text size classes
- Layout with grid and flexbox classes

## Form Validation

The form includes comprehensive validation:

- **Name**: Required, must not be empty
- **Email**: Required, must be valid email format
- **Message**: Required, minimum 10 characters
- **Phone**: Optional
- **Subject**: Optional but recommended for better categorization

## Security Features

- **Client-side validation** prevents invalid submissions
- **EmailJS secure transmission** of form data
- **No sensitive data storage** on frontend
- **Input sanitization** through controlled components
- **CSRF protection** through EmailJS service

## Accessibility

- **Proper form labels** for screen readers
- **Focus management** with visible focus states
- **Keyboard navigation** support
- **Error announcements** for assistive technologies
- **Semantic HTML structure**

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design for all screen sizes

This component provides a complete solution for privacy policy display and privacy-related contact functionality in a single, cohesive interface.
