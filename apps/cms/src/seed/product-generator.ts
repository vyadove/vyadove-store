/**
 * Product Generator for Gift Experiences
 * Generates 2000-3000 realistic gift experience products
 */

import type { ProductTemplate, SeedProduct } from "./types";
import { getCategoryImages } from "./types";

// Product templates for different categories
const productTemplates: ProductTemplate[] = [
    // Fine Dining
    {
        titleTemplate: [
            "{cuisine} Tasting Menu Experience",
            "Chef's Table {cuisine} Dinner",
            "{adjective} {cuisine} Fine Dining",
            "Exclusive {cuisine} Culinary Journey",
        ],
        descriptions: [
            "An exquisite {courses}-course tasting menu showcasing the finest {cuisine} cuisine. Each dish expertly paired with premium wines by our sommelier.",
            "Indulge in a {courses}-course culinary masterpiece featuring {cuisine} specialties. Experience the art of fine dining with impeccable service.",
            "Savor {courses} beautifully crafted courses of {cuisine} cuisine. A gastronomic journey with wine pairings and chef interactions.",
        ],
        category: "Fine Dining",
        priceRange: [150, 400],
        pricingTier: "luxury",
        variantOptions: [
            {
                option: "Pairing",
                values: [
                    "Wine Pairing",
                    "Premium Pairing",
                    "Non-Alcoholic Pairing",
                ],
            },
        ],
        customFields: [
            {
                name: "Dietary Accommodations",
                valueTemplate:
                    "Vegetarian, vegan, gluten-free, and allergy-friendly options available. Please notify us 48 hours in advance.",
            },
        ],
        additionalInfoTemplates: [
            {
                name: "About this experience",
                valueTemplate:
                    "<p>Immerse yourself in an unforgettable {cuisine} dining experience. Our expert chefs craft each dish with precision and passion, using only the finest seasonal ingredients.</p>",
            },
            {
                name: "What's included",
                valueTemplate:
                    "<p>{courses}-course tasting menu, wine pairings, amuse-bouche, chef interaction, commemorative menu card.</p>",
            },
            {
                name: "Participant guidelines",
                valueTemplate:
                    "<p>Smart casual dress code. Please inform us of dietary restrictions 48 hours in advance. Children under 12 not recommended.</p>",
            },
            {
                name: "How it works",
                valueTemplate:
                    "<p>Present your voucher upon arrival. Experience typically lasts 2.5-3 hours. Reservations required, subject to availability.</p>",
            },
        ],
    },

    // Spa Days
    {
        titleTemplate: [
            "{adjective} Spa Day Package",
            "{duration} Spa Retreat Experience",
            "Ultimate {treatment} Spa Day",
            "{adjective} Wellness Spa Package",
        ],
        descriptions: [
            "Escape to tranquility with our {duration} spa package. Includes {treatment}, access to all facilities, and healthy refreshments.",
            "Rejuvenate with {treatment} treatments and full spa access. Enjoy sauna, steam room, relaxation lounge, and more.",
            "A complete day of pampering featuring {treatment}, spa amenities, and gourmet lunch. Perfect for relaxation and renewal.",
        ],
        category: "Spa Days",
        priceRange: [120, 350],
        pricingTier: "premium",
        variantOptions: [
            {
                option: "Package",
                values: ["Single Person", "Couples Package", "Group (3-4)"],
            },
        ],
        customFields: [
            {
                name: "Included Amenities",
                valueTemplate:
                    "Full spa access, sauna, steam room, relaxation lounge, healthy lunch, herbal teas, plush robes and slippers",
            },
        ],
        additionalInfoTemplates: [
            {
                name: "About this experience",
                valueTemplate:
                    "<p>Escape the everyday with our {duration} spa retreat. Designed for complete relaxation and rejuvenation in a serene environment.</p>",
            },
            {
                name: "What's included",
                valueTemplate:
                    "<p>{treatment} treatment, full spa access, sauna, steam room, relaxation lounge, healthy lunch, herbal teas, plush robes and slippers.</p>",
            },
            {
                name: "Participant guidelines",
                valueTemplate:
                    "<p>Arrive 30 minutes early. Swimwear required for wet areas. Not suitable during pregnancy without medical clearance.</p>",
            },
            {
                name: "How it works",
                valueTemplate:
                    "<p>Present voucher at reception. Receive locker, robe, and slippers. Treatments scheduled at arrival.</p>",
            },
        ],
    },

    // Hot Air Balloon
    {
        titleTemplate: [
            "{time} Hot Air Balloon {location}",
            "{adjective} Balloon Flight Experience",
            "Private Hot Air Balloon {time} Tour",
            "Romantic Balloon Ride over {location}",
        ],
        descriptions: [
            "Soar above {location} during {time}. {duration} flight with champagne toast, pre-flight refreshments, and flight certificate.",
            "Experience the magic of {time} from a hot air balloon. {duration} flight over breathtaking {location} with professional pilot commentary.",
            "Float peacefully above {location} at {time}. Includes {duration} flight, safety briefing, refreshments, and celebratory toast.",
        ],
        category: "Air Adventures",
        priceRange: [200, 350],
        pricingTier: "premium",
        variantOptions: [
            { option: "Day", values: ["Weekday", "Weekend", "Holiday"] },
        ],
        customFields: [
            {
                name: "Important Information",
                valueTemplate:
                    "Weight limit 250 lbs per person. Not recommended for pregnant guests. Weather-dependent with free rescheduling.",
            },
        ],
        additionalInfoTemplates: [
            {
                name: "About this experience",
                valueTemplate:
                    "<p>Drift peacefully above {location} at {time}. A magical airborne adventure with breathtaking views and unforgettable memories.</p>",
            },
            {
                name: "What's included",
                valueTemplate:
                    "<p>{duration} flight, champagne toast, pre-flight refreshments, flight certificate, professional pilot, safety briefing.</p>",
            },
            {
                name: "Participant guidelines",
                valueTemplate:
                    "<p>Max weight 250 lbs. Wear comfortable clothing and closed-toe shoes. Not suitable for pregnant guests. Age 6+.</p>",
            },
            {
                name: "How it works",
                valueTemplate:
                    "<p>Arrive at launch site 1 hour before {time}. Help with inflation optional. Flight duration weather-dependent.</p>",
            },
        ],
    },

    // Cooking Classes
    {
        titleTemplate: [
            "{cuisine} Cooking Masterclass",
            "Hands-On {cuisine} Cooking Class",
            "Professional {cuisine} Workshop",
            "Learn to Cook {cuisine} Cuisine",
        ],
        descriptions: [
            "Master {cuisine} cooking techniques with a professional chef. Hands-on {duration} class preparing a {courses}-course meal.",
            "Learn authentic {cuisine} recipes in this interactive {duration} cooking session. Includes all ingredients, recipes, and eating your creations.",
            "Discover the secrets of {cuisine} cuisine. {duration} hands-on class with professional chef, apron, recipe cards, and wine.",
        ],
        category: "Cooking Classes",
        priceRange: [85, 180],
        pricingTier: "basic",
        variantOptions: [
            {
                option: "Cuisine",
                values: [
                    "Italian",
                    "French",
                    "Japanese",
                    "Thai",
                    "Mexican",
                    "Mediterranean",
                    "Indian",
                ],
            },
        ],
        customFields: [
            {
                name: "Class Details",
                valueTemplate:
                    "3-hour class, maximum 12 participants, all ingredients provided, take-home recipes, complimentary wine",
            },
        ],
        additionalInfoTemplates: [
            {
                name: "About this experience",
                valueTemplate:
                    "<p>Master the art of {cuisine} cooking with expert guidance. From knife skills to plating, learn professional techniques in a fun, interactive setting.</p>",
            },
            {
                name: "What's included",
                valueTemplate:
                    "<p>3-hour hands-on class, all ingredients, apron, recipe cards, wine tasting, eat your creations.</p>",
            },
            {
                name: "Participant guidelines",
                valueTemplate:
                    "<p>No experience required. Wear closed-toe shoes. Inform chef of allergies in advance. Age 14+.</p>",
            },
            {
                name: "How it works",
                valueTemplate:
                    "<p>Arrive 15 minutes early. Follow chef demonstrations, cook your dishes, enjoy meal together at the end.</p>",
            },
        ],
    },

    // Weekend Getaways
    {
        titleTemplate: [
            "{adjective} {location} Weekend Getaway",
            "{duration} {location} Retreat",
            "Romantic {location} Escape",
            "{adjective} {duration} at {location}",
        ],
        descriptions: [
            "Escape to {location} for {duration}. Includes accommodation, breakfast, {amenity}, and stunning views.",
            "Unwind at our {location} retreat. {duration} with {amenity}, daily breakfast, and access to all facilities.",
            "Perfect {location} getaway for {duration}. Features {amenity}, gourmet breakfast, and unforgettable experiences.",
        ],
        category: "Romantic Getaways",
        priceRange: [350, 800],
        pricingTier: "premium",
        participants: { default: 2, min: 2, max: 2 },
        variantOptions: [
            {
                option: "Room Type",
                values: ["Standard Room", "Suite", "Deluxe Suite"],
            },
            { option: "Season", values: ["Off-Peak", "Peak Season"] },
        ],
        customFields: [
            {
                name: "Included Amenities",
                valueTemplate:
                    "Daily breakfast, WiFi, parking, access to fitness center and pool, late checkout available",
            },
        ],
        additionalInfoTemplates: [
            {
                name: "About this experience",
                valueTemplate:
                    "<p>Escape to {location} for a romantic {duration} retreat. Stunning views, exceptional service, and unforgettable moments await.</p>",
            },
            {
                name: "What's included",
                valueTemplate:
                    "<p>{duration} accommodation, daily breakfast, {amenity}, WiFi, parking, fitness center and pool access.</p>",
            },
            {
                name: "Participant guidelines",
                valueTemplate:
                    "<p>Check-in 3pm, check-out 11am. Valid ID required. Pet-friendly rooms available upon request.</p>",
            },
            {
                name: "How it works",
                valueTemplate:
                    "<p>Present voucher at check-in. Request late checkout in advance. Concierge available for local recommendations.</p>",
            },
        ],
    },

    // Wine Tasting
    {
        titleTemplate: [
            "{location} Wine Country Tour",
            "{adjective} Wine Tasting Experience",
            "Private {location} Vineyard Tour",
            "{number} Winery Tasting Tour",
        ],
        descriptions: [
            "Visit {number} award-winning wineries in {location}. Includes guided tastings, vineyard tours, lunch, and transportation.",
            "Explore {location} wine country with visits to {number} wineries. Professional guide, tastings, gourmet lunch, and wine to take home.",
            "Discover {location} vineyards with {number} winery visits. Tastings, behind-the-scenes tours, lunch, and bottle to keep.",
        ],
        category: "Wine & Spirits",
        priceRange: [120, 350],
        pricingTier: "premium",
        variantOptions: [
            {
                option: "Group Size",
                values: [
                    "Small Group (8-12)",
                    "Private Tour (2-6)",
                    "Exclusive Private",
                ],
            },
        ],
        customFields: [
            {
                name: "Tour Details",
                valueTemplate:
                    "6-hour tour with hotel pickup, designated driver, wine education, lunch pairing, must be 21+",
            },
        ],
        additionalInfoTemplates: [
            {
                name: "About this experience",
                valueTemplate:
                    "<p>Journey through {location} wine country visiting {number} award-winning wineries. Expert-led tastings, vineyard tours, and gourmet experiences.</p>",
            },
            {
                name: "What's included",
                valueTemplate:
                    "<p>Visits to {number} wineries, guided tastings, vineyard tours, gourmet lunch, transportation, bottle of wine to take home.</p>",
            },
            {
                name: "Participant guidelines",
                valueTemplate:
                    "<p>Must be 21+ with valid ID. Comfortable walking shoes recommended. Designated driver provided.</p>",
            },
            {
                name: "How it works",
                valueTemplate:
                    "<p>Hotel pickup included. 6-hour experience with expert guide. All tastings and lunch included.</p>",
            },
        ],
    },

    // Massage
    {
        titleTemplate: [
            "{type} Massage Session",
            "{duration} {type} Massage",
            "Therapeutic {type} Massage",
            "{adjective} {type} Massage Experience",
        ],
        descriptions: [
            "{duration} customized {type} massage focusing on your specific needs. Includes consultation with licensed therapist.",
            "Experience relief and relaxation with our {duration} {type} massage. Professional therapist, calming environment, therapeutic benefits.",
            "Unwind with a {duration} {type} massage tailored to you. Licensed massage therapist, soothing music, aromatherapy options.",
        ],
        category: "Massage Therapy",
        priceRange: [70, 180],
        pricingTier: "basic",
        participants: { default: 1, min: 1, max: 1 },
        variantOptions: [
            {
                option: "Duration",
                values: ["60 Minutes", "90 Minutes", "120 Minutes"],
            },
            {
                option: "Type",
                values: [
                    "Swedish",
                    "Deep Tissue",
                    "Hot Stone",
                    "Aromatherapy",
                    "Sports Massage",
                ],
            },
        ],
        customFields: [
            {
                name: "Massage Styles",
                valueTemplate:
                    "Swedish relaxation, deep tissue therapy, hot stone, aromatherapy, sports massage, prenatal massage available",
            },
        ],
        additionalInfoTemplates: [
            {
                name: "About this experience",
                valueTemplate:
                    "<p>Relax and rejuvenate with our {type} massage. Expert therapists customize each session to your needs for ultimate therapeutic benefit.</p>",
            },
            {
                name: "What's included",
                valueTemplate:
                    "<p>{duration} customized massage, consultation, aromatherapy options, relaxation lounge access, herbal tea.</p>",
            },
            {
                name: "Participant guidelines",
                valueTemplate:
                    "<p>Arrive 15 minutes early. Inform therapist of injuries or preferences. Not recommended within 24 hours of alcohol consumption.</p>",
            },
            {
                name: "How it works",
                valueTemplate:
                    "<p>Check in at reception. Complete brief consultation form. Therapist customizes session to your needs.</p>",
            },
        ],
    },

    // Helicopter Tours
    {
        titleTemplate: [
            "{location} Helicopter Tour",
            "Private Helicopter {location} Experience",
            "{duration} Helicopter City Tour",
            "Aerial {location} Helicopter Ride",
        ],
        descriptions: [
            "See {location} from the sky on this {duration} helicopter tour. Professional pilot commentary, photo opportunities, unforgettable views.",
            "Soar above {location} in a private helicopter. {duration} tour with expert pilot, landmark views, and incredible memories.",
            "Experience {location} like never before with a {duration} helicopter flight. Stunning aerial views, pilot narration, photos included.",
        ],
        category: "Air Adventures",
        priceRange: [250, 600],
        pricingTier: "luxury",
        variantOptions: [
            {
                option: "Duration",
                values: [
                    "15 Minutes",
                    "30 Minutes",
                    "45 Minutes",
                    "60 Minutes",
                ],
            },
        ],
        customFields: [
            {
                name: "Flight Details",
                valueTemplate:
                    "Up to 3 passengers, weight limit 600 lbs combined, photo ID required, weather-dependent, photos included",
            },
        ],
        additionalInfoTemplates: [
            {
                name: "About this experience",
                valueTemplate:
                    "<p>Soar above {location} and witness breathtaking aerial views. A thrilling helicopter adventure with stunning photo opportunities.</p>",
            },
            {
                name: "What's included",
                valueTemplate:
                    "<p>{duration} flight, professional pilot, landmark narration, photos, safety briefing, helipad access.</p>",
            },
            {
                name: "Participant guidelines",
                valueTemplate:
                    "<p>Max 3 passengers, combined weight 600 lbs. Photo ID required. Not suitable for those with severe motion sickness.</p>",
            },
            {
                name: "How it works",
                valueTemplate:
                    "<p>Arrive 30 minutes early. Complete safety briefing. Board helicopter and enjoy spectacular views.</p>",
            },
        ],
    },

    // Birthday Celebrations
    {
        titleTemplate: [
            "{adjective} Birthday Celebration Package",
            "Ultimate Birthday Party Experience",
            "{location} Birthday Celebration",
            "Memorable Birthday Party Package",
        ],
        descriptions: [
            "Make their birthday unforgettable! Private {location}, custom menu for {guests} guests, decorations, cake, and entertainment.",
            "Celebrate in style with our {location} birthday package. Accommodates {guests} guests, includes food, drinks, decorations, and memories.",
            "Perfect birthday celebration at {location}. {guests} guests, customized menu, birthday cake, decorations, music, and full service.",
        ],
        category: "Birthday Parties",
        priceRange: [400, 1200],
        pricingTier: "premium",
        variantOptions: [
            {
                option: "Package",
                values: [
                    "Up to 8 Guests",
                    "Up to 12 Guests",
                    "Up to 20 Guests",
                ],
            },
        ],
        customFields: [
            {
                name: "Included Services",
                valueTemplate:
                    "Private venue, custom menu planning, birthday cake, decorations, personalized music playlist, full service staff, cleanup",
            },
        ],
        additionalInfoTemplates: [
            {
                name: "About this experience",
                valueTemplate:
                    "<p>Create unforgettable birthday memories at {location}. Everything is taken care of so you can focus on celebrating!</p>",
            },
            {
                name: "What's included",
                valueTemplate:
                    "<p>Private venue, custom menu, birthday cake, decorations, music, full service staff, complete cleanup.</p>",
            },
            {
                name: "Participant guidelines",
                valueTemplate:
                    "<p>Book 2 weeks in advance. Dietary requirements accepted. Add-ons available: photographer, entertainment, theme packages.</p>",
            },
            {
                name: "How it works",
                valueTemplate:
                    "<p>Consult with event planner. Finalize menu and theme. Arrive to fully prepared venue. Enjoy seamless celebration.</p>",
            },
        ],
    },

    // Yoga & Meditation
    {
        titleTemplate: [
            "{duration} Yoga & Meditation Retreat",
            "{adjective} Yoga Experience",
            "{location} Wellness Retreat",
            "Yoga & Mindfulness {duration}",
        ],
        descriptions: [
            "Reconnect at our {location} retreat. {duration} with daily yoga, meditation, healthy meals, and nature activities.",
            "Find balance with our {duration} yoga retreat at {location}. Includes accommodation, yoga sessions, meditation, wellness meals.",
            "Transform your wellbeing with {duration} at {location}. Daily yoga classes, guided meditation, nutritious meals, nature walks.",
        ],
        category: "Yoga & Meditation",
        priceRange: [250, 600],
        pricingTier: "premium",
        variantOptions: [
            {
                option: "Accommodation",
                values: ["Shared Room", "Private Room", "Premium Suite"],
            },
        ],
        customFields: [
            {
                name: "Retreat Includes",
                valueTemplate:
                    "Accommodation, daily yoga classes, guided meditation, healthy vegetarian meals, nature activities, yoga mat provided",
            },
        ],
        additionalInfoTemplates: [
            {
                name: "About this experience",
                valueTemplate:
                    "<p>Reconnect with yourself at {location}. A transformative {duration} retreat combining yoga, meditation, and holistic wellness.</p>",
            },
            {
                name: "What's included",
                valueTemplate:
                    "<p>Accommodation, daily yoga classes, guided meditation, healthy vegetarian meals, nature walks, yoga mat provided.</p>",
            },
            {
                name: "Participant guidelines",
                valueTemplate:
                    "<p>All levels welcome. Bring comfortable clothing. Digital detox encouraged. Alcohol-free environment.</p>",
            },
            {
                name: "How it works",
                valueTemplate:
                    "<p>Check in, receive schedule. Morning and afternoon sessions. Free time for reflection and nature. All meals included.</p>",
            },
        ],
    },

    // Photography Classes
    {
        titleTemplate: [
            "{type} Photography Workshop",
            "{location} Photography Tour",
            "{adjective} Photography Class",
            "Learn {type} Photography",
        ],
        descriptions: [
            "Master {type} photography in this {duration} workshop. Professional photographer, hands-on practice, editing tips, locations.",
            "Capture {location} beautifully with expert guidance. {duration} {type} photography class, all skill levels welcome.",
            "Improve your {type} photography skills. {duration} class with professional photographer, real-world practice, instant feedback.",
        ],
        category: "Photography",
        priceRange: [60, 150],
        pricingTier: "basic",
        variantOptions: [
            {
                option: "Type",
                values: [
                    "Street",
                    "Landscape",
                    "Portrait",
                    "Night",
                    "Architecture",
                    "Nature",
                ],
            },
        ],
        customFields: [
            {
                name: "Workshop Details",
                valueTemplate:
                    "3-hour session, professional instruction, hands-on practice, composition techniques, editing tips, coffee break, bring your camera",
            },
        ],
        additionalInfoTemplates: [
            {
                name: "About this experience",
                valueTemplate:
                    "<p>Develop your {type} photography skills with expert guidance. Hands-on practice in real-world locations with professional feedback.</p>",
            },
            {
                name: "What's included",
                valueTemplate:
                    "<p>3-hour workshop, professional instruction, location access, editing tips, coffee break, digital guide.</p>",
            },
            {
                name: "Participant guidelines",
                valueTemplate:
                    "<p>Bring your own camera (DSLR/mirrorless recommended). All skill levels welcome. Wear comfortable shoes.</p>",
            },
            {
                name: "How it works",
                valueTemplate:
                    "<p>Meet at designated location. Brief intro and tips. Practice with instructor guidance. Review and feedback.</p>",
            },
        ],
    },

    // Brewery Tours
    {
        titleTemplate: [
            "{location} Craft Brewery Tour",
            "{number} Brewery Tasting Experience",
            "{adjective} Brewery Tour & Tasting",
            "Local Brewery Crawl {location}",
        ],
        descriptions: [
            "Visit {number} craft breweries in {location}. {duration} tour with tastings, brewing education, lunch, and transportation.",
            "Discover {location} craft beer scene. {number} brewery stops, {tastings}+ tastings, behind-the-scenes access, lunch included.",
            "Explore {number} local breweries with expert guide. Beer tastings, brewing process tours, lunch with pairings, transportation provided.",
        ],
        category: "Brewery & Distillery",
        priceRange: [75, 170],
        pricingTier: "basic",
        variantOptions: [
            {
                option: "Tour Type",
                values: [
                    "Group Tour",
                    "Private Group (up to 8)",
                    "Exclusive Private",
                ],
            },
        ],
        customFields: [
            {
                name: "Tour Highlights",
                valueTemplate:
                    "5-hour experience, 3 breweries, 12+ beer tastings, brewing education, lunch with pairings, transportation, souvenir glass",
            },
        ],
        additionalInfoTemplates: [
            {
                name: "About this experience",
                valueTemplate:
                    "<p>Explore {location}'s craft beer scene with visits to {number} breweries. Tastings, behind-the-scenes tours, and expert guidance.</p>",
            },
            {
                name: "What's included",
                valueTemplate:
                    "<p>Visits to {number} breweries, {tastings}+ beer tastings, brewing education, lunch, transportation, souvenir glass.</p>",
            },
            {
                name: "Participant guidelines",
                valueTemplate:
                    "<p>Must be 21+ with valid ID. Wear comfortable shoes. Designated driver provided. Pace yourself!</p>",
            },
            {
                name: "How it works",
                valueTemplate:
                    "<p>Pickup from central location. Visit breweries with expert guide. Enjoy tastings and lunch. Return transportation included.</p>",
            },
        ],
    },

    // Water Sports
    {
        titleTemplate: [
            "{activity} {location} Experience",
            "{adjective} {activity} Adventure",
            "{duration} {activity} Session",
            "Learn {activity} - {location}",
        ],
        descriptions: [
            "Experience {activity} at {location}. {duration} session with equipment, instruction, and safety gear included.",
            "Enjoy {activity} in beautiful {location}. {duration} adventure with all equipment, professional guide, stunning scenery.",
            "Try {activity} at {location}. {duration} experience includes gear, safety briefing, guide, and unforgettable memories.",
        ],
        category: "Water Sports",
        priceRange: [50, 200],
        pricingTier: "basic",
        variantOptions: [
            {
                option: "Activity",
                values: [
                    "Kayaking",
                    "Paddleboarding",
                    "Surfing",
                    "Sailing",
                    "Jet Skiing",
                    "Snorkeling",
                ],
            },
        ],
        customFields: [
            {
                name: "Included Equipment",
                valueTemplate:
                    "All equipment provided, safety gear, life jacket, waterproof bag, instructor guidance, no experience necessary",
            },
        ],
        additionalInfoTemplates: [
            {
                name: "About this experience",
                valueTemplate:
                    "<p>Enjoy {activity} at beautiful {location}. Professional instruction and all equipment included for an unforgettable water adventure.</p>",
            },
            {
                name: "What's included",
                valueTemplate:
                    "<p>All equipment, safety gear, life jacket, waterproof bag, professional instruction, {duration} on the water.</p>",
            },
            {
                name: "Participant guidelines",
                valueTemplate:
                    "<p>Swimming ability required. Wear swimwear and sunscreen. No experience necessary. Age 8+.</p>",
            },
            {
                name: "How it works",
                valueTemplate:
                    "<p>Meet at water sports center. Receive equipment and safety briefing. Enjoy {duration} session with instructor guidance.</p>",
            },
        ],
    },

    // Afternoon Tea
    {
        titleTemplate: [
            "{adjective} Afternoon Tea Service",
            "Traditional Tea Experience",
            "{location} Afternoon Tea",
            "{adjective} Tea & Pastries",
        ],
        descriptions: [
            "Traditional afternoon tea at {location}. Three-tier service with sandwiches, scones, pastries, and premium tea selection.",
            "Elegant tea service featuring finger sandwiches, fresh scones with clotted cream, French pastries, and {teas}+ tea varieties.",
            "Classic afternoon tea experience. Savory sandwiches, warm scones, delicate pastries, and extensive tea menu in refined setting.",
        ],
        category: "Afternoon Tea",
        priceRange: [45, 95],
        pricingTier: "basic",
        variantOptions: [
            {
                option: "Service",
                values: ["Classic Tea", "Champagne Tea", "Royal Tea Service"],
            },
        ],
        customFields: [
            {
                name: "Menu Includes",
                valueTemplate:
                    "Finger sandwiches, freshly baked scones with cream and jam, French pastries, premium tea selection, champagne option available",
            },
        ],
        additionalInfoTemplates: [
            {
                name: "About this experience",
                valueTemplate:
                    "<p>Indulge in a traditional afternoon tea at {location}. Elegant three-tier service with premium teas and freshly made treats.</p>",
            },
            {
                name: "What's included",
                valueTemplate:
                    "<p>Three-tier stand with finger sandwiches, scones with clotted cream and jam, French pastries, {teas}+ tea varieties.</p>",
            },
            {
                name: "Participant guidelines",
                valueTemplate:
                    "<p>Smart casual dress code. Dietary requirements accommodated with 48 hours notice. Duration approximately 2 hours.</p>",
            },
            {
                name: "How it works",
                valueTemplate:
                    "<p>Arrive at scheduled time. Select your tea. Enjoy leisurely service at your own pace. Refills available.</p>",
            },
        ],
    },

    // Zip Lining
    {
        titleTemplate: [
            "{location} Zip Line Canopy Tour",
            "{adjective} Zip Line Adventure",
            "Extreme Zip Line {location}",
            "{number}-Line Canopy Tour",
        ],
        descriptions: [
            "Fly through treetops on {number} zip lines at {location}. {duration} adventure with safety training, equipment, and guides.",
            "Experience {number} thrilling zip lines over {location}. Includes safety gear, professional guides, photos, {duration} tour.",
            "Adrenaline-pumping {number}-line canopy tour. {duration} experience with equipment, training, guides, and stunning views.",
        ],
        category: "Land Adventures",
        priceRange: [90, 200],
        pricingTier: "basic",
        variantOptions: [
            {
                option: "Experience",
                values: ["Standard Tour", "Extreme Tour", "Night Tour"],
            },
        ],
        customFields: [
            {
                name: "Adventure Details",
                valueTemplate:
                    "8 zip lines, 2 suspension bridges, safety training, all equipment, photos included, weight 70-250 lbs, age 10+",
            },
        ],
        additionalInfoTemplates: [
            {
                name: "About this experience",
                valueTemplate:
                    "<p>Soar through the treetops on {number} thrilling zip lines at {location}. An adrenaline-pumping adventure with stunning views.</p>",
            },
            {
                name: "What's included",
                valueTemplate:
                    "<p>{number} zip lines, 2 suspension bridges, all equipment, safety training, professional guides, photos.</p>",
            },
            {
                name: "Participant guidelines",
                valueTemplate:
                    "<p>Weight 70-250 lbs. Age 10+. Closed-toe shoes required. Not suitable during pregnancy or with heart conditions.</p>",
            },
            {
                name: "How it works",
                valueTemplate:
                    "<p>Check in, gear up, complete safety training. Professional guides lead you through course. Photos captured throughout.</p>",
            },
        ],
    },

    // Art Classes
    {
        titleTemplate: [
            "{art} Art Class",
            "{adjective} {art} Workshop",
            "Learn {art} - {duration} Class",
            "{art} Creative Experience",
        ],
        descriptions: [
            "Explore your creativity with {art}. {duration} class with all materials, expert instruction, take home your creation.",
            "Discover {art} in this hands-on {duration} workshop. No experience needed, all supplies included, friendly instruction.",
            "Create your own {art} masterpiece. {duration} beginner-friendly class, materials provided, guided instruction, BYO beverage.",
        ],
        category: "Art Classes",
        priceRange: [40, 100],
        pricingTier: "basic",
        variantOptions: [
            {
                option: "Art Type",
                values: [
                    "Painting",
                    "Pottery",
                    "Watercolor",
                    "Sculpture",
                    "Drawing",
                    "Mixed Media",
                ],
            },
        ],
        customFields: [
            {
                name: "Class Information",
                valueTemplate:
                    "2-3 hour class, all materials provided, expert instruction, beginner-friendly, take home your artwork, refreshments",
            },
        ],
        additionalInfoTemplates: [
            {
                name: "About this experience",
                valueTemplate:
                    "<p>Unleash your creativity in this hands-on {art} class. Expert guidance for all skill levels in a relaxed, inspiring environment.</p>",
            },
            {
                name: "What's included",
                valueTemplate:
                    "<p>All {art} materials, expert instruction, 2-3 hours of guided creation, take home your artwork, refreshments.</p>",
            },
            {
                name: "Participant guidelines",
                valueTemplate:
                    "<p>No experience needed. Wear clothes you don't mind getting messy. BYO beverage welcome. Age 14+.</p>",
            },
            {
                name: "How it works",
                valueTemplate:
                    "<p>Arrive, choose your subject, follow step-by-step instruction. Create at your own pace. Take home your masterpiece!</p>",
            },
        ],
    },
];

