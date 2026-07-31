import buildings from "../data/buildings.json";
import type { Building } from "../types";

const KNOWLEDGE_BASE: Record<string, { answer: string; location?: string }> = {
  library: {
    answer:
      "The Central Library is located near the Administrative Block. It has over 50,000 books and is open from 8:00 AM to 8:00 PM.",
    location: "Library",
  },
  canteen: {
    answer:
      "The campus canteen is located near the academic blocks. It serves a variety of food options and is open from 7:30 AM to 7:00 PM.",
    location: "Canteen",
  },
  washroom: {
    answer:
      "Washrooms are available in every major building including the Library, all department blocks, and the Administrative Block.",
  },
  restroom: {
    answer:
      "Restrooms are available in every major building including the Library, all department blocks, and the Administrative Block.",
  },
  toilet: {
    answer:
      "Toilets are available in every major building including the Library, all department blocks, and the Administrative Block.",
  },
  "bus stop": {
    answer:
      "The main bus stop is located at the Main Gate. Buses arrive every 15-20 minutes during peak hours.",
    location: "Bus Stop",
  },
  "admin block": {
    answer:
      "The Administrative Block houses the Principal office, Finance, and Admissions. It is located near the Main Gate.",
    location: "Administrative Block",
  },
  parking: {
    answer:
      "Parking is available near the Main Gate and behind the Administrative Block. Two-wheeler and four-wheeler spaces are available.",
    location: "Parking",
  },
  hostel: {
    answer:
      "We have separate Boys Hostel and Girls Hostel on campus. Both are located near the sports complex.",
  },
  medical: {
    answer:
      "The Medical Center is located near the hostels. A doctor is available from 9:00 AM to 5:00 PM on weekdays.",
    location: "Medical Center",
  },
  auditorium: {
    answer:
      "The Auditorium is a large venue for events and seminars, located centrally on campus near the Library.",
    location: "Auditorium",
  },
  playground: {
    answer:
      "The Playground is located behind the hostels. It has facilities for cricket, football, and athletics.",
    location: "Playground",
  },
  "nearest canteen": {
    answer:
      "The nearest canteen is near the CSE Block, about 100m away. Another canteen is near the Main Gate.",
    location: "Canteen",
  },
};

function findBestMatch(query: string): { answer: string; location?: string } | null {
  const q = query.toLowerCase().trim();

  for (const [key, value] of Object.entries(KNOWLEDGE_BASE)) {
    if (q.includes(key)) {
      return value;
    }
  }

  if (q.includes("where is") || q.includes("how to reach") || q.includes("locate")) {
    const target = q
      .replace(/where is/i, "")
      .replace(/how to reach/i, "")
      .replace(/locate/i, "")
      .trim();

    const building = buildings.find((b: Building) =>
      b.name.toLowerCase().includes(target)
    );

    if (building) {
      return {
        answer: `${building.name} is located at the campus center. ${building.description}`,
        location: building.name,
      };
    }
  }

  if (q.includes("nearest")) {
    const target = q.replace(/nearest/i, "").trim();
    const building = buildings.find((b: Building) =>
      b.name.toLowerCase().includes(target)
    );

    if (building) {
      return {
        answer: `The nearest ${target} is ${building.name}, located at coordinates ${building.lat.toFixed(4)}, ${building.lng.toFixed(4)}.`,
        location: building.name,
      };
    }
  }

  return null;
}

export async function askCampusAI(query: string): Promise<{
  answer: string;
  suggestedLocation?: string;
}> {
  await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 800));

  const match = findBestMatch(query);

  if (match) {
    return { answer: match.answer, suggestedLocation: match.location };
  }

  return {
    answer:
      "I'm not sure about that. Try asking about the Library, Canteen, Bus Stop, Admin Block, Parking, Hostel, Medical Center, Auditorium, Playground, or nearest washroom.",
  };
}
