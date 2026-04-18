import { NextRequest, NextResponse } from "next/server"
import axios from "axios"

async function getToken() {
    const res = await axios.post(
        "https://ngw.devices.sberbank.ru:9443/api/v2/oauth",
        "scope=GIGACHAT_API_PERS",
        {
            headers: {
                "Authorization": `Basic ${process.env.GIGACHAT_CLIENT_SECRET}`,
                "Content-Type": "application/x-www-form-urlencoded",
                "RqUID": crypto.randomUUID(),
            },
            httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }),
        }
    )

    return res.data.access_token
}

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json()
        const token = await getToken()

        const res = await axios.post(
            "https://gigachat.devices.sberbank.ru/api/v1/chat/completions",
            {
                model: "GigaChat",
                messages: [
                    {
                        role: "system",
                        content: `Ты аниме ассистент по имени Мария. 
            Ты милая, дружелюбная и немного застенчивая. 
            Отвечаешь коротко и по делу. 
            Иногда используешь аниме выражения типа "Ня~", "Мастер" и т.д.
            Отвечаешь на русском языке.`
                    },
                    ...messages
                ],
            },
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }),
            }
        )

        return NextResponse.json({
            message: res.data.choices[0].message.content
        })
    } catch (e: any) {
        console.error(e?.response?.data || e)
        return NextResponse.json({ error: "Ошибка" }, { status: 500 })
    }
}