import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Calendar, User, ChevronRight, Heart, Star, Clock } from 'lucide-react';
import { EventCategory } from '@/types';
import { motion } from 'framer-motion';
import heroVideo from '@/assets/hero-background.mp4'; // You'll need to add this video file

// Premium color palette
const colors = {
  primary: 'bg-indigo-600',
  primaryHover: 'hover:bg-indigo-700',
  primaryLight: 'bg-indigo-500',
  secondary: 'bg-amber-500',
  secondaryHover: 'hover:bg-amber-600',
  textPrimary: 'text-gray-900',
  textSecondary: 'text-gray-600',
  lightBg: 'bg-gray-50',
  darkBg: 'bg-gray-900',
  cardBg: 'bg-white',
};

const categoriesWithIcons: Record<EventCategory, { name: string; icon: React.ReactNode }> = {
  'Charity': { 
    name: 'Charity', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
      </svg>
    )
  },
  'Meetup': { 
    name: 'Meetup', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
    )
  },
  'Cultural': { 
    name: 'Cultural', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z" clipRule="evenodd" />
      </svg>
    )
  },
  'Sports': { 
    name: 'Sports', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
      </svg>
    )
  },
  'Education': { 
    name: 'Education', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
      </svg>
    )
  },
  'Health': { 
    name: 'Health', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    )
  },
  'Environmental': { 
    name: 'Environmental', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
      </svg>
    )
  },
  'Technology': { 
    name: 'Technology', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
    )
  },
  'Other': { 
    name: 'Other', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
    )
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } }
};

