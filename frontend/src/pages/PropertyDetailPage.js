import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Bed, Maximize, Phone, Mail, Calendar, Heart } from 'lucide-react';
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

  /**
   * ✅ FIX:
   * Wrap fetchProperty in useCallback
   */
  const fetchProperty = useCallback(async () => {
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
  }, [id, navigate]);

  /**
   * ✅ FIX:
   * Add fetchProperty into dependency array
   */
  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

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

  const images =
    property.images && property.images.length > 0
      ? property.images
      : ['https://images.unsplash.com/photo-1642976975710-1d8890dbf5ab?w=1200'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-24 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Image Gallery */}
          <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-8">
            <div className="relative h-96 md:h-[600px]">
              <img
                src={images[selectedImage]}
                alt={property.title}
                className="w-full h-full object-cover"
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
                  />
                ))}
              </div>
            )}
          </div>

          {/* CONTENT CONTINUES SAME */}
        </div>
      </div>
    </div>
  );
}