// Helper arrays for randomization
const adjectives = [
    "Luxurious",
    "Premium",
    "Ultimate",
    "Exquisite",
    "Exclusive",
    "Romantic",
    "Unforgettable",
    "Spectacular",
    "Deluxe",
    "Signature",
    "Curated",
    "Bespoke",
    "Enchanting",
    "Elegant",
    "Refined",
];

const locations = [
    "the Countryside",
    "Wine Country",
    "the Mountains",
    "the Coast",
    "the City",
    "the Valley",
    "Downtown",
    "Scenic Hills",
    "the Waterfront",
    "Historic District",
    "the Bay Area",
    "Lake Region",
    "Forest Retreat",
    "Coastal Paradise",
];

const durations = [
    "2-night",
    "3-day",
    "weekend",
    "full day",
    "half day",
    "evening",
    "multi-day",
];

const times = ["sunrise", "sunset", "morning", "afternoon", "evening"];

const cuisines = [
    "French",
    "Italian",
    "Japanese",
    "Mediterranean",
    "Asian Fusion",
    "Modern American",
    "Spanish",
    "Thai",
    "Indian",
    "Mexican",
];

// Random selection helper
function random<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Random number in range
function randomInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate price variants
function generatePriceVariants(basePrice: number, numVariants: number = 2) {
    const variants = [];
    for (let i = 0; i < numVariants; i++) {
        const multiplier = 1 + i * 0.3; // 30% increase per variant
        variants.push(Math.round(basePrice * multiplier * 100) / 100);
    }
    return variants;
}

