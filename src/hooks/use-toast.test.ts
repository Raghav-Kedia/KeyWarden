import { describe, it, expect, vi, beforeEach } from 'vitest'
import { reducer } from './use-toast'

describe('use-toast reducer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('adds a toast and respects limit', () => {
    const state = { toasts: [] as any[] }
    const t1 = { id: '1', title: 'Hello', open: true }
    const t2 = { id: '2', title: 'World', open: true }

    const s1 = reducer(state, { type: 'ADD_TOAST', toast: t1 })
    expect(s1.toasts).toHaveLength(1)
    expect(s1.toasts[0]).toMatchObject(t1)

    const s2 = reducer(s1, { type: 'ADD_TOAST', toast: t2 })
    // TOAST_LIMIT is 1, so new toast replaces the list head
    expect(s2.toasts).toHaveLength(1)
    expect(s2.toasts[0]).toMatchObject(t2)
  })

  it('updates a toast by id', () => {
    const base = { toasts: [{ id: '1', title: 'A', open: true }] as any[] }
    const s = reducer(base, { type: 'UPDATE_TOAST', toast: { id: '1', title: 'B' } })
    expect(s.toasts[0].title).toBe('B')
  })

  it('dismisses a single toast and marks as closed', () => {
    const base = { toasts: [{ id: '1', title: 'A', open: true }] as any[] }
    const s = reducer(base, { type: 'DISMISS_TOAST', toastId: '1' })
    expect(s.toasts[0].open).toBe(false)
  })

  it('removes toast(s)', () => {
    const base = { toasts: [{ id: '1', title: 'A', open: true }] as any[] }
    const s1 = reducer(base, { type: 'REMOVE_TOAST', toastId: '1' })
    expect(s1.toasts).toHaveLength(0)

    const s2 = reducer({ toasts: [{ id: 'x' }] as any[] }, { type: 'REMOVE_TOAST' })
    expect(s2.toasts).toHaveLength(0)
  })
})
