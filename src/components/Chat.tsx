"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Message {
    role: "user" | "assistant"
    content: string
}

interface Props {
    onMessage?: (text: string) => void
}

export default function Chat({ onMessage }: Props) {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const bottomRef = useRef<HTMLDivElement>(null)
    const [listening, setListening] = useState(false)

    function startListening() {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

        if (!SpeechRecognition) {
            alert("Ваш браузер не поддерживает распознавание речи")
            return
        }

        const recognition = new SpeechRecognition()
        recognition.lang = "ru-RU"
        recognition.interimResults = false

        recognition.onstart = () => setListening(true)
        recognition.onend = () => setListening(false)

        recognition.onresult = (event: any) => {
            const text = event.results[0][0].transcript
            setInput(text)
        }

        recognition.start()
    }

    function speak(text: string) {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = "ru-RU"
        utterance.rate = 1.1
        utterance.pitch = 1.3
        window.speechSynthesis.speak(utterance)
    }

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    async function sendMessage() {
        if (!input.trim() || loading) return

        const userMessage: Message = { role: "user", content: input }
        const newMessages = [...messages, userMessage]
        setMessages(newMessages)
        setInput("")
        setLoading(true)

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: newMessages }),
            })
            const data = await res.json()
            const assistantMessage: Message = {
                role: "assistant",
                content: data.message,
            }
            setMessages(prev => [...prev, assistantMessage])
            speak(data.message)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col h-full p-4 gap-4">
            {/* Имя персонажа */}
            <div className="text-center">
                <h2 className="text-xl font-bold text-purple-400">Мария</h2>
                <p className="text-xs text-zinc-500">Аниме ассистент</p>
            </div>

            {/* Сообщения */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-3">
                {messages.length === 0 && (
                    <p className="text-zinc-500 text-center text-sm mt-8">
                        Привет! Я Мария~ Чем могу помочь? ня~
                    </p>
                )}
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                                msg.role === "user"
                                    ? "bg-purple-600 text-white rounded-tr-none"
                                    : "bg-zinc-800 text-zinc-100 rounded-tl-none"
                            }`}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-zinc-800 rounded-2xl rounded-tl-none px-4 py-2 text-sm text-zinc-400">
                            Мария печатает...
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Ввод */}
            <div className="flex gap-2">
                <Input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendMessage()}
                    placeholder="Напиши Марии..."
                    className="bg-zinc-800 border-zinc-700 text-white"
                    disabled={loading}
                />
                <Button
                    onClick={startListening}
                    disabled={loading}
                    variant="outline"
                    className={`border-zinc-700 ${listening ? "text-red-400 border-red-400" : "text-zinc-300"}`}
                >
                    {listening ? "🔴" : "🎤"}
                </Button>
                <Button
                    onClick={sendMessage}
                    disabled={loading}
                    className="bg-purple-600 hover:bg-purple-700"
                >
                    →
                </Button>
            </div>
        </div>
    )
}