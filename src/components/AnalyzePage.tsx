/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FileText, Link, Image, Compass, AlertCircle, ChevronRight, Sparkles } from 'lucide-react';

interface AnalyzePageProps {
  onAnalyze: (content: string, type: 'text' | 'url' | 'image') => Promise<void>;
  isAnalyzing: boolean;
}

export default function AnalyzePage({ onAnalyze, isAnalyzing }: AnalyzePageProps) {
  const [activeTab, setActiveTab] = useState<'text' | 'url' | 'image'>('text');
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [imageInput, setImageInput] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Loader state phrases
  const [loaderPhase, setLoaderPhase] = useState(0);
  const loaderPhases = [
    "Retrieving text content and formatting metrics...",
    "Scanning linguistic syntax for sensationalism and emotional markers...",
    "Cross-referencing claims with official agency databases...",
    "Assessing source network trust parameters & bias indexes...",
    "Formulating Media and Information Literacy reflection prompts..."
  ];

  React.useEffect(() => {
    let interval: any;
    if (isAnalyzing) {
      setLoaderPhase(0);
      interval = setInterval(() => {
        setLoaderPhase((prev) => (prev < loaderPhases.length - 1 ? prev + 1 : prev));
      }, 1500);
    } else {
      setLoaderPhase(0);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  // Preset claims for instant testing
  const presets = [
    {
      label: "🛸 Space Discovery",
      text: "NASA Classifed leaks reveal Kepler-452b astrobiology teams discovered sentient technosignatures! Major governmental agency coverup admitted!!",
      type: "text" as const
    },
    {
      label: "🌿 Herbal Cancer Treatment",
      text: "Doctors are shocked! Oncology experts reveal this simple dandelion herb extract destroys cancer cells completely within 48 hours. Take natural remedies!",
      type: "text" as const
    },
    {
      label: "🗳️ Election Auditing",
      text: "URGENT BREAKING: Partisan networks uncover tens of thousands of unregistered ballots dumped in trash during regional election recount operations. Massive fraud!",
      type: "text" as const
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'text' && textInput.trim()) {
      onAnalyze(textInput, 'text');
    } else if (activeTab === 'url' && urlInput.trim()) {
      onAnalyze(urlInput, 'url');
    } else if (activeTab === 'image' && imagePreview) {
      onAnalyze("Analyzing uploaded claim image: " + (imageInput?.name || "unidentified claim"), 'image');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setImageInput(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageInput(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="analyze-view">
      
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-display font-black text-slate-900 tracking-tight">
          Analyze Digital Information
        </h1>
        <p className="text-slate-500 mt-2 max-w-lg mx-auto">
          Evaluate headlines, social posts, forwards, or claims. Let AI outline cognitive biases and guide your verification methodology.
        </p>
      </div>

      {isAnalyzing ? (
        /* Engaging Loader */
        <div className="bg-white border border-slate-100 rounded-3xl p-8 sm:p-12 shadow-xs text-center flex flex-col items-center justify-center min-h-[350px] animate-fade-in">
          <div className="p-4 bg-blue-50 text-[#0057A8] rounded-full mb-6 relative">
            <Compass className="h-12 w-12 text-[#0057A8] animate-spin" />
            <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-amber-500 ring-2 ring-white"></span>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Analyzing Claims...</h3>
          <p className="text-slate-400 text-xs font-mono mb-6">MIL COMPASS EVALUATION PROTOCOL</p>
          
          <div className="w-full max-w-sm bg-slate-100 h-2 rounded-full overflow-hidden mb-4">
            <div 
              className="bg-[#0057A8] h-full transition-all duration-1000 ease-out" 
              style={{ width: `${((loaderPhase + 1) / loaderPhases.length) * 100}%` }}
            ></div>
          </div>
          
          <p className="text-sm font-semibold text-slate-600 animate-pulse min-h-[40px] max-w-md">
            {loaderPhases[loaderPhase]}
          </p>

          <div className="mt-8 flex items-center gap-2 text-slate-400 text-xs font-medium">
            <AlertCircle className="h-4 w-4" />
            Teaching independent navigation, not simple true/false tags.
          </div>
        </div>
      ) : (
        /* Simple Distraction Free Card */
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs">
          
          {/* Tabs header */}
          <div className="flex border-b border-slate-100 mb-6">
            <button
              onClick={() => setActiveTab('text')}
              className={`flex items-center gap-2 pb-3.5 px-4 font-semibold text-sm transition-all border-b-2 cursor-pointer ${
                activeTab === 'text'
                  ? 'border-[#0057A8] text-[#0057A8]'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
              id="tab-btn-text"
            >
              <FileText className="h-4 w-4" />
              Text Claims
            </button>
            <button
              onClick={() => setActiveTab('url')}
              className={`flex items-center gap-2 pb-3.5 px-4 font-semibold text-sm transition-all border-b-2 cursor-pointer ${
                activeTab === 'url'
                  ? 'border-[#0057A8] text-[#0057A8]'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
              id="tab-btn-url"
            >
              <Link className="h-4 w-4" />
              URL Article
            </button>
            <button
              onClick={() => setActiveTab('image')}
              className={`flex items-center gap-2 pb-3.5 px-4 font-semibold text-sm transition-all border-b-2 cursor-pointer ${
                activeTab === 'image'
                  ? 'border-[#0057A8] text-[#0057A8]'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
              id="tab-btn-image"
            >
              <Image className="h-4 w-4" />
              Claim Image
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Text Input Tab */}
            {activeTab === 'text' && (
              <div className="space-y-4 animate-fade-in">
                <textarea
                  id="claim-text-area"
                  rows={6}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Paste a news article, WhatsApp message, social media post, or claim..."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white rounded-2xl p-4 text-slate-800 placeholder-slate-400 focus:outline-hidden transition-all text-sm leading-relaxed"
                ></textarea>

                {/* Presets */}
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-[#F9A825]" />
                    Or Select a Quick Preset to Test:
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    {presets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setTextInput(preset.text)}
                        className="text-left bg-slate-50 hover:bg-blue-50/50 border border-slate-200/60 hover:border-blue-200 text-xs font-semibold px-3 py-2 rounded-xl text-slate-600 hover:text-[#0057A8] transition-all cursor-pointer"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* URL Input Tab */}
            {activeTab === 'url' && (
              <div className="space-y-4 animate-fade-in">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Link className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="url"
                    id="claim-url-input"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example-news-blog.org/article/nasa-coverup-aliens"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white rounded-2xl pl-11 pr-4 py-4 text-slate-800 placeholder-slate-400 focus:outline-hidden transition-all text-sm"
                  />
                </div>
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex gap-3 text-xs text-slate-500">
                  <span className="p-1.5 bg-white text-[#0057A8] rounded-md h-fit font-bold shadow-2xs">ℹ</span>
                  <p className="leading-relaxed">
                    Our AI models parse URL signals, tracking the domain's credibility index and identifying if it follows clickbait structures or features suspicious sourcing records.
                  </p>
                </div>
              </div>
            )}

            {/* Image Input Tab */}
            {activeTab === 'image' && (
              <div className="space-y-4 animate-fade-in">
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center cursor-pointer transition-all ${
                    dragActive
                      ? 'border-[#0057A8] bg-blue-50/30'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50'
                  }`}
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <input
                    type="file"
                    id="image-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imagePreview ? (
                    <div className="space-y-3">
                      <img
                        src={imagePreview}
                        alt="Claim Preview"
                        className="max-h-48 rounded-xl object-contain mx-auto shadow-xs"
                      />
                      <p className="text-xs text-slate-400">Click or drag another image to change file</p>
                    </div>
                  ) : (
                    <>
                      <div className="p-3 bg-white border border-slate-100 text-slate-400 rounded-xl mb-4 shadow-2xs">
                        <Image className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-bold text-slate-700">Drag & drop your screenshot claim</p>
                      <p className="text-xs text-slate-400 mt-1">Supports PNG, JPG, or JPEG up to 5MB</p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Large Submit Button */}
            <button
              type="submit"
              disabled={
                (activeTab === 'text' && !textInput.trim()) ||
                (activeTab === 'url' && !urlInput.trim()) ||
                (activeTab === 'image' && !imagePreview)
              }
              className="w-full bg-[#0057A8] hover:bg-blue-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold py-4 px-6 rounded-xl shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group text-base"
              id="analyze-submit-btn"
            >
              Analyze Information
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>

          </form>
        </div>
      )}

    </div>
  );
}
