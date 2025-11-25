import { Button } from "../Components/ui/button";
import Layout from "../Layout";
import { Camera, Sparkles, ShoppingBag, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Layout currentPageName="Home">
      <div className="space-y-20">
        <section className="relative pt-10 pb-10">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-pink-600/20 rounded-full border border-pink-500/40">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span className="text-sm font-medium text-pink-200">
              AI-Powered Personal Styling
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Your Smart Style Assistant
          </h1>

          <p className="text-xl text-gray-300 mb-8 max-w-2xl">
            Scan your wardrobe, discover your style, and get personalised outfit
            recommendations powered by AI.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-pink-600 hover:bg-pink-700 text-white text-lg"
              onClick={() => navigate("/scan")}
            >
              <Camera className="w-5 h-5 mr-2" />
              Scan Your Wardrobe
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-pink-500 text-pink-300 hover:bg-pink-600/20 text-lg"
              onClick={() => navigate("/style-quiz")}
            >
              Take Style Quiz
            </Button>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
            <div className="w-12 h-12 bg-pink-600/20 rounded-xl flex items-center justify-center mb-4">
              <Camera className="w-6 h-6 text-pink-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">
              Smart Wardrobe Scanning
            </h3>
            <p className="text-gray-400">
              Use your phone camera to scan and digitize your wardrobe.
            </p>
          </div>

          <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
            <div className="w-12 h-12 bg-pink-600/20 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-pink-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">
              AI Style Learning
            </h3>
            <p className="text-gray-400">
              Swipe outfits and train your personal AI stylist.
            </p>
          </div>

          <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
            <div className="w-12 h-12 bg-pink-600/20 rounded-xl flex items-center justify-center mb-4">
              <ShoppingBag className="w-6 h-6 text-pink-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">
              Smart Shopping
            </h3>
            <p className="text-gray-400">
              Get personalised shopping links based on your style.
            </p>
          </div>
        </section>

        <section className="bg-pink-600/10 border border-pink-500/20 rounded-2xl p-10 text-center">
          <TrendingUp className="w-16 h-16 text-pink-400 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Ready to Transform Your Style?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Join early testers and help shape the future of AI styling.
          </p>
          <Button
            size="lg"
            className="bg-pink-600 hover:bg-pink-700 text-white"
            onClick={() => navigate("/scan")}
          >
            Get Started Free
          </Button>
        </section>
      </div>
    </Layout>
  );
};

export default Home;
