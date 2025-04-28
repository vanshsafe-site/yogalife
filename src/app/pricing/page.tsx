export default function PricingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-24">
      <div className="max-w-5xl w-full">
        <h1 className="text-4xl font-bold text-center mb-6 animate-fadeIn">Yoga Class Pricing</h1>
        <p className="text-xl text-center text-muted-foreground mb-12 animate-fadeIn animation-delay-150">
          Flexible plans to fit your lifestyle and practice goals
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Basic Plan */}
          <div className="bg-card rounded-lg shadow-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-xl hover:border-primary/30 animate-slideInUp animation-delay-300">
            <div className="relative h-48 w-full bg-primary/10 flex items-center justify-center group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 z-10">
                <h2 className="text-2xl font-bold mb-1 text-white">Basic</h2>
                <p className="text-white/80">For beginners</p>
              </div>
              <span className="text-primary font-medium transition-transform duration-700 group-hover:scale-110">Basic Plan Image</span>
            </div>
            <div className="p-6 text-center">
              <div className="text-4xl font-bold mb-4 text-card-foreground">$49<span className="text-xl text-muted-foreground">/month</span></div>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center text-card-foreground">
                  <svg className="h-5 w-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  2 classes per week
                </li>
                <li className="flex items-center text-card-foreground">
                  <svg className="h-5 w-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Basic pose guidance
                </li>
                <li className="flex items-center text-card-foreground">
                  <svg className="h-5 w-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Community access
                </li>
              </ul>
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-6 rounded-lg w-full transition-all duration-300 hover:scale-105 hover:shadow-md">
                Get Started
              </button>
            </div>
          </div>
          
          {/* Standard Plan */}
          <div className="bg-card rounded-lg shadow-lg overflow-hidden border border-primary transform scale-105 z-10 transition-all duration-300 hover:shadow-xl animate-pulse animation-delay-450">
            <div className="relative h-48 w-full bg-primary flex items-center justify-center group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent flex flex-col justify-end p-6 z-10">
                <h2 className="text-2xl font-bold text-white mb-1">Standard</h2>
                <p className="text-white/80">Most popular</p>
              </div>
              <span className="text-primary-foreground font-medium transition-transform duration-700 group-hover:scale-110">Standard Plan Image</span>
            </div>
            <div className="p-6 text-center">
              <div className="text-4xl font-bold mb-4 text-card-foreground">$89<span className="text-xl text-muted-foreground">/month</span></div>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center text-card-foreground">
                  <svg className="h-5 w-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Unlimited classes
                </li>
                <li className="flex items-center text-card-foreground">
                  <svg className="h-5 w-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Advanced pose instruction
                </li>
                <li className="flex items-center text-card-foreground">
                  <svg className="h-5 w-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  1 private session per month
                </li>
                <li className="flex items-center text-card-foreground">
                  <svg className="h-5 w-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Access to workshops
                </li>
              </ul>
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-6 rounded-lg w-full transition-all duration-300 hover:scale-105 hover:shadow-md">
                Sign Up Now
              </button>
            </div>
          </div>
          
          {/* Premium Plan */}
          <div className="bg-card rounded-lg shadow-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-xl hover:border-primary/30 animate-slideInUp animation-delay-600">
            <div className="relative h-48 w-full bg-primary/10 flex items-center justify-center group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 z-10">
                <h2 className="text-2xl font-bold mb-1 text-white">Premium</h2>
                <p className="text-white/80">Advanced yogis</p>
              </div>
              <span className="text-primary font-medium transition-transform duration-700 group-hover:scale-110">Premium Plan Image</span>
            </div>
            <div className="p-6 text-center">
              <div className="text-4xl font-bold mb-4 text-card-foreground">$129<span className="text-xl text-muted-foreground">/month</span></div>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center text-card-foreground">
                  <svg className="h-5 w-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  All Standard features
                </li>
                <li className="flex items-center text-card-foreground">
                  <svg className="h-5 w-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  3 private sessions per month
                </li>
                <li className="flex items-center text-card-foreground">
                  <svg className="h-5 w-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Nutrition consultation
                </li>
                <li className="flex items-center text-card-foreground">
                  <svg className="h-5 w-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Early access to events
                </li>
              </ul>
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-6 rounded-lg w-full transition-all duration-300 hover:scale-105 hover:shadow-md">
                Go Premium
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-accent rounded-lg p-8 shadow-md animate-fadeIn animation-delay-750">
          <div className="flex flex-col md:flex-row gap-8 items-center mb-6">
            <div className="md:w-1/3 relative h-64 w-full rounded-lg bg-primary/20 flex items-center justify-center group overflow-hidden transition-transform duration-500 hover:scale-105">
              <span className="text-accent-foreground font-medium transition-transform duration-700 group-hover:scale-110">Community Image</span>
            </div>
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold mb-4 text-accent-foreground">Referral & Rewards Program</h2>
              <p className="text-accent-foreground/80 mb-4">Join our community and earn rewards for your dedication and for sharing the gift of yoga with others.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-slideInLeft animation-delay-900">
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">How It Works</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-1">1</span>
                  <span className="text-muted-foreground">Earn 1 point for each yoga session you attend</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-1">2</span>
                  <span className="text-muted-foreground">Get 50 points for each friend you refer who joins</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-1">3</span>
                  <span className="text-muted-foreground">Unlock badges at 100, 200, and 300 days of attendance</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-1">4</span>
                  <span className="text-muted-foreground">Earn discounts and special perks with your points</span>
                </li>
              </ul>
            </div>
            <div className="bg-card p-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-slideInRight animation-delay-900">
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">Benefits</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-muted-foreground">10% discount on merchandise at 100 points</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-muted-foreground">Free private session at 200 points</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-muted-foreground">15% off monthly membership after 300 days</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-muted-foreground">Exclusive retreat invitations for top referrers</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 