// src/admin/AdminPanel.jsx

import React, { useEffect, useState } from "react";
import { toast } from "sonner"; 
import AdminLayout from "./AdminLayout";
import Dashboard from "./Dashboard";
import PropertyList from "./PropertyList";
import AddProperty from "./AddProperty";

// =====================================================================
// 🔥 PLACEHOLDERS FOR NEW FEATURES (To be separated into their own files)
// =====================================================================

const ContactQueries = ({ queries }) => (
  <div className="p-10 text-center">
    <h2 className="text-2xl font-bold mb-2">User Queries & Contact Requests</h2>
    <p className="text-slate-500 mb-4">View all inquiries from visitors directly from the frontend.</p>
  </div>
);

const BlogList = ({ onEdit }) => (
  <div className="p-10 text-center">
    <h2 className="text-2xl font-bold">Blog Management</h2>
    <p className="text-slate-500 mb-4">Manage your real estate articles with cover images.</p>
    <button onClick={() => onEdit(null)} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Add New Blog</button>
  </div>
);

const AddBlog = ({ onCancel }) => (
  <div className="p-10 text-center">
    <h2 className="text-2xl font-bold">Add / Edit Blog</h2>
    <p className="text-slate-500 mb-4">Form will include: Title, Content, and a <b>Single Cover Image Upload</b>.</p>
    <button onClick={onCancel} className="mt-4 bg-slate-200 px-4 py-2 rounded-lg text-slate-800">Go Back</button>
  </div>
);

const VideoList = ({ onEdit }) => (
  <div className="p-10 text-center">
    <h2 className="text-2xl font-bold">Video Management</h2>
    <p className="text-slate-500 mb-4">Manage property tours and promotional videos.</p>
    <button onClick={() => onEdit(null)} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Add New Video Link</button>
  </div>
);

const AddVideo = ({ onCancel }) => (
  <div className="p-10 text-center">
    <h2 className="text-2xl font-bold">Add / Edit Video</h2>
    <p className="text-slate-500 mb-4">Form will include: Title and a <b>Video URL input (YouTube/Vimeo)</b> to auto-embed.</p>
    <button onClick={onCancel} className="mt-4 bg-slate-200 px-4 py-2 rounded-lg text-slate-800">Go Back</button>
  </div>
);

const ReportList = ({ onEdit }) => (
  <div className="p-10 text-center">
    <h2 className="text-2xl font-bold">Market Reports</h2>
    <p className="text-slate-500 mb-4">Upload and update market analysis reports.</p>
    <button onClick={() => onEdit(null)} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Add New Report</button>
  </div>
);

const AddReport = ({ onCancel }) => (
  <div className="p-10 text-center">
    <h2 className="text-2xl font-bold">Add / Edit Report</h2>
    <p className="text-slate-500 mb-4">Form will include: Title and File/Data upload.</p>
    <button onClick={onCancel} className="mt-4 bg-slate-200 px-4 py-2 rounded-lg text-slate-800">Go Back</button>
  </div>
);
// =====================================================================

