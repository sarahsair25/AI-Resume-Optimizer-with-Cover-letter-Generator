import Link from "next/link";

const plans = [
  {
    name: 'Freemium',
    price: '0',
    description: 'Perfect for a quick check-up.',
    features: [
      '1 resume analysis',
      'Basic match score',
      'Keyword suggestions',
    ],
    notIncluded: [
      'AI Bullet point rewrites',
      'Tailored cover letters',
      'Priority processing',
    ],
    cta: 'Get Started',
    href: '/dashboard',
    highlight: false,
  },
  {
    name: 'Subscription',
    price: '19',
    description: 'Everything you need to land the job.',
    features: [
      'Unlimited analyses',
      'AI Bullet point rewrites',
      'Tailored cover letters',
      'Missing skills detection',
      'Formatting check',
    ],
    notIncluded: [],
    cta: 'Start Subscription',
    href: '/dashboard',
    highlight: true,
  },
  {
    name: 'Pay-per-Credit',
    price: '5',
    unit: '/ea',
    description: 'No commitment, just results.',
    features: [
      '1 full optimization',
      'AI Bullet point rewrites',
      'Tailored cover letter',
      'Lifetime access to result',
    ],
    notIncluded: [],
    cta: 'Buy Credit',
    href: '/dashboard',
    highlight: false,
  },
];

export const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-3">Pricing Plans</h2>
          <h3 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6">
            Invest in your career
          </h3>
          <p className="text-xl text-slate-600 leading-relaxed">
            Choose the plan that fits your job search needs. Get started for free and upgrade anytime.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.name} 
              className={`relative flex flex-col p-8 bg-white rounded-3xl border transition-all duration-300 ${
                plan.highlight 
                  ? 'border-indigo-600 shadow-xl shadow-indigo-100 scale-105 z-10' 
                  : 'border-slate-200 hover:border-indigo-300 shadow-sm'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h4 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h4>
                <p className="text-sm text-slate-500">{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-extrabold text-slate-900">${plan.price}</span>
                <span className="text-slate-500 font-medium">{plan.unit || '/mo'}</span>
              </div>

              <ul className="flex-1 space-y-4 mb-10 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-slate-700">
                    <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
                {plan.notIncluded.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-slate-400">
                    <svg className="w-5 h-5 text-slate-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block w-full py-4 text-center font-bold rounded-xl transition-all ${
                  plan.highlight
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-indigo-600 hover:text-indigo-600'
                }`}
              >
                {plan.cta}
              </Link>
              
              {plan.price !== '0' && (
                <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Secure Payment via Stripe
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
