import h11 from "@/assets/hotels/h1-1.jpg";
import h12 from "@/assets/hotels/h1-2.jpg";
import h13 from "@/assets/hotels/h1-3.jpg";
import h21 from "@/assets/hotels/h2-1.jpg";
import h22 from "@/assets/hotels/h2-2.jpg";
import h23 from "@/assets/hotels/h2-3.jpg";
import h31 from "@/assets/hotels/h3-1.jpg";
import h32 from "@/assets/hotels/h3-2.jpg";

export type Hotel = {
  id: string;
  name: string;
  tier: string;
  address: string;
  mapUrl: string;
  website: string;
  perks: string[];
  contact: { name: string; email: string; phone: string };
  images: string[];
  description: string;
};

export const hotels: Hotel[] = [
  {
    id: "melia",
    name: "Meliá Hanoi",
    tier: "5★ Host Hotel — Main Venue",
    address: "44B Ly Thuong Kiet, Hoan Kiem, Hanoi",
    mapUrl: "https://maps.google.com/?q=Melia+Hanoi+Hotel",
    website: "https://www.melia.com/en/hotels/vietnam/hanoi/melia-hanoi",
    perks: [
      "Special ASF 2026 delegate rate (room + breakfast)",
      "On-site conference venue — zero transit time",
      "Complimentary upgrade subject to availability",
    ],
    contact: {
      name: "MICE Reservation",
      email: "melia.hanoi@melia.com",
      phone: "+84 24 3934 3343",
    },
    images: [h11, h12, h13],
    description:
      "Meliá Hanoi is the official host hotel and main venue of ASF 2026. Located in the heart of Hanoi's CBD, the hotel features the city's largest pillar-free ballroom and is a regular host of regional financial summits.",
  },
  {
    id: "ic-landmark72",
    name: "InterContinental Hanoi Landmark 72",
    tier: "5★ Official Partner",
    address: "Keangnam Hanoi Landmark Tower, Pham Hung, Nam Tu Liem, Hanoi",
    mapUrl: "https://maps.google.com/?q=InterContinental+Hanoi+Landmark+72",
    website: "https://hanoi.intercontinental.com",
    perks: [
      "15% off Best Available Rate with code ASF2026",
      "Club InterContinental lounge access on premium bookings",
      "Daily shuttle to ASF venue",
    ],
    contact: {
      name: "Reservation Desk",
      email: "reservations.hanoi@ihg.com",
      phone: "+84 24 3698 8888",
    },
    images: [h21, h22, h23],
    description:
      "Asia's highest hotel, occupying floors 62–72 of the iconic Landmark 72 tower with sweeping skyline views, an indoor infinity pool and award-winning dining.",
  },
  {
    id: "sheraton",
    name: "Sheraton Hanoi Hotel",
    tier: "5★ Official Partner",
    address: "K5 Nghi Tam, 11 Xuan Dieu, Tay Ho, Hanoi",
    mapUrl: "https://maps.google.com/?q=Sheraton+Hanoi+Hotel",
    website: "https://www.marriott.com/hotels/travel/hansi-sheraton-hanoi-hotel",
    perks: [
      "10% off Best Available Rate for ASF 2026 delegates",
      "Complimentary daily breakfast at Oven D'or",
      "Late check-out until 16:00 (subject to availability)",
    ],
    contact: {
      name: "Booking Office",
      email: "sheraton.hanoi@sheraton.com",
      phone: "+84 24 3719 9000",
    },
    images: [h31, h32],
    description:
      "A tranquil West Lake retreat just minutes from Hanoi's diplomatic and business district, offering lakeside dining, expansive gardens and a relaxed conference atmosphere.",
  },
];

export function getHotel(id: string) {
  return hotels.find((h) => h.id === id);
}
