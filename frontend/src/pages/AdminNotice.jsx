import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AdminSidebar from "../components/AdminSidebar";
import Navbar from "../components/Navbar";

const AdminNotice = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", content: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://smart-mess-backend.vercel.app/api/notice/all", {
        withCredentials: true,
      });
      setNotices(res.data);
    } catch (err) {
      toast.error("Failed to fetch notices.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update
        await axios.put(
          `https://smart-mess-backend.vercel.app/api/notice/update/${editingId}`,
          form,
          { withCredentials: true }
        );
        toast.success("Notice updated successfully.");
      } else {
        // Create
        await axios.post(
          "https://smart-mess-backend.vercel.app/api/notice/create",
          form,
          { withCredentials: true }
        );
        toast.success("Notice created successfully.");
      }
      setForm({ title: "", content: "" });
      setEditingId(null);
      fetchNotices();
    } catch (err) {
      toast.error("Failed to submit notice.");
    }
  };

  const handleEdit = (notice) => {
    setForm({ title: notice.title, content: notice.content });
    setEditingId(notice._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) return;
    try {
      await axios.delete(`https://smart-mess-backend.vercel.app/api/notice/delete/${id}`, {
        withCredentials: true,
      });
      toast.success("Notice deleted.");
      fetchNotices();
    } catch (err) {
      toast.error("Failed to delete notice.");
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  return (
    <>
      <Navbar showHamburger={true} />
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            Manage Notices
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">{editingId ? "Edit Notice" : "Create Notice"}</h2>
            <div className="mb-4">
              <label className="block font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium text-gray-700 mb-1">Content</label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                required
                rows={4}
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {editingId ? "Update Notice" : "Post Notice"}
            </button>
          </form>

          {/* Notices List */}
          {loading ? (
            <p>Loading notices...</p>
          ) : notices.length === 0 ? (
            <p>No notices found.</p>
          ) : (
            <div className="grid gap-4">
              {notices.map((notice) => (
                <div key={notice._id} className="bg-white p-4 rounded shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold">{notice.title}</h3>
                      <p className="text-gray-700">{notice.content}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Posted on: {new Date(notice.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(notice)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(notice._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminNotice;
