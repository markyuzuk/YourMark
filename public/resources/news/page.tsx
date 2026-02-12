import Link from "next/link";
import { Newspaper, Calendar } from "lucide-react";

export default function NewsPage() {
  const newsItems = [
    {
      title: "Sensorium Clinical Research Launches with Vision to Preserve Local Culture",
      date: "January 2026",
      category: "Company News",
      excerpt: "Founder Matt Kiernan announces the launch of Sensorium Clinical Research, a new kind of site network built on the principle that scale and humanity can coexist."
    },
    {
      title: "The Evolution of the Sensorium Effect",
      date: "December 2025",
      category: "Leadership Insights",
      excerpt: "How we're building a network that strengthens independent sites without erasing what makes them special."
    },
    {
      title: "Industry Consolidation: What Site Owners Need to Know",
      date: "November 2025",
      category: "Industry Analysis",
      excerpt: "A look at the accelerating consolidation in clinical research and what it means for independent site owners."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-400 text-white py-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <h1 className="text-[3.5rem] lg:text-[4.5rem] font-serif font-bold leading-[1.1] mb-6">News & Updates</h1>
          <p className="text-[1.375rem] lg:text-[1.5rem] leading-relaxed max-w-3xl">
            Stay informed on how we are growing and the milestones we are achieving across our national footprint.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {newsItems.map((item, index) => (
                <div key={index} className="bg-warm-50 rounded-xl p-8 shadow-soft hover:shadow-soft-lg transition-shadow">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Newspaper className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="inline-block bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-semibold">
                          {item.category}
                        </span>
                        <span className="text-sm text-[#6b7280] flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {item.date}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-charcoal-900 mb-3">{item.title}</h3>
                      <p className="text-charcoal-700 leading-relaxed mb-4">{item.excerpt}</p>
                      <button className="text-indigo-600 font-semibold hover:underline">
                        Read More →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-warm-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-[2.5rem] font-serif font-bold mb-6 text-charcoal-900">Stay Connected</h2>
          <p className="text-[1.125rem] text-charcoal-700 mb-8 max-w-2xl mx-auto">
            Follow our journey as we build a different kind of clinical research network.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/contact"
              className="bg-indigo-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-indigo-600 transition-all"
            >
              Contact Us
            </Link>
            <Link
              href="/resources/white-papers"
              className="bg-white border-2 border-indigo-500 text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-indigo-50 transition-all"
            >
              Read Our Insights
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
