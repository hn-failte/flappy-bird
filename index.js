let context;
let canvas = document.getElementsByTagName("canvas")[0];
let count = document.getElementsByClassName("count")[0];
let score = document.getElementsByClassName("score")[0];
let result = document.getElementsByClassName("result")[0];

//定义游戏难度
const easy = {
	fallSpeed: 32,
	pipeHeight: 470,
	baseHeight: -250,
	rPosY: 150,
	n: 1
}
const middle = {
	fallSpeed: 28,
	pipeHeight: 455,
	baseHeight: -260,
	rPosY: 140,
	n: 2
}
const hard = {
	fallSpeed: 24,
	pipeHeight: 440,
	baseHeight: -270,
	rPosY: 130,
	n: 3
}
const debug = {
	fallSpeed: 24,
	pipeHeight: 500,
	baseHeight: -240,
	rPosY: 180,
	n: 10
}
//当前游戏难度
var gameLevel = middle;

//分数
var marks = 0;

var arr = [];
var timer = null

context = canvas.getContext("2d");

canvas.width = 900
canvas.height = 600

//定义bird对象
var bird = {
	birdH: 48,
	birdW: 48,
	posX: 100,
	posY: 100,
	body: "",
	resetBody: () => {
		let img = new Image();
		img.src = "images/bird0_0.png";
		bird.body = img;
	},
	fly: () => {
		bird.posY -= 60;
		let img = new Image();
		img.src = "images/bird0_2.png";
		bird.body = img;
	},
	die: () => {
		result.innerHTML = "分数：" + marks;
		count.style.display = "block";
		clearInterval(timer)
		timer = null
	},
	birdFall: () => {
		//判断bird的body是否填充
		if (bird.body == "") {
			bird.resetBody();
		}
		//清除上一帧
		context.clearRect(bird.posX, bird.posY,
			bird.posX + bird.birdW, bird.posY + bird.birdH);
		bird.posY += 1;
		//重新绘制
		context.drawImage(bird.body, bird.posX, bird.posY);
		if (bird.posY >= 400 - bird.birdH || bird.posY < 0) {
			bird.die();
		}
	}
}
//操作监听
canvas.addEventListener("mouseup", bird.fly);
canvas.addEventListener("mousedown", bird.resetBody);

//pipe数组
var pipes = new Array();
//创建pipe构造函数
var pipe = function() {
	this.pipeH = 320;
	this.pipeW = 52;
	this.posX = 500;
	this.posY = gameLevel.baseHeight + Math.random() * gameLevel.rPosY;
	this.imgA = new Image();
	this.imgB = new Image();
	this.imgA.src = "images/pipe_down.png";
	this.imgB.src = "images/pipe_up.png";
	this.move = () => {
		//清除上部分pipe的上一帧
		context.clearRect(this.posX, 0,
			this.posX + this.pipeW, this.posY + this.pipeH);
		//清除下部分pipe的上一帧
		context.clearRect(this.posX, this.posY + gameLevel.pipeHeight,
			this.posX + this.pipeW, 400);
		//移动pipe
		this.posX -= 1;
		//重新绘制
		context.drawImage(this.imgA, this.posX, this.posY);
		context.drawImage(this.imgB, this.posX, this.posY + gameLevel.pipeHeight);

		//判断pipe是否到达终点
		if (this.posX <= 0) {
			context.clearRect(0, 0, 52, 400);
		}

		//判断bird是否碰撞到pipe
		if (this.posX < bird.posX + bird.birdW &&
			this.posX + this.pipeW > bird.posX) {
			if (bird.posY <= this.posY + this.pipeH ||
				bird.posY + bird.birdH >= this.posY + gameLevel.pipeHeight)
				bird.die();
		}

		//判断是否成功通过
		if (bird.posX > this.posX + this.pipeW - 2 &&
			bird.posX < this.posX + this.pipeW + 2) {
			marks+=gameLevel.n;
			score.innerHTML = "得分：" + marks;
		}
	};
}

function restart() {
	location.reload();
}

function run() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	bird.birdFall()
	if (arr.length < 4 && (!arr[arr.length] || (arr[arr.length] && arr[arr.length].posX < 150))) arr.push(new pipe());
	for(let i = 0; i < arr.length; i++) arr[i].move();
	console.log(arr)
}

~(function main () {
	timer = setInterval(run, 60)
})()
