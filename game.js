const colors = ["#00ff00", "00ff7f", "20b2aa", "7fff00", "32cd32", "2e8b57"];

class GameObject {
    constructor(game, x = 0, y = 0){

    }

    draw(ctx){

    }

    update(delta){

    }

    handleMouseDown(x, y){

    }
}

class Bubble extends GameObject {

    constructor(size = null, color = null, x = 0, y = 0, velocity = 0){
        super(x, y);
        if(size === null){
            this.size = Math.random() * 50.0;            
        } else {
            this.size = size;
        }

        if(color === null){
            this.color = colors[Math.floor(Math.random() * colors.length)];            
        } else {
            this.color = color;
        }

        if(velocity == 0){
            this.velocity = 0.1 * (Math.floor(Math.random() * 5) + 1);
        } else {
            this.velocity = velocity;
        }

        this.x = x; 
        this.y = y;
    }

    get points() {
        return parseInt(this.size) * 10;
    }

    draw(ctx){                  
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2.0 * Math.PI);
        ctx.fill(); 
        ctx.closePath();       
    }

    update(delta){
        this.y -= this.velocity * delta;        
    }

    handleMouseDown(x, y){
        const dist = Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2));        
        if(dist <= this.size){            
            return true;
        }
        return false;
    }
}

class Bomb extends GameObject {

}

class ExtraLife extends GameObject {

}

class Game {
    constructor(canvasId) {
        this.update = this.update.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.togglePause = this.togglePause.bind(this);

        this.canvas = document.getElementById(canvasId);
        this.scorelabel = document.querySelectorAll("#options p")[1];
        this.lifescore = document.getElementById("lives");
        this.pausebutton = document.getElementById("pause");

        this.canvas.addEventListener("mousedown", this.handleMouseDown);
        this.pausebutton.addEventListener("click", this.togglePause);

        this.canvas.width = 300;
        this.canvas.height = 600;
       
        this.setup();        
    }

    setup(){
        this.gameObjects = [];
        this.lastTimestemp = null;
        this.running = true;
        this.score = 0;
        this.lives = 3;
        this.countdown = 0;        
        
        window.requestAnimationFrame(this.update);
    }

    update(timestemp){
        if(this.lastTimestemp == null || !this.running){
            this.lastTimestemp = timestemp;
        }

        const delta = timestemp - this.lastTimestemp;
        this.lastTimestemp = timestemp;        

        const ctx = this.canvas.getContext("2d");
        
        if(this.countdown <= 0){
            this.createBubble();
            this.countdown = (Math.floor(Math.random() * 1000) + 600);
        } else {
            this.countdown -= delta;
        }     
               
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); 
         
        const copy = this.gameObjects.slice();
        this.gameObjects = [];

        for(const gameObject of copy){
            if(this.running){
                gameObject.update(delta);                                   
            }       
            if(gameObject.y > 0.0 - gameObject.size){
                this.gameObjects.push(gameObject);
            } else {
                this.lives -= 1;
            }               

            gameObject.draw(ctx);                        
        }
        
        this.scorelabel.innerText = this.score; 
        this.lifescore.innerText = this.lives;

        window.requestAnimationFrame(this.update);
    }
 
    createBubble(){
        const bubble = new Bubble();        
        bubble.x = Math.random() * (this.canvas.clientWidth - 0) + 0;
        bubble.y = this.canvas.clientHeight - bubble.size;
        this.gameObjects.push(bubble);                  
    }

    handleMouseDown(event){        
        const copy = this.gameObjects.slice();

        for(const gameObject of copy){
            if(gameObject.handleMouseDown(event.x, event.y)){      
                if(this.running){
                    this.gameObjects.splice(this.gameObjects.indexOf(gameObject), 1);                
                    this.score += gameObject.points;
                }                                          
            }
        }
    }

    togglePause(){
        this.running = !this.running;
    }

    lost(){

    }
}
