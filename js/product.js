const counterInput = document.getElementById('counter');
let counter = 1;

function minus() {
  if (counter <= 1) return;
  counter -= 1;
  counterInput.value = counter;
}

function plus() {
  if (counter >= 1000) return;
  counter += 1;
  counterInput.value = counter;
}

document.getElementById('counter').onchange = () => {
  value = counterInput.value;
  return value < 1 || value > 1000 || !(value > 0 && value <= 1000)
    ? (counterInput.value = counter)
    : (counter = parseInt(value, 10));
};
