'use client'

import React, { useState } from 'react'
import { DrizzleChat } from '@/lib/db/schema'
import ChatComponent from './ChatComponent'
import ChatSideBar from './ChatSideBar'
import PDFViewer from './PDFViewer'
import { Button } from './ui/button'
import { Menu, X, FileText, MessageSquare, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  chats: DrizzleChat[]
  chatId: number
  isPro: boolean
  currentChat?: DrizzleChat | null
}

type View = 'chat' | 'pdf' | 'sidebar'

const MobileChatLayout = ({ chats, chatId, isPro, currentChat }: Props) => {
  const [activeView, setActiveView] = useState<View>('chat')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Mobile Header */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="p-2"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h1 className="font-semibold text-gray-900 dark:text-white truncate max-w-[200px]">
              {currentChat?.pdfName || 'DocuChat'}
            </h1>
          </div>
        </div>
        
        {/* View Toggle */}
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <Button
            variant={activeView === 'chat' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('chat')}
            className={cn(
              'px-3 py-1 text-xs rounded-md',
              activeView === 'chat' 
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                : 'text-gray-600 dark:text-gray-300'
            )}
          >
            <MessageSquare className="w-4 h-4 mr-1" />
            Chat
          </Button>
          <Button
            variant={activeView === 'pdf' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('pdf')}
            className={cn(
              'px-3 py-1 text-xs rounded-md',
              activeView === 'pdf' 
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                : 'text-gray-600 dark:text-gray-300'
            )}
          >
            <FileText className="w-4 h-4 mr-1" />
            PDF
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeView === 'chat' && (
          <div className="h-full">
            <ChatComponent chatId={chatId} />
          </div>
        )}
        
        {activeView === 'pdf' && (
          <div className="h-full bg-white dark:bg-gray-800">
            <PDFViewer pdf_url={currentChat?.pdfUrl || ''} />
          </div>
        )}
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-800 shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Chats</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="p-2"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="h-full">
              <ChatSideBar chats={chats} chatId={chatId} isPro={isPro} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MobileChatLayout