"use client"

import * as React from "react"

type ToastProps = {
  title: string
  description?: string
  variant?: "default" | "destructive"
}

export function useToast() {
  const toast = React.useCallback((props: ToastProps) => {
    const message = props.description 
      ? `${props.title}: ${props.description}` 
      : props.title

    console.log(`Toast (${props.variant || 'default'}):`, message)

    // Simple browser alert for demo
    if (typeof window !== 'undefined') {
      alert(message)
    }
  }, [])

  return { toast }
}