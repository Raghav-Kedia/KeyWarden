import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('deduplicates conflicting Tailwind classes (last one wins)', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
    expect(cn('px-2', 'px-4', 'px-1')).toBe('px-1')
  })

  it('handles conditional values and arrays', () => {
    const active = true
    const extra = ['m-2', { hidden: false }]
    expect(cn('base', active && 'active', extra)).toContain('base')
    expect(cn('base', active && 'active', extra)).toContain('active')
    expect(cn('base', active && 'active', extra)).toContain('m-2')
    expect(cn('base', active && 'active', extra)).not.toContain('hidden')
  })

  it('ignores null/undefined/falsey inputs', () => {
    expect(cn('a', null as any, undefined as any, false as any, (0 && 'x') as any)).toBe('a')
  })
})
