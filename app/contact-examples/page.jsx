"use client";

import ContactInfo, { PhoneNumber, EmailAddress, WhatsAppButton } from "../../components/ContactInfo";
import { contactInfo } from '@/lib/info';

export default function ContactExamples() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-12">Contact Info Usage Examples</h1>

                {/* Example 1: Full Contact Info Component */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">1. Full Contact Info Component</h2>
                    <ContactInfo
                        showPhone={true}
                        showEmail={true}
                        showAddress={true}
                        showHours={true}
                        className="space-y-3"
                    />
                </div>

                {/* Example 2: Individual Components */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">2. Individual Components</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-medium mb-2">Phone Number Component:</h3>
                            <PhoneNumber className="text-blue-600" />
                        </div>

                        <div>
                            <h3 className="font-medium mb-2">Email Component:</h3>
                            <EmailAddress className="text-green-600" />
                        </div>

                        <div>
                            <h3 className="font-medium mb-2">WhatsApp Button:</h3>
                            <WhatsAppButton message="Hello! I'm interested in your products." />
                        </div>
                    </div>
                </div>

                {/* Example 3: Using Raw Data */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">3. Using Raw Contact Data</h2>
                    <div className="space-y-2">
                        <p><strong>Phone:</strong> {contactInfo.phone.display}</p>
                        <p><strong>Email:</strong> {contactInfo.email.display}</p>
                        <p><strong>Address:</strong> {contactInfo.address.full}</p>
                        <p><strong>Business Hours:</strong> {contactInfo.businessHours.weekdays}</p>
                    </div>
                </div>

                {/* Example 4: Footer Style */}
                <div className="bg-gray-800 text-white rounded-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">4. Footer Style Contact</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <h3 className="font-semibold mb-2">Contact Us</h3>
                            <ContactInfo
                                showPhone={true}
                                showEmail={true}
                                className="text-gray-300"
                            />
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Visit Us</h3>
                            <p className="text-gray-300">{contactInfo.address.full}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Business Hours</h3>
                            <div className="text-gray-300 text-sm">
                                <p>Mon-Fri: {contactInfo.businessHours.weekdays}</p>
                                <p>Saturday: {contactInfo.businessHours.saturday}</p>
                                <p>Sunday: {contactInfo.businessHours.sunday}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Example 5: Inline Usage */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">5. Inline Usage in Text</h2>
                    <p className="text-gray-700 leading-relaxed">
                        Need help? You can reach us at <PhoneNumber className="text-blue-600 font-medium" />
                        or send us an email at <EmailAddress className="text-blue-600 font-medium" />.
                        Our customer service team is available {contactInfo.businessHours.weekdays.toLowerCase()}.
                    </p>
                    <div className="mt-4">
                        <WhatsAppButton message="I need help with my order" />
                    </div>
                </div>
            </div>
        </div>
    );
}