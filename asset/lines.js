/**
 * 立即执行函数表达式，创建私有作用域，函数内部变量不会污染全局作用域
 */
!(function() {
    // 封装方法，压缩之后减少文件大小
    function getAttribute(node, attr, defaultValue) {
        return node.getAttribute(attr) || defaultValue;
    }

    // 封装方法，压缩之后减少文件大小
    function getByTagName(name) {
        return document.getElementsByTagName(name);
    }

    // 获取配置参数
    function getConfigOption() {
        const scripts = getByTagName("script");
        const script = scripts[scripts.length - 1]; // 当前加载的 script
        return {
            l: scripts.length, // 长度，用于生成 id 用
            z: getAttribute(script, "zIndex", -1), // z-index
            o: getAttribute(script, "opacity", 0.6), // opacity
            c: getAttribute(script, "color", "255,255,255"), // color
            n: getAttribute(script, "count", 200) // 生成点的数量
        };
    }

    // 设置 canvas 的高宽，取最先非零的值作为画布的宽度和高度
    function setCanvasSize(canvas) {
        const canvasWidth = canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        const canvasHeight = canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        return { width: canvasWidth, height: canvasHeight };
    }

    // 绘制过程
    function drawCanvas(canvas, context, randomPoints, allArray) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        // 遍历处理每一个点,forEach接受一个函数
        randomPoints.forEach(function(point, index) {
            point.x += point.xa;//坐标+=随机移动方向
            point.y += point.ya; // 移动
            point.xa *= (point.x > canvas.width || point.x < 0 ? -1 : 1);
            point.ya *= (point.y > canvas.height || point.y < 0 ? -1 : 1); // 碰到边界，反向反弹
            context.fillRect(point.x - 0.5, point.y - 0.5, 1, 1); // 绘制一个宽高为1的点，绘制一个填充的矩形

            // 从下一个点开始
            for (let i = index + 1; i < allArray.length; i++) {
                const node = allArray[i];
                // 当前点存在
                if (node.x !== null && node.y !== null) {
                    const xDist = point.x - node.x; // x 轴距离
                    const yDist = point.y - node.y; // y 轴距离
                    const dist = xDist * xDist + yDist * yDist; // 总距离

                    if (dist < node.max) {//小于最大长度
                        if (node === currentPoint && dist >= node.max / 2) {
                            point.x -= 0.03 * xDist;
                            point.y -= 0.03 * yDist; // 靠近的时候加速
                        }
                        const diameter = (node.max - dist) / node.max;//直径
                        context.beginPath();
                        context.lineWidth = diameter / 2;
                        context.strokeStyle = "#000000";
                        context.moveTo(point.x, point.y);//移动坐标
                        context.lineTo(node.x, node.y);//从当前位置到指定目标绘制线段
                        context.stroke();//绘制路径
                    }
                }
            }
        });

        requestAnimationFrame(()=>drawCanvas(canvas, context, randomPoints, allArray));//为执行动画的API指定函数
    }

    // 创建画布，并添加到 body 中
    const thisCanvas = document.createElement("canvas");
    const config = getConfigOption();//获得一些配置信息
    const canvasId = "c_n" + config.l;
    const context = thisCanvas.getContext("2d");//获取2d图像
    let randomPoints = [];
    let currentPoint = {
        x: null, // 当前鼠标 x
        y: null, // 当前鼠标 y
        max: 20000 // 圈半径的平方
    };

    thisCanvas.id = canvasId;
    thisCanvas.style.cssText = `position:fixed;top:0;left:0;z-index:${config.z};opacity:${config.o}`;//设置透明度和z-index信息
    document.body.appendChild(thisCanvas);
    // 初始化画布大小
    const { width: canvasWidth, height: canvasHeight } = setCanvasSize(thisCanvas);

    // 监听鼠标位置存储，离开的时候，释放当前位置信息
    window.addEventListener('mousemove', function(event) {
        event = event || window.event;
        currentPoint.x = event.clientX;
        currentPoint.y = event.clientY;
    });

    window.addEventListener('mouseout', function() {
        currentPoint.x = null;
        currentPoint.y = null;
    });

    // 随机生成 config.n 条线位置信息
    for (let i = 0; config.n > i; i++) {
        const x = Math.random() * canvasWidth; // 随机位置
        const y = Math.random() * canvasHeight;
        const xa = 2 * Math.random() - 1; // 随机运动方向
        const ya = 2 * Math.random() - 1;
        // 随机点
        randomPoints.push({
            x: x,
            y: y,
            xa: xa,
            ya: ya,
            max: 6000 // 沾附距离,对象表示法
        });
    }
    const allArray = randomPoints.concat([currentPoint]);//拼接形成一个新数组

    // 0.1 秒后绘制
    setTimeout(() => drawCanvas(thisCanvas, context, randomPoints, allArray), 100);//间隔0.1s执行一次
})();
