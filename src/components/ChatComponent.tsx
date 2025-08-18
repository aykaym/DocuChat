'use client'
import React from 'react'
import { Input } from "./ui/input"
import { useChat } from 'ai/react'
import { Button } from './ui/button'
import { Send, MessageSquare, Sparkles } from 'lucide-react'
import MessageList from './MessageList'
import { useQuery } from '@tanstack/react-query'
import { Message } from 'ai'
import axios from 'axios'

type Props = {chatId: number}

const ChatComponent = ({chatId}: Props) => {
    const {data, isLoading} = useQuery({
        queryKey: ["chat", chatId],
        queryFn: async () => {
            const response = await axios.post<Message[]>('/api/get-messages', {
                chatId
            }) 
            return response.data
        }
    })
    const {input, handleInputChange, handleSubmit, messages} = useChat({
        api: "/api/chat",
        body: {
            chatId
        },
        initialMessages: data || [],
    })
    React.useEffect(()=> {
        const messageContainer = document.getElementById('message-container')
        if ( messageContainer) {
            messageContainer.scrollTo({
                top: messageContainer.scrollHeight,
                behavior: 'smooth'
            })
        }
    }, [messages])
  return (
    <div className="relative max-h-screen flex flex-col bg-gray-50" id="message-container">
        {/* Header */}
        <div className='sticky top-0 inset-x-0 p-6 bg-white border-b border-gray-200 shadow-sm z-10'>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className='text-xl font-bold text-gray-900'>AI Assistant</h3>
                    <p className="text-sm text-gray-500">Ask me anything about your document</p>
                </div>
            </div>
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
            <MessageList messages={messages} isLoading={isLoading} />
        </div>
        
        {/* Input Form */}
        <div className="sticky bottom-0 inset-x-0 p-4 bg-white border-t border-gray-200">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                <div className='flex items-center gap-3 bg-gray-100 rounded-2xl p-2'>
                    <Input 
                        value={input} 
                        onChange={handleInputChange} 
                        placeholder="Ask any question about your PDF..." 
                        className='flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-900 placeholder-gray-500'
                        disabled={isLoading}
                    />
                    <Button 
                        type="submit"
                        size="sm"
                        disabled={!input.trim() || isLoading}
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl px-4 py-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <Send className="h-4 w-4 mr-1" />
                                <span className="hidden sm:inline">Send</span>
                            </>
                        )}
                    </Button>
                </div>
                
                {/* Quick suggestions */}
                {messages.length === 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 justify-center">
                        {['Summarize this document', 'What are the key points?', 'Find specific information'].map((suggestion) => (
                            <button
                                key={suggestion}
                                type="button"
                                onClick={() => handleInputChange({ target: { value: suggestion } } as any)}
                                className="px-3 py-1 text-xs bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors duration-200 border border-indigo-200"
                            >
                                <Sparkles className="w-3 h-3 inline mr-1" />
                                {suggestion}
                            </button>
                        ))}
                    </div>
                )}
            </form>
        </div>
    </div>
  )
}

export default ChatComponent