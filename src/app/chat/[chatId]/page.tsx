import ChatComponent from '@/components/ChatComponent'
import ChatSideBar from '@/components/ChatSideBar'
import PDFViewer from '@/components/PDFViewer'
import MobileChatLayout from '@/components/MobileChatLayout'
import ResizableLayout from '@/components/ResizableLayout'
import { db } from '@/lib/db'
import { chats } from '@/lib/db/schema'
import { checkSubscription } from '@/lib/subscription'
import { auth } from '@clerk/nextjs'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
    params: {
        chatId: string
    }
}

const ChatPage = async ({params: {chatId}}: Props) => {
    const {userId} = await auth()
    if (!userId) {
        return redirect('/sign-in')
    }
    const _chats = await db.select().from(chats).where(eq(chats.userId, userId))
    if (!_chats) {
        return redirect('/')
    }
    if (!_chats.find(chat=>chat.id === parseInt(chatId))) {
        return redirect("/")
    }

    const currentChat = _chats.find(chat => chat.id === parseInt(chatId))
    const isPro = await checkSubscription()

    return (
        <>
            {/* Desktop Layout */}
            <div className='hidden lg:flex max-h-screen bg-gray-50 dark:bg-gray-900'>
                {/* Sidebar */}
                <div className='w-80 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 shadow-lg'>
                    <ChatSideBar chats={_chats} chatId={parseInt(chatId)} isPro={isPro} />
                </div>

                {/* Resizable Main Content Area */}
                <div className="flex-1">
                    <ResizableLayout
                        leftPanel={
                            <div className="h-full flex flex-col">
                                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                        {currentChat?.pdfName || 'Document Viewer'}
                                    </h2>
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
                                </div>
                            </div>
                        }
                        rightPanel={
                            <ChatComponent chatId={parseInt(chatId)} />
                        }
                        defaultRightWidth={400}
                        minRightWidth={320}
                        maxRightWidth={600}
                    />
                </div>
            </div>
            
            {/* Mobile Layout */}
            <div className="lg:hidden">
                <MobileChatLayout 
                    chats={_chats} 
                    chatId={parseInt(chatId)} 
                    isPro={isPro}
                    currentChat={currentChat}
                />
            </div>
        </>
    )
}

export default ChatPage