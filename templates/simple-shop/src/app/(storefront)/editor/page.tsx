'use client'

import { Puck, Data } from '@measured/puck'
import '@measured/puck/puck.css'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import './dark-mode.css'
import { config } from '@/collections/Pages/editor/puck-config'

export default function EditorPage() {
  const searchParams = useSearchParams()
  const [data, setData] = useState<Data | null>(null)
  const theme = searchParams.get('theme')

  const handleChange = (newData: Data) => {
    setData(newData)
    window.parent?.postMessage({ type: 'PUCK_CHANGE', data: newData }, '*')
  }

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'PUCK_LOAD' && event.data.data) {
        console.log('Editor: received PUCK_LOAD', event.data.data)
        setData(event.data.data)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  useEffect(() => {
    if (window.parent && window.parent !== window) {
      console.log('Editor: sending PUCK_READY')
      window.parent.postMessage({ type: 'PUCK_READY' }, '*')
    }
  }, [])

  return (
    <div
      className={`h-screen w-full overflow-auto ${theme === 'dark' ? 'dark' : ''}`}
      data-theme={theme}
    >
      {data ? (
        <Puck
          config={config}
          data={data}
          overrides={{
            headerActions: () => <></>,
          }}
          onChange={handleChange}
          headerTitle=""
          headerPath=""
        />
      ) : (
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg mb-2">🔄 Waiting for data from parent...</div>
            <div className="text-sm text-gray-500 mb-4">Listening for PUCK_LOAD message</div>
          </div>
        </div>
      )}
    </div>
  )
}
