import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; 
import { Briefcase, CheckCircle2, BarChart3, FileText } from "lucide-react";

export default function Features() {
  const features = [
    { icon: Briefcase, title: "Track Applications", description: "Keep all your job applications organized." },
    { icon: CheckCircle2, title: "Application Status", description: "Monitor progress with clear status indicators." },
    { icon: BarChart3, title: "Analytics Dashboard", description: "Insights into responses and interviews." },
    { icon: FileText, title: "Resume Management", description: "Store different resume versions easily." },
  ];

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="text-center bg-[#1A253A] p-6 hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <div className="w-12 h-12 mx-auto mb-3 bg-slate-700 rounded-lg flex items-center justify-center">
                <feature.icon className="w-8 h-8 text-blue-400" />
              </div>
              <CardTitle
                className=" text-white text-lg sm:text-xl font-semibold">
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm sm:text-base">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
