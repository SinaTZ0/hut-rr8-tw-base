/*===== Consultation Options =====*/

export const genderValues = ["unknown", "male", "female"] as const;
export const maritalStatusValues = ["unknown", "single", "married"] as const;
export const facultyValues = ["unknown", "electrical-computer", "technical-engineering", "basic-sciences"] as const;
export const majorValues = [
  "unknown",
  "computer",
  "electrical",
  "industrial",
  "polymer",
  "civil",
  "mechanical",
  "engineering-physics",
  "organic-chemistry",
] as const;

export const genderLabels: Record<(typeof genderValues)[number], string> = {
  unknown: "نامعین",
  male: "مرد",
  female: "زن",
};
export const maritalStatusLabels: Record<(typeof maritalStatusValues)[number], string> = {
  unknown: "نامعین",
  single: "مجرد",
  married: "متأهل",
};
export const facultyLabels: Record<(typeof facultyValues)[number], string> = {
  unknown: "نامعین",
  "electrical-computer": "برق و کامپیوتر",
  "technical-engineering": "فنی و مهندسی",
  "basic-sciences": "علوم پایه",
};
export const majorLabels: Record<(typeof majorValues)[number], string> = {
  unknown: "نامعین",
  computer: "کامپیوتر",
  electrical: "برق",
  industrial: "صنایع",
  polymer: "پلیمر",
  civil: "عمران",
  mechanical: "مکانیک",
  "engineering-physics": "فیزیک مهندسی",
  "organic-chemistry": "شیمی آلی",
};

export const initialConsultationStatus = "pending" as const;
