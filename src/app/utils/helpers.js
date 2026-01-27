import { STATUS_COLORS, PRIORITY_COLORS, PRIORITY_BADGE_COLORS } from "./constants";
const getStatusColor = (status) => STATUS_COLORS[status] || "bg-gray-500";
const getPriorityColor = (priority) => PRIORITY_COLORS[priority] || "bg-gray-500 text-white";
const getPriorityBadgeColor = (priority) => PRIORITY_BADGE_COLORS[priority] || "bg-gray-100 border-gray-300 text-gray-800";
const simulateOCR = (callback) => {
  setTimeout(() => {
    callback({
      name: "Panadol",
      expiry: "12/12/2025",
      quantity: "100",
      category: "Pain Reliever",
      manufacturer: "GlaxoSmithKline"
    });
  }, 2e3);
};
const fileToBase64 = (file, callback) => {
  const reader = new FileReader();
  reader.onloadend = () => callback(reader.result);
  reader.readAsDataURL(file);
};
export {
  fileToBase64,
  getPriorityBadgeColor,
  getPriorityColor,
  getStatusColor,
  simulateOCR
};
