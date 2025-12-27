import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function WhyChoose() {
  const reasons = [
    { title: "100% Free", description: "No hidden costs or premium tiers." },
    { title: "Easy to Use", description: "Clean and intuitive interface." },
    { title: "Privacy First", description: "Your data stays yours." },
  ];

  return (
    <section className="container mx-auto px-4 py-16">   
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10">
        Why Choose Our Job Tracker?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {reasons.map((reason, index) => (
          <Card
            key={index}
            className=" text-center bg-[#1A253A] p-6 hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <CardTitle
                className=" text-white text-xl sm:text-2xl font-semibold">
                {reason.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm sm:text-base">
                {reason.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
