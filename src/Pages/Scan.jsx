// src/Pages/Scan.jsx
import React, { useRef, useState } from "react";
import Layout from "../Layout";
import { Button } from "../Components/ui/button";
import { Camera, Upload, Sparkles, CheckCircle2 } from "lucide-react";

const WARDROBE_KEY = "styleai_wardrobe";
const LEGACY_WARDROBE_KEY = "styleAI-wardrobe";

const categoryOptions = [
  { value: "top", label: "Top" },
  { value: "bottom", label: "Bottom" },
  { value: "outerwear", label: "Outerwear" },
  { value: "shoes", label: "Shoes" },
  { value: "accessory", label: "Accessory" },
];

const fakeAnalysis = (fileName = "") => {
  const name = fileName.toLowerCase();
  if (name.includes("jean") || name.includes("denim")) {
    return {
      name: "Relaxed blue denim",
      category: "bottom",
      colour: "Indigo",
      styleTags: ["denim", "casual"],
    };
  }
  if (name.includes("shoe") || name.includes("boot")) {
    return {
      name: "Textured leather boots",
      category: "shoes",
      colour: "Black",
      styleTags: ["elevated", "night-out"],
    };
  }
  if (name.includes("coat") || name.includes("jacket")) {
    return {
      name: "Minimalist outer layer",
      category: "outerwear",
      colour: "Charcoal",
      styleTags: ["layering", "street"],
    };
  }
  return {
    name: "Cropped tech tee",
    category: "top",
    colour: "Carbon",
    styleTags: ["minimal", "sporty"],
  };
};

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function Scan() {
  const [preview, setPreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [saveMessage, setSaveMessage] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSaveMessage("");
    setResult(null);
    setIsAnalyzing(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      setPreview(dataUrl);
      setTimeout(() => {
        const analysis = fakeAnalysis(file.name);
        setResult({
          ...analysis,
          image: dataUrl,
        });
        setIsAnalyzing(false);
      }, 900);
    } catch (err) {
      setIsAnalyzing(false);
      setSaveMessage("We couldn't read that file. Try again.");
    }
  };

  const handleSave = () => {
    if (typeof window === "undefined") return;
    if (!preview || !result) {
      setSaveMessage("Upload an item to save it.");
      return;
    }

    const wardrobeRaw =
      window.localStorage.getItem(WARDROBE_KEY) ||
      window.localStorage.getItem(LEGACY_WARDROBE_KEY);
    const parsed = wardrobeRaw ? JSON.parse(wardrobeRaw) : [];
    const wardrobeArray = Array.isArray(parsed) ? parsed : [];

    const newItem = {
      id: `scan-${Date.now()}`,
      imageUrl: preview,
      image: preview,
      name: result.name,
      title: result.name,
      brand: "Saved from Scan",
      category: result.category,
      colour: result.colour,
      createdAt: Date.now(),
      tags: result.styleTags || [],
    };

    try {
      window.localStorage.setItem(
        WARDROBE_KEY,
        JSON.stringify([newItem, ...wardrobeArray])
      );
      setSaveMessage("Saved to your wardrobe.");
      setResult((prev) => prev && { ...prev, saved: true });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setSaveMessage("Couldn't save right now. Please retry.");
    }
  };

  return (
    <Layout currentPageName="Scan">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-neutral-50 mb-2">
            Scan your wardrobe
          </h1>
          <p className="text-neutral-400">
            Upload or snap a photo. We’ll fake the AI, then save the item to Wardrobe.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Left side: upload / camera */}
          <div className="space-y-4">
            <div className="border border-pink-500/20 rounded-2xl p-6 bg-neutral-900/70 shadow-xl shadow-pink-500/10">
              <h2 className="font-semibold mb-3 flex items-center gap-2 text-neutral-50">
                <Camera className="w-5 h-5 text-pink-300" />
                Take or upload a picture
              </h2>

              <p className="text-sm text-neutral-400 mb-4">
                On mobile, this can open your camera. On laptop, it will open the file picker.
              </p>

              <label className="block">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center justify-center gap-3 border border-dashed border-pink-500/40 rounded-xl py-10 cursor-pointer hover:bg-pink-500/5">
                  <Upload className="w-6 h-6 text-pink-300" />
                  <span className="font-medium text-neutral-100">
                    Tap to take a photo or choose from gallery
                  </span>
                  <span className="text-xs text-neutral-500">
                    JPG / PNG, up to ~10 MB
                  </span>
                </div>
              </label>
            </div>

            <div className="border border-pink-500/20 rounded-2xl p-4 bg-neutral-900/60">
              <h3 className="font-semibold mb-2 flex items-center gap-2 text-neutral-100">
                <Sparkles className="w-4 h-4 text-pink-300" />
                How this works
              </h3>
              <ul className="text-sm text-neutral-400 space-y-1 list-disc list-inside">
                <li>Take a clear photo of one item (no messy background).</li>
                <li>We’ll suggest name, category, colour and style tags.</li>
                <li>Save it to feed Wardrobe and the Outfit generator.</li>
              </ul>
            </div>
          </div>

          {/* Right side: preview + fake analysis */}
          <div className="space-y-4">
            <div className="border border-pink-500/20 rounded-2xl p-6 bg-neutral-900/70 min-h-[260px] flex flex-col items-center justify-center shadow-xl shadow-pink-500/10">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-72 rounded-xl object-contain border border-pink-500/20 bg-neutral-950"
                />
              ) : (
                <p className="text-neutral-500 text-sm">
                  No image yet. Take or upload a photo on the left.
                </p>
              )}
            </div>

            <div className="border border-pink-500/20 rounded-2xl p-6 bg-neutral-900/80 shadow-xl shadow-pink-500/10 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-neutral-50">Scan result</h2>
                {result?.saved && (
                  <span className="inline-flex items-center gap-1 text-xs text-pink-200">
                    <CheckCircle2 className="h-4 w-4" />
                    Saved
                  </span>
                )}
              </div>

              {isAnalyzing && (
                <p className="text-neutral-400 text-sm">
                  Analysing your item… ✨
                </p>
              )}

              {!isAnalyzing && result && (
                <div className="space-y-3 text-sm text-neutral-200">
                  <label className="space-y-1">
                    <span className="text-neutral-400 text-xs uppercase tracking-[0.2em]">
                      Suggested name
                    </span>
                    <input
                      value={result.name}
                      onChange={(e) => setResult((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full rounded-xl bg-neutral-950 border border-neutral-700 px-3 py-2 text-neutral-100 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30"
                    />
                  </label>

                  <label className="space-y-1 block">
                    <span className="text-neutral-400 text-xs uppercase tracking-[0.2em]">
                      Category
                    </span>
                    <select
                      value={result.category}
                      onChange={(e) => setResult((prev) => ({ ...prev, category: e.target.value }))}
                      className="w-full rounded-xl bg-neutral-950 border border-neutral-700 px-3 py-2 text-neutral-100 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30"
                    >
                      {categoryOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-1 block">
                    <span className="text-neutral-400 text-xs uppercase tracking-[0.2em]">
                      Colour
                    </span>
                    <input
                      value={result.colour}
                      onChange={(e) => setResult((prev) => ({ ...prev, colour: e.target.value }))}
                      className="w-full rounded-xl bg-neutral-950 border border-neutral-700 px-3 py-2 text-neutral-100 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30"
                    />
                  </label>

                  <div className="space-y-2">
                    <span className="text-neutral-400 text-xs uppercase tracking-[0.2em]">
                      Style tags
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {(result.styleTags || []).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-pink-500/15 border border-pink-500/40 px-3 py-1 text-xs text-pink-100"
                        >
                          {tag}
                        </span>
                      ))}
                      {(result.styleTags || []).length === 0 && (
                        <span className="text-neutral-500 text-xs">We&apos;ll add tags for you</span>
                      )}
                    </div>
                  </div>

                  <Button
                    className="mt-3 w-full bg-pink-500 text-neutral-900 hover:bg-pink-400"
                    onClick={handleSave}
                  >
                    Save to wardrobe
                  </Button>
                  {saveMessage && (
                    <p className="text-xs text-pink-200">{saveMessage}</p>
                  )}
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
