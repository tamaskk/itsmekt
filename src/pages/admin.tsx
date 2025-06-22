import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ref, uploadBytesResumable, deleteObject } from 'firebase/storage';
import { storage } from '@/db/firebase';
import { getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Image from 'next/image';

interface Event {
  _id: string;
  name: string;
  address: string;
  date: string;
  startTime: string;
  endTime: string;
  concept: string;
  image: File | string;
  type: string;
}

interface SystemSettings {
  soundcloudLinks: Array<{ title: string; url: string }>;
  youtubeLink: string;
  siteTitle: string;
  contactEmail: string;
  maintenanceMode: boolean;
  theme: string;
  primaryColor: string;
}

const AdminPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('events');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    address: '',
    date: '',
    startTime: '',
    endTime: '',
    concept: '',
    type: 'music',
    image: '' as File | string
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState<string | null>(null);

  // System settings state
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    soundcloudLinks: [{ title: '', url: '' }, { title: '', url: '' }, { title: '', url: '' }],
    youtubeLink: '',
    siteTitle: 'My Event Site',
    contactEmail: 'admin@example.com',
    maintenanceMode: false,
    theme: 'Light',
    primaryColor: '#3B82F6'
  });
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const [messages, setMessages] = useState<Array<{
    _id: string;
    name: string;
    email: string;
    message: string;
    status: 'new' | 'read';
    createdAt: string;
    updatedAt: string;
  }>>([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [messagesError, setMessagesError] = useState<string | null>(null);

  const eventTypes = [
    { value: 'niceText', label: 'Nice text' },
    { value: 'jazz', label: 'Running text' }
  ];

  const tabs = [
    { id: 'events', label: 'Events', icon: '📅' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'messages', label: 'Contact Messages', icon: '💬' }
  ];

  const fetchEverything = useCallback(async () => {
    await fetchEvents();
    await fetchSystemSettings();
    await fetchMessages();
  }, []);

  // Fetch events from API on component mount
  useEffect(() => {
    if (session) {
      fetchEverything();
    }
  }, [session, fetchEverything]);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return; // Still loading
    if (!session) {
      router.push('/login');
    }
  }, [session, status, router]);

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!session) {
    return null;
  }

  const fetchMessages = async () => {
    try {
      setMessagesLoading(true);
      setMessagesError(null);
      
      const response = await fetch('/api/all-messages');
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
      } else {
        setMessagesError('Failed to fetch messages');
      }
    } catch (error) {
      setMessagesError('Error fetching messages');
      console.error('Error fetching messages:', error);
    } finally {
      setMessagesLoading(false);
    }
  };

  const fetchSystemSettings = async () => {
    try {
      setSettingsLoading(true);
      setSettingsError(null);

      const response = await fetch('/api/get-system-settings');
      if (response.ok) {
        const data = await response.json();
        setSystemSettings(data.settings);
      } else {
        setSettingsError('Failed to fetch system settings');
      }
    } catch (error) {
      setMessagesError('Error fetching messages');
      console.error('Error fetching messages:', error);
    } finally {
      setSettingsLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      setEventsLoading(true);
      setEventsError(null);

      const response = await fetch('/api/get-events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events);
      } else {
        setEventsError('Failed to fetch events');
      }
      
    } catch (error) {
      setEventsError('Error fetching events');
      console.error('Error fetching events:', error);
    } finally {
      setEventsLoading(false);
    }
  }

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setEditFormData({
      name: event.name,
      address: event.address,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      concept: event.concept,
      image: event.image || '',
      type: event.type
    });
    // Set preview for existing image if it's a string URL
    if (typeof event.image === 'string' && event.image) {
      setImagePreview(event.image);
    } else {
      setImagePreview('');
    }
    setIsEditModalOpen(true);
  };

  const handleNewEvent = () => {
    setEditFormData({
      name: '',
      address: '',
      date: '',
      startTime: '',
      endTime: '',
      concept: '',
      image: '',
      type: 'music'
    });
    setImagePreview('');
    setIsNewEventModalOpen(true);
  };

  const handleSaveEvent = async () => {
    if (editingEvent) {
      // Update existing event
      const updatedEventData = { ...editFormData, _id: editingEvent._id };
      
      // If there's a new image file, delete the old one and upload the new one
      if (editFormData.image instanceof File) {
        // Delete old image from Firebase if it exists
        if (typeof editingEvent.image === 'string' && editingEvent.image) {
          await deleteImageFromFirebase(editingEvent.image);
        }
        
        // Upload new image to Firebase
        const storageRef = ref(storage, `events/${editFormData.name}_${Date.now()}.jpg`);
        const uploadTask = uploadBytesResumable(storageRef, editFormData.image);
        
        await new Promise((resolve, reject) => {
          uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
          }, (error) => {
            console.error('Error uploading image: ', error);
            reject(error);
          }, async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            updatedEventData.image = downloadURL;
            resolve(downloadURL);
          });
        });
      }

      // Update event in database
      const response = await fetch("/api/update-event", {
        method: "PUT",
        body: JSON.stringify(updatedEventData),
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Failed to update event");
      }

      setEvents(events.map(event => 
        event._id === editingEvent._id 
          ? updatedEventData
          : event
      ));
      setIsEditModalOpen(false);
      setEditingEvent(null);
    } else {
      // Create new event
      // First upload image to firebase storage if it's a File
      let imageUrl = '';
      if (editFormData.image instanceof File) {
          const storageRef = ref(storage, `events/${editFormData.name}_${Date.now()}.jpg`);
          const uploadTask = uploadBytesResumable(storageRef, editFormData.image);
          
          // Wait for upload to complete
          await new Promise((resolve, reject) => {
              uploadTask.on('state_changed', (snapshot) => {
                  const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  console.log('Upload is ' + progress + '% done');
              }, (error) => {
                  console.error('Error uploading image: ', error);
                  reject(error);
              }, async () => {
                  imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
                  resolve(imageUrl);
              });
          });
      }

      // Create event data with the uploaded image URL
      const eventData = {
          ...editFormData,
          image: imageUrl || editFormData.image
      };

      // Then add event to database
      const response = await fetch("/api/add-event", {
          method: "POST",
          body: JSON.stringify(eventData),
          headers: {
              "Content-Type": "application/json"
          }
      });

      if (!response.ok) {
          throw new Error("Failed to add event");
      }

      const data = await response.json();

      setEvents([...events, {
          _id: data.event,
          ...eventData
      }]);

      setIsNewEventModalOpen(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await fetch("/api/delete-event", {
          method: "DELETE",
          body: JSON.stringify({ _id: eventId }),
          headers: {
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Failed to delete event");
        }

        const data = await response.json();
        console.log(data.message);

        // Remove event from local state
        setEvents(events.filter(event => event._id !== eventId));
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event. Please try again.');
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setIsNewEventModalOpen(false);
    setEditingEvent(null);
    // Clean up preview URL to prevent memory leaks
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview('');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditFormData({ ...editFormData, image: file });
      // Create preview URL for the uploaded file
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const deleteImageFromFirebase = async (imageUrl: string) => {
    try {
      // Extract the path from the Firebase URL
      const url = new URL(imageUrl);
      const path = decodeURIComponent(url.pathname.split('/o/')[1]?.split('?')[0] || '');
      
      if (path) {
        const imageRef = ref(storage, path);
        await deleteObject(imageRef);
        console.log('Image deleted from Firebase');
      }
    } catch (error) {
      console.error('Error deleting image from Firebase:', error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        const response = await fetch('/api/delete-message', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ messageId }),
        });

        if (response.ok) {
          // Remove message from local state
          setMessages(messages.filter(message => message._id !== messageId));
          console.log('Message deleted successfully');
        } else {
          const errorData = await response.json();
          alert(`Failed to delete message: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Error deleting message:', error);
        alert('Failed to delete message. Please try again.');
      }
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      const response = await fetch('/api/update-message-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageId, status: 'read' }),
      });

      if (response.ok) {
        // Update message status in local state
        setMessages(messages.map(message => 
          message._id === messageId 
            ? { ...message, status: 'read' }
            : message
        ));
        console.log('Message marked as read');
      } else {
        const errorData = await response.json();
        alert(`Failed to update message: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error updating message status:', error);
      alert('Failed to update message status. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const handleSaveSettings = async () => {
    try {
      setIsSavingSettings(true);
      
      const response = await fetch('/api/update-system-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(systemSettings),
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      console.log('Settings saved successfully');
      
      // Show success message (you could add a toast notification here)
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleSoundcloudLinkChange = (index: number, value: string) => {
    const currentLinks = systemSettings.soundcloudLinks || [{ title: '', url: '' }, { title: '', url: '' }, { title: '', url: '' }];
    const newLinks = [...currentLinks];
    newLinks[index] = { ...newLinks[index], url: value };
    setSystemSettings({ ...systemSettings, soundcloudLinks: newLinks });
  };

  const handleSoundcloudTitleChange = (index: number, value: string) => {
    const currentLinks = systemSettings.soundcloudLinks || [{ title: '', url: '' }, { title: '', url: '' }, { title: '', url: '' }];
    const newLinks = [...currentLinks];
    newLinks[index] = { ...newLinks[index], title: value };
    setSystemSettings({ ...systemSettings, soundcloudLinks: newLinks });
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'events':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-800">Events Management</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-black">Upcoming Events</h3>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors" onClick={handleNewEvent}>
                  Add New Event
                </button>
              </div>
              <div className="space-y-4">
                {eventsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-gray-600 mt-2">Loading events...</p>
                  </div>
                ) : eventsError ? (
                  <div className="text-center py-8">
                    <p className="text-red-600">{eventsError}</p>
                    <button 
                      onClick={() => window.location.reload()} 
                      className="mt-2 text-blue-500 hover:text-blue-700"
                    >
                      Try again
                    </button>
                  </div>
                ) : events.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No events found. Create your first event!</p>
                  </div>
                ) : (
                  events.map((event) => (
                    <div key={event._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-800">{event.name}</h4>
                          <p className="text-gray-600">{event.date} • {event.startTime} - {event.endTime}</p>
                          <p className="text-gray-500">{event.address}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleEditEvent(event)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteEvent(event._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        );

      case 'settings':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-black">Settings</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              {settingsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading settings...</p>
                </div>
              ) : settingsError ? (
                <div className="text-center py-8">
                  <p className="text-red-600">{settingsError}</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="mt-2 text-blue-500 hover:text-blue-700"
                  >
                    Try again
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-black">Music Links</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">SoundCloud Links</label>
                        <div className="space-y-3">
                          {(systemSettings.soundcloudLinks || [{ title: '', url: '' }, { title: '', url: '' }, { title: '', url: '' }]).map((link, index) => (
                            <div key={index} className="space-y-2">
                              <div className="flex items-center space-x-3">
                                <span className="text-sm text-gray-500 w-8">#{index + 1}</span>
                                <input
                                  type="text"
                                  value={link.title || ''}
                                  onChange={(e) => handleSoundcloudTitleChange(index, e.target.value)}
                                  placeholder="Track title..."
                                  className="flex-1 border rounded-lg px-3 py-2 text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>
                              <div className="flex items-center space-x-3">
                                <span className="text-sm text-gray-500 w-8"></span>
                                <input
                                  type="url"
                                  value={link.url || ''}
                                  onChange={(e) => handleSoundcloudLinkChange(index, e.target.value)}
                                  placeholder="https://soundcloud.com/..."
                                  className="flex-1 border rounded-lg px-3 py-2 text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">YouTube Link</label>
                        <input
                          type="url"
                          value={systemSettings.youtubeLink || ''}
                          onChange={(e) => setSystemSettings({ ...systemSettings, youtubeLink: e.target.value })}
                          placeholder="https://youtube.com/..."
                          className="w-full border rounded-lg px-3 py-2 text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-black">General Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-gray-700">Site Title</label>
                        <input 
                          type="text" 
                          value={systemSettings.siteTitle || ''}
                          onChange={(e) => setSystemSettings({ ...systemSettings, siteTitle: e.target.value })}
                          className="border rounded-lg px-3 py-2 w-64 text-black"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-gray-700">Contact Email</label>
                        <input 
                          type="email" 
                          value={systemSettings.contactEmail || ''}
                          onChange={(e) => setSystemSettings({ ...systemSettings, contactEmail: e.target.value })}
                          className="border rounded-lg px-3 py-2 w-64 text-black"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-gray-700">Maintenance Mode</label>
                        <input 
                          type="checkbox" 
                          checked={systemSettings.maintenanceMode || false}
                          onChange={(e) => setSystemSettings({ ...systemSettings, maintenanceMode: e.target.checked })}
                          className="w-4 h-4 text-blue-600"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Appearance</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-gray-700">Theme</label>
                        <select 
                          value={systemSettings.theme || 'Light'}
                          onChange={(e) => setSystemSettings({ ...systemSettings, theme: e.target.value })}
                          className="border rounded-lg px-3 py-2 w-64 text-black"
                        >
                          <option>Light</option>
                          <option>Dark</option>
                          <option>Auto</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-gray-700">Primary Color</label>
                        <input 
                          type="color" 
                          value={systemSettings.primaryColor || '#3B82F6'}
                          onChange={(e) => setSystemSettings({ ...systemSettings, primaryColor: e.target.value })}
                          className="w-16 h-10 border rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="pt-4">
                    <button 
                      onClick={handleSaveSettings}
                      disabled={isSavingSettings}
                      className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      {isSavingSettings && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      )}
                      <span>{isSavingSettings ? 'Saving...' : 'Save Settings'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );

      case 'messages':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-black">Contact Messages</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="space-y-4">
                {messagesLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-gray-600 mt-2">Loading messages...</p>
                  </div>
                ) : messagesError ? (
                  <div className="text-center py-8">
                    <p className="text-red-600">{messagesError}</p>
                    <button 
                      onClick={() => window.location.reload()} 
                      className="mt-2 text-blue-500 hover:text-blue-700"
                    >
                      Try again
                    </button>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No messages found. Create your first message!</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div key={message._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-800">{message.name}</h4>
                          <p className="text-sm text-gray-500">{message.email}</p>
                          <p className="text-xs text-gray-400">{formatDate(message.createdAt)}</p>
                        </div>
                        <span className={`bg-${message.status === 'new' ? 'blue' : 'gray'}-100 text-${message.status === 'new' ? 'blue' : 'gray'}-800 text-xs px-2 py-1 rounded-full`}>
                          {message.status === 'new' ? 'New' : 'Read'}
                        </span>
                      </div>
                      <p className="text-gray-700">{message.message}</p>
                      <div className="flex space-x-2 mt-3">
                        <button className="text-blue-500 hover:text-blue-700 text-sm">Reply</button>
                        {message.status === 'new' && (
                          <button 
                            onClick={() => handleMarkAsRead(message._id)}
                            className="text-green-500 hover:text-green-700 text-sm"
                          >
                            Mark as Read
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteMessage(message._id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {session.user?.email}</span>
              <button 
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </div>

      {/* Edit Event Modal */}
      <AnimatePresence>
        {(isEditModalOpen || isNewEventModalOpen) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleCancelEdit}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingEvent ? 'Edit Event' : 'Create New Event'}
                </h3>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSaveEvent(); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name of the place
                  </label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full border text-black placeholder:text-gray-700 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={editFormData.address}
                    onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                    className="w-full border text-black placeholder:text-gray-700 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={editFormData.date}
                    onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                    className="w-full border text-black placeholder:text-gray-700 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={editFormData.startTime}
                    onChange={(e) => setEditFormData({ ...editFormData, startTime: e.target.value })}
                    className="w-full border text-black placeholder:text-gray-700 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={editFormData.endTime}
                    onChange={(e) => setEditFormData({ ...editFormData, endTime: e.target.value })}
                    className="w-full border text-black placeholder:text-gray-700 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Concept
                  </label>
                  <textarea
                    value={editFormData.concept}
                    onChange={(e) => setEditFormData({ ...editFormData, concept: e.target.value })}
                    placeholder="Describe the event concept..."
                    rows={3}
                    className="w-full border text-black placeholder:text-gray-700 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Type
                  </label>
                  <select
                    value={editFormData.type}
                    onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
                    className="w-full border text-black placeholder:text-gray-700 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {eventTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {imagePreview && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image Preview
                    </label>
                    <Image
                      src={typeof imagePreview === 'string' ? imagePreview : URL.createObjectURL(imagePreview as File)}
                      alt="Event preview"
                      width={300}
                      height={150}
                      className="w-full h-32 object-cover rounded-lg border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  // If user is not logged in, redirect to login
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  // Check if user has admin role
  if ((session.user as any)?.role !== 'admin') {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};