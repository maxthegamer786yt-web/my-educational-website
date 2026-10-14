import React from 'react';
import { BookOpen, CheckCircle, Clock, FileText, ArrowLeft } from 'lucide-react';

export function PanicOverlay({ onDismiss, panicKey }) {
  return (
    <div className="fixed inset-0 z-50 bg-[#f8fafc] text-[#1e293b] font-sans overflow-y-auto">
      {/* Classroom Style Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[#137333] text-white flex items-center justify-center font-bold text-lg">
            C
          </div>
          <div>
            <h1 className="text-base font-semibold text-slate-800 leading-tight">
              AP World History: Modern · Period 4
            </h1>
            <div className="text-xs text-slate-500">
              Instructor: Dr. Harrison · Room 304
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="hidden sm:inline text-slate-500">Student Portal</span>
          <button
            onClick={onDismiss}
            title={`Exit disguise (or press [${panicKey}])`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Resume Arcade</span>
          </button>
        </div>
      </header>

      {/* Classroom Content Body */}
      <main className="max-w-4xl mx-auto py-8 px-6 space-y-6">
        <div className="rounded-xl bg-[#137333] text-white p-6 shadow-sm">
          <div className="text-xs font-mono uppercase tracking-wider text-green-200 mb-1">
            UNIT 4: TRANSOCEANIC INTERCONNECTIONS (1450–1750)
          </div>
          <h2 className="text-2xl font-bold mb-2">
            Technological Innovations &amp; Maritime Empires
          </h2>
          <p className="text-sm text-green-50 max-w-2xl leading-relaxed">
            Review primary source documents regarding caravel design, astrolabe navigation, and the Columbian Exchange economic shifts.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
            Upcoming Coursework &amp; Classwork
          </h3>

          <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">
                  Document Analysis: Columbian Biological Exchange
                </h4>
                <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                  <Clock className="w-3 h-3" />
                  <span>Due Tomorrow, 11:59 PM</span>
                  <span>·</span>
                  <span>100 Points</span>
                </div>
              </div>
            </div>
            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded">
              Assigned
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">
                  Chapter 14 Reading Check: Ottoman &amp; Safavid Consolidation
                </h4>
                <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                  <span>Completed Oct 12</span>
                  <span>·</span>
                  <span className="text-emerald-700 font-medium">Score: 98/100</span>
                </div>
              </div>
            </div>
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
              Turned In
            </span>
          </div>
        </div>

        <div className="text-center pt-8 text-[11px] text-slate-400">
          Press <kbd className="font-mono bg-slate-200 px-1.5 py-0.5 rounded text-slate-700 font-bold">{panicKey}</kbd> or click Resume Arcade to return.
        </div>
      </main>
    </div>
  );
}
