// src/Pages/Scan.jsx
import React, { useState } from "react";
import Layout from "../Layout";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Sparkles } from "lucide-react";

export default function Scan() {
  const [preview, setPreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Show preview
    const url = URL.createObjectURL(file);
    setPreview(url);
    setResult(null);

    // Fake “AI analysis”
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setResult({
        name: "Oversized beige sweater",
        category: "tops",
        color: "beige",
        styleTags: ["casual", "cozy", "minimal"],
      });
    }, 1500);
  };

  return (
    <Layout currentPageName="Scan">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Scan your wardrobe
          </h1>
          <p className="text-neutral-600">
            Use your camera or upload a photo to digitise a clothing item.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Left side: upload / camera */}
          <div className="space-y-4">
            <div className="border border-neutral-200 rounded-2xl p-6 bg-white">
              <h2 className="font-semibold mb-3 flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Take or upload a picture
              </h2>

              <p className="text-sm text-neutral-600 mb-4">
                On mobile, this can open your camera. On laptop, it will open the file picker.
              </p>

              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center justify-center gap-3 border border-dashed border-neutral-300 rounded-xl py-10 cursor-pointer hover:bg-neutral-50">
                  <Upload className="w-6 h-6 text-neutral-500" />
                  <span className="font-medium text-neutral-800">
                    Tap to take a photo or choose from gallery
                  </span>
                  <span className="text-xs text-neutral-500">
                    JPG / PNG, up to ~10 MB
                  </span>
                </div>
              </label>
            </div>

            <div className="border border-neutral-200 rounded-2xl p-4 bg-neutral-50">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                How this works
              </h3>
              <ul className="text-sm text-neutral-600 space-y-1 list-disc list-inside">
                <li>Take a clear photo of one item (no messy background).</li>
                <li>We’ll suggest name, category, colour and style tags.</li>
                <li>Later we can connect this to your AI backend.</li>
              </ul>
            </div>
          </div>

          {/* Right side: preview + fake analysis */}
          <div className="space-y-4">
            <div className="border border-neutral-200 rounded-2xl p-6 bg-white min-h-[260px] flex flex-col items-center justify-center">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-64 rounded-xl object-contain"
                />
              ) : (
                <p className="text-neutral-500 text-sm">
                  No image yet. Take or upload a photo on the left.
                </p>
              )}
            </div>

            <div className="border border-neutral-200 rounded-2xl p-6 bg-white">
              <h2 className="font-semibold mb-3">Scan result</h2>

              {isAnalyzing && (
                <p className="text-neutral-600 text-sm">
                  Analysing your item… ✨
                </p>
              )}

              {!isAnalyzing && result && (
                <div className="space-y-2 text-sm text-neutral-700">
                  <p>
                    <span className="font-semibold">Name:</span> {result.name}
                  </p>
                  <p>
                    <span className="font-semibold">Category:</span>{" "}
                    {result.category}
                  </p>
                  <p>
                    <span className="font-semibold">Colour:</span>{" "}
                    {result.color}
                  </p>
                  <p>
                    <span className="font-semibold">Style tags:</span>{" "}
                    {result.styleTags.join(", ")}
                  </p>
                  <Button
                    className="mt-3 w-full"
                    onClick={() => alert("Later this will save to your wardrobe.")}
                  >
                    Save to wardrobe (coming soon)
                  </Button>
                </div>
              )}

              {!isAnalyzing && !result && (
                <p className="text-neutral-500 text-sm">
                  Once you upload a photo, a basic analysis will appear here.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
