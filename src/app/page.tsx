import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24 bg-white">
      <div className="max-w-5xl w-full">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-6 animate-fadeIn text-black">Welcome to Yoga Life</h1>
        <p className="text-xl md:text-2xl text-center mb-10 animate-fadeIn animation-delay-300 text-black">Discover balance, strength, and peace through our specialized yoga classes</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-slideInLeft animation-delay-150">
            <div className="mb-4 h-48 w-full rounded-lg bg-white flex items-center justify-center overflow-hidden group border border-gray-200">
              <span className="text-black font-medium transition-transform duration-500 group-hover:scale-110">Beginner Yoga Image</span>
            </div>
            <h2 className="text-xl font-semibold mb-3 text-black">Beginner Classes</h2>
            <p className="text-black mb-4">Perfect for those just starting their yoga journey. Focus on fundamentals and proper alignment.</p>
            <p className="font-medium text-black">Mon, Wed, Fri - 9:00 AM</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-slideInLeft animation-delay-300">
            <div className="mb-4 h-48 w-full rounded-lg bg-white flex items-center justify-center overflow-hidden group border border-gray-200">
              <span className="text-black font-medium transition-transform duration-500 group-hover:scale-110">Intermediate Yoga Image</span>
            </div>
            <h2 className="text-xl font-semibold mb-3 text-black">Intermediate Flow</h2>
            <p className="text-black mb-4">Build on your practice with more challenging poses and flowing sequences.</p>
            <p className="font-medium text-black">Tue, Thu - 5:30 PM</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-slideInLeft animation-delay-450">
            <div className="mb-4 h-48 w-full rounded-lg bg-white flex items-center justify-center overflow-hidden group border border-gray-200">
              <span className="text-black font-medium transition-transform duration-500 group-hover:scale-110">Advanced Yoga Image</span>
            </div>
            <h2 className="text-xl font-semibold mb-3 text-black">Advanced Yoga</h2>
            <p className="text-black mb-4">Deepen your practice with advanced techniques and meditation.</p>
            <p className="font-medium text-black">Sat - 10:00 AM</p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-8 animate-fadeIn animation-delay-600">
          <Link 
            href="/signup" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-6 rounded-lg text-center transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            Start Your Journey
          </Link>
          <Link 
            href="/about" 
            className="bg-white hover:bg-gray-50 text-black font-bold py-3 px-6 rounded-lg border border-gray-300 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            Learn More
          </Link>
        </div>
      </div>
    </main>
  );
}
