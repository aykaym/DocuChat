'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { GripVertical, RotateCcw } from 'lucide-react'
import { Button } from './ui/button'

type Props = {
  leftPanel: React.ReactNode
  rightPanel: React.ReactNode
  defaultRightWidth?: number
  minRightWidth?: number
  maxRightWidth?: number
  className?: string
}

const ResizableLayout = ({ 
  leftPanel, 
  rightPanel, 
  defaultRightWidth = 384, // 96 * 4 (w-96)
  minRightWidth = 320,
  maxRightWidth = 600,
  className 
}: Props) => {
  const [rightWidth, setRightWidth] = useState(defaultRightWidth)
  const [isResizing, setIsResizing] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const resetWidth = useCallback(() => {
    setRightWidth(defaultRightWidth)
  }, [defaultRightWidth])
  
  // Keyboard shortcuts for power users
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'r') {
        e.preventDefault()
        resetWidth()
      }
      if (e.altKey && (e.key === '=' || e.key === '+')) {
        e.preventDefault()
        setRightWidth(prev => Math.min(prev + 20, maxRightWidth))
      }
      if (e.altKey && e.key === '-') {
        e.preventDefault()
        setRightWidth(prev => Math.max(prev - 20, minRightWidth))
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [resetWidth, minRightWidth, maxRightWidth])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      
      const containerRect = containerRef.current.getBoundingClientRect()
      const newRightWidth = containerRect.right - e.clientX
      
      // Clamp the width between min and max values
      const clampedWidth = Math.min(Math.max(newRightWidth, minRightWidth), maxRightWidth)
      setRightWidth(clampedWidth)
    }
    
    const handleMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }, [minRightWidth, maxRightWidth])

  return (
    <div 
      ref={containerRef}
      className={cn('flex h-full bg-gray-50 dark:bg-gray-900', className)}
    >
      {/* Left Panel */}
      <div 
        className="flex-1 bg-white dark:bg-gray-800 overflow-hidden"
        style={{ width: `calc(100% - ${rightWidth}px)` }}
      >
        {leftPanel}
      </div>
      
      {/* Resizer */}
      <div
        className={cn(
          'relative w-1 bg-gray-200 dark:bg-gray-700 hover:bg-indigo-500 dark:hover:bg-indigo-400 transition-colors duration-200 cursor-col-resize group',
          {
            'bg-indigo-500 dark:bg-indigo-400': isResizing
          }
        )}
        onMouseDown={handleMouseDown}
        title="Drag to resize chat panel • Alt+R: Reset • Alt+/-: Adjust size"
      >
        {/* Resize handle */}
        <div className={cn(
          "absolute inset-y-0 -left-3 -right-3 flex flex-col items-center justify-center transition-opacity duration-200 gap-2",
          {
            'opacity-100': isResizing,
            'opacity-0 group-hover:opacity-100': !isResizing
          }
        )}>
          <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm p-1 shadow-lg">
            <GripVertical className="w-3 h-3 text-gray-500 dark:text-gray-400" />
          </div>
          
          {/* Reset button */}
          {rightWidth !== defaultRightWidth && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                resetWidth()
              }}
              className="p-1 h-6 w-6 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 shadow-lg"
              title="Reset to default width"
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
          )}
        </div>
        
        {/* Visual feedback line */}
        <div 
          className={cn(
            'absolute inset-y-0 left-0 w-full bg-indigo-500 dark:bg-indigo-400 transition-all duration-200',
            {
              'opacity-100 shadow-lg': isResizing,
              'opacity-0': !isResizing
            }
          )}
        />
        
        {/* Hover indicator */}
        <div className="absolute inset-y-0 left-0 w-full bg-indigo-500 dark:bg-indigo-400 opacity-0 group-hover:opacity-50 transition-opacity duration-200" />
      </div>
      
      {/* Right Panel */}
      <div 
        className="bg-gray-50 dark:bg-gray-900 overflow-hidden flex-shrink-0"
        style={{ width: `${rightWidth}px` }}
      >
        {rightPanel}
      </div>
    </div>
  )
}

export default ResizableLayout