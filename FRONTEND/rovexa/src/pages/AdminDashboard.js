import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { getPortfolio, deletePortfolio, createPortfolio } from '../api/endpoints';
import PortfolioGrid from '../components/PortfolioGrid';
import Toast from '../components/Toast';
import Modal from '../components/Modal';
import AdminPortfolioForm from './AdminPortfolioForm';

/**
 * AdminDashboard
 * - Lists portfolio items via GET /api/portfolio
 * - Supports create (optimistic), delete (optimistic) with rollback
 */
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    document.title = 'Admin — WebStudio';
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPortfolio(); // { success:true, data: PortfolioItem[] }
      setItems(res.data);
    } catch (err) {
      setToast({ type: 'error', message: err?.message || 'Failed to load portfolio' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (formValues) => {
    // Optimistic UI: add a temporary item locally, then call API; rollback on failure.
    const tempId = `temp-${Date.now()}`;
    const tempItem = {
      _id: tempId,
      title: formValues.title,
      description: formValues.description,
      imageUrl: formValues.imageUrl,
      tags: formValues.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setItems((prev) => [tempItem, ...prev]);
    setModalOpen(false);
    setToast({ type: 'success', message: 'Creating project...' });

    try {
      // createPortfolio should handle sending JSON { title, description, tags, imageUrl }
      const res = await createPortfolio({
        title: formValues.title,
        description: formValues.description,
        tags: formValues.tags,
        imageUrl: formValues.imageUrl,
      });
      // replace temp item with actual response
      setItems((prev) => prev.map((it) => (it._id === tempId ? res.data : it)));
      setToast({ type: 'success', message: 'Project created' });
    } catch (err) {
      // rollback
      setItems((prev) => prev.filter((it) => it._id !== tempId));
      setToast({ type: 'error', message: err?.message || 'Create failed' });
    }
  };

  const handleDelete = async (id) => {
    // Optimistic delete: remove locally then call API; rollback if failure
    const prev = items;
    setItems((it) => it.filter((p) => p._id !== id));
    setToast({ type: 'success', message: 'Deleting project...' });

    try {
      await deletePortfolio(id); // expected to return { success:true }
      setToast({ type: 'success', message: 'Deleted' });
    } catch (err) {
      // rollback
      setItems(prev);
      setToast({ type: 'error', message: err?.message || 'Delete failed' });
    }
  };

  const openNew = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  return (
    <>
      <SEO title="Admin — WebStudio" description="Admin dashboard for WebStudio" />
      <div className="min-vh-100 bg-white">
        <div className="container py-5" style={{ maxWidth: '1140px' }}>
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h1 className="h2 fw-bold mb-0">Admin Dashboard</h1>
            <div className="d-flex gap-2">
              <button
                onClick={() => navigate('/')}
                className="btn btn-outline-secondary btn-sm"
              >
                View Site
              </button>
              <button
                onClick={openNew}
                className="btn btn-primary"
              >
                New Project
              </button>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-muted small mb-0">Manage portfolio items (create, edit, delete).</p>
          </div>

          <div className="mb-5">
            {loading ? (
              <div className="d-flex align-items-center justify-content-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <PortfolioGrid
                items={items}
                onEdit={openEdit}
                onDelete={handleDelete}
                adminControls
              />
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingItem ? 'Edit Project' : 'New Project'}>
        <AdminPortfolioForm
          initial={editingItem}
          onCancel={() => setModalOpen(false)}
          onSaved={(values) => handleCreate(values)}
        />
      </Modal>

      {toast && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1050 }}>
          <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
        </div>
      )}
    </>
  );
};

export default AdminDashboard;