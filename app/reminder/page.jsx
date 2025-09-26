"use client";

import React, { useState, useEffect } from "react";

import API_URL from "../api/api"; 


export default function Reminder() {

  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const getReminders = async () => {
   
    try {
      const response = await fetch(`${API_URL}/notification`);
      
 
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
   
      if (data.success && Array.isArray(data.data)) {
        setReminders(data.data);
      } else {
     
        console.warn("API response was successful but data format was unexpected.");
        setReminders([]); 
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
     
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReminders();
   
  }, []); 



  const renderLoading = () => (
    <div className="flex justify-center items-center h-48">
     
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500 mr-3"></div>
      <p className="text-lg text-indigo-600 font-medium">Loading your latest notifications...</p>
    </div>
  );

  const renderNoNotifications = () => (
    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
      <h3 className="mt-2 text-xl font-medium text-gray-900">No new notifications</h3>
      <p className="mt-1 text-sm text-gray-500">
        We'll let you know when updates or reminders come in.
      </p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-5">
    
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Notification Center
        </h1>
       
        <button className="text-indigo-600 hover:text-indigo-800 font-medium transition duration-150 ease-in-out text-sm">
          Mark all as read
        </button>
      </div>
  
      {loading 
        ? renderLoading() 
        : reminders.length === 0 
          ? renderNoNotifications() 
          : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {reminders.map((reminder) => (
                <div
                  key={reminder._id}
                  className="bg-white shadow-xl rounded-2xl overflow-hidden 
                             hover:shadow-indigo-300/50 hover:scale-[1.02] 
                             transition-all duration-300 ease-in-out border border-gray-100 cursor-pointer"
                >
               
                  {reminder.imageUrl && (
                    <div className="relative">
                      <img
                        src={reminder.imageUrl}
                        alt={reminder.title || 'Notification image'}
                        className="w-full h-48 object-cover object-center"
                      />
                     
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                    </div>
                  )}

                 
                  <div className="p-5 flex flex-col justify-between h-full">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 mb-1 leading-snug">
                        {reminder.title}
                      </h2>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                        {reminder.description}
                      </p>
                    </div>
                    

                    <div className="pt-3 border-t border-gray-100 mt-auto">
                      <p className="text-xs font-mono text-indigo-400">
                     
                        {new Date(reminder.createdAt).toLocaleDateString("en-US", {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
    </div>
  );
}
