# Contact Information System

This project uses a centralized contact information system to manage phone numbers, email addresses, and other contact details across the entire application.

## Files Structure

```
lib/info.js              # Central contact information configuration
components/ContactInfo.js # Reusable contact components
```

## Quick Start

### 1. Update Your Contact Information

Edit `lib/info.js` to update your actual contact details:

```javascript
export const contactInfo = {
  phone: {
    display: "+1 (555) 123-4567", // Replace with your phone
    link: "tel:+15551234567",
    whatsapp: "https://wa.me/15551234567",
  },
  email: {
    display: "your-email@gmail.com", // Replace with your email
    link: "mailto:your-email@gmail.com",
  },
  // ... update other fields
};
```

### 2. Using Contact Components

#### Full Contact Info Component

```jsx
import ContactInfo from "@/components/ContactInfo";

<ContactInfo
  showPhone={true}
  showEmail={true}
  showAddress={true}
  showHours={true}
/>;
```

#### Individual Components

```jsx
import { PhoneNumber, EmailAddress, WhatsAppButton } from "@/components/ContactInfo";

<PhoneNumber className="text-blue-600" />
<EmailAddress className="text-green-600" />
<WhatsAppButton message="Hello! I need help." />
```

#### Using Raw Data

```jsx
import { contactInfo } from '@/lib/info';

<p>Call us at: {contactInfo.phone.display}</p>
<p>Email: {contactInfo.email.display}</p>
```

## Component Props

### ContactInfo Component

- `showPhone` (boolean): Show phone number
- `showEmail` (boolean): Show email address
- `showAddress` (boolean): Show physical address
- `showHours` (boolean): Show business hours
- `className` (string): Additional CSS classes

### WhatsAppButton Component

- `message` (string): Pre-filled message for WhatsApp
- `className` (string): Additional CSS classes

## Examples

Check `/contact-examples` page to see all usage examples in action.

## Where It's Used

- Footer component (`components/Footer.jsx`)
- Customer Service page (`app/customer-service/page.jsx`)
- Any page that imports the components

## Benefits

1. **Centralized Management**: Update contact info in one place
2. **Consistency**: Same formatting across the entire app
3. **Reusable Components**: Easy to add contact info anywhere
4. **Clickable Links**: Automatic tel: and mailto: links
5. **WhatsApp Integration**: Direct WhatsApp messaging
6. **Responsive Design**: Works on all screen sizes
