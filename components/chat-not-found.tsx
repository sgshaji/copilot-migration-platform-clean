"use client"

import { Button } from "@/components/ui/button"

export default function ChatNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Chat Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-white rounded-2xl shadow-sm flex items-center justify-center">
            <div className="relative">
              {/* Chat bubble outline */}
              <div className="w-12 h-10 border-2 border-gray-300 rounded-xl relative">
                {/* Three dots inside */}
                <div className="absolute inset-0 flex items-center justify-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                </div>
              </div>
              {/* Chat input lines below */}
              <div className="mt-2 space-y-1">
                <div className="w-8 h-1 bg-gray-300 rounded"></div>
                <div className="w-6 h-1 bg-gray-300 rounded"></div>
              </div>
              {/* Send button */}
              <div className="absolute -bottom-1 -right-1 w-4 h-3 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-gray-900">Chat Not Found</h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            This chat was deleted, made private, or no longer exists.
          </p>
        </div>

        {/* New Chat Button */}
        <Button
          className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-medium"
          onClick={() => window.history.back()}
        >
          New Chat
        </Button>
      </div>
    </div>
  )
}
