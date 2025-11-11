
const nameInput = document.getElementById("nameInput");
const clickBtn = document.getElementById("clickBtn");
const potatoImg = document.getElementById("potatoImg");
const squishAudio = document.getElementById("squish");
const myCountEl = document.getElementById("myCount");
const greeting = document.getElementById("greeting");
const playerNameSpan = document.getElementById("playerName");
const leaderboardList = document.getElementById("leaderboardList");

let myCount = 0;
let playerName = "";

nameInput.addEventListener("change", () => {
  const v = nameInput.value.trim();
  if (!v) return;
  playerName = v;
  playerNameSpan.textContent = playerName;
  greeting.style.display = "block";
  loadLeaderboard();
});

async function sendClick() {
  if (!playerName) return alert("اكتب اسمك أولاً!");
  try {
    await fetch("/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: playerName })
    });
    myCount++;
    myCountEl.textContent = myCount;
    loadLeaderboard();
  } catch (e) {
    console.error(e);
  }
}

clickBtn.addEventListener("click", () => {
  // visual squash
  potatoImg.style.transform = "scale(0.92) translateY(4px)";
  setTimeout(() => potatoImg.style.transform = "", 120);
  // play sound
  squishAudio.currentTime = 0;
  squishAudio.play();
  sendClick();
});

async function loadLeaderboard() {
  try {
    const res = await fetch("/leaderboard");
    const data = await res.json();
    leaderboardList.innerHTML = data.map((u, i) => {
      return `<li><span>${i+1}. ${escapeHtml(u.name)}</span><strong>${u.count} كبسات</strong></li>`;
    }).join("");
  } catch (e) {
    console.error(e);
  }
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[s]));
}

// initial load
loadLeaderboard();
