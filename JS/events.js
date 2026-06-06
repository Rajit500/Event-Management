 const events = [
    {
        id: 1,
        title: "Tech Hackathon 2026",
        category: "Technical",
        description: "A 12 hour coding competition for all branches. Form a team of 3 and build something amazing.",
        date: "2026-05-25",
        registrationDeadline: "2026-05-23",
        eventType: "intra",
        venue: "Main Auditorium",
        totalSeats: 100,
        filledSeats: 47,
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=180&fit=crop",
        organizer: "CS Department"
    },
    {
        id: 2,
        title: "Cultural Night 2026",
        category: "Cultural",
        description: "Annual cultural fest with dance, singing and drama performances.",
        date: "2026-05-28",
        registrationDeadline: "2026-05-26",
        eventType: "intra",
        venue: "Open Air Theatre",
        totalSeats: 200,
        filledSeats: 180,
        image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=180&fit=crop",
        organizer: "Cultural Committee"
    },
    {
        id: 3,
        title: "Cricket Tournament",
        category: "Sports",
        description: "Inter branch cricket tournament. Register your team of 11 players.",
        date: "2026-06-02",
        registrationDeadline: "2026-05-30",
        eventType: "intra",
        venue: "College Ground",
        totalSeats: 80,
        filledSeats: 20,
        image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400&h=180&fit=crop",
        organizer: "Sports Committee"
    },
    {
        id: 4,
        title: "Web Dev Workshop",
        category: "Technical",
        description: "Learn HTML CSS and JavaScript from scratch in this one day workshop.",
        date: "2026-06-05",
        registrationDeadline: "2026-06-03",
        eventType: "intra",
        venue: "Computer Lab 1",
        totalSeats: 50,
        filledSeats: 10,
        image: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400&h=180&fit=crop",
        organizer: "CS Department"
    },
    {
        id: 5,
        title: "Annual Sports Day 2026",
        category: "Sports",
        description: "Annual sports day with athletics football and cricket competitions.",
        date: "2026-04-10",
        registrationDeadline: "2026-04-08",
        venue: "College Ground",
        eventType: "inter",  
        totalSeats: 150,
        filledSeats: 150,
        image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=180&fit=crop",
        organizer: "Sports Committee"
    },
    {
        id: 6,
        title: "Science Exhibition 2026",
        category: "Technical",
        description: "Annual science exhibition where students showcase innovative projects.",
        date: "2026-04-05",
        registrationDeadline: "2026-04-03",
        eventType: "inter",  
        venue: "Main Hall",
        totalSeats: 100,
        filledSeats: 100,
        image: "https://images.unsplash.com/photo-1532094349884-543559c9f3e6?w=400&h=180&fit=crop",
        organizer: "Science Department"
    }
];

 function getEvents() {
    const stored = localStorage.getItem('events');
    if (stored) {
        return JSON.parse(stored);
    } else {
        return events;
    }
} 

function getEventById(id) {
    const allEvents = getEvents();
    return allEvents.find(e => e.id === parseInt(id));
}