import React from "react";
// --- PRIMARY IMPORTS ---
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileInfo from "../../components/profile/ProfileInfo";
import ProfileBookings from "../../components/profile/ProfileBookings";
import ProfileQuickActions from "../../components/profile/ProfileQuickActions";
import ProfileActivity from "../../components/profile/ProfileActivity";

// --- NEW COMPONENT IMPORTS (Commented out until you create the files) ---
import ProfileInsights from "../../components/profile/ProfileInsights";
import ProfileReviews from "../../components/profile/ProfileReviews";
import ProfileSecurity from "../../components/profile/ProfileSecurity";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-24 pb-20 px-4 md:px-8 relative overflow-hidden">
      {/* 1. ATMOSPHERE: Subtle premium glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        {/* 2. TRUST HEADER & ANALYTICS */}
        <section className="space-y-10">
          <ProfileHeader />
          <ProfileInsights />{" "}
          {/* Uncomment this only after creating ProfileInsights.jsx */}
        </section>

        {/* 3. MAIN DASHBOARD GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT COLUMN: PRIMARY DATA (8 Cols) */}
          <div className="lg:col-span-8 space-y-10">
            <ProfileBookings />
            <ProfileInfo />
            <ProfileReviews />{" "}
            {/* Uncomment this only after creating ProfileReviews.jsx */}
          </div>

          {/* RIGHT COLUMN: ACCOUNT & SECURITY (4 Cols) */}
          <aside className="lg:col-span-4 space-y-10">
            <ProfileQuickActions />
            <ProfileSecurity />{" "}
            {/* Uncomment this only after creating ProfileSecurity.jsx */}
            <ProfileActivity />
          </aside>
        </div>
      </div>
    </div>
  );
}
