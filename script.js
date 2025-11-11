let playerName = '';
let score = 0;
const leaderboard = [];

const playerInput = document.getElementById('playerNameInput');
const loginBtn = document.getElementById('loginBtn');
const potato = document.getElementById('potato');
const clickBtn = document.getElementById('clickBtn');
const scoreDisplay = document.getElementById('score');
const leaderboardList = document.getElementById('leaderboardList');

loginBtn.addEventListener('click', () => {
  const name = playerInput.value.trim();
  if(!name) return alert('اكتب اسمك أولاً');
  playerName = name;
  score = 0;
  updateScore();
  alert(`مرحباً ${playerName}، ابدأ اللعب!`);
});

clickBtn.addEventListener('click', () => {
  if(!playerName) return alert('سجّل دخولك أولاً');
  score++;
  updateScore();
  animatePotato();
  updateLeaderboard();
});

function updateScore() {
  scoreDisplay.textContent = score;
}

function animatePotato() {
  potato.classList.add('press');
  setTimeout(() => potato.classList.remove('press'), 150);
}

function updateLeaderboard() {
  // تحديث أو إضافة اللاعب
  const existing = leaderboard.find(p => p.name === playerName);
  if(existing) {
    existing.points = score;
  } else {
    leaderboard.push({name: playerName, points: score});
  }
  // ترتيب حسب النقاط
  leaderboard.sort((a,b)=>b.points - a.points);
  renderLeaderboard();
}

function renderLeaderboard() {
  leaderboardList.innerHTML = '';
  leaderboard.forEach(p => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${p.name}</span><span>${p.points}</span>`;
    leaderboardList.appendChild(li);
  });
}
