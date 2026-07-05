import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useOfflineStatus } from './use-offline-status'
describe('useOfflineStatus', () => {
    beforeEach(() => {
        vi.restoreAllMocks()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('returns false when browser is online initially', () => {
        vi.spyOn(window.navigator, 'onLine', 'get').mockReturnValue(true)
        const { result } = renderHook(() => useOfflineStatus())
        expect(result.current).toBe(false)
    })
    it('returns true when browser is offline initially', () => {
        vi.spyOn(window.navigator, 'onLine', 'get').mockReturnValue(false)
        const { result } = renderHook(() => useOfflineStatus())
        expect(result.current).toBe(true)
    })
    it('updates to offline when offline event is dispatched', () => {
        vi.spyOn(window.navigator, 'onLine', 'get').mockReturnValue(true)
        const { result } = renderHook(() => useOfflineStatus())
        expect(result.current).toBe(false)
        act(() => {
            window.dispatchEvent(new Event('offline'))
        })
        expect(result.current).toBe(true)
    })
    it('updates to online when online event is dispatched', () => {
        vi.spyOn(window.navigator, 'onLine', 'get').mockReturnValue(false)
        const { result } = renderHook(() => useOfflineStatus())
        expect(result.current).toBe(true)
        act(() => {
            window.dispatchEvent(new Event('online'))
        })
        expect(result.current).toBe(false)
    })
    it('registers event listeners on mount', () => {
        const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
        renderHook(() => useOfflineStatus())
        expect(addEventListenerSpy).toHaveBeenCalledWith(
            'online',
            expect.any(Function)
        )
        expect(addEventListenerSpy).toHaveBeenCalledWith(
            'offline',
            expect.any(Function)
        )
    })
    it('removes event listeners on unmount', () => {
        const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
        const { unmount } = renderHook(() => useOfflineStatus())
        unmount()
        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            'online',
            expect.any(Function)
        )
        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            'offline',
            expect.any(Function)
        )
    })
})