import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { cn } from '@lib/utils'
import { scaleIn, backdropVariants } from '@admin-lib/adminAnimations'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning'
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/40 z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-sm bg-white rounded-2xl shadow-admin-modal overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Icon */}
                <div className={cn(
                  'w-12 h-12 rounded-2xl flex items-center justify-center mb-4',
                  variant === 'danger'  ? 'bg-red-50' : 'bg-amber-50'
                )}>
                  <AlertTriangle
                    size={22}
                    className={variant === 'danger' ? 'text-red-600' : 'text-amber-600'}
                  />
                </div>

                <h3 className="font-heading text-lg font-semibold text-gray-900 mb-1.5">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 px-6 pb-6">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  {cancelLabel}
                </button>
                <button
                  onClick={() => { onConfirm(); onClose() }}
                  className={cn(
                    'flex-1 py-2.5 text-sm font-semibold text-white rounded-xl transition-colors',
                    variant === 'danger'  ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-500 hover:bg-amber-600'
                  )}
                >
                  {confirmLabel}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