const slideUp = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const HomePage: React.FC = () => {
  const { events } = useAppContext();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Get upcoming events (sorted by date, limited to 4)
  const upcomingEvents = [...events]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/events?search=${searchQuery}`);
  };

  return (
    <AppLayout>
      {/* Hero Section with Video Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover"
          >
            <source src={heroVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="container mx-auto px-4 z-10 text-center"
        >
          <motion.div variants={slideUp}>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white">
              Connect Through <span className="text-amber-400">Community</span> Events
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
              Discover, join, and create meaningful local events that bring people together
            </p>
          </motion.div>
          
          <motion.form 
            onSubmit={handleSearch} 
            variants={slideUp}
            className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto"
          >
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Search for events..."
                className="pl-10 h-14 rounded-lg bg-white/90 text-gray-800 border-0 w-full focus-visible:ring-2 focus-visible:ring-amber-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              type="submit" 
              className="h-14 px-8 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-lg rounded-lg transition-all hover:shadow-lg"
            >
              Search
            </Button>
          </motion.form>
        </motion.div>
        
        {/* Scroll indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
        >
          <ChevronRight className="h-8 w-8 text-white rotate-90" />
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Explore by Category</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find events that match your interests across our diverse categories
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6"
          >
            {Object.entries(categoriesWithIcons).map(([key, category]) => (
              <motion.div 
                key={key}
                variants={slideUp}
                onMouseEnter={() => setHoveredCategory(key)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <Link 
                  to={`/events?category=${key}`}
                  className={`block bg-white rounded-xl shadow-sm p-6 text-center transition-all duration-300 ${
                    hoveredCategory === key 
                      ? 'shadow-lg -translate-y-2 ring-2 ring-indigo-500' 
                      : 'hover:shadow-md'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors ${
                    hoveredCategory === key ? 'bg-indigo-100' : 'bg-gray-100'
                  }`}>
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-lg text-gray-800">{category.name}</h3>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="flex flex-col md:flex-row justify-between items-center mb-12"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Upcoming Events</h2>
              <p className="text-lg text-gray-600 mt-2">Don't miss these exciting events happening soon</p>
            </div>
            <Link 
              to="/events" 
              className="flex items-center text-indigo-600 hover:text-indigo-700 font-medium mt-4 md:mt-0 group"
            >
              View all events
              <ChevronRight className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {upcomingEvents.map((event) => (
              <motion.div 
                key={event.id} 
                variants={slideUp}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'} 
                    alt={event.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      event.category === 'Charity' ? 'bg-amber-100 text-amber-800' :
                      event.category === 'Meetup' ? 'bg-indigo-100 text-indigo-800' :
                      event.category === 'Cultural' ? 'bg-purple-100 text-purple-800' :
                      event.category === 'Sports' ? 'bg-emerald-100 text-emerald-800' :
                      event.category === 'Education' ? 'bg-blue-100 text-blue-800' :
                      event.category === 'Health' ? 'bg-rose-100 text-rose-800' :
                      event.category === 'Environmental' ? 'bg-green-100 text-green-800' :
                      event.category === 'Technology' ? 'bg-cyan-100 text-cyan-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {event.category}
                    </span>
                    
                  </div>
                  {!event.isFree && (
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-900 shadow-sm">
                      ${event.ticketPrice}
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{event.title}</h3>
                    <button className="text-gray-400 hover:text-rose-500 transition-colors">
                      <Heart className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-3 mb-5">
                    <div className="flex items-center text-gray-600 text-sm">
                      <Calendar size={16} className="mr-2 text-indigo-500" />
                      <span>
                        {new Date(event.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                        <span className="mx-1">•</span>
                        {new Date(event.date).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin size={16} className="mr-2 text-indigo-500" />
                      <span className="line-clamp-1">{`${event.location.city}, ${event.location.state}`}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <User size={16} className="mr-2 text-indigo-500" />
                      <span>
                        {event.volunteerRoles.reduce((acc, role) => acc + (role.spotsTotal - role.spotsFilled), 0)} 
                        <span className="text-gray-500"> spots left</span>
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 font-medium"
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-indigo-600 text-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            <motion.div variants={slideUp} className="p-4">
              <div className="text-4xl md:text-5xl font-bold mb-2">1,200+</div>
              <div className="text-indigo-100">Events Monthly</div>
            </motion.div>
            <motion.div variants={slideUp} className="p-4">
              <div className="text-4xl md:text-5xl font-bold mb-2">25K+</div>
              <div className="text-indigo-100">Active Members</div>
            </motion.div>
            <motion.div variants={slideUp} className="p-4">
              <div className="text-4xl md:text-5xl font-bold mb-2">150+</div>
              <div className="text-indigo-100">Local Communities</div>
            </motion.div>
            <motion.div variants={slideUp} className="p-4">
              <div className="text-4xl md:text-5xl font-bold mb-2">95%</div>
              <div className="text-indigo-100">Positive Feedback</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join and create events in just a few simple steps
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div 
              variants={slideUp}
              whileHover={{ scale: 1.03 }}
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
            >
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">Discover Events</h3>
              <p className="text-gray-600 text-center">
                Browse through hundreds of local events filtered by your interests, location, and schedule.
              </p>
            </motion.div>
            
            <motion.div 
              variants={slideUp}
              whileHover={{ scale: 1.03 }}
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
            >
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">Join & Volunteer</h3>
              <p className="text-gray-600 text-center">
                Register with one click and sign up for volunteer roles that match your skills and availability.
              </p>
            </motion.div>
            
            <motion.div 
              variants={slideUp}
              whileHover={{ scale: 1.03 }}
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">Create Events</h3>
              <p className="text-gray-600 text-center">
                Organize your own events with our easy-to-use tools and manage volunteers effortlessly.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">What Our Community Says</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from people who've found meaningful connections through our platform
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                quote: "I've met so many amazing people through events on this platform. It's transformed my social life!",
                name: "Sarah Johnson",
                role: "Volunteer at 12+ events",
                avatar: "https://randomuser.me/api/portraits/women/44.jpg"
              },
              {
                quote: "As an organizer, the volunteer management tools have saved me countless hours. Highly recommended!",
                name: "Michael Chen",
                role: "Community Leader",
                avatar: "https://randomuser.me/api/portraits/men/32.jpg"
              },
              {
                quote: "Found my perfect volunteering opportunity within days of signing up. The search filters are excellent.",
                name: "David Rodriguez",
                role: "Environmental Activist",
                avatar: "https://randomuser.me/api/portraits/men/75.jpg"
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                variants={slideUp}
                className="bg-gray-50 p-8 rounded-xl border border-gray-200"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Involved?</h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Join thousands of community members making a difference in their neighborhoods
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div variants={slideUp}>
              <Button 
                size="lg" 
                className="bg-amber-500 hover:bg-amber-600 text-white font-semibold text-lg rounded-lg px-8 py-6 transition-all hover:shadow-lg"
                onClick={() => navigate('/register')}
              >
                Sign Up Now
              </Button>
            </motion.div>
            <motion.div variants={slideUp}>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white-500 hover:bg-amber-500 text-white font-semibold text-lg rounded-lg px-8 py-6 transition-all hover:shadow-lg"
                onClick={() => navigate('/events')}
              >
                Browse Events
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </AppLayout>
  );
};

export default HomePage;