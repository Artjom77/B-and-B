import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Building2, Search, Filter, Grid3x3, List, Map, Eye, Download, 
  Share2, Calculator, Heart, MapPin, Clock, DollarSign, TrendingUp,
  Car, Plane, Train, ShoppingBag, Dumbbell, Waves, TreePine, Wifi,
  Shield, Star, Users, Home, Bed, Bath, Square
} from 'lucide-react';

const ProjectsSection = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');
  const [selectedCompletion, setSelectedCompletion] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [selectedProject, setSelectedProject] = useState(null);
  const [compareList, setCompareList] = useState([]);

  // Mock данные проектов AZIZI
  const projects = [
    {
      id: 1,
      name: "AZIZI Riviera",
      tagline: "French Riviera-inspired waterfront",
      location: "Meydan One, Dubai",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
      priceRange: "500K - 3M AED",
      priceRangeEur: "€123K - €738K",
      units: "16,000 apartments",
      completion: "Q4 2025",
      soldPercentage: 73,
      features: [
        "Private Beach",
        "Retail Boulevard", 
        "Metro 5 min",
        "Dubai Mall 10 min"
      ],
      roi: "8% guaranteed",
      paymentPlan: "60/40",
      commission: "4%",
      rating: 4.8,
      description: "71 mid-rise residential buildings offering studio to 3-bedroom apartments with stunning waterfront views and world-class amenities.",
      amenities: ["Infinity Pool", "Private Gym", "Cinema", "Yoga Studio", "Kids Play Area", "BBQ Area", "24/7 Security", "Concierge"],
      floorPlans: [
        { type: "Studio", size: "380 sqft", price: "525K AED", priceEur: "€129K" },
        { type: "1BR", size: "650 sqft", price: "850K AED", priceEur: "€209K" },
        { type: "2BR", size: "950 sqft", price: "1.2M AED", priceEur: "€295K" },
        { type: "3BR", size: "1,400 sqft", price: "1.8M AED", priceEur: "€443K" }
      ],
      gallery: [
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=800&h=600&fit=crop"
      ],
      coordinates: { lat: 25.1972, lng: 55.2744 },
      leadCount: 234,
      dealsCount: 45
    },
    {
      id: 2,
      name: "AZIZI Venice",
      tagline: "Venetian-inspired waterfront living",
      location: "Dubai Sports City",
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      priceRange: "400K - 2.5M AED",
      priceRangeEur: "€98K - €615K",
      units: "3,000 apartments",
      completion: "Q2 2026",
      soldPercentage: 45,
      features: [
        "Crystal Lagoon",
        "Beach Club",
        "Golf Course Access",
        "Family-Friendly"
      ],
      roi: "7% expected",
      paymentPlan: "70/30",
      commission: "3.5%",
      rating: 4.6,
      description: "A unique Venetian-inspired community featuring canals, bridges, and Mediterranean architecture in the heart of Dubai Sports City.",
      amenities: ["Crystal Lagoon", "Beach Club", "Tennis Court", "Golf Simulator", "Spa", "Restaurant", "Retail Outlets", "Valet Parking"],
      floorPlans: [
        { type: "Studio", size: "420 sqft", price: "445K AED", priceEur: "€109K" },
        { type: "1BR", size: "720 sqft", price: "685K AED", priceEur: "€168K" },
        { type: "2BR", size: "1,100 sqft", price: "1.1M AED", priceEur: "€271K" },
        { type: "3BR", size: "1,450 sqft", price: "1.6M AED", priceEur: "€394K" },
        { type: "Townhouse", size: "2,200 sqft", price: "2.2M AED", priceEur: "€541K" }
      ],
      gallery: [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop"
      ],
      coordinates: { lat: 25.0448, lng: 55.2005 },
      leadCount: 189,
      dealsCount: 28
    },
    {
      id: 3,
      name: "AZIZI Creek Views",
      tagline: "Panoramic creek and city skyline",
      location: "Dubai Creek Harbour",
      image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&h=600&fit=crop",
      priceRange: "650K - 4M AED",
      priceRangeEur: "€160K - €985K",
      units: "1,200 apartments",
      completion: "Q1 2026",
      soldPercentage: 67,
      features: [
        "Creek Views",
        "City Skyline",
        "Metro Connected",
        "Premium Location"
      ],
      roi: "9% projected",
      paymentPlan: "50/50",
      commission: "5%",
      rating: 4.9,
      description: "Ultra-modern towers offering breathtaking views of Dubai Creek and the city skyline, positioned in the prestigious Creek Harbour district.",
      amenities: ["Rooftop Pool", "Sky Lounge", "Business Center", "Gym", "Sauna", "Steam Room", "Kids Area", "Jogging Track"],
      floorPlans: [
        { type: "1BR", size: "750 sqft", price: "895K AED", priceEur: "€220K" },
        { type: "2BR", size: "1,200 sqft", price: "1.4M AED", priceEur: "€344K" },
        { type: "3BR", size: "1,800 sqft", price: "2.1M AED", priceEur: "€517K" },
        { type: "Penthouse", size: "3,500 sqft", price: "3.8M AED", priceEur: "€935K" }
      ],
      gallery: [
        "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=800&h=600&fit=crop"
      ],
      coordinates: { lat: 25.2285, lng: 55.3273 },
      leadCount: 156,
      dealsCount: 32
    },
    {
      id: 4,
      name: "AZIZI Mina",
      tagline: "Beachfront luxury redefined",
      location: "Palm Jumeirah",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
      priceRange: "800K - 5M AED",
      priceRangeEur: "€197K - €1.23M",
      units: "800 apartments",
      completion: "Q3 2026",
      soldPercentage: 89,
      features: [
        "Beachfront",
        "Palm Jumeirah",
        "Private Marina",
        "Luxury Finishes"
      ],
      roi: "6.5% stable",
      paymentPlan: "40/60",
      commission: "6%",
      rating: 4.9,
      description: "Exclusive beachfront residences on the iconic Palm Jumeirah, offering unparalleled luxury and direct beach access.",
      amenities: ["Private Beach", "Marina Berths", "Infinity Pool", "Beach Club", "Spa", "Fine Dining", "Concierge", "Valet"],
      floorPlans: [
        { type: "1BR", size: "900 sqft", price: "1.2M AED", priceEur: "€295K" },
        { type: "2BR", size: "1,400 sqft", price: "1.9M AED", priceEur: "€468K" },
        { type: "3BR", size: "2,100 sqft", price: "2.8M AED", priceEur: "€689K" },
        { type: "4BR Penthouse", size: "4,200 sqft", price: "4.5M AED", priceEur: "€1.11M" }
      ],
      gallery: [
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1571896349956-1135d4fd8537?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop"
      ],
      coordinates: { lat: 25.112, lng: 55.138 },
      leadCount: 298,
      dealsCount: 67
    },
    {
      id: 5,
      name: "AZIZI Opera",
      tagline: "Downtown sophistication",
      location: "Downtown Dubai",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
      priceRange: "900K - 6M AED",
      priceRangeEur: "€221K - €1.48M",
      units: "600 apartments",
      completion: "Q4 2026",
      soldPercentage: 58,
      features: [
        "Burj Khalifa Views",
        "Opera District",
        "Metro Access",
        "Premium Dining"
      ],
      roi: "7.5% expected",
      paymentPlan: "30/70",
      commission: "5.5%",
      rating: 4.7,
      description: "Sophisticated urban living in the heart of Downtown Dubai, offering spectacular views of the Burj Khalifa and Dubai Opera.",
      amenities: ["Opera Views", "High-end Gym", "Rooftop Terrace", "Wine Cellar", "Library", "Business Lounge", "Concierge", "Valet"],
      floorPlans: [
        { type: "1BR", size: "850 sqft", price: "1.35M AED", priceEur: "€332K" },
        { type: "2BR", size: "1,300 sqft", price: "2.1M AED", priceEur: "€517K" },
        { type: "3BR", size: "1,900 sqft", price: "3.2M AED", priceEur: "€787K" },
        { type: "Penthouse", size: "3,800 sqft", price: "5.5M AED", priceEur: "€1.35M" }
      ],
      gallery: [
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1600607688960-e095ff5e77a0?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1600607688920-4e2a09cf159d?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop"
      ],
      coordinates: { lat: 25.1956, lng: 55.2741 },
      leadCount: 178,
      dealsCount: 29
    },
    {
      id: 6,
      name: "AZIZI Beach Oasis",
      tagline: "Resort-style beachfront living",
      location: "Dubai South",
      image: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800&h=600&fit=crop",
      priceRange: "600K - 4M AED",
      priceRangeEur: "€148K - €985K",
      units: "2,500 apartments",
      completion: "Q1 2027",
      soldPercentage: 34,
      features: [
        "Private Beach",
        "Airport Proximity",
        "Resort Amenities",
        "Investment Potential"
      ],
      roi: "9% projected",
      paymentPlan: "80/20",
      commission: "4.5%",
      rating: 4.5,
      description: "Resort-style beachfront community near Al Maktoum International Airport, perfect for investment and vacation homes.",
      amenities: ["Private Beach", "Water Sports", "Beach Volleyball", "Resort Pool", "Spa", "Restaurants", "Retail", "Airport Shuttle"],
      floorPlans: [
        { type: "Studio", size: "450 sqft", price: "575K AED", priceEur: "€141K" },
        { type: "1BR", size: "750 sqft", price: "825K AED", priceEur: "€203K" },
        { type: "2BR", size: "1,150 sqft", price: "1.3M AED", priceEur: "€320K" },
        { type: "3BR", size: "1,650 sqft", price: "1.9M AED", priceEur: "€468K" },
        { type: "Villa", size: "2,800 sqft", price: "3.5M AED", priceEur: "€861K" }
      ],
      gallery: [
        "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop"
      ],
      coordinates: { lat: 24.8956, lng: 55.1611 },
      leadCount: 134,
      dealsCount: 18
    }
  ];

  // Фильтрация проектов
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.tagline.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = selectedLocation === 'All' || project.location.includes(selectedLocation);
    
    const matchesPriceRange = selectedPriceRange === 'All' || 
      (selectedPriceRange === 'under1M' && (project.priceRange.includes('500K') || project.priceRange.includes('400K') || project.priceRange.includes('650K'))) ||
      (selectedPriceRange === '1-2M' && (project.priceRange.includes('1.') || project.priceRange.includes('2M'))) ||
      (selectedPriceRange === '2-3M' && project.priceRange.includes('3M')) ||
      (selectedPriceRange === '3M+' && (project.priceRange.includes('4M') || project.priceRange.includes('5M') || project.priceRange.includes('6M')));
    
    const matchesCompletion = selectedCompletion === 'All' || project.completion.includes(selectedCompletion);
    
    return matchesSearch && matchesLocation && matchesPriceRange && matchesCompletion;
  });

  // Сортировка проектов
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parseFloat(a.priceRange.split('-')[0]) - parseFloat(b.priceRange.split('-')[0]);
      case 'price-high':
        return parseFloat(b.priceRange.split('-')[1]) - parseFloat(a.priceRange.split('-')[1]);
      case 'roi':
        return parseFloat(b.roi) - parseFloat(a.roi);
      case 'completion':
        return new Date(a.completion) - new Date(b.completion);
      case 'sold':
        return b.soldPercentage - a.soldPercentage;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const toggleCompare = (projectId) => {
    setCompareList(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : prev.length < 3 ? [...prev, projectId] : prev
    );
  };

  const ProjectCard = ({ project }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, rotateY: 2 }}
      className="group"
    >
      <Card className="bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 hover:border-white/30 transition-all duration-300 overflow-hidden">
        <div className="relative">
          <img 
            src={project.image} 
            alt={project.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3 flex items-center space-x-2">
            <Badge className="bg-black/60 text-white border-white/20">
              {project.soldPercentage}% Sold
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleCompare(project.id)}
              className={`p-2 rounded-full backdrop-blur-sm ${
                compareList.includes(project.id) 
                  ? 'bg-blue-500/80 text-white' 
                  : 'bg-black/60 text-white hover:bg-blue-500/60'
              }`}
            >
              <Heart className="w-4 h-4" fill={compareList.includes(project.id) ? 'currentColor' : 'none'} />
            </Button>
          </div>
          <div className="absolute bottom-3 left-3">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${i < Math.floor(project.rating) ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
                />
              ))}
              <span className="text-white text-sm ml-1">{project.rating}</span>
            </div>
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                {project.name}
              </h3>
              <p className="text-white/70 text-sm">{project.tagline}</p>
            </div>

            <div className="flex items-center text-white/60 text-sm">
              <MapPin className="w-4 h-4 mr-1" />
              {project.location}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-white/60">Price Range</p>
                <p className="text-white font-semibold">{project.priceRange}</p>
                <p className="text-white/60 text-xs">{project.priceRangeEur}</p>
              </div>
              <div>
                <p className="text-white/60">ROI</p>
                <p className="text-green-400 font-semibold">{project.roi}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-white/60">Completion</p>
                <p className="text-white font-semibold">{project.completion}</p>
              </div>
              <div>
                <p className="text-white/60">Commission</p>
                <p className="text-purple-400 font-semibold">{project.commission}</p>
              </div>
            </div>

            <div>
              <p className="text-white/60 text-sm mb-2">Key Features</p>
              <div className="flex flex-wrap gap-1">
                {project.features.slice(0, 3).map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs text-white/80 border-white/20">
                    {feature}
                  </Badge>
                ))}
                {project.features.length > 3 && (
                  <Badge variant="outline" className="text-xs text-white/60 border-white/20">
                    +{project.features.length - 3} more
                  </Badge>
                )}
              </div>
            </div>

            <Progress value={project.soldPercentage} className="h-2" />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-xs text-white/60">
                <span className="flex items-center">
                  <Users className="w-3 h-3 mr-1" />
                  {project.leadCount} leads
                </span>
                <span className="flex items-center">
                  <Handshake className="w-3 h-3 mr-1" />
                  {project.dealsCount} deals
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    onClick={() => setSelectedProject(project)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </DialogTrigger>
              </Dialog>
              
              <Button variant="outline" size="sm" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                <Download className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-white">AZIZI Projects Catalog</h2>
          <p className="text-white/70">Discover premium real estate opportunities</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/20 text-white placeholder-white/50 w-64"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="bg-white/5 border-white/20 text-white hover:bg-white/10"
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="bg-white/5 border-white/20 text-white hover:bg-white/10"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <div>
              <label className="text-white/70 text-sm mb-2 block">Location</label>
              <select 
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-md px-3 py-2 text-white text-sm focus:border-blue-500/50"
              >
                <option value="All">All Locations</option>
                <option value="Dubai Marina">Dubai Marina</option>
                <option value="Downtown">Downtown</option>
                <option value="Sports City">Sports City</option>
                <option value="Creek Harbour">Creek Harbour</option>
                <option value="Palm Jumeirah">Palm Jumeirah</option>
                <option value="Dubai South">Dubai South</option>
              </select>
            </div>
            
            <div>
              <label className="text-white/70 text-sm mb-2 block">Price Range</label>
              <select 
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-md px-3 py-2 text-white text-sm focus:border-blue-500/50"
              >
                <option value="All">All Prices</option>
                <option value="under1M">&lt; 1M AED</option>
                <option value="1-2M">1-2M AED</option>
                <option value="2-3M">2-3M AED</option>
                <option value="3M+">3M+ AED</option>
              </select>
            </div>
            
            <div>
              <label className="text-white/70 text-sm mb-2 block">Completion</label>
              <select 
                value={selectedCompletion}
                onChange={(e) => setSelectedCompletion(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-md px-3 py-2 text-white text-sm focus:border-blue-500/50"
              >
                <option value="All">All Years</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
              </select>
            </div>
            
            <div>
              <label className="text-white/70 text-sm mb-2 block">Sort By</label>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-md px-3 py-2 text-white text-sm focus:border-blue-500/50"
              >
                <option value="name">Name A-Z</option>
                <option value="price-low">Price Low-High</option>
                <option value="price-high">Price High-Low</option>
                <option value="roi">ROI</option>
                <option value="completion">Completion Date</option>
                <option value="sold">% Sold</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedLocation('All');
                  setSelectedPriceRange('All');
                  setSelectedCompletion('All');
                  setSortBy('name');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compare Bar */}
      {compareList.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30 backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-white font-medium">Compare Projects ({compareList.length}/3)</span>
                  <div className="flex items-center space-x-2">
                    {compareList.map(id => {
                      const project = projects.find(p => p.id === id);
                      return (
                        <Badge key={id} className="bg-blue-500/20 text-blue-300">
                          {project?.name}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-blue-500 to-purple-600"
                    disabled={compareList.length < 2}
                  >
                    Compare Now
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setCompareList([])}
                    className="text-white/70 hover:text-white"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Projects Grid */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1'
      }`}>
        <AnimatePresence>
          {sortedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </AnimatePresence>
      </div>

      {sortedProjects.length === 0 && (
        <Card className="bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20">
          <CardContent className="p-12 text-center">
            <Building2 className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Projects Found</h3>
            <p className="text-white/70">Try adjusting your filters to see more projects</p>
          </CardContent>
        </Card>
      )}

      {/* Project Details Modal */}
      {selectedProject && (
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 border border-white/20">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white">
                {selectedProject.name}
              </DialogTitle>
            </DialogHeader>
            
            <div className="p-6 space-y-6">
              {/* Gallery */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedProject.gallery.map((image, index) => (
                  <img 
                    key={index}
                    src={image} 
                    alt={`${selectedProject.name} ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ))}
              </div>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="bg-white/5 border border-white/10">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-white/10 text-white/70 data-[state=active]:text-white">Overview</TabsTrigger>
                  <TabsTrigger value="floorplans" className="data-[state=active]:bg-white/10 text-white/70 data-[state=active]:text-white">Floor Plans</TabsTrigger>
                  <TabsTrigger value="amenities" className="data-[state=active]:bg-white/10 text-white/70 data-[state=active]:text-white">Amenities</TabsTrigger>
                  <TabsTrigger value="calculator" className="data-[state=active]:bg-white/10 text-white/70 data-[state=active]:text-white">ROI Calculator</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Project Details</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-white/70">Location:</span>
                          <span className="text-white">{selectedProject.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Units:</span>
                          <span className="text-white">{selectedProject.units}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Completion:</span>
                          <span className="text-white">{selectedProject.completion}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">ROI:</span>
                          <span className="text-green-400">{selectedProject.roi}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Commission:</span>
                          <span className="text-purple-400">{selectedProject.commission}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Performance</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-white/70">Sold</span>
                            <span className="text-white">{selectedProject.soldPercentage}%</span>
                          </div>
                          <Progress value={selectedProject.soldPercentage} className="h-2" />
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Total Leads:</span>
                          <span className="text-blue-400">{selectedProject.leadCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Deals Closed:</span>
                          <span className="text-green-400">{selectedProject.dealsCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Rating:</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < Math.floor(selectedProject.rating) ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
                              />
                            ))}
                            <span className="text-white ml-1">{selectedProject.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Description</h4>
                    <p className="text-white/80">{selectedProject.description}</p>
                  </div>
                </TabsContent>

                <TabsContent value="floorplans" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedProject.floorPlans.map((plan, index) => (
                      <Card key={index} className="bg-white/5 border-white/20">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h5 className="text-white font-semibold">{plan.type}</h5>
                              <p className="text-white/60 text-sm">{plan.size}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-white font-bold">{plan.price}</p>
                              <p className="text-white/60 text-sm">{plan.priceEur}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="amenities" className="mt-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {selectedProject.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center space-x-2 p-3 rounded-lg bg-white/5">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-white text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="calculator" className="mt-6">
                  <Card className="bg-white/5 border-white/20">
                    <CardContent className="p-6 text-center">
                      <Calculator className="w-16 h-16 text-white/50 mx-auto mb-4" />
                      <h4 className="text-xl font-semibold text-white mb-2">ROI Calculator</h4>
                      <p className="text-white/70 mb-6">Interactive calculator coming soon</p>
                      <Button className="bg-gradient-to-r from-blue-500 to-purple-600">
                        Calculate Returns
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              
              <div className="flex items-center space-x-4 pt-4 border-t border-white/10">
                <Button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600">
                  Suggest to Lead
                </Button>
                <Button variant="outline" className="bg-white/5 border-white/20 text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Brochure
                </Button>
                <Button variant="outline" className="bg-white/5 border-white/20 text-white">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ProjectsSection;