import React, { useState } from 'react';

interface CoverLetterGeneratorProps {
  resumeText: string;
  jobDescription: string;
}

export const CoverLetterGenerator: React.FC<CoverLetterGeneratorProps> = ({ resumeText, jobDescription }) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = async (tone?: string) => {
    if (!resumeText || !jobDescription) return;
    
    setIsLoading(true);
    try {
      const resp = await fetch("/api/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription, tone }),
      });
      
      if (!resp.ok) throw new Error("Generation failed");
      const data = await resp.json();
      setContent(data.content);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">AI Cover Letter Generator</h3>
          <p className="text-sm text-slate-500">Tailored to your resume and the target job description.</p>
        </div>
        <div className="flex gap-2">
          {content && (
            <div className="hidden md:flex bg-slate-100 p-1 rounded-lg">
              <button 
                onClick={() => generate("professional")}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors"
                title="Rewrite with professional tone"
              >
                👔 Prof.
              </button>
              <button 
                onClick={() => generate("enthusiastic")}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors"
                title="Rewrite with enthusiastic tone"
              >
                🔥 Enth.
              </button>
            </div>
          )}
          <button 
            onClick={() => generate()}
            disabled={isLoading || !resumeText || !jobDescription}
            className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Writing...' : content ? 'Regenerate' : 'Generate Letter'}
          </button>
        </div>
      </div>

      {!content && !isLoading && (
        <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/30">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-slate-400 font-medium">Click generate to create your tailored cover letter.</p>
        </div>
      )}

      {isLoading && (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">AI is crafting your letter...</p>
        </div>
      )}

      {content && !isLoading && (
        <div className="relative group">
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-bold text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm"
            >
              {copied ? 'Copied!' : 'Copy Text'}
            </button>
          </div>
          <div className="p-8 bg-slate-50 border border-slate-100 rounded-xl font-serif text-slate-800 whitespace-pre-wrap leading-relaxed shadow-inner max-h-[600px] overflow-y-auto">
            {content}
          </div>
        </div>
      )}
    </div>
  );
};

export default CoverLetterGenerator;
