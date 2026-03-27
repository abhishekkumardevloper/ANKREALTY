import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Banknote,
  Bell,
  Briefcase,
  Building2,
  Calculator,
  ChevronRight,
  Filter,
  Handshake,
  Home,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Search,
  Sparkles,
  Users,
  Youtube,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import RegisterPopup from './RegisterPopup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { bankOffers, exploreLocalities, newsArticles, socialLinks } from '@/lib/siteData';
import { WHATSAPP_URL, createPropertySearch } from '@/lib/api';

const resaleUnits = [
  {
    "id": "r1",
    "city": "noida",
    "sector": "25.0",
    "project": "jalvayu vihar",
    "flatSize": 1050,
    "unitType": "2bhk study",
    "tower": "G",
    "remarks": "1.40cr",
    "otherProp": "",
    "status": "sale",
    "lastCallOn": "01 May 2025",
    "confBy": "aakshi",
    "ref": "prop sol",
    "propertyType": "apartment",
    "priceValue": 14000000,
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r2",
    "city": "noida",
    "sector": "45.0",
    "project": "Amrapali Sapphire",
    "flatSize": 1640,
    "unitType": "3BHK+3 Toilet",
    "tower": "L",
    "remarks": "2.5cr",
    "otherProp": "",
    "status": "sale",
    "lastCallOn": "25/2/2026",
    "confBy": "meenakshi",
    "ref": "calling",
    "propertyType": "apartment",
    "priceValue": 25000000,
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r3",
    "city": "noida",
    "sector": "45.0",
    "project": "Amarpali Sapphire",
    "flatSize": 1640,
    "unitType": "",
    "tower": "O",
    "remarks": "2.2cr",
    "otherProp": "",
    "status": "SALE",
    "lastCallOn": "25/2/2026",
    "confBy": "meenakshi",
    "ref": "",
    "propertyType": "apartment",
    "priceValue": 22000000,
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r4",
    "city": "noida",
    "sector": "45.0",
    "project": "Amrapali Sapphire",
    "flatSize": 3075,
    "unitType": "4BHK + Family Lounge + Svt. Room(3075 SQ FT)",
    "tower": "N",
    "remarks": "3.4cr",
    "otherProp": "",
    "status": "sale",
    "lastCallOn": "20.09.2025",
    "confBy": "aakshi",
    "ref": "P",
    "propertyType": "apartment",
    "priceValue": 34000000,
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r5",
    "city": "noida",
    "sector": "45.0",
    "project": "Amrapali Sapphire",
    "flatSize": 1640,
    "unitType": "3BHK+3 Toilet",
    "tower": "H",
    "remarks": "2cr",
    "otherProp": "",
    "status": "SALE",
    "lastCallOn": "17/3/2026",
    "confBy": "aakshi",
    "ref": "",
    "propertyType": "apartment",
    "priceValue": 20000000,
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r6",
    "city": "noida",
    "sector": "50.0",
    "project": "mahagun maestro",
    "flatSize": 3100,
    "unitType": "4bhk+sq",
    "tower": "TWR5",
    "remarks": "4cr",
    "otherProp": "",
    "status": "SALE",
    "lastCallOn": "17/3/2026",
    "confBy": "aakshi",
    "ref": "prop sol",
    "propertyType": "apartment",
    "priceValue": 40000000,
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r7",
    "city": "noida",
    "sector": "52.0",
    "project": "ANTRIKSH NATURE",
    "flatSize": 1750,
    "unitType": "",
    "tower": "A",
    "remarks": "2.5cr",
    "otherProp": "",
    "status": "sale",
    "lastCallOn": "17/3/2026",
    "confBy": "aakshi",
    "ref": "P calling",
    "propertyType": "apartment",
    "priceValue": 25000000,
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r8",
    "city": "noida",
    "sector": "61.0",
    "project": "shadabdi vihar",
    "flatSize": 1850,
    "unitType": "4bhk",
    "tower": "",
    "remarks": "2.7cr",
    "otherProp": "",
    "status": "sale",
    "lastCallOn": "17/3/2026",
    "confBy": "aakshi",
    "ref": "prop sol",
    "propertyType": "apartment",
    "priceValue": 27000000,
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r9",
    "city": "noida",
    "sector": "74.0",
    "project": "Supertech Cape TOWN",
    "flatSize": 1150,
    "unitType": "",
    "tower": "CS-6",
    "remarks": "80 Lakh",
    "otherProp": "",
    "status": "Sale",
    "lastCallOn": "26/2/2026",
    "confBy": "meenakshi",
    "ref": "",
    "propertyType": "apartment",
    "priceValue": 8000000,
    "image": "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r10",
    "city": "noida",
    "sector": "74.0",
    "project": "Supertech Cape TOWN",
    "flatSize": 1150,
    "unitType": "",
    "tower": "CS-4",
    "remarks": "90 Lakh",
    "otherProp": "",
    "status": "SALE",
    "lastCallOn": "26/2/2026",
    "confBy": "meenakshi",
    "ref": "",
    "propertyType": "apartment",
    "priceValue": 9000000,
    "image": "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r11",
    "city": "noida",
    "sector": "74.0",
    "project": "SUpertech Cape TOWN",
    "flatSize": 1082,
    "unitType": "",
    "tower": "CB-4",
    "remarks": "80 Lakh",
    "otherProp": "",
    "status": "SALE",
    "lastCallOn": "26/2/2026",
    "confBy": "meenakshi",
    "ref": "",
    "propertyType": "apartment",
    "priceValue": 8000000,
    "image": "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r12",
    "city": "noida",
    "sector": "75.0",
    "project": "Apex Athena",
    "flatSize": 1895,
    "unitType": "3bhk, 3toi",
    "tower": "D",
    "remarks": "2.75 Cr",
    "otherProp": "",
    "status": "SALE",
    "lastCallOn": "17/3/2026",
    "confBy": "aakshi",
    "ref": "whatsapp responses calling",
    "propertyType": "apartment",
    "priceValue": 27500000,
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r13",
    "city": "noida",
    "sector": "75.0",
    "project": "DASNAC BURJ",
    "flatSize": 3030,
    "unitType": "4bhk",
    "tower": "A",
    "remarks": "4.75 cr",
    "otherProp": "",
    "status": "SALE",
    "lastCallOn": "17/3/2026",
    "confBy": "aakshi",
    "ref": "prop sol",
    "propertyType": "apartment",
    "priceValue": 47500000,
    "image": "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r14",
    "city": "noida",
    "sector": "75.0",
    "project": "Ivy County",
    "flatSize": 1485,
    "unitType": "2bhk, lounge",
    "tower": "C2",
    "remarks": "2.7 cr",
    "otherProp": "",
    "status": "sale",
    "lastCallOn": "06.09.2025",
    "confBy": "aakshi",
    "ref": "data calling",
    "propertyType": "apartment",
    "priceValue": 27000000,
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r15",
    "city": "noida",
    "sector": "75.0",
    "project": "Ivy County",
    "flatSize": 1465,
    "unitType": "2bhk, lounge",
    "tower": "",
    "remarks": "3cr",
    "otherProp": "",
    "status": "sale",
    "lastCallOn": "13.09.2025",
    "confBy": "aakshi",
    "ref": "data calling",
    "propertyType": "apartment",
    "priceValue": 30000000,
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r16",
    "city": "noida",
    "sector": "76.0",
    "project": "Amrapali Crystal Homes",
    "flatSize": 1375,
    "unitType": "3bhk",
    "tower": "T5",
    "remarks": "1.8cr",
    "otherProp": "",
    "status": "sale",
    "lastCallOn": "30.06.2025",
    "confBy": "aman",
    "ref": "99acres",
    "propertyType": "apartment",
    "priceValue": 18000000,
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r17",
    "city": "noida",
    "sector": "76.0",
    "project": "Amrapali princely estate",
    "flatSize": 1315,
    "unitType": "3bhk",
    "tower": "",
    "remarks": "30.06.2025 aman spoke- this is miss vandana sons flat. 7th floor- rented. registered flat",
    "otherProp": "",
    "status": "sale",
    "lastCallOn": "30.06.2025",
    "confBy": "aman",
    "ref": "99acres",
    "propertyType": "apartment",
    "priceValue": 30,
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r18",
    "city": "noida",
    "sector": "76.0",
    "project": "AMRAPALI SILICON CITY",
    "flatSize": 1035,
    "unitType": "2BR",
    "tower": "N",
    "remarks": "1.2cr",
    "otherProp": "",
    "status": "sale",
    "lastCallOn": "08.10.2025",
    "confBy": "aakshi",
    "ref": "Book calling",
    "propertyType": "apartment",
    "priceValue": 12000000,
    "image": "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r19",
    "city": "noida",
    "sector": "76.0",
    "project": "AMRAPALI SILICON CITY",
    "flatSize": 1180,
    "unitType": "2BR STUDY",
    "tower": "B",
    "remarks": "1.1cr",
    "otherProp": "",
    "status": "sale",
    "lastCallOn": "08.10.2025",
    "confBy": "aakshi",
    "ref": "Book calling",
    "propertyType": "apartment",
    "priceValue": 11000000,
    "image": "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r20",
    "city": "noida",
    "sector": "76.0",
    "project": "sethi max royal",
    "flatSize": 940,
    "unitType": "2bhk",
    "tower": "D",
    "remarks": "95 lacks",
    "otherProp": "",
    "status": "sale",
    "lastCallOn": "01 Jul 2025",
    "confBy": "aakshi",
    "ref": "prop sol",
    "propertyType": "apartment",
    "priceValue": 9500000,
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r21",
    "city": "noida",
    "sector": "76.0",
    "project": "amrapali silicon city",
    "flatSize": 1034,
    "unitType": "2bhk",
    "tower": "E",
    "remarks": "1Cr",
    "otherProp": "",
    "status": "sale",
    "lastCallOn": "08.10.2025",
    "confBy": "aakshi",
    "ref": "prop sol",
    "propertyType": "apartment",
    "priceValue": 10000000,
    "image": "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r22",
    "city": "noida",
    "sector": "76.0",
    "project": "Sethix max royal",
    "flatSize": 940,
    "unitType": "2bhk",
    "tower": "D",
    "remarks": "95 Lakhs",
    "otherProp": "",
    "status": "sale",
    "lastCallOn": "01.08.2025",
    "confBy": "aakshi",
    "ref": "prop sol",
    "propertyType": "apartment",
    "priceValue": 9500000,
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r23",
    "city": "noida",
    "sector": "77.0",
    "project": "Express Zenith",
    "flatSize": 960,
    "unitType": "2br",
    "tower": "E",
    "remarks": "78 Lakhs",
    "otherProp": "",
    "status": "sale",
    "lastCallOn": "13.05.2025",
    "confBy": "aakshi",
    "ref": "Book calling",
    "propertyType": "apartment",
    "priceValue": 7800000,
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r24",
    "city": "noida",
    "sector": "77.0",
    "project": "Express Zenith",
    "flatSize": 1075,
    "unitType": "2BR",
    "tower": "B",
    "remarks": "1.3 Cr",
    "otherProp": "",
    "status": "sale",
    "lastCallOn": "13.05.2025",
    "confBy": "aakshi",
    "ref": "Book calling",
    "propertyType": "apartment",
    "priceValue": 13000000,
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r25",
    "city": "noida",
    "sector": "77.0",
    "project": "Express Zenith",
    "flatSize": 950,
    "unitType": "2bhk",
    "tower": "E",
    "remarks": "1.05 Cr",
    "otherProp": "",
    "status": "sale",
    "lastCallOn": "08.10.2025",
    "confBy": "aakshi",
    "ref": "prop sol",
    "propertyType": "apartment",
    "priceValue": 10500000,
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r26",
    "city": "noida",
    "sector": "78.0",
    "project": "Mahagun Moderne",
    "flatSize": 1250,
    "unitType": "2bhk study",
    "tower": "Siena",
    "remarks": "1.72Cr",
    "otherProp": "",
    "status": "sale",
    "lastCallOn": "04.07.2025",
    "confBy": "aakshi",
    "ref": "prop sol",
    "propertyType": "apartment",
    "priceValue": 17200000,
    "image": "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r27",
    "city": "noida",
    "sector": "78.0",
    "project": "Mahagun Moderne",
    "flatSize": 1290,
    "unitType": "2bhk, study",
    "tower": "Latina",
    "remarks": "1.75 Cr",
    "otherProp": "",
    "status": "sale",
    "lastCallOn": "04.07.2025",
    "confBy": "aakshi",
    "ref": "prop sol",
    "propertyType": "apartment",
    "priceValue": 17500000,
    "image": "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r28",
    "city": "noida",
    "sector": "78.0",
    "project": "Mahagun Mezzaria",
    "flatSize": 2500,
    "unitType": "3br, 3 toi, SQ",
    "tower": "Ferrara",
    "remarks": "4.30 cr",
    "otherProp": "",
    "status": "sale",
    "lastCallOn": "17/3/2026",
    "confBy": "aakshi",
    "ref": "data calling",
    "propertyType": "apartment",
    "priceValue": 43000000,
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r29",
    "city": "noida",
    "sector": "79.0",
    "project": "Gaur Sportswood",
    "flatSize": 2280,
    "unitType": "3bhk+SQ",
    "tower": "C",
    "remarks": "3.65 Cr",
    "otherProp": "",
    "status": "sale",
    "lastCallOn": "30.06.2025",
    "confBy": "aman",
    "ref": "99acres",
    "propertyType": "apartment",
    "priceValue": 36500000,
    "image": "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r30",
    "city": "noida",
    "sector": "100.0",
    "project": "LOTUS BOULVARD",
    "flatSize": 1400,
    "unitType": "",
    "tower": "T8",
    "remarks": "2.85 Cr",
    "otherProp": "",
    "status": "sale",
    "lastCallOn": "22.03.2025",
    "confBy": "aakshi",
    "ref": "P calling",
    "propertyType": "apartment",
    "priceValue": 28500000,
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r31",
    "city": "noida",
    "sector": "107.0",
    "project": "AMARPALI HEART BEAT",
    "flatSize": 1735,
    "unitType": "",
    "tower": "E",
    "remarks": "11K Per Sq Ft",
    "otherProp": "",
    "status": "SALE",
    "lastCallOn": "16.2.2026",
    "confBy": "meenakshi",
    "ref": "",
    "propertyType": "apartment",
    "priceValue": 11,
    "image": "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r32",
    "city": "noida",
    "sector": "107.0",
    "project": "AMARPALI HEART BEAT",
    "flatSize": 1350,
    "unitType": "",
    "tower": "M",
    "remarks": "11K Per Sq Ft",
    "otherProp": "",
    "status": "SALE",
    "lastCallOn": "16.2.2026",
    "confBy": "meenakshi",
    "ref": "",
    "propertyType": "apartment",
    "priceValue": 11,
    "image": "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r33",
    "city": "noida",
    "sector": "107.0",
    "project": "AMARPALI HEART BEAT",
    "flatSize": 1195,
    "unitType": "",
    "tower": "C",
    "remarks": "11K Per Sq Ft",
    "otherProp": "",
    "status": "SALE",
    "lastCallOn": "16.2.2026",
    "confBy": "meenakshi",
    "ref": "",
    "propertyType": "apartment",
    "priceValue": 11,
    "image": "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r34",
    "city": "noida",
    "sector": "107.0",
    "project": "AMARPALI HEART BEAT",
    "flatSize": 1350,
    "unitType": "",
    "tower": "H",
    "remarks": "11K Per Sq Ft",
    "otherProp": "",
    "status": "SALE",
    "lastCallOn": "16.2.2026",
    "confBy": "meenakshi",
    "ref": "",
    "propertyType": "apartment",
    "priceValue": 11,
    "image": "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r35",
    "city": "noida",
    "sector": "107.0",
    "project": "AMARPALI HEART BEAT",
    "flatSize": 1350,
    "unitType": "",
    "tower": "G",
    "remarks": "11K Per Sq Ft",
    "otherProp": "",
    "status": "SALE",
    "lastCallOn": "16.2.2026",
    "confBy": "meenakshi",
    "ref": "",
    "propertyType": "apartment",
    "priceValue": 11,
    "image": "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r36",
    "city": "noida",
    "sector": "107.0",
    "project": "AMARPALI HEART BEAT",
    "flatSize": 1350,
    "unitType": "",
    "tower": "G",
    "remarks": "11K Per Sq Ft",
    "otherProp": "",
    "status": "SALE",
    "lastCallOn": "16.2.2026",
    "confBy": "meenakshi",
    "ref": "",
    "propertyType": "apartment",
    "priceValue": 11,
    "image": "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r37",
    "city": "noida",
    "sector": "107.0",
    "project": "Amrapali Heart Beat",
    "flatSize": 2125,
    "unitType": "",
    "tower": "A",
    "remarks": "11K Per Sq Ft",
    "otherProp": "",
    "status": "Sale",
    "lastCallOn": "16.2.2026",
    "confBy": "meenakshi",
    "ref": "",
    "propertyType": "apartment",
    "priceValue": 11,
    "image": "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r38",
    "city": "noida",
    "sector": "107.0",
    "project": "great value sharnam",
    "flatSize": "1791 3bhk, study",
    "unitType": "",
    "tower": "C",
    "remarks": "3 cr",
    "otherProp": "",
    "status": "SALE",
    "lastCallOn": "17/3/2026",
    "confBy": "aman",
    "ref": "sharnam data challing",
    "propertyType": "apartment",
    "priceValue": 30000000,
    "image": "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r39",
    "city": "noida",
    "sector": "107.0",
    "project": "Great Value Sharnam",
    "flatSize": 1791,
    "unitType": "3bhk, study",
    "tower": "C",
    "remarks": "2.75 Cr",
    "otherProp": "",
    "status": "SALE",
    "lastCallOn": "17/3/2026",
    "confBy": "aakshi",
    "ref": "",
    "propertyType": "apartment",
    "priceValue": 27500000,
    "image": "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r40",
    "city": "noida",
    "sector": "107.0",
    "project": "Great Value Sharnam",
    "flatSize": 1139,
    "unitType": "2bhk , 2bath",
    "tower": "G",
    "remarks": "1.45 Cr",
    "otherProp": "",
    "status": "SALE",
    "lastCallOn": "17/3/2026",
    "confBy": "aakshi",
    "ref": "",
    "propertyType": "apartment",
    "priceValue": 14500000,
    "image": "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r41",
    "city": "noida",
    "sector": "107.0",
    "project": "SHARANAM",
    "flatSize": 1139,
    "unitType": "",
    "tower": "G",
    "remarks": "1.5 Cr",
    "otherProp": "",
    "status": "SALE",
    "lastCallOn": "27/2/2026",
    "confBy": "meenakshi",
    "ref": "",
    "propertyType": "apartment",
    "priceValue": 15000000,
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r42",
    "city": "noida",
    "sector": "107.0",
    "project": "SUNWORLD VANALIKA",
    "flatSize": 1730,
    "unitType": "",
    "tower": "T-12",
    "remarks": "2.60 Cr",
    "otherProp": "",
    "status": "SALE",
    "lastCallOn": "27/2/2026",
    "confBy": "meenakshi",
    "ref": "",
    "propertyType": "apartment",
    "priceValue": 26000000,
    "image": "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r43",
    "city": "noida",
    "sector": "107.0",
    "project": "SUNWORLD VANALIKA",
    "flatSize": 1730,
    "unitType": "",
    "tower": "T-12",
    "remarks": "2.72 Cr",
    "otherProp": "",
    "status": "SALE",
    "lastCallOn": "27/2/2026",
    "confBy": "meenakshi",
    "ref": "",
    "propertyType": "apartment",
    "priceValue": 27200000,
    "image": "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r44",
    "city": "noida",
    "sector": "108.0",
    "project": "Daisy Meadouws",
    "flatSize": 1060,
    "unitType": "",
    "tower": "Daisy",
    "remarks": "1Cr",
    "otherProp": "",
    "status": "SALE",
    "lastCallOn": "03 Feb 2026",
    "confBy": "meenakshi",
    "ref": "",
    "propertyType": "apartment",
    "priceValue": 10000000,
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r45",
    "city": "noida",
    "sector": "110.0",
    "project": "lotus panache",
    "flatSize": 1220,
    "unitType": "2bhk",
    "tower": "Tower-21",
    "remarks": "11K Per Sq Ft",
    "otherProp": "",
    "status": "sale",
    "lastCallOn": "15.09.2025",
    "confBy": "aakshi",
    "ref": "prop sol",
    "propertyType": "apartment",
    "priceValue": 11,
    "image": "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r46",
    "city": "noida",
    "sector": "110.0",
    "project": "lotus panache",
    "flatSize": 1220,
    "unitType": "2bhk",
    "tower": "tower-26",
    "remarks": "3 Cr",
    "otherProp": "",
    "status": "sale",
    "lastCallOn": "15.09.2025",
    "confBy": "aakshi",
    "ref": "prop sol",
    "propertyType": "apartment",
    "priceValue": 30000000,
    "image": "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r47",
    "city": "noida",
    "sector": "110.0",
    "project": "lotus panache",
    "flatSize": 1220,
    "unitType": "2bhk",
    "tower": "Tower-21",
    "remarks": "10.5 K per sqft",
    "otherProp": "",
    "status": "sale",
    "lastCallOn": "15.09.2025",
    "confBy": "aakshi",
    "ref": "prop sol",
    "propertyType": "apartment",
    "priceValue": 10,
    "image": "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r48",
    "city": "noida",
    "sector": "110.0",
    "project": "lotus panache",
    "flatSize": 1220,
    "unitType": "2bhk",
    "tower": "tower-2",
    "remarks": "1cr",
    "otherProp": "",
    "status": "sale",
    "lastCallOn": "15.09.2025",
    "confBy": "aakshi",
    "ref": "prop sol",
    "propertyType": "apartment",
    "priceValue": 10000000,
    "image": "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r49",
    "city": "noida",
    "sector": "110.0",
    "project": "lotus panache",
    "flatSize": 1067,
    "unitType": "2bhk",
    "tower": "tower-5",
    "remarks": "10.5 K per sqft",
    "otherProp": "",
    "status": "sale",
    "lastCallOn": "15.09.2025",
    "confBy": "aakshi",
    "ref": "prop sol",
    "propertyType": "apartment",
    "priceValue": 10,
    "image": "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r50",
    "city": "noida",
    "sector": "110.0",
    "project": "lotus panache",
    "flatSize": 1720,
    "unitType": "",
    "tower": "T24",
    "remarks": "6k per sq ft",
    "otherProp": "lotus zing 1500sft",
    "status": "sale",
    "lastCallOn": "17/3/2026",
    "confBy": "aakshi",
    "ref": "sharnam data calling",
    "propertyType": "apartment",
    "priceValue": 6,
    "image": "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r51",
    "city": "noida",
    "sector": "115.0",
    "project": "Ivory county",
    "flatSize": 2727,
    "unitType": "4bhk, 4 toi, U",
    "tower": "C4",
    "remarks": "15500k Per sq ft",
    "otherProp": "",
    "status": "SALE",
    "lastCallOn": "17/3/2026",
    "confBy": "aakshi",
    "ref": "",
    "propertyType": "apartment",
    "priceValue": 15500,
    "image": "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r52",
    "city": "noida",
    "sector": "115.0",
    "project": "ivory county",
    "flatSize": 2034,
    "unitType": "3bhk, 3toi",
    "tower": "A3",
    "remarks": "3.3 Cr",
    "otherProp": "",
    "status": "sale",
    "lastCallOn": "17/3/2026",
    "confBy": "aakshi",
    "ref": "email",
    "propertyType": "apartment",
    "priceValue": 33000000,
    "image": "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r53",
    "city": "noida",
    "sector": "115.0",
    "project": "Ivory county",
    "flatSize": 2034,
    "unitType": "3bhk, 3toi",
    "tower": "A3",
    "remarks": "14K per Sq ft",
    "otherProp": "",
    "status": "sale",
    "lastCallOn": "17/3/2026",
    "confBy": "aakshi",
    "ref": "",
    "propertyType": "apartment",
    "priceValue": 14,
    "image": "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r54",
    "city": "noida",
    "sector": "115.0",
    "project": "ivory county",
    "flatSize": 2304,
    "unitType": "3bhk, 3toi",
    "tower": "B3",
    "remarks": "17k Per sq ft",
    "otherProp": "",
    "status": "sale",
    "lastCallOn": "17/3/2026",
    "confBy": "aakshi",
    "ref": "prop sol",
    "propertyType": "apartment",
    "priceValue": 17,
    "image": "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r55",
    "city": "noida",
    "sector": "115.0",
    "project": "Ivory county",
    "flatSize": 2304,
    "unitType": "4bhk, 4 toi, U",
    "tower": "B6",
    "remarks": "15k per sq ft",
    "otherProp": "",
    "status": "SALE",
    "lastCallOn": "18/3/2026",
    "confBy": "aakshi",
    "ref": "",
    "propertyType": "apartment",
    "priceValue": 15,
    "image": "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r56",
    "city": "noida",
    "sector": "115.0",
    "project": "Ivory county",
    "flatSize": 2034,
    "unitType": "3bhk, 3toi",
    "tower": "A1",
    "remarks": "15k per sq ft",
    "otherProp": "",
    "status": "SALE",
    "lastCallOn": "18/3/2026",
    "confBy": "aakshi",
    "ref": "",
    "propertyType": "apartment",
    "priceValue": 15,
    "image": "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r57",
    "city": "noida",
    "sector": "115.0",
    "project": "Ivory county",
    "flatSize": 2727,
    "unitType": "4bhk, 4 toi, U",
    "tower": "C3",
    "remarks": "14.5 K per sq ft",
    "otherProp": "",
    "status": "SALE",
    "lastCallOn": "18/3/2026",
    "confBy": "aakshi",
    "ref": "",
    "propertyType": "apartment",
    "priceValue": 14,
    "image": "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r58",
    "city": "noida",
    "sector": "115.0",
    "project": "Ivory county",
    "flatSize": 2034,
    "unitType": "3bhk, 3toi",
    "tower": "A3",
    "remarks": "16k per sq ft",
    "otherProp": "",
    "status": "sale",
    "lastCallOn": "18/3/2026",
    "confBy": "aakshi",
    "ref": "",
    "propertyType": "apartment",
    "priceValue": 16,
    "image": "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r59",
    "city": "noida",
    "sector": "115.0",
    "project": "Ivory county",
    "flatSize": 2034,
    "unitType": "3bhk, 3toi",
    "tower": "A3",
    "remarks": "15k per sq ft",
    "otherProp": "",
    "status": "sale",
    "lastCallOn": "18/3/2026",
    "confBy": "aakshi",
    "ref": "",
    "propertyType": "apartment",
    "priceValue": 15,
    "image": "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r60",
    "city": "noida",
    "sector": "121.0",
    "project": "Cleo County",
    "flatSize": 3195,
    "unitType": "4bhk, utility, 5 bath",
    "tower": "G",
    "remarks": "7.5 cr",
    "otherProp": "",
    "status": "SALE",
    "lastCallOn": "18/3/2026",
    "confBy": "aakshi",
    "ref": "prop sol",
    "propertyType": "apartment",
    "priceValue": 75000000,
    "image": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r61",
    "city": "noida",
    "sector": "124.0",
    "project": "Ats Knightbridge",
    "flatSize": 6000,
    "unitType": "TYPE 1",
    "tower": "",
    "remarks": "30K per sq ft",
    "otherProp": "",
    "status": "SALE",
    "lastCallOn": "18/3/2026",
    "confBy": "aakshi",
    "ref": "whatsapp",
    "propertyType": "apartment",
    "priceValue": 30,
    "image": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r62",
    "city": "noida",
    "sector": "128.0",
    "project": "Kalpatru Vista",
    "flatSize": 3095,
    "unitType": "",
    "tower": "A",
    "remarks": "22k Per sq ft",
    "otherProp": "",
    "status": "SALE",
    "lastCallOn": "18/3/2026",
    "confBy": "aakshi",
    "ref": "prop sol",
    "propertyType": "apartment",
    "priceValue": 22,
    "image": "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r63",
    "city": "noida",
    "sector": "150.0",
    "project": "ACE GOLF SHIRE",
    "flatSize": 1690,
    "unitType": "",
    "tower": "2",
    "remarks": "3.45 Cr",
    "otherProp": "",
    "status": "SALE",
    "lastCallOn": "18/3/2026",
    "confBy": "meenakshi",
    "ref": "",
    "propertyType": "apartment",
    "priceValue": 34500000,
    "image": "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r64",
    "city": "",
    "sector": "134.0",
    "project": "KOSMOS",
    "flatSize": "850SQFT",
    "unitType": "2BHK",
    "tower": "KM47",
    "remarks": "9.5 k per sq ft",
    "otherProp": "",
    "status": "SALE",
    "lastCallOn": "16/3/2026",
    "confBy": "MEENAKSHI",
    "ref": "",
    "propertyType": "apartment",
    "priceValue": 9,
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r65",
    "city": "",
    "sector": "45.0",
    "project": "SAPPHIR PH1",
    "flatSize": "1140SQFT",
    "unitType": "2 BHK+2 Toile",
    "tower": "D",
    "remarks": "1.5 Cr",
    "otherProp": "",
    "status": "SALE",
    "lastCallOn": "16/3/2026",
    "confBy": "MEENAKSHI",
    "ref": "",
    "propertyType": "apartment",
    "priceValue": 15000000,
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r66",
    "city": "",
    "sector": "45.0",
    "project": "SAPPHIR PH1",
    "flatSize": 1640,
    "unitType": "3BHK+3 Toilet",
    "tower": "G",
    "remarks": "2.2 cr",
    "otherProp": "",
    "status": "SALE",
    "lastCallOn": "20/12/2025",
    "confBy": "MEENAKSHI",
    "ref": "",
    "propertyType": "apartment",
    "priceValue": 22000000,
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r67",
    "city": "",
    "sector": "45.0",
    "project": "SAPPHIR PH2",
    "flatSize": "1140SQFT",
    "unitType": "2BHK+2 Toilet",
    "tower": "S",
    "remarks": "1.35 Cr",
    "otherProp": "",
    "status": "SALE",
    "lastCallOn": "15/11/2025/16/3/2026",
    "confBy": "MEENAKSHI",
    "ref": "amodksoni@gmail.com",
    "propertyType": "apartment",
    "priceValue": 13500000,
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r68",
    "city": "",
    "sector": "77.0",
    "project": "PRATEEK WISTERA",
    "flatSize": 1735,
    "unitType": "",
    "tower": "B",
    "remarks": "3.3 Cr",
    "otherProp": "",
    "status": "SALE",
    "lastCallOn": "",
    "confBy": "MEENAKSHI",
    "ref": "",
    "propertyType": "apartment",
    "priceValue": 33000000,
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r69",
    "city": "",
    "sector": "77.0",
    "project": "PRATEEK WISTERA",
    "flatSize": 955,
    "unitType": "",
    "tower": "N",
    "remarks": "1.2 Cr",
    "otherProp": "",
    "status": "SALE",
    "lastCallOn": "",
    "confBy": "",
    "ref": "",
    "propertyType": "apartment",
    "priceValue": 12000000,
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r70",
    "city": "",
    "sector": "46.0",
    "project": "WOODS",
    "flatSize": 2088.09,
    "unitType": "3 BHK",
    "tower": "T2",
    "remarks": "4.25 Cr",
    "otherProp": "",
    "status": "SALE",
    "lastCallOn": "",
    "confBy": "",
    "ref": "mailtoparvesh@gmail.com",
    "propertyType": "apartment",
    "priceValue": 42500000,
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r71",
    "city": "",
    "sector": "nan",
    "project": "Resale Unit",
    "flatSize": null,
    "unitType": "",
    "tower": "",
    "remarks": "",
    "otherProp": "",
    "status": "",
    "lastCallOn": "",
    "confBy": "",
    "ref": "",
    "propertyType": "apartment",
    "priceValue": null,
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r72",
    "city": "",
    "sector": "nan",
    "project": "Resale Unit",
    "flatSize": null,
    "unitType": "",
    "tower": "",
    "remarks": "",
    "otherProp": "",
    "status": "",
    "lastCallOn": "",
    "confBy": "",
    "ref": "",
    "propertyType": "apartment",
    "priceValue": null,
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r73",
    "city": "",
    "sector": "nan",
    "project": "Resale Unit",
    "flatSize": null,
    "unitType": "",
    "tower": "",
    "remarks": "",
    "otherProp": "",
    "status": "",
    "lastCallOn": "",
    "confBy": "",
    "ref": "",
    "propertyType": "apartment",
    "priceValue": null,
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r74",
    "city": "",
    "sector": "nan",
    "project": "Resale Unit",
    "flatSize": null,
    "unitType": "",
    "tower": "",
    "remarks": "",
    "otherProp": "",
    "status": "",
    "lastCallOn": "",
    "confBy": "",
    "ref": "",
    "propertyType": "apartment",
    "priceValue": null,
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r75",
    "city": "",
    "sector": "nan",
    "project": "Resale Unit",
    "flatSize": null,
    "unitType": "",
    "tower": "",
    "remarks": "",
    "otherProp": "",
    "status": "",
    "lastCallOn": "",
    "confBy": "",
    "ref": "",
    "propertyType": "apartment",
    "priceValue": null,
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r76",
    "city": "",
    "sector": "nan",
    "project": "Resale Unit",
    "flatSize": null,
    "unitType": "",
    "tower": "",
    "remarks": "",
    "otherProp": "",
    "status": "",
    "lastCallOn": "",
    "confBy": "",
    "ref": "",
    "propertyType": "apartment",
    "priceValue": null,
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "id": "r77",
    "city": "",
    "sector": "nan",
    "project": "Resale Unit",
    "flatSize": null,
    "unitType": "",
    "tower": "",
    "remarks": "",
    "otherProp": "",
    "status": "",
    "lastCallOn": "",
    "confBy": "",
    "ref": "",
    "propertyType": "apartment",
    "priceValue": null,
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  }
];

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

