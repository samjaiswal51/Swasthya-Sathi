// frontend/src/components/patient/MedicalDocuments.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUploadCloud, FiFileText, FiImage, FiTrash2, FiEye, FiX, FiPlus } from 'react-icons/fi';
import patientService from '../../services/patientService';

function MedicalDocuments() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState('Lab Report');
  const [uploading, setUploading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const fetchDocuments = async () => {
    try {
      setListLoading(true);
      const data = await patientService.getDocuments();
      if (Array.isArray(data)) {
        setDocuments(data);
      } else {
        setDocuments([]);
      }
    } catch (err) {
      setError(err.message);
      setDocuments([]);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    setError('');
    setMessage('');
    
    if (!file) {
      setSelectedFile(null);
      return;
    }

    // Client-side file type validation
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'text/plain'];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.txt'];
    
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!allowedTypes.includes(file.type) || !allowedExtensions.includes(fileExtension)) {
      setError('❌ Only JPG, PNG, and TXT files are supported. Please select a valid file.');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // File size validation (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('❌ File size too large. Maximum 5MB allowed.');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setSelectedFile(file);
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }
    setUploading(true);
    setError('');
    setMessage('');
    const formData = new FormData();
    formData.append('document', selectedFile);
    formData.append('fileType', fileType);
    try {
      await patientService.uploadDocument(formData);
      setMessage('Document uploaded successfully!');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      await fetchDocuments();
    } catch (err) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      setError('');
      setMessage('');
      await patientService.deleteDocument(documentId);
      setMessage('Document deleted successfully!');
      setDocuments(documents.filter((doc) => doc._id !== documentId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleView = (docId) => {
    navigate(`/patient-dashboard/document-viewer/${docId}`);
  };

  const getFileIcon = (mimeType) => {
    if (mimeType && mimeType.startsWith('image/')) {
      return <FiImage className="text-[#0077B6] text-2xl" />;
    }
    return <FiFileText className="text-[#0077B6] text-2xl" />;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="h-full">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#CAF0F8]/30 backdrop-blur-md rounded-xl p-6 shadow-lg border border-[#00B4D8]/20 h-full"
      >
        <h1 className="text-2xl font-bold text-[#FFFFFF] mb-6">My Medical Documents</h1>
        
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100%-4rem)]">
          {/* Left Column - Upload Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full lg:w-2/5"
          >
            <div className="bg-white backdrop-blur-md rounded-xl p-5 border border-[#00B4D8]/30 shadow-md h-full">
              <h2 className="text-lg font-semibold text-[#03045E] mb-4 pb-2 border-b border-[#00B4D8]/30">Upload New Document</h2>
              
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-200 text-sm"
                >
                  {error}
                </motion.div>
              )}
              
              {message && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg border border-green-200 text-sm"
                >
                  {message}
                </motion.div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4 h-[calc(100%-6rem)] flex flex-col">
                <div 
                  className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 flex flex-col items-center justify-center flex-1 ${
                    dragActive 
                      ? 'border-[#0077B6] bg-[#CAF0F8]/50' 
                      : 'border-[#48CAE4]/50 hover:border-[#0077B6]'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept=".jpg,.jpeg,.png,.txt,image/jpeg,image/jpg,image/png,text/plain"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  />
                  
                  <FiUploadCloud className="text-[#0077B6] text-4xl mb-3" />
                  <p className="text-[#03045E] font-medium">
                    Drag & drop your file here
                  </p>
                  <p className="text-[#0077B6] text-sm mt-1">
                    or click to browse (Max 5MB)
                  </p>
                  <p className="text-[#0077B6] text-xs mt-2">
                    Supported: JPG, PNG, TXT
                  </p>
                </div>
                
                {selectedFile && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-[#CAF0F8] rounded-lg p-3 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      {getFileIcon(selectedFile.type)}
                      <span className="text-[#03045E] text-sm truncate">{selectedFile.name}</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={clearFile}
                      className="text-[#0077B6] hover:text-[#03045E]"
                    >
                      <FiX />
                    </button>
                  </motion.div>
                )}
                
                <div>
                  <label className="block text-[#03045E] text-sm font-medium mb-2">
                    Document Type
                  </label>
                  <select 
                    value={fileType} 
                    onChange={(e) => setFileType(e.target.value)} 
                    className="w-full bg-white border border-[#00B4D8]/30 rounded-lg px-4 py-2.5 text-[#03045E] focus:outline-none focus:ring-2 focus:ring-[#0077B6] text-sm"
                  >
                    <option value="Prescription">Prescription</option>
                    <option value="Lab Report">Lab Report</option>
                    <option value="Scan">Scan</option>
                    <option value="Invoice">Invoice</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <button 
                  type="submit" 
                  disabled={uploading || !selectedFile}
                  className="w-full bg-gradient-to-r from-[#0096C7] to-[#0077B6] text-white font-semibold py-3 rounded-lg hover:from-[#00B4D8] hover:to-[#0096C7] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm shadow-md"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : 'Upload Document'}
                </button>
              </form>
            </div>
          </motion.div>
          
          {/* Right Column - Document Grid */}
          <div className="w-full lg:w-3/5 flex flex-col">
            <h2 className="text-lg font-semibold text-[#FFFFFF] mb-4">Your Documents</h2>
            
            {listLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="bg-white backdrop-blur-md rounded-xl p-5 border border-[#00B4D8]/30 shadow-md h-40 animate-pulse"></div>
                ))}
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-2 custom-scrollbar"
              >
                <AnimatePresence>
                  {documents.length > 0 ? (
                    documents.map((doc) => (
                      <motion.div
                        key={doc._id}
                        variants={itemVariants}
                        layout
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="group bg-white backdrop-blur-md rounded-xl p-5 border border-[#00B4D8]/30 shadow-md hover:border-[#0077B6]/50 transition-all duration-300 hover:scale-[1.02]"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-2 bg-[#CAF0F8] rounded-lg">
                            {getFileIcon(doc.mimeType)}
                          </div>
                          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button 
                              onClick={() => handleView(doc._id)}
                              className="p-2 bg-[#CAF0F8] text-[#0077B6] rounded-lg hover:bg-[#90E0EF] transition-colors"
                            >
                              <FiEye />
                            </button>
                            <button 
                              onClick={() => handleDelete(doc._id)}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </div>
                        
                        <h3 className="text-[#03045E] font-semibold truncate mb-1 text-sm">{doc.fileName}</h3>
                        <p className="text-[#0077B6] text-xs mb-2">Type: {doc.fileType}</p>
                        <p className="text-[#0077B6] text-xs">
                          Uploaded: {new Date(doc.createdAt).toLocaleDateString()}
                        </p>
                        {doc.fileSize && (
                          <p className="text-[#0077B6] text-xs mt-1">
                            Size: {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                          </p>
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="col-span-2 text-center py-12"
                    >
                      <FiFileText className="mx-auto text-[#48CAE4] text-4xl mb-3" />
                      <p className="text-[#FFFFFF]">No documents uploaded yet.</p>
                      <p className="text-[#FFFFFF] text-sm">Upload your first document to get started.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 180, 216, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 180, 216, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 180, 216, 0.5);
        }
      `}</style>
    </div>
  );
}

export default MedicalDocuments;