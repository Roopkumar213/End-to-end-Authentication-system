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
      const res = await getPortfolio();
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
      const res = await createPortfolio({
        title: formValues.title,
        description: formValues.description,
        tags: formValues.tags,
        imageUrl: formValues.imageUrl,
      });
      setItems((prev) => prev.map((it) => (it._id === tempId ? res.data : it)));
      setToast({ type: 'success', message: 'Project created successfully' });
    } catch (err) {
      setItems((prev) => prev.filter((it) => it._id !== tempId));
      setToast({ type: 'error', message: err?.message || 'Create failed' });
    }
  };

  const handleDelete = async (id) => {
    const prev = items;
    setItems((it) => it.filter((p) => p._id !== id));
    setToast({ type: 'success', message: 'Deleting project...' });

    try {
      await deletePortfolio(id);
      setToast({ type: 'success', message: 'Project deleted successfully' });
    } catch (err) {
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
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .admin-dashboard-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          position: relative;
        }

        .admin-dashboard-page::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 300px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          z-index: 0;
        }

        .dashboard-container {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          animation: fadeInUp 0.6s ease-out;
        }

        .dashboard-header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.8);
        }

        .header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .dashboard-title {
          font-size: 2rem;
          font-weight: 700;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
          margin: 0;
          letter-spacing: -0.02em;
        }

        .header-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .btn-custom {
          padding: 0.75rem 1.5rem;
          font-size: 0.95rem;
          font-weight: 600;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          position: relative;
          overflow: hidden;
        }

        .btn-primary-custom {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .btn-primary-custom::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          opacity: 0;
          transition: opacity 0.25s ease;
        }

        .btn-primary-custom:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
        }

        .btn-primary-custom:hover::before {
          opacity: 1;
        }

        .btn-primary-custom span {
          position: relative;
          z-index: 1;
        }

        .btn-outline-custom {
          background: rgba(255, 255, 255, 0.8);
          color: #64748b;
          border: 2px solid rgba(99, 102, 241, 0.2);
          backdrop-filter: blur(10px);
        }

        .btn-outline-custom:hover {
          background: white;
          color: #6366f1;
          border-color: #6366f1;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
        }

        .header-description {
          color: #64748b;
          font-size: 0.95rem;
          margin: 0;
          line-height: 1.6;
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
          animation: slideInRight 0.6s ease-out 0.2s both;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        .stat-label {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 500;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        .stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }

        .stat-icon-primary {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
          color: #6366f1;
        }

        .stat-icon-success {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1));
          color: #10b981;
        }

        .stat-icon-warning {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.1));
          color: #f59e0b;
        }

        .content-section {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          animation: fadeInUp 0.6s ease-out 0.4s both;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          gap: 1rem;
        }

        .spinner-custom {
          width: 48px;
          height: 48px;
          border: 4px solid rgba(99, 102, 241, 0.1);
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading-text {
          color: #64748b;
          font-size: 0.95rem;
          font-weight: 500;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
        }

        .empty-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 1.5rem;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6366f1;
        }

        .empty-icon svg {
          width: 40px;
          height: 40px;
        }

        .empty-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .empty-description {
          color: #64748b;
          font-size: 0.95rem;
          margin-bottom: 2rem;
        }

        @media (max-width: 768px) {
          .dashboard-container {
            padding: 1.5rem 1rem;
          }

          .dashboard-header {
            padding: 1.5rem;
            border-radius: 16px;
          }

          .header-top {
            flex-direction: column;
            align-items: flex-start;
          }

          .dashboard-title {
            font-size: 1.5rem;
          }

          .header-actions {
            width: 100%;
          }

          .btn-custom {
            flex: 1;
            justify-content: center;
          }

          .stats-row {
            grid-template-columns: 1fr;
          }

          .content-section {
            padding: 1.5rem;
            border-radius: 16px;
          }
        }
      `}</style>

      <SEO title="Admin — WebStudio" description="Admin dashboard for WebStudio" />
      
      <div className="admin-dashboard-page">
        <div className="dashboard-container">
          
          {/* Header Section */}
          <div className="dashboard-header">
            <div className="header-top">
              <h1 className="dashboard-title">Admin Dashboard</h1>
              <div className="header-actions">
                <button
                  onClick={() => navigate('/')}
                  className="btn-custom btn-outline-custom"
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  <span>View Site</span>
                </button>
                <button
                  onClick={openNew}
                  className="btn-custom btn-primary-custom"
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                  </svg>
                  <span>New Project</span>
                </button>
              </div>
            </div>
            <p className="header-description">
              Manage your portfolio projects with ease. Create, edit, and delete projects in real-time.
            </p>
          </div>

          {/* Stats Section */}
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-icon stat-icon-primary">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
              </div>
              <div className="stat-label">Total Projects</div>
              <div className="stat-value">{items.length}</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon stat-icon-success">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div className="stat-label">Published</div>
              <div className="stat-value">{items.length}</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon stat-icon-warning">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div className="stat-label">Last Updated</div>
              <div className="stat-value" style={{ fontSize: '1rem', marginTop: '0.5rem' }}>
                {items.length > 0 ? 'Recently' : 'N/A'}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="content-section">
            {loading ? (
              <div className="loading-container">
                <div className="spinner-custom" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="loading-text">Loading your projects...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                  </svg>
                </div>
                <h2 className="empty-title">No Projects Yet</h2>
                <p className="empty-description">Get started by creating your first portfolio project.</p>
                <button
                  onClick={openNew}
                  className="btn-custom btn-primary-custom"
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                  </svg>
                  <span>Create First Project</span>
                </button>
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

      {/* Modal */}
      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title={editingItem ? 'Edit Project' : 'New Project'}
      >
        <AdminPortfolioForm
          initial={editingItem}
          onCancel={() => setModalOpen(false)}
          onSaved={(values) => handleCreate(values)}
        />
      </Modal>

      {/* Toast Notification */}
      {toast && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1050 }}>
          <Toast 
            type={toast.type} 
            message={toast.message} 
            onClose={() => setToast(null)} 
          />
        </div>
      )}
    </>
  );
};

export default AdminDashboard;