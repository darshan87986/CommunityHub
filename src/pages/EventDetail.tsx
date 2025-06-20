
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Calendar, Clock, User, MessageSquare, DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const EventDetail: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { events, user, joinEvent, volunteerForRole, addComment, loading } = useAppContext();
  
  const event = events.find(e => e.id === eventId);
  
  const [newComment, setNewComment] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [showVolunteerDialog, setShowVolunteerDialog] = useState(false);
  
  if (!event) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
            <p className="mb-8">The event you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/events')}>Browse Events</Button>
          </div>
        </div>
      </AppLayout>
    );
  }
  
  const isAttending = user ? event.attendees.includes(user.id) : false;
  
  const handleJoinEvent = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      await joinEvent(event.id);
      toast.success('Successfully joined the event!');
    } catch (error) {
      // Error is handled in context
    }
  };
  
  const handleVolunteerRole = async () => {
    if (!selectedRole) {
      toast.error('Please select a role to volunteer for');
      return;
    }
    
    try {
      await volunteerForRole(event.id, selectedRole);
      setSelectedRole('');
      setShowVolunteerDialog(false);
      toast.success('Successfully volunteered for the role!');
    } catch (error) {
      // Error is handled in context
    }
  };
  
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }
    
    try {
      await addComment(event.id, newComment);
      setNewComment('');
      toast.success('Comment added successfully!');
    } catch (error) {
      // Error is handled in context
    }
  };
  
  return (
    <AppLayout>
      {/* Event Header */}
      <div 
        className="relative bg-cover bg-center py-20"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${event.image || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'})`,
        }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <Badge className="mb-4 bg-primary hover:bg-primary">
              {event.category}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {event.title}
            </h1>
            <div className="flex flex-wrap items-center text-white text-sm md:text-base gap-4 md:gap-6">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
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
                <Clock className="w-4 h-4 mr-2" />
                <span>{`${event.startTime} - ${event.endTime}`}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span>
                  {`${event.location.address}, ${event.location.city}, ${event.location.state}`}
                </span>
              </div>
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                <span>Organized by {event.organizerName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="about">
              <TabsList className="mb-6">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="volunteers">Volunteer Roles</TabsTrigger>
                <TabsTrigger value="discussion">
                  Discussion ({event.comments.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About This Event</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line">
                      {event.description}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Location</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 mr-3 text-gray-500 mt-0.5" />
                      <div>
                        <p className="font-medium">{`${event.location.address}`}</p>
                        <p className="text-gray-600">{`${event.location.city}, ${event.location.state} ${event.location.zip}`}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <a 
                      href={`https://maps.google.com/?q=${encodeURIComponent(`${event.location.address}, ${event.location.city}, ${event.location.state} ${event.location.zip}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm font-medium"
                    >
                      View on Google Maps
                    </a>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="volunteers" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Volunteer Opportunities</CardTitle>
                    <CardDescription>
                      Help make this event a success by volunteering
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {event.volunteerRoles.length > 0 ? (
                      <div className="space-y-4">
                        {event.volunteerRoles.map((role) => {
                          const isVolunteering = user && event.volunteers[role.id]?.includes(user.id);
                          const spotsFilled = role.spotsFilled;
                          const spotsTotal = role.spotsTotal;
                          const spotsAvailable = spotsTotal - spotsFilled;
                          
                          return (
                            <div key={role.id} className="border rounded-lg p-4">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                                <h3 className="text-lg font-semibold">{role.title}</h3>
                                <div className="flex items-center mt-2 sm:mt-0">
                                  <Badge variant={spotsAvailable > 0 ? 'outline' : 'secondary'} className="mr-2">
                                    {spotsAvailable > 0 ? `${spotsAvailable} spots left` : 'Full'}
                                  </Badge>
                                  {isVolunteering && (
                                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                      You're volunteering
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <p className="text-gray-600 mb-4">{role.description}</p>
                              <div className="flex justify-between items-center">
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <div 
                                    className="bg-primary h-2.5 rounded-full" 
                                    style={{ width: `${(spotsFilled / spotsTotal) * 100}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm text-gray-600 ml-4">
                                  {spotsFilled}/{spotsTotal}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                        
                        <div className="mt-6">
                          <Dialog open={showVolunteerDialog} onOpenChange={setShowVolunteerDialog}>
                            <DialogTrigger asChild>
                              <Button
                                disabled={loading || !user}
                                onClick={() => {
                                  if (!user) {
                                    navigate('/login');
                                  }
                                }}
                              >
                                Volunteer Now
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Volunteer for a Role</DialogTitle>
                                <DialogDescription>
                                  Select a role you'd like to volunteer for.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  {event.volunteerRoles.map((role) => {
                                    const isVolunteering = user && event.volunteers[role.id]?.includes(user.id);
                                    const isFull = role.spotsFilled >= role.spotsTotal;
                                    const isDisabled = isVolunteering || isFull;
                                    
                                    return (
                                      <div key={role.id} className="flex">
                                        <label className={`flex flex-col space-y-1 rounded-md border border-gray-200 p-4 w-full ${selectedRole === role.id ? 'border-primary bg-primary/5' : ''} ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                                          <div className="flex justify-between">
                                            <div>
                                              <input
                                                type="radio"
                                                name="role"
                                                value={role.id}
                                                checked={selectedRole === role.id}
                                                onChange={() => !isDisabled && setSelectedRole(role.id)}
                                                className="sr-only"
                                                disabled={isDisabled}
                                              />
                                              <span className="text-sm font-medium">{role.title}</span>
                                            </div>
                                            <div>
                                              {isVolunteering ? (
                                                <Badge className="bg-green-100 text-green-800">
                                                  Already volunteering
                                                </Badge>
                                              ) : isFull ? (
                                                <Badge variant="secondary">Full</Badge>
                                              ) : (
                                                <Badge variant="outline">
                                                  {role.spotsTotal - role.spotsFilled} spots left
                                                </Badge>
                                              )}
                                            </div>
                                          </div>
                                          <span className="text-xs text-gray-500">{role.description}</span>
                                        </label>
                                      </div>
                                    );
                                  })}
                                </div>
                                <Button 
                                  onClick={handleVolunteerRole}
                                  disabled={!selectedRole || loading}
                                  className="w-full"
                                >
                                  {loading ? 'Processing...' : 'Confirm'}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    ) : (
                      <p>There are no volunteer roles available for this event.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="discussion" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Discussion</CardTitle>
                    <CardDescription>
                      Join the conversation about this event
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {user ? (
                      <form onSubmit={handleAddComment} className="mb-6">
                        <Textarea
                          placeholder="Write a comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="mb-3 min-h-20"
                        />
                        <Button type="submit" disabled={loading}>
                          {loading ? 'Posting...' : 'Post Comment'}
                        </Button>
                      </form>
                    ) : (
                      <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <p className="text-gray-600 mb-2">
                          Please sign in to join the discussion.
                        </p>
                        <Button variant="outline" onClick={() => navigate('/login')}>
                          Sign In
                        </Button>
                      </div>
                    )}
                    
                    {event.comments.length > 0 ? (
                      <div className="space-y-6">
                        {event.comments.map((comment) => (
                          <div key={comment.id} className="border-b pb-6 last:border-0 last:pb-0">
                            <div className="flex items-start">
                              <Avatar className="h-10 w-10 mr-4">
                                <AvatarImage src={comment.userAvatar} alt={comment.userName} />
                                <AvatarFallback className="bg-primary text-white">
                                  {comment.userName.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                  <h4 className="font-medium">{comment.userName}</h4>
                                  <span className="text-sm text-gray-500">
                                    {format(new Date(comment.createdAt), 'MMM d, yyyy')}
                                  </span>
                                </div>
                                <p className="text-gray-800">{comment.content}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">
                        No comments yet. Be the first to comment!
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div>
            <div className="sticky top-24">
              <Card>
                <CardHeader>
                  <CardTitle>Registration</CardTitle>
                  <CardDescription>
                    {event.isFree ? 'This is a free event' : `Ticket price: $${event.ticketPrice}`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!event.isFree && event.spotsRemaining !== undefined && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Spots remaining</p>
                      <div className="flex justify-between items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-primary h-2.5 rounded-full" 
                            style={{ width: `${((event.totalSpots! - event.spotsRemaining) / event.totalSpots!) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 ml-4">
                          {event.spotsRemaining}/{event.totalSpots}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-1">Date and Time</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>
                          {new Date(event.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{`${event.startTime} - ${event.endTime}`}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-1">Location</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{event.location.address}</span>
                      </div>
                      <div className="pl-6">
                        <span>{`${event.location.city}, ${event.location.state} ${event.location.zip}`}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-3">
                  <Button
                    className="w-full"
                    disabled={isAttending || loading}
                    onClick={handleJoinEvent}
                  >
                    {isAttending ? 'You are attending' : (event.isFree ? 'Register Now' : 'Get Tickets')}
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowVolunteerDialog(true)}
                    disabled={!user}
                  >
                    Volunteer for this Event
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default EventDetail;
