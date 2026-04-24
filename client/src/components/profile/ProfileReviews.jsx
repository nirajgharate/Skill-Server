import React from "react";
import { motion } from "framer-motion";
import { Star, MessageSquare, Filter } from "lucide-react";

export default function ProfileReviews() {
  const reviews = [
    {
      id: 1,
      workerName: "Sunil Verma",
      service: "Full Home Sanitization",
      rating: 5,
      date: "2 days ago",
      comment:
        "Absolutely professional. Arrived exactly on time and the quality of work was world-class.",
      tags: ["On-time", "Professional"],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end px-2">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
          Service Feedback
        </h3>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-md border border-slate-200 flex flex-col md:flex-row items-center gap-10">
        <div className="text-center md:text-left border-b md:border-b-0 md:border-r border-slate-200 pb-6 md:pb-0 md:pr-10">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
            Overall Quality
          </p>
          <div className="flex items-center gap-3">
            <h2 className="text-5xl font-black tracking-tighter text-slate-900">
              4.9
            </h2>
            <div className="flex text-amber-400">
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 w-full">
          <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 w-[95%]" />
          </div>
          <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-[90%]" />
          </div>
        </div>
      </div>

      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-white/60 backdrop-blur-xl border border-white rounded-[2rem] p-8 shadow-sm"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <MessageSquare size={18} />
              </div>
              <h4 className="font-black text-slate-900 tracking-tight">
                {review.service}
              </h4>
            </div>
            <span className="text-[10px] font-bold text-slate-300 uppercase">
              {review.date}
            </span>
          </div>
          <p className="text-sm font-medium text-slate-600">
            "{review.comment}"
          </p>
        </div>
      ))}
    </div>
  );
}
