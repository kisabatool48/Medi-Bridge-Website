import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import {
  Camera,
  Upload,
  Droplet,
  MapPin,
  Calendar,
  Hospital as HospitalIcon,
  AlertCircle,
  CheckCircle,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { BLOOD_GROUPS, MEDICINE_CATEGORIES } from "../utils/constants";
import {
  getStatusColor,
  getPriorityColor,
  simulateOCR,
  fileToBase64,
} from "../utils/helpers";
import {
  medicineDonations,
  bloodDonations,
  hospitalRequests,
} from "../data/mockData";
import OCRScanner from "./OCRScanner";

function DonorDashboard({ currentUser }) {
  // Accept currentUser prop
  const [showBloodRegistration, setShowBloodRegistration] = useState(false);
  const [activeTab, setActiveTab] = useState("donate");
  const [donations, setDonations] = useState([]);

  // Fetch Real Donations on Load
  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/medicine/all");
      if (res.data.success) {
        setDonations(res.data.donations);
      }
    } catch (err) {
      console.error("Failed to fetch donations", err);
    }
  };

  const [showMedicineUpload, setShowMedicineUpload] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [ocrProcessing, setOcrProcessing] = useState(false);
  const [ocrComplete, setOcrComplete] = useState(false);
  const [medicineFormData, setMedicineFormData] = useState({
    medicineName: "",
    expiryDate: "",
    quantity: "",
    batchNumber: "",
    category: "Tablets",
    condition: "Sealed",
    notes: "",
    image: null,
    // Hidden fields populated from currentUser
    donorName: currentUser?.username || "Anonymous",
    donorId: currentUser?.id || "unknown",
  });
  const [bloodFormData, setBloodFormData] = useState({
    name: "",
    age: "",
    bloodGroup: "",
    city: "",
    contactAvailable: false,
  });

  const handleOcrResult = (text) => {
    console.log("Raw OCR Text:", text);
    const lines = text.split("\n").filter((l) => l.trim().length > 0);
    const upperText = text.toUpperCase();

    // Heuristic 1: Find Expiry Date
    // Supports MM/YY, MM/YYYY, DD/MM/YYYY, DD-MM-YYYY, MMM YYYY (e.g., DEC 2024)
    // Also matched specifically for: EXP: 12/2026, EXP 12/26, etc.
    const expiryRegex =
      /(?:EXP|Expiry|Use Before|Best By|EXF|Exp\.?)\s*[:.]?\s*(\d{2}[-./]\d{2}[-./]\d{4}|\d{2}[-./]\d{4}|\d{2}[-./]\d{2}|[A-Za-z]{3}\s\d{4}|\d{2}\s[A-Za-z]{3}\s\d{4})/i;
    let expiry = "";

    for (const line of lines) {
      const match = line.match(expiryRegex);
      if (match && match[1]) {
        expiry = match[1];
        break;
      }
    }

    // Heuristic 2: Dictionary Match for Medicine Name
    // This effectively "understands" common medicines as requested.
    const COMMON_MEDICINES = [
      "PARACETAMOL",
      "PANADOL",
      "BRUFEN",
      "DISPRIN",
      "CALPOL",
      "AMOXICILLIN",
      "IBUPROFEN",
      "ASPIRIN",
      "CIPROFLOXACIN",
      "METFORMIN",
      "ATORVASTATIN",
      "OMEPRAZOLE",
      "AUGMENTIN",
    ];
    let name = "";

    // Check if any common medicine name exists in the full text
    for (const med of COMMON_MEDICINES) {
      if (upperText.includes(med)) {
        name = med.charAt(0) + med.slice(1).toLowerCase(); // Title Case (e.g., Paracetamol)
        break;
      }
    }

    // Heuristic 3: Fallback Naming Strategy (if not found in dictionary)
    if (!name) {
      const noiseKeywords = [
        "tabs",
        "tablets",
        "mg",
        "g",
        "store",
        "rx",
        "only",
        "keep",
        "reach",
        "children",
        "dosage",
        "batch",
        "exp",
        "expiry",
        "manuf",
        "mfg",
        "price",
        "rs",
        "b.no",
        "lot",
      ];

      for (const line of lines) {
        const lowerLine = line.toLowerCase();
        // Skip if line contains expiry date we just found
        if (expiry && line.includes(expiry)) continue;

        // Skip if line is too short or just numbers
        if (line.length < 3 || /^\d+$/.test(line)) continue;

        // Skip if line contains noise keywords (heuristic)
        if (noiseKeywords.some((keyword) => lowerLine.includes(keyword)))
          continue;

        // If it passes these checks, it's a strong candidate for the brand name
        name = line.substring(0, 50).trim();
        break; // Take the first strong candidate
      }
    }

    // Heuristic 4: Fallback to first line logic if everything else fails
    if (!name && lines.length > 0) {
      // If the first line happens to be the expiry, try the second
      name = lines[0].includes(expiry) && expiry ? lines[1] || "" : lines[0];
    }

    // Heuristic 5: Batch Number Extraction
    // Look for B.No, Batch, Lot + alphanumeric
    const batchRegex = /(?:B\.No\.?|Batch|Lot)\s*[:.]?\s*([A-Z0-9]+)/i;
    let batchNo = "";
    for (const line of lines) {
      const match = line.match(batchRegex);
      if (match && match[1]) {
        batchNo = match[1];
        break;
      }
    }

    // Heuristic 6: Strength Extraction (e.g., 500mg, 10ml)
    const strengthRegex = /(\d+\s*(?:mg|g|ml|%))/i;
    let strength = "";
    for (const line of lines) {
      const match = line.match(strengthRegex);
      if (match && match[1]) {
        strength = match[1];
        break;
      }
    }

    setMedicineFormData((prev) => ({
      ...prev,
      name: name,
      expiry: expiry,
      batchNo: batchNo,
      strength: strength,
    }));
    setOcrComplete(true);
  };

  const resetMedicineForm = () => {
    setShowMedicineUpload(false);
    setUploadedImage(null);
    setOcrComplete(false);
    setOcrProcessing(false);
    setMedicineFormData({
      name: "",
      expiry: "",
      quantity: "",
      category: "",
      manufacturer: "",
      batchNo: "",
      strength: "",
    });
  };
  const handleMedicineUpload = async (e) => {
    e.preventDefault();
    try {
      // Send data to backend
      const response = await axios.post(
        "http://localhost:5000/api/medicine/save",
        medicineFormData
      );

      if (response.data.success) {
        alert("✅ Medicine donation saved successfully to Database!");
        fetchDonations(); // Refresh list
        resetMedicineForm();
      } else {
        alert("❌ Failed to save donation: " + response.data.error);
      }
    } catch (error) {
      console.error("Save Error:", error);
      alert("❌ Error saving donation. Check connection.");
    }
  };
  const handleBloodRegistration = (e) => {
    e.preventDefault();
    alert("Blood donor registration submitted successfully!");
    setShowBloodRegistration(false);
  };
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-500 to-teal-500 text-white border-0">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="mb-2">
                Welcome, {currentUser?.username || "Donor"}
              </h2>
              <p className="text-blue-50 opacity-90">Share & Save Lives</p>
            </div>
            <div className="w-20 h-20 bg-white/20 rounded-lg flex items-center justify-center">
              <Droplet className="w-10 h-10" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-lg border-l-4 border-l-red-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            Hospital Medicine Requests
          </CardTitle>
          <p className="text-sm text-gray-600">Hospitals need your help</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {hospitalRequests.map((request) => (
              <div
                key={request.id}
                className="p-5 rounded-lg border-2 border-orange-200 bg-orange-50"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-500 rounded-lg flex items-center justify-center text-white">
                      <HospitalIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="mb-1">{request.hospital}</p>
                      <p className="text-sm text-gray-600">
                        Needs: {request.medicine} ({request.unitsNeeded} units)
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {request.distance} away
                      </p>
                    </div>
                  </div>
                  <Badge className={getPriorityColor(request.priority)}>
                    {request.priority}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {request.description}
                </p>
                <Button
                  onClick={() =>
                    alert(
                      `Responding to ${request.hospital}'s request for ${request.medicine}`
                    )
                  }
                  className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600"
                >
                  I Can Donate This
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-teal-600" />
              Upload Medicine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              onClick={() => setShowMedicineUpload(true)}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-teal-500 transition-colors cursor-pointer"
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600 mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                OCR enabled - Auto-detect medicine details
              </p>
              <Button
                type="button"
                className="mt-4 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
              >
                <Camera className="w-4 h-4 mr-2" />
                Take Photo
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplet className="w-5 h-5 text-red-600" />
              Blood Donor Registration
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!showBloodRegistration ? (
              <div className="text-center py-8">
                <Droplet className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Register as a blood donor and help save lives
                </p>
                <Button
                  onClick={() => setShowBloodRegistration(true)}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Register as Blood Donor
                </Button>
              </div>
            ) : (
              <form onSubmit={handleBloodRegistration} className="space-y-4">
                <div>
                  <Label htmlFor="donor-name">Full Name</Label>
                  <Input
                    id="donor-name"
                    value={bloodFormData.name}
                    onChange={(e) =>
                      setBloodFormData({
                        ...bloodFormData,
                        name: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="donor-age">Age</Label>
                  <Input
                    id="donor-age"
                    type="number"
                    value={bloodFormData.age}
                    onChange={(e) =>
                      setBloodFormData({ ...bloodFormData, age: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="blood-group">Blood Group</Label>
                  <Select
                    value={bloodFormData.bloodGroup}
                    onValueChange={(value) =>
                      setBloodFormData({ ...bloodFormData, bloodGroup: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      {BLOOD_GROUPS.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="city">City / Location</Label>
                  <Input
                    id="city"
                    value={bloodFormData.city}
                    onChange={(e) =>
                      setBloodFormData({ ...bloodFormData, city: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="contact-toggle">Contact Availability</Label>
                  <Switch
                    id="contact-toggle"
                    checked={bloodFormData.contactAvailable}
                    onCheckedChange={(checked) =>
                      setBloodFormData({
                        ...bloodFormData,
                        contactAvailable: checked,
                      })
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="flex-1 bg-red-500 hover:bg-red-600"
                  >
                    Submit
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowBloodRegistration(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>My Contributions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="mb-4">Donated Medicines</h3>
              <div className="space-y-3">
                {donations.filter((d) => d.donorId === currentUser?.id).length >
                  0 ? (
                  donations
                    .filter((d) => d.donorId === currentUser?.id)
                    .map((medicine) => (
                      <div
                        key={medicine._id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                            💊
                          </div>
                          <div>
                            <p>{medicine.medicineName}</p>
                            <p className="text-sm text-gray-500">
                              EXP: {medicine.expiryDate}
                            </p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(medicine.status)}>
                          {medicine.status}
                        </Badge>
                      </div>
                    ))
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    No donations found for you.
                  </p>
                )}
              </div>
            </div>
            <div>
              <h3 className="mb-4">Blood Donations History</h3>
              <div className="space-y-3">
                {bloodDonations.map((donation) => (
                  <div
                    key={donation.id}
                    className="flex items-center justify-between p-4 bg-red-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center text-white">
                        <Droplet className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="flex items-center gap-2">
                          <span>{donation.bloodGroup}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm text-gray-600">
                            {donation.units} unit(s)
                          </span>
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          <MapPin className="w-3 h-3" />
                          {donation.hospital}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {donation.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Dialog open={showMedicineUpload} onOpenChange={setShowMedicineUpload}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-teal-600" />
              Upload Medicine with OCR
            </DialogTitle>
            <DialogDescription>
              Take or upload a photo of your medicine. Our OCR will automatically
              detect the details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {!ocrComplete ? (
              <OCRScanner onScanComplete={handleOcrResult} />
            ) : (
              <div className="space-y-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    setOcrComplete(false);
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Scan Again
                </Button>
                <form
                  onSubmit={handleMedicineUpload}
                  className="space-y-4 pt-4 border-t"
                >
                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-teal-600" />
                      <p className="text-teal-800">OCR Extraction Complete</p>
                    </div>
                    <p className="text-sm text-teal-700">
                      Please verify and confirm the details below
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="medicine-name">
                        Medicine Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="medicine-name"
                        value={medicineFormData.name}
                        onChange={(e) =>
                          setMedicineFormData({
                            ...medicineFormData,
                            name: e.target.value,
                          })
                        }
                        required
                        placeholder="e.g., Panadol"
                      />
                    </div>
                    <div>
                      <Label htmlFor="strength">Strength</Label>
                      <Input
                        id="strength"
                        value={medicineFormData.strength || ""}
                        onChange={(e) =>
                          setMedicineFormData({
                            ...medicineFormData,
                            strength: e.target.value,
                          })
                        }
                        placeholder="e.g., 500mg"
                      />
                    </div>
                    <div>
                      <Label htmlFor="expiry-date">
                        Expiry Date <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="expiry-date"
                        value={medicineFormData.expiry}
                        onChange={(e) =>
                          setMedicineFormData({
                            ...medicineFormData,
                            expiry: e.target.value,
                          })
                        }
                        required
                        placeholder="MM/YYYY or DD/MM/YYYY"
                      />
                    </div>
                    <div>
                      <Label htmlFor="batch-no">Batch No</Label>
                      <Input
                        id="batch-no"
                        value={medicineFormData.batchNo || ""}
                        onChange={(e) =>
                          setMedicineFormData({
                            ...medicineFormData,
                            batchNo: e.target.value,
                          })
                        }
                        placeholder="e.g., A45X"
                      />
                    </div>
                    <div>
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        value={medicineFormData.quantity}
                        onChange={(e) =>
                          setMedicineFormData({
                            ...medicineFormData,
                            quantity: e.target.value,
                          })
                        }
                        placeholder="e.g., 100 tablets"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={medicineFormData.category}
                        onValueChange={(value) =>
                          setMedicineFormData({
                            ...medicineFormData,
                            category: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {MEDICINE_CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="manufacturer">Manufacturer</Label>
                      <Input
                        id="manufacturer"
                        value={medicineFormData.manufacturer}
                        onChange={(e) =>
                          setMedicineFormData({
                            ...medicineFormData,
                            manufacturer: e.target.value,
                          })
                        }
                        placeholder="e.g., GlaxoSmithKline"
                      />
                    </div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-yellow-800 mb-1">
                          Expiry Date Confirmation
                        </p>
                        <p className="text-sm text-yellow-700">
                          Please confirm the expiry date is:{" "}
                          <strong>{medicineFormData.expiry}</strong>
                        </p>
                        <p className="text-xs text-yellow-600 mt-1">
                          Medicines past their expiry date cannot be donated.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Confirm & Submit
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetMedicineForm}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export { DonorDashboard };
