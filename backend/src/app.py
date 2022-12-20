from flask import *
from flask_cors import CORS, cross_origin
import librosa
import scipy.stats
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
  res,t = process_data(np.array(audio_data), int(sr))
  # Do something with the audio data here
  print(len(audio_data))
  #print(audio_data)
  return {'message': 'Audio data received', 't': json.dumps(t.tolist()),'y': json.dumps(res.tolist())}

@app.route('/api/test-data', methods=['POST'])
@cross_origin()
def receive_test():
  test = request.json['testData']
  return {'message': 'test data received'}

def process_data(d,sr):
    o = librosa.onset.onset_strength(y=d, sr=sr)
    prior = scipy.stats.lognorm(loc=np.log(120), scale=120, s=1)
    log = librosa.util.normalize(librosa.beat.plp(onset_envelope=o, sr=sr, prior=prior))
    t = librosa.times_like(log)
    print(log)
    print(max(log))
    print(len(log), len(t))
    return log, t


if __name__ == '__main__':
    app.run(port=8000)