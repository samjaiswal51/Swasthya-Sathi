import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUploadCloud, FiTrash2, FiFile, FiX, FiCheck } from "react-icons/fi";
import pdfDocumentService from "../../services/pdfDocumentService";

function PdfSummarizer() {
  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 120, damping: 14 } },
    exit: { y: -20, opacity: 0, transition: { duration: 0.2 } },
  };

  const columnVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  // Fetch documents
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const fetchedDocuments = await pdfDocumentService.getDocuments();
        setDocuments(fetchedDocuments);
      } catch (err) {
        setError(err.message || "Failed to fetch documents.");
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length) handleFileSelection(files[0]);
  };

  const handleFileSelection = (file) => {
    setError("");
    setMessage("");
    if (!file) {
      setSelectedFile(null);
      return;
    }
    if (file.type !== "application/pdf") {
      setError("Invalid file type. Please select a PDF.");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File is too large. Maximum size is 10MB.");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setSelectedFile(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFileSelection(file);
  };

  const clearSelection = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first.");
      return;
    }
    setUploading(true);
    setUploadProgress(0);
    setError("");
    setMessage("");
    const formData = new FormData();
    formData.append("document", selectedFile);
    try {
      const newDocument = await pdfDocumentService.uploadDocument(
        formData,
        (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      );
      setDocuments([newDocument, ...documents]);
      setMessage("File uploaded and summarized successfully!");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError(err.message || "Upload failed.");
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleDelete = async (docId) => {
    if (!window.confirm("Are you sure you want to delete this document and its summary?")) return;
    try {
      await pdfDocumentService.deleteDocument(docId);
      setDocuments(documents.filter((doc) => doc._id !== docId));
      setMessage("Document deleted successfully.");
    } catch (err) {
      setError(err.message || "Failed to delete document.");
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " bytes";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  // Simple format function for generated summaries
  const formatSummary = (summary) => {
    if (!summary) return "";
    return summary.replace(/•/g, '\n• ').replace(/\n{3,}/g, '\n\n').trim();
  };

  return (
    <div className="h-full">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#CAF0F8]/30 backdrop-blur-md rounded-xl p-6 shadow-lg border border-[#00B4D8]/20 h-full"
      >
        <h2 className="text-2xl font-bold text-[#FFFFFF] mb-6">PDF Document Summarizer</h2>
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100%-4rem)]">
          {/* Left Column */}
          <motion.div
            variants={columnVariants}
            initial="hidden"
            animate="visible"
            className="w-full lg:w-2/5 lg:sticky lg:top-6 h-fit"
          >
            <div className="bg-white backdrop-blur-md rounded-xl p-5 border border-[#00B4D8]/30 shadow-md">
              <h3 className="font-semibold mb-4 text-[#03045E] text-lg">Upload PDF for Analysis</h3>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-700 bg-red-100 p-3 rounded-lg mb-4 text-sm border border-red-200"
                >
                  {error}
                </motion.div>
              )}
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-700 bg-green-100 p-3 rounded-lg mb-4 text-sm border border-green-200"
                >
                  {message}
                </motion.div>
              )}
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center ${
                  isDragging ? "border-[#0077B6] bg-[#CAF0F8]/50" : "border-[#48CAE4]/50 hover:border-[#0077B6]"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="application/pdf"
                  className="hidden"
                />
                {selectedFile ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
                    <FiCheck className="text-[#0077B6] text-4xl mb-3" />
                    <p className="text-[#03045E] font-medium truncate max-w-full text-sm">{selectedFile.name}</p>
                    <p className="text-[#0077B6] text-xs mt-1">{formatFileSize(selectedFile.size)}</p>
                    <button onClick={(e) => { e.stopPropagation(); clearSelection(); }} className="mt-3 text-[#0077B6] hover:text-[#03045E] flex items-center text-xs">
                      <FiX className="mr-1" /> Remove file
                    </button>
                  </motion.div>
                ) : uploading ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                    <div className="relative w-16 h-16 mb-3">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle className="text-[#0096C7]/30 stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent"></circle>
                        <circle
                          className="text-[#0077B6] stroke-current"
                          strokeWidth="8"
                          strokeLinecap="round"
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          strokeDasharray="251.2"
                          strokeDashoffset={251.2 - (uploadProgress / 100) * 251.2}
                          transform="rotate(-90 50 50)"
                        ></circle>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-[#0077B6] font-semibold text-sm">{uploadProgress}%</div>
                    </div>
                    <p className="text-[#03045E] text-sm">Uploading...</p>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center">
                    <FiUploadCloud className="text-[#0077B6] text-4xl mb-4" />
                    <p className="text-[#03045E] font-medium mb-1 text-sm">Drag & Drop PDF here</p>
                    <p className="text-[#0077B6] text-xs">or</p>
                    <p className="text-[#03045E] font-medium mt-1 text-sm">Click to Browse</p>
                    <p className="text-[#0077B6] text-xs mt-3">Max file size: 10MB</p>
                  </motion.div>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUpload}
                disabled={uploading || !selectedFile}
                className="w-full mt-6 py-3 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-[#0096C7] to-[#0077B6] hover:from-[#00B4D8] hover:to-[#0096C7] transition-all shadow-md text-sm"
              >
                {uploading ? `Processing...` : "Upload & Summarize"}
              </motion.button>
            </div>
          </motion.div>
          {/* Right Column */}
          <motion.div
            variants={columnVariants}
            initial="hidden"
            animate="visible"
            className="w-full lg:w-3/5 flex flex-col"
          >
            <div className="bg-white backdrop-blur-md rounded-xl p-5 border border-[#00B4D8]/30 shadow-md h-full flex flex-col">
              <h3 className="font-semibold mb-4 text-[#03045E] text-lg">Document Summaries</h3>
              {loading ? (
                <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 rounded-lg bg-[#CAF0F8]/30 animate-pulse">
                      <div className="h-5 bg-[#48CAE4]/20 rounded w-3/4 mb-4"></div>
                      <div className="h-3 bg-[#48CAE4]/20 rounded w-full mb-2"></div>
                      <div className="h-3 bg-[#48CAE4]/20 rounded w-5/6 mb-2"></div>
                      <div className="h-3 bg-[#48CAE4]/20 rounded w-4/5 mb-4"></div>
                      <div className="h-2 bg-[#48CAE4]/20 rounded w-1/3"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  <AnimatePresence>
                    {documents.length > 0 ? (
                      documents.map((doc) => (
                        <motion.div
                          key={doc._id}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          whileHover={{ scale: 1.02 }}
                          className="p-4 rounded-xl bg-white border border-[#00B4D8]/30 hover:border-[#0077B6]/50 transition-all cursor-default shadow-sm"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-[#03045E] hover:text-[#0077B6] hover:underline break-words flex items-center text-sm">
                              <FiFile className="mr-2 flex-shrink-0" />
                              <span className="truncate">{doc.originalFilename}</span>
                            </a>
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleDelete(doc._id)} className="p-2 text-[#0077B6] hover:text-white hover:bg-red-500/20 rounded-lg transition-colors" aria-label="Delete document">
                              <FiTrash2 />
                            </motion.button>
                          </div>
                          <div className="mb-4">
                            <h4 className="text-[#0077B6] text-xs font-semibold mb-2 uppercase tracking-wide">Summary</h4>
                            <div className="text-[#03045E] text-sm leading-relaxed bg-[#CAF0F8] p-4 rounded-lg border border-[#00B4D8]/30">
                              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                                {formatSummary(doc.summary)}
                              </pre>
                            </div>
                          </div>
                          <div className="text-xs text-[#0077B6]">
                            Uploaded on: {new Date(doc.createdAt).toLocaleDateString()}
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-10 text-[#0077B6] flex-1 flex items-center justify-center">
                        <div>
                          <FiUploadCloud className="text-4xl mx-auto mb-3 text-[#0077B6]" />
                          <p className="text-sm">No documents yet. Upload a PDF to get started.</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0, 180, 216, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 180, 216, 0.3); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0, 180, 216, 0.5); }
      `}</style>
    </div>
  );
}

export default PdfSummarizer;