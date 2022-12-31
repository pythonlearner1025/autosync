from flask import *
from flask_cors import CORS, cross_origin
import librosa
import scipy.stats
import scipy.optimize
import numpy as np
import json

app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hello, World!'

@app.route('/api/audio-data', methods=['POST'])
@cross_origin()
def receive_audio_data():
  audio_data = request.json['audioData']
  sr = request.json['sr']
  y,t,bpm,beats = process_data(np.array(audio_data), int(sr))

  # Do something with the audio data here
  fitted = fit_sin(t, y)
  fitted['bpm'] = bpm
  fitted['beats'] = beats.tolist()
  print(beats)

  #print(audio_data)
  return {
    'message': 'Audio data received',
    't': json.dumps(t.tolist()),
    'y': json.dumps(y.tolist()),
    'fitted': json.dumps(fitted)
    }

@app.route('/api/test-data', methods=['POST'])
@cross_origin()
def receive_test():
  test = request.json['testData']
  return {'message': 'test data received'}

def process_data(d,sr):
    o = librosa.onset.onset_strength(y=d, sr=sr)
    bpm, beats = librosa.beat.beat_track(onset_envelope=o, sr=sr)
    prior = scipy.stats.lognorm(loc=np.log(120), scale=120, s=1)
    log = librosa.util.normalize(librosa.beat.plp(onset_envelope=o, sr=sr, prior=prior))
    t = librosa.times_like(log)
    return log, t, bpm, librosa.frames_to_time(beats, sr=sr)

def fit_sin(tt,yy):
  '''Fit sin to the input time sequence, and return fitting parameters "amp", "omega", "phase", "offset", "freq", "period" and "fitfunc"'''
  tt = np.array(tt)
  yy = np.array(yy)
  ff = np.fft.fftfreq(len(tt), (tt[1]-tt[0]))   # assume uniform spacing
  Fyy = abs(np.fft.fft(yy))
  guess_freq = abs(ff[np.argmax(Fyy[1:])+1])   # excluding the zero frequency "peak", which is related to offset
  guess_amp = np.std(yy) * 2.**0.5
  guess_offset = np.mean(yy)
  guess = np.array([guess_amp, 2.*np.pi*guess_freq, 0., guess_offset])

  def sinfunc(t, A, w, p, c):  return A * np.sin(w*t + p) + c
  popt, pcov = scipy.optimize.curve_fit(sinfunc, tt, yy, p0=guess)
  A, w, p, c = popt
  f = w/(2.*np.pi) 
  fitfunc = lambda t: A * np.sin(w*t + p) + c
  return {"amp": A, "omega": w, "phase": p, "offset": c, "freq": f, "period": 1./f}


if __name__ == '__main__':
    app.run(port=8000)