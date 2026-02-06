import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Event from './models/Event.js';
import TeamMember from './models/TeamMember.js';
import Gallery from './models/Gallery.js';
import Membership from './models/Membership.js';
import Contact from './models/Contact.js';

dotenv.config();

// Using placeholder images from Unsplash
const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});
    await TeamMember.deleteMany({});
    await Gallery.deleteMany({});
    await Membership.deleteMany({});
    await Contact.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create Admin User
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      email: 'admin@realestateclub.com',
      password: hashedPassword,
      role: 'admin'
    });
    console.log('👤 Admin user created (email: admin@realestateclub.com, password: admin123)');

    // Create Events
    const events = [
      {
        title: 'Real Estate Investment Workshop',
        description: 'Learn the fundamentals of real estate investment, including property analysis, financing options, and market trends. Perfect for beginners looking to start their investment journey.',
        date: new Date('2024-03-15'),
        time: '6:00 PM - 8:00 PM',
        location: 'University Hall, Room 301',
        speaker: 'John Anderson - Senior Real Estate Investor',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop',
        status: 'upcoming'
      },
      {
        title: 'Property Development Seminar',
        description: 'Discover the process of property development from land acquisition to project completion. Industry experts will share insights on zoning, permits, and construction management.',
        date: new Date('2024-03-22'),
        time: '5:30 PM - 7:30 PM',
        location: 'Business School Auditorium',
        speaker: 'Sarah Mitchell - Property Developer',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
        status: 'upcoming'
      },
      {
        title: 'Commercial Real Estate Networking Night',
        description: 'Connect with professionals in commercial real estate. Network with brokers, investors, and developers while learning about current market opportunities.',
        date: new Date('2024-04-05'),
        time: '7:00 PM - 9:00 PM',
        location: 'Downtown Conference Center',
        speaker: 'Multiple Industry Professionals',
        image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop',
        status: 'upcoming'
      },
      {
        title: 'Real Estate Market Analysis Workshop',
        description: 'Explored data-driven approaches to analyzing real estate markets. Learned about demographic trends, economic indicators, and predictive modeling.',
        date: new Date('2024-02-10'),
        time: '6:00 PM - 8:00 PM',
        location: 'University Hall, Room 205',
        speaker: 'Dr. Michael Chen - Market Analyst',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
        status: 'past'
      },
      {
        title: 'Property Tour: Luxury Condominiums',
        description: 'Exclusive tour of newly developed luxury condominiums. Members experienced high-end finishes and learned about the luxury real estate market.',
        date: new Date('2024-01-28'),
        time: '2:00 PM - 4:00 PM',
        location: 'Riverside Luxury Towers',
        speaker: 'Amanda Rodriguez - Luxury Real Estate Agent',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
        status: 'past'
      },
      {
        title: 'Real Estate Finance Fundamentals',
        description: 'Comprehensive session on real estate financing including mortgages, commercial loans, and creative financing strategies.',
        date: new Date('2024-01-15'),
        time: '6:30 PM - 8:30 PM',
        location: 'Business School, Room 101',
        speaker: 'Robert Thompson - Mortgage Broker',
        image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=600&fit=crop',
        status: 'past'
      }
    ];
    await Event.insertMany(events);
    console.log('📅 Created events');

    // Create Team Members
    const team = [
      {
        name: 'Emily Johnson',
        role: 'President',
        bio: 'Senior majoring in Business Administration with a passion for real estate development. Leading the club to new heights.',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
        linkedin: 'https://linkedin.com',
        order: 1
      },
      {
        name: 'Michael Chen',
        role: 'Vice President',
        bio: 'Finance major with experience in real estate investment analysis. Focused on bringing industry connections to our members.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
        linkedin: 'https://linkedin.com',
        order: 2
      },
      {
        name: 'Sarah Williams',
        role: 'Events Coordinator',
        bio: 'Marketing major passionate about creating engaging events and networking opportunities for club members.',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
        linkedin: 'https://linkedin.com',
        order: 3
      },
      {
        name: 'David Martinez',
        role: 'Treasurer',
        bio: 'Accounting major ensuring financial stability and transparency. Managing club finances and sponsorship relationships.',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
        linkedin: 'https://linkedin.com',
        order: 4
      },
      {
        name: 'Jessica Lee',
        role: 'Marketing Director',
        bio: 'Communications major driving our social media presence and member engagement initiatives.',
        image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop',
        linkedin: 'https://linkedin.com',
        order: 5
      },
      {
        name: 'James Wilson',
        role: 'Membership Chair',
        bio: 'Business major focused on growing our membership and ensuring an excellent experience for all members.',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
        linkedin: 'https://linkedin.com',
        order: 6
      },
      {
        name: 'Amanda Brown',
        role: 'Industry Relations',
        bio: 'Economics major building partnerships with real estate firms and creating internship opportunities.',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
        linkedin: 'https://linkedin.com',
        order: 7
      },
      {
        name: 'Ryan Taylor',
        role: 'Technology Lead',
        bio: 'Computer Science major managing our digital platforms and developing tools for member resources.',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
        linkedin: 'https://linkedin.com',
        order: 8
      }
    ];
    await TeamMember.insertMany(team);
    console.log('👥 Created team members');

    // Create Gallery Images
    const gallery = [
      {
        title: 'Annual Real Estate Conference 2024',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
        category: 'Events',
        order: 1
      },
      {
        title: 'Property Development Workshop',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
        category: 'Workshops',
        order: 2
      },
      {
        title: 'Networking Night with Industry Leaders',
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop',
        category: 'Networking',
        order: 3
      },
      {
        title: 'Commercial Property Tour',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
        category: 'Tours',
        order: 4
      },
      {
        title: 'Investment Strategy Session',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
        category: 'Workshops',
        order: 5
      },
      {
        title: 'Team Building Event',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop',
        category: 'Social',
        order: 6
      },
      {
        title: 'Luxury Residential Showcase',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
        category: 'Tours',
        order: 7
      },
      {
        title: 'Guest Speaker Series',
        image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=600&fit=crop',
        category: 'Events',
        order: 8
      },
      {
        title: 'Market Analysis Presentation',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
        category: 'Workshops',
        order: 9
      },
      {
        title: 'Club Social Gathering',
        image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop',
        category: 'Social',
        order: 10
      },
      {
        title: 'Real Estate Technology Demo',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
        category: 'Workshops',
        order: 11
      },
      {
        title: 'Downtown Development Tour',
        image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&h=600&fit=crop',
        category: 'Tours',
        order: 12
      }
    ];
    await Gallery.insertMany(gallery);
    console.log('🖼️  Created gallery images');

    // Create Sample Membership Applications
    const memberships = [
      {
        name: 'Alex Thompson',
        email: 'alex.thompson@university.edu',
        phone: '+1 (555) 123-4567',
        college: 'University Business School',
        year: 'Junior',
        reason: 'I am passionate about real estate and want to learn more about investment strategies and network with industry professionals.',
        status: 'pending'
      },
      {
        name: 'Maria Garcia',
        email: 'maria.garcia@university.edu',
        phone: '+1 (555) 234-5678',
        college: 'University Business School',
        year: 'Sophomore',
        reason: 'Looking to explore career opportunities in commercial real estate and gain practical knowledge.',
        status: 'approved'
      },
      {
        name: 'Kevin Patel',
        email: 'kevin.patel@university.edu',
        phone: '+1 (555) 345-6789',
        college: 'School of Economics',
        year: 'Senior',
        reason: 'Want to understand real estate market dynamics and connect with like-minded students.',
        status: 'pending'
      }
    ];
    await Membership.insertMany(memberships);
    console.log('📝 Created membership applications');

    // Create Sample Contact Messages
    const contacts = [
      {
        name: 'Jennifer Smith',
        email: 'jennifer.smith@email.com',
        subject: 'Partnership Opportunity',
        message: 'I represent a local real estate firm interested in partnering with your club for events and internship opportunities.',
        status: 'new'
      },
      {
        name: 'Robert Johnson',
        email: 'robert.j@email.com',
        subject: 'Guest Speaker Inquiry',
        message: 'I would like to volunteer as a guest speaker to share my 20 years of experience in residential real estate.',
        status: 'new'
      },
      {
        name: 'Lisa Anderson',
        email: 'lisa.anderson@email.com',
        subject: 'Event Information',
        message: 'Could you provide more details about the upcoming Real Estate Investment Workshop?',
        status: 'read'
      }
    ];
    await Contact.insertMany(contacts);
    console.log('📧 Created contact messages');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log('   - Admin User: admin@realestateclub.com / admin123');
    console.log('   - Events: 6 (3 upcoming, 3 past)');
    console.log('   - Team Members: 8');
    console.log('   - Gallery Images: 12');
    console.log('   - Membership Applications: 3');
    console.log('   - Contact Messages: 3');
    console.log('\n🌐 Visit http://localhost:3000 to see your website!');
    console.log('🔐 Login at http://localhost:3000/login with admin credentials');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
