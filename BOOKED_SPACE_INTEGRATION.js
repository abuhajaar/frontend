/**
 * Example Integration of BookedSpaceCard in Booking Page
 * 
 * This shows how to conditionally render BookedSpaceCard vs SpaceCard
 * based on whether the space is already booked by the user
 */

// Example 1: Simple conditional rendering
{spaces.map((space) => (
  space.isBookedByUser ? (
    <BookedSpaceCard 
      key={space.id}
      space={space}
      bookingTime={space.bookingTime}
    />
  ) : (
    <SpaceCard 
      key={space.id}
      space={space}
      onBook={handleBookSpace}
    />
  )
))}

// Example 2: With user bookings data
const userBookings = [
  { spaceId: 101, bookingTime: '08:00-18:00' },
  { spaceId: 205, bookingTime: '09:00-17:00' },
];

const isSpaceBooked = (spaceId) => {
  return userBookings.some(booking => booking.spaceId === spaceId);
};

const getBookingTime = (spaceId) => {
  const booking = userBookings.find(b => b.spaceId === spaceId);
  return booking?.bookingTime || '08:00-18:00';
};

{spaces.map((space) => {
  const isBooked = isSpaceBooked(space.id);
  
  return isBooked ? (
    <BookedSpaceCard 
      key={space.id}
      space={space}
      bookingTime={getBookingTime(space.id)}
    />
  ) : (
    <SpaceCard 
      key={space.id}
      space={space}
      onBook={handleBookSpace}
    />
  );
})}

// Example 3: With API response
// Assuming API returns spaces with booking status
const fetchSpacesWithBookingStatus = async () => {
  const response = await fetch('/api/spaces');
  const data = await response.json();
  
  // API response format:
  // {
  //   spaces: [
  //     {
  //       id: 101,
  //       name: 'Desk A1',
  //       type: 'Hot Desk',
  //       capacity: 1,
  //       amenities: ['Monitor', 'Power Outlet'],
  //       isBooked: true,
  //       bookingTime: '08:00-18:00'
  //     }
  //   ]
  // }
  
  return data.spaces;
};

// In component
const [spaces, setSpaces] = useState([]);

useEffect(() => {
  fetchSpacesWithBookingStatus().then(setSpaces);
}, []);

{spaces.map((space) => (
  space.isBooked ? (
    <BookedSpaceCard 
      key={space.id}
      space={space}
      bookingTime={space.bookingTime}
    />
  ) : (
    <SpaceCard 
      key={space.id}
      space={space}
      onBook={handleBookSpace}
    />
  )
))}
