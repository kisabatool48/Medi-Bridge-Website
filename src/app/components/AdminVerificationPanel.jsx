import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { CheckCircle, XCircle, Building2, FileCheck, AlertTriangle } from "lucide-react";
import { verifiedMedicines, expiredRejected, bloodBankRequests } from "../data/mockData";

export function AdminVerificationPanel() {
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/medicine/all");
      if (res.data.success) {
        setMedicines(res.data.donations);
      }
    } catch (err) {
      console.error("Failed to fetch medicines", err);
    }
  };

  const handleVerification = async (id, status) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/medicine/verify/${id}`, { status });
      if (res.data.success) {
        alert(`Medicine marked as ${status}`);
        fetchMedicines(); // Refresh list
      }
    } catch (err) {
      console.error("Verification failed", err);
      alert("Failed to update status");
    }
  };

  // Filter lists based on status
  const pendingList = medicines.filter(m => m.status === "pending");
  const verifiedList = medicines.filter(m => m.status === "Approved");
  const rejectedList = medicines.filter(m => m.status === "Rejected" || m.status === "Expired");

  const handleApproveBloodBank = (id, name) => alert(`Approved blood bank: ${name}`);
  const handleRejectBloodBank = (id, name) => alert(`Rejected blood bank: ${name}`);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-500 to-teal-500 text-white border-0 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <FileCheck className="w-8 h-8" />
            <div>
              <h2>System Admin Verification Panel</h2>
              <p className="text-blue-50 opacity-90">Approve and manage submissions</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="pending-medicines" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending-medicines">
            Pending Medicines
            <Badge className="ml-2 bg-yellow-500">{pendingList.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="verified">
            Verified Stock
            <Badge className="ml-2 bg-green-500">{verifiedList.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="expired">
            Expired/Rejected
            <Badge className="ml-2 bg-red-500">{rejectedList.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="blood-banks">Blood Banks</TabsTrigger>
        </TabsList>

        <TabsContent value="pending-medicines">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Pending Medicine Verification</CardTitle>
              <p className="text-sm text-gray-600">Review OCR-extracted data and approve/reject donations</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingList.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No pending items</p>
                ) : (
                  pendingList.map((medicine) => (
                    <div key={medicine._id} className="p-5 rounded-lg border-2 border-yellow-200 bg-yellow-50">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center shadow-md overflow-hidden">
                          {medicine.image ? (
                            <img
                              src={`http://localhost:5000/uploads/processed-${medicine.image}.png`}
                              onError={(e) => { e.target.onerror = null; e.target.src = `http://localhost:5000/uploads/${medicine.image}` }}
                              alt="Medicine"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-4xl">💊</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="mb-1 font-semibold">{medicine.name || "Unknown Medicine"}</p>
                              <p className="text-sm text-gray-600">Expiry: {medicine.expiry || "N/A"}</p>
                            </div>
                            <Badge className="bg-blue-500">OCR Data</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mt-3">
                            <p>Donor: {medicine.donorName}</p>
                            <p>Uploaded: {new Date(medicine.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-3 border-t">
                        <Button
                          onClick={() => handleVerification(medicine._id, "Approved")}
                          className="flex-1 bg-green-500 hover:bg-green-600"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleVerification(medicine._id, "Rejected")}
                          variant="destructive"
                          className="flex-1"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verified">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Verified Medicine Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {verifiedList.map((medicine) => (
                  <div key={medicine._id} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl shadow-sm">💊</div>
                      <div>
                        <p className="mb-1">{medicine.name}</p>
                        <p className="text-sm text-gray-600">EXP: {medicine.expiry} • Donor: {medicine.donorName}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expired">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Expired / Rejected Medicines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {rejectedList.map((medicine) => (
                  <div key={medicine._id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl shadow-sm opacity-50">💊</div>
                      <div>
                        <p className="mb-1 text-gray-700">{medicine.name}</p>
                        <p className="text-sm text-gray-600">EXP: {medicine.expiry} • Donor: {medicine.donorName}</p>
                      </div>
                    </div>
                    <Badge className="bg-red-500">
                      <XCircle className="w-3 h-3 mr-1" />
                      {medicine.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blood-banks">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Blood Bank Verification</CardTitle>
              <p className="text-sm text-gray-600">Verify hospitals and blood banks for platform access</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bloodBankRequests.map((bank) => (
                  <div
                    key={bank.id}
                    className={`p-5 rounded-lg border-2 ${bank.status === "Pending" ? "bg-yellow-50 border-yellow-200" :
                        bank.status === "Approved" ? "bg-green-50 border-green-200" :
                          "bg-red-50 border-red-200"
                      }`}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center text-white">
                        <Building2 className="w-8 h-8" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="mb-1">{bank.hospitalName}</p>
                            <p className="text-sm text-gray-600">License ID: {bank.licenseId}</p>
                          </div>
                          <Badge className={
                            bank.status === "Pending" ? "bg-yellow-500" :
                              bank.status === "Approved" ? "bg-green-500" :
                                "bg-red-500"
                          }>{bank.status}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mt-3">
                          <p>Location: {bank.location}</p>
                          <p>Submitted: {bank.submittedDate}</p>
                          <p className="col-span-2">Contact: {bank.contactEmail}</p>
                        </div>
                      </div>
                    </div>
                    {bank.status === "Pending" && (
                      <div className="flex gap-2 pt-3 border-t">
                        <Button
                          onClick={() => handleApproveBloodBank(bank.id, bank.hospitalName)}
                          className="flex-1 bg-green-500 hover:bg-green-600"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleRejectBloodBank(bank.id, bank.hospitalName)}
                          variant="destructive"
                          className="flex-1"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
