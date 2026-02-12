import Link from "next/link";
import { FileText, TrendingUp } from "lucide-react";

export default function WhitePapersPage() {
  const whitePapers = [
    {
      title: "Part 1: The Four Phases of Consolidation",
      description: "An introduction to the repeatable, observable patterns driven by economics and buyer behavior that reshape industries over time.",
      series: "4-Phase Model"
    },
    {
      title: "Part 2: Lessons from the IRB and CRO Industries",
      description: "Case studies on how ethics review and contract research evolved into global oligopolies, and what these precedents mean for the future of sites.",
      series: "4-Phase Model"
    },
    {
      title: "Part 3: The State of Clinical Trial Site Consolidation",
      description: "A data-driven look at where the site sector stands today and a projection of the 'Phase 3' acceleration ahead.",
      series: "4-Phase Model"
    },
    {
      title: "Part 4: The Independent Site at a Crossroads",
      description: "An examination of the strategic options available to site owners, the risks of inaction, and the trade-offs of different paths forward.",
      series: "4-Phase Model"
    },
    {
      title: "Regulatory Drivers of Clinical Trial Site Consolidation",
      description: "From Single IRB mandates to FDA Diversity Action Plans: Understanding the compliance pressures favoring well-resourced networks.",
      series: "Regulatory Analysis"
    },
    {
      title: "The Case for Culture: Why Sites Should Choose Sensorium",
      description: "A diagnostic of the 'Standardization Problem' in site networks and a blueprint for a partnership model that prioritizes legacy and clinical autonomy.",
      series: "Strategic Insights"
    },
    {
      title: "Avoiding 'Seller's Remorse' in Clinical Research",
      description: "Why selecting a partner based on cultural alignment—rather than price alone—is the most critical decision a site owner will ever make.",
      series: "Strategic Insights"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 text-white py-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <h1 className="text-[3.5rem] lg:text-[4.5rem] font-serif font-bold leading-[1.1] mb-6">White Papers & Insights</h1>
          <p className="text-[1.375rem] lg:text-[1.5rem] leading-relaxed max-w-3xl">
            Drawing on decades of experience across Pharma, CROs, and Site Operations, our leadership team provides thoughtful analysis on the future of the industry.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-[2.5rem] font-serif font-bold text-center mb-6 text-charcoal-900">The "Why" Behind the "How"</h2>
            <p className="text-[1.125rem] text-charcoal-700 leading-relaxed text-center">
              We explore the critical intersection of scale and humanity, examining how to navigate an industry in transition without losing the "human scale" that makes research work.
            </p>
          </div>

          {/* Featured Series */}
          <div className="mb-16">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-600 rounded-lg p-8 mb-8">
              <h3 className="text-2xl font-bold text-charcoal-900 mb-4">Featured Series: The 4-Phase Model of Industry Consolidation</h3>
              <p className="text-charcoal-700 leading-relaxed">
                This multi-part series examines how fragmented markets evolve into oligopolies and what operators must do to survive and thrive at each stage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {whitePapers.filter(paper => paper.series === "4-Phase Model").map((paper, index) => (
                <div key={index} className="bg-warm-50 rounded-xl p-6 shadow-soft hover:shadow-soft-lg transition-shadow">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-charcoal-900 mb-2">{paper.title}</h3>
                    </div>
                  </div>
                  <p className="text-charcoal-600 text-sm mb-4">{paper.description}</p>
                  <button className="text-amber-600 font-semibold text-sm hover:underline">
                    Download PDF →
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Other Papers */}
          <div>
            <h3 className="text-2xl font-bold text-center mb-8 text-charcoal-900">Regulatory & Strategic Deep Dives</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {whitePapers.filter(paper => paper.series !== "4-Phase Model").map((paper, index) => (
                <div key={index} className="bg-warm-50 rounded-xl p-6 shadow-soft hover:shadow-soft-lg transition-shadow">
                  <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <span className="inline-block bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                    {paper.series}
                  </span>
                  <h3 className="text-lg font-bold text-charcoal-900 mb-3">{paper.title}</h3>
                  <p className="text-charcoal-600 text-sm mb-4">{paper.description}</p>
                  <button className="text-amber-600 font-semibold text-sm hover:underline">
                    Download PDF →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-amber-500 text-white text-center">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <h2 className="text-[2.5rem] font-serif font-bold mb-6">Want to Discuss These Insights?</h2>
          <p className="text-[1.125rem] mb-8 opacity-95 max-w-2xl mx-auto">
            Our team is available to discuss how these industry trends impact your site or organization.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-amber-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all"
          >
            Contact Our Team
          </Link>
        </div>
      </section>
    </div>
  );
}
