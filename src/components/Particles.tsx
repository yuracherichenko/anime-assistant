"use client"

import { useEffect, useRef } from "react"

interface Props {
    emotion: string
}

const emotionColors: Record<string, string> = {
    happy: "#FFD700",
    sad: "#4A90D9",
    surprised: "#FFFFFF",
    angry: "#FF4444",
    neutral: "#9B59B6",
}

export default function Particles({ emotion }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight

        const color = emotionColors[emotion] || emotionColors.neutral
        const particles: any[] = []

        // Создаём частицы
        for (let i = 0; i < 30; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 8 + 3,
                opacity: Math.random(),
            })
        }

        let animId: number

        function animate() {
            ctx!.clearRect(0, 0, canvas!.width, canvas!.height)

            particles.forEach(p => {
                p.x += p.vx
                p.y += p.vy
                p.opacity += (Math.random() - 0.5) * 0.05

                if (p.opacity < 0) p.opacity = 0
                if (p.opacity > 1) p.opacity = 1
                if (p.x < 0 || p.x > canvas!.width) p.vx *= -1
                if (p.y < 0 || p.y > canvas!.height) p.vy *= -1

                ctx!.beginPath()
                ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx!.fillStyle = color + Math.floor(p.opacity * 255).toString(16).padStart(2, "0")
                ctx!.fill()
            })

            animId = requestAnimationFrame(animate)
        }

        animate()

        return () => cancelAnimationFrame(animId)
    }, [emotion])

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
        />
    )
}