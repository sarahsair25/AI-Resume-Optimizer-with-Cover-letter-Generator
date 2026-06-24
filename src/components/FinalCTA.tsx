import Link from "next/link";

export const FinalCTA = () => {
  return (
    <section className="py-24 bg-indigo-600 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-700 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <h2 className="text-3xl lg:text-5xl font-extrabold text-white mb-6">
          Ready to land your dream job?
        </h2>
        <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto leading-relaxed">
          Join thousands of successful candidates who used ResuMatch AI to optimize their resumes and land interviews at top companies.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link 
            href="/dashboard" 
            className="w-full sm:w-auto px-10 py-5 bg-white text-indigo-600 font-bold rounded-xl shadow-xl hover:bg-indigo-50 hover:-translate-y-0.5 transition-all duration-200"
          >
            Get Your Match Score Now
          </Link>
          <Link 
            href="/pricing" 
            className="w-full sm:w-auto px-10 py-5 bg-indigo-700 text-white font-bold rounded-xl hover:bg-indigo-800 transition-all duration-200 border border-indigo-500"
          >
            View Pricing
          </Link>
        </div>
        <p className="mt-8 text-indigo-200 text-sm font-medium">
          Free analysis included. No credit card required.
        </p>
      </div>
    </section>
  );
};

export default FinalCTA;
