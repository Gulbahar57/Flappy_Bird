//pour avoir accès au board 1.
let board;
let boardWidth = 360; //ici j'élargie ma couleur avec mon js, width permet de définir ou de renvoyer la largeur de mon élément.
// elle n'a d'effet que sur les éléments de niveau bloc ou sur les éléments ayant une position absolue ou fixe. 
let boardHeight = 640; //ici je définie la hauteur de mon élément, width et height sont liés. 
let context; //on va l'utiliser pour dessiner dans notre canvas.
// les nombres choisis dans width et height sont fait exprès par rapport à l'image que j'ai enregistré pour le background
//1.une fois mon canvas fait, je vais mettre mon 2. flappybird.

//2. bird
let birdWidth =45 ; //dimensions de l'image = 360/268 = 13/8 ensuite on fait X2.
let birdHeight = 35;
let birdX = boardWidth/8; //pour décaler le bird on fait la largeur/8 pour qu'il sois un peu décalé.
let birdY = boardHeight/2; //on veut que le bird apparaisse sur la gauche au milieu, donc il faut faire la hauteur /2.
let birdImg; //on veut placer dans le rectangle qu'on a créé en bas avec context fill, le bird, pour ça je déclare cette variable, et je vais continuer en bas dans ma fonction. 

let bird = { //ici on a notre objet bird avec ses 4 paramètres mtn nous allons dessiner le bird. 
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight,
}

// 3. dessiner les tuyaux 
//Tout au long du jeu, nous allons générer ces tuyaux et nous avons besoin de tous les suivre parce que nous avons plusieurs tuyaux,
//nous avons donc besoin d'utiliser un tableau pour les stocker. Créons donc un tableau.

let pipeArray = [];
let pipeWidth = 60;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg; //je veux mettre les photos de mes tuyaux donc je dois déclarer mes variables
let bottomPipeImg; 

//3. pour que mes tuyaux bougent sur la gauche et pour qu'ils apparaissent je vais faire : 
let velocityX = -2; //ca c'est la vitesse du tuyau qui va bouger 
let velocityY = -1; //c'est la vitesse du jump de l'oiseau
let gravity = 0.2; //gravité 

let gameOver = false; //pour activer le game over
let score = 0; //pour le score

//1.
window.onload = function(){
    board = document.getElementById("board"); //on prends l'élément avec l'ID board ce qui est dans le HTML le canvas tag.
    board.height = boardHeight; //j'accède à la propriété height de l'objet board que j'assigne à ma valeur boardHeight.
    board.width = boardWidth; //j'accède à la propriété width de l'objet board que j'assigne à ma valeur boardwidth.
    context = board.getContext("2d"); //utilisé pour dessiner dans le board.

    // 2. on continue de dessiner le flappybird ici.
    //context.fillStyle="green" // ça va changer le stylo en vert. 
    //context.fillRect(bird.x, bird.y, bird.width, bird.height); //pour dessiner le bird on va commencer par un rectangle pour se faire<<<<<<<<<<<<<
    //une fois que j'ai mis mon image je peux enlever le rectangle qui ne me sert à rien.

    //on va mtn charger l'image
    birdImg = new Image(); //ici j'assigne que birdImg va être une nouvelle image
    birdImg.src = "./flappybird.png"; //je lie la source de cette image
    birdImg.onload = function() { //onload va permettre de télécharger l'image sur la page, afin de dessiner l'image je dois donc ouvrir une fonction avec les paramètres suivants ci-dessous.
    context.drawImage(birdImg, bird.x, bird.y, bird.height, bird.width); //pour dessiner l'image on doit <<<
}
//ici on va appeler la fonction update.

topPipeImg = new Image();
topPipeImg.src = "./topipe.png"; //je lie ma tof 

bottomPipeImg = new Image();
bottomPipeImg.src = "./bottompipe.png";


requestAnimationFrame(update);
// il faut que je créé une fonction pour que mes images de tuyaux se génère sur la page web.
setInterval(placePipes, 900); //ici c'est 1000 msc qui est égal à 1sc
};
document.addEventListener("keydown", moveBird); //a chaque fois qu'on va appeler la clé ca va appeler le mouvement de l'oiseau

