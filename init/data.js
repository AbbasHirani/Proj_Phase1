const sampleListing = [
    {
        title: "Luxury Villa",
        description: "A beautiful villa with a sea view.",
        image:{
            url : "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
            filename : "listingimage"  
        }, 
        price: 500000,
        location: "Los Angeles",
        country: "USA"
    },
    {
        title: "Modern Apartment",
        description: "A cozy modern apartment in the city.",
        image: {
            url : "https://images.pexels.com/photos/259950/pexels-photo-259950.jpeg",
            filename : "listingimage"
        }, 
        price: 250000,
        location: "New York",
        country: "USA"
    },
    {
        title: "Rustic Cottage",
        description: "A charming rustic cottage in the countryside.",
        image: {
            url : "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg",
            filename : "listingimage"
        },
        price: 150000,
        location: "Kent",
        country: "UK"
    },
    {
        title: "Beach House",
        description: "A stunning house by the beach.",
        image:{
            url : "https://images.pexels.com/photos/210617/pexels-photo-210617.jpeg",
            filename : "listingimage"
        },
        price: 600000,
        location: "Miami",
        country: "USA"
    },
    {
        title: "Mountain Cabin",
        description: "A secluded cabin in the mountains.",
        image:{
            url : "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
            filename : "listingimage"
        },
        price: 200000,
        location: "Aspen",
        country: "USA"
    },
    {
        title: "Urban Loft",
        description: "A stylish loft in the heart of the city.",
        image:{
          url: "https://images.pexels.com/photos/37347/office-sitting-room-executive-sitting-room-ceo-sitting-room.jpg",
            filename: "listingimage"  
        },
        price: 300000,
        location: "Chicago",
        country: "USA"
    },
];


module.exports = {data : sampleListing};