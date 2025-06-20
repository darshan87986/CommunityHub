import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';

const AboutPage: React.FC = () => {
  // Refs for scroll animations
  const missionRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);
  
  const missionInView = useInView(missionRef, { once: true, amount: 0.3 });
  const valuesInView = useInView(valuesRef, { once: true, amount: 0.3 });
  const teamInView = useInView(teamRef, { once: true, amount: 0.3 });
  
  // Parallax effect for hero section
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.5]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 50]);

  // Hover states for cards
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);
  const [hoveredTeamMember, setHoveredTeamMember] = useState<number | null>(null);

  // Values data
  const valuesData = [
    {
      title: "Community First",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      description: "We believe that thriving communities are the foundation of a better world. Every feature we build is designed to strengthen community bonds."
    },
    {
      title: "Inclusivity",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
        </svg>
      ),
      description: "Our platform is designed to be accessible to everyone, regardless of background, ability, or experience level."
    },
    {
      title: "Impact",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      description: "We measure our success by the positive change we help create in communities around the world."
    }
  ];

  // Team data
  const teamData = [
    {
      name: "Sujal Bagavan",
      role: "CEO & Founder",
      bio: "Passionate about community building and social impact.",
      imgUrl: "https://media.licdn.com/dms/image/v2/D5603AQGoXzoIHnYiPA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1721629236530?e=1749081600&v=beta&t=L9JP58mPfU07f-yecgt8p4OERmthPxXnh_STtbYOg6U"
    },
    {
      name: "Praveen Sadalgi",
      role: "CTO",
      bio: "Tech expert with a background in building scalable platforms.",
      imgUrl: "https://media.licdn.com/dms/image/v2/C4E03AQF2_YA-SyQoDQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1648264407405?e=1749081600&v=beta&t=AQgDRfMb425dKfIVACTkU45IZz73hW4WjTpppFORuqc"
    },
    {
      name: "Veerish Hindiholi",
      role: "COO",
      bio: "Operations expert with a focus on community engagement.",
      imgUrl: "https://media.licdn.com/dms/image/v2/D5603AQG6RFctGfzpJg/profile-displayphoto-shrink_400_400/B56ZX6wG1SGcAo-/0/1743668670849?e=1749081600&v=beta&t=Ro-64_6UIqE8IcOPakNWVG2Vwq4buaaS3jePGdXw9C4"
    },
    {
      name: "Darshan Jarale",
      role: "COO",
      bio: "Operations expert with a focus on community engagement.",
      imgUrl: "https://media.licdn.com/dms/image/v2/D5603AQGga_2c1wNa-A/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1722529981025?e=1749081600&v=beta&t=XEweNGbfevHOhJcC4_o1DoE4vewYh7cNe6ylPvNl4NM"
    }
  ];

  return (
    <AppLayout>
      {/* Hero Section with Interactive Parallax */}
      <motion.section 
        className="relative h-screen flex items-center justify-center bg-gradient-to-r from-purple-700 to-violet-500 text-white overflow-hidden"
        style={{ opacity: heroOpacity }}
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-20 w-40 h-40 rounded-full bg-purple-400 opacity-20"></div>
          <div className="absolute bottom-40 right-20 w-60 h-60 rounded-full bg-violet-400 opacity-20"></div>
          <div className="absolute top-40 right-1/4 w-20 h-20 rounded-full bg-purple-300 opacity-20"></div>
        </div>
        
        <motion.div 
          className="container relative z-10 mx-auto px-4 h-full flex items-center"
          style={{ y: heroY }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              About Community Hub
            </motion.h1>
            <motion.p 
              className="text-xl md:text-3xl mb-12 text-purple-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Building stronger communities through engagement and volunteering
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link to="/events">
                <Button 
                  size="lg" 
                  className="bg-white text-purple-700 hover:bg-purple-100 transition-all duration-300 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl"
                >
                  Discover Our Community
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div
          className="absolute bottom-10 left-0 right-0 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-10 w-10 animate-bounce text-white opacity-70" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.section>

      {/* Mission Section with Enhanced Visuals */}
      <section className="py-32 bg-gradient-to-b from-white to-purple-50" ref={missionRef}>
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={missionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-10 text-center text-gray-800 relative">
              Our Mission
              <span className="block w-24 h-1 bg-purple-500 mx-auto mt-6"></span>
            </h2>
            
            <motion.div 
              className="bg-white p-10 rounded-2xl shadow-lg border-l-4 border-purple-500"
              whileHover={{ 
                boxShadow: "0 25px 50px -12px rgba(139, 92, 246, 0.25)",
                y: -5,
                transition: { duration: 0.3 }
              }}
            >
              <div className="flex flex-col space-y-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-6">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Community Hub was founded with a simple but powerful mission: to strengthen local communities by making it easier for people to find, join, and create events that matter to them.
                  </p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-6">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    We believe that strong communities are built on active participation, volunteering, and meaningful connections between people. Our platform is designed to break down the barriers that often prevent people from getting involved in their local areas.
                  </p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-6">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Whether you're looking to attend a neighborhood cleanup, volunteer at a charity gala, or organize your own community event, Community Hub provides the tools and resources you need to make it happen.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values Section with Hover Effects */}
      <section className="py-32 bg-gradient-to-b from-purple-50 to-white" ref={valuesRef}>
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-4xl font-bold mb-16 text-center text-gray-800 relative"
            initial={{ opacity: 0 }}
            animate={valuesInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
          >
            Our Values
            <span className="block w-24 h-1 bg-purple-500 mx-auto mt-6"></span>
          </motion.h2>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {valuesData.map((value, index) => (
              <motion.div 
                key={index}
                className={`bg-white p-8 rounded-2xl shadow-lg overflow-hidden relative ${
                  hoveredValue === index ? 'ring-2 ring-purple-400' : ''
                }`}
                onMouseEnter={() => setHoveredValue(index)}
                onMouseLeave={() => setHoveredValue(null)}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-purple-500 to-violet-600 opacity-0"
                  animate={{ 
                    opacity: hoveredValue === index ? 0.9 : 0
                  }}
                  transition={{ duration: 0.3 }}
                />
                
                <div className="relative z-10">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                    hoveredValue === index ? 'bg-white text-purple-600' : 'bg-purple-100 text-purple-600'
                  }`}>
                    {value.icon}
                  </div>
                  
                  <h3 className={`text-2xl font-semibold mb-4 text-center ${
                    hoveredValue === index ? 'text-white' : 'text-gray-800'
                  }`}>
                    {value.title}
                  </h3>
                  
                  <p className={`text-center leading-relaxed ${
                    hoveredValue === index ? 'text-white' : 'text-gray-600'
                  }`}>
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Team Section with Enhanced Cards */}
      <section className="py-32 bg-gradient-to-b from-white to-purple-50" ref={teamRef}>
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-4xl font-bold mb-16 text-center text-gray-800 relative"
            initial={{ opacity: 0 }}
            animate={teamInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
          >
            Our Team
            <span className="block w-24 h-1 bg-purple-500 mx-auto mt-6"></span>
          </motion.h2>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={teamInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {teamData.map((member, index) => (
              <motion.div 
                key={index} 
                className="relative group"
                onMouseEnter={() => setHoveredTeamMember(index)}
                onMouseLeave={() => setHoveredTeamMember(null)}
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              >
                <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300">
                  <div className="h-64 overflow-hidden">
                    <img
                      src={member.imgUrl}
                      alt={member.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-1 group-hover:text-purple-600 transition-colors duration-300">{member.name}</h3>
                    <p className="text-purple-600 font-medium mb-4">{member.role}</p>
                    
                    <AnimatePresence>
                      {hoveredTeamMember === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p className="text-gray-600 mb-4">{member.bio}</p>
                          <div className="flex space-x-3">
                            {['Twitter', 'LinkedIn', 'Email'].map((platform, i) => (
                              <div key={i} className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 cursor-pointer hover:bg-purple-600 hover:text-white transition-colors duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Call to Action with Enhanced Effects */}
      <section className="py-32 bg-gradient-to-r from-purple-700 to-violet-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.div 
            className="absolute w-96 h-96 rounded-full bg-purple-500/30 -top-20 -right-20"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ 
              repeat: Infinity,
              duration: 8
            }}
          />
          <motion.div 
            className="absolute w-64 h-64 rounded-full bg-violet-500/20 bottom-20 left-20"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ 
              repeat: Infinity,
              duration: 10,
              delay: 1
            }}
          />
        </div>
        
        <motion.div 
          className="container mx-auto px-4 text-center relative z-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to Get Involved?</h2>
          <p className="text-xl text-purple-100 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join our community today and start discovering events or create your own!
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link to="/register">
                <Button 
                  size="lg" 
                  className="bg-white text-purple-700 hover:bg-purple-50 px-10 py-7 text-lg font-medium rounded-full shadow-xl"
                >
                  Sign Up
                </Button>
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link to="/events">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white text-purple-700 hover:bg-white  px-10 py-7 text-lg font-medium rounded-full shadow-xl"
                >
                  Browse Events
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </AppLayout>
  );
};

export default AboutPage;