function update(){ //cette fonction va nous servir d'update les cadres de la toile, ca va redessiner la toile encore et encore. C'est notre boucle principale du jeu.
requestAnimationFrame(update);
if (gameOver) {
    return;
}
context.clearRect(0, 0, board.width, board.height); //quand on voudra toujours update notre cadre, on voudra nettoyer l'ancien cadre donc pour ça<<<<<<<< clearRect ca va couvrir toute la toile commençant de 0, 0 
// qui est le coin supérieur gauche de la toile. Si on ne fait pas ça les cadres vont s'empiler les uns sur les autres.
//dedans cette fonction on va dessiner le bird encore et encore pour chaque cadre.

velocityY += gravity;
//bird.y += velocity
bird.y = Math.max(bird.y+velocityY,0); //ca applique la gravité pour le bird.y, ca limite l'oiseau.y en haut du canvas
context.drawImage(birdImg, bird.x, bird.y, bird.height, bird.width)

if (bird.y > board.height){
    gameOver = true; //ici j'ouvre un if si mon perso tombe en bas sans collision le jeu est game over.
}

//tuyaux update en créant une boucle for
for (let i = 0; i <pipeArray.length; i++){
    let pipe = pipeArray[i];
    pipe.x += velocityX; //cette commande a permis d'activer le mouvement de mes tuyaux
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
if (!pipe.passed && bird.x > pipe.x + pipe.width) { //ici c'est pour le score
    score += 0.5; //0.5 pck il y a deux tuyaux donc 0.5*2 = 1, 1 pour chaque tuyaux
    pipe.passed = true;
}


if (detectCollision(bird, pipe)) {
    gameOver = true; //fonction pour demander au jeu dès qu'il détecte une collision la variable gameOver s'active. 
}
}
//enlever tuyau
while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
    pipeArray.shift(); //ça permet d'effacer le tuyau quand tu as fini de le passer
}


//score
context.fillStyle = "white"; //ça sera la couleur pour le score
context.font="45px sans-serif"; //c'est le style du score
context.fillText(score, 5, 45); 

if (gameOver) {
    context.fillText("GAME OVER", 5, 90); //ici if gameover un text game over va s'afficher en haut à gauche, 5 c'est la position x et l'autre y
}
}

//je déclare ma fonction placePipes d'en haut.
function placePipes(){
    if (gameOver) {
        return;
    }
    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2); // ici je fais un déplacement de mes tuyaux, pour que la taille soit plus courte.
    //math random retourne une valeur entre 0 et 1, et j'ai multiplié avec pipeH/2
    //donc si random retourne 0 on va avoir notre Y position négatif 120 pixel ce qui est pipeH/4
    // et si on a math random qui retourne 1 > -128pixel - 256 pcq pipe height = 512/2=256.
    let openingSpace = board.height/4; //ca va suffir pour que l'oiseau voyage entre


    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false //ça va vérifier si le bird a passé le tuyau
    } //donc mtn que nous avons notre type objet je vais l'ajouter à mon tableau

    pipeArray.push(topPipe); //donc toutes les 1.5sc on va appeler notre fonction placePipes et ça va ajouter un nouveau tuyeau à notre tableau comme on l'a défini plus en haut avec
    // setInterval.

    //similaire au top pipe je vais déclarer le tuyau d'en bas
    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace //ici mon but c'est de faire l'espace entre les tuyaux.
        ,width : pipeWidth,
        height : pipeHeight,
        passed : false
    };
    pipeArray.push(bottomPipe);
};

//pour faire sauter l'oiseau il faut faire négatif pcq en haut c'est 0 dont négatif et en bas positif.
// il va faire -6 -6 -6 c'est pour le saut trois fois en haut, mais avec la gravité ca va être
// -6 -4 -2 0 et pour descendre en bas vu que c'est +, on fait 2 4 6 8.

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX"){
        //jump
        velocityY = -6;

        // pour remettre à 0 le jeu
        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

//pour rendre le jeu cohérent il faut ajouter les collisions 
function detectCollision(a, b){
    return a.x < b.x + b.width && 
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y; //tout ca c'est la logique pour checker les collisions entre les deux rectangles
}

