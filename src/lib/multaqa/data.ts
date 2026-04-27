import deskWindow from "@/assets/desk-window.jpg";
import deskFocus from "@/assets/desk-focus.jpg";
import deskHot from "@/assets/desk-hot.jpg";
import deskStanding from "@/assets/desk-standing.jpg";
import roomFocus from "@/assets/room-focus.jpg";
import roomMeeting from "@/assets/room-meeting.jpg";
import roomPod from "@/assets/room-pod.jpg";

export type Location = "Nablus" | "Ramallah";
export type Zone = "Deep Work" | "Calls Allowed";
export type DeskType = "Flex Desk" | "Hot Desk" | "Dedicated Desk";
export type Status = "Available" | "Reserved" | "Maintenance";
export type WifiTier = "Fast" | "Good" | "Basic";

export interface Desk {
  id: string;
  name: string;
  location: Location;
  type: DeskType;
  zone: Zone;
  status: Status;
  pricePerHour: number;
  priceHalfDay: number;
  priceFullDay: number;
  image: string;
  wifi: WifiTier;
  amenities: { label: string; available: boolean }[];
  reviews: { author: string; date: string; rating: number; comment: string }[];
}

export type RoomType = "Private Office" | "Meeting Room" | "Phone Booth";

export interface Room {
  id: string;
  name: string;
  location: Location;
  type: RoomType;
  capacity: number;
  status: Status;
  pricePerHour: number;
  priceHalfDay: number;
  image: string;
  adminOnly?: boolean;
  equipment: { label: string; available: boolean }[];
  reviews: { author: string; date: string; rating: number; comment: string }[];
}

const sharedReviews = [
  { author: "Khalid", date: "Oct 2025", rating: 5, comment: "Great WiFi here, stayed all day. The chair is comfortable and the lighting is perfect." },
  { author: "Tala", date: "Sep 2025", rating: 4, comment: "Quiet zone really is quiet — got a ton of focused work done." },
  { author: "Omar", date: "Sep 2025", rating: 5, comment: "Love the view from this seat. Coffee nearby. Will book again." },
];

const deskAmenities = (mods: Partial<Record<string, boolean>> = {}) => [
  { label: "Power outlets", available: mods.power ?? true },
  { label: "Window seat", available: mods.window ?? false },
  { label: "External monitor", available: mods.monitor ?? false },
  { label: "Standing desk", available: mods.standing ?? false },
  { label: "Phone locker", available: mods.locker ?? false },
];

