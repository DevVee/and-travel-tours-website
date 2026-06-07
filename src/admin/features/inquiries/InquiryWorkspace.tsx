import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, MessageSquare, User, Calendar, Plane, DollarSign,
  FileText, UserCheck, ChevronDown, Clock, Send,
  Globe, Phone, Mail, Users,
} from 'lucide-react'
import { pageVariants, slideInRight } from '@admin-lib/adminAnimations'
import { StatusBadge } from '@admin-ui/StatusBadge'
import { ActivityFeed } from '@admin-ui/ActivityFeed'
import { AdminCard } from '@admin-ui/AdminCard'
import { MOCK_INQUIRIES } from '@admin-data/mockInquiries'
import { INQUIRY_STATUS_STYLES } from '@admin-lib/statusColors'
import type { InquiryStatus } from '@admin-types/index'
import { formatDate, formatPeso, daysSince } from '@admin-lib/formatters'
import { cn } from '@lib/utils'

// ─── Status Journey Tracker ───────────────────────────────────────────────

const STATUS_JOURNEY: InquiryStatus[] = ['new', 'discussion', 'quoted', 'converted']

function StatusJourney({ current }: { current: InquiryStatus }) {
  const isArchived = current === 'archived'
  const currentIdx = STATUS_JOURNEY.indexOf(current)

  return (
    <div className="flex items-center gap-0">
      {STATUS_JOURNEY.map((status, idx) => {
        const style   = INQUIRY_STATUS_STYLES[status]
        const isActive  = idx <= currentIdx && !isArchived
        const isCurrent = status === current && !isArchived

        return (
          <div key={status} className="flex items-center">
            {/* Step */}
            <div className="flex flex-col items-center">
              <div className={cn(
                'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300',
                isCurrent ? `${style.bg} border-current ${style.text}` :
                isActive   ? 'bg-green-500 border-green-500' :
                             'bg-white border-gray-200'
              )}>
                {isActive && !isCurrent
                  ? <div className="w-2 h-2 rounded-full bg-white" />
                  : isCurrent
                    ? <div className={`w-2 h-2 rounded-full ${style.dot}`} />
                    : <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                }
              </div>
              <span className={cn(
                'text-[10px] font-semibold mt-1 whitespace-nowrap',
                isCurrent ? style.text : isActive ? 'text-green-600' : 'text-gray-400'
              )}>
                {style.label}
              </span>
            </div>
            {/* Connector */}
            {idx < STATUS_JOURNEY.length - 1 && (
              <div className={cn(
                'h-0.5 w-12 sm:w-20 mx-1 mb-4 rounded transition-colors duration-300',
                idx < currentIdx && !isArchived ? 'bg-green-400' : 'bg-gray-200'
              )} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Inquiry Workspace ────────────────────────────────────────────────────

interface InquiryWorkspaceProps {
  mode?: 'new'
}

export function InquiryWorkspace({ mode }: InquiryWorkspaceProps) {
  const { id } = useParams()
  const inquiry = MOCK_INQUIRIES.find(i => i.id === id)
  const [noteText, setNoteText] = useState('')
  const [showStatusMenu, setShowStatusMenu] = useState(false)

  if (mode === 'new') {
    return (
      <motion.div variants={pageVariants} initial="hidden" animate="visible" className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/admin/inquiries" className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
            <ArrowLeft size={16} className="text-gray-600" />
          </Link>
          <h1 className="font-heading text-xl font-bold text-gray-900">New Inquiry</h1>
        </div>
        <AdminCard className="max-w-2xl">
          <p className="text-gray-500 text-sm">Manual inquiry entry form would go here.</p>
        </AdminCard>
      </motion.div>
    )
  }

  if (!inquiry) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Inquiry not found.</p>
      </div>
    )
  }

  const sinceCreated = daysSince(inquiry.createdAt)

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="flex flex-col h-full">
      {/* Top bar */}
      <div className="px-6 py-4 border-b border-gray-100 bg-white flex-shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <Link to="/admin/inquiries" className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
            <ArrowLeft size={16} className="text-gray-600" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-gray-500">{inquiry.id}</span>
            <StatusBadge status={inquiry.status} type="inquiry" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/admin/quotations/new"
              className="flex items-center gap-2 px-3 py-2 bg-brand-orange text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-colors shadow-orange"
            >
              <FileText size={14} />
              Create Quote
            </Link>
          </div>
        </div>

        {/* Status journey */}
        <StatusJourney current={inquiry.status} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 h-full">
          {/* Left panel — details (60%) */}
          <div className="lg:col-span-3 border-r border-gray-100 p-6 space-y-6">
            {/* Customer Info */}
            <AdminCard>
              <h3 className="font-heading text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Customer Information</h3>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-sm">
                  <User size={15} className="text-gray-400 flex-shrink-0" />
                  <span className="font-semibold text-gray-900">{inquiry.customerName}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm">
                  <Mail size={15} className="text-gray-400 flex-shrink-0" />
                  <a href={`mailto:${inquiry.customerEmail}`} className="text-brand-orange hover:underline">{inquiry.customerEmail}</a>
                </div>
                <div className="flex items-center gap-2.5 text-sm">
                  <Phone size={15} className="text-gray-400 flex-shrink-0" />
                  <span className="text-gray-700">{inquiry.customerPhone}</span>
                </div>
              </div>
            </AdminCard>

            {/* Trip Details */}
            <AdminCard>
              <h3 className="font-heading text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Trip Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Destination</p>
                  <div className="flex items-center gap-1.5">
                    <Plane size={13} className="text-brand-orange" />
                    <span className="text-sm font-semibold text-gray-900">{inquiry.destination}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Travel Dates</p>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-brand-orange" />
                    <span className="text-sm font-semibold text-gray-900">
                      {inquiry.travelDateFrom ? formatDate(inquiry.travelDateFrom) : 'TBD'}
                      {inquiry.travelDateTo ? ` – ${formatDate(inquiry.travelDateTo)}` : ''}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Passengers</p>
                  <div className="flex items-center gap-1.5">
                    <Users size={13} className="text-brand-orange" />
                    <span className="text-sm font-semibold text-gray-900">
                      {inquiry.paxAdults} adults{inquiry.paxChildren > 0 ? `, ${inquiry.paxChildren} children` : ''}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Budget</p>
                  <div className="flex items-center gap-1.5">
                    <DollarSign size={13} className="text-brand-orange" />
                    <span className="text-sm font-semibold text-gray-900">
                      {inquiry.budgetMin && inquiry.budgetMax
                        ? `${formatPeso(inquiry.budgetMin)} – ${formatPeso(inquiry.budgetMax)}`
                        : 'Not specified'}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Source</p>
                  <div className="flex items-center gap-1.5">
                    <Globe size={13} className="text-brand-orange" />
                    <span className="text-sm font-semibold text-gray-900 capitalize">{inquiry.source.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>
            </AdminCard>

            {/* Message */}
            <AdminCard>
              <h3 className="font-heading text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Inquiry Message</h3>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{inquiry.message}</p>
            </AdminCard>

            {/* Activity Timeline */}
            <div>
              <h3 className="font-heading text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Activity Timeline</h3>
              <ActivityFeed activities={inquiry.activity} />

              {/* Add note */}
              <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden">
                <textarea
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  placeholder="Add a note about this inquiry…"
                  rows={3}
                  className="w-full px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 resize-none outline-none"
                />
                <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-200">
                  <span className="text-xs text-gray-400">{noteText.length} characters</span>
                  <button
                    disabled={!noteText.trim()}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-orange text-white text-xs font-semibold rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send size={11} />
                    Add Note
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel — actions (40%) */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 p-6 space-y-5"
          >
            {/* Actions */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</h3>

              {/* Update Status */}
              <div className="relative">
                <button
                  onClick={() => setShowStatusMenu(s => !s)}
                  className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${INQUIRY_STATUS_STYLES[inquiry.status].dot}`} />
                    Update Status
                  </div>
                  <ChevronDown size={15} className="text-gray-400" />
                </button>
                <AnimatePresence>
                  {showStatusMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-100 shadow-admin-modal z-10 overflow-hidden py-1"
                    >
                      {(['new', 'discussion', 'quoted', 'converted', 'archived'] as InquiryStatus[]).map(s => {
                        const style = INQUIRY_STATUS_STYLES[s]
                        return (
                          <button
                            key={s}
                            onClick={() => setShowStatusMenu(false)}
                            className={cn(
                              'w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors',
                              inquiry.status === s && `${style.bg} ${style.text}`
                            )}
                          >
                            <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                            {style.label}
                          </button>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button className="w-full flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors">
                <UserCheck size={15} className="text-violet-600" />
                Assign Consultant
              </button>

              <Link
                to="/admin/quotations/new"
                className="w-full flex items-center gap-2 px-4 py-3 bg-brand-orange text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors shadow-orange"
              >
                <FileText size={15} />
                Create Quotation
              </Link>
            </div>

            {/* Assigned To */}
            <AdminCard>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Assigned To</h3>
              {inquiry.assignedConsultantName ? (
                <div className="flex items-center gap-2.5">
                  {inquiry.assignedConsultantAvatar ? (
                    <img src={inquiry.assignedConsultantAvatar} alt="" className="w-9 h-9 rounded-full object-cover ring-2 ring-brand-orange/20" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center">
                      <User size={16} className="text-brand-orange" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{inquiry.assignedConsultantName}</p>
                    <p className="text-xs text-gray-500">Travel Consultant</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">Not assigned yet</p>
              )}
            </AdminCard>

            {/* Quick Info */}
            <AdminCard>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Info</h3>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock size={12} />
                    Days since inquiry
                  </div>
                  <span className={cn('text-xs font-bold', sinceCreated > 3 ? 'text-red-600' : 'text-green-600')}>
                    {sinceCreated}d
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Globe size={12} />
                    Source
                  </div>
                  <span className="text-xs font-semibold text-gray-700 capitalize">{inquiry.source.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <MessageSquare size={12} />
                    Notes
                  </div>
                  <span className="text-xs font-semibold text-gray-700">{inquiry.notes.length}</span>
                </div>
              </div>
            </AdminCard>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
