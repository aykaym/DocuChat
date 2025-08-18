'use client'
import React from 'react'
import {QueryClientProvider, QueryClient} from '@tanstack/react-query'
import { ThemeProvider } from './ThemeProvider'

type Props = {
    children: React.ReactNode
}

const queryClient = new QueryClient()

const Providers = ({children}: Props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        defaultTheme="system"
        storageKey="docuchat-theme"
      >
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default Providers