export const desks: Desk[] = [
  { id: "n-a1", name: "Desk A-1", location: "Nablus", type: "Flex Desk", zone: "Deep Work", status: "Available", pricePerHour: 15, priceHalfDay: 50, priceFullDay: 85, image: deskFocus, wifi: "Fast", amenities: deskAmenities({ monitor: true }), reviews: sharedReviews },
  { id: "n-a2", name: "Desk A-2", location: "Nablus", type: "Flex Desk", zone: "Deep Work", status: "Reserved", pricePerHour: 15, priceHalfDay: 50, priceFullDay: 85, image: deskFocus, wifi: "Fast", amenities: deskAmenities(), reviews: sharedReviews },
  { id: "n-a3", name: "Window Seat A-3", location: "Nablus", type: "Dedicated Desk", zone: "Deep Work", status: "Available", pricePerHour: 18, priceHalfDay: 60, priceFullDay: 100, image: deskWindow, wifi: "Fast", amenities: deskAmenities({ window: true, monitor: true }), reviews: sharedReviews },
  { id: "n-a4", name: "Desk A-4", location: "Nablus", type: "Hot Desk", zone: "Calls Allowed", status: "Available", pricePerHour: 15, priceHalfDay: 50, priceFullDay: 85, image: deskHot, wifi: "Good", amenities: deskAmenities({ locker: true }), reviews: sharedReviews },
  { id: "n-a5", name: "Desk A-5", location: "Nablus", type: "Hot Desk", zone: "Calls Allowed", status: "Available", pricePerHour: 15, priceHalfDay: 50, priceFullDay: 85, image: deskHot, wifi: "Good", amenities: deskAmenities(), reviews: sharedReviews },
  { id: "n-a6", name: "Standing Desk A-6", location: "Nablus", type: "Flex Desk", zone: "Calls Allowed", status: "Reserved", pricePerHour: 18, priceHalfDay: 60, priceFullDay: 100, image: deskStanding, wifi: "Fast", amenities: deskAmenities({ standing: true, monitor: true }), reviews: sharedReviews },
  { id: "n-a7", name: "Window Seat A-7", location: "Nablus", type: "Dedicated Desk", zone: "Deep Work", status: "Available", pricePerHour: 18, priceHalfDay: 60, priceFullDay: 100, image: deskWindow, wifi: "Fast", amenities: deskAmenities({ window: true }), reviews: sharedReviews },
  { id: "n-a8", name: "Desk A-8", location: "Nablus", type: "Hot Desk", zone: "Calls Allowed", status: "Available", pricePerHour: 15, priceHalfDay: 50, priceFullDay: 85, image: deskHot, wifi: "Good", amenities: deskAmenities(), reviews: sharedReviews },
  { id: "r-b1", name: "Desk B-1", location: "Ramallah", type: "Flex Desk", zone: "Deep Work", status: "Available", pricePerHour: 15, priceHalfDay: 50, priceFullDay: 85, image: deskFocus, wifi: "Fast", amenities: deskAmenities({ monitor: true }), reviews: sharedReviews },
  { id: "r-b2", name: "Window Seat B-2", location: "Ramallah", type: "Dedicated Desk", zone: "Deep Work", status: "Available", pricePerHour: 18, priceHalfDay: 60, priceFullDay: 100, image: deskWindow, wifi: "Fast", amenities: deskAmenities({ window: true, monitor: true }), reviews: sharedReviews },
  { id: "r-b3", name: "Desk B-3", location: "Ramallah", type: "Hot Desk", zone: "Calls Allowed", status: "Reserved", pricePerHour: 15, priceHalfDay: 50, priceFullDay: 85, image: deskHot, wifi: "Good", amenities: deskAmenities(), reviews: sharedReviews },
  { id: "r-b4", name: "Desk B-4", location: "Ramallah", type: "Flex Desk", zone: "Calls Allowed", status: "Available", pricePerHour: 15, priceHalfDay: 50, priceFullDay: 85, image: deskHot, wifi: "Good", amenities: deskAmenities({ locker: true }), reviews: sharedReviews },
  { id: "r-b5", name: "Standing Desk B-5", location: "Ramallah", type: "Flex Desk", zone: "Calls Allowed", status: "Available", pricePerHour: 18, priceHalfDay: 60, priceFullDay: 100, image: deskStanding, wifi: "Fast", amenities: deskAmenities({ standing: true }), reviews: sharedReviews },
  { id: "r-b6", name: "Desk B-6", location: "Ramallah", type: "Dedicated Desk", zone: "Deep Work", status: "Available", pricePerHour: 18, priceHalfDay: 60, priceFullDay: 100, image: deskFocus, wifi: "Fast", amenities: deskAmenities({ monitor: true, window: true }), reviews: sharedReviews },
];

const roomEquip = (mods: Partial<Record<string, boolean>> = {}) => [
  { label: "Whiteboard", available: mods.whiteboard ?? true },
  { label: '65" Display', available: mods.display ?? true },
  { label: "HDMI / USB-C", available: mods.hdmi ?? true },
  { label: "Video conferencing", available: mods.vc ?? true },
  { label: "Air conditioning", available: mods.ac ?? true },
  { label: "Soundproofed", available: mods.sound ?? true },
];

export const rooms: Room[] = [
  { id: "n-focus", name: "The Focus Room", location: "Nablus", type: "Meeting Room", capacity: 4, status: "Available", pricePerHour: 40, priceHalfDay: 140, image: roomFocus, equipment: roomEquip(), reviews: sharedReviews },
  { id: "n-mtg1", name: "Meeting Room 1", location: "Nablus", type: "Meeting Room", capacity: 8, status: "Available", pricePerHour: 60, priceHalfDay: 200, image: roomMeeting, equipment: roomEquip(), reviews: sharedReviews },
  { id: "n-pod", name: "The Pod", location: "Nablus", type: "Phone Booth", capacity: 2, status: "Reserved", pricePerHour: 25, priceHalfDay: 80, image: roomPod, equipment: roomEquip({ whiteboard: false, display: false }), reviews: sharedReviews },
  { id: "n-exec", name: "Executive Suite", location: "Nablus", type: "Private Office", capacity: 6, status: "Available", pricePerHour: 80, priceHalfDay: 280, image: roomMeeting, adminOnly: true, equipment: roomEquip(), reviews: sharedReviews },
  { id: "r-mtg2", name: "Meeting Room 2", location: "Ramallah", type: "Meeting Room", capacity: 6, status: "Available", pricePerHour: 50, priceHalfDay: 170, image: roomFocus, equipment: roomEquip(), reviews: sharedReviews },
  { id: "r-pod", name: "Quiet Pod", location: "Ramallah", type: "Phone Booth", capacity: 1, status: "Available", pricePerHour: 25, priceHalfDay: 80, image: roomPod, equipment: roomEquip({ whiteboard: false, display: false }), reviews: sharedReviews },
];

