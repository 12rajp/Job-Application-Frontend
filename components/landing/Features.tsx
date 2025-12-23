import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Briefcase, CheckCircle2, BarChart3, FileText} from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: Briefcase,
      title: "Track Applications",
      description:
        "Keep all your job applications organized in one place with status tracking and follow-up reminders.",
    },
    {
      icon: CheckCircle2,
      title: "Application Status",
      description:
        "Monitor the progress of each application from submission to offer, with clear status indicators.",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description:
        "Get insights into your job search with statistics on application responses and interview rates.",
    },
    {
      icon: FileText,
      title: "Resume Management",
      description:
        "Store and organize different versions of your resume for different job types and industries.",
    },
  ];

  return (
    <section className="container mx-auto px-6 py-16">
      <div className="grid md:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="text-center bg-[#1A253A] text-white p-6 transform transition-transform hover:scale-105 hover:shadow-xl relative overflow-visible"
          >
            <CardHeader>
              <div className="w-12 h-12 mx-auto mb-3 bg-slate-700 rounded-lg flex items-center justify-center">
                <feature.icon className="w-10 h-10 text-blue-400" />
              </div>

              <CardTitle className="text-lg text-white">{feature.title}</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-gray-300 text-sm">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
