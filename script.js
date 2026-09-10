const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const menuBtn=$("#menuBtn"), sidebar=$("#sidebar"), modal=$("#gameModal"), gameArea=$("#gameArea"), gameTitle=$("#gameTitle");
let lang=localStorage.getItem("tiger-lang")||"ar";
const defaults={bg:"#07111f",accent:"#00e5ff"};

function applyLang(){
  document.documentElement.lang=lang; document.documentElement.dir=lang==="ar"?"rtl":"ltr";
  $$("[data-ar]").forEach(el=>el.textContent=el.dataset[lang]);
  $("#arBtn").classList.toggle("active",lang==="ar"); $("#enBtn").classList.toggle("active",lang==="en");
}
function applyColors(){
  document.documentElement.style.setProperty("--bg",localStorage.getItem("tiger-bg")||defaults.bg);
  document.documentElement.style.setProperty("--accent",localStorage.getItem("tiger-accent")||defaults.accent);
  $("#bgColor").value=localStorage.getItem("tiger-bg")||defaults.bg;
  $("#accentColor").value=localStorage.getItem("tiger-accent")||defaults.accent;
}
applyColors();applyLang();$("#year").textContent=new Date().getFullYear();

menuBtn.onclick=()=>{sidebar.classList.toggle("open");menuBtn.setAttribute("aria-expanded",sidebar.classList.contains("open"))};
$$(".nav-item").forEach(b=>b.onclick=()=>{sidebar.classList.remove("open");document.getElementById(b.dataset.section).scrollIntoView({behavior:"smooth"});$$(".nav-item").forEach(x=>x.classList.remove("active"));b.classList.add("active")});
$$("[data-go]").forEach(b=>b.onclick=()=>document.getElementById(b.dataset.go).scrollIntoView({behavior:"smooth"}));
$("#bgColor").oninput=e=>{localStorage.setItem("tiger-bg",e.target.value);applyColors()};
$("#accentColor").oninput=e=>{localStorage.setItem("tiger-accent",e.target.value);applyColors()};
$("#arBtn").onclick=()=>{lang="ar";localStorage.setItem("tiger-lang",lang);applyLang()};
$("#enBtn").onclick=()=>{lang="en";localStorage.setItem("tiger-lang",lang);applyLang()};
$("#resetBtn").onclick=()=>{localStorage.removeItem("tiger-bg");localStorage.removeItem("tiger-accent");localStorage.removeItem("tiger-lang");lang="ar";applyColors();applyLang()};

function openGame(type){
 modal.classList.add("show");modal.setAttribute("aria-hidden","false");
 if(type==="ttt") startTTT(); if(type==="clicker") startClicker(); if(type==="snake") startSnake();
}
$$("[data-game]").forEach(b=>b.onclick=()=>openGame(b.dataset.game));
$("#closeModal").onclick=closeModal; modal.onclick=e=>{if(e.target===modal)closeModal()};
function closeModal(){modal.classList.remove("show");modal.setAttribute("aria-hidden","true");gameArea.innerHTML=""}

function startTTT(){
 gameTitle.textContent=lang==="ar"?"إكس أو":"Tic Tac Toe";
 let board=Array(9).fill(""),over=false;
 gameArea.innerHTML=`<div class="game-status" id="status"></div><div class="ttt" id="ttt"></div><button class="restart">${lang==="ar"?"إعادة اللعب":"Restart"}</button>`;
 const grid=$("#ttt"),status=$("#status");
 function render(){grid.innerHTML="";board.forEach((v,i)=>{let b=document.createElement("button");b.textContent=v;b.onclick=()=>move(i);grid.appendChild(b)});}
 function msg(t){status.textContent=t}
 function win(p){return [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]].some(a=>a.every(i=>board[i]===p))}
 function move(i){if(board[i]||over)return;board[i]="X";render();if(win("X"))return end(lang==="ar"?"أنت كسبت! 🎉":"You win! 🎉");if(!board.includes(""))return end(lang==="ar"?"تعادل!":"Draw!");setTimeout(ai,250)}
 function ai(){let free=board.map((v,i)=>v?null:i).filter(x=>x!==null);let i=free[Math.floor(Math.random()*free.length)];board[i]="O";render();if(win("O"))end(lang==="ar"?"الكمبيوتر كسب!":"Computer wins!");else if(!board.includes(""))end(lang==="ar"?"تعادل!":"Draw!")}
 function end(t){over=true;msg(t)}
 $(".restart").onclick=startTTT;msg(lang==="ar"?"أنت X":"You are X");render();
}
function startClicker(){
 gameTitle.textContent=lang==="ar"?"اضغط بسرعة":"Click Rush";
 gameArea.innerHTML=`<div class="score" id="score"></div><button class="click-big" id="clickBig">0</button><div class="game-status" id="timer"></div>`;
 let score=0,time=10,started=false,done=false;
 const btn=$("#clickBig"),scoreEl=$("#score"),timer=$("#timer");
 function update(){scoreEl.textContent=(lang==="ar"?"النقاط: ":"Score: ")+score;timer.textContent=(lang==="ar"?"الوقت: ":"Time: ")+time+"s"}
 btn.onclick=()=>{if(done)return;if(!started){started=true;const iv=setInterval(()=>{time--;update();if(time<=0){clearInterval(iv);done=true;btn.disabled=true;timer.textContent=lang==="ar"?"انتهى الوقت!":"Time's up!";}},1000)}score++;update()};
 update();
}
function startSnake(){
 gameTitle.textContent=lang==="ar"?"الثعبان":"Snake";
 gameArea.innerHTML=`<div class="snake-wrap"><div class="game-status" id="snakeScore"></div><canvas class="snake-canvas" id="snake" width="300" height="300"></canvas><button class="restart">${lang==="ar"?"إعادة اللعب":"Restart"}</button></div>`;
 const c=$("#snake"),ctx=c.getContext("2d"),cell=15,n=20;let snake=[{x:10,y:10}],food={x:5,y:5},dx=1,dy=0,alive=true,score=0;
 function place(){food={x:Math.floor(Math.random()*n),y:Math.floor(Math.random()*n)}}
 function draw(){ctx.clearRect(0,0,300,300);ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue("--accent");snake.forEach(p=>ctx.fillRect(p.x*cell,p.y*cell,cell-1,cell-1));ctx.fillStyle="#ff4d6d";ctx.fillRect(food.x*cell,food.y*cell,cell-1,cell-1);$("#snakeScore").textContent=(lang==="ar"?"النقاط: ":"Score: ")+score}
 function tick(){if(!alive)return;let h={x:snake[0].x+dx,y:snake[0].y+dy};if(h.x<0||h.y<0||h.x>=n||h.y>=n||snake.some(p=>p.x===h.x&&p.y===h.y)){alive=false;$("#snakeScore").textContent=(lang==="ar"?"انتهت اللعبة! النقاط: ":"Game over! Score: ")+score;return}snake.unshift(h);if(h.x===food.x&&h.y===food.y){score++;place()}else snake.pop();draw()}
 document.onkeydown=e=>{if(e.key==="ArrowUp"&&dy!==1){dx=0;dy=-1}if(e.key==="ArrowDown"&&dy!==-1){dx=0;dy=1}if(e.key==="ArrowLeft"&&dx!==1){dx=-1;dy=0}if(e.key==="ArrowRight"&&dx!==-1){dx=1;dy=0}};
 $(".restart").onclick=startSnake;draw();setInterval(tick,110);
}
