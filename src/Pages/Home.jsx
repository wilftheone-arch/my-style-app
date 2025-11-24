// src/Pages/Home.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Camera, Sparkles, TrendingUp, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout";

export default function Home() {
  const navigate = useNavigate();

  return (
    <Layout currentPageName="Home">
      <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-neutral-800 text-white rounded-2xl overflow-hidden shadow-2xl">

        {/* Hero Section */}
        <section className="relative px-4 pt-20 pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-fuchsia-500/5 to-transparent opacity-70" />
          
          <div className="relative max-w-4xl mx-auto text-center animate-fade-in">
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-neutral-900/50 rounded-full shadow-card border border-pink-500/20 backdrop-blur">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span className="text-sm font-medium text-neutral-200">
                AI-Powered Personal Styling
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
              Your Smart Style Assistant
            </h1>

            <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
              Scan your wardrobe, discover your style, and get personalized outfit recommendations powered by AI.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-lg bg-pink-500 hover:bg-pink-600"
                onClick={() => navigate("/scan")}
              >
                <Camera className="w-5 h-5 mr-2" />
                Scan Your Wardrobe
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="text-lg border-pink-500 text-pink-400 hover:bg-pink-500/10"
                onClick={() => navigate("/style-quiz")}
              >
                Take Style Quiz
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 py-20 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-neutral-900 p-8 rounded-2xl shadow-card border border-neutral-800 animate-fade-in">
              <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center mb-4">
                <Camera className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Wardrobe Scanning</h3>
              <p className="text-neutral-400">
                Use your phone camera to scan and digitize your entire wardrobe.
                AI identifies each piece automatically.
              </p>
            </div>

            {/* Feature 2 */}
            <div
              className="bg-neutral-900 p-8 rounded-2xl shadow-card border border-neutral-800 animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="w-12 h-12 bg-fuchsia-500/10 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-fuchsia-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Style Learning</h3>
              <p className="text-neutral-400">
                Swipe through outfits to teach the AI your preferences.
                Get personalised recommendations that match your taste.
              </p>
            </div>

            {/* Feature 3 */}
            <div
              className="bg-neutral-900 p-8 rounded-2xl shadow-card border border-neutral-800 animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center mb-4">
                <ShoppingBag className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Shopping</h3>
              <p className="text-neutral-400">
                Get personalized shopping suggestions based on trends,
                seasons and your style. Direct links to shop instantly.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-20 bg-neutral-900/60 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto text-center">
            <TrendingUp className="w-16 h-16 text-pink-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Style?
            </h2>
            <p className="text-lg text-neutral-400 mb-8">
              Join thousands of users discovering their perfect style with AI.
            </p>
            <Button
              size="lg"
              className="bg-pink-500 hover:bg-pink-600"
              onClick={() => navigate("/scan")}
            >
              Get Started Free
            </Button>
          </div>
        </section>

      </div>
    </Layout>
  );
}
