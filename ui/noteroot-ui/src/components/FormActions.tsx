import { Button } from '@/components/ui/button'

type Props = {
  onCancel: () => void
  onSubmit?: () => void
  submitLabel?: string
  cancelLabel?: string
  loading?: boolean
  disabled?: boolean
}

export default function FormActions({
  onCancel,
  onSubmit,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  loading = false,
  disabled = false,
}: Props) {
  return (
    <div className="flex justify-end gap-2 pt-4">
      <Button variant="neutral" type="button" onClick={onCancel}>
        {cancelLabel}
      </Button>
      <Button
        type={onSubmit ? 'button' : 'submit'}
        onClick={onSubmit}
        disabled={loading || disabled}
      >
        {loading ? 'Saving...' : submitLabel}
      </Button>
    </div>
  )
}
