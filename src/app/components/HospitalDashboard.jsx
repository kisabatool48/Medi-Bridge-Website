import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Building2, AlertCircle, Package, Clock, CheckCircle, PlusCircle } from "lucide-react";
import { getPriorityBadgeColor, getPriorityColor, getStatusColor } from "../utils/helpers";
import { inventoryItems, medicineRequests } from "../data/mockData";

export function HospitalDashboard() {
  const [availableMedicines, setAvailableMedicines] = useState([]);

  useEffect(() => {
    fetchAvailableMedicines();
  }, []);

  const fetchAvailableMedicines = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/medicine/all");
      if (res.data.success) {
        // Filter only approved medicines coming from the Admin
        const approved = res.data.donations.filter(m => m.status === "Approved");
        setAvailableMedicines(approved);
      }
    } catch (err) {
      console.error("Failed to fetch available medicines", err);
    }
  };

  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestForm, setRequestForm] = useState({
    medicine: "",
    units: "",
    priority: "Medium",
    description: ""
  });

  const handleCreateRequest = (e) => {
    e.preventDefault();
    alert(`Alert sent to donors: ${requestForm.medicine} - ${requestForm.units} units needed (${requestForm.priority} priority)`);
    setShowRequestForm(false);
    setRequestForm({ medicine: "", units: "", priority: "Medium", description: "" });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-teal-500 to-blue-500 text-white border-0 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-8 h-8" />
                <h2>Welcome, City General Hospital</h2>
              </div>
              <p className="text-teal-50 opacity-90">Access donated medicines and manage your inventory</p>
            </div>
            <Badge className="bg-white text-teal-600 text-sm px-3 py-1">✓ Verified Hospital</Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-l-4 border-l-red-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              Inventory Shortage Alerts
            </CardTitle>
            <Button
              onClick={() => setShowRequestForm(true)}
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Create Alert
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {inventoryItems.map((item) => (
              <div key={item.id} className={`p-5 rounded-lg border-2 ${getPriorityBadgeColor(item.priority)}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="mb-1">{item.medicine}</p>
                    <p className="text-sm opacity-80">Current Stock: {item.currentStock} {item.unit}</p>
                  </div>
                  <Badge className={getPriorityColor(item.priority)}>{item.priority}</Badge>
                </div>
                <div className="mt-3 pt-3 border-t border-current/20">
                  <p className="text-xs opacity-70">Min Required: {item.minRequired} {item.unit}</p>
                  <p className="text-xs opacity-70 mt-1">Shortage: {item.minRequired - item.currentStock} {item.unit}</p>
                </div>
              </div>
            ))}
          </div>

          {showRequestForm && (
            <div className="p-5 bg-gray-50 rounded-lg border-2 border-gray-200">
              <h3 className="mb-4">Create Medicine Request Alert</h3>
              <form onSubmit={handleCreateRequest} className="space-y-4">
                <div>
                  <Label htmlFor="medicine-name">Medicine Name</Label>
                  <Input
                    id="medicine-name"
                    value={requestForm.medicine}
                    onChange={(e) => setRequestForm({ ...requestForm, medicine: e.target.value })}
                    placeholder="e.g., Insulin"
                    required
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="units-needed">Units Needed</Label>
                    <Input
                      id="units-needed"
                      type="number"
                      value={requestForm.units}
                      onChange={(e) => setRequestForm({ ...requestForm, units: e.target.value })}
                      placeholder="e.g., 50"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="priority-level">Priority Level</Label>
                    <Select
                      value={requestForm.priority}
                      onValueChange={(value) => setRequestForm({ ...requestForm, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["High", "Medium", "Low"].map((p) => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description / Notes</Label>
                  <Textarea
                    id="description"
                    value={requestForm.description}
                    onChange={(e) => setRequestForm({ ...requestForm, description: e.target.value })}
                    placeholder="Describe why this medicine is needed..."
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1 bg-red-500 hover:bg-red-600">Send Alert to Donors</Button>
                  <Button type="button" variant="outline" onClick={() => setShowRequestForm(false)}>Cancel</Button>
                </div>
              </form>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            My Medicine Requests
          </CardTitle>
          <p className="text-sm text-gray-600">Alerts sent to donors</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {medicineRequests.map((request) => (
              <div key={request.id} className="p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="mb-1">{request.medicine}</p>
                    <p className="text-sm text-gray-600">{request.unitsNeeded} units needed • {request.responses} donor responses</p>
                  </div>
                  <Badge className={getPriorityColor(request.priority)}>{request.priority}</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{request.description}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  Created: {request.createdDate}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-l-4 border-l-teal-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-teal-600" />
            Available Donated Medicines
          </CardTitle>
          <p className="text-sm text-gray-600">Medicines available from verified donors</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {availableMedicines.length === 0 ? (
              <div className="text-center text-gray-500 py-4">No approved medicines available yet.</div>
            ) : (
              availableMedicines.map((medicine) => (
                <div key={medicine._id} className="p-5 rounded-lg border-2 bg-white hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-teal-100 rounded-lg flex items-center justify-center text-3xl overflow-hidden">
                        {medicine.image ? (
                          <img
                            src={`http://localhost:5000/uploads/processed-${medicine.image}.png`}
                            onError={(e) => { e.target.onerror = null; e.target.src = `http://localhost:5000/uploads/${medicine.image}` }}
                            alt="Medicine"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          "💊"
                        )}
                      </div>
                      <div>
                        <p className="mb-1 font-semibold">{medicine.name || "Medicine"}</p>
                        <p className="text-sm text-gray-600">Donated by {medicine.donorName} • {medicine.quantity || "N/A"}</p>
                        <p className="text-xs text-gray-500 mt-1">Expires: {medicine.expiry || "N/A"}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500">Verified</Badge>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t">
                    <p className="text-xs text-gray-500">Uploaded: {new Date(medicine.createdAt).toLocaleDateString()}</p>
                    <Button
                      onClick={() => alert(`Request sent for ${medicine.name || "Medicine"}. Donor will be notified.`)}
                      className="bg-teal-500 hover:bg-teal-600"
                    >
                      Request Medicine
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Received Donations Record
          </CardTitle>
          <p className="text-sm text-gray-600">Track all medicines received from donors</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {availableMedicines.filter((m) => m.status === "Received").map((medicine) => (
              <div key={medicine._id} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="mb-1">{medicine.name}</p>
                    <p className="text-sm text-gray-600">{medicine.quantity} from {medicine.donorName}</p>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <p>Received</p>
                  <p className="text-xs">{new Date(medicine.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
