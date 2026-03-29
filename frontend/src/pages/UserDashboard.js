import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Calendar, MessageSquare, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export default function UserDashboard() {
  const { user, api } = useAuth();

  const [favorites, setFavorites] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FIXED (useCallback added)
  const fetchDashboardData = useCallback(async () => {
    try {
      const [favResponse, dashResponse] = await Promise.all([
        api.get('/favorites'),
        api.get('/dashboard/user')
      ]);

      setFavorites(favResponse.data || []);
      setAppointments(dashResponse.data?.appointments || []);
      setInquiries(dashResponse.data?.inquiries || []);

    } catch (error) {
      console.error('Error fetching dashboard:', error);
      toast.error(error.response?.data?.detail || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, [api]);

  // ✅ FIXED (dependency added)
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const removeFavorite = async (propertyId) => {
    try {
      await api.delete(`/favorites/${propertyId}`);
      setFavorites((prev) => prev.filter((p) => p.id !== propertyId));
      toast.success('Removed from favorites');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to remove favorite');
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

          {/* HEADER */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-black mb-2">
              My Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back, {user?.name || 'User'}!
            </p>
          </div>

          <Tabs defaultValue="favorites" className="w-full">

            <TabsList className="mb-8">
              <TabsTrigger value="favorites">
                <Heart className="h-4 w-4 mr-2" />
                Favorites ({favorites.length})
              </TabsTrigger>

              <TabsTrigger value="appointments">
                <Calendar className="h-4 w-4 mr-2" />
                Appointments ({appointments.length})
              </TabsTrigger>

              <TabsTrigger value="inquiries">
                <MessageSquare className="h-4 w-4 mr-2" />
                Inquiries ({inquiries.length})
              </TabsTrigger>
            </TabsList>

            {/* FAVORITES */}
            <TabsContent value="favorites">
              {favorites.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-lg">
                  <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600 mb-4">No favorites yet</p>
                  <Link to="/properties" className="btn-primary inline-block">
                    Browse Properties
                  </Link>
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-6">
                  {favorites.map((property) => (
                    <div key={property.id} className="bg-white rounded-lg shadow hover:shadow-lg transition">

                      <Link to={`/properties/${property.id}`}>
                        <img
                          src={property.images?.[0] || 'https://via.placeholder.com/300'}
                          alt={property.title}
                          className="h-48 w-full object-cover rounded-t-lg"
                        />
                      </Link>

                      <div className="p-4">
                        <h3 className="font-bold text-lg">{property.title}</h3>

                        <p className="text-gray-600 text-sm flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {property.city}
                        </p>

                        <div className="flex justify-between items-center mt-3">
                          <span className="text-red-600 font-bold">
                            ₹{property.price}
                          </span>

                          <button
                            onClick={() => removeFavorite(property.id)}
                            className="text-sm text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* APPOINTMENTS */}
            <TabsContent value="appointments">
              {appointments.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-lg">
                  <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <p>No appointments scheduled</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((a) => (
                    <div key={a.id} className="bg-white p-5 rounded-lg shadow">
                      <h3 className="font-bold">{a.property_title}</h3>
                      <p className="text-gray-600">
                        {a.date} at {a.time}
                      </p>
                      {a.message && <p className="text-sm mt-1">{a.message}</p>}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* INQUIRIES */}
            <TabsContent value="inquiries">
              {inquiries.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-lg">
                  <MessageSquare className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <p>No inquiries sent</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {inquiries.map((i) => (
                    <div key={i.id} className="bg-white p-5 rounded-lg shadow">
                      <p className="text-gray-700">{i.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(i.created_at).toLocaleDateString()}
                      </p>
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
