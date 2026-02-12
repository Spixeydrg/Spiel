/* =========================
   PLAYER & SYSTEME
========================= */

class Player{
    constructor(name){
        this.name=name;
        this.age=18;
        this.health=80;
        this.happiness=80;
        this.intelligence=50;
        this.money=5000;
        this.fame=0;

        this.partner=null;
        this.relationship=0;
        this.children=[];

        this.house=null;
        this.stocks=0;

        this.achievements=[];
        this.alive=true;
    }
}

class Game{
    constructor(){
        this.player=null;
        this.stockPrice=100;

        this.houses=[
            {name:"Kleine Wohnung", price:50000},
            {name:"Villa", price:200000},
            {name:"Penthouse", price:500000}
        ];

        this.potentialPartners=[
            {name:"Alex", looks:70, intelligence:60},
            {name:"Sam", looks:80, intelligence:50},
            {name:"Taylor", looks:60, intelligence:70},
            {name:"Jordan", looks:75, intelligence:65}
        ];
    }

    start(){
        const save=localStorage.getItem("lifeSimPhase4");
        if(save){
            this.player=Object.assign(new Player(),JSON.parse(save));
        }else{
            const name=prompt("Dein Name?");
            this.player=new Player(name||"Player");
            this.save();
        }
        this.render();
    }

    save(){
        localStorage.setItem("lifeSimPhase4",JSON.stringify(this.player));
    }

    ageUp(){
        const p=this.player;
        if(!p.alive) return;

        p.age++;
        p.children.forEach(c=>c.age++);

        if(p.partner) p.relationship -= 5; // Beziehung sinkt langsam
        this.stockPrice += Math.floor((Math.random()-0.5)*20);

        if(p.age>85 && Math.random()<0.4) this.die();
        this.checkAchievements();
        this.save();
        this.render();
    }

    die(){
        this.player.alive=false;
        alert(`${this.player.name} ist mit ${this.player.age} Jahren gestorben.`);
    }

    /* ========== HÄUSER SYSTEM ========== */
    openHouseModal(){
        const houseDiv=document.getElementById("houseContent");
        houseDiv.innerHTML="<h3>Häuser kaufen</h3>";
        this.houses.forEach((h,i)=>{
            const btn=document.createElement("button");
            btn.innerText=`${h.name} - ${h.price}€`;
            btn.onclick=()=>{
                if(this.player.money>=h.price){
                    this.player.money-=h.price;
                    this.player.house=h.name;
                    alert(`Du hast ${h.name} gekauft!`);
                    this.closeHouseModal();
                    this.save();
                    this.render();
                }else{
                    alert("Zu wenig Geld!");
                }
            };
            houseDiv.appendChild(btn);
        });
        document.getElementById("houseModal").style.display="flex";
    }
    closeHouseModal(){
        document.getElementById("houseModal").style.display="none";
    }

    /* ========== DATING SYSTEM ========== */
    openDatingModal(){
        const datingDiv=document.getElementById("datingContent");
        datingDiv.innerHTML="<h3>Partner auswählen</h3>";
        this.potentialPartners.forEach((p)=>{
            const btn=document.createElement("button");
            btn.innerText=`${p.name} (Looks:${p.looks} Intelligence:${p.intelligence})`;
            btn.onclick=()=>{
                this.player.partner=p.name;
                this.player.relationship=50;
                this.player.happiness+=15;
                alert(`Du bist jetzt mit ${p.name} zusammen!`);
                this.closeDatingModal();
                this.save();
                this.render();
            };
            datingDiv.appendChild(btn);
        });
        document.getElementById("datingModal").style.display="flex";
    }
    closeDatingModal(){
        document.getElementById("datingModal").style.display="none";
    }

    /* ========== KINDER SYSTEM ========== */
    haveChild(){
        if(!this.player.partner){
            alert("Du brauchst einen Partner!");
            return;
        }
        this.player.children.push({age:0});
        this.player.happiness+=10;
        alert("Kind geboren!");
        this.save();
        this.render();
    }

    /* ========== AKTIEN SYSTEM ========== */
    buyStock(){
        if(this.player.money>=this.stockPrice){
            this.player.money-=this.stockPrice;
            this.player.stocks++;
            this.save();
            this.render();
        }else{
            alert("Zu wenig Geld!");
        }
    }
    sellStock(){
        if(this.player.stocks>0){
            this.player.money+=this.stockPrice;
            this.player.stocks--;
            this.save();
            this.render();
        }else{
            alert("Keine Aktien zum Verkaufen!");
        }
    }

    /* ========== FAME & ACHIEVEMENTS ========== */
    checkAchievements(){
        const p=this.player;
        if(p.money>100000 && !p.achievements.includes("Reich")) p.achievements.push("Reich");
        if(p.fame>50 && !p.achievements.includes("Berühmt")) p.achievements.push("Berühmt");
        if(p.age>=100 && !p.achievements.includes("100 Jahre")) p.achievements.push("100 Jahre");
    }

    /* ========== UTILS ========== */
    statBar(val,color){
        if(val<0) val=0;
        if(val>100) val=100;
        return `<div class="statbar" style="width:${val}%;background:${color}"></div>`;
    }

    render(){
        const p=this.player;
        document.getElementById("game").innerHTML=`
        <div class="card">
            <h2>${p.name} (${p.age})</h2>
            <p>💰 ${Math.floor(p.money)}€</p>
            <p>⭐ Fame: ${p.fame}</p>
            <p>🏠 Haus: ${p.house||"Keins"}</p>
            <p>📈 Aktien: ${p.stocks} (Preis: ${this.stockPrice}€)</p>
            <p>❤️ Partner: ${p.partner||"Keiner"} (${p.relationship})</p>
            <p>👶 Kinder: ${p.children.length}</p>
            <p>🏆 Achievements: ${p.achievements.join(", ")}</p>
        </div>

        <div class="card">
            ❤️ ${this.statBar(p.health,"red")}
            😊 ${this.statBar(p.happiness,"yellow")}
            🧠 ${this.statBar(p.intelligence,"blue")}
        </div>

        <div class="card">
            ${p.alive ? 
            `<button onclick="game.ageUp()">Nächstes Jahr</button>` : 
            `<button onclick="localStorage.clear(); location.reload()">Neues Leben</button>`}

            <button onclick="game.openDatingModal()">Dating</button>
            <button onclick="game.haveChild()">Kind bekommen</button>
            <button onclick="game.openHouseModal()">Haus kaufen</button>
            <button onclick="game.buyStock()">Aktie kaufen</button>
            <button onclick="game.sellStock()">Aktie verkaufen</button>
        </div>
        `;
    }
}

const game=new Game();
game.start();

/* Modals schließen, wenn man außerhalb klickt */
window.onclick = function(e){
    if(e.target.id==="datingModal") game.closeDatingModal();
    if(e.target.id==="houseModal") game.closeHouseModal();
}
