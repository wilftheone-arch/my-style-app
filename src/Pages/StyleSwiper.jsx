import React from "react";
import Layout from "../Layout";
import { Heart } from "lucide-react";

export default function StyleSwiper() {
  return (
    <Layout currentPageName="StyleSwiper">
      <section className="flex flex-col items-center gap-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">
          <Heart className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">Style Swiper</h1>
          <p className="text-neutral-600">
            A playful swipe experience is coming soon. Stay tuned!
          </p>
        </div>
      </section>
    </Layout>
  );
}
