
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'organizer' | 'attendee';
  avatar?: string;
}

export interface EventLocation {
  address: string;
  city: string;
  state: string;
  zip: string;
}

export interface VolunteerRole {
  id: string;
  title: string;
  description: string;
  spotsTotal: number;
  spotsFilled: number;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  image?: string;
  date: string;
  startTime: string;
  endTime: string;
  location: EventLocation;
  organizerId: string;
  organizerName: string;
  category: string;
  volunteerRoles: VolunteerRole[];
  attendees: string[];
  volunteers: Record<string, string[]>; // roleId -> [userId]
  comments: Comment[];
  isFree: boolean;
  ticketPrice?: number;
  totalSpots?: number;
  spotsRemaining?: number;
}

export type EventCategory = 
  | 'Charity'
  | 'Meetup'
  | 'Cultural'
  | 'Sports'
  | 'Education'
  | 'Health'
  | 'Environmental'
  | 'Technology'
  | 'Other';
