const medicineDonations = [
  { id: "1", name: "Panadol", expiry: "12/12/2025", status: "Pending", uploadDate: "2024-12-20" },
  { id: "2", name: "Insulin", expiry: "11/2025", status: "Approved", uploadDate: "2024-12-15" },
  { id: "3", name: "Antibiotics", expiry: "11/2025", status: "Pending", uploadDate: "2024-12-18" },
  { id: "4", name: "Insulin", expiry: "12/2025", status: "Approved", uploadDate: "2024-12-10" }
];
const bloodDonations = [
  { id: "1", date: "2024-11-15", bloodGroup: "O+", hospital: "City General Hospital", units: 1 },
  { id: "2", date: "2024-09-20", bloodGroup: "O+", hospital: "St. Mary Medical Center", units: 1 }
];
const hospitalRequests = [
  {
    id: "1",
    hospital: "City General Hospital",
    medicine: "Insulin",
    unitsNeeded: 15,
    priority: "High",
    description: "Urgent need for diabetes patients",
    distance: "2.5 km"
  },
  {
    id: "2",
    hospital: "St. Mary Medical Center",
    medicine: "Antibiotics",
    unitsNeeded: 30,
    priority: "Medium",
    description: "Regular stock replenishment needed",
    distance: "5.2 km"
  }
];
const inventoryItems = [
  { id: "1", medicine: "Insulin", currentStock: 5, minRequired: 20, priority: "High", unit: "units" },
  { id: "2", medicine: "Antibiotics", currentStock: 15, minRequired: 30, priority: "Medium", unit: "units" },
  { id: "3", medicine: "Pain Relief", currentStock: 30, minRequired: 40, priority: "Low", unit: "units" }
];
const donatedMedicines = [
  {
    id: "1",
    medicineName: "Paracetamol 500mg",
    donorName: "John D.",
    units: 100,
    expiry: "2026-03-15",
    status: "Available",
    uploadDate: "2024-12-20"
  },
  {
    id: "2",
    medicineName: "Insulin",
    donorName: "Sarah A.",
    units: 25,
    expiry: "2025-06-20",
    status: "Available",
    uploadDate: "2024-12-21"
  },
  {
    id: "3",
    medicineName: "Antibiotics",
    donorName: "Ahmed K.",
    units: 50,
    expiry: "2025-08-10",
    status: "Requested",
    uploadDate: "2024-12-19"
  },
  {
    id: "4",
    medicineName: "Vitamins",
    donorName: "Fatima M.",
    units: 200,
    expiry: "2026-01-15",
    status: "Received",
    uploadDate: "2024-12-18"
  }
];
const medicineRequests = [
  {
    id: "1",
    medicine: "Insulin",
    unitsNeeded: 15,
    priority: "High",
    description: "Urgent need for diabetes patients",
    createdDate: "2024-12-22",
    responses: 3
  },
  {
    id: "2",
    medicine: "Blood Pressure Medicine",
    unitsNeeded: 20,
    priority: "Medium",
    description: "Regular stock replenishment needed",
    createdDate: "2024-12-21",
    responses: 1
  }
];
const medicineAlerts = [
  { id: "1", medicine: "Insulin", status: "Low supply", priority: "High" },
  { id: "2", medicine: "Antibiotics", status: "Shortage", priority: "Emergency" }
];
const bloodAlerts = [
  {
    id: "1",
    bloodGroup: "O+",
    units: 3,
    location: "Downtown",
    hospital: "City General Hospital",
    distance: "2.3 km",
    urgency: "Emergency",
    timePosted: "15 mins ago"
  },
  {
    id: "2",
    bloodGroup: "AB-",
    units: 2,
    location: "Medical District",
    hospital: "St. Mary Medical Center",
    distance: "5.1 km",
    urgency: "Urgent",
    timePosted: "1 hour ago"
  },
  {
    id: "3",
    bloodGroup: "B+",
    units: 1,
    location: "North Side",
    hospital: "Regional Blood Bank",
    distance: "8.7 km",
    urgency: "Normal",
    timePosted: "3 hours ago"
  }
];
const bloodDonors = [
  {
    id: "1",
    name: "Ahmed Khan",
    bloodGroup: "O+",
    city: "Downtown",
    distance: "1.2 km",
    available: true,
    lastDonation: "2024-09-15",
    phone: "+92 300 1234567"
  },
  {
    id: "2",
    name: "Sarah Ali",
    bloodGroup: "O+",
    city: "Garden Town",
    distance: "3.5 km",
    available: true,
    lastDonation: "2024-08-20",
    phone: "+92 301 2345678"
  },
  {
    id: "3",
    name: "Hassan Raza",
    bloodGroup: "O+",
    city: "Model Town",
    distance: "5.8 km",
    available: false,
    lastDonation: "2024-11-30",
    phone: "+92 302 3456789"
  }
];
const bloodStock = [
  { bloodGroup: "A+", units: 15, status: "Good", expiryDate: "2025-02-15" },
  { bloodGroup: "A-", units: 3, status: "Low", expiryDate: "2025-01-28" },
  { bloodGroup: "B+", units: 12, status: "Good", expiryDate: "2025-02-20" },
  { bloodGroup: "B-", units: 2, status: "Critical", expiryDate: "2025-01-15" },
  { bloodGroup: "AB+", units: 8, status: "Good", expiryDate: "2025-02-10" },
  { bloodGroup: "AB-", units: 1, status: "Critical", expiryDate: "2025-01-20" },
  { bloodGroup: "O+", units: 20, status: "Good", expiryDate: "2025-02-25" },
  { bloodGroup: "O-", units: 4, status: "Low", expiryDate: "2025-01-30" }
];
const pendingMedicines = [
  {
    id: "1",
    medicineName: "Cozan Medicine",
    expiry: "11/2026",
    donorName: "Ahmed Khan",
    uploadDate: "2024-12-22",
    ocrConfidence: 95
  },
  {
    id: "2",
    medicineName: "ORS Sacramonto",
    expiry: "Best Before 05/2026",
    donorName: "Sarah Ali",
    uploadDate: "2024-12-21",
    ocrConfidence: 88
  }
];
const verifiedMedicines = [
  {
    id: "3",
    medicineName: "Insulin",
    expiry: "03/2025",
    donorName: "Hassan Raza",
    uploadDate: "2024-12-20",
    ocrConfidence: 97
  },
  {
    id: "4",
    medicineName: "Panadol",
    expiry: "12/2025",
    donorName: "Fatima Ahmed",
    uploadDate: "2024-12-19",
    ocrConfidence: 92
  }
];
const expiredRejected = [
  {
    id: "5",
    medicineName: "Antibiotics",
    expiry: "10/2024",
    donorName: "Ali Hassan",
    uploadDate: "2024-12-18",
    ocrConfidence: 90
  }
];
const bloodBankRequests = [
  {
    id: "1",
    hospitalName: "City General Hospital",
    licenseId: "LIC-2024-5678",
    location: "Downtown Medical District",
    contactEmail: "admin@citygeneralhospital.com",
    status: "Pending",
    submittedDate: "2024-12-20"
  },
  {
    id: "2",
    hospitalName: "Green Valley Blood Center",
    licenseId: "LIC-2024-9012",
    location: "Green Valley, Sector 5",
    contactEmail: "contact@greenvalleyblood.com",
    status: "Approved",
    submittedDate: "2024-12-15"
  },
  {
    id: "3",
    hospitalName: "Metro Health Services",
    licenseId: "LIC-2024-3456",
    location: "Metro Center",
    contactEmail: "info@metrohealth.com",
    status: "Rejected",
    submittedDate: "2024-12-18"
  }
];
export {
  bloodAlerts,
  bloodBankRequests,
  bloodDonations,
  bloodDonors,
  bloodStock,
  donatedMedicines,
  expiredRejected,
  hospitalRequests,
  inventoryItems,
  medicineAlerts,
  medicineDonations,
  medicineRequests,
  pendingMedicines,
  verifiedMedicines
};
