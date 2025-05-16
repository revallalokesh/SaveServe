import { Hostels } from "@/app/components/Hostels";
import { WorldMap } from "@/app/components/ui/world-map";
import { motion } from "framer-motion";

export default function HostelsPage() {
  return (
    <div className="relative min-h-screen">
      {/* Transparent WorldMap as background */}
      <div className="absolute inset-0 -z-10 opacity-40 pointer-events-none">
        <WorldMap
          dots={[
            { start: { lat: 64.2008, lng: -149.4937 }, end: { lat: 34.0522, lng: -118.2437 } },
            { start: { lat: 64.2008, lng: -149.4937 }, end: { lat: -15.7975, lng: -47.8919 } },
            { start: { lat: -15.7975, lng: -47.8919 }, end: { lat: 38.7223, lng: -9.1393 } },
            { start: { lat: 51.5074, lng: -0.1278 }, end: { lat: 28.6139, lng: 77.209 } },
            { start: { lat: 28.6139, lng: 77.209 }, end: { lat: 43.1332, lng: 131.9113 } },
            { start: { lat: 28.6139, lng: 77.209 }, end: { lat: -1.2921, lng: 36.8219 } },
            // Additional routes for richer background
            { start: { lat: 40.7128, lng: -74.0060 }, end: { lat: 35.6895, lng: 139.6917 } }, // NYC to Tokyo
            { start: { lat: 35.6895, lng: 139.6917 }, end: { lat: -33.8688, lng: 151.2093 } }, // Tokyo to Sydney
            { start: { lat: -33.8688, lng: 151.2093 }, end: { lat: 55.7558, lng: 37.6173 } }, // Sydney to Moscow
            { start: { lat: 55.7558, lng: 37.6173 }, end: { lat: 48.8566, lng: 2.3522 } }, // Moscow to Paris
            { start: { lat: 48.8566, lng: 2.3522 }, end: { lat: 19.4326, lng: -99.1332 } }, // Paris to Mexico City
            { start: { lat: 19.4326, lng: -99.1332 }, end: { lat: 1.3521, lng: 103.8198 } }, // Mexico City to Singapore
            { start: { lat: 1.3521, lng: 103.8198 }, end: { lat: 37.7749, lng: -122.4194 } }, // Singapore to San Francisco
            { start: { lat: 37.7749, lng: -122.4194 }, end: { lat: 51.5074, lng: -0.1278 } }, // San Francisco to London
          ]}
        />
      </div>
      <div className="relative z-10">
        <div className="py-20">
          <div className="max-w-7xl mx-auto text-center">
          </div>
          <div className="max-w-7xl mx-auto">
            <WorldMap
              dots={[
                { start: { lat: 64.2008, lng: -149.4937 }, end: { lat: 34.0522, lng: -118.2437 } },
                { start: { lat: 64.2008, lng: -149.4937 }, end: { lat: -15.7975, lng: -47.8919 } },
                { start: { lat: -15.7975, lng: -47.8919 }, end: { lat: 38.7223, lng: -9.1393 } },
                { start: { lat: 51.5074, lng: -0.1278 }, end: { lat: 28.6139, lng: 77.209 } },
                { start: { lat: 28.6139, lng: 77.209 }, end: { lat: 43.1332, lng: 131.9113 } },
                { start: { lat: 28.6139, lng: 77.209 }, end: { lat: -1.2921, lng: 36.8219 } },
              ]}
            />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4">
          <Hostels />
        </div>
      </div>
    </div>
  );
} 