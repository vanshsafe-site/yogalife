export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-24 bg-white">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold mb-6 animate-fadeIn text-black">About Yoga Life</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 mb-10 animate-fadeIn animation-delay-150 border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4 text-black">Our Philosophy</h2>
          <p className="text-black mb-6">
            At Yoga Life, we believe in the transformative power of yoga to bring balance to mind, body, and spirit. 
            Our practice is rooted in ancient traditions while embracing modern understanding of physical wellness.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 text-black">Meet Our Founder</h2>
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="md:w-1/3 rounded-lg h-64 bg-white flex items-center justify-center overflow-hidden transition-transform duration-500 hover:scale-105 animate-slideInLeft animation-delay-300 border border-gray-200">
              <span className="text-black font-medium">Founder Image</span>
            </div>
            <div className="md:w-2/3 animate-slideInRight animation-delay-300">
              <h3 className="text-xl font-medium mb-2 text-black">Yoga Sir</h3>
              <p className="text-black mb-4">
                With over 20 years of practice and teaching experience, our founder has studied with masters across 
                India, Nepal, and Thailand. His approach combines traditional Hatha, Vinyasa, and meditative practices 
                to create a holistic yoga experience.
              </p>
              <p className="text-black italic">
                &ldquo;Yoga is not about touching your toes, it&apos;s about what you learn on the way down.&rdquo; - Yoga Sir
              </p>
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold mb-4 text-black">Our Community</h2>
          <p className="text-black">
            We&apos;re proud to have built a welcoming community of practitioners from all walks of life. From beginners 
            to advanced yogis, everyone is welcome to join our journey toward better health and inner peace. 
            Our referral program reflects our belief in growing together and sharing the benefits of yoga with friends and family.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8 animate-fadeIn animation-delay-450 border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4 text-black">Our Approach</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-slideInUp animation-delay-600 border border-gray-200">
              <div className="mb-4 h-36 w-full rounded-lg bg-white flex items-center justify-center group overflow-hidden border border-gray-200">
                <span className="text-black font-medium transition-transform duration-500 group-hover:scale-110">Holistic Practice Image</span>
              </div>
              <h3 className="text-xl font-medium mb-2 text-black">Holistic Practice</h3>
              <p className="text-black">
                We focus on the complete yoga experience—physical postures, breathing techniques, meditation, 
                and mindfulness in daily life.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-slideInUp animation-delay-750 border border-gray-200">
              <div className="mb-4 h-36 w-full rounded-lg bg-white flex items-center justify-center group overflow-hidden border border-gray-200">
                <span className="text-black font-medium transition-transform duration-500 group-hover:scale-110">Inclusive Environment Image</span>
              </div>
              <h3 className="text-xl font-medium mb-2 text-black">Inclusive Environment</h3>
              <p className="text-black">
                Classes are designed to accommodate all levels, with modifications offered for beginners and 
                challenges for experienced practitioners.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-slideInUp animation-delay-900 border border-gray-200">
              <div className="mb-4 h-36 w-full rounded-lg bg-white flex items-center justify-center group overflow-hidden border border-gray-200">
                <span className="text-black font-medium transition-transform duration-500 group-hover:scale-110">Progress Tracking Image</span>
              </div>
              <h3 className="text-xl font-medium mb-2 text-black">Progress Tracking</h3>
              <p className="text-black">
                Our unique attendance and rewards system helps you stay motivated and track your yoga journey.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-slideInUp animation-delay-900 border border-gray-200">
              <div className="mb-4 h-36 w-full rounded-lg bg-white flex items-center justify-center group overflow-hidden border border-gray-200">
                <span className="text-black font-medium transition-transform duration-500 group-hover:scale-110">Community Support Image</span>
              </div>
              <h3 className="text-xl font-medium mb-2 text-black">Community Support</h3>
              <p className="text-black">
                Beyond classes, we foster a supportive community through events, workshops, and our referral program.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 