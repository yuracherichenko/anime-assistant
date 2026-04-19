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
    onEmotion?: (emotion: string) => void
}

export default function Chat({ onMessage, onEmotion }: Props) {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const bottomRef = useRef<HTMLDivElement>(null)
    const [listening, setListening] = useState(false)
    const [voiceEnabled, setVoiceEnabled] = useState(true)

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

    async function speak(text: string) {
        if (!voiceEnabled) return

        try {
            const res = await fetch("http://localhost:8765", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
            })
            const data = await res.json()

            // Декодируем base64 в аудио
            const audioBytes = atob(data.audio)
            const arrayBuffer = new ArrayBuffer(audioBytes.length)
            const view = new Uint8Array(arrayBuffer)
            for (let i = 0; i < audioBytes.length; i++) {
                view[i] = audioBytes.charCodeAt(i)
            }

            const audioContext = new AudioContext()
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
            const source = audioContext.createBufferSource()
            source.buffer = audioBuffer
            source.connect(audioContext.destination)

            // Анимация рта
            const model = (window as any).__live2dModel
            let mouthInterval: any = null

            source.onended = () => {
                if (mouthInterval) clearInterval(mouthInterval)
                if (model) {
                    model.internalModel.coreModel.setParameterValueById("ParamMouthOpenY", 0)
                }
            }

            if (model) {
                mouthInterval = setInterval(() => {
                    const open = Math.random() * 0.8 + 0.2 // от 0.2 до 1.0, не закрывается полностью
                    try {
                        model.internalModel.coreModel.setParameterValueById("ParamMouthOpenY", open)
                        model.internalModel.coreModel.setParameterValueById("ParamMouthForm", 0.5)
                    } catch(e) {
                        console.log("mouth param error:", e)
                    }
                }, 100) // быстрее — 100ms вместо 150ms
            }

            source.start()
        } catch (e) {
            console.error("TTS ошибка:", e)
            // Фолбэк на Web Speech API
            const utterance = new SpeechSynthesisUtterance(text)
            utterance.lang = "ru-RU"
            utterance.pitch = 1.8
            window.speechSynthesis.speak(utterance)
        }
    }

    let emotionInterval: any = null

    function applyEmotion(emotion: string) {


        const model = (window as any).__live2dModel
        if (!model) return

        // Останавливаем предыдущий интервал
        if (emotionInterval) clearInterval(emotionInterval)

        const core = model.internalModel.coreModel

        const applyParams = () => {
            switch(emotion) {
                case "happy":
                    core.setParameterValueById("ParamEyeLSmile", 1)
                    core.setParameterValueById("ParamEyeRSmile", 1)
                    core.setParameterValueById("ParamMouthForm", 1)
                    core.setParameterValueById("ParamAngleZ", 15) // наклон головы
                    break
                case "sad":
                    core.setParameterValueById("ParamBrowLY", -1)
                    core.setParameterValueById("ParamMouthForm", -1)
                    core.setParameterValueById("ParamAngleZ", -10)
                    break
                case "surprised":
                    core.setParameterValueById("ParamBrowLY", 1)
                    core.setParameterValueById("ParamAngleY", 15)
                    break
                case "angry":
                    core.setParameterValueById("ParamBrowLY", -1)
                    core.setParameterValueById("ParamAngleX", -10)
                    break
            }
        }

        // Применяем каждые 16ms (60fps)
        emotionInterval = setInterval(applyParams, 16)

        // Через 3 секунды останавливаем
        setTimeout(() => {
            clearInterval(emotionInterval)
        }, 3000)
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

            console.log("data from API:", data)

            const assistantMessage: Message = {
                role: "assistant",
                content: data.message,
            }
            setMessages(prev => [...prev, assistantMessage])
            applyEmotion(data.emotion)
            onEmotion?.(data.emotion)
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
            <div className="text-center flex items-center justify-center gap-3">
                <h2 className="text-xl font-bold text-purple-400">Мария</h2>
                <button
                    onClick={() => setVoiceEnabled(prev => !prev)}
                    className="text-zinc-400 hover:text-white text-lg"
                    title={voiceEnabled ? "Выключить голос" : "Включить голос"}
                >
                    {voiceEnabled ? "🔊" : "🔇"}
                </button>
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