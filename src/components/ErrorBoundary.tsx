import { Component, type ReactNode } from 'react'
import { Phone, Mail } from 'lucide-react'
import { CONTACT } from '@data/contact'

interface Props    { children: ReactNode }
interface State    { hasError: boolean; message: string }

/**
 * Top-level error boundary.
 * Catches any unhandled React render errors and shows a friendly fallback
 * so users can still contact the business even if the page fails.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    // In production you'd send this to an error-reporting service (e.g. Sentry)
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-6">✈️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Something went wrong
          </h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            We hit a turbulence patch — sorry about that! Please refresh the page.
            If the problem persists, reach us directly:
          </p>
          <div className="flex flex-col gap-3 items-center">
            <a
              href={CONTACT.phoneTel}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-orange text-white font-semibold rounded-full hover:bg-orange-600 transition-colors"
              style={{ backgroundColor: '#F97316' }}
            >
              <Phone size={16} /> {CONTACT.phoneFormatted}
            </a>
            <a
              href={CONTACT.emailHref}
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:border-gray-400 transition-colors"
            >
              <Mail size={16} /> {CONTACT.email}
            </a>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 text-sm text-gray-400 underline hover:text-gray-600"
          >
            Try refreshing the page
          </button>
        </div>
      </div>
    )
  }
}
