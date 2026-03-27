import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Banknote, Bell, Briefcase, Building2, Calculator, ChevronRight, 
  Handshake, Instagram, Linkedin, Mail, MapPin, MessageCircle, Search, Users, Youtube 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import RegisterPopup from './RegisterPopup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { bankOffers, exploreLocalities, newsArticles, socialLinks } from '@/lib/siteData';
import { WHATSAPP_URL, createPropertySearch } from '@/lib/api';

// --- RICH CONTENT (Injected to make property details realistic) ---
const featuredProperties = [
  { 
    id: 'f1', title: 'Experion Saatori', city: 'Noida', location: 'Sector 151', propertyType: 'Apartment', 
    category: 'buy', price: '₹ 1.85 Cr onwards', 
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    tag: 'New Launch'
  },
  { 
    id: 'f3', title: 'M3M Jacob & Co', city: 'Noida', location: 'Sector 97', propertyType: 'Villa', 
    category: 'buy', price: '₹ 3.50 Cr onwards', 
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    tag: 'Ultra Luxury'
  },
  { 
    id: 'c1', title: 'M3M Line', city: 'Noida', location: 'Sector 72', propertyType: 'Commercial', 
    category: 'buy', price: '₹ 80 L onwards', 
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    tag: 'High ROI'
  },
  { 
    id: 'p1', title: 'Bajrang Vatika', city: 'Noida Extension', location: 'Sector 10', propertyType: 'Plot', 
    category: 'buy', price: '₹ 45 L onwards', 
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    tag: 'Premium Plots'
  },
];


// --- REAL ESTATE IMAGE HELPERS + RESALE DATA ---
const buildRealEstateImage = (seed, label = 'real-estate') =>
  `https://source.unsplash.com/featured/900x700/?${encodeURIComponent(`${label},real-estate,property,home`)}&sig=${seed}`;

const buildLocalityImage = (seed, label = 'locality') =>
  `https://source.unsplash.com/featured/900x700/?${encodeURIComponent(`${label},city,neighborhood,apartments`)}&sig=${seed}`;

