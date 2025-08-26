import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  Mic, 
  Download,
  BarChart3,
  Target,
  Users,
  TrendingUp,
  Brain,
  Zap,
  Clock,
  CheckCircle
} from 'lucide-react';

const AIAssistantChat = ({ dashboardData }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Initial welcome message
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm your B&B Lead Hunter AI Assistant. 🚀

I have access to all your current data:
• ${dashboardData?.total_leads_provided || 0} total leads this month
• ${dashboardData?.hot_leads_generated || 0} hot leads generated
• ${dashboardData?.deals_closed_azizi || 0} deals closed with AZIZI
• ${dashboardData?.total_revenue ? `${Math.round(dashboardData.total_revenue/1000)}K AED` : '0'} in revenue

How can I help you today? Ask me about lead analysis, market insights, or optimization strategies!`,
      timestamp: new Date().toISOString()
    }]);
  }, [dashboardData]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const quickPrompts = [
    { text: "📊 Analyze this month's performance", icon: BarChart3 },
    { text: "🎯 Which leads should I prioritize today?", icon: Target },
    { text: "🏢 Best AZIZI project for tech CEOs?", icon: Users },
    { text: "📈 How to improve conversion rate?", icon: TrendingUp },
    { text: "🌍 Which market is most profitable?", icon: TrendingUp },
    { text: "💰 Commission forecast for next month?", icon: TrendingUp }
  ];

  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: messageText,
          session_id: sessionId,
          context: dashboardData
        }),
      });

      const data = await response.json();
      
      const assistantMessage = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: data.response,
        timestamp: data.timestamp,
        model: data.model
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI Chat error:', error);
      const errorMessage = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: "I'm experiencing some technical difficulties. Please try again in a moment. 🔧",
        timestamp: new Date().toISOString(),
        error: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const TypingIndicator = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center space-x-2 p-4"
    >
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
        <Brain className="w-4 h-4 text-white" />
      </div>
      <div className="flex space-x-1">
        <motion.div
          className="w-2 h-2 bg-white/60 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0 }}
        />
        <motion.div
          className="w-2 h-2 bg-white/60 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
        />
        <motion.div
          className="w-2 h-2 bg-white/60 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
        />
      </div>
      <span className="text-white/70 text-sm">AI is thinking...</span>
    </motion.div>
  );

  const MessageBubble = ({ message }) => {
    const isUser = message.role === 'user';
    const isError = message.error;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`flex items-start space-x-3 max-w-[80%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isUser 
              ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
              : isError 
                ? 'bg-red-500/20' 
                : 'bg-gradient-to-r from-emerald-500 to-teal-600'
          }`}>
            {isUser ? (
              <Users className="w-4 h-4 text-white" />
            ) : isError ? (
              <Zap className="w-4 h-4 text-red-400" />
            ) : (
              <Brain className="w-4 h-4 text-white" />
            )}
          </div>
          
          <div className={`p-4 rounded-2xl backdrop-blur-xl border ${
            isUser
              ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30 text-white'
              : isError
                ? 'bg-red-500/10 border-red-500/30 text-red-300'
                : 'bg-gradient-to-r from-white/10 to-white/5 border-white/20 text-white'
          }`}>
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {message.content}
            </div>
            
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10">
              <span className="text-xs text-white/50">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
              {message.model && (
                <Badge className="bg-white/10 text-white/70 border-white/20 text-xs">
                  {message.model}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const QuickPromptButton = ({ prompt }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => handleSendMessage(prompt.text)}
      className="flex items-center space-x-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 text-left"
    >
      <prompt.icon className="w-4 h-4 text-blue-400 flex-shrink-0" />
      <span className="text-white/80 text-sm">{prompt.text}</span>
    </motion.button>
  );

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="p-6 border-b border-white/10 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center"
            >
              <Brain className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h2 className="text-xl font-bold text-white">AI Assistant</h2>
              <p className="text-white/60 text-sm">Your intelligent lead analysis companion</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
              <CheckCircle className="w-3 h-3 mr-1" />
              Online
            </Badge>
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Context Panel */}
      <div className="p-4 bg-white/5 border-b border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-white/80 text-sm">{dashboardData?.total_leads_provided || 0} leads</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-red-400" />
            <span className="text-white/80 text-sm">{dashboardData?.hot_leads_generated || 0} hot leads</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-white/80 text-sm">{dashboardData?.deals_closed_azizi || 0} deals</span>
          </div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-purple-400" />
            <span className="text-white/80 text-sm">{dashboardData?.conversion_rate || 0}% conversion</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 px-6 py-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Quick Prompts */}
          {messages.length <= 1 && (
            <div className="p-4 border-t border-white/10">
              <h3 className="text-white/80 text-sm font-medium mb-3">Quick Start:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {quickPrompts.map((prompt, index) => (
                  <QuickPromptButton key={index} prompt={prompt} />
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-6 border-t border-white/10 backdrop-blur-xl">
            <div className="flex items-end space-x-4">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your leads, deals, or strategies..."
                  className="pr-12 bg-white/5 border-white/20 text-white placeholder-white/50 focus:border-blue-500/50 resize-none"
                  disabled={isTyping}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80"
                >
                  <Mic className="w-4 h-4" />
                </Button>
              </div>
              
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            <p className="text-white/40 text-xs mt-2 text-center">
              AI can analyze your data and provide insights • Press Enter to send
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantChat;