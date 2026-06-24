import React, { useState } from 'react';

interface UploadZoneProps {
  onFileSelected: (file: File) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file) onFileSelected(file);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div 
        className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-200 ${
          isDragging 
            ? 'border-indigo-500 bg-indigo-50/50 ring-4 ring-indigo-50' 
            : 'border-slate-200 bg-white hover:border-slate-300'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { 
          e.preventDefault(); 
          setIsDragging(false); 
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
          }
        }}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept=".pdf,.docx,.txt"
          onChange={(e) => e.target.files && handleFile(e.target.files[0])}
        />
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 mb-2">Upload your resume</h3>
        <p className="text-slate-500 mb-8 max-w-sm mx-auto">
          Drag and drop your PDF or Word document here, or click to browse files.
        </p>
        
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="px-8 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all"
        >
          Browse Files
        </button>
        
        <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-center gap-8">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-widest">
            <span className="w-6 h-6 flex items-center justify-center bg-slate-50 rounded border border-slate-100">PDF</span>
            <span>Supported</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-widest">
            <span className="w-6 h-6 flex items-center justify-center bg-slate-50 rounded border border-slate-100">DOCX</span>
            <span>Supported</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadZone;
