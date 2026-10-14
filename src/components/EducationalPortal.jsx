import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  CheckCircle,
  Clock,
  FileText,
  KeyRound,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Lock,
  Unlock,
  ExternalLink,
  ChevronRight,
  FolderOpen,
  Calendar,
  Sparkles
} from 'lucide-react';
import { verifyAndConsumeCode, isDeviceAuthorized, isAdminUser } from '../utils/accessManager.js';

export function EducationalPortal({ onEnterArcade, panicKey = ']' }) {
  const isAuthorized = isDeviceAuthorized();
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('stream');

  const handleVerifyCode = (e) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setErrorMsg('Please enter a class code or access pass.');
      return;
    }

    const res = verifyAndConsumeCode(passcode);
    if (res.success) {
      setErrorMsg('');
      setIsSuccess(true);
      setTimeout(() => {
        onEnterArcade(res.isAdmin);
      }, 600);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleDirectEntry = () => {
    if (isAuthorized) {
      onEnterArcade(isAdminUser());
    } else {
      setShowCodeModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1e293b] font-sans flex flex-col selection:bg-green-100">
      {/* Google Classroom Style Header */}
      <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#137333] text-white flex items-center justify-center font-bold text-xl shadow-xs">
            C
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold text-slate-800 leading-tight">
                AP World History: Modern
              </h1>
              <span className="text-xs text-slate-400 font-normal">· Period 4</span>
            </div>
            <div className="text-xs text-slate-500 hidden sm:block">
              Oakridge High School · Dr. Harrison · Room 304
            </div>
          </div>
        </div>

        {/* Navigation & Secret Entry Point */}
        <div className="flex items-center gap-3">
          {/* Subtle Secret Trigger */}
          {isAuthorized ? (
            <button
              onClick={handleDirectEntry}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#137333] hover:bg-[#0f5b28] text-white rounded-lg text-xs font-semibold transition-colors shadow-xs cursor-pointer"
              title={`Switch to Arcade (or press [${panicKey}])`}
            >
              <span>Resume Arcade</span>
              <kbd className="hidden sm:inline bg-green-900/40 px-1 py-0.2 rounded text-[10px] font-mono">[{panicKey}]</kbd>
            </button>
          ) : (
            <button
              onClick={() => setShowCodeModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 transition-colors cursor-pointer"
              title="Enter Class Code"
            >
              <KeyRound className="w-3.5 h-3.5 text-slate-500" />
              <span>Join with Code</span>
            </button>
          )}

          <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-xs font-semibold text-slate-600">
            S
          </div>
        </div>
      </header>

      {/* Classroom Sub-Nav Tabs */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto flex gap-8 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('stream')}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'stream'
                ? 'border-[#137333] text-[#137333] font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Stream
          </button>
          <button
            onClick={() => setActiveTab('classwork')}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'classwork'
                ? 'border-[#137333] text-[#137333] font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Classwork
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'resources'
                ? 'border-[#137333] text-[#137333] font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Study Resources
          </button>
        </div>
      </div>

      {/* Main Educational Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 space-y-6">
        {/* Realistic Hero Banner: Unit 4 */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#137333] via-[#188038] to-[#0f5b28] text-white p-6 sm:p-8 shadow-sm">
          <div className="max-w-2xl">
            <span className="text-xs font-mono font-bold tracking-wider text-green-200 uppercase bg-green-900/40 px-2 py-0.5 rounded">
              UNIT 4: TRANSOCEANIC INTERCONNECTIONS (1450–1750)
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2 mb-3">
              Technological Innovations &amp; Maritime Empires
            </h2>
            <p className="text-sm text-green-50 leading-relaxed mb-4">
              Focus on how cross-cultural interactions in navigational technologies (astrolabe, caravel, magnetic compass) facilitated European oceanic exploration and the Columbian Exchange.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-green-100">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Next Exam: Friday, Oct 24</span>
              <span>·</span>
              <span>Teacher: Dr. Harrison</span>
            </div>
          </div>
        </div>

        {/* Content Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Upcoming Deadlines & Student Resources */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Upcoming Deadlines
              </h3>
              <ul className="space-y-3 text-xs">
                <li className="pb-2 border-b border-slate-100">
                  <div className="font-semibold text-slate-800">Columbian Biological Exchange Analysis</div>
                  <div className="text-slate-500 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-500" />
                    <span>Due Tomorrow, 11:59 PM</span>
                  </div>
                </li>
                <li className="pb-2 border-b border-slate-100">
                  <div className="font-semibold text-slate-800">Ottoman &amp; Safavid Consolidation Q&amp;A</div>
                  <div className="text-slate-500 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Due Monday, 8:00 AM</span>
                  </div>
                </li>
                <li>
                  <div className="font-semibold text-slate-800">Unit 4 Vocab Flashcards</div>
                  <div className="text-slate-500 mt-0.5">Assigned · 50 Points</div>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Class Code Access
              </h3>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                Have a course registration key or access pass? Enter it to unlock your student profile modules.
              </p>
              <button
                onClick={() => setShowCodeModal(true)}
                className="w-full py-2 px-3 text-xs font-medium text-[#137333] hover:text-[#0f5b28] bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200 text-center cursor-pointer"
              >
                Enter Enrollment Code →
              </button>
            </div>
          </div>

          {/* Right Column: Class Stream & Assignments */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between pb-1">
              <h3 className="text-sm font-bold text-slate-800">
                Coursework Stream
              </h3>
              <span className="text-xs text-slate-500">Semester 1</span>
            </div>

            {/* Assignment 1 */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 leading-snug">
                      Document Analysis: Columbian Biological Exchange &amp; Cash Crops
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Analyze Excerpt 3 from Alfred Crosby's thesis. Detail how sugarcane plantations transformed demographics in the Caribbean and Americas.
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-3">
                      <span className="text-amber-600 font-medium">Due Tomorrow · 11:59 PM</span>
                      <span>·</span>
                      <span>100 Points</span>
                    </div>
                  </div>
                </div>
                <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded shrink-0">
                  Assigned
                </span>
              </div>
            </div>

            {/* Assignment 2 */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 leading-snug">
                      Chapter 14 Reading Check: Ottoman, Safavid &amp; Mughal Empires
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Review completed. Score released on student portal.
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-3">
                      <span>Turned in Oct 12</span>
                      <span>·</span>
                      <span className="text-emerald-700 font-semibold">Score: 98 / 100</span>
                    </div>
                  </div>
                </div>
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded shrink-0">
                  Graded
                </span>
              </div>
            </div>

            {/* Assignment 3 */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                    <FolderOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 leading-snug">
                      Unit 4 Map Activity: Silver Trade &amp; Potosí Mines
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Interactive global trade route map depicting the Manila Galleons and Chinese silver demand.
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-3">
                      <span>Turned in Oct 8</span>
                      <span>·</span>
                      <span className="text-emerald-700 font-semibold">Score: 100 / 100</span>
                    </div>
                  </div>
                </div>
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded shrink-0">
                  Graded
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Secret Passcode Entry Modal */}
      <AnimatePresence>
        {showCodeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#137333] text-white flex items-center justify-center">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Course Access Key
                  </h3>
                </div>
                <button
                  onClick={() => setShowCodeModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Enter your enrollment key or 1-time access pass. Your device will be permanently saved.
              </p>

              <form onSubmit={handleVerifyCode} className="space-y-3">
                <div>
                  <input
                    type="text"
                    autoFocus
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="ENTER ACCESS CODE"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 font-mono text-xs font-bold text-slate-900 tracking-wider uppercase focus:outline-none focus:border-[#137333] focus:ring-1 focus:ring-[#137333]"
                  />
                </div>

                {errorMsg && (
                  <div className="p-2.5 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCodeModal(false)}
                    className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-[#137333] hover:bg-[#0f5b28] rounded-lg transition-colors shadow-xs"
                  >
                    {isSuccess ? 'Verified...' : 'Submit Code'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Classroom Footer */}
      <footer className="mt-12 py-6 border-t border-slate-200 text-center text-xs text-slate-400 bg-white">
        <div>Google Classroom · Oakridge District Educational Portal · Academic Year 2026</div>
      </footer>
    </div>
  );
}
