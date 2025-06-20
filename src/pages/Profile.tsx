
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, User } from 'lucide-react';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, events, logout } = useAppContext();
  
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
  
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Info */}
            <Card className="md:col-span-1">
              <CardHeader className="text-center">
                <Avatar className="h-24 w-24 mx-auto">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-primary text-white text-2xl">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="mt-2">{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
                <Badge className="mt-2">
                  {user.role === 'organizer' ? 'Event Organizer' : 'Attendee'}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="pt-2 text-sm text-gray-600">
                  <div className="flex justify-between mb-2">
                    <span>Attending:</span>
                    <span className="font-medium">{attendingEvents.length} events</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Volunteering:</span>
                    <span className="font-medium">{volunteeringEvents.length} events</span>
                  </div>
                  {user.role === 'organizer' && (
                    <div className="flex justify-between">
                      <span>Organizing:</span>
                      <span className="font-medium">{organizingEvents.length} events</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex-col space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/my-events')}
                >
                  Manage My Events
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={logout}
                >
                  Log Out
                </Button>
              </CardFooter>
            </Card>
            
            {/* Activity */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>My Activity</CardTitle>
                <CardDescription>
                  Events you're attending, volunteering for, or organizing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="attending">
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="attending">Attending</TabsTrigger>
                    <TabsTrigger value="volunteering">Volunteering</TabsTrigger>
                    {user.role === 'organizer' && (
                      <TabsTrigger value="organizing">Organizing</TabsTrigger>
                    )}
                  </TabsList>
                  
                  <TabsContent value="attending" className="space-y-4">
                    {attendingEvents.length > 0 ? (
                      attendingEvents.map(event => (
                        <div 
                          key={event.id} 
                          className="bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => navigate(`/events/${event.id}`)}
                        >
                          <div className="flex flex-col sm:flex-row">
                            <div className="sm:w-24 h-24 sm:h-auto overflow-hidden bg-gray-100">
                              <img 
                                src={event.image || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'} 
                                alt={event.title} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-4 flex-1">
                              <div className="flex justify-between items-start mb-1">
                                <h3 className="font-medium">{event.title}</h3>
                                <Badge variant="outline">{event.category}</Badge>
                              </div>
                              <div className="space-y-1 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <Calendar size={14} className="mr-2" />
                                  <span>
                                    {new Date(event.date).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                    })}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <MapPin size={14} className="mr-2" />
                                  <span>{`${event.location.city}, ${event.location.state}`}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>You're not attending any events yet.</p>
                        <Button 
                          variant="link" 
                          onClick={() => navigate('/events')}
                          className="mt-2"
                        >
                          Browse Events
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="volunteering" className="space-y-4">
                    {volunteeringEvents.length > 0 ? (
                      volunteeringEvents.map(event => {
                        // Find which roles the user is volunteering for
                        const volunteeringRoles = Object.entries(event.volunteers)
                          .filter(([_, volunteers]) => volunteers.includes(user.id))
                          .map(([roleId]) => event.volunteerRoles.find(role => role.id === roleId)?.title)
                          .filter(Boolean);
                          
                        return (
                          <div 
                            key={event.id} 
                            className="bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => navigate(`/events/${event.id}`)}
                          >
                            <div className="flex flex-col sm:flex-row">
                              <div className="sm:w-24 h-24 sm:h-auto overflow-hidden bg-gray-100">
                                <img 
                                  src={event.image || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'} 
                                  alt={event.title} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="p-4 flex-1">
                                <div className="flex justify-between items-start mb-1">
                                  <h3 className="font-medium">{event.title}</h3>
                                  <Badge variant="outline">{event.category}</Badge>
                                </div>
                                <div className="space-y-1 text-sm text-gray-500">
                                  <div className="flex items-center">
                                    <Calendar size={14} className="mr-2" />
                                    <span>
                                      {new Date(event.date).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                      })}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <User size={14} className="mr-2" />
                                    <span>
                                      Volunteering as: {volunteeringRoles.join(', ')}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>You're not volunteering for any events yet.</p>
                        <Button 
                          variant="link" 
                          onClick={() => navigate('/events')}
                          className="mt-2"
                        >
                          Find Volunteer Opportunities
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                  
                  {user.role === 'organizer' && (
                    <TabsContent value="organizing" className="space-y-4">
                      {organizingEvents.length > 0 ? (
                        organizingEvents.map(event => (
                          <div 
                            key={event.id} 
                            className="bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => navigate(`/events/${event.id}`)}
                          >
                            <div className="flex flex-col sm:flex-row">
                              <div className="sm:w-24 h-24 sm:h-auto overflow-hidden bg-gray-100">
                                <img 
                                  src={event.image || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'} 
                                  alt={event.title} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="p-4 flex-1">
                                <div className="flex justify-between items-start mb-1">
                                  <h3 className="font-medium">{event.title}</h3>
                                  <Badge variant="outline">{event.category}</Badge>
                                </div>
                                <div className="space-y-1 text-sm text-gray-500">
                                  <div className="flex items-center">
                                    <Calendar size={14} className="mr-2" />
                                    <span>
                                      {new Date(event.date).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                      })}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <User size={14} className="mr-2" />
                                    <span>
                                      {event.attendees.length} attendees
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <p>You're not organizing any events yet.</p>
                          <Button 
                            variant="link" 
                            onClick={() => navigate('/create-event')}
                            className="mt-2"
                          >
                            Create an Event
                          </Button>
                        </div>
                      )}
                    </TabsContent>
                  )}
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
