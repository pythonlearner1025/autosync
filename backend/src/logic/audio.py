import librosa
import numpy as np
import time

p = '/Users/minjunes/paradox/backend/src/club_havana.mp3'

if __name__ == "__main__":
    ts = librosa.load(p, sr=22050)
    s = time.time()
    tempo, beats = librosa.beat.beat_track(y=ts[0],sr=22050)
    e = time.time()
    print(e-s)
    print(tempo)
    print(beats)
