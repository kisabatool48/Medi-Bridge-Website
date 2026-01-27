import React, { useState } from "react";
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
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Droplet,
  MapPin,
  Phone,
  Clock,
  Building2,
  AlertCircle,
} from "lucide-react";
import { BLOOD_GROUPS, URGENCY_LEVELS } from "../utils/constants";
import { getStatusColor } from "../utils/helpers";
import { bloodDonors, bloodStock } from "../data/mockData";

function BloodBankPortal() {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestForm, setRequestForm] = useState({
    bloodGroup: "",
    units: "",
    urgency: "Normal",
  });

  const handleRequestBlood = (e) => {
    e.preventDefault();
    alert("Blood request submitted successfully!");
    setShowRequestForm(false);
    setRequestForm({ bloodGroup: "", units: "", urgency: "Normal" });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-500 to-teal-500 text-white border-0 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-6 h-6" />
                <h2>Blood Bank Portal</h2>
              </div>
              <p className="text-blue-50 opacity-90">
                Verified Medical Facility
              </p>
            </div>
            <Badge className="bg-white text-blue-600 text-sm px-3 py-1">
              ✓ Verified
            </Badge>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-lg">
        <CardContent className="pt-6">
          {!showRequestForm ? (
            <div className="text-center">
              <Button
                onClick={() => setShowRequestForm(true)}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                size="lg"
              >
                <AlertCircle className="w-5 h-5 mr-2" />
                Request Blood
              </Button>
            </div>
          ) : (
            <form onSubmit={handleRequestBlood} className="space-y-4">
              <h3 className="text-center mb-4">Blood Request Form</h3>
              <div>
                <Label htmlFor="blood-group-request">Blood Group</Label>
                <Select
                  value={requestForm.bloodGroup}
                  onValueChange={(value) =>
                    setRequestForm({ ...requestForm, bloodGroup: value })
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
                <Label htmlFor="units">Required Units</Label>
                <Input
                  id="units"
                  type="number"
                  value={requestForm.units}
                  onChange={(e) =>
                    setRequestForm({ ...requestForm, units: e.target.value })
                  }
                  required
                  min="1"
                />
              </div>
              <div>
                <Label htmlFor="urgency">Urgency Level</Label>
                <Select
                  value={requestForm.urgency}
                  onValueChange={(value) =>
                    setRequestForm({ ...requestForm, urgency: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {URGENCY_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="flex-1 bg-red-500 hover:bg-red-600"
                >
                  Submit Request
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowRequestForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="inventory">Blood Inventory</TabsTrigger>
          <TabsTrigger value="donors">Available Donors</TabsTrigger>
        </TabsList>
        <TabsContent value="inventory">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Blood Stock Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                {bloodStock.map((stock) => (
                  <div
                    key={stock.bloodGroup}
                    className="p-5 rounded-lg border-2 border-gray-200 hover:border-teal-300 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center text-white">
                        <Droplet className="w-6 h-6" />
                      </div>
                      <Badge className={getStatusColor(stock.status)}>
                        {stock.status}
                      </Badge>
                    </div>
                    <p className="mb-1">{stock.bloodGroup}</p>
                    <p className="text-sm text-gray-600 mb-2">
                      {stock.units} units
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Exp: {stock.expiryDate}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="donors">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Nearby Donors (O+ Blood Group)</CardTitle>
              <p className="text-sm text-gray-600">
                Only verified blood banks can view donor information
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bloodDonors.map((donor) => (
                  <div
                    key={donor.id}
                    className={`p-5 rounded-lg border-2 ${donor.available
                        ? "bg-green-50 border-green-200"
                        : "bg-gray-50 border-gray-200"
                      }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white">
                          {donor.name.charAt(0)}
                        </div>
                        <div>
                          <p className="mb-1">{donor.name}</p>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Droplet className="w-4 h-4 text-red-500" />
                              {donor.bloodGroup}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {donor.city} • {donor.distance}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge
                        className={
                          donor.available ? "bg-green-500" : "bg-gray-500"
                        }
                      >
                        {donor.available ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="text-sm text-gray-600 space-y-1">
                        <p className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {donor.phone}
                        </p>
                        <p className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Last donation: {donor.lastDonation}
                        </p>
                      </div>
                      {donor.available && (
                        <Button className="bg-teal-500 hover:bg-teal-600">
                          Contact Donor
                        </Button>
                      )}
                    </div>
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

export { BloodBankPortal };
