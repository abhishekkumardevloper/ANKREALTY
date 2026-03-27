const parseSize = (size) => Number(String(size || '').replace(/[^\d.]/g, '')) || 0;

const parsePrice = (remarks, size) => {
  if (!remarks) return 0;
  const text = remarks.toLowerCase();
  const numeric = Number(text.replace(/[^\d.]/g, '')) || 0;
  if (!numeric) return 0;
  if (text.includes('cr')) return Math.round(numeric * 10000000);
  if (text.includes('lakh') || text.includes('lac')) return Math.round(numeric * 100000);
  if (text.includes('k per sq') || text.includes('k/sq')) return Math.round(numeric * 1000 * parseSize(size));
  return Math.round(numeric);
};

const inferBedrooms = (unitType = '') => {
  const match = unitType.toLowerCase().match(/(\d+)\s*(bhk|br)/);
  return match ? Number(match[1]) : null;
};

// EXPLICIT HARDCODED 4 IMAGES PER PROPERTY
const rawResaleListings = [
  { sec: '25', project: 'Jalvayu Vihar', size: '1050', unitType: '2BHK Study', tower: 'G', remarks: '1.40cr', status: 'sale', confBy: 'aakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&q=80", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&q=80", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&q=80", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80"
  ]},
  { sec: '45', project: 'Amrapali Sapphire', size: '1640', unitType: '3BHK+3 Toilet', tower: 'L', remarks: '2.5cr', status: 'sale', confBy: 'meenakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&q=80", "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1000&q=80", "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=1000&q=80", "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?w=1000&q=80"
  ]},
  { sec: '45', project: 'Amarpali Sapphire', size: '1640', unitType: '', tower: 'O', remarks: '2.2cr', status: 'sale', confBy: 'meenakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1000&q=80", "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1000&q=80", "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1000&q=80", "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1000&q=80"
  ]},
  { sec: '45', project: 'Amrapali Sapphire', size: '3075', unitType: '4BHK + Family Lounge + Svt. Room', tower: 'N', remarks: '3.4cr', status: 'sale', confBy: 'aakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1000&q=80", "https://images.unsplash.com/photo-1502672260266-1c1e5240980c?w=1000&q=80", "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1000&q=80", "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=1000&q=80"
  ]},
  { sec: '45', project: 'Amrapali Sapphire', size: '1640', unitType: '3BHK+3 Toilet', tower: 'H', remarks: '2cr', status: 'sale', confBy: 'aakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&q=80", "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1000&q=80", "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&q=80", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&q=80"
  ]},
  { sec: '50', project: 'Mahagun Maestro', size: '3100', unitType: '4BHK+SQ', tower: 'TWR5', remarks: '4cr', status: 'sale', confBy: 'aakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&q=80", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80", "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1000&q=80", "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?w=1000&q=80"
  ]},
  { sec: '52', project: 'Antriksh Nature', size: '1750', unitType: '', tower: 'A', remarks: '2.5cr', status: 'sale', confBy: 'aakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1000&q=80", "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1000&q=80", "https://images.unsplash.com/photo-1502672260266-1c1e5240980c?w=1000&q=80", "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=1000&q=80"
  ]},
  { sec: '61', project: 'Shatabdi Vihar', size: '1850', unitType: '4BHK', tower: '', remarks: '2.7cr', status: 'sale', confBy: 'aakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1000&q=80", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&q=80", "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=1000&q=80", "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1000&q=80"
  ]},
  { sec: '74', project: 'Supertech Cape Town', size: '1150', unitType: '', tower: 'CS-6', remarks: '80 Lakh', status: 'sale', confBy: 'meenakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1000&q=80", "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1000&q=80", "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1000&q=80", "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&q=80"
  ]},
  { sec: '74', project: 'Supertech Cape Town', size: '1150', unitType: '', tower: 'CS-4', remarks: '90 Lakh', status: 'sale', confBy: 'meenakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&q=80", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&q=80", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&q=80", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80"
  ]},
  { sec: '74', project: 'Supertech Cape Town', size: '1082', unitType: '', tower: 'CB-4', remarks: '80 Lakh', status: 'sale', confBy: 'meenakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&q=80", "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1000&q=80", "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=1000&q=80", "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?w=1000&q=80"
  ]},
  { sec: '75', project: 'Apex Athena', size: '1895', unitType: '3BHK, 3 Toi', tower: 'D', remarks: '2.75 Cr', status: 'sale', confBy: 'aakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1000&q=80", "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1000&q=80", "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1000&q=80", "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1000&q=80"
  ]},
  { sec: '75', project: 'Dasnac Burj', size: '3030', unitType: '4BHK', tower: 'A', remarks: '4.75 Cr', status: 'sale', confBy: 'aakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1000&q=80", "https://images.unsplash.com/photo-1502672260266-1c1e5240980c?w=1000&q=80", "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1000&q=80", "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=1000&q=80"
  ]},
  { sec: '75', project: 'Ivy County', size: '1485', unitType: '2BHK, Lounge', tower: 'C2', remarks: '2.7 Cr', status: 'sale', confBy: 'aakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&q=80", "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1000&q=80", "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&q=80", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&q=80"
  ]},
  { sec: '75', project: 'Ivy County', size: '1465', unitType: '2BHK, Lounge', tower: '', remarks: '3 Cr', status: 'sale', confBy: 'aakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&q=80", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80", "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1000&q=80", "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?w=1000&q=80"
  ]},
  { sec: '76', project: 'Amrapali Crystal Homes', size: '1375', unitType: '3BHK', tower: 'T5', remarks: '1.8cr', status: 'sale', confBy: 'aman', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1000&q=80", "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1000&q=80", "https://images.unsplash.com/photo-1502672260266-1c1e5240980c?w=1000&q=80", "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=1000&q=80"
  ]},
  { sec: '76', project: 'Amrapali Princely Estate', size: '1315', unitType: '3BHK', tower: '', remarks: 'Registered flat, rented, 7th floor', status: 'sale', confBy: 'aman', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1000&q=80", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&q=80", "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=1000&q=80", "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1000&q=80"
  ]},
  { sec: '76', project: 'Amrapali Silicon City', size: '1035', unitType: '2BR', tower: 'N', remarks: '1.2cr', status: 'sale', confBy: 'aakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1000&q=80", "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1000&q=80", "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1000&q=80", "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&q=80"
  ]},
  { sec: '76', project: 'Amrapali Silicon City', size: '1180', unitType: '2BR Study', tower: 'B', remarks: '1.1cr', status: 'sale', confBy: 'aakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&q=80", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&q=80", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&q=80", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80"
  ]},
  { sec: '76', project: 'Sethi Max Royal', size: '940', unitType: '2BHK', tower: 'D', remarks: '95 Lakhs', status: 'sale', confBy: 'aakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&q=80", "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1000&q=80", "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=1000&q=80", "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?w=1000&q=80"
  ]},
  { sec: '76', project: 'Amrapali Silicon City', size: '1034', unitType: '2BHK', tower: 'E', remarks: '1 Cr', status: 'sale', confBy: 'aakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1000&q=80", "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1000&q=80", "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1000&q=80", "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1000&q=80"
  ]},
  { sec: '76', project: 'Sethix Max Royal', size: '940', unitType: '2BHK', tower: 'D', remarks: '95 Lakhs', status: 'sale', confBy: 'aakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1000&q=80", "https://images.unsplash.com/photo-1502672260266-1c1e5240980c?w=1000&q=80", "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1000&q=80", "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=1000&q=80"
  ]},
  { sec: '77', project: 'Express Zenith', size: '960', unitType: '2BR', tower: 'E', remarks: '78 Lakhs', status: 'sale', confBy: 'aakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&q=80", "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1000&q=80", "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&q=80", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&q=80"
  ]},
  { sec: '77', project: 'Express Zenith', size: '1075', unitType: '2BR', tower: 'B', remarks: '1.3 Cr', status: 'sale', confBy: 'aakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&q=80", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80", "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1000&q=80", "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?w=1000&q=80"
  ]},
  { sec: '77', project: 'Express Zenith', size: '950', unitType: '2BHK', tower: 'E', remarks: '1.05 Cr', status: 'sale', confBy: 'aakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1000&q=80", "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1000&q=80", "https://images.unsplash.com/photo-1502672260266-1c1e5240980c?w=1000&q=80", "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=1000&q=80"
  ]},
  { sec: '78', project: 'Mahagun Moderne', size: '1250', unitType: '2BHK Study', tower: 'Siena', remarks: '1.72Cr', status: 'sale', confBy: 'aakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1000&q=80", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&q=80", "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=1000&q=80", "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1000&q=80"
  ]},
  { sec: '78', project: 'Mahagun Moderne', size: '1290', unitType: '2BHK, Study', tower: 'Latina', remarks: '1.75 Cr', status: 'sale', confBy: 'aakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1000&q=80", "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1000&q=80", "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1000&q=80", "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&q=80"
  ]},
  { sec: '78', project: 'Mahagun Mezzaria', size: '2500', unitType: '3BR, 3 Toi, SQ', tower: 'Ferrara', remarks: '4.30 Cr', status: 'sale', confBy: 'aakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&q=80", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&q=80", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&q=80", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80"
  ]},
  { sec: '79', project: 'Gaur Sportswood', size: '2280', unitType: '3BHK+SQ', tower: 'C', remarks: '3.65 Cr', status: 'sale', confBy: 'aman', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&q=80", "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1000&q=80", "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=1000&q=80", "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?w=1000&q=80"
  ]},
  { sec: '100', project: 'Lotus Boulevard', size: '1400', unitType: '', tower: 'T8', remarks: '2.85 Cr', status: 'sale', confBy: 'aakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1000&q=80", "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1000&q=80", "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1000&q=80", "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1000&q=80"
  ]},
  { sec: '107', project: 'Amrapali Heart Beat', size: '1735', unitType: '', tower: 'E', remarks: '11K Per Sq Ft', status: 'sale', confBy: 'meenakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1000&q=80", "https://images.unsplash.com/photo-1502672260266-1c1e5240980c?w=1000&q=80", "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1000&q=80", "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=1000&q=80"
  ]},
  { sec: '107', project: 'Amrapali Heart Beat', size: '1350', unitType: '', tower: 'M', remarks: '11K Per Sq Ft', status: 'sale', confBy: 'meenakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&q=80", "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1000&q=80", "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&q=80", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&q=80"
  ]},
  { sec: '107', project: 'Amrapali Heart Beat', size: '1195', unitType: '', tower: 'C', remarks: '11K Per Sq Ft', status: 'sale', confBy: 'meenakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&q=80", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80", "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1000&q=80", "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?w=1000&q=80"
  ]},
  { sec: '107', project: 'Amrapali Heart Beat', size: '1350', unitType: '', tower: 'H', remarks: '11K Per Sq Ft', status: 'sale', confBy: 'meenakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1000&q=80", "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1000&q=80", "https://images.unsplash.com/photo-1502672260266-1c1e5240980c?w=1000&q=80", "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=1000&q=80"
  ]},
  { sec: '107', project: 'Amrapali Heart Beat', size: '1350', unitType: '', tower: 'G', remarks: '11K Per Sq Ft', status: 'sale', confBy: 'meenakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1000&q=80", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&q=80", "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=1000&q=80", "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1000&q=80"
  ]},
  { sec: '107', project: 'Amrapali Heart Beat', size: '1350', unitType: '', tower: 'G', remarks: '11K Per Sq Ft', status: 'sale', confBy: 'meenakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1000&q=80", "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1000&q=80", "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1000&q=80", "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&q=80"
  ]},
  { sec: '107', project: 'Amrapali Heart Beat', size: '2125', unitType: '', tower: 'A', remarks: '11K Per Sq Ft', status: 'sale', confBy: 'meenakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&q=80", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&q=80", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&q=80", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80"
  ]},
  { sec: '107', project: 'Great Value Sharnam', size: '1791', unitType: '3BHK, Study', tower: 'C', remarks: '3 Cr', status: 'sale', confBy: 'aman', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&q=80", "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1000&q=80", "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=1000&q=80", "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?w=1000&q=80"
  ]},
  { sec: '107', project: 'Great Value Sharnam', size: '1791', unitType: '3BHK, Study', tower: 'C', remarks: '2.75 Cr', status: 'sale', confBy: 'aakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1000&q=80", "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1000&q=80", "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1000&q=80", "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1000&q=80"
  ]},
  { sec: '107', project: 'Great Value Sharnam', size: '1139', unitType: '2BHK, 2 Bath', tower: 'G', remarks: '1.45 Cr', status: 'sale', confBy: 'aakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1000&q=80", "https://images.unsplash.com/photo-1502672260266-1c1e5240980c?w=1000&q=80", "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1000&q=80", "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=1000&q=80"
  ]},
  { sec: '107', project: 'Sharnam', size: '1139', unitType: '', tower: 'G', remarks: '1.5 Cr', status: 'sale', confBy: 'meenakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&q=80", "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1000&q=80", "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&q=80", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&q=80"
  ]},
  { sec: '107', project: 'Sunworld Vanalika', size: '1730', unitType: '', tower: 'T-12', remarks: '2.60 Cr', status: 'sale', confBy: 'meenakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&q=80", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80", "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1000&q=80", "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?w=1000&q=80"
  ]},
  { sec: '107', project: 'Sunworld Vanalika', size: '1730', unitType: '', tower: 'T-12', remarks: '2.72 Cr', status: 'sale', confBy: 'meenakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1000&q=80", "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1000&q=80", "https://images.unsplash.com/photo-1502672260266-1c1e5240980c?w=1000&q=80", "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=1000&q=80"
  ]},
  { sec: '108', project: 'Daisy Meadows', size: '1060', unitType: '', tower: 'Daisy', remarks: '1 Cr', status: 'sale', confBy: 'meenakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1000&q=80", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&q=80", "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=1000&q=80", "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1000&q=80"
  ]},
  { sec: '110', project: 'Lotus Panache', size: '1220', unitType: '2BHK', tower: 'Tower-21', remarks: '11K Per Sq Ft', status: 'sale', confBy: 'aakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1000&q=80", "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1000&q=80", "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1000&q=80", "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&q=80"
  ]},
  { sec: '110', project: 'Lotus Panache', size: '1220', unitType: '2BHK', tower: 'Tower-26', remarks: '3 Cr', status: 'sale', confBy: 'aakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&q=80", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&q=80", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&q=80", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80"
  ]},
  { sec: '110', project: 'Lotus Panache', size: '1220', unitType: '2BHK', tower: 'Tower-21', remarks: '10.5 K per sqft', status: 'sale', confBy: 'aakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&q=80", "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1000&q=80", "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=1000&q=80", "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?w=1000&q=80"
  ]},
  { sec: '110', project: 'Lotus Panache', size: '1220', unitType: '2BHK', tower: 'Tower-2', remarks: '1 Cr', status: 'sale', confBy: 'aakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1000&q=80", "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1000&q=80", "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1000&q=80", "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1000&q=80"
  ]},
  { sec: '110', project: 'Lotus Panache', size: '1067', unitType: '2BHK', tower: 'Tower-5', remarks: '10.5 K per sqft', status: 'sale', confBy: 'aakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1000&q=80", "https://images.unsplash.com/photo-1502672260266-1c1e5240980c?w=1000&q=80", "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1000&q=80", "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=1000&q=80"
  ]},
  { sec: '110', project: 'Lotus Panache', size: '1720', unitType: '', tower: 'T24', remarks: '6k per sq ft', status: 'sale', confBy: 'aakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&q=80", "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1000&q=80", "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&q=80", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&q=80"
  ]},
  { sec: '115', project: 'Ivory County', size: '2727', unitType: '4BHK, 4 Toi, U', tower: 'C4', remarks: '15500 Per sq ft', status: 'sale', confBy: 'aakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&q=80", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80", "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1000&q=80", "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?w=1000&q=80"
  ]},
  { sec: '115', project: 'Ivory County', size: '2034', unitType: '3BHK, 3 Toi', tower: 'A3', remarks: '3.3 Cr', status: 'sale', confBy: 'aakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1000&q=80", "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1000&q=80", "https://images.unsplash.com/photo-1502672260266-1c1e5240980c?w=1000&q=80", "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=1000&q=80"
  ]},
  { sec: '115', project: 'Ivory County', size: '2034', unitType: '3BHK, 3 Toi', tower: 'A3', remarks: '14K per Sq ft', status: 'sale', confBy: 'aakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1000&q=80", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&q=80", "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=1000&q=80", "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1000&q=80"
  ]},
  { sec: '115', project: 'Ivory County', size: '2304', unitType: '3BHK, 3 Toi', tower: 'B3', remarks: '17k Per sq ft', status: 'sale', confBy: 'aakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1000&q=80", "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1000&q=80", "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1000&q=80", "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&q=80"
  ]},
  { sec: '115', project: 'Ivory County', size: '2304', unitType: '4BHK, 4 Toi, U', tower: 'B6', remarks: '15k per sq ft', status: 'sale', confBy: 'aakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&q=80", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&q=80", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&q=80", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80"
  ]},
  { sec: '115', project: 'Ivory County', size: '2034', unitType: '3BHK, 3 Toi', tower: 'A1', remarks: '15k per sq ft', status: 'sale', confBy: 'aakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&q=80", "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1000&q=80", "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=1000&q=80", "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?w=1000&q=80"
  ]},
  { sec: '115', project: 'Ivory County', size: '2727', unitType: '4BHK, 4 Toi, U', tower: 'C3', remarks: '14.5 K per sq ft', status: 'sale', confBy: 'aakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1000&q=80", "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1000&q=80", "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1000&q=80", "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1000&q=80"
  ]},
  { sec: '115', project: 'Ivory County', size: '2034', unitType: '3BHK, 3 Toi', tower: 'A3', remarks: '16k per sq ft', status: 'sale', confBy: 'aakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1000&q=80", "https://images.unsplash.com/photo-1502672260266-1c1e5240980c?w=1000&q=80", "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1000&q=80", "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=1000&q=80"
  ]},
  { sec: '115', project: 'Ivory County', size: '2034', unitType: '3BHK, 3 Toi', tower: 'A3', remarks: '15k per sq ft', status: 'sale', confBy: 'aakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&q=80", "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1000&q=80", "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&q=80", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&q=80"
  ]},
  { sec: '121', project: 'Cleo County', size: '3195', unitType: '4BHK, Utility, 5 Bath', tower: 'G', remarks: '7.5 Cr', status: 'sale', confBy: 'aakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&q=80", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80", "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1000&q=80", "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?w=1000&q=80"
  ]},
  { sec: '124', project: 'ATS Knightbridge', size: '6000', unitType: 'Type 1', tower: '', remarks: '30K per sq ft', status: 'sale', confBy: 'aakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1000&q=80", "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1000&q=80", "https://images.unsplash.com/photo-1502672260266-1c1e5240980c?w=1000&q=80", "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=1000&q=80"
  ]},
  { sec: '128', project: 'Kalpataru Vista', size: '3095', unitType: '', tower: 'A', remarks: '22k Per sq ft', status: 'sale', confBy: 'aakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1000&q=80", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&q=80", "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=1000&q=80", "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1000&q=80"
  ]},
  { sec: '150', project: 'Ace Golfshire', size: '1690', unitType: '', tower: '2', remarks: '3.45 Cr', status: 'sale', confBy: 'meenakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1000&q=80", "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1000&q=80", "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1000&q=80", "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&q=80"
  ]},
  { sec: '134', project: 'Kosmos', size: '850', unitType: '2BHK', tower: 'KM47', remarks: '9.5 k per sq ft', status: 'sale', confBy: 'meenakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&q=80", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&q=80", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&q=80", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80"
  ]},
  { sec: '45', project: 'Sapphir PH1', size: '1140', unitType: '2 BHK + 2 Toilet', tower: 'D', remarks: '1.5 Cr', status: 'sale', confBy: 'meenakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&q=80", "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1000&q=80", "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=1000&q=80", "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?w=1000&q=80"
  ]},
  { sec: '45', project: 'Sapphir PH1', size: '1640', unitType: '3BHK + 3 Toilet', tower: 'G', remarks: '2.2 Cr', status: 'sale', confBy: 'meenakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1000&q=80", "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1000&q=80", "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1000&q=80", "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1000&q=80"
  ]},
  { sec: '45', project: 'Sapphir PH2', size: '1140', unitType: '2BHK + 2 Toilet', tower: 'S', remarks: '1.35 Cr', status: 'sale', confBy: 'meenakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1000&q=80", "https://images.unsplash.com/photo-1502672260266-1c1e5240980c?w=1000&q=80", "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1000&q=80", "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=1000&q=80"
  ]},
  { sec: '77', project: 'Prateek Wisteria', size: '1735', unitType: '', tower: 'B', remarks: '3.3 Cr', status: 'sale', confBy: 'meenakshi', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&q=80", "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1000&q=80", "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&q=80", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&q=80"
  ]},
  { sec: '77', project: 'Prateek Wisteria', size: '955', unitType: '', tower: 'N', remarks: '1.2 Cr', status: 'sale', confBy: '', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&q=80", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80", "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1000&q=80", "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?w=1000&q=80"
  ]},
  { sec: '46', project: 'Woods', size: '2088.09', unitType: '3 BHK', tower: 'T2', remarks: '4.25 Cr', status: 'sale', confBy: '', location: 'Noida', images: [
    "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1000&q=80", "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1000&q=80", "https://images.unsplash.com/photo-1502672260266-1c1e5240980c?w=1000&q=80", "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=1000&q=80"
  ]}
];

export const resaleListings = rawResaleListings.map((item, index) => {
  const area = parseSize(item.size);
  const bedrooms = inferBedrooms(item.unitType);
  const price = parsePrice(item.remarks, item.size);

  return {
    id: `resale-${index + 1}`,
    title: `${item.project}${item.tower ? ` • Tower ${item.tower}` : ''}`,
    city: item.location || 'Noida',
    location: `Sector ${item.sec}`,
    area,
    bedrooms,
    bathrooms: bedrooms ? bedrooms : null,
    category: 'resale',
    property_type: bedrooms && bedrooms >= 4 ? 'villa' : 'apartment',
    price,
    priceText: item.remarks,
    status: item.status,
    builder: item.project,
    projectStatus: 'Resale',
    configurations: item.unitType || 'Residential Unit',
    rera: 'Please verify with official project documentation.',
    images: item.images, // Pulls the explicitly hardcoded array of 4 images directly
    source: `Confirmed by ${item.confBy || 'team'}`
  };
});

export default resaleListings;