export const locationAddress: Record<Location, string> = {
  Nablus: "Building Al-Maseef, Floor 3, Nablus City Center",
  Ramallah: "Al-Bireh Commercial Center, Floor 2, Ramallah",
};

export interface Booking {
  id: string;
  ref: string;
  itemId: string;
  itemName: string;
  itemType: "desk" | "room";
  location: Location;
  date: string;
  timeSlot: string;
  duration: string;
  total: number;
  paymentStatus: "Paid" | "Cash Due";
  paymentDeadline: string;
  bookingStatus: "Upcoming" | "Past" | "Cancelled";
  user: string;
  email: string;
}

export const bookings: Booking[] = [
  { id: "1", ref: "MQR-20491", itemId: "n-a3", itemName: "Window Seat A-3", itemType: "desk", location: "Nablus", date: "May 02, 2026", timeSlot: "09:00 – 13:00", duration: "Half-day", total: 50, paymentStatus: "Cash Due", paymentDeadline: "May 05, 2026", bookingStatus: "Upcoming", user: "Khalid Mansour", email: "khalid@example.com" },
  { id: "2", ref: "MQR-20488", itemId: "n-focus", itemName: "The Focus Room", itemType: "room", location: "Nablus", date: "Apr 28, 2026", timeSlot: "14:00 – 16:00", duration: "2 hours", total: 80, paymentStatus: "Paid", paymentDeadline: "—", bookingStatus: "Upcoming", user: "Tala Habash", email: "tala@example.com" },
  { id: "3", ref: "MQR-20475", itemId: "r-b2", itemName: "Window Seat B-2", itemType: "desk", location: "Ramallah", date: "Apr 22, 2026", timeSlot: "09:00 – 17:00", duration: "Full day", total: 100, paymentStatus: "Paid", paymentDeadline: "—", bookingStatus: "Past", user: "Omar Khoury", email: "omar@example.com" },
  { id: "4", ref: "MQR-20462", itemId: "n-a4", itemName: "Desk A-4", itemType: "desk", location: "Nablus", date: "Apr 18, 2026", timeSlot: "10:00 – 11:00", duration: "1 hour", total: 15, paymentStatus: "Cash Due", paymentDeadline: "Apr 21, 2026", bookingStatus: "Upcoming", user: "Sara Najjar", email: "sara@example.com" },
  { id: "5", ref: "MQR-20459", itemId: "n-a8", itemName: "Desk A-8", itemType: "desk", location: "Nablus", date: "Apr 15, 2026", timeSlot: "09:00 – 13:00", duration: "Half-day", total: 50, paymentStatus: "Cash Due", paymentDeadline: "Apr 18, 2026", bookingStatus: "Upcoming", user: "Rami Saleh", email: "rami@example.com" },
];

export const todaysMembers: { name: string; role: string; location: Location; anonymous?: boolean }[] = [
  { name: "Rami", role: "Software Developer", location: "Nablus" },
  { name: "Tala", role: "UX Designer", location: "Nablus" },
  { name: "Khalid", role: "Architect", location: "Nablus" },
  { name: "Anonymous Member", role: "Freelancer", location: "Nablus", anonymous: true },
  { name: "Sara", role: "Marketing Consultant", location: "Nablus" },
  { name: "Omar", role: "Data Analyst", location: "Nablus" },
  { name: "Yusuf", role: "Civil Engineer", location: "Ramallah" },
  { name: "Lana", role: "Graphic Designer", location: "Ramallah" },
  { name: "Anonymous Member", role: "Student", location: "Ramallah", anonymous: true },
];

export function getDesk(id: string) {
  return desks.find((d) => d.id === id);
}
export function getRoom(id: string) {
  return rooms.find((r) => r.id === id);
}