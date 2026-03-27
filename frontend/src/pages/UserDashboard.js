import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Heart, Calendar, MessageSquare, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function UserDashboard() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [favResponse, dashResponse] = await Promise.all([
        axios.get(`${API}/favorites`),
        axios.get(`${API}/dashboard/user`)
      ]);
      setFavorites(favResponse.data);
      setAppointments(dashResponse.data.appointments);
      setInquiries(dashResponse.data.inquiries);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (propertyId) => {
    try {
      await axios.delete(`${API}/favorites/${propertyId}`);
      setFavorites(favorites.filter(p => p.id !== propertyId));
      toast.success('Removed from favorites');
    } catch (error) {
      toast.error('Failed to remove favorite');
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
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-black mb-2" data-testid="dashboard-title">
              My Dashboard
            </h1>
            <p className="text-gray-600">Welcome back, {user?.name}!</p>
          </div>

          <Tabs defaultValue="favorites" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="favorites" data-testid="favorites-tab">
                <Heart className="h-4 w-4 mr-2" />
                Favorites ({favorites.length})
              </TabsTrigger>
              <TabsTrigger value="appointments" data-testid="appointments-tab">
                <Calendar className="h-4 w-4 mr-2" />
                Appointments ({appointments.length})
              </TabsTrigger>
              <TabsTrigger value="inquiries" data-testid="inquiries-tab">
                <MessageSquare className="h-4 w-4 mr-2" />
                Inquiries ({inquiries.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="favorites" data-testid="favorites-content">
              {favorites.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-lg">
                  <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600 mb-4">No favorites yet</p>
                  <Link to="/properties" className="btn-primary inline-block">
                    Browse Properties
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map(property => (
                    <div key={property.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all" data-testid={`favorite-property-${property.id}`}>
                      <Link to={`/property/${property.id}`}>
                        <div className="relative h-48">
                          <img
                            src={property.images[0] || 'https://images.unsplash.com/photo-1642976975710-1d8890dbf5ab?w=600'}
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </Link>
                      <div className="p-4">
                        <Link to={`/property/${property.id}`}>
                          <h3 className="font-bold text-lg mb-2 hover:text-[#C8102E] transition-colors">
                            {property.title}
                          </h3>
                        </Link>
                        <p className="text-gray-600 text-sm mb-2 flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {property.city}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-black text-[#C8102E]">
                            ₹{(property.price / 100000).toFixed(1)}L
                          </span>
                          <button
                            onClick={() => removeFavorite(property.id)}
                            className="text-sm text-red-600 hover:text-red-800"
                            data-testid={`remove-favorite-${property.id}`}
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

            <TabsContent value="appointments" data-testid="appointments-content">
              {appointments.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-lg">
                  <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600">No appointments scheduled</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map(appointment => (
                    <div key={appointment.id} className="bg-white rounded-lg p-6 shadow-sm" data-testid={`appointment-${appointment.id}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-lg mb-2">{appointment.property_title}</h3>
                          <p className="text-gray-600 text-sm mb-2">
                            <Calendar className="h-4 w-4 inline mr-1" />
                            {appointment.date} at {appointment.time}
                          </p>
                          {appointment.message && (
                            <p className="text-gray-600 text-sm">{appointment.message}</p>
                          )}
                        </div>
                        <span className={`px-3 py-1 rounded-sm text-sm font-semibold ${
                          appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="inquiries" data-testid="inquiries-content">
              {inquiries.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-lg">
                  <MessageSquare className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600">No inquiries sent</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {inquiries.map(inquiry => (
                    <div key={inquiry.id} className="bg-white rounded-lg p-6 shadow-sm" data-testid={`inquiry-${inquiry.id}`}>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold">Property Inquiry</h3>
                        <span className="text-sm text-gray-500">
                          {new Date(inquiry.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600">{inquiry.message}</p>
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