import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CopyableKeyCard } from './CopyableKeyCard'
import type { Field } from '../types'

// Mock useToast to avoid rendering UI and to assert calls
export const toastMock = vi.fn()
vi.mock('../hooks/use-toast', () => ({
  useToast: () => ({ toast: toastMock }),
}))

describe('<CopyableKeyCard />', () => {
  const fieldVisible: Field = { name: 'API Key', value: 'abcd-1234', masked: false }
  const fieldMasked: Field = { name: 'Secret', value: 's3cr3t', masked: true }

  beforeEach(() => {
    // @ts-expect-error - augment navigator for tests
    global.navigator.clipboard = {
      writeText: vi.fn().mockResolvedValue(undefined),
    }
  })

  it('shows masked bullets when masked=true', () => {
    render(<CopyableKeyCard field={fieldMasked} onToggleMask={vi.fn()} />)
    const text = screen.getByText(/•+/)
    expect(text.textContent?.length).toBe(Math.min(fieldMasked.value.length, 32))
  })

  it('shows actual value when masked=false', () => {
    render(<CopyableKeyCard field={fieldVisible} onToggleMask={vi.fn()} />)
    expect(screen.getByText(fieldVisible.value)).toBeInTheDocument()
  })

  it('calls onToggleMask when eye button clicked', () => {
    const onToggle = vi.fn()
    render(<CopyableKeyCard field={fieldMasked} onToggleMask={onToggle} />)
    const btn = screen.getByTitle(/show value/i)
    fireEvent.click(btn)
    expect(onToggle).toHaveBeenCalled()
  })

  it('copies to clipboard and toggles icon to check', async () => {
    render(<CopyableKeyCard field={fieldVisible} onToggleMask={vi.fn()} />)
    const copyBtn = screen.getByTitle(/copy to clipboard/i)
    fireEvent.click(copyBtn)
    await waitFor(() => {
      expect((navigator.clipboard.writeText as any)).toHaveBeenCalledWith(fieldVisible.value)
    })
  })

  it('shows destructive toast on copy failure', async () => {
    toastMock.mockReset()
    // Force failure
    // @ts-expect-error
    global.navigator.clipboard = { writeText: vi.fn().mockRejectedValue(new Error('fail')) }

    render(<CopyableKeyCard field={fieldVisible} onToggleMask={vi.fn()} />)
    fireEvent.click(screen.getByTitle(/copy to clipboard/i))
    await waitFor(() => {
      expect(toastMock).toHaveBeenCalled()
      const arg = toastMock.mock.calls[0][0]
      expect(arg.variant).toBe('destructive')
    })
  })
})
