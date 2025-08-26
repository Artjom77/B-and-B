import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import CountUp from 'react-countup';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { 
  Users, Search, Filter, Download, Eye, MessageSquare, 
  Handshake, Clock, CheckCircle, DollarSign, Target,
  TrendingUp, TrendingDown, Mail, Phone, MapPin
} from 'lucide-react';

const LeadsSection = () => {
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock данные для воронки лидов
  const funnelData = [
    {
      id: "not_contacted",
      label: "Еще не контактировали",
      count: 125000,
      percentage: 69.4,
      color: "#94a3b8",
      icon: "⏳"
    },
    {
      id: "contacted_no_response",
      label: "Отправлено, без ответа",
      count: 48000,
      percentage: 26.7,
      color: "#fbbf24",
      icon: "📨"
    },
    {
      id: "responded",
      label: "Ответили, в диалоге",
      count: 5500,
      percentage: 3.1,
      color: "#60a5fa",
      icon: "💬"
    },
    {
      id: "transferred",
      label: "Передано в AZIZI",
      count: 1200,
      percentage: 0.67,
      color: "#a78bfa",
      icon: "🤝"
    },
    {
      id: "closed",
      label: "Сделка закрыта",
      count: 280,
      percentage: 0.16,
      color: "#34d399",
      icon: "✅"
    },
    {
      id: "paid",
      label: "Комиссия получена",
      count: 20,
      percentage: 0.01,
      color: "#10b981",
      icon: "💰"
    }
  ];

  // Mock профили для каждого сегмента
  const generateProfiles = (segmentId, count) => {
    const names = ['Ahmed Al-Rashid', 'Maria Garcia', 'John Smith', 'Sarah Chen', 'Boris Petrov', 'Raj Patel', 'Emma Wilson', 'Ali Hassan', 'Lisa Taylor', 'Mohamed Ali'];
    const companies = ['Dubai Investments PJSC', 'Emirates NBD', 'Mashreq Bank', 'Etisalat', 'ADNOC', 'Emaar Properties', 'DP World', 'DEWA', 'Dubai Ports', 'Arabtec'];
    const positions = ['CEO', 'CFO', 'Managing Director', 'VP Sales', 'General Manager', 'Director', 'Senior Manager', 'Executive', 'Founder', 'President'];
    const locations = ['Dubai, UAE', 'Abu Dhabi, UAE', 'London, UK', 'New York, USA', 'Mumbai, India', 'Moscow, Russia', 'Singapore', 'Toronto, Canada'];
    const projects = ['AZIZI Riviera', 'AZIZI Venice', 'AZIZI Creek Views', 'AZIZI Mina', 'AZIZI Opera', 'AZIZI Beach Oasis'];

    return Array.from({ length: Math.min(count, 100) }, (_, i) => ({
      id: `BBH-LIN-${String(i + 1).padStart(4, '0')}`,
      name: names[i % names.length],
      avatar: `https://i.pravatar.cc/150?img=${(i % 50) + 1}`,
      company: companies[i % companies.length],
      position: positions[i % positions.length],
      location: locations[i % locations.length],
      platform: Math.random() > 0.5 ? 'LinkedIn' : 'Instagram',
      aiScore: Math.floor(Math.random() * 40) + 60,
      dealSize: segmentId === 'closed' || segmentId === 'paid' ? `${(Math.random() * 3000000 + 500000).toLocaleString()} AED` : null,
      commission: segmentId === 'paid' ? `${(Math.random() * 150000 + 20000).toLocaleString()} AED` : null,
      project: projects[i % projects.length],
      dateClosed: segmentId === 'closed' || segmentId === 'paid' ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString() : null,
      manager: ['Sarah Chen', 'Ahmed Ali', 'Maria Rodriguez', 'John Wilson'][i % 4],
      email: `${names[i % names.length].toLowerCase().replace(' ', '.')}@${companies[i % companies.length].toLowerCase().replace(/\s+/g, '')}.com`,
      phone: `+971 ${Math.floor(Math.random() * 90000) + 10000}`,
      lastContact: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      status: segmentId === 'responded' ? ['Interested', 'Needs Info', 'Ready to Buy', 'Considering'][Math.floor(Math.random() * 4)] : 
              segmentId === 'transferred' ? ['Under Review', 'Meeting Scheduled', 'Proposal Sent'][Math.floor(Math.random() * 3)] :
              segmentId === 'closed' ? 'Deal Closed' :
              segmentId === 'paid' ? 'Commission Received' : 'No Response'
    }));
  };

  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    if (selectedSegment) {
      const segment = funnelData.find(s => s.id === selectedSegment);
      setProfiles(generateProfiles(selectedSegment, segment?.count || 0));
      setCurrentPage(1);
    }
  }, [selectedSegment]);

  // Метрики конверсии
  const conversionMetrics = [
    { label: "Response Rate", value: "3.5%", trend: "+0.5%", isPositive: true },
    { label: "Hot Lead Rate", value: "0.8%", trend: "+0.2%", isPositive: true },
    { label: "Close Rate", value: "0.16%", trend: "-0.02%", isPositive: false },
    { label: "Avg Deal Size", value: "1.85M AED", trend: "+125K", isPositive: true, valueEur: "€456K" }
  ];

  // Прогресс месячной цели
  const monthlyProgress = {
    current: 55000,
    target: 180000,
    percentage: 30.6,
    daysLeft: 19,
    status: "behind"
  };

  // Фильтрация профилей по поиску
  const filteredProfiles = profiles.filter(profile =>
    profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Пагинация
  const totalPages = Math.ceil(filteredProfiles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProfiles = filteredProfiles.slice(startIndex, startIndex + itemsPerPage);

  const formatCurrency = (aed) => {
    if (!aed) return '';
    const numAed = parseFloat(aed.replace(/[^\d.-]/g, ''));
    const eur = numAed * 0.246; // 1 AED ≈ 0.246 EUR
    return `${aed} (€${eur.toLocaleString('en-US', {maximumFractionDigits: 0})})`;
  };

  const PieChartTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-black/80 p-3 rounded-lg border border-white/20 backdrop-blur-xl">
          <p className="text-white font-semibold">{data.label}</p>
          <p className="text-blue-300">Count: {data.count.toLocaleString()}</p>
          <p className="text-purple-300">Percentage: {data.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header with Monthly Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg col-span-2 bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Target className="w-5 h-5 mr-2 text-blue-400" />
              Monthly Target Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold text-white">
                    <CountUp end={monthlyProgress.current} separator="," />
                  </p>
                  <p className="text-white/60">of {monthlyProgress.target.toLocaleString()} profiles</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-yellow-400">{monthlyProgress.daysLeft} days left</p>
                  <Badge className={`${monthlyProgress.status === 'behind' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-green-500/20 text-green-300'}`}>
                    {monthlyProgress.status === 'behind' ? 'Behind Schedule' : 'On Track'}
                  </Badge>
                </div>
              </div>
              <Progress value={monthlyProgress.percentage} className="h-3" />
              <p className="text-white/70 text-sm">{monthlyProgress.percentage}% completed</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10 border-emerald-500/30 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-300 text-sm font-medium">Daily Target</p>
                <p className="text-2xl font-bold text-white mt-2">
                  <CountUp end={6000} separator="," />
                </p>
                <p className="text-emerald-300/80 text-sm">profiles per day</p>
              </div>
              <div className="p-3 rounded-full bg-emerald-500/20">
                <Users className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Funnel Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-400" />
              Lead Funnel (180K Total)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={funnelData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={40}
                    paddingAngle={2}
                    dataKey="count"
                    onClick={(entry) => setSelectedSegment(entry.id)}
                    className="cursor-pointer"
                  >
                    {funnelData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        stroke={selectedSegment === entry.id ? '#ffffff' : 'transparent'}
                        strokeWidth={selectedSegment === entry.id ? 3 : 0}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<PieChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Center Total */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">
                    <CountUp end={180000} separator="," />
                  </p>
                  <p className="text-white/60 text-sm">Total Profiles</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Funnel Legend */}
        <Card className="bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Funnel Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {funnelData.map((segment) => (
                <motion.div
                  key={segment.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedSegment(segment.id)}
                  className={`p-3 rounded-lg cursor-pointer border transition-all duration-200 ${
                    selectedSegment === segment.id 
                      ? 'border-white/40 bg-white/10' 
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: segment.color }}
                      />
                      <div>
                        <p className="text-white font-medium text-sm">{segment.icon} {segment.label}</p>
                        <p className="text-white/60 text-xs">{segment.percentage}%</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">
                        <CountUp end={segment.count} separator="," />
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {conversionMetrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 hover:border-white/30 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">{metric.label}</p>
                    <p className="text-xl font-bold text-white">{metric.value}</p>
                    {metric.valueEur && (
                      <p className="text-white/60 text-sm">{metric.valueEur}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    {metric.isPositive ? (
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                    <span className={`text-sm font-medium ${metric.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      {metric.trend}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Profiles Table */}
      <AnimatePresence>
        {selectedSegment && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center">
                    {funnelData.find(s => s.id === selectedSegment)?.icon} {funnelData.find(s => s.id === selectedSegment)?.label}
                    <Badge className="ml-2 bg-blue-500/20 text-blue-300">
                      {filteredProfiles.length} profiles
                    </Badge>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
                      <Input
                        placeholder="Search profiles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white/5 border-white/20 text-white placeholder-white/50"
                      />
                    </div>
                    <Button variant="outline" size="sm" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSelectedSegment(null)}
                      className="text-white/70 hover:text-white hover:bg-white/10"
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10">
                        <TableHead className="text-white/80">Profile</TableHead>
                        <TableHead className="text-white/80">Company</TableHead>
                        <TableHead className="text-white/80">Location</TableHead>
                        <TableHead className="text-white/80">AI Score</TableHead>
                        <TableHead className="text-white/80">Status</TableHead>
                        {(selectedSegment === 'closed' || selectedSegment === 'paid') && (
                          <>
                            <TableHead className="text-white/80">Deal Size</TableHead>
                            {selectedSegment === 'paid' && <TableHead className="text-white/80">Commission</TableHead>}
                          </>
                        )}
                        <TableHead className="text-white/80">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedProfiles.map((profile, index) => (
                        <motion.tr
                          key={profile.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-white/10 hover:bg-white/5"
                        >
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={profile.avatar} />
                                <AvatarFallback>{profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-white font-medium text-sm">{profile.name}</p>
                                <p className="text-white/60 text-xs">{profile.id}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-white text-sm">{profile.company}</p>
                              <p className="text-white/60 text-xs">{profile.position}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-white/80 text-sm">{profile.location}</TableCell>
                          <TableCell>
                            <Badge className={`${profile.aiScore >= 90 ? 'bg-green-500/20 text-green-300' : profile.aiScore >= 75 ? 'bg-yellow-500/20 text-yellow-300' : 'bg-gray-500/20 text-gray-300'}`}>
                              {profile.aiScore}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-white/80 border-white/20">
                              {profile.status}
                            </Badge>
                          </TableCell>
                          {(selectedSegment === 'closed' || selectedSegment === 'paid') && (
                            <TableCell className="text-green-400 text-sm font-medium">
                              {formatCurrency(profile.dealSize)}
                            </TableCell>
                          )}
                          {selectedSegment === 'paid' && (
                            <TableCell className="text-emerald-400 text-sm font-medium">
                              {formatCurrency(profile.commission)}
                            </TableCell>
                          )}
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                                <Eye className="w-3 h-3" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                                <MessageSquare className="w-3 h-3" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                                <Mail className="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-white/60 text-sm">
                      Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredProfiles.length)} of {filteredProfiles.length}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                      >
                        Previous
                      </Button>
                      <span className="text-white/80 text-sm">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LeadsSection;