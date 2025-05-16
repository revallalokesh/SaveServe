"use client"

import { SplashCursor } from "@/app/components/ui/splash-cursor"
import { PricingCard } from "@/app/components/ui/prices"

function PricingPlans() {
  return (
    <div className="container mx-auto py-12">
      {/* Pay to Save Quote Section */}
      <div className="mb-16 text-center">
        <h2 className="text-3xl font-bold mb-6">Pay Once, Save Forever</h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          "Invest in our service today and watch your savings grow tomorrow. Our customers save an average of 30% on their food expenses."
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
            <p className="italic mb-4">"I saved over ₹15,000 in my first three months using SaveServes. Best decision ever!"</p>
            <p className="font-semibold">- Priya S., Student</p>
          </div>
          
          <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
            <p className="italic mb-4">"The quarterly plan paid for itself within weeks. My food budget has never been more organized."</p>
            <p className="font-semibold">- Rahul M., Working Professional</p>
          </div>
          
          <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
            <p className="italic mb-4">"Choosing the yearly plan was the best financial decision for our hostel. We've reduced waste by 40%."</p>
            <p className="font-semibold">- Dr. Sharma, Hostel Manager</p>
          </div>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-center mb-10">Choose Your Plan</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Monthly Plan */}
        <PricingCard
          title="Monthly Plan"
          description="Flexible month-to-month subscription."
          price={4999}
          originalPrice={6999}
          features={[
            {
              title: "Features",
              items: [
                "Basic Analytics",
                "Limited Projects",
                "Email Support",
                "Mobile App Access",
              ],
            },
            {
              title: "Perks",
              items: [
                "Cancel Anytime",
                "Basic Support",
                "Community Access",
                "Monthly Newsletter",
              ],
            },
          ]}
          buttonText="Get Monthly Plan"
          onButtonClick={() => console.log("Monthly plan selected")}
        />

        {/* Quarterly Plan */}
        <PricingCard
          title="Quarterly Plan"
          description="Save 15% with quarterly billing."
          price={12999}
          originalPrice={14999}
          features={[
            {
              title: "Features",
              items: [
                "Advanced Analytics",
                "Unlimited Projects",
                "Priority Support",
                "Desktop & Mobile Access",
              ],
            },
            {
              title: "Perks",
              items: [
                "15% Savings",
                "Priority Queue",
                "Quarterly Webinars",
                "Team Dashboard",
              ],
            },
          ]}
          buttonText="Get Quarterly Plan"
          onButtonClick={() => console.log("Quarterly plan selected")}
        />

        {/* Yearly Plan */}
        <PricingCard
          title="Yearly Plan"
          description="Our best value, save 25% annually."
          price={39999}
          originalPrice={59999}
          features={[
            {
              title: "Features",
              items: [
                "Premium Analytics",
                "Unlimited Everything",
                "24/7 Support",
                "All Platform Access",
              ],
            },
            {
              title: "Perks",
              items: [
                "25% Savings",
                "VIP Support",
                "Exclusive Webinars",
                "Early Feature Access",
              ],
            },
          ]}
          buttonText="Get Yearly Plan"
          onButtonClick={() => console.log("Yearly plan selected")}
        />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div>
      <SplashCursor />
      <div>
        <h1 className="text-4xl font-bold">Save serves welcomes you</h1>
      </div>
      <PricingPlans />
    </div>
  )
}