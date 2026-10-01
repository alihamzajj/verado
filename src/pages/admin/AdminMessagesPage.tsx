import React, { useState } from 'react';
import { 
  MessageSquare, 
  Mail, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Search, 
  ExternalLink, 
  Sparkles, 
  User, 
  ChevronRight,
  Send,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ContactInquiry } from '../../types';
import { Modal } from '../../components/common/Modal';
import { getInitialsAvatar } from '../../lib/avatar';

export const AdminMessagesPage: React.FC = () => {
  const { 
    inquiries, 
    unreadInquiriesCount, 
    markInquiryAsRead, 
    deleteInquiry 
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);
  const [inquiryToDelete, setInquiryToDelete] = useState<ContactInquiry | null>(null);

  const handleOpenInquiry = (inquiry: ContactInquiry) => {
    setSelectedInquiry(inquiry);
    if (!inquiry.isRead) {
      markInquiryAsRead(inquiry.id);
    }
  };

  const filteredInquiries = inquiries.filter((item) => {
    if (filter === 'unread' && item.isRead) return false;
    if (filter === 'read' && !item.isRead) return false;
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query) ||
      (item.subject && item.subject.toLowerCase().includes(query)) ||
      item.message.toLowerCase().includes(query)
    );
  });

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-violet-400 mb-1">
            <span>&#125;</span>
            <MessageSquare className="w-3.5 h-3.5 text-violet-400" />
            <span>Customer Inquiries & Feedback</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span>Client Messages</span>
            {unreadInquiriesCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-violet-600 text-white shadow-lg shadow-violet-600/40">
                {unreadInquiriesCount} New
              </span>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            Incoming inquiries, partner collaborations, and app feedback sent from your public contact page.
          </p>
        </div>

        {/* Action / Search bar */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search sender, email, topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-full bg-[#16151B] border border-white/10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-violet-400 w-52 sm:w-64 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
            filter === 'all'
              ? 'bg-violet-600 text-white font-bold shadow-md shadow-violet-600/30'
              : 'bg-[#16151B] text-white/60 hover:text-white border border-white/10'
          }`}
        >
          All ({inquiries.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
            filter === 'unread'
              ? 'bg-violet-600 text-white font-bold shadow-md shadow-violet-600/30'
              : 'bg-[#16151B] text-white/60 hover:text-white border border-white/10'
          }`}
        >
          <span>Unread</span>
          {unreadInquiriesCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          )}
          <span>({unreadInquiriesCount})</span>
        </button>
        <button
          onClick={() => setFilter('read')}
          className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
            filter === 'read'
              ? 'bg-violet-600 text-white font-bold shadow-md shadow-violet-600/30'
              : 'bg-[#16151B] text-white/60 hover:text-white border border-white/10'
          }`}
        >
          Read ({inquiries.filter(i => i.isRead).length})
        </button>
      </div>

      {/* Messages List */}
      <div className="rounded-[32px] bg-[#0F0E11] border border-white/10 overflow-hidden shadow-2xl">
        {filteredInquiries.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-white/40">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">No messages found</h3>
            <p className="text-xs text-white/50 max-w-sm mx-auto">
              {searchQuery ? 'No inquiries matching your search query.' : 'No messages in this folder yet. Inquiries submitted on the contact page will appear here.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredInquiries.map((inquiry) => {
              return (
                <div
                  key={inquiry.id}
                  onClick={() => handleOpenInquiry(inquiry)}
                  className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors cursor-pointer ${
                    !inquiry.isRead ? 'bg-violet-500/[0.07]' : ''
                  }`}
                >
                  {/* Sender & Subject info */}
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                    <img
                      src={getInitialsAvatar(inquiry.name)}
                      alt={inquiry.name}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/10 shrink-0"
                    />
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs sm:text-sm truncate">
                          {inquiry.name}
                        </span>
                        {!inquiry.isRead && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-violet-500/20 text-violet-300 border border-violet-500/30 shrink-0 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                            <span>New</span>
                          </span>
                        )}
                        <span className="text-[11px] font-mono text-white/40 truncate">
                          &lt;{inquiry.email}&gt;
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-semibold text-white/90 truncate">
                          {inquiry.subject || 'General Inquiry'}
                        </span>
                        <span className="text-white/30 hidden sm:inline">•</span>
                        <p className="text-white/50 truncate max-w-md hidden sm:block text-[11px]">
                          {inquiry.message}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Date & Actions */}
                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    <span className="text-[11px] font-mono text-white/40">
                      {new Date(inquiry.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setInquiryToDelete(inquiry);
                      }}
                      className="p-2 rounded-full bg-[#16151B] hover:bg-rose-500/20 text-white/50 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 transition-colors"
                      title="Delete message"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <ChevronRight className="w-4 h-4 text-white/30" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      {selectedInquiry && (
        <Modal
          isOpen={Boolean(selectedInquiry)}
          onClose={() => setSelectedInquiry(null)}
          title={selectedInquiry.subject || 'Customer Inquiry'}
          subtitle={`From ${selectedInquiry.name} • ${new Date(selectedInquiry.createdAt).toLocaleString()}`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-5 pt-2">
            
            {/* Sender Card */}
            <div className="p-4 rounded-2xl bg-[#16151B] border border-white/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={getInitialsAvatar(selectedInquiry.name)}
                  alt={selectedInquiry.name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-violet-500/40 shrink-0"
                />
                <div>
                  <span className="text-sm font-bold text-white block">{selectedInquiry.name}</span>
                  <a 
                    href={`mailto:${selectedInquiry.email}`}
                    className="text-xs text-violet-400 hover:text-violet-300 font-mono transition-colors"
                  >
                    {selectedInquiry.email}
                  </a>
                </div>
              </div>

              <div className="text-right">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-violet-500/10 text-violet-300 border border-violet-500/20">
                  {selectedInquiry.category || 'Inquiry'}
                </span>
              </div>
            </div>

            {/* Message Body */}
            <div className="space-y-2">
              <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-white/50">
                Message Content
              </label>
              <div className="p-4 rounded-2xl bg-[#0F0E11] border border-white/10 text-xs sm:text-sm text-white/90 leading-relaxed whitespace-pre-wrap">
                {selectedInquiry.message}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  if (selectedInquiry) {
                    setInquiryToDelete(selectedInquiry);
                    setSelectedInquiry(null);
                  }
                }}
                className="px-4 py-2 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedInquiry(null)}
                  className="px-5 py-2.5 rounded-full bg-[#16151B] hover:bg-black border border-white/10 text-white/80 hover:text-white text-xs font-mono uppercase tracking-wider cursor-pointer"
                >
                  Close
                </button>
                <a
                  href={`mailto:${selectedInquiry.email}?subject=Re: ${encodeURIComponent(selectedInquiry.subject || 'Your Inquiry to Verado')}`}
                  className="px-6 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs uppercase tracking-wider font-bold shadow-xl shadow-violet-600/30 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>

          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {inquiryToDelete && (
        <Modal
          isOpen={Boolean(inquiryToDelete)}
          onClose={() => setInquiryToDelete(null)}
          title="Delete Inquiry?"
          maxWidth="max-w-md"
        >
          <div className="space-y-4 pt-2">
            <p className="text-xs text-white/70 leading-relaxed">
              Are you sure you want to permanently delete this message from <strong className="text-white">{inquiryToDelete.name}</strong>?
            </p>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setInquiryToDelete(null)}
                className="px-4 py-2 rounded-full bg-[#16151B] hover:bg-black border border-white/10 text-white text-xs font-mono uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteInquiry(inquiryToDelete.id);
                  setInquiryToDelete(null);
                }}
                className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono uppercase tracking-wider font-bold transition-all cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
