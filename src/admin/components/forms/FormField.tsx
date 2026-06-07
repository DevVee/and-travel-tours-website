import { AlertCircle } from 'lucide-react'
import { cn } from '@lib/utils'

// ─── FormField ─────────────────────────────────────────────────────────────

interface FormFieldProps {
  label: string
  required?: boolean
  error?: string
  hint?: string
  children: React.ReactNode
  className?: string
}

export function FormField({ label, required, error, hint, children, className }: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="block text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-brand-orange ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-600">
          <AlertCircle size={11} />
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-xs text-gray-400">{hint}</p>
      )}
    </div>
  )
}

// ─── Input ────────────────────────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export function Input({ error, className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'w-full px-3.5 py-2.5 text-sm text-gray-900 bg-white border-2 rounded-xl',
        'placeholder:text-gray-400',
        'transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange',
        error
          ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-100'
          : 'border-gray-200 hover:border-gray-300',
        className
      )}
      {...props}
    />
  )
}

// ─── Textarea ─────────────────────────────────────────────────────────────

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export function Textarea({ error, className, ...props }: TextareaProps) {
  return (
    <textarea
      rows={4}
      className={cn(
        'w-full px-3.5 py-2.5 text-sm text-gray-900 bg-white border-2 rounded-xl resize-none',
        'placeholder:text-gray-400',
        'transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange',
        error
          ? 'border-red-400 bg-red-50'
          : 'border-gray-200 hover:border-gray-300',
        className
      )}
      {...props}
    />
  )
}

// ─── Select ───────────────────────────────────────────────────────────────

import { ChevronDown } from 'lucide-react'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean
  options: { label: string; value: string }[]
  placeholder?: string
}

export function Select({ error, options, placeholder, className, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        className={cn(
          'w-full appearance-none px-3.5 py-2.5 pr-10 text-sm text-gray-900 bg-white border-2 rounded-xl',
          'transition-colors duration-200 cursor-pointer',
          'focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange',
          error
            ? 'border-red-400 bg-red-50'
            : 'border-gray-200 hover:border-gray-300',
          className
        )}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  )
}

// ─── PriceInput ───────────────────────────────────────────────────────────

interface PriceInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: number | string
  onChange: (value: number) => void
  error?: boolean
}

export function PriceInput({ value, onChange, error, className, ...props }: PriceInputProps) {
  return (
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500">₱</span>
      <input
        type="number"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className={cn(
          'w-full pl-8 pr-3.5 py-2.5 text-sm text-gray-900 bg-white border-2 rounded-xl',
          'transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange',
          error
            ? 'border-red-400 bg-red-50'
            : 'border-gray-200 hover:border-gray-300',
          className
        )}
        {...props}
      />
    </div>
  )
}

// ─── DateRangePicker ──────────────────────────────────────────────────────

interface DateRangePickerProps {
  fromValue?: string
  toValue?: string
  onFromChange?: (v: string) => void
  onToChange?: (v: string) => void
  error?: boolean
}

export function DateRangePicker({ fromValue, toValue, onFromChange, onToChange, error }: DateRangePickerProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-xs text-gray-500 mb-1">From</label>
        <Input
          type="date"
          value={fromValue}
          onChange={e => onFromChange?.(e.target.value)}
          error={error}
        />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">To</label>
        <Input
          type="date"
          value={toValue}
          onChange={e => onToChange?.(e.target.value)}
          min={fromValue}
          error={error}
        />
      </div>
    </div>
  )
}

// ─── TagInput ─────────────────────────────────────────────────────────────

import { X } from 'lucide-react'

interface TagInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
}

export function TagInput({ tags, onChange, placeholder = 'Add tag…' }: TagInputProps) {
  const [input, setInput] = useState('')

  const addTag = () => {
    const trimmed = input.trim()
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed])
    }
    setInput('')
  }

  return (
    <div className="flex flex-wrap gap-2 p-2.5 border-2 border-gray-200 rounded-xl min-h-[44px] focus-within:border-brand-orange focus-within:ring-2 focus-within:ring-brand-orange/20">
      {tags.map(tag => (
        <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-50 text-brand-orange text-xs font-semibold rounded-full">
          {tag}
          <button onClick={() => onChange(tags.filter(t => t !== tag))} className="hover:text-orange-700">
            <X size={10} />
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => (e.key === 'Enter' || e.key === ',') && (e.preventDefault(), addTag())}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[100px] text-sm outline-none bg-transparent placeholder:text-gray-400"
      />
    </div>
  )
}

import { useState } from 'react'
