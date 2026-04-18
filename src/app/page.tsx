"use client"

import dynamic from "next/dynamic"
import Chat from "@/components/Chat"

const Live2DModel = dynamic(() => import("@/components/Live2DModel"), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-zinc-950 animate-pulse" />
})

export default function Home() {
    return (
        <main className="min-h-screen bg-zinc-950 flex">
            <div className="w-1/2 h-screen">
                <Live2DModel />
            </div>
            <div className="w-1/2 h-screen bg-zinc-900 border-l border-zinc-800">
                <Chat />
            </div>
        </main>
    )
}