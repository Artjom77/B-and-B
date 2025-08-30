import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import AIAssistantChat from './AIAssistantChat';
import LeadsSection from './LeadsSection';
import ProjectsSection from './ProjectsSection';
import AnalyticsSection from './AnalyticsSection';
import { 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign, 
  Activity, 
  Sparkles,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  Filter,
  Download,
  Upload,
  Zap,
  Crown,
  Flame
} from 'lucide-react';

const Dashboard = ({ authData, onLogout }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    generateNotifications();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/analytics/dashboard`);
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Use mock data for demo
      setDashboardData({
        total_leads_provided: 923,
        hot_leads_generated: 156,
        leads_responded: 67,
        response_rate: 0.072,
        deals_closed_azizi: 31,
        total_revenue: 1876000,
        average_deal_size: 60516,
        commission_received: 75040,
        conversion_rate: 3.4,
        time_to_close_avg: 11,
        linkedin_performance: {
          leads: 567,
          response_rate: 0.051,
          conversion: 0.18
        },
        instagram_performance: {
          leads: 356,
          response_rate: 0.094,
          conversion: 0.15
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const generateNotifications = () => {
    const mockNotifications = [
      {
        id: 1,
        type: 'hot_lead',
        title: 'New Hot Lead!',
        message: 'John Smith (TechCorp CEO) just viewed AZIZI Riviera',
        time: '2 min ago',
        priority: 'high'
      },
      {
        id: 2,
        type: 'deal',
        title: 'Deal Update',
        message: 'Sarah Johnson moved to viewing stage - 2.1M AED deal',
        time: '15 min ago',
        priority: 'medium'
      },
      {
        id: 3,
        type: 'milestone',
        title: 'Monthly Target',
        message: 'You\'ve reached 85% of your monthly target!',
        time: '1 hour ago',
        priority: 'low'
      }
    ];
    setNotifications(mockNotifications);
  };

  const MetricCard = ({ title, value, change, icon: Icon, format = 'number', suffix = '', color = 'blue' }) => {
    const colorClasses = {
      blue: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
      green: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30',
      purple: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
      orange: 'from-orange-500/20 to-red-500/20 border-orange-500/30',
      indigo: 'from-indigo-500/20 to-purple-500/20 border-indigo-500/30'
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ 
          scale: 1.02, 
          rotateY: 5,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
        className="cursor-pointer group"
      >
        <Card className={`relative overflow-hidden bg-gradient-to-br ${colorClasses[color]} backdrop-blur-xl border transition-all duration-300 hover:border-white/40`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium">{title}</p>
                <div className="flex items-baseline space-x-2 mt-2">
                  <span className="text-2xl font-bold text-white">
                    {format === 'currency' ? (
                      <CountUp
                        end={value}
                        duration={2}
                        separator=","
                        prefix="AED "
                        suffix={suffix}
                      />
                    ) : format === 'percentage' ? (
                      <CountUp
                        end={value}
                        duration={2}
                        decimals={1}
                        suffix="%"
                      />
                    ) : (
                      <CountUp
                        end={value}
                        duration={2}
                        separator=","
                        suffix={suffix}
                      />
                    )}
                  </span>
                  {change && (
                    <Badge 
                      className={`${change > 0 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'}`}
                    >
                      {change > 0 ? '+' : ''}{change}%
                    </Badge>
                  )}
                </div>
              </div>
              <motion.div
                whileHover={{ rotate: 12, scale: 1.1 }}
                className="p-3 rounded-full bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300"
              >
                <Icon className="w-6 h-6 text-white" />
              </motion.div>
            </div>
          </CardContent>
          
          {/* Animated background effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
          />
        </Card>
      </motion.div>
    );
  };

  const HotLeadCard = ({ lead }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="group cursor-pointer"
    >
      <Card className="bg-gradient-to-br from-red-500/10 via-orange-500/10 to-yellow-500/10 border-red-500/30 backdrop-blur-xl hover:border-red-400/50 transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
              <Flame className="w-3 h-3 mr-1" />
              HOT
            </Badge>
            <span className="text-white/60 text-xs">95% Score</span>
          </div>
          <div className="space-y-2">
            <h4 className="text-white font-semibold">{lead.name}</h4>
            <p className="text-white/70 text-sm">{lead.company}</p>
            <p className="text-white/60 text-xs">{lead.location}</p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="text-emerald-300 text-sm font-medium">
              {lead.interested_project}
            </span>
            <Button size="sm" className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border-red-500/30">
              Contact
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const NotificationItem = ({ notification }) => {
    const priorityColors = {
      high: 'border-red-500/30 bg-red-500/10',
      medium: 'border-yellow-500/30 bg-yellow-500/10',
      low: 'border-blue-500/30 bg-blue-500/10'
    };

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`p-3 rounded-lg border backdrop-blur-sm ${priorityColors[notification.priority]}`}
      >
        <div className="flex items-start space-x-3">
          <div className="p-1 rounded-full bg-white/10">
            <Bell className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 space-y-1">
            <h4 className="text-white text-sm font-medium">{notification.title}</h4>
            <p className="text-white/70 text-xs">{notification.message}</p>
            <span className="text-white/50 text-xs">{notification.time}</span>
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full"
        />
      </div>
    );
  }

  const hotLeads = [
    { name: 'John Smith', company: 'TechCorp', location: 'Dubai', interested_project: 'AZIZI Riviera' },
    { name: 'Sarah Johnson', company: 'DataAI', location: 'London', interested_project: 'AZIZI Venice' },
    { name: 'Ahmed Ali', company: 'OilCo', location: 'Abu Dhabi', interested_project: 'AZIZI Beachfront' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'radial-gradient(600px circle at 20% 80%, rgba(102, 126, 234, 0.3), transparent)',
              'radial-gradient(600px circle at 80% 20%, rgba(118, 75, 162, 0.3), transparent)',
              'radial-gradient(600px circle at 40% 40%, rgba(102, 126, 234, 0.3), transparent)',
            ],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 p-6 border-b border-white/10 backdrop-blur-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center"
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-white">B&B Lead Hunter</h1>
              <p className="text-white/60 text-sm">
                Welcome back! 
                {authData?.access_level === 'demo' && (
                  <Badge className="ml-2 bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                    Demo Mode
                  </Badge>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
              <Search className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10 relative">
              <Bell className="w-4 h-4" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
              />
            </Button>
            <Button
              onClick={onLogout}
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10 backdrop-blur-xl">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/10 text-white/70 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="leads" className="data-[state=active]:bg-white/10 text-white/70 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              Leads
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-white/10 text-white/70 data-[state=active]:text-white">
              <Target className="w-4 h-4 mr-2" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-white/10 text-white/70 data-[state=active]:text-white">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="ai-chat" className="data-[state=active]:bg-white/10 text-white/70 data-[state=active]:text-white">
              <MessageSquare className="w-4 h-4 mr-2" />
              AI Assistant
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Main Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total Leads Provided"
                value={dashboardData?.total_leads_provided || 0}
                change={9}
                icon={Users}
                color="blue"
              />
              <MetricCard
                title="Hot Leads Generated"
                value={dashboardData?.hot_leads_generated || 0}
                change={23}
                icon={Flame}
                color="orange"
              />
              <MetricCard
                title="Deals Closed (AZIZI)"
                value={dashboardData?.deals_closed_azizi || 0}
                change={35}
                icon={Target}
                color="green"
              />
              <MetricCard
                title="Total Revenue"
                value={dashboardData?.total_revenue || 0}
                change={29}
                icon={DollarSign}
                format="currency"
                color="purple"
              />
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                title="Average Deal Size"
                value={dashboardData?.average_deal_size || 0}
                change={10}
                icon={Crown}
                format="currency"
                color="indigo"
              />
              <MetricCard
                title="Commission Received"
                value={dashboardData?.commission_received || 0}
                change={28}
                icon={Zap}
                format="currency"
                color="green"
              />
              <MetricCard
                title="Conversion Rate"
                value={dashboardData?.conversion_rate || 0}
                change={2.4}
                icon={Activity}
                format="percentage"
                color="blue"
              />
            </div>

            {/* Hot Leads & Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Hot Leads */}
              <Card className="bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Flame className="w-5 h-5 mr-2 text-red-400" />
                    Hot Leads Today
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {hotLeads.map((lead, index) => (
                    <HotLeadCard key={index} lead={lead} />
                  ))}
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card className="bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Bell className="w-5 h-5 mr-2 text-blue-400" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {notifications.map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="leads" className="space-y-6">
            <Card className="bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20">
              <CardContent className="p-8 text-center">
                <Users className="w-16 h-16 text-white/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Leads Management</h3>
                <p className="text-white/70 mb-6">Coming soon in the next update</p>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Leads
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <Card className="bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20">
              <CardContent className="p-8 text-center">
                <Target className="w-16 h-16 text-white/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Project Gallery</h3>
                <p className="text-white/70 mb-6">Manage AZIZI projects and uploads</p>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Project
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20">
              <CardContent className="p-8 text-center">
                <TrendingUp className="w-16 h-16 text-white/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Advanced Analytics</h3>
                <p className="text-white/70 mb-6">Month comparison and detailed insights</p>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-chat" className="space-y-6 h-[calc(100vh-12rem)]">
            <AIAssistantChat dashboardData={dashboardData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;