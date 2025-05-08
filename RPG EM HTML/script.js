const mapSize = 5;
const map = Array(mapSize).fill().map(() => Array(mapSize).fill(" "));
const logElement = document.getElementById("log");

let player = {
  x: 0,
  y: 0,
  hp: 100,
  maxHp: 100,
  xp: 0,
  level: 1,
  potions: 2,
  inventory: [],
  quests: [
    { name: "Derrote o primeiro inimigo", completed: false }
  ]
};

let enemy = {
  hp: 30,
  alive: true
};

function drawMap() {
  const mapDiv = document.getElementById("map");
  mapDiv.innerHTML = "";
  for (let y = 0; y < mapSize; y++) {
    for (let x = 0; x < mapSize; x++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      if (x === player.x && y === player.y) {
        cell.classList.add("player");
        cell.textContent = "👤";
      } else if (map[y][x] === "N") {
        cell.classList.add("npc");
        cell.textContent = "💬";
      } else {
        cell.textContent = "";
      }
      mapDiv.appendChild(cell);
    }
  }
}

function move(dx, dy) {
  const newX = player.x + dx;
  const newY = player.y + dy;
  if (newX >= 0 && newX < mapSize && newY >= 0 && newY < mapSize) {
    player.x = newX;
    player.y = newY;
    log("Você se moveu para (" + newX + ", " + newY + ")");
    drawMap();
  }
}

function attack() {
  if (!enemy.alive) {
    log("Nenhum inimigo para atacar.");
    return;
  }
  const damage = Math.floor(Math.random() * 20) + 5;
  enemy.hp -= damage;
  log("Você causou " + damage + " de dano!");
  document.getElementById("attackSound").play();
  if (enemy.hp <= 0) {
    log("Você derrotou o inimigo!");
    enemy.alive = false;
    player.xp += 10;
    checkLevelUp();
    player.quests[0].completed = true;
  }
  updateInfo();
}

function usePotion() {
  if (player.potions > 0 && player.hp < player.maxHp) {
    player.potions--;
    player.hp += 30;
    if (player.hp > player.maxHp) player.hp = player.maxHp;
    log("Você usou uma poção.");
    document.getElementById("potionSound").play();
    updateInfo();
  } else {
    log("Você não pode usar poção agora.");
  }
}

function updateInfo() {
  document.getElementById("playerHp").textContent = player.hp;
  document.getElementById("enemyHp").textContent = enemy.alive ? enemy.hp : "--";
  document.getElementById("level").textContent = player.level;
  document.getElementById("xp").textContent = player.xp;
  document.getElementById("potions").textContent = player.potions;
}

function checkLevelUp() {
  if (player.xp >= player.level * 10) {
    player.xp = 0;
    player.level++;
    player.maxHp += 10;
    player.hp = player.maxHp;
    log("Você subiu para o nível " + player.level + "!");
  }
}

function log(msg) {
  const p = document.createElement("p");
  p.textContent = msg;
  logElement.appendChild(p);
  logElement.scrollTop = logElement.scrollHeight;
}

function saveGame() {
  localStorage.setItem("rpgSave", JSON.stringify({ player, enemy }));
  log("Jogo salvo!");
}

function loadGame() {
  const data = JSON.parse(localStorage.getItem("rpgSave"));
  if (data) {
    player = data.player;
    enemy = data.enemy;
    log("Jogo carregado!");
    drawMap();
    updateInfo();
  } else {
    log("Nenhum jogo salvo encontrado.");
  }
}

function openShop() {
  log("🛒 Loja: Você pode comprar poções por 10 XP.");
}

function buyPotion() {
  if (player.xp >= 10) {
    player.potions++;
    player.xp -= 10;
    log("Você comprou uma poção.");
    updateInfo();
  } else {
    log("XP insuficiente para comprar poção.");
  }
}

function showInventory() {
  log("🎒 Inventário: " + (player.inventory.length > 0 ? player.inventory.join(", ") : "vazio"));
}

function talkToNpc() {
  const cell = map[player.y][player.x];
  if (cell === 'N') {
    log("💬 NPC: Olá, aventureiro! Continue completando missões para se tornar mais forte.");
  } else {
    log("❌ Não há NPC aqui.");
  }
}

function viewQuests() {
  if (player.quests.length === 0) {
    log("📜 Nenhuma missão ativa.");
  } else {
    log("📜 Missões ativas:");
    player.quests.forEach((q, index) => {
      log(`${index + 1}. ${q.name} - ${q.completed ? "✅ Concluída" : "⏳ Em andamento"}`);
    });
  }
}

function playMusic() {
  const bgMusic = document.getElementById("bgMusic");
  if (bgMusic.paused) {
    bgMusic.play().then(() => {
      log("🎶 Música iniciada!");
    }).catch((error) => {
      log("❌ Não foi possível tocar a música: " + error);
    });
  }
}

function pauseMusic() {
  const bgMusic = document.getElementById("bgMusic");
  bgMusic.pause();
  log("🔇 Música pausada!");
}

// Inicialização
map[2][2] = "N"; // posição de um NPC
updateInfo();
drawMap();
