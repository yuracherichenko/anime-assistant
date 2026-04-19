import torch
import soundfile as sf
import io
from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import base64

# Загружаем модель один раз при старте
print("Загружаем модель...")
model, _ = torch.hub.load(
    repo_or_dir='snakers4/silero-models',
    model='silero_tts',
    language='ru',
    speaker='v3_1_ru'
)
print("Модель готова!")

class TTSHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        body = self.rfile.read(content_length)
        data = json.loads(body)
        text = data.get('text', '')

        audio = model.apply_tts(
            text=text,
            speaker='xenia',
            sample_rate=48000
        )

        # Сохраняем в буфер
        buffer = io.BytesIO()
        sf.write(buffer, audio.numpy(), 48000, format='WAV')
        buffer.seek(0)
        audio_bytes = buffer.read()
        audio_b64 = base64.b64encode(audio_bytes).decode()

        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps({'audio': audio_b64}).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def log_message(self, format, *args):
        pass  # Отключаем логи

print("Сервер запущен на http://localhost:8765")
HTTPServer(('localhost', 8765), TTSHandler).serve_forever()