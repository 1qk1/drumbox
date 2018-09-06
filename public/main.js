const socket = io.connect('192.168.1.8:4000');

const drumbuttons = document.querySelectorAll('.drumbtn');

const keyToNum = {
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
//a: sound
//b: sound

const playSound = id => {
  sounds[id].play();
  drumbuttons[keyToNum[id]].classList.add('playing');
}

for (let i in map) {
  // i = a
  // id = 0
  const id = Number(drumbuttons[keyToNum[i]].getAttribute('data-key'));
  sounds[i] = new Howl({src: ['sounds/' + map[i] + '.wav']});
  drumbuttons[id].addEventListener('mousedown', e => {
    playSound(i);
    socket.emit('drumdown', i);
  });
  drumbuttons[id].addEventListener('mouseup', () => {
    drumbuttons[id].classList.remove('playing');
    socket.emit('drumup', i);
  });
  drumbuttons[id].addEventListener('mouseout', () => {
    drumbuttons[id].classList.remove('playing');
    socket.emit('drumup', i);
  });
}

document.addEventListener('keydown', e => {
  if (keyToNum[e.key] === undefined || e.repeat) return;
   if (sounds[e.key] !== undefined){
    playSound(e.key);
    socket.emit('drumdown', e.key);
  }
});

document.addEventListener('keyup', e => {
  if (keyToNum[e.key] === undefined || e.repeat) return;
  if (sounds[e.key] !== undefined || drumbuttons[keyToNum[e.key]].classList.contains('playing')){
    drumbuttons[keyToNum[e.key]].classList.remove('playing');
    socket.emit('drumup', e.key);
  }
});

socket.on('drumdown', key => {
  playSound(key);
});

socket.on('drumup', key => {
  drumbuttons[keyToNum[key]].classList.remove('playing');
});

socket.on('clients', ({global}) => {
  document.getElementsByClassName('clients')[0].innerHTML = 
    `<h2>There ${global > 1 ? 'are' : 'is'} ${global > 0 ? global : 'no'} connected player${global > 1 ? 's' : ''}!<h2>`;
});

const roombuttons = document.querySelectorAll('div.roombtn');

const removeActiveRoomClass = () => {
  for (let button of roombuttons){
    if (button.classList.contains('activeroom')){
      button.classList.remove('activeroom');
    }
  }
}

for (let roombutton of roombuttons) {
  roombutton.addEventListener('click', () => {
    socket.emit('room', roombutton.getAttribute('data-room'));
    removeActiveRoomClass();
    roombutton.classList.add('activeroom');
  });
}

const customRoomInput = document.querySelector('.roominput');

customRoomInput.addEventListener('blur', e => {
  socket.emit('room', roombutton.getAttribute('data-room'));
  removeActiveRoomClass();
  customRoomInput.classList.add('activeroom');
  socket.emit('room', e.target.value);
});