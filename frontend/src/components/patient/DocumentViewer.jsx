// frontend/src/components/patient/DocumentViewer.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiDownload, FiExternalLink, FiInfo, FiX } from 'react-icons/fi';
import patientService from '../../services/patientService';

function DocumentViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        const data = await patientService.getDocument(id);
        setDocument(data);
      } catch (err) {
        setError(err.message || 'Failed to load document');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDocument();
    }
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHeaderVisible(false);
      } else {
        setHeaderVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleBack = () => {
    navigate('/patient-dashboard');
  };

  const renderDocumentContent = () => {
    if (!document || !document.fileURL) {
      return <p className="text-[#0077B6]">No document content available</p>;
    }

    const { mimeType, fileURL, fileName } = document;

    if (mimeType && mimeType.startsWith('image/')) {
      return (
        <div className="flex justify-center items-center h-full">
          <motion.img 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            src={fileURL} 
            alt={fileName}
            className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
          />
        </div>
      );
    } else if (mimeType === 'application/pdf') {
      return (
        <div className="w-full h-full">
          <iframe
            src={fileURL}
            className="w-full h-full border-0 rounded-lg shadow-lg"
            title={fileName}
          />
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <FiDownload className="text-[#48CAE4] text-5xl mb-4" />
          <h3 className="text-xl font-semibold text-[#48CAE4] mb-2">Download Required</h3>
          <p className="text-[#0077B6] mb-6 max-w-md">
            This document format is not directly viewable in the browser. Please download it to view the contents.
          </p>
          <a
            href={fileURL}
            download={fileName}
            className="bg-gradient-to-r from-[#0077B6] to-[#03045E] text-white font-semibold py-3 px-6 rounded-lg hover:from-[#48CAE4] hover:to-[#0077B6] transition-all duration-300 flex items-center shadow-md"
          >
            <FiDownload className="mr-2" />
            Download Document
          </a>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#48CAE4]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-[#ADEBF4] backdrop-blur-md rounded-xl border border-[#48CAE4]/30"
        >
          <h2 className="text-xl font-semibold text-[#03045E] mb-4">Error Loading Document</h2>
          <p className="text-[#0077B6] mb-6">{error}</p>
          <button
            onClick={handleBack}
            className="bg-gradient-to-r from-[#0077B6] to-[#03045E] text-white font-semibold py-2 px-6 rounded-lg hover:from-[#48CAE4] hover:to-[#0077B6] transition-all duration-300"
          >
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-[#CAF0F8] backdrop-blur-md rounded-xl p-6 shadow-lg border border-[#48CAE4]/30 h-full relative"
      >
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ 
            y: headerVisible ? 0 : -100,
            opacity: headerVisible ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          className="flex justify-between items-center mb-6 pb-4 border-b border-[#48CAE4]/30"
        >
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              className="p-2 bg-[#90E0EF] text-[#03045E] rounded-lg hover:bg-[#48CAE4] transition-colors"
              aria-label="Go back"
            >
              <FiArrowLeft />
            </motion.button>
            
            <div>
              <h1 className="text-xl font-bold text-[#03045E] truncate max-w-xs">
                {document?.fileName || 'Document Viewer'}
              </h1>
              {document?.fileType && (
                <p className="text-[#0077B6] text-sm">{document.fileType}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {document?.fileURL && (
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={document.fileURL}
                download={document.fileName}
                className="p-2 bg-[#90E0EF] text-[#03045E] rounded-lg hover:bg-[#48CAE4] transition-colors"
                aria-label="Download document"
              >
                <FiDownload />
              </motion.a>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowInfo(!showInfo)}
              className={`p-2 rounded-lg transition-colors ${
                showInfo 
                  ? 'bg-[#48CAE4] text-white' 
                  : 'bg-[#90E0EF] text-[#03045E] hover:bg-[#48CAE4]'
              }`}
              aria-label="Toggle document info"
            >
              <FiInfo />
            </motion.button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="relative h-[calc(100%-5rem)]">
          <div className="bg-[#ADEBF4] backdrop-blur-md rounded-xl p-4 border border-[#48CAE4]/30 h-full">
            {renderDocumentContent()}
          </div>

          {/* Info Panel */}
          <AnimatePresence>
            {showInfo && document && (
              <motion.div
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute top-0 right-0 h-full w-80 bg-[#CAF0F8] backdrop-blur-md rounded-xl border border-[#48CAE4]/30 shadow-lg z-10"
              >
                <div className="p-5 h-full flex flex-col">
                  <div className="flex justify-between items-center mb-5 pb-3 border-b border-[#48CAE4]/30">
                    <h2 className="text-lg font-semibold text-[#03045E]">Document Details</h2>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowInfo(false)}
                      className="p-1 text-[#03045E] hover:text-[#0077B6] rounded-full"
                      aria-label="Close info panel"
                    >
                      <FiX />
                    </motion.button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[#0077B6] text-sm font-medium mb-1">File Name</label>
                        <p className="text-[#03045E] text-sm break-words">{document.fileName}</p>
                      </div>
                      
                      <div>
                        <label className="block text-[#0077B6] text-sm font-medium mb-1">File Type</label>
                        <p className="text-[#03045E] text-sm">{document.fileType}</p>
                      </div>
                      
                      {document.mimeType && (
                        <div>
                          <label className="block text-[#0077B6] text-sm font-medium mb-1">MIME Type</label>
                          <p className="text-[#03045E] text-sm">{document.mimeType}</p>
                        </div>
                      )}
                      
                      {document.fileSize && (
                        <div>
                          <label className="block text-[#0077B6] text-sm font-medium mb-1">File Size</label>
                          <p className="text-[#03045E] text-sm">
                            {(document.fileSize / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      )}
                      
                      <div>
                        <label className="block text-[#0077B6] text-sm font-medium mb-1">Upload Date</label>
                        <p className="text-[#03045E] text-sm">
                          {new Date(document.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      
                      {document.uploadedBy && (
                        <div>
                          <label className="block text-[#0077B6] text-sm font-medium mb-1">Uploaded By</label>
                          <p className="text-[#03045E] text-sm">{document.uploadedBy}</p>
                        </div>
                      )}
                      
                      {document.description && (
                        <div>
                          <label className="block text-[#0077B6] text-sm font-medium mb-1">Description</label>
                          <p className="text-[#03045E] text-sm">{document.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {document.fileURL && (
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      href={document.fileURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 flex items-center justify-center py-2 px-4 bg-[#90E0EF] text-[#03045E] rounded-lg border border-[#48CAE4]/30 hover:bg-[#48CAE4] hover:text-white transition-colors text-sm"
                    >
                      <FiExternalLink className="mr-2" />
                      Open in new tab
                    </motion.a>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(72, 202, 228, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(72, 202, 228, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(72, 202, 228, 0.5);
        }
      `}</style>
    </div>
  );
}

export default DocumentViewer;