function buildTypingSequence() {
  const states = [{ t: 0, text: '' }];
  const rhythm = [.07, .095, .065, .11, .08, .12, .055, .085];
  let time = 1.1;
  let text = '';
  let key = 0;
  function type(value) {
    for (const letter of value) {
      time += rhythm[key++ % rhythm.length] + (letter === ' ' ? .035 : 0);
      text += letter;
      states.push({ t: time, text });
      if (letter === '.') time += .42;
    }
  }
  type('A woman can speak to ');
  time += .28;
  type('abandoned buildings.');
  type(' Their memoriea');
  time += .38;
  text = text.slice(0, -1);
  states.push({ t: time, text });
  time += .12;
  type('s');
  time += .22;
  type(' are incomplete.');
  return states;
}

function typingAt(states, time) {
  if (time >= 50.3) return { text: '', caret: false };
  const state = states.findLast((item) => item.t <= time) || states[0];
  const caret = time >= .85 && time < 10.2 && (time - state.t < .18 || Math.floor((time - state.t) / .45) % 2 === 0);
  return { text: state.text, caret };
}
