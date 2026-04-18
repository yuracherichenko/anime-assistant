"use client"

import { useEffect, useRef } from "react"

export default function Live2DModel() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        let app: any = null

        async function init() {
            const PIXI = await import("pixi.js")
            const { Live2DModel } = await import("pixi-live2d-display/cubism4")

            Live2DModel.registerTicker((PIXI as any).Ticker)

            const W = window.innerWidth / 2
            const H = window.innerHeight

            app = new PIXI.Application({
                view: canvasRef.current!,
                autoStart: true,
                transparent: true,
                width: W,
                height: H,
            })

            const model = await Live2DModel.from("/hb_free/hb_free.model3.json")
            console.log("model loaded!", model.width, model.height)


            app.stage.addChild(model)

            const scale = Math.min(W / model.width, H / model.height) * 0.9
            model.scale.set(scale)
            model.anchor.set(0.5, 0.5)
            model.x = W / 2
            model.y = H / 2
        }

        init()

        return () => {
            app?.destroy()
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            style={{ width: "100%", height: "100%" }}
        />
    )
}