import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { workerService } from "../../services/api.service";

export default function WorkerWorkPhotos() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const loadWorker = async () => {
    setLoading(true);
    try {
      if (authUser?._id) {
        const profile = await workerService.getProfile(authUser._id);
        setWorker(profile);
      } else {
        const storedWorker = localStorage.getItem("skillserverUser");
        if (storedWorker) {
          setWorker(JSON.parse(storedWorker));
        }
      }
    } catch (err) {
      console.error("Worker profile fetch failed:", err);
      setError("Unable to load your profile. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorker();
  }, [authUser?._id]);

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    setError(null);
    setMessage(null);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const uploadSelectedPhoto = () => {
    if (!selectedFile) {
      setError("Please choose a photo first.");
      return;
    }

    setUploading(true);
    setError(null);
    setMessage(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const imageData = reader.result;
      if (!imageData || typeof imageData !== "string") {
        setError("Unable to read the selected photo.");
        setUploading(false);
        return;
      }

      const nextPortfolio = Array.isArray(worker?.portfolio)
        ? [...worker.portfolio]
        : [];
      nextPortfolio.push({
        url: imageData,
        mediaType: "photo",
        name: selectedFile.name,
        uploadedAt: new Date().toISOString(),
      });

      try {
        const updatedWorker =
          await workerService.uploadWorkPhoto(nextPortfolio);
        setWorker(updatedWorker);
        localStorage.setItem("skillserverUser", JSON.stringify(updatedWorker));
        setSelectedFile(null);
        setPreviewUrl(null);
        setMessage("Work photo uploaded successfully.");
      } catch (err) {
        console.error("Work photo upload failed:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to upload work photo. Please try again.",
        );
      } finally {
        setUploading(false);
      }
    };

    reader.readAsDataURL(selectedFile);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-14 h-14 border-4 border-slate-300 border-t-indigo-600 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-28 pb-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-semibold mb-6"
          >
            <ArrowLeft size={18} /> Back
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-indigo-600 mb-2">
                Upload Work Photos
              </p>
              <h1 className="text-3xl font-black text-slate-900">
                Share your completed work with customers
              </h1>
            </div>
            <div className="rounded-3xl bg-slate-50 border border-slate-200 px-5 py-4">
              <p className="text-slate-500 text-xs uppercase tracking-[0.2em] mb-2">
                Portfolio count
              </p>
              <p className="text-3xl font-black text-slate-900">
                {Array.isArray(worker?.portfolio) ? worker.portfolio.length : 0}
              </p>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm text-slate-600 mb-3">
                Choose a photo of your completed work and upload it to your
                public worker detail profile.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <label
                  htmlFor="workPhotoInput"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-2xl font-semibold cursor-pointer hover:bg-indigo-700 transition-all"
                >
                  <Upload size={16} /> Choose Photo
                </label>
                <input
                  id="workPhotoInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <button
                  onClick={uploadSelectedPhoto}
                  disabled={uploading || !selectedFile}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-900 rounded-2xl font-semibold hover:bg-slate-100 transition-all disabled:opacity-60"
                >
                  {uploading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />{" "}
                      Uploading...
                    </>
                  ) : (
                    "Upload"
                  )}
                </button>
              </div>
              {previewUrl && (
                <div className="mt-5 rounded-3xl overflow-hidden border border-slate-200">
                  <img
                    src={previewUrl}
                    alt="Selected work preview"
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}
            </div>

            {message && (
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700 font-semibold">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} />
                  <span>{message}</span>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-red-700 font-semibold">
                <div className="flex items-center gap-3">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              </div>
            )}

            {Array.isArray(worker?.portfolio) && worker.portfolio.length > 0 ? (
              <div className="space-y-4">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">
                  Recent Work Gallery
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {worker.portfolio.slice(-6).map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 h-40"
                    >
                      <img
                        src={item.url}
                        alt={item.name || `Work photo ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-600">
                No work photos uploaded yet. Upload a photo to show your
                portfolio on your public worker profile.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
