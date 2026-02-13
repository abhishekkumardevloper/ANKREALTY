import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Home, Bed, Bath, Maximize, Phone, Mail, Calendar, Heart } from 'lucide-react';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [appointmentData, setAppointmentData] = useState({
    date: '',
    time: '',
    message: ''
  });
  const [inquiryMessage, setInquiryMessage] = useState('');

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await axios.get(`${API}/properties/${id}`);
      setProperty(response.data);
    } catch (error) {
      console.error('Error fetching property:', error);
      toast.error('Property not found');
      navigate('/properties');
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleVisit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to schedule a visit');
      navigate('/auth');
      return;
    }
    try {
      await axios.post(`${API}/appointments`, {
        property_id: id,
        ...appointmentData
      });
      toast.success('Visit scheduled successfully!');
      setAppointmentData({ date: '', time: '', message: '' });
    } catch (error) {
      toast.error('Failed to schedule visit');
    }
  };

  const handleSendInquiry = async () => {
    if (!user) {
      toast.error('Please login to send inquiry');
      navigate('/auth');
      return;
    }
    if (!inquiryMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }
    try {
      await axios.post(`${API}/inquiries`, {
        property_id: id,
        message: inquiryMessage
      });
      toast.success('Inquiry sent successfully!');
      setInquiryMessage('');
    } catch (error) {
      toast.error('Failed to send inquiry');
    }
  };

  const addToFavorites = async () => {
    if (!user) {
      toast.error('Please login to save favorites');
      return;
    }
    try {
      await axios.post(`${API}/favorites`, { property_id: id });
      toast.success('Added to favorites');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to favorites');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 text-center">
          <p>Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) return null;

  const images = property.images.length > 0 ? property.images : [
    'https://images.unsplash.com/photo-1642976975710-1d8890dbf5ab?w=1200'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-24 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Image Gallery */}
          <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-8" data-testid="property-gallery">
            <div className="relative h-96 md:h-[600px]">
              <img
                src={images[selectedImage]}
                alt={property.title}
                className="w-full h-full object-cover"
                data-testid="property-main-image"
              />
              <div className="absolute top-4 left-4 bg-[#C8102E] text-white px-6 py-2 rounded-sm text-lg font-bold">
                {property.category.toUpperCase()}
              </div>
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto">
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`View ${idx + 1}`}
                    className={`h-24 w-32 object-cover cursor-pointer rounded border-2 ${
                      selectedImage === idx ? 'border-[#C8102E]' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedImage(idx)}
                    data-testid={`property-thumbnail-${idx}`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-4xl font-black mb-4" data-testid="property-detail-title">
                      {property.title}
                    </h1>
                    <p className="text-lg text-gray-600 flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      {property.location}, {property.city}, {property.state}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={addToFavorites}
                    data-testid="property-favorite-button"
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex items-center space-x-8 mb-6 pb-6 border-b">
                  <span className="text-4xl font-black text-[#C8102E]" data-testid="property-detail-price">
                    ₹{(property.price / 100000).toFixed(2)}L
                  </span>
                  {property.bhk && (
                    <div className="flex items-center text-gray-600">
                      <Bed className="h-5 w-5 mr-2" />
                      <span className="font-semibold">{property.bhk} BHK</span>
                    </div>
                  )}
                  <div className="flex items-center text-gray-600">
                    <Maximize className="h-5 w-5 mr-2" />
                    <span className="font-semibold">{property.area} sqft</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Property Type</h3>
                    <p className="text-gray-600 capitalize">{property.property_type}</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Furnishing</h3>
                    <p className="text-gray-600 capitalize">{property.furnishing}</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Description</h3>
                    <p className="text-gray-600 leading-relaxed">{property.description}</p>
                  </div>
                  {property.amenities && property.amenities.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold mb-2">Amenities</h3>
                      <div className="flex flex-wrap gap-2">
                        {property.amenities.map((amenity, idx) => (
                          <span
                            key={idx}
                            className="bg-gray-100 px-4 py-2 rounded-sm text-sm"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Owner */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-4">Contact Owner</h3>
                <div className="space-y-3">
                  <p className="font-semibold">{property.owner_name}</p>
                  <p className="text-gray-600 flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    {property.owner_phone}
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full btn-primary" data-testid="send-inquiry-button">
                        <Mail className="h-4 w-4 mr-2" />
                        Send Inquiry
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Send Inquiry</DialogTitle>
                        <DialogDescription>
                          Send a message to the property owner
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Textarea
                          placeholder="I'm interested in this property..."
                          value={inquiryMessage}
                          onChange={(e) => setInquiryMessage(e.target.value)}
                          rows={4}
                          data-testid="inquiry-message-textarea"
                        />
                        <Button onClick={handleSendInquiry} className="w-full btn-primary" data-testid="inquiry-submit-button">
                          Send Message
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Schedule Visit */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-4">Schedule a Visit</h3>
                <form onSubmit={handleScheduleVisit} className="space-y-4" data-testid="schedule-visit-form">
                  <div>
                    <Label htmlFor="visit-date">Date</Label>
                    <Input
                      id="visit-date"
                      type="date"
                      value={appointmentData.date}
                      onChange={(e) => setAppointmentData({ ...appointmentData, date: e.target.value })}
                      required
                      data-testid="visit-date-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="visit-time">Time</Label>
                    <Input
                      id="visit-time"
                      type="time"
                      value={appointmentData.time}
                      onChange={(e) => setAppointmentData({ ...appointmentData, time: e.target.value })}
                      required
                      data-testid="visit-time-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="visit-message">Message (Optional)</Label>
                    <Textarea
                      id="visit-message"
                      placeholder="Any specific requirements?"
                      value={appointmentData.message}
                      onChange={(e) => setAppointmentData({ ...appointmentData, message: e.target.value })}
                      rows={3}
                      data-testid="visit-message-textarea"
                    />
                  </div>
                  <Button type="submit" className="w-full btn-secondary" data-testid="schedule-visit-button">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Visit
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}