const resaleProperties = [
  {
    id: 'r1',
    title: 'Jalvayu Vihar',
    city: 'Noida',
    sector: 'Sector 25',
    size: '1050 sq ft',
    unitType: '2bhk Study',
    tower: 'G',
    price: '1.40cr',
    status: 'Sale',
    lastCallOn: '2025-05-01 00:00:00',
    confBy: 'Aakshi',
    ref: 'Prop Sol',
    otherProp: '',
    note: '1.40cr',
    image: buildRealEstateImage(1, 'Jalvayu Vihar'),
  },
  {
    id: 'r2',
    title: 'Amrapali Sapphire',
    city: 'Noida',
    sector: 'Sector 45',
    size: '1640 sq ft',
    unitType: '3BHK+3 Toilet',
    tower: 'L',
    price: '2.5cr',
    status: 'Sale',
    lastCallOn: '25/2/2026',
    confBy: 'Meenakshi',
    ref: 'Calling',
    otherProp: '',
    note: '2.5cr',
    image: buildRealEstateImage(2, 'Amrapali Sapphire'),
  },
  {
    id: 'r3',
    title: 'Amarpali Sapphire',
    city: 'Noida',
    sector: 'Sector 45',
    size: '1640 sq ft',
    unitType: '',
    tower: 'O',
    price: '2.2cr',
    status: 'SALE',
    lastCallOn: '25/2/2026',
    confBy: 'Meenakshi',
    ref: '',
    otherProp: '',
    note: '2.2cr',
    image: buildRealEstateImage(3, 'Amarpali Sapphire'),
  },
  {
    id: 'r4',
    title: 'Amrapali Sapphire',
    city: 'Noida',
    sector: 'Sector 45',
    size: '3075 sq ft',
    unitType: '4BHK + Family Lounge + Svt. Room(3075 SQ FT)',
    tower: 'N',
    price: '3.4cr',
    status: 'Sale',
    lastCallOn: '20.09.2025',
    confBy: 'Aakshi',
    ref: 'P',
    otherProp: '',
    note: '3.4cr',
    image: buildRealEstateImage(4, 'Amrapali Sapphire'),
  },
  {
    id: 'r5',
    title: 'Amrapali Sapphire',
    city: 'Noida',
    sector: 'Sector 45',
    size: '1640 sq ft',
    unitType: '3BHK+3 Toilet',
    tower: 'H',
    price: '2cr',
    status: 'SALE',
    lastCallOn: '17/3/2026',
    confBy: 'Aakshi',
    ref: '',
    otherProp: '',
    note: '2cr',
    image: buildRealEstateImage(5, 'Amrapali Sapphire'),
  },
  {
    id: 'r6',
    title: 'Mahagun Maestro',
    city: 'Noida',
    sector: 'Sector 50',
    size: '3100 sq ft',
    unitType: '4bhk+sq',
    tower: 'TWR5',
    price: '4cr',
    status: 'SALE',
    lastCallOn: '17/3/2026',
    confBy: 'Aakshi',
    ref: 'Prop Sol',
    otherProp: '',
    note: '4cr',
    image: buildRealEstateImage(6, 'Mahagun Maestro'),
  },
  {
    id: 'r7',
    title: 'Antriksh NATURE',
    city: 'Noida',
    sector: 'Sector 52',
    size: '1750 sq ft',
    unitType: '',
    tower: 'A',
    price: '2.5cr',
    status: 'Sale',
    lastCallOn: '17/3/2026',
    confBy: 'Aakshi',
    ref: 'P Calling',
    otherProp: '',
    note: '2.5cr',
    image: buildRealEstateImage(7, 'Antriksh NATURE'),
  },
  {
    id: 'r8',
    title: 'Shadabdi Vihar',
    city: 'Noida',
    sector: 'Sector 61',
    size: '1850 sq ft',
    unitType: '4bhk',
    tower: '',
    price: '2.7cr',
    status: 'Sale',
    lastCallOn: '17/3/2026',
    confBy: 'Aakshi',
    ref: 'Prop Sol',
    otherProp: '',
    note: '2.7cr',
    image: buildRealEstateImage(8, 'Shadabdi Vihar'),
  },
  {
    id: 'r9',
    title: 'Supertech Cape TOWN',
    city: 'Noida',
    sector: 'Sector 74',
    size: '1150 sq ft',
    unitType: '',
    tower: 'CS-6',
    price: '80 Lakh',
    status: 'Sale',
    lastCallOn: '26/2/2026',
    confBy: 'Meenakshi',
    ref: '',
    otherProp: '',
    note: '80 Lakh',
    image: buildRealEstateImage(9, 'Supertech Cape TOWN'),
  },
  {
    id: 'r10',
    title: 'Supertech Cape TOWN',
    city: 'Noida',
    sector: 'Sector 74',
    size: '1150 sq ft',
    unitType: '',
    tower: 'CS-4',
    price: '90 Lakh',
    status: 'SALE',
    lastCallOn: '26/2/2026',
    confBy: 'Meenakshi',
    ref: '',
    otherProp: '',
    note: '90 Lakh',
    image: buildRealEstateImage(10, 'Supertech Cape TOWN'),
  },
  {
    id: 'r11',
    title: 'Supertech Cape TOWN',
    city: 'Noida',
    sector: 'Sector 74',
    size: '1082 sq ft',
    unitType: '',
    tower: 'CB-4',
    price: '80 Lakh',
    status: 'SALE',
    lastCallOn: '26/2/2026',
    confBy: 'Meenakshi',
    ref: '',
    otherProp: '',
    note: '80 Lakh',
    image: buildRealEstateImage(11, 'Supertech Cape TOWN'),
  },
  {
    id: 'r12',
    title: 'Apex Athena',
    city: 'Noida',
    sector: 'Sector 75',
    size: '1895 sq ft',
    unitType: '3bhk, 3toi',
    tower: 'D',
    price: '2.75 Cr',
    status: 'SALE',
    lastCallOn: '17/3/2026',
    confBy: 'Aakshi',
    ref: 'Whatsapp Responses Calling',
    otherProp: '',
    note: '2.75 Cr',
    image: buildRealEstateImage(12, 'Apex Athena'),
  },
  {
    id: 'r13',
    title: 'DASNAC BURJ',
    city: 'Noida',
    sector: 'Sector 75',
    size: '3030 sq ft',
    unitType: '4bhk',
    tower: 'A',
    price: '4.75 cr',
    status: 'SALE',
    lastCallOn: '17/3/2026',
    confBy: 'Aakshi',
    ref: 'Prop Sol',
    otherProp: '',
    note: '4.75 cr',
    image: buildRealEstateImage(13, 'DASNAC BURJ'),
  },
  {
    id: 'r14',
    title: 'Ivy County',
    city: 'Noida',
    sector: 'Sector 75',
    size: '1485 sq ft',
    unitType: '2bhk, Lounge',
    tower: 'C2',
    price: '2.7 cr',
    status: 'Sale',
    lastCallOn: '06.09.2025',
    confBy: 'Aakshi',
    ref: 'Data Calling',
    otherProp: '',
    note: '2.7 cr',
    image: buildRealEstateImage(14, 'Ivy County'),
  },
  {
    id: 'r15',
    title: 'Ivy County',
    city: 'Noida',
    sector: 'Sector 75',
    size: '1465 sq ft',
    unitType: '2bhk, Lounge',
    tower: '',
    price: '3cr',
    status: 'Sale',
    lastCallOn: '13.09.2025',
    confBy: 'Aakshi',
    ref: 'Data Calling',
    otherProp: '',
    note: '3cr',
    image: buildRealEstateImage(15, 'Ivy County'),
  },
  {
    id: 'r16',
    title: 'Amrapali Crystal Homes',
    city: 'Noida',
    sector: 'Sector 76',
    size: '1375 sq ft',
    unitType: '3bhk',
    tower: 'T5',
    price: '1.8cr',
    status: 'Sale',
    lastCallOn: '30.06.2025',
    confBy: 'Aman',
    ref: '99acres',
    otherProp: '',
    note: '1.8cr',
    image: buildRealEstateImage(16, 'Amrapali Crystal Homes'),
  },
  {
    id: 'r17',
    title: 'Amrapali Princely Estate',
    city: 'Noida',
    sector: 'Sector 76',
    size: '1315 sq ft',
    unitType: '3bhk',
    tower: '',
    price: '30.06.2025 aman spoke- this is miss vandana sons flat. 7th floor- rented. registered flat',
    status: 'Sale',
    lastCallOn: '30.06.2025',
    confBy: 'Aman',
    ref: '99acres',
    otherProp: '',
    note: '30.06.2025 aman spoke- this is miss vandana sons flat. 7th floor- rented. registered flat',
    image: buildRealEstateImage(17, 'Amrapali Princely Estate'),
  },
  {
    id: 'r18',
    title: 'Amrapali Silicon CITY',
    city: 'Noida',
    sector: 'Sector 76',
    size: '1035 sq ft',
    unitType: '2BR',
    tower: 'N',
    price: '1.2cr',
    status: 'Sale',
    lastCallOn: '08.10.2025',
    confBy: 'Aakshi',
    ref: 'Book Calling',
    otherProp: '',
    note: '1.2cr',
    image: buildRealEstateImage(18, 'Amrapali Silicon CITY'),
  },
  {
    id: 'r19',
    title: 'Amrapali Silicon CITY',
    city: 'Noida',
    sector: 'Sector 76',
    size: '1180 sq ft',
    unitType: '2BR STUDY',
    tower: 'B',
    price: '1.1cr',
    status: 'Sale',
    lastCallOn: '08.10.2025',
    confBy: 'Aakshi',
    ref: 'Book Calling',
    otherProp: '',
    note: '1.1cr',
    image: buildRealEstateImage(19, 'Amrapali Silicon CITY'),
  },
  {
    id: 'r20',
    title: 'Sethi Max Royal',
    city: 'Noida',
    sector: 'Sector 76',
    size: '940 sq ft',
    unitType: '2bhk',
    tower: 'D',
    price: '95 lacks',
    status: 'Sale',
    lastCallOn: '2025-07-01 00:00:00',
    confBy: 'Aakshi',
    ref: 'Prop Sol',
    otherProp: '',
    note: '95 lacks',
    image: buildRealEstateImage(20, 'Sethi Max Royal'),
  },
  {
    id: 'r21',
    title: 'Amrapali Silicon City',
    city: 'Noida',
    sector: 'Sector 76',
    size: '1034 sq ft',
    unitType: '2bhk',
    tower: 'E',
    price: '1Cr',
    status: 'Sale',
    lastCallOn: '08.10.2025',
    confBy: 'Aakshi',
    ref: 'Prop Sol',
    otherProp: '',
    note: '1Cr',
    image: buildRealEstateImage(21, 'Amrapali Silicon City'),
  },
  {
    id: 'r22',
    title: 'Sethix Max Royal',
    city: 'Noida',
    sector: 'Sector 76',
    size: '940 sq ft',
    unitType: '2bhk',
    tower: 'D',
    price: '95 Lakhs',
    status: 'Sale',
    lastCallOn: '01.08.2025',
    confBy: 'Aakshi',
    ref: 'Prop Sol',
    otherProp: '',
    note: '95 Lakhs',
    image: buildRealEstateImage(22, 'Sethix Max Royal'),
  },
  {
    id: 'r23',
    title: 'Express Zenith',
    city: 'Noida',
    sector: 'Sector 77',
    size: '960 sq ft',
    unitType: '2br',
    tower: 'E',
    price: '78 Lakhs',
    status: 'Sale',
    lastCallOn: '13.05.2025',
    confBy: 'Aakshi',
    ref: 'Book Calling',
    otherProp: '',
    note: '78 Lakhs',
    image: buildRealEstateImage(23, 'Express Zenith'),
  },
  {
    id: 'r24',
    title: 'Express Zenith',
    city: 'Noida',
    sector: 'Sector 77',
    size: '1075 sq ft',
    unitType: '2BR',
    tower: 'B',
    price: '1.3 Cr',
    status: 'Sale',
    lastCallOn: '13.05.2025',
    confBy: 'Aakshi',
    ref: 'Book Calling',
    otherProp: '',
    note: '1.3 Cr',
    image: buildRealEstateImage(24, 'Express Zenith'),
  },
  {
    id: 'r25',
    title: 'Express Zenith',
    city: 'Noida',
    sector: 'Sector 77',
    size: '950 sq ft',
    unitType: '2bhk',
    tower: 'E',
    price: '1.05 Cr',
    status: 'Sale',
    lastCallOn: '08.10.2025',
    confBy: 'Aakshi',
    ref: 'Prop Sol',
    otherProp: '',
    note: '1.05 Cr',
    image: buildRealEstateImage(25, 'Express Zenith'),
  },
  {
    id: 'r26',
    title: 'Mahagun Moderne',
    city: 'Noida',
    sector: 'Sector 78',
    size: '1250 sq ft',
    unitType: '2bhk Study',
    tower: 'Siena',
    price: '1.72Cr',
    status: 'Sale',
    lastCallOn: '04.07.2025',
    confBy: 'Aakshi',
    ref: 'Prop Sol',
    otherProp: '',
    note: '1.72Cr',
    image: buildRealEstateImage(26, 'Mahagun Moderne'),
  },
  {
    id: 'r27',
    title: 'Mahagun Moderne',
    city: 'Noida',
    sector: 'Sector 78',
    size: '1290 sq ft',
    unitType: '2bhk, Study',
    tower: 'Latina',
    price: '1.75 Cr',
    status: 'Sale',
    lastCallOn: '04.07.2025',
    confBy: 'Aakshi',
    ref: 'Prop Sol',
    otherProp: '',
    note: '1.75 Cr',
    image: buildRealEstateImage(27, 'Mahagun Moderne'),
  },
  {
    id: 'r28',
    title: 'Mahagun Mezzaria',
    city: 'Noida',
    sector: 'Sector 78',
    size: '2500 sq ft',
    unitType: '3br, 3 toi, SQ',
    tower: 'Ferrara',
    price: '4.30 cr',
    status: 'Sale',
    lastCallOn: '17/3/2026',
    confBy: 'Aakshi',
    ref: 'Data Calling',
    otherProp: '',
    note: '4.30 cr',
    image: buildRealEstateImage(28, 'Mahagun Mezzaria'),
  },
  {
    id: 'r29',
    title: 'Gaur Sportswood',
    city: 'Noida',
    sector: 'Sector 79',
    size: '2280 sq ft',
    unitType: '3bhk+SQ',
    tower: 'C',
    price: '3.65 Cr',
    status: 'Sale',
    lastCallOn: '30.06.2025',
    confBy: 'Aman',
    ref: '99acres',
    otherProp: '',
    note: '3.65 Cr',
    image: buildRealEstateImage(29, 'Gaur Sportswood'),
  },
  {
    id: 'r30',
    title: 'LOTUS Boulvard',
    city: 'Noida',
    sector: 'Sector 100',
    size: '1400 sq ft',
    unitType: '',
    tower: 'T8',
    price: '2.85 Cr',
    status: 'Sale',
    lastCallOn: '22.03.2025',
    confBy: 'Aakshi',
    ref: 'P Calling',
    otherProp: '',
    note: '2.85 Cr',
    image: buildRealEstateImage(30, 'LOTUS Boulvard'),
  },
  {
    id: 'r31',
    title: 'Amarpali HEART BEAT',
    city: 'Noida',
    sector: 'Sector 107',
    size: '1735 sq ft',
    unitType: '',
    tower: 'E',
    price: '11K Per Sq Ft',
    status: 'SALE',
    lastCallOn: '16.2.2026',
    confBy: 'Meenakshi',
    ref: '',
    otherProp: '',
    note: '11K Per Sq Ft',
    image: buildRealEstateImage(31, 'Amarpali HEART BEAT'),
  },
  {
    id: 'r32',
    title: 'Amarpali HEART BEAT',
    city: 'Noida',
    sector: 'Sector 107',
    size: '1350 sq ft',
    unitType: '',
    tower: 'M',
    price: '11K Per Sq Ft',
    status: 'SALE',
    lastCallOn: '16.2.2026',
    confBy: 'Meenakshi',
    ref: '',
    otherProp: '',
    note: '11K Per Sq Ft',
    image: buildRealEstateImage(32, 'Amarpali HEART BEAT'),
  },
  {
    id: 'r33',
    title: 'Amarpali HEART BEAT',
    city: 'Noida',
    sector: 'Sector 107',
    size: '1195 sq ft',
    unitType: '',
    tower: 'C',
    price: '11K Per Sq Ft',
    status: 'SALE',
    lastCallOn: '16.2.2026',
    confBy: 'Meenakshi',
    ref: '',
    otherProp: '',
    note: '11K Per Sq Ft',
    image: buildRealEstateImage(33, 'Amarpali HEART BEAT'),
  },
  {
    id: 'r34',
    title: 'Amarpali HEART BEAT',
    city: 'Noida',
    sector: 'Sector 107',
    size: '1350 sq ft',
    unitType: '',
    tower: 'H',
    price: '11K Per Sq Ft',
    status: 'SALE',
    lastCallOn: '16.2.2026',
    confBy: 'Meenakshi',
    ref: '',
    otherProp: '',
    note: '11K Per Sq Ft',
    image: buildRealEstateImage(34, 'Amarpali HEART BEAT'),
  },
  {
    id: 'r35',
    title: 'Amarpali HEART BEAT',
    city: 'Noida',
    sector: 'Sector 107',
    size: '1350 sq ft',
    unitType: '',
    tower: 'G',
    price: '11K Per Sq Ft',
    status: 'SALE',
    lastCallOn: '16.2.2026',
    confBy: 'Meenakshi',
    ref: '',
    otherProp: '',
    note: '11K Per Sq Ft',
    image: buildRealEstateImage(35, 'Amarpali HEART BEAT'),
  },
  {
    id: 'r36',
    title: 'Amarpali HEART BEAT',
    city: 'Noida',
    sector: 'Sector 107',
    size: '1350 sq ft',
    unitType: '',
    tower: 'G',
    price: '11K Per Sq Ft',
    status: 'SALE',
    lastCallOn: '16.2.2026',
    confBy: 'Meenakshi',
    ref: '',
    otherProp: '',
    note: '11K Per Sq Ft',
    image: buildRealEstateImage(36, 'Amarpali HEART BEAT'),
  },
  {
    id: 'r37',
    title: 'Amrapali Heart Beat',
    city: 'Noida',
    sector: 'Sector 107',
    size: '2125 sq ft',
    unitType: '',
    tower: 'A',
    price: '11K Per Sq Ft',
    status: 'Sale',
    lastCallOn: '16.2.2026',
    confBy: 'Meenakshi',
    ref: '',
    otherProp: '',
    note: '11K Per Sq Ft',
    image: buildRealEstateImage(37, 'Amrapali Heart Beat'),
  },
  {
    id: 'r38',
    title: 'Great Value Sharnam',
    city: 'Noida',
    sector: 'Sector 107',
    size: '1791 3bhk, study sq ft',
    unitType: '',
    tower: 'C',
    price: '3 cr',
    status: 'SALE',
    lastCallOn: '17/3/2026',
    confBy: 'Aman',
    ref: 'Sharnam Data Challing',
    otherProp: '',
    note: '3 cr',
    image: buildRealEstateImage(38, 'Great Value Sharnam'),
  },
  {
    id: 'r39',
    title: 'Great Value Sharnam',
    city: 'Noida',
    sector: 'Sector 107',
    size: '1791 sq ft',
    unitType: '3bhk, Study',
    tower: 'C',
    price: '2.75 Cr',
    status: 'SALE',
    lastCallOn: '17/3/2026',
    confBy: 'Aakshi',
    ref: '',
    otherProp: '',
    note: '2.75 Cr',
    image: buildRealEstateImage(39, 'Great Value Sharnam'),
  },
  {
    id: 'r40',
    title: 'Great Value Sharnam',
    city: 'Noida',
    sector: 'Sector 107',
    size: '1139 sq ft',
    unitType: '2bhk , 2bath',
    tower: 'G',
    price: '1.45 Cr',
    status: 'SALE',
    lastCallOn: '17/3/2026',
    confBy: 'Aakshi',
    ref: '',
    otherProp: '',
    note: '1.45 Cr',
    image: buildRealEstateImage(40, 'Great Value Sharnam'),
  },
  {
    id: 'r41',
    title: 'Sharanam',
    city: 'Noida',
    sector: 'Sector 107',
    size: '1139 sq ft',
    unitType: '',
    tower: 'G',
    price: '1.5 Cr',
    status: 'SALE',
    lastCallOn: '27/2/2026',
    confBy: 'Meenakshi',
    ref: '',
    otherProp: '',
    note: '1.5 Cr',
    image: buildRealEstateImage(41, 'Sharanam'),
  },
  {
    id: 'r42',
    title: 'Sunworld Vanalika',
    city: 'Noida',
    sector: 'Sector 107',
    size: '1730 sq ft',
    unitType: '',
    tower: 'T-12',
    price: '2.60 Cr',
    status: 'SALE',
    lastCallOn: '27/2/2026',
    confBy: 'Meenakshi',
    ref: '',
    otherProp: '',
    note: '2.60 Cr',
    image: buildRealEstateImage(42, 'Sunworld Vanalika'),
  },
  {
    id: 'r43',
    title: 'Sunworld Vanalika',
    city: 'Noida',
    sector: 'Sector 107',
    size: '1730 sq ft',
    unitType: '',
    tower: 'T-12',
    price: '2.72 Cr',
    status: 'SALE',
    lastCallOn: '27/2/2026',
    confBy: 'Meenakshi',
    ref: '',
    otherProp: '',
    note: '2.72 Cr',
    image: buildRealEstateImage(43, 'Sunworld Vanalika'),
  },
  {
    id: 'r44',
    title: 'Daisy Meadouws',
    city: 'Noida',
    sector: 'Sector 108',
    size: '1060 sq ft',
    unitType: '',
    tower: 'Daisy',
    price: '1Cr',
    status: 'SALE',
    lastCallOn: '2026-02-03 00:00:00',
    confBy: 'Meenakshi',
    ref: '',
    otherProp: '',
    note: '1Cr',
    image: buildRealEstateImage(44, 'Daisy Meadouws'),
  },
  {
    id: 'r45',
    title: 'Lotus Panache',
    city: 'Noida',
    sector: 'Sector 110',
    size: '1220 sq ft',
    unitType: '2bhk',
    tower: 'Tower-21',
    price: '11K Per Sq Ft',
    status: 'Sale',
    lastCallOn: '15.09.2025',
    confBy: 'Aakshi',
    ref: 'Prop Sol',
    otherProp: '',
    note: '11K Per Sq Ft',
    image: buildRealEstateImage(45, 'Lotus Panache'),
  },
  {
    id: 'r46',
    title: 'Lotus Panache',
    city: 'Noida',
    sector: 'Sector 110',
    size: '1220 sq ft',
    unitType: '2bhk',
    tower: 'Tower-26',
    price: '3 Cr',
    status: 'Sale',
    lastCallOn: '15.09.2025',
    confBy: 'Aakshi',
    ref: 'Prop Sol',
    otherProp: '',
    note: '3 Cr',
    image: buildRealEstateImage(46, 'Lotus Panache'),
  },
  {
    id: 'r47',
    title: 'Lotus Panache',
    city: 'Noida',
    sector: 'Sector 110',
    size: '1220 sq ft',
    unitType: '2bhk',
    tower: 'Tower-21',
    price: '10.5 K per sqft',
    status: 'Sale',
    lastCallOn: '15.09.2025',
    confBy: 'Aakshi',
    ref: 'Prop Sol',
    otherProp: '',
    note: '10.5 K per sqft',
    image: buildRealEstateImage(47, 'Lotus Panache'),
  },
  {
    id: 'r48',
    title: 'Lotus Panache',
    city: 'Noida',
    sector: 'Sector 110',
    size: '1220 sq ft',
    unitType: '2bhk',
    tower: 'Tower-2',
    price: '1cr',
    status: 'Sale',
    lastCallOn: '15.09.2025',
    confBy: 'Aakshi',
    ref: 'Prop Sol',
    otherProp: '',
    note: '1cr',
    image: buildRealEstateImage(48, 'Lotus Panache'),
  },
  {
    id: 'r49',
    title: 'Lotus Panache',
    city: 'Noida',
    sector: 'Sector 110',
    size: '1067 sq ft',
    unitType: '2bhk',
    tower: 'Tower-5',
    price: '10.5 K per sqft',
    status: 'Sale',
    lastCallOn: '15.09.2025',
    confBy: 'Aakshi',
    ref: 'Prop Sol',
    otherProp: '',
    note: '10.5 K per sqft',
    image: buildRealEstateImage(49, 'Lotus Panache'),
  },
  {
    id: 'r50',
    title: 'Lotus Panache',
    city: 'Noida',
    sector: 'Sector 110',
    size: '1720 sq ft',
    unitType: '',
    tower: 'T24',
    price: '6k per sq ft',
    status: 'Sale',
    lastCallOn: '17/3/2026',
    confBy: 'Aakshi',
    ref: 'Sharnam Data Calling',
    otherProp: 'Lotus Zing 1500sft',
    note: '6k per sq ft',
    image: buildRealEstateImage(50, 'Lotus Panache'),
  },
  {
    id: 'r51',
    title: 'Ivory County',
    city: 'Noida',
    sector: 'Sector 115',
    size: '2727 sq ft',
    unitType: '4bhk, 4 toi, U',
    tower: 'C4',
    price: '15500k Per sq ft',
    status: 'SALE',
    lastCallOn: '17/3/2026',
    confBy: 'Aakshi',
    ref: '',
    otherProp: '',
    note: '15500k Per sq ft',
    image: buildRealEstateImage(51, 'Ivory County'),
  },
  {
    id: 'r52',
    title: 'Ivory County',
    city: 'Noida',
    sector: 'Sector 115',
    size: '2034 sq ft',
    unitType: '3bhk, 3toi',
    tower: 'A3',
    price: '3.3 Cr',
    status: 'Sale',
    lastCallOn: '17/3/2026',
    confBy: 'Aakshi',
    ref: 'Email',
    otherProp: '',
    note: '3.3 Cr',
    image: buildRealEstateImage(52, 'Ivory County'),
  },
  {
    id: 'r53',
    title: 'Ivory County',
    city: 'Noida',
    sector: 'Sector 115',
    size: '2034 sq ft',
    unitType: '3bhk, 3toi',
    tower: 'A3',
    price: '14K per Sq ft',
    status: 'Sale',
    lastCallOn: '17/3/2026',
    confBy: 'Aakshi',
    ref: '',
    otherProp: '',
    note: '14K per Sq ft',
    image: buildRealEstateImage(53, 'Ivory County'),
  },
  {
    id: 'r54',
    title: 'Ivory County',
    city: 'Noida',
    sector: 'Sector 115',
    size: '2304 sq ft',
    unitType: '3bhk, 3toi',
    tower: 'B3',
    price: '17k Per sq ft',
    status: 'Sale',
    lastCallOn: '17/3/2026',
    confBy: 'Aakshi',
    ref: 'Prop Sol',
    otherProp: '',
    note: '17k Per sq ft',
    image: buildRealEstateImage(54, 'Ivory County'),
  },
  {
    id: 'r55',
    title: 'Ivory County',
    city: 'Noida',
    sector: 'Sector 115',
    size: '2304 sq ft',
    unitType: '4bhk, 4 toi, U',
    tower: 'B6',
    price: '15k per sq ft',
    status: 'SALE',
    lastCallOn: '18/3/2026',
    confBy: 'Aakshi',
    ref: '',
    otherProp: '',
    note: '15k per sq ft',
    image: buildRealEstateImage(55, 'Ivory County'),
  },
  {
    id: 'r56',
    title: 'Ivory County',
    city: 'Noida',
    sector: 'Sector 115',
    size: '2034 sq ft',
    unitType: '3bhk, 3toi',
    tower: 'A1',
    price: '15k per sq ft',
    status: 'SALE',
    lastCallOn: '18/3/2026',
    confBy: 'Aakshi',
    ref: '',
    otherProp: '',
    note: '15k per sq ft',
    image: buildRealEstateImage(56, 'Ivory County'),
  },
  {
    id: 'r57',
    title: 'Ivory County',
    city: 'Noida',
    sector: 'Sector 115',
    size: '2727 sq ft',
    unitType: '4bhk, 4 toi, U',
    tower: 'C3',
    price: '14.5 K per sq ft',
    status: 'SALE',
    lastCallOn: '18/3/2026',
    confBy: 'Aakshi',
    ref: '',
    otherProp: '',
    note: '14.5 K per sq ft',
    image: buildRealEstateImage(57, 'Ivory County'),
  },
  {
    id: 'r58',
    title: 'Ivory County',
    city: 'Noida',
    sector: 'Sector 115',
    size: '2034 sq ft',
    unitType: '3bhk, 3toi',
    tower: 'A3',
    price: '16k per sq ft',
    status: 'Sale',
    lastCallOn: '18/3/2026',
    confBy: 'Aakshi',
    ref: '',
    otherProp: '',
    note: '16k per sq ft',
    image: buildRealEstateImage(58, 'Ivory County'),
  },
  {
    id: 'r59',
    title: 'Ivory County',
    city: 'Noida',
    sector: 'Sector 115',
    size: '2034 sq ft',
    unitType: '3bhk, 3toi',
    tower: 'A3',
    price: '15k per sq ft',
    status: 'Sale',
    lastCallOn: '18/3/2026',
    confBy: 'Aakshi',
    ref: '',
    otherProp: '',
    note: '15k per sq ft',
    image: buildRealEstateImage(59, 'Ivory County'),
  },
  {
    id: 'r60',
    title: 'Cleo County',
    city: 'Noida',
    sector: 'Sector 121',
    size: '3195 sq ft',
    unitType: '4bhk, utility, 5 Bath',
    tower: 'G',
    price: '7.5 cr',
    status: 'SALE',
    lastCallOn: '18/3/2026',
    confBy: 'Aakshi',
    ref: 'Prop Sol',
    otherProp: '',
    note: '7.5 cr',
    image: buildRealEstateImage(60, 'Cleo County'),
  },
  {
    id: 'r61',
    title: 'Ats Knightbridge',
    city: 'Noida',
    sector: 'Sector 124',
    size: '6000 sq ft',
    unitType: 'TYPE 1',
    tower: '',
    price: '30K per sq ft',
    status: 'SALE',
    lastCallOn: '18/3/2026',
    confBy: 'Aakshi',
    ref: 'Whatsapp',
    otherProp: '',
    note: '30K per sq ft',
    image: buildRealEstateImage(61, 'Ats Knightbridge'),
  },
  {
    id: 'r62',
    title: 'Kalpatru Vista',
    city: 'Noida',
    sector: 'Sector 128',
    size: '3095 sq ft',
    unitType: '',
    tower: 'A',
    price: '22k Per sq ft',
    status: 'SALE',
    lastCallOn: '18/3/2026',
    confBy: 'Aakshi',
    ref: 'Prop Sol',
    otherProp: '',
    note: '22k Per sq ft',
    image: buildRealEstateImage(62, 'Kalpatru Vista'),
  },
  {
    id: 'r63',
    title: 'ACE GOLF SHIRE',
    city: 'Noida',
    sector: 'Sector 150',
    size: '1690 sq ft',
    unitType: '',
    tower: '2',
    price: '3.45 Cr',
    status: 'SALE',
    lastCallOn: '18/3/2026',
    confBy: 'Meenakshi',
    ref: '',
    otherProp: '',
    note: '3.45 Cr',
    image: buildRealEstateImage(63, 'ACE GOLF SHIRE'),
  },
  {
    id: 'r64',
    title: 'KOSMOS',
    city: 'Noida',
    sector: 'Sector 134',
    size: '850SQFT sq ft',
    unitType: '2BHK',
    tower: 'KM47',
    price: '9.5 k per sq ft',
    status: 'SALE',
    lastCallOn: '16/3/2026',
    confBy: 'Meenakshi',
    ref: '',
    otherProp: '',
    note: '9.5 k per sq ft',
    image: buildRealEstateImage(64, 'KOSMOS'),
  },
  {
    id: 'r65',
    title: 'Sapphir PH1',
    city: 'Noida',
    sector: 'Sector 45',
    size: '1140SQFT sq ft',
    unitType: '2 BHK+2 Toile',
    tower: 'D',
    price: '1.5 Cr',
    status: 'SALE',
    lastCallOn: '16/3/2026',
    confBy: 'Meenakshi',
    ref: '',
    otherProp: '',
    note: '1.5 Cr',
    image: buildRealEstateImage(65, 'Sapphir PH1'),
  },
  {
    id: 'r66',
    title: 'Sapphir PH1',
    city: 'Noida',
    sector: 'Sector 45',
    size: '1640 sq ft',
    unitType: '3BHK+3 Toilet',
    tower: 'G',
    price: '2.2 cr',
    status: 'SALE',
    lastCallOn: '20/12/2025',
    confBy: 'Meenakshi',
    ref: '',
    otherProp: '',
    note: '2.2 cr',
    image: buildRealEstateImage(66, 'Sapphir PH1'),
  },
  {
    id: 'r67',
    title: 'Sapphir PH2',
    city: 'Noida',
    sector: 'Sector 45',
    size: '1140SQFT sq ft',
    unitType: '2BHK+2 Toilet',
    tower: 'S',
    price: '1.35 Cr',
    status: 'SALE',
    lastCallOn: '15/11/2025/16/3/2026',
    confBy: 'Meenakshi',
    ref: 'amodksoni@gmail.com',
    otherProp: '',
    note: '1.35 Cr',
    image: buildRealEstateImage(67, 'Sapphir PH2'),
  },
  {
    id: 'r68',
    title: 'Prateek Wistera',
    city: 'Noida',
    sector: 'Sector 77',
    size: '1735 sq ft',
    unitType: '',
    tower: 'B',
    price: '3.3 Cr',
    status: 'SALE',
    lastCallOn: '',
    confBy: 'Meenakshi',
    ref: '',
    otherProp: '',
    note: '3.3 Cr',
    image: buildRealEstateImage(68, 'Prateek Wistera'),
  },
  {
    id: 'r69',
    title: 'Prateek Wistera',
    city: 'Noida',
    sector: 'Sector 77',
    size: '955 sq ft',
    unitType: '',
    tower: 'N',
    price: '1.2 Cr',
    status: 'SALE',
    lastCallOn: '',
    confBy: '',
    ref: '',
    otherProp: '',
    note: '1.2 Cr',
    image: buildRealEstateImage(69, 'Prateek Wistera'),
  },
  {
    id: 'r70',
    title: 'WOODS',
    city: 'Noida',
    sector: 'Sector 46',
    size: '2088.09 sq ft',
    unitType: '3 BHK',
    tower: 'T2',
    price: '4.25 Cr',
    status: 'SALE',
    lastCallOn: '',
    confBy: '',
    ref: 'mailtoparvesh@gmail.com',
    otherProp: '',
    note: '4.25 Cr',
    image: buildRealEstateImage(70, 'WOODS'),
  }
];

