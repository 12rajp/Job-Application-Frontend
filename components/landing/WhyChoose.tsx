import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function WhyChoose() {
  const reasons = [
    {
      title: "100% Free",
      description: "All features are completely free. No hidden costs or premium tiers.",
    },
    {
      title: "Easy to Use",
      description: "Intuitive interface designed for efficiency and simplicity.",
    },
    {
      title: "Privacy First",
      description: "Your data is secure and private. We never share your information.",
    },
  ];

  return (
    <section className="container mx-auto px-6 py-16">
      <h2 className="text-4xl font-bold text-center mb-12">
        Why Choose Our Job Tracker?
      </h2>

      <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
        {reasons.map((reason, index) => (
          <Card
            key={index}
            className="relative text-center bg-[#1A253A] text-white p-6 transform transition-transform hover:scale-105 hover:shadow-xl overflow-visible"
          >

            <CardHeader>
              <CardTitle className="text-2xl text-white">{reason.title}</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-gray-300">{reason.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
