"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface SearchHistoryState {
  keywords: string[]
  addKeyword: (text: string) => void
  removeKeyword: (text: string) => void
  clearAll: () => void
}

export const useHistory = create<SearchHistoryState>()(
  persist(
    (set) => ({
      keywords: [],

      addKeyword: (text: string) => {
        if (!text.trim()) return

        set((state) => {
          // 이미 있으면 지우고 맨 앞으로 보냄 (최신순)
          const filtered = state.keywords.filter((k) => k !== text)
          const next = [text, ...filtered].slice(0, 10) // 최대 10개만 저장
          return { keywords: next }
        })
      },

      removeKeyword: (text: string) => {
        set((state) => {
          const next = state.keywords.filter((k) => k !== text)
          return { keywords: next }
        })
      },

      clearAll: () => {
        set({ keywords: [] })
      },
    }),
    {
      name: "search-history", // localStorage key
    }
  )
)
