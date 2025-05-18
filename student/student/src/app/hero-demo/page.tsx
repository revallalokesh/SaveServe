import DatabaseWithRestApi from '../components/ui/hero-futuristic';

export default function HeroDemoPage() {
  return (
    <div className="w-full h-screen bg-black flex items-center justify-center p-6 sm:p-8">
      <DatabaseWithRestApi 
        title="SaveServes API Ecosystem" 
        circleText="API"
        badgeTexts={{
          first: "Meal",
          second: "QR",
          third: "Rate",
          fourth: "Analytics"
        }}
        buttonTexts={{
          first: "Campus Life",
          second: "Zero Waste"
        }}
        lightColor="#0ea5e9"
        className="scale-90 md:scale-100 max-w-full"
      />
    </div>
  );
} 