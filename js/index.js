window.addEventListener('load', function () {
    // 封装获取元素的函数
    function $(clssName) {
        return document.querySelector(clssName)
    }
    // offsetTop,Left来获取dom元素的位置属性
    // 游戏tip效果制作
    var wellcomeh = $(".wellcome h4");
    var wellcome = $(".wellcome");
    var cha = $(".cha");
    var game = $(".game")
    // 点击cha关闭tip
    cha.addEventListener('click', function () {
        wellcome.style.display = "none";
    })
    // 鼠标移动tip
    wellcomeh.addEventListener('mousedown', function (e) {
        e.stopPropagation();
        var starX = e.pageX - game.offsetLeft;
        console.log(starX);
        var starY = e.pageY - game.offsetTop;
        console.log(starY);
        function movew(e) {
            var moveX = e.pageX;
            var moveY = e.pageY;
            wellcome.style.left = moveX - starX + "px";
            wellcome.style.top = moveY - starY + "px";
        }
        document.addEventListener('mousemove', movew)
        document.addEventListener('mouseup', function () {
            document.removeEventListener("mousemove", movew);
        })
    })
    //  定义全局变量
    var s = false;//s为游戏状态 s ==>flase(游戏为关闭状态)  , true ==> 游戏开始
    var stop = $(" .gameon .stop");
    //  点击btn按钮开始游戏==>即gameStart盒子隐藏，gameon盒子显示
    var btn = $(".btn");
    var gameStart = $(".gameStart");
    var gameon = $(".gameon");
    btn.addEventListener('click', function () {
        //  alert(11)
        gameStart.style.display = "none";
        gameon.style.display = "block";
        stop.children[0].src = "images/开始按钮.png";
    })
    //  点击暂停，开始按钮
    stop.addEventListener('click', function () {
        if (!s) {
            stop.children[0].src = "images/暂停按钮.png";
            birdFly(false);
            // 存储按键的阿斯可马值
            var keyC;
            document.addEventListener('keyup', function (e) {
                keyC = e.keyCode;
                if (keyC == 32) {
                    birdFly(true);
                }
            });
            create();
            continueGame();
        } else {
            stop.children[0].src = "images/开始按钮.png";
            Stop();
        }
        s = !s;
    })
    // 定义小鸟飞翔函数，假如不对小鸟进行操作，小鸟会进行自由落体（flag==>false),小鸟飞翔(flag==>true)
    var bird = $(".bird");
    var line = $(".banner");
    var lineTop = line.offsetTop;
    var flyH = 30;
    var birdImg = bird.children[0];
    function birdFly(flag) {
        clearInterval(bird.timer);
        delete bird.timer;
        var end = bird.offsetTop - flyH;
        var speed = flag ? -1.6 : 1.5;
        bird.timer = setInterval(function () {
            var birdTop = bird.offsetTop;
            if (birdTop <= 0) {
                speed = 1.5;
            }
            if (birdTop == end) {
                speed = 1.5;
                bird.style.top = birdTop + speed + "px"
            } else {
                bird.style.top = Math.min(lineTop - bird.offsetHeight, birdTop + speed) + "px";
                if (speed > 0) {
                    birdImg.src = "images/down.gif";
                }
                else if (speed < 0) {
                    birdImg.src = "images/up.gif";
                }
                if (birdTop >= lineTop - bird.offsetHeight) {
                    birdImg.src = "images/bird.gif";
                    clearInterval(bird.timer);
                    bird.timer = undefined;
                }
            }
            impact();
        }, 10)
    }
    console.log();
    // 管道随机高度
    var pipes = $(".pipes");
    // 上下管道的间距
    var distance = 2.5;
    // 所有管道的地址池
    var allpipes = [];
    function randH() {
        return Math.floor(Math.random() * (960 - 84 - 24 - 120 - 120 - 200 + 1));
    }
    // 单位时间创建管道
    function create() {
        cra = setInterval(function () {
            createPipe();
        }, 1900)
    }
    // 创建管道
    function createPipe() {
        var div = document.createElement("div");
        div.className = "p";
        var randupmod = randH() / 80;
        // 是否需要检测小鸟和管道的碰撞
        div.s = true;
        // console.log(randupmod);
        var randdownmod = 12 - 1.05 - 0.3 - distance - randupmod - 1.5 - 1.5;
        // es6写法
        div.innerHTML = `<div class="up"><div class="up_mod" style = "height:${randupmod}rem"></div><div class="up_pipe"></div></div><div class="down"><div class="down_pipe"></div><div class="down_mod" style = "height:${randdownmod}rem"></div>`;
        pipes.appendChild(div);
        move(div);
        allpipes.push(div);
    }
    // 分数
    var scores = $(".scores");
    var score = 0;
    // 管道运动
    function move(p) {
        var speed = -2;
        p.timer = setInterval(function () {
            var birdLeft = bird.offsetLeft;
            var pLeft = p.offsetLeft;
            var upW = allpipes[0].children[0].offsetWidth;
            // console.log(upW);
            // console.log(pLeft);
            if (pLeft <= -124) {
                clearInterval(p.timer);
                p.timer = undefined;
                pipes.removeChild(p);
                allpipes.splice(0, 1);
            } else {
                p.style.left = pLeft + speed + "px";
                if (pLeft + speed <= birdLeft - upW && p.s) {
                    p.s = false;
                    score++;
                    scores.innerHTML = score;
                }
            }
            impact();
        }, 10)
    }
    function impact() {
        var birdTop = bird.offsetTop;
        for (i = 0; i < allpipes.length; i++) {
            if (allpipes[i].s) {
                var birdLeft = bird.offsetLeft;
                var birdW = bird.offsetWidth;
                var pLeft = allpipes[i].offsetLeft;
                var upH = allpipes[i].children[0].offsetHeight;
                var upW = allpipes[i].children[0].offsetWidth;
                var dis = allpipes[i].children[1].offsetTop - upH
                var birdH = bird.offsetHeight
                if (birdLeft + birdW >= pLeft && birdLeft <= pLeft + upW && (birdTop <= upH || birdTop + birdH >= upH + dis)) {
                    gameover();
                    s = false;
                }
            }
        }
    }
    // 得分模块
    var scoresCarp = $(".scoresCarp");
    var scorec = $(".score");
    var btnc = $(".btnc")
    // 游戏结束
    function gameover() {
        clearInterval(cra);
        clearInterval(bird.timer);
        document.onkeyup = null;
        for (var i = allpipes.length - 1; i >= 0; i--) {
            clearInterval(allpipes[i].timer);
            pipes.removeChild(allpipes[i]);
        }
        allpipes = [];
        gameStart.style.display = "block";
        gameon.style.display = "none";
        // 返回得分
        scorec.innerHTML = score + "分";
        score = 0;
        scores.innerHTML = 0;
        scoresCarp.style.display = "block";
    }
    // 游戏暂停
    function Stop() {
        clearInterval(cra);
        clearInterval(bird.timer);
        document.onkeyup = null;
        for (var i = 0; i < allpipes.length; i++) {
            clearInterval(allpipes[i].timer);
        }
    }
    // 游戏继续
    function continueGame() {
        for (var i = 0; i < allpipes.length; i++) {
            move(allpipes[i]);
        }
    }
    // 点击确定关闭得分模块
    btnc.addEventListener('click', function () {
        scoresCarp.style.display = "none";
    })
})