// Fill template string with random values
function fillTemplate(template: string): string {
    return template
        .replace(/\{adjective\}/g, random(adjectives))
        .replace(/\{location\}/g, random(locations))
        .replace(/\{duration\}/g, random(durations))
        .replace(/\{time\}/g, random(times))
        .replace(/\{cuisine\}/g, random(cuisines))
        .replace(/\{courses\}/g, String(randomInRange(3, 12)))
        .replace(/\{number\}/g, String(randomInRange(2, 5)))
        .replace(/\{guests\}/g, String(randomInRange(6, 20)))
        .replace(/\{tastings\}/g, String(randomInRange(8, 15)))
        .replace(/\{teas\}/g, String(randomInRange(15, 30)))
        .replace(
            /\{treatment\}/g,
            random([
                "massage",
                "facial",
                "body scrub",
                "spa treatments",
                "wellness therapies",
            ])
        )
        .replace(
            /\{amenity\}/g,
            random([
                "hot tub",
                "fireplace",
                "spa access",
                "private pool",
                "scenic views",
            ])
        )
        .replace(
            /\{art\}/g,
            random(["Painting", "Pottery", "Watercolor", "Sculpture"])
        )
        .replace(
            /\{type\}/g,
            random(["Swedish", "Deep Tissue", "Hot Stone", "Aromatherapy"])
        )
        .replace(
            /\{activity\}/g,
            random(["Kayaking", "Paddleboarding", "Surfing", "Sailing"])
        );
}

