const mongoose = require('mongoose');
const User = require('../src/models/User');
const Mission = require('../src/models/Mission');
const connectDB = require('../src/config/database');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Mission.deleteMany({});

    // Create admin user
    const admin = await User.create({
      email: 'admin@benevolat.com',
      password: 'admin123',
      role: 'admin',
      firstName: 'Admin',
      lastName: 'System',
      isVerified: true
    });

    // Create sample organization
    const org = await User.create({
      email: 'org@example.com',
      password: 'password123',
      role: 'organization',
      organizationName: 'Croix-Rouge',
      organizationType: 'NGO',
      description: 'Organisation humanitaire',
      isVerified: true,
      isValidated: true,
      validatedBy: admin._id,
      validatedAt: new Date()
    });

    // Create sample volunteers
    const volunteers = await User.create([
      {
        email: 'volunteer1@example.com',
        password: 'password123',
        role: 'volunteer',
        firstName: 'Jean',
        lastName: 'Dupont',
        isVerified: true,
        skills: ['Communication', 'Education']
      },
      {
        email: 'volunteer2@example.com',
        password: 'password123',
        role: 'volunteer',
        firstName: 'Marie',
        lastName: 'Martin',
        isVerified: true,
        skills: ['Health', 'Social']
      }
    ]);

    // Create sample missions
    await Mission.create([
      {
        organization: org._id,
        title: 'Distribution alimentaire',
        description: 'Aide à la distribution de repas pour les personnes en difficulté',
        category: 'Social',
        type: 'one-time',
        volunteersNeeded: 5,
        status: 'published',
        dates: [{
          startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
          startTime: '09:00',
          endTime: '13:00'
        }],
        location: {
          address: '1 rue de la République',
          city: 'Paris',
          postalCode: '75001',
          country: 'France'
        }
      },
      {
        organization: org._id,
        title: 'Soutien scolaire',
        description: 'Aide aux devoirs pour les enfants du primaire',
        category: 'Education',
        type: 'recurring',
        volunteersNeeded: 10,
        status: 'published',
        dates: [{
          startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
          startTime: '16:00',
          endTime: '18:00'
        }],
        location: {
          address: '10 avenue des Écoles',
          city: 'Lyon',
          postalCode: '69001',
          country: 'France'
        }
      }
    ]);

    console.log('✅ Data seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