const fallbackPropertyImages = {
  apartment: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  plot: 'https://files.propertywala.com/photos/f5/J919024391.plot-view.17863669l.jpg',
  commercial: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
  villa: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
};

const localityImageMap = {
  'sector 137': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
  'sector 151': 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=1200&q=80',
  'noida extension': 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
  'greater noida': 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=80',
  'sector 72': 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
  'sector 128': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
};

const interestCards = [
  {
    title: 'Luxury Apartments',
    body: 'Large 2/3/4 BHK resale homes with strong demand.',
    image: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=1200&q=80',
    to: '/properties?property_type=apartment',
  },
  {
    title: 'Residential Plots',
    body: 'Open land options for long-term appreciation.',
    image: 'https://files.propertywala.com/photos/9c/J919024391.front-view.15880604l.jpg',
    to: '/properties?property_type=plot',
  },
  {
    title: 'Commercial Spaces',
    body: 'High-footfall office and retail investment choices.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    to: '/properties?property_type=commercial',
  },
  {
    title: 'Prime Localities',
    body: 'Sector-led clusters where buyers keep searching.',
    image: 'https://files.propertywala.com/photos/8c/J919024391.location-map.17863052l.jpg',
    to: '/properties',
  },
];

function normalizeText(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function formatPriceLabel(value) {
  const text = normalizeText(value);
  if (!text) return 'Price on request';
  return text.startsWith('₹') ? text : `₹ {text}`;
}

function formatSector(sector) {
  const text = normalizeText(sector);
  if (!text) return '';
  return /sector/i.test(text) ? text : `Sector {text}`;
}

function getImageFromLocality(item) {
  const key = normalizeText(item.name || item.badge || item.city).toLowerCase();
  return localityImageMap[key] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80';
}

export default function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState({ category: 'buy', city: '', property_type: '', max_price: '' });
  const [searchFocused, setSearchFocused] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [loanLead, setLoanLead] = useState({ name: '', phone: '' });
  const [resaleQuery, setResaleQuery] = useState('');
  const [resaleCity, setResaleCity] = useState('');
  const [resaleType, setResaleType] = useState('');

  const suggestions = useMemo(() => {
    const query = search.city.trim().toLowerCase();
    if (!query) return exploreLocalities;
    return exploreLocalities.filter((item) => item.name.toLowerCase().includes(query) || item.city.toLowerCase().includes(query));
  }, [search.city]);

  const resaleCities = useMemo(() => {
    return Array.from(new Set(resaleUnits.map((unit) => normalizeText(unit.city).toLowerCase()).filter(Boolean))).sort();
  }, []);

  const filteredResale = useMemo(() => {
    const q = resaleQuery.trim().toLowerCase();
    return resaleUnits.filter((unit) => {
      const haystack = [
        unit.project,
        unit.city,
        unit.sector,
        unit.unitType,
        unit.tower,
        unit.remarks,
        unit.status,
        unit.ref,
      ].join(' ').toLowerCase();

      const matchesQuery = !q || haystack.includes(q);
      const matchesCity = !resaleCity || normalizeText(unit.city).toLowerCase() === resaleCity;
      const matchesType = !resaleType || unit.propertyType === resaleType;
      return matchesQuery && matchesCity && matchesType;
    });
  }, [resaleQuery, resaleCity, resaleType]);

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

      <section className="relative pt-32 pb-28 px-4 md:px-6 overflow-hidden min-h-[85vh]">
        <div className="absolute inset-0 z-0" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2000&auto=format&fit=crop')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-slate-900/85 z-10" />
        <div className="relative z-20 max-w-6xl mx-auto text-center mt-10">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-bold tracking-widest uppercase">Trusted by thousands of buyers across India</div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight uppercase">Discover premium property opportunities across <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">Delhi NCR</span></h1>
          <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">Search verified homes, plotted developments, resale flats, and commercial spaces with a faster, cleaner, production-ready experience.</p>

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

      <section className="py-12 sm:py-16 relative w-full overflow-hidden bg-white -mt-10 z-20 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] border-b border-slate-100">
        <div className="w-full">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-400 mb-8 sm:mb-12 text-center">
            Trusted by leading brands across India
          </h2>
          <div className="relative flex flex-col gap-8 sm:gap-12 overflow-hidden w-full">
            <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }} className="flex gap-8 sm:gap-16 w-max">
              {[...topRowLogos, ...topRowLogos, ...topRowLogos, ...topRowLogos].map((src, i) => (
                <div key={`top-${i}`} className="flex-shrink-0 w-32 sm:w-48 h-16 sm:h-20 flex items-center justify-center">
                  <img src={src} alt={`Client logo ${i}`} className="max-w-full max-h-full object-contain filter brightness-0 opacity-80 hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </motion.div>

            <motion.div animate={{ x: ["-50%", "0%"] }} transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }} className="flex gap-8 sm:gap-16 w-max">
              {[...bottomRowLogos, ...bottomRowLogos, ...bottomRowLogos, ...bottomRowLogos].map((src, i) => (
                <div key={`bottom-${i}`} className="flex-shrink-0 w-32 sm:w-48 h-16 sm:h-20 flex items-center justify-center">
                  <img src={src} alt={`Client logo ${i}`} className="max-w-full max-h-full object-contain filter brightness-0 opacity-80 hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </motion.div>

            <div className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          </div>
        </div>
      </section>

      <section className="py-16 bg-white relative z-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <p className="text-red-600 font-bold uppercase tracking-[0.25em] text-xs mb-3">High-interest localities</p>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900">Explore high-intent localities</h2>
              <p className="text-slate-500 mt-3 max-w-2xl">Jump straight into the corridors buyers and investors ask about most often.</p>
            </div>
            <Link to="/properties"><Button variant="outline" className="border-slate-300 font-bold">Browse all inventory <ChevronRight className="w-4 h-4 ml-2" /></Button></Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {exploreLocalities.map((item) => (
              <button key={item.name} onClick={() => navigate(createPropertySearch({ city: item.city, property_type: item.propertyType, category: 'buy' }))} className="text-left rounded-[1.75rem] overflow-hidden bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 transition-all group">
                <div className="h-36 w-full overflow-hidden">
                  <img src={getImageFromLocality(item)} alt={item.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.25em] text-red-500 font-bold mb-3">{item.badge}</p>
                  <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-red-600">{item.name}</h3>
                  <p className="text-slate-500 text-sm">View curated property options in {item.city}.</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div>
              <p className="text-red-600 font-bold uppercase tracking-[0.25em] text-xs mb-3">Buyer interest</p>
              <h2 className="text-3xl md:text-4xl font-black">What buyers search most</h2>
            </div>
            <Link to="/properties"><Button variant="outline">View all categories</Button></Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {interestCards.map((card) => (
              <Link key={card.title} to={card.to} className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
                <div className="h-52 overflow-hidden">
                  <img src={card.image} alt={card.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="p-6">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">{card.title}</h3>
                  <p className="text-slate-500 text-sm leading-7">{card.body}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-red-600 font-bold uppercase tracking-[0.25em] text-xs mb-3">Resale inventory</p>
              <h2 className="text-3xl md:text-4xl font-black">All resale flats and plot-style leads from your sheet</h2>
              <p className="text-slate-500 mt-3 max-w-3xl">Each card below is pulled from the Excel sheet and shown with a real property photo, sector, unit size, and price note.</p>
            </div>
            <Link to="/properties"><Button variant="outline">Open full inventory</Button></Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 mb-6">
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input value={resaleQuery} onChange={(e) => setResaleQuery(e.target.value)} placeholder="Search project, sector, tower, price, or broker name" className="h-12 pl-12 rounded-xl bg-slate-50 border-slate-200" />
            </div>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select value={resaleCity} onChange={(e) => setResaleCity(e.target.value)} className="h-12 pl-12 pr-4 rounded-xl bg-slate-50 border border-slate-200 w-full outline-none">
                <option value="">All cities</option>
                {resaleCities.map((city) => <option key={city} value={city}>{city.toUpperCase()}</option>)}
              </select>
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select value={resaleType} onChange={(e) => setResaleType(e.target.value)} className="h-12 pl-12 pr-4 rounded-xl bg-slate-50 border border-slate-200 w-full outline-none">
                <option value="">All types</option>
                {propertyTypeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4 text-sm text-slate-500">
            <p>{filteredResale.length} leads shown</p>
            <p>Sheet row data + image</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {filteredResale.map((property) => (
              <div
                key={property.id}
                onClick={() => navigate(`/property/${property.id}`, { state: { property } })}
                className="bg-slate-50 rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition cursor-pointer relative group"
              >
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-slate-900 shadow-sm z-10">
                  {property.status || 'resale'}
                </div>

                <div className="relative h-48 overflow-hidden">
                  <img src={property.image || fallbackPropertyImages[property.propertyType]} alt={property.project} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>

                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600 mb-2">
                    {property.city} • {property.propertyType}
                  </p>
                  <h3 className="text-xl font-black text-slate-900 mb-1 group-hover:text-red-600 transition-colors line-clamp-1">
                    {property.project}
                  </h3>
                  <p className="text-slate-500 text-sm mb-3">
                    <MapPin className="inline w-3 h-3 mr-1"/> {formatSector(property.sector)}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 mb-4">
                    <div className="rounded-xl bg-white p-3 border border-slate-200">
                      <span className="block uppercase tracking-wider text-[10px] text-slate-400 mb-1">Size</span>
                      <span className="font-bold text-slate-900">{property.flatSize || '—'} sq ft</span>
                    </div>
                    <div className="rounded-xl bg-white p-3 border border-slate-200">
                      <span className="block uppercase tracking-wider text-[10px] text-slate-400 mb-1">Tower</span>
                      <span className="font-bold text-slate-900">{property.tower || '—'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <span className="font-black text-slate-900 text-lg">{formatPriceLabel(property.remarks)}</span>
                    <span className="text-red-600 font-bold flex items-center text-sm">Open <ArrowRight className="w-4 h-4 ml-1" /></span>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-3">
                    Last call: {property.lastCallOn || '—'} • {property.confBy || '—'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-red-600 font-bold uppercase tracking-[0.25em] text-xs mb-3">Why India</p>
            <h2 className="text-3xl md:text-5xl font-black mb-6">Why buyers continue choosing India’s growth markets</h2>
            <p className="text-slate-600 text-lg leading-8 mb-8">Strong infrastructure pipelines, expanding business districts, and maturing social infrastructure continue to improve end-user demand and investment resilience. Trusted by thousands of buyers across India, ANK Realty simplifies the journey with verified inventory and human support.</p>
            <div className="grid sm:grid-cols-2 gap-6">
              {
                [
                  ['Verified listings', 'Property screening and lead qualification reduce wasted site visits.'],
                  ['Local market guidance', 'Actionable help on pricing, ROI, and document readiness.'],
                  ['Cross-category discovery', 'Explore residential, plotted, rental, and corporate inventory in one flow.'],
                  ['Human support', 'Dedicated experts for search, loan guidance, and leasing support.'],
                ].map(([title, body]) => (
                  <div key={title} className="p-6 rounded-3xl bg-slate-50 border border-slate-200">
                    <h3 className="font-black text-slate-900 mb-2">{title}</h3>
                    <p className="text-slate-500 text-sm leading-7">{body}</p>
                  </div>
                ))
              }
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

      <section className="py-20 px-6 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
          {
            [
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
            ))
          }
        </div>
      </section>

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
