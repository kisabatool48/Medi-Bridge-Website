import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AlertCircle, Droplet, MapPin, Clock } from "lucide-react";
import { getPriorityColor } from "../utils/helpers";
import { medicineAlerts, bloodAlerts } from "../data/mockData";

export function UrgentNeedsPanel() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-8 h-8 text-red-600" />
        <div>
          <h2 className="text-red-600">Urgent Needs</h2>
          <p className="text-sm text-gray-600">Real-time alerts and critical requirements</p>
        </div>
      </div>

      <Card className="shadow-lg border-l-4 border-l-orange-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            Medicine Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {medicineAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                <div>
                  <p>{alert.medicine}</p>
                  <p className="text-sm text-gray-600">{alert.status}</p>
                </div>
                <Badge className={getPriorityColor(alert.priority)}>{alert.priority}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-l-4 border-l-red-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplet className="w-5 h-5 text-red-600" />
            Blood Requirement Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bloodAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-5 rounded-lg border-2 ${alert.urgency === "Emergency" ? "bg-red-50 border-red-300" : alert.urgency === "Urgent" ? "bg-orange-50 border-orange-300" : "bg-blue-50 border-blue-300"}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${alert.urgency === "Emergency" ? "bg-red-500" : "bg-red-400"} text-white`}>
                      <div className="text-center">
                        <Droplet className="w-6 h-6 mx-auto" />
                        <p className="text-xs mt-1">{alert.bloodGroup}</p>
                      </div>
                    </div>
                    <div>
                      <p className="mb-1">{alert.hospital}</p>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {alert.location} • {alert.distance}
                      </p>
                    </div>
                  </div>
                  <Badge className={getPriorityColor(alert.urgency)}>{alert.urgency}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Droplet className="w-4 h-4" />
                      {alert.units} unit(s) needed
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {alert.timePosted}
                    </span>
                  </div>
                  <Button className={`${alert.urgency === "Emergency" ? "bg-red-600 hover:bg-red-700" : "bg-teal-500 hover:bg-teal-600"}`}>
                    <Droplet className="w-4 h-4 mr-2" />
                    Donate Blood
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Available Donations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { name: "Panadol", expiry: "12/2025", status: "Available", category: "Pantry" },
              { name: "Antibiotics", expiry: "11/2025", status: "Available", category: "Rotary" },
              { name: "Insulin", items: "5 items", status: "Low Stock", category: "6 locations" },
              { name: "Vitamins", items: "8 items", status: "Available", category: "Pantry" }
            ].map((item, idx) => (
              <div key={idx} className="p-4 bg-gradient-to-br from-blue-50 to-teal-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p>{item.name}</p>
                  <Badge className={item.status === "Available" ? "bg-green-500" : "bg-yellow-500"}>{item.status}</Badge>
                </div>
                <p className="text-sm text-gray-600">{item.expiry || item.items}</p>
                <p className="text-xs text-gray-500 mt-2">{item.category}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
