"use client";

import { Upload, Download, Trash2, FileText } from "lucide-react";
import { useDocuments } from "@/hooks/document";

export default function DocumentsSection() {
  const {
    documents,
    selectedFile,
    setSelectedFile,
    uploadForm,
    setUploadForm,
    loading,
    handleUpload,
    handleDelete,
    handleDownload,
    formatDate
  } = useDocuments();

  if (loading) return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg border p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">My Documents</h2>
      <p className="text-gray-600 mb-6">Upload and manage your resumes and cover letters</p>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 text-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload New Document</h3>
          <p className="text-sm text-gray-600 mb-4">Drag & drop files here or click to browse</p>
          
          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="hidden"
            id="file-input"
            accept=".pdf,.doc,.docx"
          />
          
          <label
            htmlFor="file-input"
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            Choose File {selectedFile && `- ${selectedFile.name}`}
          </label>

          {selectedFile && (
            <div className="mt-4 flex flex-col gap-3">
              <input
                type="text"
                placeholder="Document Name"
                value={uploadForm.doc_name}
                onChange={(e) => setUploadForm(prev => ({ ...prev, doc_name: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              
              <select
                value={uploadForm.doc_type}
                onChange={(e) => setUploadForm(prev => ({ ...prev, doc_type: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="Resume">Resume</option>
                <option value="Cover Letter">Cover Letter</option>
                <option value="Certificate">Certificate</option>
                <option value="Portfolio">Portfolio</option>
              </select>
              
              <button
                onClick={handleUpload}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Upload
              </button>
            </div>
          )}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Documents</h3>
        
        {documents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No documents uploaded yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Document Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date Uploaded</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Size</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc, index) => (
                  <tr key={doc.doc_id} className={index !== documents.length - 1 ? 'border-b border-gray-200' : ''}>
                    <td className="px-4 py-4 text-sm text-gray-900">{doc.doc_name}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{doc.doc_type}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{formatDate(doc.createdAt)}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{doc.size} KB</td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDownload(doc)}
                          className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center gap-1"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                        <button
                          onClick={() => handleDelete(doc.doc_id)}
                          className="px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <button 
          onClick={() => window.location.href = '/dashboard'}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
