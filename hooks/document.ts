import { useState, useEffect } from "react";
import { Document, UploadForm } from "@/types/type";
import { API_URL } from '@/lib/constants';

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadForm, setUploadForm] = useState<UploadForm>({
    doc_name: "",
    doc_type: "Resume",
    app_id: "",
  });

  const getToken = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
  };

  const fetchDocuments = async () => {
    const token = getToken();
    if (!token) {
      alert("Please login first!");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/document`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      setDocuments(data.data || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
      alert("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileSelect = (file: File | null) => {
    if (!file) return;
    setSelectedFile(file);
    setUploadForm((prev) => ({
      ...prev,
      doc_name: file.name,
    }));
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    const token = getToken();
    if (!token) {
      alert("Please login first!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("doc_name", uploadForm.doc_name);
      formData.append("doc_type", uploadForm.doc_type);
      if (uploadForm.app_id) {
        formData.append("app_id", uploadForm.app_id);
      }

      const res = await fetch(`${API_URL}/document`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      await fetchDocuments();
      setSelectedFile(null);
      setUploadForm({ doc_name: "", doc_type: "Resume", app_id: "" });

    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload document");
    }
  };

  const handleDelete = async (docId: number) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/document/${docId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Delete failed");
      setDocuments((docs) => docs.filter((doc) => doc.doc_id !== docId));

    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete document");
    }
  };
  const handleDownload = async (doc: Document) => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(
        `${API_URL}/document/${doc.doc_id}/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = doc.doc_name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download document");
    }
  };
  const formatDate = (date: string | number | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return {
    documents,
    selectedFile,
    setSelectedFile: handleFileSelect,
    uploadForm,
    setUploadForm,
    loading,
    fetchDocuments,
    handleUpload,
    handleDelete,
    handleDownload,
    formatDate,
  };
};
