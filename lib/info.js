// Contact Information Configuration
export const contactInfo = {
  phone: {
    display: "+1 (555) 123-4567",
    link: "tel:+15551234567", // Format for tel: links
    whatsapp: "https://wa.me/15551234567", // WhatsApp link format
  },
  email: {
    display: "[email]@gmail.com",
    link: "mailto:[email]@gmail.com",
  },
  address: {
    street: "123 Main Street",
    city: "Your City",
    state: "State",
    zip: "12345",
    full: "123 Main Street, Your City, State 12345",
  },
  social: {
    facebook: "https://facebook.com/yourpage",
    instagram: "https://instagram.com/yourpage",
    twitter: "https://twitter.com/yourpage",
  },
  businessHours: {
    weekdays: "9:00 AM - 6:00 PM",
    saturday: "10:00 AM - 4:00 PM",
    sunday: "Closed",
  },
};

// Helper functions for formatting
export const formatPhoneForDisplay = (phone) => {
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
};

export const createWhatsAppLink = (phone, message = "") => {
  const cleanPhone = phone.replace(/\D/g, "");
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}${
    message ? `?text=${encodedMessage}` : ""
  }`;
};
