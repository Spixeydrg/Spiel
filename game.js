class Player{
    constructor(name){
        this.name=name;
        this.age=0;
        this.health=80;
        this.happiness=80;
        this.intelligence=50;
        this.money=5000;
        this.job="Arbeitslos";
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
    }

    start(){
        const save=localStorage.getItem("lifeSimPhase3");
        if(save){
            this.player=Object.assign(new Player(),JSON.parse(save));
        }else{
            const name=prompt("Name?");
            this.player=new Player(name||"Alex");
            this.save();
        }
        this.render();
    }

    save(){
        localStorage.setItem("lifeSimPhase3",JSON.stringify(this.player));
    }

    ageUp(){
        const p=this.player;
        if(!p.alive)return;

        p.age++;

        // Kinder altern
        p.children.forEach(c=>c.age++);

        // Beziehung sinkt langsam
        if(p.partner) p.relationship -= 5;

        // Aktien schwanken
        this.stockPrice += Math.floor((Math.random()-0.5)*20);

        // Tod
        if(p.age>85 && Math.random()<0.4) this.die();

        this.checkAchievements();
        this.save();
        this.render();
    }

    die(){
        this.player.alive=false;
        alert("Du bist mit "+this.player.age+" gestorben.");
    }

    date(){
        if(this.player.partner){
            alert("Schon vergeben!");
            return;
        }
        this.player.partner="Partner";
        this.player.relationship=60;
        this.player.happiness+=15;
    }

    improveRelationship(){
        if(!this.player.partner)return;
        this.player.relationship+=10;
        this.player.happiness+=5;
    }

    haveChild(){
        if(!this.player.partner)return;
        this.player.children.push({age:0});
    }

    buyHouse(){
        if(this.player.money>=50000){
            this.player.money-=50000;
            this.player.house="Eigenheim";
        }
    }

    buyStock(){
        if(this.player.money>=this.stockPrice){
            this.player.money-=this.stockPrice;
            this.player.stocks++;
        }
    }

    sellStock(){
        if(this.player.stocks>0){
            this.player.money+=this.stockPrice;
            this.player.stocks--;
        }
    }

    becomeFamous(){
        if(this.player.intelligence>70){
            this.player.fame+=20;
            this.player.money+=20000;
        }
    }

    checkAchievements(){
        const p=this.player;
        if(p.money>100000 && !p.achievements.includes("Reich")){
            p.achievements.push("Reich");
        }
        if(p.fame>50 && !p.achievements.includes("Berühmt")){
            p.achievements.push("Berühmt");
        }
        if(p.age>=100 && !p.achievements.includes("100 Jahre")){
            p.achievements.push("100 Jahre");
        }
    }

    statBar(val,color){
        if(val<0)val=0;
        if(val>100)val=100;
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
            ${p.alive?
            `<button onclick="game.ageUp()">Nächstes Jahr</button>`:
            `<button onclick="localStorage.clear();location.reload()">Neues Leben</button>`}

            <button onclick="game.date()">Dating</button>
            <button onclick="game.improveRelationship()">Beziehung verbessern</button>
            <button onclick="game.haveChild()">Kind bekommen</button>
            <button onclick="game.buyHouse()">Haus kaufen</button>
            <button onclick="game.buyStock()">Aktie kaufen</button>
            <button onclick="game.sellStock()">Aktie verkaufen</button>
            <button onclick="game.becomeFamous()">Karriere pushen</button>
        </div>
        `;
    }
}

const game=new Game();
game.start();
