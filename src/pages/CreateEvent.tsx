import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { Database } from '@/types/supabase';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Trash2, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { VolunteerRole } from '@/types/supabase';
import { createEvent } from '@/services/mongodb';

// Add Event type
type Event = Database['public']['Tables']['events']['Row'];

interface EventFormData {
  title: string;
  description: string;
  image: File | null;
  date: string;
  startTime: string;
  endTime: string;
  category: string;
  isFree: boolean;
  ticketPrice: string;
  totalSpots: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  volunteerRoles: VolunteerRole[];
}

const categories: EventCategory[] = [
  'conference',
  'workshop',
  'concert',
  'sports',   //Type '"meetup"' is not assignable to type '"concert" | "conference" | "workshop" | "sports" | "community" | "other"
  'community',
  'other'
];

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppContext();
  const [events, setEvents] = useState<Event[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  // Form state
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    image: null,
    date: '',
    startTime: '',
    endTime: '',
    category: '',
    isFree: true,
    ticketPrice: '',
    totalSpots: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    volunteerRoles: [],
  });

  const [newRole, setNewRole] = useState('');

  // Handle form field changes
  const handleInputChange = (field: keyof EventFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Fetch events from Supabase
  const fetchEvents = useCallback(async () => {
    try {
      console.log('Fetching events for user:', user?.id); // Debug user ID

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('organizer_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Fetch error details:', error);
        toast.error('Failed to fetch events');
        return;
      }

      console.log('Fetched events:', data); // Debug fetched data
      setEvents(data || []);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to fetch events');
    }
  }, [user]);

  // Redirect if not organizer
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'organizer') {
      toast.error('Only organizers can create events');
      navigate('/');
    } else {
      fetchEvents();
    }
  }, [user, navigate, fetchEvents]);

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('events-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events',
          filter: `organizer_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Real-time update:', payload);
          fetchEvents(); // Refresh events list
        }
      )
      .subscribe();

    // Clean up subscription
    return () => {
      channel.unsubscribe();
    };
  }, [user, fetchEvents]);

  // Add this useEffect for connection check
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('id')
          .limit(1);

        if (error) {
          console.error('Supabase connection error:', error);
          setIsConnected(false);
          toast.error('Database connection failed');
        } else {
          console.log('Supabase connected successfully');
          setIsConnected(true);
          toast.success('Connected to database');
        }
      } catch (error) {
        console.error('Connection check failed:', error);
        setIsConnected(false);
        toast.error('Database connection failed');
      }
    };

    checkConnection();
  }, []);

  // Add UUID generation function
  const generateUUID = (): string => {
  return crypto.randomUUID(); // Use built-in UUID generator
};

  // Volunteer role handlers
  const handleAddRole = () => {
    if (!newRole.trim()) {
      toast.error('Role name cannot be empty');
      return;
    }
    
    const role: VolunteerRole = {
      id: generateUUID(), // Use UUID instead of timestamp
      name: newRole,
      description: '',
      quantity: 1,
    };
    
    handleInputChange('volunteerRoles', [...formData.volunteerRoles, role]);
    setNewRole('');
  };

  const handleRemoveRole = (id: string) => {
    handleInputChange('volunteerRoles', formData.volunteerRoles.filter(role => role.id !== id));
  };

  const handleRoleChange = (id: string, field: keyof VolunteerRole, value: string | number) => {
    handleInputChange('volunteerRoles', 
      formData.volunteerRoles.map(role =>
        role.id === id ? { ...role, [field]: value } : role
      )
    );
  };

  // Validate form data
  const validateForm = (): boolean => {
    const { title, description, date, startTime, endTime, category, address, city, state, zip } = formData;
    
    if (!title.trim()) {
      toast.error('Event title is required');
      return false;
    }
    
    if (!description.trim()) {
      toast.error('Event description is required');
      return false;
    }
    
    if (!date) {
      toast.error('Event date is required');
      return false;
    }
    
    if (!startTime) {
      toast.error('Start time is required');
      return false;
    }
    
    if (!endTime) {
      toast.error('End time is required');
      return false;
    }
    
    if (!category) {
      toast.error('Event category is required');
      return false;
    }
    
    // Validate date is in the future
    const eventDate = new Date(`${date}T${startTime}`);
    if (eventDate < new Date()) {
      toast.error('Event date must be in the future');
      return false;
    }
    
    // Validate end time is after start time
    if (new Date(`${date}T${endTime}`) <= eventDate) {
      toast.error('End time must be after start time');
      return false;
    }
    
    // Validate paid event fields
    if (!formData.isFree) {
      if (!formData.ticketPrice || parseFloat(formData.ticketPrice) <= 0) {
        toast.error('Please provide a valid ticket price');
        return false;
      }
      
      if (!formData.totalSpots || parseInt(formData.totalSpots) <= 0) {
        toast.error('Please provide a valid number of spots');
        return false;
      }
    }
    
    // Add location validation
    if (!address.trim() || !city.trim() || !state.trim() || !zip.trim()) {
      toast.error('Please fill in all location fields');
      return false;
    }
    
    return true;
  };

  // Upload image to Supabase storage
  const uploadImage = async (file: File): Promise<string | null> => {
    if (!file) return null;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `event-images/${fileName}`;

    const { data, error } = await supabase
      .storage
      .from('event-images')
      .upload(filePath, file);

    if (error) {
      console.error('Upload error:', error);
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('event-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!validateForm()) {
        setIsSubmitting(false);
        return;
      }

      let imageUrl = null;
      if (formData.image) {
        imageUrl = await uploadImage(formData.image);
      }

      const eventData = {
        organizer_id: user?.id,
        title: formData.title,
        description: formData.description,
        image_url: imageUrl,
        date: formData.date,
        start_time: formData.startTime,
        end_time: formData.endTime,
        category: formData.category,
        is_free: formData.isFree,
        ticket_price: formData.isFree ? null : parseFloat(formData.ticketPrice),
        total_spots: formData.isFree ? null : parseInt(formData.totalSpots),
        spots_remaining: formData.isFree ? null : parseInt(formData.totalSpots),
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        volunteer_roles: formData.volunteerRoles,
        created_at: new Date().toISOString()
      };

      const result = await createEvent(eventData);
      
      if (result.error) {
        throw new Error(result.error);
      }

      toast.success('Event created successfully!');
      navigate(`/events/${result.insertedId}`);
    } catch (error: any) {
      console.error('Submission error:', error);
      toast.error(`Failed to create event: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      toast.success('Event deleted successfully!');
      fetchEvents();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete event');
    }
  };

  return (
    <AppLayout>
      {isConnected === false && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Warning!</strong>
          <span className="block sm:inline"> Database connection failed. Some features may not work.</span>
        </div>
      )}
      {isConnected === true && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Connected!</strong>
          <span className="block sm:inline"> Database connection established successfully.</span>
        </div>
      )}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Create New Event</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter event title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter event description"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Event Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleInputChange('image', e.target.files?.[0] || null)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => handleInputChange('category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat.charAt(0) + cat.slice(1).toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time *</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => handleInputChange('startTime', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time *</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => handleInputChange('endTime', e.target.value)}
                      min={formData.startTime || undefined}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Event Type</Label>
                  <RadioGroup
                    value={formData.isFree ? 'free' : 'paid'}
                    onValueChange={(value) => handleInputChange('isFree', value === 'free')}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="free" id="free" />
                      <Label htmlFor="free">Free</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paid" id="paid" />
                      <Label htmlFor="paid">Paid</Label>
                    </div>
                  </RadioGroup>
                </div>

                {!formData.isFree && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ticketPrice">Ticket Price ($)</Label>
                      <Input
                        id="ticketPrice"
                        type="number"
                        value={formData.ticketPrice}
                        onChange={(e) => handleInputChange('ticketPrice', e.target.value)}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="totalSpots">Total Spots</Label>
                      <Input
                        id="totalSpots"
                        type="number"
                        value={formData.totalSpots}
                        onChange={(e) => handleInputChange('totalSpots', e.target.value)}
                        min="1"
                        placeholder="100"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="123 Main St"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="City"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="State"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input
                      id="zip"
                      value={formData.zip}
                      onChange={(e) => handleInputChange('zip', e.target.value)}
                      placeholder="12345"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Volunteer Roles</CardTitle>
                <CardDescription>Add roles for volunteers at your event</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="Role name"
                  />
                  <Button type="button" onClick={handleAddRole}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Role
                  </Button>
                </div>

                {formData.volunteerRoles.length > 0 && (
                  <div className="space-y-4">
                    {formData.volunteerRoles.map((role) => (
                      <div key={role.id} className="flex items-center gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                          <Input
                            value={role.name}
                            onChange={(e) =>
                              handleRoleChange(role.id, 'name', e.target.value)
                            }
                            placeholder="Role name"
                          />
                          <Input
                            value={role.description}
                            onChange={(e) =>
                              handleRoleChange(role.id, 'description', e.target.value)
                            }
                            placeholder="Description"
                          />
                          <Input
                            type="number"
                            value={role.quantity}
                            onChange={(e) =>
                              handleRoleChange(role.id, 'quantity', parseInt(e.target.value) || 0)
                            }
                            min="1"
                            placeholder="Quantity"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => handleRemoveRole(role.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate('/events')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Event'}
              </Button>
            </div>
          </form>

          {/* Display created events */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Your Events</CardTitle>
            </CardHeader>
            <CardContent>
              {events.length === 0 ? (
                <p>No events yet. Create one!</p>
              ) : (
                <div className="space-y-4">
                  {events.map((event) => (
                    <Card key={event.id}>
                      <CardHeader>
                        <CardTitle>{event.title}</CardTitle>
                        <CardDescription>
                          {new Date(event.date).toLocaleDateString()} • {event.category}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="flex justify-end gap-4">
                        <Button
                          variant="outline"
                          onClick={() => navigate(`/events/${event.id}`)}
                        >
                          View
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default CreateEvent;

export interface LocalDatabase {
  public: {
    Tables: {
      events: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          description: string;
          date: string;
          category: EventCategory;
          organizer_id: string;
          address: string;
          city: string;
          state: string;
          zip: string;
          start_time: string;
          end_time: string;
          is_free: boolean;
          ticket_price: number | null;
          total_spots: number | null;
          spots_remaining: number | null;
          volunteer_roles: VolunteerRole[] | null;
          image_url: string | null;
        };
      };
    };
  };
}

// Retain the local declaration of EventCategory
export type EventCategory = 'conference' | 'workshop' | 'concert' | 'sports' | 'community' | 'other';

// Removed local declaration of VolunteerRole to resolve conflict with imported type