export default function AdminPanel() {
  const API_BASE = "http://127.0.0.1:8000/api";
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role") || "admin"; // "admin" or "broker"

  const [page, setPage] = useState("dashboard");
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  // States for all dynamic data
  const [listings, setListings] = useState([]);
  const [queries, setQueries] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [videos, setVideos] = useState([]);
  const [reports, setReports] = useState([]);

  async function fetchAllData() {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      // Fetch data based on roles
      const fetchPromises = [
        fetch(`${API_BASE}/properties`, { headers }),
        fetch(`${API_BASE}/blogs`, { headers }),
        fetch(`${API_BASE}/videos`, { headers }),
        fetch(`${API_BASE}/reports`, { headers })
      ];

      // Only admins should fetch contact queries
      if (userRole === "admin") {
        fetchPromises.push(fetch(`${API_BASE}/contacts`, { headers }));
      }

      const responses = await Promise.all(fetchPromises);
      
      const propData = await responses[0].json();
      const blogData = await responses[1].json();
      const vidData = await responses[2].json();
      const repData = await responses[3].json();

      setListings(Array.isArray(propData) ? propData : []);
      setBlogs(Array.isArray(blogData) ? blogData : []);
      setVideos(Array.isArray(vidData) ? vidData : []);
      setReports(Array.isArray(repData) ? repData : []);

      if (userRole === "admin" && responses[4]) {
        const queriesData = await responses[4].json();
        setQueries(Array.isArray(queriesData) ? queriesData : []);
      }

    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
      toast.error("Failed to sync with server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAllData();
  }, []);

  async function saveEntity(endpoint, formData) {
    try {
      toast.loading(`Saving data...`, { id: "save-toast" });
      const url = editing ? `${API_BASE}/${endpoint}/${editing.id}` : `${API_BASE}/${endpoint}`;
      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        // If sending FormData (like images for blogs), you should REMOVE the Content-Type header so the browser sets the boundary automatically.
        // We will handle that specific logic in the AddBlog / AddProperty components.
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save");

      toast.success(`Successfully saved!`, { id: "save-toast" });
      setEditing(null);
      setPage("dashboard");
      fetchAllData(); 
    } catch (err) {
      console.error(err);
      toast.error(`Error saving data.`, { id: "save-toast" });
    }
  }

  async function deleteEntity(endpoint, id) {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      toast.loading("Deleting...", { id: "delete-toast" });
      const res = await fetch(`${API_BASE}/${endpoint}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Delete failed");

      toast.success("Item deleted permanently.", { id: "delete-toast" });
      fetchAllData();
    } catch (err) {
      toast.error("Failed to delete item.", { id: "delete-toast" });
    }
  }

  const handleNavigate = (newPage) => {
    setEditing(null); 
    setPage(newPage);
  };

  function renderPage() {
    switch (page) {
      case "dashboard":
        return <Dashboard properties={listings} queries={queries} role={userRole} loading={loading} />;

      // --- PROPERTIES ---
      case "buy":
      case "sell":
      case "rent":
        return (
          <PropertyList
            title={`${page.charAt(0).toUpperCase() + page.slice(1)} Properties`}
            listings={listings.filter((l) => l.category === page || l.type === page)}
            loading={loading}
            onEdit={(item) => { setEditing(item); setPage("add-property"); }}
            onDelete={(id) => deleteEntity("properties", id)}
          />
        );
      case "add-property":
        return <AddProperty onSave={(data) => saveEntity("properties", data)} editing={editing} onCancel={() => handleNavigate("dashboard")} />;

      // --- ADMIN CONTENT: BLOGS, VIDEOS, REPORTS ---
      case "blogs":
        return <BlogList blogs={blogs} onEdit={(item) => { setEditing(item); setPage("add-blog"); }} onDelete={(id) => deleteEntity("blogs", id)} />;
      case "add-blog":
        return <AddBlog onSave={(data) => saveEntity("blogs", data)} editing={editing} onCancel={() => handleNavigate("blogs")} />;

      case "videos":
        return <VideoList videos={videos} onEdit={(item) => { setEditing(item); setPage("add-video"); }} onDelete={(id) => deleteEntity("videos", id)} />;
      case "add-video":
        return <AddVideo onSave={(data) => saveEntity("videos", data)} editing={editing} onCancel={() => handleNavigate("videos")} />;

      case "reports":
        return <ReportList reports={reports} onEdit={(item) => { setEditing(item); setPage("add-report"); }} onDelete={(id) => deleteEntity("reports", id)} />;
      case "add-report":
        return <AddReport onSave={(data) => saveEntity("reports", data)} editing={editing} onCancel={() => handleNavigate("reports")} />;

      // --- CONTACT QUERIES ---
      case "queries":
        return userRole === "admin" ? <ContactQueries queries={queries} /> : <div className="p-10 text-center text-red-500 font-bold">Access Denied.</div>;

      default:
        return <Dashboard properties={listings} queries={queries} role={userRole} loading={loading} />;
    }
  }

  return (
    <AdminLayout page={page} setPage={handleNavigate} role={userRole}>
      {renderPage()}
    </AdminLayout>
  );
}