const exploreLocalitiesWithImages = exploreLocalities.map((item, index) => ({
  ...item,
  image: buildLocalityImage(index + 401, `${item.name} ${item.city}`),
}));

// --- LOGO ARRAYS FOR ANIMATION (From 3rd Code) ---
const topRowLogos = [
  "/images (3).png",
  "/images__9_-removebg-preview.png",
  "/images (1).png",
  "/images (2).png",
  "/183f468e401f4220bce9e4f7b1e3ffd820251112162925170.png",
];

const bottomRowLogos = [
  "/images.png",
  "/4f3bb698972531.Y3JvcCw5NTAsNzQzLDIyMywyMQ-removebg-preview.png",
  "/Max_Estates_logo.svg.png",
  "/M3M-Jacob-and-Co-logo.png",
];

const categoryOptions = [
  { label: 'Buy', value: 'buy' },
  { label: 'Sell', value: 'sell' },
  { label: 'Rent', value: 'rent' },
];

const propertyTypeOptions = [
  { label: 'Apartment', value: 'apartment' },
  { label: 'Villa', value: 'villa' },
  { label: 'Commercial', value: 'commercial' },
  { label: 'Plot', value: 'plot' },
];

const socialIconMap = {
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
  whatsapp: MessageCircle,
};

export default function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState({ category: 'buy', city: '', property_type: '', max_price: '' });
  const [searchFocused, setSearchFocused] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [loanLead, setLoanLead] = useState({ name: '', phone: '' });

  const suggestions = useMemo(() => {
    const query = search.city.trim().toLowerCase();
    if (!query) return exploreLocalities;
    return exploreLocalities.filter((item) => item.name.toLowerCase().includes(query) || item.city.toLowerCase().includes(query));
  }, [search.city]);

  const handleSearch = () => navigate(createPropertySearch(search));
  
  const handleNewsletter = () => {
    if (!newsletterEmail.includes('@')) return;
    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(`Hi ANK Realty, subscribe me for property deals. My email is ${newsletterEmail}.`)}`, '_blank', 'noopener,noreferrer');
  };
  
  const handleLoanLead = () => {
    if (!loanLead.name || loanLead.phone.replace(/\D/g, '').length < 10) return;
    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(`Hi ANK Realty, I want a home-loan comparison. Name: ${loanLead.name}, Phone: ${loanLead.phone}.`)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-red-200 relative">
      <Navbar />
      <RegisterPopup />

      {/* --- HERO SECTION (Base Code 1) --- */}
      <section className="relative pt-32 pb-28 px-4 md:px-6 overflow-hidden min-h-[85vh]">
        <div className="absolute inset-0 z-0" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2000&auto=format&fit=crop')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-slate-900/85 z-10" />
        <div className="relative z-20 max-w-6xl mx-auto text-center mt-10">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-bold tracking-widest uppercase">Trusted by thousands of buyers across India</div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight uppercase">Discover premium property opportunities across <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">Delhi NCR</span></h1>
          <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">Search verified homes, plotted developments, rentals, and commercial spaces with a faster, cleaner, production-ready experience.</p>

          <div className="bg-white rounded-[2rem] shadow-2xl p-4 md:p-6 max-w-5xl mx-auto border border-slate-100 text-left">
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6 px-2 border-b border-slate-100 pb-4">
              {categoryOptions.map((cat) => (
                <button key={cat.value} onClick={() => setSearch((prev) => ({ ...prev, category: cat.value }))} className={`px-4 py-2 rounded-full font-bold ${search.category === cat.value ? 'bg-red-50 text-red-600 border border-red-200' : 'text-slate-500 border border-transparent hover:text-slate-900'}`}>{cat.label}</button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
              <div className="relative md:border-r md:border-slate-200">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input value={search.city} onChange={(e) => setSearch((prev) => ({ ...prev, city: e.target.value }))} onFocus={() => setSearchFocused(true)} onBlur={() => setTimeout(() => setSearchFocused(false), 150)} placeholder="City or micro-market" className="h-14 pl-12 border-0 shadow-none focus-visible:ring-0" />
                {searchFocused && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-20">
                    {suggestions.slice(0, 5).map((item) => (
                      <button key={item.name} type="button" onClick={() => { setSearch((prev) => ({ ...prev, city: item.city, property_type: item.propertyType })); setSearchFocused(false); }} className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50">
                        <p className="font-bold text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.badge}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative md:border-r md:border-slate-200">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <select value={search.property_type} onChange={(e) => setSearch((prev) => ({ ...prev, property_type: e.target.value }))} className="h-14 pl-12 pr-4 bg-transparent border-0 w-full text-slate-700 appearance-none outline-none font-medium">
                  <option value="">Property Type</option>
                  {propertyTypeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </div>
              <div className="relative">
                <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <select value={search.max_price} onChange={(e) => setSearch((prev) => ({ ...prev, max_price: e.target.value }))} className="h-14 pl-12 pr-4 bg-transparent border-0 w-full text-slate-700 appearance-none outline-none font-medium">
                  <option value="">Budget</option>
                  <option value="5000000">Up to ₹50 Lac</option>
                  <option value="10000000">Up to ₹1 Cr</option>
                  <option value="30000000">Up to ₹3 Cr</option>
                  <option value="50000000">Above ₹3 Cr</option>
                </select>
              </div>
              <Button onClick={handleSearch} className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-black text-lg rounded-xl shadow-lg"><Search className="mr-2 h-5 w-5" /> Search</Button>
            </div>
          </div>
        </div>
      </section>

      {/* --- ADDED: TRUSTED BRANDS ANIMATION (From Code 3) --- */}
      <section className="py-12 sm:py-16 relative w-full overflow-hidden bg-white -mt-10 z-20 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] border-b border-slate-100">
        <div className="w-full">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-400 mb-8 sm:mb-12 text-center">
            Trusted by leading brands across India
          </h2>
          <div className="relative flex flex-col gap-8 sm:gap-12 overflow-hidden w-full">
            {/* First Row: Moving Left */}
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="flex gap-8 sm:gap-16 w-max"
            >
              {[...topRowLogos, ...topRowLogos, ...topRowLogos, ...topRowLogos].map((src, i) => (
                <div key={`top-${i}`} className="flex-shrink-0 w-32 sm:w-48 h-16 sm:h-20 flex items-center justify-center">
                  <img src={src} alt={`Client logo ${i}`} className="max-w-full max-h-full object-contain filter brightness-0 opacity-80 hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </motion.div>

            {/* Second Row: Moving Right */}
            <motion.div
              animate={{ x: ["-50%", "0%"] }}
              transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="flex gap-8 sm:gap-16 w-max"
            >
              {[...bottomRowLogos, ...bottomRowLogos, ...bottomRowLogos, ...bottomRowLogos].map((src, i) => (
                <div key={`bottom-${i}`} className="flex-shrink-0 w-32 sm:w-48 h-16 sm:h-20 flex items-center justify-center">
                  <img src={src} alt={`Client logo ${i}`} className="max-w-full max-h-full object-contain filter brightness-0 opacity-80 hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </motion.div>

            {/* Fade Gradients (Left & Right Edges) */}
            <div className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* --- EXPLORE LOCALITIES (Base Code 1) --- */}
      <section className="py-16 bg-white relative z-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <p className="text-red-600 font-bold uppercase tracking-[0.25em] text-xs mb-3">Explore Localities</p>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900">Explore high-intent localities</h2>
              <p className="text-slate-500 mt-3 max-w-2xl">Jump straight into the corridors buyers and investors ask about most often.</p>
            </div>
            <Link to="/properties"><Button variant="outline" className="border-slate-300 font-bold">Browse all inventory <ChevronRight className="w-4 h-4 ml-2" /></Button></Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {exploreLocalitiesWithImages.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(createPropertySearch({ city: item.city, property_type: item.propertyType, category: 'buy' }))}
                className="text-left rounded-[1.75rem] overflow-hidden bg-white border border-slate-200 hover:border-red-200 hover:shadow-xl transition-all group"
              >
                <div className="relative h-44 overflow-hidden">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-red-200 font-bold mb-2">{item.badge}</p>
                    <h3 className="text-xl font-black text-white leading-tight">{item.name}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-slate-500 text-sm">View curated property options in {item.city}.</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURED INVENTORY (Base Code 1 Layout + Rich Content) --- */}
      <section className="py-20 px-6 bg-slate-50 border-b border-slate-200">
  <div className="max-w-7xl mx-auto">
    <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
      <div>
        <p className="text-red-600 font-bold uppercase tracking-[0.25em] text-xs mb-3">
          Featured inventory
        </p>
        <h2 className="text-3xl md:text-4xl font-black">
          Buy, sell, and rent with confidence
        </h2>
      </div>
      <Link to="/properties">
        <Button variant="outline">View all properties</Button>
      </Link>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {featuredProperties.map((property) => (
        <div
          key={property.id}
          onClick={() =>
            navigate(`/property/${property.id}`, {
              state: { property },
            })
          }
          className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition cursor-pointer relative group"
        >
          {/* Tag */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-slate-900 shadow-sm z-10">
            {property.tag}
          </div>

          {/* Image */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={property.image}
              alt={property.title}
              className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          </div>

          {/* Content */}
          <div className="p-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600 mb-2">
              {property.category} • {property.propertyType}
            </p>

            <h3 className="text-xl font-black text-slate-900 mb-1 group-hover:text-red-600 transition-colors line-clamp-1">
              {property.title}
            </h3>

            <p className="text-slate-500 text-sm mb-4">
              <MapPin className="inline w-3 h-3 mr-1" />
              {property.location}, {property.city}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="font-black text-slate-900 text-lg">
                {property.price}
              </span>
              <span className="text-red-600 font-bold flex items-center text-sm">
                Details <ArrowRight className="w-4 h-4 ml-1" />
              </span>
            </div>
          </div>
        </div> 
      ))}
    </div>
  </div>
</section>


      {/* --- RESALE FLATS / PLOTS SECTION --- */}
      <section className="py-20 px-6 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-red-600 font-bold uppercase tracking-[0.25em] text-xs mb-3">Resale Inventory</p>
              <h2 className="text-3xl md:text-4xl font-black">All resale flats and plot units</h2>
              <p className="text-slate-500 mt-3 max-w-2xl">
                Added directly from your resale sheet, with a different image on every card and the original details kept intact.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-2 rounded-full bg-red-50 text-red-700 font-bold text-sm border border-red-100">
                {resaleProperties.length} listings
              </div>
              <div className="px-4 py-2 rounded-full bg-slate-50 text-slate-700 font-bold text-sm border border-slate-200">
                {new Set(resaleProperties.map((item) => item.sector)).size} sectors
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {resaleProperties.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(createPropertySearch({ city: item.city, property_type: 'apartment', category: 'buy' }))}
                className="text-left bg-slate-50 rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all group cursor-pointer"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {item.status && (
                      <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur text-slate-900 text-xs font-black">
                        {item.status}
                      </span>
                    )}
                    {item.confBy && (
                      <span className="px-3 py-1 rounded-full bg-red-600/90 backdrop-blur text-white text-xs font-black">
                        {item.confBy}
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-red-100 font-bold mb-1">{item.sector}</p>
                    <h3 className="text-xl font-black text-white leading-tight">{item.title}</h3>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-slate-500 text-sm mb-3">{item.city}{item.otherProp ? ` • ${item.otherProp}` : ''}</p>

                  <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                    <div className="p-3 rounded-2xl bg-white border border-slate-200">
                      <p className="text-slate-400 text-xs uppercase tracking-[0.2em] font-bold mb-1">Size</p>
                      <p className="font-black text-slate-900">{item.size || '—'}</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-white border border-slate-200">
                      <p className="text-slate-400 text-xs uppercase tracking-[0.2em] font-bold mb-1">Unit Type</p>
                      <p className="font-black text-slate-900">{item.unitType || '—'}</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-white border border-slate-200">
                      <p className="text-slate-400 text-xs uppercase tracking-[0.2em] font-bold mb-1">Tower</p>
                      <p className="font-black text-slate-900">{item.tower || '—'}</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-white border border-slate-200">
                      <p className="text-slate-400 text-xs uppercase tracking-[0.2em] font-bold mb-1">Call On</p>
                      <p className="font-black text-slate-900">{item.lastCallOn || '—'}</p>
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-4 pt-4 border-t border-slate-200">
                    <div>
                      <p className="text-slate-400 text-xs uppercase tracking-[0.2em] font-bold mb-1">Remarks</p>
                      <p className="font-black text-slate-900">{item.price}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400 text-xs uppercase tracking-[0.2em] font-bold mb-1">Ref</p>
                      <p className="font-bold text-slate-700">{item.ref || '—'}</p>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* --- WHY INDIA & LOAN FORM (Base Code 1) --- */}
      <section className="py-20 px-6 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-red-600 font-bold uppercase tracking-[0.25em] text-xs mb-3">Why India</p>
            <h2 className="text-3xl md:text-5xl font-black mb-6">Why buyers continue choosing India’s growth markets</h2>
            <p className="text-slate-600 text-lg leading-8 mb-8">Strong infrastructure pipelines, expanding business districts, and maturing social infrastructure continue to improve end-user demand and investment resilience. Trusted by thousands of buyers across India, ANK Realty simplifies the journey with verified inventory and human support.</p>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                ['Verified listings', 'Property screening and lead qualification reduce wasted site visits.'],
                ['Local market guidance', 'Actionable help on pricing, ROI, and document readiness.'],
                ['Cross-category discovery', 'Explore residential, plotted, rental, and corporate inventory in one flow.'],
                ['Human support', 'Dedicated experts for search, loan guidance, and leasing support.'],
              ].map(([title, body]) => (
                <div key={title} className="p-6 rounded-3xl bg-slate-50 border border-slate-200">
                  <h3 className="font-black text-slate-900 mb-2">{title}</h3>
                  <p className="text-slate-500 text-sm leading-7">{body}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
            <div className="flex items-center gap-3 mb-8"><Calculator className="w-7 h-7 text-red-500" /><h3 className="text-3xl font-black">Apply Loan</h3></div>
            <div className="space-y-4 mb-8">
              {bankOffers.map((offer) => (
                <div key={offer.bank} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-black text-lg">{offer.bank}</p>
                    <p className="text-slate-300 text-sm">{offer.note}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-red-400 font-black">{offer.rate}</p>
                    <p className="text-xs text-slate-400">Indicative rate</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <Input value={loanLead.name} onChange={(e) => setLoanLead((prev) => ({ ...prev, name: e.target.value }))} placeholder="Your name" className="bg-white text-slate-900 h-12 rounded-xl" />
              <Input value={loanLead.phone} onChange={(e) => setLoanLead((prev) => ({ ...prev, phone: e.target.value }))} placeholder="Phone number" className="bg-white text-slate-900 h-12 rounded-xl" />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleLoanLead} className="bg-red-600 hover:bg-red-700 h-12 rounded-xl text-base px-6">Request callback</Button>
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer"><Button variant="outline" className="h-12 border-white/20 text-white hover:bg-white/10 rounded-xl px-6">Contact on WhatsApp</Button></a>
            </div>
          </div>
        </div>
      </section>

      {/* --- NEWS & INSIGHTS (Base Code 1) --- */}
      <section className="py-20 px-6 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-red-600 font-bold uppercase tracking-[0.25em] text-xs mb-3">News & Insights</p>
              <h2 className="text-3xl md:text-4xl font-black">Dynamic content blocks for buyers, sellers, and investors</h2>
            </div>
            <Link to="/blog"><Button variant="outline">Open resource center</Button></Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {newsArticles.map((article) => (
              <Link key={article.id} to="/blog" className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all">
                <img src={article.image} alt={article.title} className="h-52 w-full object-cover" />
                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.25em] text-red-500 font-bold mb-3">{article.category}</p>
                  <h3 className="text-xl font-black text-slate-900 mb-3">{article.title}</h3>
                  <p className="text-slate-500 text-sm leading-7 mb-4">{article.excerpt}</p>
                  <div className="text-sm text-slate-400">{article.date} • {article.readTime}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- CATEGORIES & QUICK LINKS (Base Code 1) --- */}
      <section className="py-20 px-6 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            { title: 'Builders', body: 'Explore developer-backed launches and compare price bands.', to: '/buy', icon: Building2 },
            { title: 'Agents', body: 'Connect with ANK experts for guided tours and negotiation support.', to: '/contact', icon: Users },
            { title: 'Corporate Leasing', body: 'Find office, retail, and relocation solutions for your team.', to: '/corporate-leasing', icon: Briefcase },
          ].map((item) => (
            <Link key={item.title} to={item.to} className="p-8 rounded-[2rem] bg-slate-50 border border-slate-200 hover:border-red-200 hover:bg-red-50 transition-all">
              <item.icon className="w-8 h-8 text-red-600 mb-5" />
              <h3 className="text-2xl font-black text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-500 mb-4">{item.body}</p>
              <span className="font-bold text-red-600 flex items-center">Open <ArrowRight className="w-4 h-4 ml-2" /></span>
            </Link>
          ))}
        </div>
      </section>

      {/* --- NEWSLETTER CTA (Base Code 1) --- */}
      <section className="py-20 px-6 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Bell className="w-14 h-14 text-red-500 mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-black mb-4">Never Miss a Property Deal</h2>
          <p className="text-slate-400 text-lg mb-10">Get pre-launch alerts, price updates, and curated property matches on email and WhatsApp.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <input type="email" value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} placeholder="Enter your email address" className="flex-1 h-14 rounded-xl px-5 bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-red-500" />
            <Button onClick={handleNewsletter} className="h-14 px-8 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-lg">Subscribe</Button>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer"><Button variant="outline" className="h-14 border-white/20 text-white hover:bg-white/10 rounded-xl"><MessageCircle className="w-4 h-4 mr-2" /> WhatsApp</Button></a>
          </div>
        </div>
      </section>

      {/* --- FOOTER (Base Code 1) --- */}
      <footer className="bg-[#0A0A0A] text-white pt-20 pb-10 px-6 border-t-[8px] border-red-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6 pr-4">
              <h3 className="text-3xl font-extrabold tracking-tight">ANK Realty<span className="text-red-600">.</span></h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">Premium property discovery, verified advisory, corporate leasing help, and owner-first listing support.</p>
              <div className="flex space-x-4 pt-2">
                {socialLinks.map((link) => {
                  const Icon = socialIconMap[link.icon] || Handshake;
                  return <a key={link.label} href={link.href} target="_blank" rel="noreferrer" aria-label={link.label} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 transition-all cursor-pointer"><Icon className="w-4 h-4" /></a>;
                })}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6 text-slate-100 uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-4 text-slate-400 font-medium text-sm">
                <li><Link to="/properties" className="hover:text-red-500">All Properties</Link></li>
                <li><Link to="/about" className="hover:text-red-500">About Us</Link></li>
                <li><Link to="/careers" className="hover:text-red-500">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-red-500">Contact Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6 text-slate-100 uppercase tracking-wider">Categories</h4>
              <ul className="space-y-4 text-slate-400 font-medium text-sm">
                <li><Link to="/properties?property_type=plot" className="hover:text-red-500">Premium Plots</Link></li>
                <li><Link to="/buy" className="hover:text-red-500">Residential Properties</Link></li>
                <li><Link to="/properties?property_type=commercial" className="hover:text-red-500">Commercial Spaces</Link></li>
                <li><Link to="/rent" className="hover:text-red-500">Rental Homes</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6 text-slate-100 uppercase tracking-wider">Contact Us</h4>
              <div className="space-y-5 text-slate-400 font-medium text-sm">
                <p className="flex items-start"><MapPin className="w-5 h-5 mr-3 text-red-500 shrink-0" /> Tapasya Corp Heights, Noida, UP 201301</p>
                <p className="flex items-center"><Mail className="w-5 h-5 mr-3 text-red-500 shrink-0" /> info@ankrealty.com</p>
                <p className="flex items-center"><MessageCircle className="w-5 h-5 mr-3 text-red-500 shrink-0" /> WhatsApp support available</p>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 font-medium">
            <p>&copy; {new Date().getFullYear()} ANK Realty. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="hover:text-slate-300">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-slate-300">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
