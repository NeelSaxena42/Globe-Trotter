export const mockUser = {
  id: 'u1',
  name: 'Alex Traveler',
  email: 'alex@example.com',
  avatar: 'https://i.pravatar.cc/150?u=alex',
};

export const mockCities = [
  {
    id: 'c1',
    name: 'Paris',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    description: 'The City of Light.',
    costIndex: '$$$',
  },
  {
    id: 'c2',
    name: 'Tokyo',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    description: 'A mix of traditional and modern.',
    costIndex: '$$',
  },
  {
    id: 'c3',
    name: 'New York',
    country: 'USA',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
    description: 'The city that never sleeps.',
    costIndex: '$$$$',
  },
];

export const mockActivities = [
  {
    id: 'a1',
    name: 'Eiffel Tower Tour',
    type: 'Sightseeing',
    cost: 30,
    duration: 2, // hours
    cityId: 'c1',
  },
  {
    id: 'a2',
    name: 'Louvre Museum',
    type: 'Museum',
    cost: 20,
    duration: 3,
    cityId: 'c1',
  },
  {
    id: 'a3',
    name: 'Sushi Making Class',
    type: 'Food',
    cost: 80,
    duration: 2,
    cityId: 'c2',
  },
];

export const mockTrips = [
  {
    id: 't1',
    name: 'European Adventure',
    startDate: '2026-01-01',
    endDate: '2026-01-15',
    description: 'Two weeks in France and Italy.',
    coverImage: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80',
    cities: [
      {
        id: 's1',
        cityId: 'c1',
        arrivalDate: '2026-01-01',
        departureDate: '2026-01-05',
        activities: ['a1', 'a2'],
      }
    ]
  }
];
