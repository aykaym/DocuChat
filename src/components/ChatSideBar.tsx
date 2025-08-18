'use client'
import { DrizzleChat } from '@/lib/db/schema'
import React from 'react'
import Link from "next/link";
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { PlusCircle, MessageCircle, Search, FileText, Calendar, Clock, X } from 'lucide-react'
import { cn } from '@/lib/utils';
import axios from 'axios'
import SubscriptionButton from './SubscriptionButton';

type Props = {
    chats: DrizzleChat[],
    chatId: number
    isPro: boolean
}

const ChatSideBar = ({chats, chatId, isPro}: Props) => {
    const [loading, setLoading] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState('')
    const [filteredChats, setFilteredChats] = React.useState(chats)
    
    React.useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredChats(chats)
        } else {
            const filtered = chats.filter(chat => 
                chat.pdfName.toLowerCase().includes(searchQuery.toLowerCase())
            )
            setFilteredChats(filtered)
        }
    }, [searchQuery, chats])
    
    const handleSubscription = async () => {
        try {
            setLoading(true)
            const response = await axios.get('/api/stripe')
            window.location.href = response.data.url
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }
    
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffTime = Math.abs(now.getTime() - date.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        if (diffDays === 1) return 'Today'
        if (diffDays === 2) return 'Yesterday'
        if (diffDays <= 7) return `${diffDays} days ago`
        return date.toLocaleDateString()
    }
  return (
    <div className='w-full max-h-screen flex flex-col bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white'>
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-semibold">Your Chats</h2>
            </div>
            
            <Link href='/' >
                <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-0 text-white transition-all duration-200"> 
                    <PlusCircle className="mr-2 w-4 h-4" />
                    New Chat 
                </Button>
            </Link>
        </div>
        
        {/* Search */}
        <div className="p-4 border-b border-gray-700">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
        
        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-4">
            {filteredChats.length === 0 ? (
                <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                        <MessageCircle className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-400 text-sm">
                        {searchQuery ? 'No chats found' : 'No conversations yet'}
                    </p>
                    {searchQuery && (
                        <p className="text-gray-500 text-xs mt-1">
                            Try adjusting your search
                        </p>
                    )}
                </div>
            ) : (
                <div className="space-y-2">
                    {filteredChats.map(chat => (
                        <Link key={chat.id} href={`/chat/${chat.id}`}>
                            <div className={
                                cn(
                                    "group rounded-xl p-3 transition-all duration-200 cursor-pointer border border-transparent hover:bg-gray-800/50 hover:border-gray-700",
                                    {
                                        'bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-indigo-500/30 shadow-lg': chat.id === chatId
                                    }
                                )
                            }>
                                <div className="flex items-start gap-3">
                                    <div className={cn(
                                        "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200",
                                        {
                                            'bg-gradient-to-br from-indigo-500 to-purple-600': chat.id === chatId,
                                            'bg-gray-700 group-hover:bg-gray-600': chat.id !== chatId
                                        }
                                    )}>
                                        <FileText className="w-5 h-5 text-white" />
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <h3 className={cn(
                                            "font-medium text-sm truncate transition-colors duration-200",
                                            {
                                                'text-white': chat.id === chatId,
                                                'text-gray-200 group-hover:text-white': chat.id !== chatId
                                            }
                                        )}>
                                            {chat.pdfName}
                                        </h3>
                                        
                                        <div className="flex items-center gap-1 mt-1">
                                            <Clock className="w-3 h-3 text-gray-400" />
                                            <span className="text-xs text-gray-400">
                                                {chat.createdAt ? formatDate(chat.createdAt) : 'Recently'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
            <SubscriptionButton isPro={isPro} />
        </div>
    </div>
  )
}

export default ChatSideBar