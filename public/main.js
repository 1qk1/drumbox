const socket = io.connect('drumbox.now.sh');

const drumbuttons = document.querySelectorAll('.drumbtn');

const numToButton = {
  a: 0,
  s: 1,
  d: 2,
  f: 3,
  g: 4,
  h: 5,
  j: 6,
};

const map = {
  a: 'kick',
  s: 'snare',
  d: 'snare2',
  f: 'closedhh',
  g: 'rim', 
  h: 'clap', 
  j: 'openhh'
};

const sounds = {};

const playSound = id => {
  sounds[id].play();
  drumbuttons[numToButton[id]].classList.add('playing');
}

for (let i in map) {
  const id = Number(drumbuttons[numToButton[i]].getAttribute('data-key'));
  sounds[i] = new Howl({src: ['sounds/' + map[i] + '.wav']});
  drumbuttons[numToButton[i]].addEventListener('mousedown', () => {
    playSound(Object.keys(numToButton)[id]);
    socket.emit('drumdown', id);
  });
  drumbuttons[numToButton[i]].addEventListener('mouseup', () => {
    drumbuttons[id].classList.remove('playing');
    socket.emit('drumup', id);
  });
  drumbuttons[numToButton[i]].addEventListener('mouseout', () => {
    drumbuttons[id].classList.remove('playing');
    socket.emit('drumup', id);
  });
}

document.addEventListener('keydown', e => {
  if (numToButton[e.key] === undefined || e.repeat) return;
   if (sounds[e.key] !== undefined){
    playSound(e.key);
    socket.emit('drumdown', e.key);
  }
});

document.addEventListener('keyup', e => {
  if (numToButton[e.key] === undefined || e.repeat) return;
  if (sounds[e.key] !== undefined || drumbuttons[numToButton[e.key]].classList.contains('playing')){
    drumbuttons[numToButton[e.key]].classList.remove('playing');
    socket.emit('drumup', e.key);
  }
});

socket.on('drumdown', key => {
  playSound(key);
});

socket.on('drumup', key => {
  drumbuttons[numToButton[key]].classList.remove('playing');
});