import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Event, Comment, VolunteerRole } from '@/types';
import { toast } from 'sonner';
import { api } from '@/services/api';

interface AppContextType {
  user: User | null;
  events: Event[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: 'organizer' | 'attendee') => Promise<void>;
  createEvent: (event: Omit<Event, 'id' | 'organizerId' | 'organizerName' | 'attendees' | 'volunteers' | 'comments'>) => Promise<void>;
  addComment: (eventId: string, content: string) => Promise<void>;
  joinEvent: (eventId: string) => Promise<void>;
  volunteerForRole: (eventId: string, roleId: string) => Promise<void>;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock Data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Organizer',
    email: 'john@example.com',
    role: 'organizer',
    avatar: 'https://ui-avatars.com/api/?name=John+Organizer&background=6d28d9&color=fff',
  },
  {
    id: '2',
    name: 'Jane Attendee',
    email: 'jane@example.com',
    role: 'attendee',
    avatar: 'https://ui-avatars.com/api/?name=Jane+Attendee&background=6d28d9&color=fff',
  },
];

const volunteerRoles: VolunteerRole[] = [
  {
    id: 'role1',
    title: 'Registration Desk',
    description: 'Help register attendees as they arrive',
    spotsTotal: 5,
    spotsFilled: 2,
  },
  {
    id: 'role2',
    title: 'Food Service',
    description: 'Help with serving food to attendees',
    spotsTotal: 10,
    spotsFilled: 4,
  },
  {
    id: 'role3',
    title: 'Clean-up Crew',
    description: 'Help clean up after the event',
    spotsTotal: 8,
    spotsFilled: 1,
  },
];

const mockComments: Comment[] = [
  {
    id: 'comment1',
    userId: '2',
    userName: 'Jane Attendee',
    userAvatar: 'https://ui-avatars.com/api/?name=Jane+Attendee&background=6d28d9&color=fff',
    content: 'Looking forward to this event!',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'comment2',
    userId: '1',
    userName: 'John Organizer',
    userAvatar: 'https://ui-avatars.com/api/?name=John+Organizer&background=6d28d9&color=fff',
    content: 'Thanks for your interest! We are excited to have you join us.',
    createdAt: new Date(Date.now() - 43200000).toISOString(),
  },
];

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Community Clean-up Drive',
    description: 'Join us for a day of cleaning up the local park. We\'ll provide gloves, trash bags, and refreshments.',
    image: 'https://images.unsplash.com/photo-1563089145-599997674d42?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '14:00',
    location: {
      address: '123 Park Ave',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
    },
    organizerId: '1',
    organizerName: 'John Organizer',
    category: 'Environmental',
    volunteerRoles: [volunteerRoles[0], volunteerRoles[2]],
    attendees: ['2'],
    volunteers: {
      'role1': ['2'],
      'role2': [],
      'role3': [],
    },
    comments: mockComments,
    isFree: true,
  },
  {
    id: '2',
    title: 'Tech Meetup: Web Development Trends 2025',
    description: 'A gathering of web developers to discuss the latest trends and technologies in web development.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    date: new Date(Date.now() + 604800000).toISOString().split('T')[0],
    startTime: '18:00',
    endTime: '20:00',
    location: {
      address: '456 Tech Blvd',
      city: 'Tech City',
      state: 'CA',
      zip: '67890',
    },
    organizerId: '1',
    organizerName: 'John Organizer',
    category: 'Technology',
    volunteerRoles: [volunteerRoles[1]],
    attendees: [],
    volunteers: {
      'role1': [],
      'role2': [],
      'role3': [],
    },
    comments: [],
    isFree: false,
    ticketPrice: 10,
    totalSpots: 50,
    spotsRemaining: 35,
  },
  {
    id: '3',
    title: 'Charity Gala Dinner',
    description: 'An elegant evening of dining and fundraising for local children\'s hospital.',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2369&q=80',
    date: new Date(Date.now() + 1209600000).toISOString().split('T')[0],
    startTime: '19:00',
    endTime: '23:00',
    location: {
      address: '789 Charity Lane',
      city: 'Generous',
      state: 'CA',
      zip: '54321',
    },
    organizerId: '1',
    organizerName: 'John Organizer',
    category: 'Charity',
    volunteerRoles: [volunteerRoles[0], volunteerRoles[1], volunteerRoles[2]],
    attendees: ['2'],
    volunteers: {
      'role1': [],
      'role2': ['2'],
      'role3': [],
    },
    comments: [],
    isFree: false,
    ticketPrice: 100,
    totalSpots: 200,
    spotsRemaining: 150,
  },
  {
    id: '4',
    title: 'Cultural Festival',
    description: 'A celebration of diverse cultures with food, music, dance, and art.',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    date: new Date(Date.now() + 2592000000).toISOString().split('T')[0],
    startTime: '12:00',
    endTime: '20:00',
    location: {
      address: '101 Culture St',
      city: 'Diversity',
      state: 'CA',
      zip: '13579',
    },
    organizerId: '1',
    organizerName: 'John Organizer',
    category: 'Cultural',
    volunteerRoles: volunteerRoles,
    attendees: [],
    volunteers: {
      'role1': [],
      'role2': [],
      'role3': [],
    },
    comments: [],
    isFree: true,
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [loading, setLoading] = useState(false);

  // Check for saved user in localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('community-hub-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { token, user } = await api.auth.login(email, password);
      setUser(user);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      toast.success('Logged in successfully');
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('community-hub-user');
    toast.success('Logged out successfully');
  };

  const register = async (name: string, email: string, password: string, role: 'organizer' | 'attendee') => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (mockUsers.find(u => u.email === email)) {
        throw new Error('Email already exists');
      }
      
      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        role,
        avatar: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=6d28d9&color=fff`,
      };
      
      mockUsers.push(newUser);
      setUser(newUser);
      localStorage.setItem('community-hub-user', JSON.stringify(newUser));
      toast.success('Registered successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: Omit<Event, 'id' | 'organizerId' | 'organizerName' | 'attendees' | 'volunteers' | 'comments'>) => {
    setLoading(true);
    try {
      if (!user) throw new Error('You must be logged in to create an event');
      if (user.role !== 'organizer') throw new Error('Only organizers can create events');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newEvent: Event = {
        ...eventData,
        id: `event-${Date.now()}`,
        organizerId: user.id,
        organizerName: user.name,
        attendees: [],
        volunteers: eventData.volunteerRoles.reduce((acc, role) => {
          acc[role.id] = [];
          return acc;
        }, {} as Record<string, string[]>),
        comments: [],
      };
      
      setEvents(prev => [...prev, newEvent]);
      toast.success('Event created successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create event');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (eventId: string, content: string) => {
    setLoading(true);
    try {
      if (!user) throw new Error('You must be logged in to comment');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        content,
        createdAt: new Date().toISOString(),
      };
      
      setEvents(prev => 
        prev.map(event => 
          event.id === eventId 
            ? { ...event, comments: [...event.comments, newComment] } 
            : event
        )
      );
      
      toast.success('Comment added');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add comment');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const joinEvent = async (eventId: string) => {
    setLoading(true);
    try {
      if (!user) throw new Error('You must be logged in to join an event');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEvents(prev => 
        prev.map(event => {
          if (event.id === eventId) {
            if (event.attendees.includes(user.id)) {
              throw new Error('You are already attending this event');
            }
            
            if (!event.isFree && event.spotsRemaining && event.spotsRemaining <= 0) {
              throw new Error('This event is sold out');
            }
            
            return { 
              ...event, 
              attendees: [...event.attendees, user.id],
              spotsRemaining: event.spotsRemaining ? event.spotsRemaining - 1 : undefined 
            };
          }
          return event;
        })
      );
      
      toast.success('Successfully joined the event');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to join event');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const volunteerForRole = async (eventId: string, roleId: string) => {
    setLoading(true);
    try {
      if (!user) throw new Error('You must be logged in to volunteer');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEvents(prev => 
        prev.map(event => {
          if (event.id === eventId) {
            // Check if user already volunteered for this role
            if (event.volunteers[roleId]?.includes(user.id)) {
              throw new Error('You are already volunteering for this role');
            }
            
            // Find the role
            const role = event.volunteerRoles.find(r => r.id === roleId);
            if (!role) {
              throw new Error('Role not found');
            }
            
            // Check if there are spots available
            if (role.spotsFilled >= role.spotsTotal) {
              throw new Error('No volunteer spots available for this role');
            }
            
            // Update the role's spots filled
            const updatedRoles = event.volunteerRoles.map(r => 
              r.id === roleId ? { ...r, spotsFilled: r.spotsFilled + 1 } : r
            );
            
            // Add user to volunteers for this role
            const updatedVolunteers = { 
              ...event.volunteers, 
              [roleId]: [...(event.volunteers[roleId] || []), user.id] 
            };
            
            return { 
              ...event, 
              volunteerRoles: updatedRoles,
              volunteers: updatedVolunteers
            };
          }
          return event;
        })
      );
      
      toast.success('Successfully volunteered for the role');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to volunteer for role');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      events,
      login,
      logout,
      register,
      createEvent,
      addComment,
      joinEvent,
      volunteerForRole,
      loading
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
