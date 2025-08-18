'use client'
import React from 'react'
import { useDropzone } from 'react-dropzone'
import { Inbox, Loader2 } from 'lucide-react'
import { uploadToS3 } from '@/lib/s3'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const FileUpload = () => {
    const router = useRouter()
    const [uploading, setUploading] = React.useState(false)
    const {mutate, isLoading} = useMutation({
        mutationFn: async ({
            file_key, 
            file_name
        } : {
            file_key: string; 
            file_name: string;
        }) => {
            const response = await axios.post('/api/create-chat', {
                file_key, file_name
            })
            return response.data
        }
    })
    const {getRootProps, getInputProps} = useDropzone({
        accept: { "application/pdf": [".pdf"]},
        maxFiles:1,
        onDrop: async (acceptedFiles) => {
            const file = acceptedFiles[0]
            if (file.size > 10 * 1024 * 1024) {
                //bigger than 10mb
                toast.error('please upload a smaller file, less than 10mb')
                return
            }
            try {
                const data = await uploadToS3(file)
                if (!data?.file_key || !data.file_name) {
                    toast.error("something went wrong")
                    return
                }
                mutate(data, {
                    onSuccess: ({chat_id}) => {
                        toast.success("Chat has been created!")
                        router.push(`/chat/${chat_id}`)
                    },
                    onError: (err) => {
                        toast.error('Error creating chat')
                        console.error(err)
                    }
                })
                console.log('data', data)
            } catch (error) {
                console.log(error)
            } finally {
                setUploading(false)
            }
            
        },
    })
  return (
    <div className='w-full'>
        <div {...getRootProps({
            className: 
                'border-dashed border-2 border-indigo-300 rounded-2xl cursor-pointer bg-gradient-to-br from-indigo-50 to-cyan-50 py-12 px-8 flex justify-center items-center flex-col transition-all duration-300 hover:border-indigo-400 hover:bg-gradient-to-br hover:from-indigo-100 hover:to-cyan-100 group'

        })}>
            <input {...getInputProps()} />
            {(uploading || isLoading) ?(
                <>
                    <div className="relative">
                        <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
                        <div className="absolute inset-0 h-12 w-12 border-2 border-indigo-200 rounded-full animate-pulse"></div>
                    </div>
                    <p className='mt-4 text-lg font-medium text-indigo-700'>
                        Processing your PDF...
                    </p>
                    <p className='mt-1 text-sm text-indigo-500'>
                        This may take a few moments
                    </p>
                </>
            ): (
            <>
                <div className="relative">
                    <Inbox className="w-16 h-16 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-300" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">+</span>
                    </div>
                </div>
                <p className="mt-4 text-lg font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                    Drop your PDF here or click to browse
                </p>
                <p className="mt-2 text-sm text-gray-500">
                    Supports PDF files up to 10MB
                </p>
            </>
            )}
        </div>
    </div>
  )
}

export default FileUpload