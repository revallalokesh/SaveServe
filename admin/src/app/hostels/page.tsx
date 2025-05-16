import { WorldMap } from "@/app/components/ui/world-map";
import { Hostels } from "@/app/components/Hostels";

export default function HostelsPage() {
  return (
    <div className="relative min-h-screen">
      {/* Transparent WorldMap as background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <WorldMap
          dots={[
            {
              start: { lat: 12.9716, lng: 77.5946 }, // Bangalore
              end: { lat: 13.0827, lng: 80.2707 }, // Chennai
            },
            {
              start: { lat: 17.3850, lng: 78.4867 }, // Hyderabad
              end: { lat: 28.7041, lng: 77.1025 }, // Delhi
            },
            {
              start: { lat: 19.0760, lng: 72.8777 }, // Mumbai
              end: { lat: 22.5726, lng: 88.3639 }, // Kolkata
            },
            {
              start: { lat: 28.7041, lng: 77.1025 }, // Delhi
              end: { lat: 26.9124, lng: 75.7873 }, // Jaipur
            },
          ]}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        <div className="mb-12">
          <Hostels />
        </div>
      </div>
    </div>
  );
} 