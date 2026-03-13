import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Home, Eye, MessageSquare, Plus, MapPin, Edit, Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AgentDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    total_listings: 0,
    total_views: 0,
    total_inquiries: 0,
    properties: [],
    inquiries: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${API}/dashboard/agent`);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const deleteProperty = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    
    try {
      await axios.delete(`${API}/properties/${propertyId}`);
      setDashboardData(prev => ({
        ...prev,
        properties: prev.properties.filter(p => p.id !== propertyId),
        total_listings: prev.total_listings - 1
      }));
      toast.success('Property deleted successfully');
    } catch (error) {
      toast.error('Failed to delete property');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 text-center">
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-24 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-black mb-2" data-testid="agent-dashboard-title">
                Agent Dashboard
              </h1>
              <p className="text-gray-600">Manage your property listings</p>
            </div>
            <Link to="/post-property">
              <Button className="btn-primary" data-testid="post-new-property-button">
                <Plus className="h-4 w-4 mr-2" />
                Post New Property
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm" data-testid="stats-listings">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-1">Total Listings</p>
                  <p className="text-3xl font-black">{dashboardData.total_listings}</p>
                </div>
                <Home className="h-12 w-12 text-[#C8102E]" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm" data-testid="stats-views">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-1">Total Views</p>
                  <p className="text-3xl font-black">{dashboardData.total_views}</p>
                </div>
                <Eye className="h-12 w-12 text-[#C8102E]" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm" data-testid="stats-inquiries">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-1">Total Inquiries</p>
                  <p className="text-3xl font-black">{dashboardData.total_inquiries}</p>
                </div>
                <MessageSquare className="h-12 w-12 text-[#C8102E]" />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="properties" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="properties" data-testid="properties-tab">
                <Home className="h-4 w-4 mr-2" />
                My Properties
              </TabsTrigger>
              <TabsTrigger value="inquiries" data-testid="inquiries-tab">
                <MessageSquare className="h-4 w-4 mr-2" />
                Inquiries
              </TabsTrigger>
            </TabsList>

            <TabsContent value="properties" data-testid="properties-content">
              {dashboardData.properties.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-lg">
                  <Home className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600 mb-4">No properties listed yet</p>
                  <Link to="/post-property" className="btn-primary inline-block">
                    Post Your First Property
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {dashboardData.properties.map(property => (
                    <div key={property.id} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all" data-testid={`property-${property.id}`}>
                      <div className="flex flex-col md:flex-row gap-6">
                        <Link to={`/properties/${property.id}`} className="w-full md:w-48 h-32 flex-shrink-0">
                          <img
                            src={property.images[0] || 'https://images.unsplash.com/photo-1642976975710-1d8890dbf5ab?w=400'}
                            alt={property.title}
                            className="w-full h-full object-cover rounded"
                          />
                        </Link>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <Link to={`/properties/${property.id}`}>
                                <h3 className="font-bold text-xl mb-1 hover:text-[#C8102E] transition-colors">
                                  {property.title}
                                </h3>
                              </Link>
                              <p className="text-gray-600 text-sm flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {property.location}, {property.city}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-sm text-sm font-semibold ${
                              property.status === 'approved' ? 'bg-green-100 text-green-800' :
                              property.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {property.status}
                            </span>
                          </div>
                          <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                            <span className="font-bold text-[#C8102E] text-xl">
                              ₹{(property.price / 100000).toFixed(1)}L
                            </span>
                            <span>{property.area} sqft</span>
                            <span className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              {property.views || 0} views
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Link to={`/properties/${property.id}`}>
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteProperty(property.id)}
                              data-testid={`delete-property-${property.id}`}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="inquiries" data-testid="inquiries-content">
              {dashboardData.inquiries.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-lg">
                  <MessageSquare className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600">No inquiries yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {dashboardData.inquiries.map(inquiry => (
                    <div key={inquiry.id} className="bg-white rounded-lg p-6 shadow-sm" data-testid={`inquiry-${inquiry.id}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-bold">{inquiry.from_user_name}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(inquiry.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        {!inquiry.read && (
                          <span className="bg-[#C8102E] text-white text-xs px-2 py-1 rounded-sm">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 mb-2">{inquiry.message}</p>
                      <p className="text-sm text-gray-500">Property ID: {inquiry.property_id}</p>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}