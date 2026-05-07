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
    id: "metropole",
    name: "Sofitel Legend Metropole Hanoi",
    tier: "5★ Heritage Partner",
    address: "15 Ngo Quyen, Hoan Kiem, Hanoi",
    mapUrl: "https://maps.google.com/?q=Sofitel+Legend+Metropole+Hanoi",
    website: "https://www.sofitel-legend.com/hanoi",
    perks: [
      "20% off Best Available Rate for ASF 2026 delegates",
      "Complimentary breakfast for two & airport transfer",
      "Late check-out until 16:00 (subject to availability)",
    ],
    contact: {
      name: "Reservation Desk",
      email: "h1555-re@sofitel.com",
      phone: "+84 24 3826 6919",
    },
    images: [h11, h12, h13],
    description:
      "An iconic French colonial landmark in the heart of Hanoi's diplomatic quarter, the Metropole has hosted heads of state and global leaders for over a century.",
  },
  {
    id: "lotte",
    name: "Lotte Hotel Hanoi",
    tier: "5★ Official Partner",
    address: "54 Lieu Giai, Ba Dinh, Hanoi",
    mapUrl: "https://maps.google.com/?q=Lotte+Hotel+Hanoi",
    website: "https://www.lottehotel.com/hanoi-hotel",
    perks: [
      "15% off room rates with code ASF2026",
      "Executive lounge access for delegate bookings",
      "Complimentary shuttle to ASF venue",
    ],
    contact: {
      name: "MICE Sales",
      email: "reservation.hanoi@lotte.net",
      phone: "+84 24 3333 1000",
    },
    images: [h21, h22, h23],
    description:
      "A modern landmark on the West Lake skyline with rooftop infinity pool, Michelin-recommended dining and direct connection to Lotte Center.",
  },
  {
    id: "haian",
    name: "Hai An Boutique Hotel",
    tier: "Boutique Partner",
    address: "12 Hang Bun, Ba Dinh, Hanoi",
    mapUrl: "https://maps.google.com/?q=Hai+An+Boutique+Hotel+Hanoi",
    website: "https://haianhotel.vn",
    perks: [
      "10% off Best Available Rate for ASF 2026 delegates",
      "Complimentary daily breakfast",
      "Free shuttle to ASF venue (twice daily)",
    ],
    contact: {
      name: "Booking Office",
      email: "booking@haianhotel.vn",
      phone: "+84 24 3927 1888",
    },
    images: [h31, h32],
    description:
      "A stylish boutique stay close to Hanoi's old quarter, offering personalised service and a calm contemporary aesthetic for business travellers.",
  },
];

export function getHotel(id: string) {
  return hotels.find((h) => h.id === id);
}
