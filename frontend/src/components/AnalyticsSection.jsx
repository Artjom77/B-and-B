import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import CountUp from 'react-countup';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  TrendingUp, TrendingDown, Calendar, Download, Brain, 
  Globe, PieChart as PieChartIcon, BarChart3, Target,
  Users, DollarSign, Clock, Star, ArrowRight, CheckCircle
} from 'lucide-react';

const AnalyticsSection = () => {
  const [selectedMonth1, setSelectedMonth1] = useState('2024-12');
  const [selectedMonth2, setSelectedMonth2] = useState('2025-01');
  const [comparisonType, setComparisonType] = useState('Month');
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock данные для сравнения месяцев
  const generateComparisonData = () => {
    const baseData = {
      leadsGenerated: { dec: 5234, jan: 6789 },
      hotLeads: { dec: 412, jan: 523 },
      dealsClosedAZIZI: { dec: 23, jan: 31 },
      totalRevenue: { dec: 1449000, jan: 1876000 },
      avgDealSize: { dec: 1500000, jan: 1650000 },
      conversionRate: { dec: 15.8, jan: 18.2 },
      responseRate: { dec: 5.2, jan: 6.1 },
      commissionReceived: { dec: 920000, jan: 1180000 }
    };

    const comparisonResult = {};
    Object.keys(baseData).forEach(key => {
      const dec = baseData[key].dec;
      const jan = baseData[key].jan;
      const change = ((jan - dec) / dec) * 100;
      
      comparisonResult[key] = {
        month1: dec,
        month2: jan,
        change: change,
        changeFormatted: `${change > 0 ? '+' : ''}${change.toFixed(1)}%`,
        trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
        chartType: ['leadsGenerated', 'dealsClosedAZIZI', 'avgDealSize'].includes(key) ? 'bar' : 'line'
      };
    });

    return comparisonResult;
  };

  // Trend data за 12 месяцев
  const trendData = [
    { month: 'Feb', leads: 4200, hotLeads: 320, deals: 18, revenue: 1200000 },
    { month: 'Mar', leads: 4800, hotLeads: 380, deals: 21, revenue: 1350000 },
    { month: 'Apr', leads: 4500, hotLeads: 350, deals: 19, revenue: 1280000 },
    { month: 'May', leads: 5100, hotLeads: 420, deals: 24, revenue: 1480000 },
    { month: 'Jun', leads: 5400, hotLeads: 450, deals: 26, revenue: 1620000 },
    { month: 'Jul', leads: 4900, hotLeads: 390, deals: 22, revenue: 1380000 },
    { month: 'Aug', leads: 5200, hotLeads: 410, deals: 25, revenue: 1580000 },
    { month: 'Sep', leads: 5600, hotLeads: 480, deals: 28, revenue: 1720000 },
    { month: 'Oct', leads: 5300, hotLeads: 440, deals: 26, revenue: 1650000 },
    { month: 'Nov', leads: 4800, hotLeads: 380, deals: 21, revenue: 1420000 },
    { month: 'Dec', leads: 5234, hotLeads: 412, deals: 23, revenue: 1449000 },
    { month: 'Jan', leads: 6789, hotLeads: 523, deals: 31, revenue: 1876000 }
  ];

  // Geographic performance data
  const geoData = [
    { country: 'UAE', leads: 345, deals: 52, color: '#10b981' },
    { country: 'Russia', leads: 234, deals: 28, color: '#3b82f6' },
    { country: 'India', leads: 189, deals: 22, color: '#8b5cf6' },
    { country: 'UK', leads: 156, deals: 18, color: '#f59e0b' },
    { country: 'Saudi', leads: 123, deals: 15, color: '#ef4444' },
    { country: 'Others', leads: 298, deals: 34, color: '#6b7280' }
  ];

  // Source performance data
  const sourceData = [
    { name: 'LinkedIn', value: 65, leads: 4412, color: '#0077b5' },
    { name: 'Instagram', value: 25, leads: 1697, color: '#e4405f' },
    { name: 'Direct', value: 10, leads: 679, color: '#34d399' }
  ];

  // Project performance data
  const projectData = [
    { name: 'AZIZI Riviera', deals: 45, revenue: 6750000, color: '#3b82f6' },
    { name: 'AZIZI Venice', deals: 28, revenue: 4200000, color: '#8b5cf6' },
    { name: 'AZIZI Creek Views', deals: 32, revenue: 6400000, color: '#10b981' },
    { name: 'AZIZI Mina', deals: 67, revenue: 13400000, color: '#f59e0b' },
    { name: 'AZIZI Opera', deals: 29, revenue: 8700000, color: '#ef4444' },
    { name: 'AZIZI Beach Oasis', deals: 18, revenue: 3600000, color: '#6366f1' }
  ];

  // AI Predictions
  const aiPredictions = {
    nextMonth: {
      expectedDeals: 37,
      expectedRevenue: 2100000,
      expectedRevenueEur: 517000,
      confidence: 78
    },
    recommendations: [
      "Focus on London market - showing 45% better response rate",
      "Increase Instagram activity for <35 demographic (+67% engagement)",
      "AZIZI Mina performing best - allocate 30% more resources",
      "Tuesday-Thursday optimal contact time (2x higher conversion)"
    ]
  };

  // Top performers
  const topPerformers = [
    { name: 'John Smith', company: 'TechCorp', score: 98, status: 'Meeting scheduled', dealValue: '2.5M AED', avatar: 'https://i.pravatar.cc/150?img=1' },
    { name: 'Maria Garcia', company: 'DataAI Solutions', score: 95, status: 'Documents stage', dealValue: '1.8M AED', avatar: 'https://i.pravatar.cc/150?img=2' },
    { name: 'Ahmed Al-Rashid', company: 'Emirates NBD', score: 94, status: 'Ready to buy', dealValue: '3.2M AED', avatar: 'https://i.pravatar.cc/150?img=3' },
    { name: 'Sarah Chen', company: 'ADNOC', score: 92, status: 'Negotiating', dealValue: '2.1M AED', avatar: 'https://i.pravatar.cc/150?img=4' },
    { name: 'Boris Petrov', company: 'Lukoil', score: 91, status: 'Proposal sent', dealValue: '4.5M AED', avatar: 'https://i.pravatar.cc/150?img=5' }
  ];

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setComparisonData(generateComparisonData());
      setLoading(false);
    }, 1000);
  }, [selectedMonth1, selectedMonth2]);

  const formatCurrency = (value, showEur = true) => {
    const aed = value.toLocaleString();
    if (!showEur) return `${aed} AED`;
    const eur = (value * 0.246).toLocaleString(undefined, { maximumFractionDigits: 0 });
    return `${aed} AED (€${eur})`;
  };

  const formatPercentage = (value) => `${value.toFixed(1)}%`;

  const ComparisonCard = ({ title, data, icon: Icon }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 hover:border-white/30 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Icon className="w-5 h-5 text-blue-400" />
              <h3 className="text-white font-semibold text-sm">{title}</h3>
            </div>
            <div className="flex items-center space-x-1">
              {data.trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-green-400" />
              ) : data.trend === 'down' ? (
                <TrendingDown className="w-4 h-4 text-red-400" />
              ) : null}
              <span className={`text-sm font-medium ${
                data.trend === 'up' ? 'text-green-400' : 
                data.trend === 'down' ? 'text-red-400' : 'text-gray-400'
              }`}>
                {data.changeFormatted}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-white/60 text-xs">Dec 2024</p>
              <p className="text-white font-bold text-lg">
                {typeof data.month1 === 'number' && data.month1 > 1000000 
                  ? formatCurrency(data.month1, false)
                  : typeof data.month1 === 'number' && data.month1 > 100
                  ? data.month1.toLocaleString()
                  : typeof data.month1 === 'number' && data.month1 < 100
                  ? formatPercentage(data.month1)
                  : data.month1
                }
              </p>
            </div>
            <div>
              <p className="text-white/60 text-xs">Jan 2025</p>
              <p className="text-white font-bold text-lg">
                {typeof data.month2 === 'number' && data.month2 > 1000000 
                  ? formatCurrency(data.month2, false)
                  : typeof data.month2 === 'number' && data.month2 > 100
                  ? data.month2.toLocaleString()
                  : typeof data.month2 === 'number' && data.month2 < 100
                  ? formatPercentage(data.month2)
                  : data.month2
                }
              </p>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/70 text-xs">Progress</span>
              <span className="text-white/70 text-xs">
                {data.trend === 'up' ? 'Growth' : data.trend === 'down' ? 'Decline' : 'Stable'}
              </span>
            </div>
            <Progress 
              value={Math.min(Math.abs(data.change) * 2, 100)} 
              className={`h-2 ${data.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/80 p-3 rounded-lg border border-white/20 backdrop-blur-xl">
          <p className="text-white font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-blue-300">
              {entry.name}: {typeof entry.value === 'number' && entry.value > 1000000 
                ? formatCurrency(entry.value, false)
                : entry.value?.toLocaleString?.() || entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-white">Advanced Analytics</h2>
          <p className="text-white/70">Comprehensive performance insights and comparisons</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="outline" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="comparison" className="space-y-6">
        <TabsList className="bg-white/5 border border-white/10 backdrop-blur-xl">
          <TabsTrigger value="comparison" className="data-[state=active]:bg-white/10 text-white/70 data-[state=active]:text-white">
            Month Comparison
          </TabsTrigger>
          <TabsTrigger value="trends" className="data-[state=active]:bg-white/10 text-white/70 data-[state=active]:text-white">
            Trends Analysis
          </TabsTrigger>
          <TabsTrigger value="geography" className="data-[state=active]:bg-white/10 text-white/70 data-[state=active]:text-white">
            Geographic Performance
          </TabsTrigger>
          <TabsTrigger value="predictions" className="data-[state=active]:bg-white/10 text-white/70 data-[state=active]:text-white">
            AI Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="comparison" className="space-y-6">
          {/* Month Selector */}
          <Card className="bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-400" />
                Select Periods to Compare
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-white/70 text-sm mb-2 block">Period 1</label>
                  <select 
                    value={selectedMonth1}
                    onChange={(e) => setSelectedMonth1(e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-md px-3 py-2 text-white focus:border-blue-500/50"
                  >
                    <option value="2024-11">November 2024</option>
                    <option value="2024-12">December 2024</option>
                    <option value="2025-01">January 2025</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-white/70 text-sm mb-2 block">Period 2</label>
                  <select 
                    value={selectedMonth2}
                    onChange={(e) => setSelectedMonth2(e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-md px-3 py-2 text-white focus:border-blue-500/50"
                  >
                    <option value="2024-12">December 2024</option>
                    <option value="2025-01">January 2025</option>
                    <option value="2025-02">February 2025</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-white/70 text-sm mb-2 block">Comparison Type</label>
                  <select 
                    value={comparisonType}
                    onChange={(e) => setComparisonType(e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-md px-3 py-2 text-white focus:border-blue-500/50"
                  >
                    <option value="Month">Month to Month</option>
                    <option value="Quarter">Quarter</option>
                    <option value="Year">Year</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comparison Metrics */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full"
              />
            </div>
          ) : comparisonData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <ComparisonCard
                title="Leads Generated"
                data={comparisonData.leadsGenerated}
                icon={Users}
              />
              <ComparisonCard
                title="Hot Leads"
                data={comparisonData.hotLeads}
                icon={Target}
              />
              <ComparisonCard
                title="Deals Closed"
                data={comparisonData.dealsClosedAZIZI}
                icon={Handshake}
              />
              <ComparisonCard
                title="Total Revenue"
                data={comparisonData.totalRevenue}
                icon={DollarSign}
              />
              <ComparisonCard
                title="Avg Deal Size"
                data={comparisonData.avgDealSize}
                icon={TrendingUp}
              />
              <ComparisonCard
                title="Conversion Rate"
                data={comparisonData.conversionRate}
                icon={Target}
              />
              <ComparisonCard
                title="Response Rate"
                data={comparisonData.responseRate}
                icon={Users}
              />
              <ComparisonCard
                title="Commission"
                data={comparisonData.commissionReceived}
                icon={DollarSign}
              />
            </div>
          ) : null}

          {/* Comparison Chart */}
          {comparisonData && (
            <Card className="bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Performance Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          metric: 'Leads',
                          Dec: comparisonData.leadsGenerated.month1,
                          Jan: comparisonData.leadsGenerated.month2
                        },
                        {
                          metric: 'Hot Leads',
                          Dec: comparisonData.hotLeads.month1,
                          Jan: comparisonData.hotLeads.month2
                        },
                        {
                          metric: 'Deals',
                          Dec: comparisonData.dealsClosedAZIZI.month1,
                          Jan: comparisonData.dealsClosedAZIZI.month2
                        }
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="metric" stroke="#fff" />
                      <YAxis stroke="#fff" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="Dec" fill="#667eea" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Jan" fill="#764ba2" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {/* Trend Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20">
              <CardHeader>
                <CardTitle className="text-white">12-Month Trend: Leads & Deals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#667eea" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="dealsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="month" stroke="#fff" />
                      <YAxis stroke="#fff" />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="leads" stroke="#667eea" fillOpacity={1} fill="url(#leadsGradient)" />
                      <Area type="monotone" dataKey="deals" stroke="#10b981" fillOpacity={1} fill="url(#dealsGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="month" stroke="#fff" />
                      <YAxis stroke="#fff" />
                      <Tooltip content={<CustomTooltip />} />
                      <Line type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Project Performance */}
          <Card className="bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Project Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={projectData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis type="number" stroke="#fff" />
                    <YAxis dataKey="name" type="category" stroke="#fff" width={100} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="deals" fill="#667eea" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geography" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Geographic Distribution */}
            <Card className="bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-blue-400" />
                  Geographic Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={geoData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="leads"
                        label={({ country, leads }) => `${country}: ${leads}`}
                      >
                        {geoData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Source Performance */}
            <Card className="bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Traffic Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sourceData.map((source, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-medium">{source.name}</span>
                        <span className="text-white/70">{source.value}% ({source.leads} leads)</span>
                      </div>
                      <Progress value={source.value} className="h-3" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Country Performance Table */}
          <Card className="bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Country Performance Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-white/80 py-3">Country</th>
                      <th className="text-left text-white/80 py-3">Leads</th>
                      <th className="text-left text-white/80 py-3">Deals</th>
                      <th className="text-left text-white/80 py-3">Conversion Rate</th>
                      <th className="text-left text-white/80 py-3">Avg Deal Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {geoData.map((country, index) => (
                      <tr key={index} className="border-b border-white/5">
                        <td className="py-3 text-white">{country.country}</td>
                        <td className="py-3 text-white">{country.leads}</td>
                        <td className="py-3 text-white">{country.deals}</td>
                        <td className="py-3 text-white">{((country.deals / country.leads) * 100).toFixed(1)}%</td>
                        <td className="py-3 text-white">{formatCurrency(1500000 + Math.random() * 1000000, false)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          {/* AI Predictions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border-blue-500/30 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-blue-400" />
                  AI Predictions - Next Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 rounded-lg bg-white/5">
                      <p className="text-white/70 text-sm">Expected Deals</p>
                      <p className="text-2xl font-bold text-blue-400">
                        <CountUp end={aiPredictions.nextMonth.expectedDeals} />
                      </p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-white/5">
                      <p className="text-white/70 text-sm">Expected Revenue</p>
                      <p className="text-xl font-bold text-green-400">
                        {formatCurrency(aiPredictions.nextMonth.expectedRevenue)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/70">Confidence Level</span>
                      <span className="text-white font-bold">{aiPredictions.nextMonth.confidence}%</span>
                    </div>
                    <Progress value={aiPredictions.nextMonth.confidence} className="h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Performers */}
            <Card className="bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-400" />
                  Top Performing Leads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topPerformers.slice(0, 3).map((performer, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <img 
                        src={performer.avatar} 
                        alt={performer.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm">{performer.name}</p>
                        <p className="text-white/60 text-xs">{performer.company}</p>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-green-500/20 text-green-300 text-xs">
                          {performer.score}
                        </Badge>
                        <p className="text-white/60 text-xs mt-1">{performer.dealValue}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Recommendations */}
          <Card className="bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Brain className="w-5 h-5 mr-2 text-purple-400" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiPredictions.recommendations.map((recommendation, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-2 rounded-full bg-purple-500/20">
                        <ArrowRight className="w-4 h-4 text-purple-400" />
                      </div>
                      <p className="text-white/90 text-sm leading-relaxed">{recommendation}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsSection;