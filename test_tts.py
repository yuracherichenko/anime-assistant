import torch

language = 'ru'
model_id = 'v3_1_ru'
sample_rate = 48000
speaker = 'xenia'

model, _ = torch.hub.load(
    repo_or_dir='snakers4/silero-models',
    model='silero_tts',
    language=language,
    speaker=model_id
)

audio = model.apply_tts(
    text='Привет! Я Мария, твой аниме ассистент!',
    speaker=speaker,
    sample_rate=sample_rate
)

import soundfile as sf
import numpy as np

sf.write('test.wav', audio.numpy(), sample_rate)
print("Готово! Файл test.wav создан")