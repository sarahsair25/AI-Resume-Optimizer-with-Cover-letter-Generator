"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import UploadZone from "@/components/UploadZone";
import JobDescriptionInput from "@/components/JobDescriptionInput";
import MatchScore from "@/components/MatchScore";
import BulletRewriter from "@/components/BulletRewriter";
import CoverLetterGenerator from "@/components/CoverLetterGenerator";
import { AnalysisResponse, UploadResponse, ParseResponse } from "@/types/api";

import TestimonialRequest from "@/components/TestimonialRequest";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"optimizer" | "cover-letter">("optimizer");
  const [resumeBullets, setResumeBullets] = useState<string[]>([]);
  const [resumeText, setResumeText] = useState("");
  const [resumeId, setResumeId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [step, setStep] = useState<"input" | "result">("input");
  const [error, setError] = useState("");

  const handleFileSelected = async (file: File) => {
    setError("");
    setIsAnalyzing(true);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const uploadResp = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      if (!uploadResp.ok) throw new Error("Upload failed");
      const uploadData: UploadResponse = await uploadResp.json();
      
      const parseResp = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId: uploadData.id }),
      });
      
      if (!parseResp.ok) throw new Error("Parsing failed");
      const parseData: ParseResponse = await parseResp.json();
      
      setResumeText(parseData.text);
      setResumeId(parseData.resumeId);
      
      const allBullets = parseData.sections.flatMap(s => s.bulletPoints);
      setResumeBullets(allBullets);
    } catch (err) {
      setError("Failed to process resume. Please try pasting text instead.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText || !jobDescription) {
      setError("Please provide both a resume and a job description.");
      return;
    }
    
    setError("");
    setIsAnalyzing(true);
    
    try {
      const resp = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeId: resumeId || "text-input",
          resumeText,
          jobDescription,
        }),
      });
      
      if (!resp.ok) throw new Error("Analysis failed");
      const result: AnalysisResponse = await resp.json();
      
      setAnalysisResult(result);
      setStep("result");
    } catch (err) {
      setError("Analysis failed. Please try again.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setStep("input");
    setAnalysisResult(null);
  };

  return (
    <DashboardLayout pageTitle={step === "input" ? "Analyze Resume" : "Analysis Results"}>
      {step === "input" ? (
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Start your optimization</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Upload your resume and paste the job description you're targeting. Our AI will analyze the match and suggest improvements.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
              <UploadZone onFileSelected={handleFileSelected} />
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm font-medium">
                  <span className="bg-slate-50 px-4 text-slate-400 uppercase tracking-widest text-[10px]">Or Paste Text</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Resume Text</label>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume content here..."
                  className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-6">
              <JobDescriptionInput 
                value={jobDescription} 
                onChange={setJobDescription} 
                onAnalyze={handleAnalyze}
              />
              
              {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-sm font-medium flex items-center gap-3">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              {isAnalyzing && (
                <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200 shadow-sm animate-pulse">
                  <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-600 font-medium">AI is analyzing your resume...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <button 
              onClick={reset}
              className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Input
            </button>

            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => setActiveTab("optimizer")}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === "optimizer" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                Resume Optimizer
              </button>
              <button 
                onClick={() => setActiveTab("cover-letter")}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === "cover-letter" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                Cover Letter
              </button>
            </div>
            
            <div className="flex gap-3">
              <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-white transition-colors">Download PDF</button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">Apply Improvements</button>
            </div>
          </div>

          {activeTab === "optimizer" ? (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-6">
                {analysisResult && (
                  <MatchScore 
                    score={analysisResult.score} 
                    categories={[
                      { label: "Keyword Match", value: analysisResult.scoreBreakdown?.keywordMatch ?? analysisResult.score },
                      { label: "Relevance", value: analysisResult.scoreBreakdown?.relevance ?? Math.min(100, analysisResult.score + 5) },
                      { label: "Impact", value: analysisResult.scoreBreakdown?.impact ?? Math.max(0, analysisResult.score - 10) },
                      { label: "Formatting", value: analysisResult.scoreBreakdown?.formatting ?? 95 }
                    ]}
                  />
                )}
                
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Keywords</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-bold text-emerald-600 uppercase mb-2">Matched</p>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult?.matchedKeywords.map(kw => (
                          <span key={kw} className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-md border border-emerald-100 font-medium">
                            ✓ {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-rose-500 uppercase mb-2">Missing</p>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult?.missingKeywords.map(kw => (
                          <span key={kw} className="px-2 py-1 bg-rose-50 text-rose-700 text-xs rounded-md border border-rose-100 font-medium">
                            + {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <BulletRewriter initialBullets={resumeBullets} />
                
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Summary Assessment</h3>
                  <p className="text-slate-600 leading-relaxed italic">
                    {analysisResult?.summary || analysisResult?.suggestions?.[0] || "Your resume shows strong alignment with the technical requirements, but could benefit from more quantifiable achievements in the bullet points."}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <CoverLetterGenerator resumeText={resumeText} jobDescription={jobDescription} />
            </div>
          )}

          <div className="max-w-4xl mx-auto pt-12 pb-8">
            <TestimonialRequest />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
