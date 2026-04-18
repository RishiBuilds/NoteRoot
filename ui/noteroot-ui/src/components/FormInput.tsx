import { Input } from '@/components/ui/input'

type Props = {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  error?: string
  placeholder?: string
  required?: boolean
  autoFocus?: boolean
  disabled?: boolean
}

export default function FormInput({
  id,
  label,
  value,
  onChange,
  type = 'text',
  error,
  placeholder,
  required,
  autoFocus,
  disabled,
}: Props) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-heading text-foreground">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        autoFocus={autoFocus}
        disabled={disabled}
        className={error ? 'border-red-500' : ''}
      />
      {error && <p className="text-xs text-red-500 font-base">{error}</p>}
    </div>
  )
}
