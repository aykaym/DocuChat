import { UserButton, auth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, LogIn, FileText, Zap, Shield, Users } from 'lucide-react'
import FileUpload from "@/components/FileUpload";
import { checkSubscription } from "@/lib/subscription";
import SubscriptionButton from "@/components/SubscriptionButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from 'drizzle-orm'

export default async function Home() {
  const {userId} = await auth()
  const isAuth = !!userId
  const isPro = await checkSubscription()
  let firstChat;
  if (userId) {
    firstChat = await db.select().from(chats).where(eq(chats.userId, userId))
    if (firstChat) {
      firstChat = firstChat[0]
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation Bar */}
      <nav className="relative z-10 flex items-center justify-between p-6">
        <div className="flex items-center space-x-2">
          <FileText className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          <span className="text-2xl font-bold text-gray-900 dark:text-white">DocuChat</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {isAuth && <UserButton afterSignOutUrl="/" />}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
          {/* Background decoration */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 transform -skew-y-6 sm:-skew-y-0 sm:skew-x-6 sm:rounded-3xl"></div>
          </div>
          
          <div className="relative animate-fade-in">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              Chat with any
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600 animate-bounce-subtle">
                PDF Document
              </span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300 mb-8 animate-slide-up">
              Transform your PDFs into interactive conversations. Upload, ask questions, and get instant insights powered by AI.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-scale-in">
              {isAuth && firstChat && (
                <Link href={`/chat/${firstChat.id}`}>
                  <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 text-lg">
                    Go to Chats <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              )}
              
              {!isAuth && (
                <Link href="/sign-in">
                  <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 text-lg">
                    Get Started Free
                    <LogIn className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              )}
              
              <SubscriptionButton isPro={isPro} />
            </div>

            {/* File Upload Section */}
            <div className="max-w-2xl mx-auto">
              {isAuth ? (
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50 dark:border-gray-700/50 hover-lift animate-slide-up">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Upload your PDF to get started</h3>
                  <FileUpload />
                </div>
              ) : (
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50 dark:border-gray-700/50 hover-lift animate-slide-up">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Ready to revolutionize how you read PDFs?</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">Join thousands of users who are already chatting with their documents.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Why choose DocuChat?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Powerful features to enhance your PDF experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/50 dark:border-gray-700/50 shadow-lg hover-lift animate-slide-up">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Lightning Fast</h3>
              <p className="text-gray-600 dark:text-gray-300">Get instant answers from your PDFs with our advanced AI processing</p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/50 dark:border-gray-700/50 shadow-lg hover-lift animate-slide-up" style={{animationDelay: '0.1s'}}>
              <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Secure & Private</h3>
              <p className="text-gray-600 dark:text-gray-300">Your documents are encrypted and processed securely</p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/50 dark:border-gray-700/50 shadow-lg hover-lift animate-slide-up" style={{animationDelay: '0.2s'}}>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Trusted by Thousands</h3>
              <p className="text-gray-600 dark:text-gray-300">Join students, researchers, and professionals worldwide</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
