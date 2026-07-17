"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import { Mail, Search, Clock, Trash2, Archive, CheckCircle, Download } from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'archived' | 'deleted' | 'replied';
  created_at: string;
}

export default function InboxPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'archived' | 'deleted'>('all');
  const [searchQuery, setSearchQuery] = useState("");
  
  const supabase = createClient();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setMessages(data as Message[]);
    setIsLoading(false);
  };

  const updateMessageStatus = async (id: string, newStatus: string) => {
    await supabase.from('messages').update({ status: newStatus }).eq('id', id);
    setMessages(messages.map(m => m.id === id ? { ...m, status: newStatus as Message['status'] } : m));
    if (selectedMessage?.id === id) {
      setSelectedMessage({ ...selectedMessage, status: newStatus as Message['status'] });
    }
  };

  const filteredMessages = useMemo(() => {
    return messages.filter(msg => {
      const matchesFilter = filter === 'all' ? msg.status !== 'deleted' : msg.status === filter;
      const matchesSearch = 
        msg.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [messages, filter, searchQuery]);

  const exportCSV = () => {
    const headers = ["Date", "Name", "Email", "Company", "Phone", "Subject", "Status", "Message"];
    const csvContent = [
      headers.join(","),
      ...filteredMessages.map(m => 
        `"${m.created_at}","${m.name}","${m.email}","${m.company || ''}","${m.phone || ''}","${m.subject}","${m.status}","${m.message.replace(/"/g, '""')}"`
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `messages_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-full flex flex-col p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Inbox</h1>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md transition-colors text-sm font-medium">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        {['all', 'unread', 'read', 'archived', 'deleted'].map((f) => (
          <button 
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        <div className="w-1/3 bg-zinc-950 rounded-xl border border-zinc-800 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-zinc-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages..." 
                className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-zinc-500 text-sm">Loading...</div>
            ) : filteredMessages.length === 0 ? (
              <div className="p-4 text-center text-zinc-500 text-sm">No messages found.</div>
            ) : (
              <ul className="divide-y divide-zinc-800">
                {filteredMessages.map(msg => (
                  <li 
                    key={msg.id} 
                    onClick={() => { setSelectedMessage(msg); if (msg.status === 'unread') updateMessageStatus(msg.id, 'read'); }}
                    className={`p-4 cursor-pointer transition-colors ${selectedMessage?.id === msg.id ? 'bg-zinc-800' : 'hover:bg-zinc-900'}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-sm font-medium ${msg.status === 'unread' ? 'text-white' : 'text-zinc-400'}`}>
                        {msg.name}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {new Date(msg.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className={`text-sm mb-1 truncate ${msg.status === 'unread' ? 'text-zinc-200' : 'text-zinc-500'}`}>
                      {msg.subject}
                    </p>
                    <p className="text-xs text-zinc-500 truncate">{msg.message}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="w-2/3 bg-zinc-950 rounded-xl border border-zinc-800 shadow-sm p-8 flex flex-col overflow-y-auto relative">
          {selectedMessage ? (
            <div className="space-y-6 max-w-3xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedMessage.subject}</h2>
                  <div className="flex items-center space-x-4 text-sm text-zinc-400 mb-2">
                    <div className="flex items-center text-white">
                      <Mail className="w-4 h-4 mr-2 text-zinc-500" />
                      {selectedMessage.name} &lt;{selectedMessage.email}&gt;
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-zinc-500" />
                      {new Date(selectedMessage.created_at).toLocaleString()}
                    </div>
                  </div>
                  {(selectedMessage.company || selectedMessage.phone) && (
                    <div className="flex items-center space-x-4 text-sm text-zinc-400">
                      {selectedMessage.company && <span>Company: {selectedMessage.company}</span>}
                      {selectedMessage.phone && <span>Phone: {selectedMessage.phone}</span>}
                    </div>
                  )}
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button onClick={() => updateMessageStatus(selectedMessage.id, selectedMessage.status === 'unread' ? 'read' : 'unread')} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md" title="Toggle Read">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button onClick={() => updateMessageStatus(selectedMessage.id, 'archived')} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md" title="Archive">
                    <Archive className="w-4 h-4" />
                  </button>
                  <button onClick={() => updateMessageStatus(selectedMessage.id, 'deleted')} className="p-2 text-red-500/70 hover:text-red-500 hover:bg-zinc-800 rounded-md" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="w-full h-px bg-zinc-800"></div>
              <div className="prose prose-invert prose-zinc max-w-none">
                <p className="whitespace-pre-wrap leading-relaxed">{selectedMessage.message}</p>
              </div>
              <div className="pt-8">
                <a 
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                  onClick={() => updateMessageStatus(selectedMessage.id, 'replied')}
                  className="inline-flex items-center px-4 py-2 bg-white text-black hover:bg-zinc-200 rounded-md transition-colors shadow-sm font-medium"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-500">
              <Mail className="w-16 h-16 mb-4 opacity-20" />
              <p>Select a message to read.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
