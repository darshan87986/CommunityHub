
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, User, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const MyEvents: React.FC = () => {
  const navigate = useNavigate();
  const { user, events } = useAppContext();
  
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date');
  
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  if (!user) {
    return null;
  }
  
  // Filter events the user is attending
  const attendingEvents = events.filter(event => event.attendees.includes(user.id));
  
  // Filter events the user is volunteering for
  const volunteeringEvents = events.filter(event => {
    return Object.values(event.volunteers).some(volunteers => volunteers.includes(user.id));
  });
  
  // Filter events the user is organizing (if they are an organizer)
  const organizingEvents = user.role === 'organizer'
    ? events.filter(event => event.organizerId === user.id)
    : [];
  
  // Filter and sort events based on search and sort criteria
  const filterAndSortEvents = (eventsList: typeof events) => {
    let filtered = eventsList;
    
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.location.city.toLowerCase().includes(searchLower)
      );
    }
    
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });
  };
  
  const filteredAttendingEvents = filterAndSortEvents(attendingEvents);
  const filteredVolunteeringEvents = filterAndSortEvents(volunteeringEvents);
  const filteredOrganizingEvents = filterAndSortEvents(organizingEvents);
  
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Events</h1>
            <p className="text-gray-600">
              Manage your events and volunteer activities
            </p>
          </div>
          
          {user.role === 'organizer' && (
            <Button 
              className="flex items-center"
              onClick={() => navigate('/create-event')}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          )}
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                <div className="relative w-full md:w-64">
                  <Input
                    placeholder="Search events..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                
                <div className="w-full md:w-48">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date (Nearest)</SelectItem>
                      <SelectItem value="title">Title (A-Z)</SelectItem>
                      <SelectItem value="category">Category (A-Z)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue={user.role === 'organizer' ? 'organizing' : 'attending'}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="attending">
                Attending ({filteredAttendingEvents.length})
              </TabsTrigger>
              <TabsTrigger value="volunteering">
                Volunteering ({filteredVolunteeringEvents.length})
              </TabsTrigger>
              {user.role === 'organizer' && (
                <TabsTrigger value="organizing">
                  Organizing ({filteredOrganizingEvents.length})
                </TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="attending" className="space-y-4">
              {filteredAttendingEvents.length > 0 ? (
                filteredAttendingEvents.map(event => (
                  <Card key={event.id} className="overflow-hidden">
                    <div className="sm:flex">
                      <div className="sm:w-40 h-40 sm:h-auto overflow-hidden bg-gray-100">
                        <img 
                          src={event.image || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'} 
                          alt={event.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-5 flex-1">
                        <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center mb-1">
                              <Badge className="mr-2">{event.category}</Badge>
                              {event.isFree ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  Free
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                  ${event.ticketPrice}
                                </Badge>
                              )}
                            </div>
                            <h3 className="text-xl font-semibold">{event.title}</h3>
                          </div>
                          <div className="mt-2 sm:mt-0">
                            <Badge variant="outline" className="bg-primary/10 text-primary">
                              Attending
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>
                              {new Date(event.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span>{`${event.location.city}, ${event.location.state}`}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            onClick={() => navigate(`/events/${event.id}`)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">You're not attending any events</h3>
                  <p className="text-gray-500 mb-6">Browse events and find something you're interested in!</p>
                  <Button onClick={() => navigate('/events')}>
                    Browse Events
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="volunteering" className="space-y-4">
              {filteredVolunteeringEvents.length > 0 ? (
                filteredVolunteeringEvents.map(event => {
                  // Find which roles the user is volunteering for
                  const volunteeringRoles = Object.entries(event.volunteers)
                    .filter(([_, volunteers]) => volunteers.includes(user.id))
                    .map(([roleId]) => event.volunteerRoles.find(role => role.id === roleId)?.title)
                    .filter(Boolean);
                  
                  return (
                    <Card key={event.id} className="overflow-hidden">
                      <div className="sm:flex">
                        <div className="sm:w-40 h-40 sm:h-auto overflow-hidden bg-gray-100">
                          <img 
                            src={event.image || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'} 
                            alt={event.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-5 flex-1">
                          <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
                            <div>
                              <div className="flex items-center mb-1">
                                <Badge className="mr-2">{event.category}</Badge>
                              </div>
                              <h3 className="text-xl font-semibold">{event.title}</h3>
                            </div>
                            <div className="mt-2 sm:mt-0">
                              <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                                Volunteering
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="space-y-2 mb-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span>
                                {new Date(event.date).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  month: 'long',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              <span>{`${event.location.city}, ${event.location.state}`}</span>
                            </div>
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2" />
                              <span>Role: {volunteeringRoles.join(', ')}</span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              variant="secondary"
                              onClick={() => navigate(`/events/${event.id}`)}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">You're not volunteering for any events</h3>
                  <p className="text-gray-500 mb-6">Find events that need volunteers and make a difference!</p>
                  <Button onClick={() => navigate('/events')}>
                    Find Volunteer Opportunities
                  </Button>
                </div>
              )}
            </TabsContent>
            
            {user.role === 'organizer' && (
              <TabsContent value="organizing" className="space-y-4">
                {filteredOrganizingEvents.length > 0 ? (
                  filteredOrganizingEvents.map(event => {
                    // Calculate volunteer stats
                    const totalVolunteerRoles = event.volunteerRoles.length;
                    const totalVolunteerSpots = event.volunteerRoles.reduce((acc, role) => acc + role.spotsTotal, 0);
                    const filledVolunteerSpots = event.volunteerRoles.reduce((acc, role) => acc + role.spotsFilled, 0);
                    
                    return (
                      <Card key={event.id} className="overflow-hidden">
                        <div className="sm:flex">
                          <div className="sm:w-40 h-40 sm:h-auto overflow-hidden bg-gray-100">
                            <img 
                              src={event.image || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'} 
                              alt={event.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-5 flex-1">
                            <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
                              <div>
                                <div className="flex items-center mb-1">
                                  <Badge className="mr-2">{event.category}</Badge>
                                  {event.isFree ? (
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                      Free
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                      ${event.ticketPrice}
                                    </Badge>
                                  )}
                                </div>
                                <h3 className="text-xl font-semibold">{event.title}</h3>
                              </div>
                              <div className="mt-2 sm:mt-0">
                                <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                                  Organizing
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                <span>
                                  {new Date(event.date).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-2" />
                                <span>{event.attendees.length} attendees</span>
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2" />
                                <span>{`${event.location.city}, ${event.location.state}`}</span>
                              </div>
                              <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                  <circle cx="9" cy="7" r="4"></circle>
                                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                                <span>{filledVolunteerSpots}/{totalVolunteerSpots} volunteer spots filled</span>
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button
                                variant="default"
                                onClick={() => navigate(`/events/${event.id}`)}
                              >
                                Manage Event
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => navigate(`/events/${event.id}`)}
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">You haven't created any events yet</h3>
                    <p className="text-gray-500 mb-6">Create an event and start building your community!</p>
                    <Button onClick={() => navigate('/create-event')}>
                      Create New Event
                    </Button>
                  </div>
                )}
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
};

export default MyEvents;
