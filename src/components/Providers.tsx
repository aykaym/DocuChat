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
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default Providers