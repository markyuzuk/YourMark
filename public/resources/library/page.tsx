import Link from "next/link";
import { FileText, Download, BookOpen } from "lucide-react";

export default function ResourceLibraryPage() {
  const resources = [
    {
      title: "Patient Guide to Clinical Research",
      description: "Plain-language guide on what to expect from your first screening to your final study visit.",
      category: "For Patients",
      type: "PDF Guide"
    },
    {
      title: "Understanding Informed Consent",
      description: "A clear explanation of your rights and what informed consent means in clinical trials.",
      category: "For Patients",
      type: "PDF Guide"
    },
    {
      title: "Community Engagement Best Practices",
      description: "Operational best practices for building trust and engagement in diverse communities.",
      category: "For Sites",
      type: "White Paper"
    },
    {
      title: "Staff Retention Strategies",
      description: "How to build a culture where coordinators and research staff want to stay.",
      category: "For Sites",
      type: "Guide"
    },
    {
      title: "Reaching Diverse Populations",
      description: "Strategies for enrollment through local physician networks and community trust.",
      category: "For Sponsors",
      type: "White Paper"
    },
    {
      title: "The Patient Concierge Model",
      description: "How dedicated patient support improves retention and data quality.",
      category: "For Sponsors",
      type: "Case Study"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-gradient-to-r from-teal-600 via-teal-500 to-teal-400 text-white py-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <h1 className="text-[3.5rem] lg:text-[4.5rem] font-serif font-bold leading-[1.1] mb-6">Resource Library</h1>
          <p className="text-[1.375rem] lg:text-[1.5rem] leading-relaxed max-w-3xl">
            Practical tools and guides for patients, sites, and industry partners. Our resources are clear, actionable, and grounded in real-world experience.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto mb-12">
            <p className="text-[1.125rem] text-charcoal-700 leading-relaxed text-center">
              We don't believe in volume for the sake of volume. Our library is a curated collection of clear, actionable guides developed by the people who run our sites every day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {resources.map((resource, index) => (
              <div key={index} className="bg-warm-50 rounded-xl p-6 shadow-soft hover:shadow-soft-lg transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <span className="inline-block bg-teal-50 text-teal-600 px-3 py-1 rounded-full text-xs font-semibold mb-2">
                      {resource.category}
                    </span>
                    <h3 className="text-lg font-bold text-charcoal-900 mb-2">{resource.title}</h3>
                  </div>
                </div>
                <p className="text-charcoal-600 text-sm mb-4">{resource.description}</p>
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-xs text-[#6b7280]">{resource.type}</span>
                  <button className="text-teal-600 font-semibold text-sm hover:underline flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-warm-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
          <BookOpen className="h-16 w-16 text-teal-500 mx-auto mb-6" />
          <h2 className="text-[2.5rem] font-serif font-bold mb-6 text-charcoal-900">Looking for In-Depth Analysis?</h2>
          <p className="text-[1.125rem] text-charcoal-700 mb-8 max-w-2xl mx-auto">
            Explore our white papers for deep-dive analysis on industry trends, consolidation, and the future of clinical research.
          </p>
          <Link
            href="/resources/white-papers"
            className="inline-block bg-teal-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-teal-600 transition-all"
          >
            View White Papers
          </Link>
        </div>
      </section>
    </div>
  );
}
