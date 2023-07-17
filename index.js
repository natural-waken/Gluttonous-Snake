let box = document.querySelector('.box1')
let button = document.querySelector('.start')


let block = [];
// 食物对象
console.log(111);
class Food {
    constructor(x = 0, y = 0, color, width = 20, height = 20) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.ele = document.createElement('div');
    }

    // 初始化的方法
    init() {
        this.remove();
        console.log(333);
        // 设置食物的样式
        let div = this.ele;
        // console.log(this.ele);

        div.style.width = `20px`;
        div.style.height = `20px`;
        div.style.backgroundColor = `${getRandomColor()}`;
        div.style.position = `absolute`;
        div.style.borderRadius = `40%`

        // 随机生成坐标  边框  620 / 20  31 
        this.x = Math.floor(Math.random() * ((box.offsetWidth / this.width) - 1)) * this.width;
        this.y = Math.floor(Math.random() * ((box.offsetHeight / this.height) - 1)) * this.height;
        // console.log(this.x, this.y);

        // 设置食物的位置
        div.style.top = `${this.y}px`
        div.style.left = `${this.x}px`

        // 追加给 box
        box.appendChild(div)
        block.push(div);
    };

    // 删除食物
    remove() {

        for (let i = block.length; i > 0; i--) {
            let block1 = block[i - 1];
            // 在 DOM 里面删除
            block1.parentNode.removeChild(block1);

            // 在数组里面删除
            block.splice(i - 1, 1);
        }

    }
}

// let food1 = new Food()
// food1.init()



// 蛇对象
let element = [];
class Snake {
    constructor(width = 20, height = 20, direction = 'right') {
        this.width = width;
        this.height = height;
        this.direction = direction;

        // 蛇的身体  是一个数组 数组每个元素是一个对象 方块 蛇的身体的一部分
        this.body = [
            { x: 3, y: 1, color: 'red' },
            { x: 2, y: 1, color: 'orange' },
            { x: 1, y: 1, color: 'orange' }
        ]
    };

    // 蛇身体的初始化
    init() {
        // 第一次没有创建时候  进不了 for 循环
        // 每次初始化之前 先删除之前那个蛇
        this.remove();


        // for 循环  遍历蛇的身体每个部分
        for (let i = 0; i < this.body.length; i++) {
            // 蛇的身体的每个部分
            let obj = this.body[i];

            // 每次创建一个盒子结点  来构成蛇的身体每一个方块
            let div = document.createElement('div');
            div.style.width = `${this.width}px`;
            div.style.height = `${this.height}px`;
            div.style.backgroundColor = `${obj.color}`;
            div.style.borderRadius = `40%`;
            div.style.position = `absolute`;

            // 坐标
            div.style.left = `${(obj.x - 1) * this.width}px`;
            // div.style.top = `${(obj.y - 1) * this.height}px`;
            div.style.top = `${(obj.y - 1) * this.height}px`;

            // 追加给 box  显示在页面上
            box.appendChild(div);

            // 加入到 element 数组中去
            // 把每个 DOM 结点放到数组里面  到时候删除时删除这个
            // 这个数组里面都是 DOM 结点
            element.push(div);


        }
        // console.log(element);
    };

    // 移动小蛇
    move(food1) {
        // console.log(food1);

        // 这个循环里面是除了头部以外的部位  其他位置都成为前面那个
        for (let i = this.body.length - 1; i > 0; i--) {
            this.body[i].x = this.body[i - 1].x;
            this.body[i].y = this.body[i - 1].y;
        }

        // 头部的方向来确定头部的位置
        switch (this.direction) {
            case "right":
                this.body[0].x++;
                break;
            case "left":
                this.body[0].x--;
                break;
            case "up":
                this.body[0].y--;
                break;
            case "down":
                this.body[0].y++;
                break;
        }

        // 就是蛇头现在的位置坐标  距离左上两边框的
        let headX = (this.body[0].x - 1) * this.width;
        let headY = (this.body[0].y - 1) * this.height;

        // 食物坐标
        let foodX = food1.x;
        let foodY = food1.y;

        // 判断是否吃到食物
        if (headX === foodX && headY === foodY) {
            // 将最后一个的位置给 食物 加到蛇身体最后
            let last = this.body[this.body.length - 1];
            this.body.push(
                {
                    x: last.x,
                    y: last.y,
                    color: last.color
                }
            )

            // 再次创建一个食物
            food1.init();
        }
    }

    // 删除小蛇
    remove() {

        for (let i = element.length - 1; i >= 0; i--) {
            let ele = element[i];
            // console.log(ele);

            // 在 DOM 里面删除
            ele.parentNode.removeChild(ele);
            // 在数组里面删除
            element.splice(i, 1);
        }
    }
}


// let snake1 = new Snake()
// snake1.init()


// 游戏对象
let that;

class Game {
    constructor() {
        // this 指向 Game 
        this.food = new Food()
        this.snake = new Snake()
    };

    init() {
        // 食物 蛇初始化
        this.food.init();
        this.snake.init();

        // 跑动
        this.runSnake();

        // 键盘控制方向
        this.bindkey();

        // this.runSnake();
        // console.log(this);  // Game
        that = this;
    }

    // 跑动
    runSnake() {
        // 定时器 每隔 200 ms 就执行一次  蛇的速度
        let timeId = setInterval(function () {
            // console.log(this);  // window

            // that 指向 Game   这里 this 指向 window  不能使用 this 
            // 一移动就要初始化
            that.snake.move(that.food);
            that.snake.init();

            // 几个格子  620 / 20   31 
            let maxX = box.offsetWidth / that.snake.width;
            let maxY = box.offsetHeight / that.snake.height;

            // 头的坐标
            let headX = that.snake.body[0].x;
            let headY = that.snake.body[0].y;

            // 碰到墙
            if (headX <= 0 || headX >= maxX || headY <= 0 || headY >= maxY) {
                // 结束游戏
                clearInterval(timeId);
                alert('再见!');

                // 点击按钮 再次开始游戏
                button.addEventListener('click', function () {
                    game1 = new Game()
                    game1.init()
                })
            }

        }, 200)
    };

    bindkey() {
        // 键盘事件
        document.addEventListener('keydown', function (e) {
            // 判断方向
            switch (e.key) {
                case 'ArrowUp':
                    that.snake.direction = 'up';
                    break;
                case 'ArrowDown':
                    that.snake.direction = 'down';
                    break;
                case 'ArrowRight':
                    that.snake.direction = 'right';
                    break;
                case 'ArrowLeft':
                    that.snake.direction = 'left';
                    break;
            }
            console.log(2222);
        })
    }

}

button.addEventListener('click', function () {
    let game1 = new Game()
    game1.init()
})



// 随机颜色生成
function getRandomColor() {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    return `rgb(${r},${g},${b})`;
}
