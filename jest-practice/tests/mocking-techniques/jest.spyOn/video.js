const video = {
  play() {
    return true;
  }
};

const audio = {
  _volume: false,
  // it's a setter!
  set volume(value) {
    this._volume = value;
  },
  get volume() {
    return this._volume;
  },
};


module.exports = { video, audio };