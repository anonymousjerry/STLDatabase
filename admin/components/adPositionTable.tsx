import React, { useEffect, useState } from "react";
import { 
  createAdPosition, 
  deleteAdPosition, 
  getAllAdPositions, 
  updateAdPosition, 
  toggleAdPosition,
  searchAdPositions 
} from "../lib/adPositionApi";
import { AdPosition } from "../sanity/types";
import { Pencil, Trash2, Check, X, Eye, EyeOff, Search, Plus, Filter } from "lucide-react";

export function AdPositionTable() {
  const [adPositions, setAdPositions] = useState<AdPosition[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<AdPosition>>({});
  const [filter, setFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [pageFilter, setPageFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await getAllAdPositions();
      setAdPositions(res);
    } catch {
      setAlert({ type: "error", message: "Failed to fetch ad positions" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const startEdit = (ad: AdPosition) => {
    setEditingId(ad._id);
    setForm({
      title: ad.title,
      page: ad.page,
      position: ad.position,
      adType: ad.adType,
      size: ad.size,
      enabled: ad.enabled,
      priority: ad.priority,
      adSlot: ad.adSlot,
      fallbackContent: ad.fallbackContent,
      clientName: ad.clientName,
      clientEmail: ad.clientEmail,
      startDate: ad.startDate,
      endDate: ad.endDate,
      notes: ad.notes,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({});
  };

  const createAd = async () => {
    if (!form.title || !form.page || !form.position || !form.adType || !form.size) {
      showAlert("error", "Title, Page, Position, Ad Type, and Size are required!");
      return;
    }
    try {
      setLoading(true);
      await createAdPosition({
        title: form.title,
        page: form.page,
        position: form.position,
        adType: form.adType,
        size: form.size,
        enabled: form.enabled ?? true,
        priority: form.priority ?? 1,
        adSlot: form.adSlot,
        fallbackContent: form.fallbackContent,
        clientName: form.clientName,
        clientEmail: form.clientEmail,
        startDate: form.startDate,
        endDate: form.endDate,
        notes: form.notes,
      });
      await refresh();
      setForm({});
      showAlert("success", "Ad position created successfully!");
      setIsFormVisible(false);
    } catch {
      showAlert("error", "Failed to create ad position");
    } finally {
      setLoading(false);
    }
  };

  const updateAd = async (id: string) => {
    try {
      setLoading(true);
      await updateAdPosition(id, {
        title: form.title,
        page: form.page,
        position: form.position,
        adType: form.adType,
        size: form.size,
        enabled: form.enabled,
        priority: form.priority,
        adSlot: form.adSlot,
        fallbackContent: form.fallbackContent,
        clientName: form.clientName,
        clientEmail: form.clientEmail,
        startDate: form.startDate,
        endDate: form.endDate,
        notes: form.notes,
      });
      await refresh();
      cancelEdit();
      showAlert("success", "Ad position updated successfully!");
    } catch {
      showAlert("error", "Failed to update ad position");
    } finally {
      setLoading(false);
    }
  };

  const deleteAd = async (id: string) => {
    if (!confirm("Delete this ad position?")) return;
    try {
      setLoading(true);
      await deleteAdPosition(id);
      await refresh();
      showAlert("success", "Ad position deleted successfully!");
    } catch {
      showAlert("error", "Failed to delete ad position");
    } finally {
      setLoading(false);
    }
  };

  const toggleEnabled = async (id: string, enabled: boolean) => {
    try {
      setLoading(true);
      await toggleAdPosition(id, enabled);
      await refresh();
      showAlert("success", `Ad position ${enabled ? 'enabled' : 'disabled'} successfully!`);
    } catch {
      showAlert("error", "Failed to toggle ad position");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      await refresh();
      return;
    }
    setLoading(true);
    try {
      const results = await searchAdPositions(searchTerm);
      setAdPositions(results);
    } catch {
      showAlert("error", "Failed to search ad positions");
    } finally {
      setLoading(false);
    }
  };

  const filtered = adPositions.filter((ad) => {
    let matchesFilter = true;
    let matchesPage = true;
    let matchesType = true;

    if (filter) {
      const s = filter.toLowerCase();
      matchesFilter = 
        ad.title.toLowerCase().includes(s) || 
        ad.clientName?.toLowerCase().includes(s) || 
        ad.clientEmail?.toLowerCase().includes(s) ||
        ad.position.toLowerCase().includes(s);
    }

    if (pageFilter !== "all") {
      matchesPage = ad.page === pageFilter;
    }

    if (typeFilter !== "all") {
      matchesType = ad.adType === typeFilter;
    }

    return matchesFilter && matchesPage && matchesType;
  });

  const getPositionDisplayName = (position: string) => {
    const positionMap: Record<string, string> = {
      'homepage-header-banner': 'Header Banner (728x90)',
      'homepage-mid-content-banner': 'Mid-Content Banner (728x90)',
      'homepage-sidebar-right': 'Right Sidebar (300x250)',
      'homepage-sponsored-models': 'Sponsored Models (Native)',
      'homepage-footer-banner': 'Footer Banner (728x90)',
      'detail-header-banner': 'Header Banner (728x90)',
      'detail-mid-content-banner': 'Mid-Content Banner (728x90)',
      'detail-sidebar-right': 'Right Sidebar (300x250)',
      'detail-sponsored-similar': 'Sponsored Similar Models (Native)',
      'explore-header-banner': 'Header Banner (728x90)',
      'explore-mid-content-banner': 'Mid-Content Banner (728x90)',
      'explore-sidebar-right': 'Right Sidebar (300x250)',
      'explore-sponsored-listings': 'Sponsored Listings (Native)',
      'explore-sidebar-left': 'Left Sidebar (300x250)',
    };
    return positionMap[position] || position;
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Ad Position Management</h1>
        <button
          onClick={() => setIsFormVisible(!isFormVisible)}
          className="bg-custom-light-maincolor hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add New Ad Position
        </button>
      </div>

      {/* Alert */}
      {alert && (
        <div className={`mb-4 p-4 rounded-lg ${
          alert.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
          {alert.message}
        </div>
      )}

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by title, client, or position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-light-maincolor focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>
          <button
            onClick={handleSearch}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Search
          </button>
          <button
            onClick={refresh}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Refresh
          </button>
        </div>

        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Page Filter</label>
            <select
              value={pageFilter}
              onChange={(e) => setPageFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-light-maincolor focus:border-transparent"
            >
              <option value="all">All Pages</option>
              <option value="homepage">Homepage</option>
              <option value="detail">Detail Page</option>
              <option value="explore">Explore Page</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type Filter</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-light-maincolor focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="banner">Banner</option>
              <option value="sidebar">Sidebar</option>
              <option value="sponsored-model">Sponsored Model</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quick Filter</label>
            <input
              type="text"
              placeholder="Filter by title, client, or position..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-light-maincolor focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Create Form */}
      {isFormVisible && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">Create New Ad Position</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Title"
              value={form.title || ""}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-light-maincolor focus:border-transparent"
            />
            <select
              value={form.page || ""}
              onChange={(e) => setForm({ ...form, page: e.target.value as any })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-light-maincolor focus:border-transparent"
            >
              <option value="">Select Page</option>
              <option value="homepage">Homepage</option>
              <option value="detail">Detail Page</option>
              <option value="explore">Explore Page</option>
            </select>
            <select
              value={form.position || ""}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-light-maincolor focus:border-transparent"
            >
              <option value="">Select Position</option>
              <option value="homepage-header-banner">Header Banner (728x90)</option>
              <option value="homepage-mid-content-banner">Mid-Content Banner (728x90)</option>
              <option value="homepage-sidebar-right">Right Sidebar (300x250)</option>
              <option value="homepage-sponsored-models">Sponsored Models (Native)</option>
              <option value="homepage-footer-banner">Footer Banner (728x90)</option>
              <option value="detail-header-banner">Detail Header Banner (728x90)</option>
              <option value="detail-mid-content-banner">Detail Mid-Content Banner (728x90)</option>
              <option value="detail-sidebar-right">Detail Right Sidebar (300x250)</option>
              <option value="detail-sponsored-similar">Detail Sponsored Similar Models (Native)</option>
              <option value="explore-header-banner">Explore Header Banner (728x90)</option>
              <option value="explore-mid-content-banner">Explore Mid-Content Banner (728x90)</option>
              <option value="explore-sidebar-right">Explore Right Sidebar (300x250)</option>
              <option value="explore-sponsored-listings">Explore Sponsored Listings (Native)</option>
              <option value="explore-sidebar-left">Explore Left Sidebar (300x250)</option>
            </select>
            <select
              value={form.adType || ""}
              onChange={(e) => setForm({ ...form, adType: e.target.value as any })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-light-maincolor focus:border-transparent"
            >
              <option value="">Select Ad Type</option>
              <option value="banner">Banner</option>
              <option value="sidebar">Sidebar</option>
              <option value="sponsored-model">Sponsored Model</option>
            </select>
            <select
              value={form.size || ""}
              onChange={(e) => setForm({ ...form, size: e.target.value as any })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-light-maincolor focus:border-transparent"
            >
              <option value="">Select Size</option>
              <option value="728x90">728x90</option>
              <option value="300x250">300x250</option>
              <option value="300x600">300x600</option>
              <option value="native">Native</option>
            </select>
            <input
              type="number"
              placeholder="Priority (1-10)"
              value={form.priority || ""}
              onChange={(e) => setForm({ ...form, priority: parseInt(e.target.value) })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-light-maincolor focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Client Name"
              value={form.clientName || ""}
              onChange={(e) => setForm({ ...form, clientName: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-light-maincolor focus:border-transparent"
            />
            <input
              type="email"
              placeholder="Client Email"
              value={form.clientEmail || ""}
              onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-light-maincolor focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Google AdSense Ad Slot ID"
              value={form.adSlot || ""}
              onChange={(e) => setForm({ ...form, adSlot: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-light-maincolor focus:border-transparent"
            />
            <input
              type="datetime-local"
              placeholder="Start Date"
              value={form.startDate || ""}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-light-maincolor focus:border-transparent"
            />
            <input
              type="datetime-local"
              placeholder="End Date"
              value={form.endDate || ""}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-light-maincolor focus:border-transparent"
            />
          </div>
          <div className="mt-4">
            <textarea
              placeholder="Fallback Content (optional)"
              value={form.fallbackContent || ""}
              onChange={(e) => setForm({ ...form, fallbackContent: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-light-maincolor focus:border-transparent"
            />
          </div>
          <div className="mt-4">
            <textarea
              placeholder="Notes (optional)"
              value={form.notes || ""}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-light-maincolor focus:border-transparent"
            />
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={createAd}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Ad Position"}
            </button>
            <button
              onClick={() => setIsFormVisible(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Page
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.map((ad) => (
              <tr key={ad._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{ad.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {ad.page}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{getPositionDisplayName(ad.position)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    {ad.adType}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                    {ad.size}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleEnabled(ad._id, !ad.enabled)}
                    className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                      ad.enabled
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {ad.enabled ? <Eye size={12} className="mr-1" /> : <EyeOff size={12} className="mr-1" />}
                    {ad.enabled ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{ad.clientName || "N/A"}</div>
                  {ad.clientEmail && (
                    <div className="text-sm text-gray-500">{ad.clientEmail}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    {ad.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(ad)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => deleteAd(ad._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No ad positions found.
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-custom-light-maincolor"></div>
        </div>
      )}
    </div>
  );
} 