// Generate a single product from template
export function generateProduct(
    template: ProductTemplate,
    index: number
): SeedProduct {
    const title = fillTemplate(random(template.titleTemplate));
    const description = fillTemplate(random(template.descriptions));
    const basePrice = randomInRange(
        template.priceRange[0],
        template.priceRange[1]
    );
    const prices = generatePriceVariants(basePrice, randomInRange(1, 3));

    // Get contextual images for this category
    const categoryImages = getCategoryImages(template.category);

    // Generate additional info (4 required sections)
    const additionalInfo = (template.additionalInfoTemplates || []).map(
        (info) => ({
            name: info.name,
            value: fillTemplate(info.valueTemplate),
        })
    );

    // Generate variants
    const variants = [];
    for (let i = 0; i < prices.length; i++) {
        const variantOptions = template.variantOptions.map((opt) => ({
            option: opt.option,
            value: opt.values[i % opt.values.length],
        }));

        // Use category-specific image (cycle through available images)
        const imageUrl = categoryImages[i % categoryImages.length];

        // Build participants config with defaults
        const participants = {
            default: template.participants?.default ?? 1,
            min: template.participants?.min ?? 1,
            max: template.participants?.max ?? 20,
        };

        variants.push({
            vid: `var-${index}-${i}`,
            sku: `SKU-${Date.now()}-${index}-${i}`,
            imageUrl,
            price: {
                amount: prices[i],
                currency: "USD",
            },
            originalPrice: null,
            available: true,
            pricingTier: template.pricingTier,
            options: variantOptions,
            gallery: [],
            participants,
            additionalInfo,
        });
    }

    // Generate custom fields (value is plain text, not JSON - RichTextEditor stores as text)
    const customFields = template.customFields.map((field) => ({
        name: field.name,
        value: fillTemplate(field.valueTemplate),
    }));

    // Generate validity (80% have expiration, 20% lifetime)
    let validity: string | undefined;
    if (Math.random() > 0.2) {
        // Random expiration 3-24 months from now
        const monthsAhead = randomInRange(3, 24);
        const expirationDate = new Date();
        expirationDate.setMonth(expirationDate.getMonth() + monthsAhead);
        validity = expirationDate.toISOString().split("T")[0]; // YYYY-MM-DD
    }

    return {
        pid: `prod-${Date.now()}-${index}`,
        title,
        currency: "USD",
        visible: true,
        salesChannels: [],
        description,
        category: template.category,
        handle: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        variants,
        customFields,
        validity,
    };
}

// Generate all products
export function generateProducts(count: number = 2500): SeedProduct[] {
    const products: SeedProduct[] = [];
    console.log(`🏭 Generating ${count} products...`);

    for (let i = 0; i < count; i++) {
        const template = random(productTemplates);
        const product = generateProduct(template, i);
        products.push(product);

        if ((i + 1) % 100 === 0) {
            console.log(`  Generated ${i + 1}/${count} products...`);
        }
    }

    console.log(`✅ Generated ${products.length} products!`);
    return products;
}
