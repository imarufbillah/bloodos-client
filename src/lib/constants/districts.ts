/**
 * District constants for BloodOS
 * Mirrors bloodos-server/src/types/shared.ts District enum
 * DO NOT modify independently - keep in sync with server
 */

export const District = {
  // Dhaka Division
  DHAKA: "Dhaka",
  FARIDPUR: "Faridpur",
  GAZIPUR: "Gazipur",
  GOPALGANJ: "Gopalganj",
  KISHOREGANJ: "Kishoreganj",
  MADARIPUR: "Madaripur",
  MANIKGANJ: "Manikganj",
  MUNSHIGANJ: "Munshiganj",
  NARAYANGANJ: "Narayanganj",
  NARSINGDI: "Narsingdi",
  RAJBARI: "Rajbari",
  SHARIATPUR: "Shariatpur",
  TANGAIL: "Tangail",

  // Chittagong Division
  CHITTAGONG: "Chittagong",
  BANDARBAN: "Bandarban",
  BRAHMANBARIA: "Brahmanbaria",
  CHANDPUR: "Chandpur",
  COMILLA: "Comilla",
  COXS_BAZAR: "Cox's Bazar",
  FENI: "Feni",
  KHAGRACHARI: "Khagrachari",
  LAKSHMIPUR: "Lakshmipur",
  NOAKHALI: "Noakhali",
  RANGAMATI: "Rangamati",

  // Rajshahi Division
  RAJSHAHI: "Rajshahi",
  BOGRA: "Bogra",
  JOYPURHAT: "Joypurhat",
  NAOGAON: "Naogaon",
  NATORE: "Natore",
  CHAPAINAWABGANJ: "Chapainawabganj",
  PABNA: "Pabna",
  SIRAJGANJ: "Sirajganj",

  // Khulna Division
  KHULNA: "Khulna",
  BAGERHAT: "Bagerhat",
  CHUADANGA: "Chuadanga",
  JESSORE: "Jessore",
  JHENAIDAH: "Jhenaidah",
  KUSHTIA: "Kushtia",
  MAGURA: "Magura",
  MEHERPUR: "Meherpur",
  NARAIL: "Narail",
  SATKHIRA: "Satkhira",

  // Barisal Division
  BARISAL: "Barisal",
  BARGUNA: "Barguna",
  BHOLA: "Bhola",
  JHALOKATI: "Jhalokati",
  PATUAKHALI: "Patuakhali",
  PIROJPUR: "Pirojpur",

  // Sylhet Division
  SYLHET: "Sylhet",
  HABIGANJ: "Habiganj",
  MOULVIBAZAR: "Moulvibazar",
  SUNAMGANJ: "Sunamganj",

  // Rangpur Division
  RANGPUR: "Rangpur",
  DINAJPUR: "Dinajpur",
  GAIBANDHA: "Gaibandha",
  KURIGRAM: "Kurigram",
  LALMONIRHAT: "Lalmonirhat",
  NILPHAMARI: "Nilphamari",
  PANCHAGARH: "Panchagarh",
  THAKURGAON: "Thakurgaon",

  // Mymensingh Division
  MYMENSINGH: "Mymensingh",
  JAMALPUR: "Jamalpur",
  NETROKONA: "Netrokona",
  SHERPUR: "Sherpur",
} as const;

export type District = (typeof District)[keyof typeof District];

export const DISTRICTS = Object.values(District);

// Grouped by division for UI purposes
export const DISTRICTS_BY_DIVISION = {
  Dhaka: [
    "Dhaka",
    "Faridpur",
    "Gazipur",
    "Gopalganj",
    "Kishoreganj",
    "Madaripur",
    "Manikganj",
    "Munshiganj",
    "Narayanganj",
    "Narsingdi",
    "Rajbari",
    "Shariatpur",
    "Tangail",
  ],
  Chittagong: [
    "Chittagong",
    "Bandarban",
    "Brahmanbaria",
    "Chandpur",
    "Comilla",
    "Cox's Bazar",
    "Feni",
    "Khagrachari",
    "Lakshmipur",
    "Noakhali",
    "Rangamati",
  ],
  Rajshahi: [
    "Rajshahi",
    "Bogra",
    "Joypurhat",
    "Naogaon",
    "Natore",
    "Chapainawabganj",
    "Pabna",
    "Sirajganj",
  ],
  Khulna: [
    "Khulna",
    "Bagerhat",
    "Chuadanga",
    "Jessore",
    "Jhenaidah",
    "Kushtia",
    "Magura",
    "Meherpur",
    "Narail",
    "Satkhira",
  ],
  Barisal: ["Barisal", "Barguna", "Bhola", "Jhalokati", "Patuakhali", "Pirojpur"],
  Sylhet: ["Sylhet", "Habiganj", "Moulvibazar", "Sunamganj"],
  Rangpur: [
    "Rangpur",
    "Dinajpur",
    "Gaibandha",
    "Kurigram",
    "Lalmonirhat",
    "Nilphamari",
    "Panchagarh",
    "Thakurgaon",
  ],
  Mymensingh: ["Mymensingh", "Jamalpur", "Netrokona", "Sherpur"],
} as const;
