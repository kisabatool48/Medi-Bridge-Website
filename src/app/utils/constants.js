const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const MEDICINE_CATEGORIES = [
  "Pain Reliever",
  "Antibiotic",
  "Insulin",
  "Vitamin",
  "Other"
];
const PRIORITY_LEVELS = ["Low", "Medium", "High", "Emergency"];
const URGENCY_LEVELS = ["Normal", "Urgent", "Emergency"];
const STATUS_COLORS = {
  Approved: "bg-green-500",
  Pending: "bg-yellow-500",
  Rejected: "bg-red-500",
  Available: "bg-green-500",
  Requested: "bg-blue-500",
  Received: "bg-teal-500",
  Good: "bg-green-500",
  Low: "bg-yellow-500",
  Critical: "bg-red-500"
};
const PRIORITY_COLORS = {
  High: "bg-red-500",
  Medium: "bg-yellow-500",
  Low: "bg-green-500",
  Emergency: "bg-red-600 text-white",
  Urgent: "bg-orange-400 text-white",
  Normal: "bg-blue-500 text-white"
};
const PRIORITY_BADGE_COLORS = {
  High: "bg-red-100 border-red-300 text-red-800",
  Medium: "bg-yellow-100 border-yellow-300 text-yellow-800",
  Low: "bg-green-100 border-green-300 text-green-800"
};
export {
  BLOOD_GROUPS,
  MEDICINE_CATEGORIES,
  PRIORITY_BADGE_COLORS,
  PRIORITY_COLORS,
  PRIORITY_LEVELS,
  STATUS_COLORS,
  URGENCY_LEVELS
};
