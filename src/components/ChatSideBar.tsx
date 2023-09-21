'use client'
import { DrizzleChat } from '@/lib/db/schema'
import React from 'react'
import Link from "next/link";
import { Button } from "./ui/button"
import { PlusCircle, MessageCircle } from 'lucide-react'
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
  return (
    <div className='w-full max-h-screen p-4 text-gray-200 overflow-scroll soff bg-gray-900'>
        <Link href='/' >
            <Button className="w-full border-dashed border-white border"> 
                <PlusCircle className="mr-2 w-4 h-4" />
                New Chat 
            </Button>
        </Link>
        <div className="flex flex-col max-h-screen overflow-scroll pb-20 gap-2 mt-4">
            {chats.map(chat => (
                <Link key={chatId} href={`/chat/${chat.id}`}>
                    <div className={
                        cn("rounded-lg p-3 text-slate-300 flex items-center", {
                            'bg-blue-600 text-white': chat.id === chatId
                        })
                    }>
                        <MessageCircle className="mr-2" />
                        <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">{chat.pdfName}</p>
                    </div>
                </Link>
            ))}
        </div>
    </div>
  )
}

export default ChatSideBar