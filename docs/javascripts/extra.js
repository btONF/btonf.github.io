window.onload = function () {
    // 定义 body 的 margin 由默认值 8px -> 0px
    document.body.style.margin = "0";
    document.body.style.background = "255,255,255";

    // 创建 canvas 画布
    document.body.appendChild(document.createElement('canvas'));
    var canvas = document.querySelector('canvas'),
        ctx = canvas.getContext('2d'); // ctx 返回一个在 canvas 上画图的 API/dom
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
    canvas.style.zIndex = '-1';
    ctx.lineWidth = .3;
    
    // 判断是否为移动端
    var isMobile = window.innerWidth <= 768;  // 可以根据实际需求调整

    // 定义鼠标覆盖范围
    var mousePosition = {
        x: 30 * canvas.width / 100,
        y: 30 * canvas.height / 100
    };

    var dots = {
        nb: Math.floor((canvas.width * canvas.height) / 3000), // 点的数量根据屏幕大小适配
        distance: 50,
        d_radius: 100,
        array: []
    };

    // 创建颜色类，Color 类返回字符串型 rgba（*,*,*,.8）
    function mixComponents(comp1, weight1, comp2, weight2) {
        return (comp1 * weight1 + comp2 * weight2) / (weight1 + weight2);
    }

    function averageColorStyles(dot1, dot2) {
        var color1 = dot1.color,
            color2 = dot2.color;

        var r = mixComponents(color1.r, dot1.radius, color2.r, dot2.radius),
            g = mixComponents(color1.g, dot1.radius, color2.g, dot2.radius),
            b = mixComponents(color1.b, dot1.radius, color2.b, dot2.radius);
        return createColorStyle(Math.floor(r), Math.floor(g), Math.floor(b));
    }

    function colorValue(min) {
        return Math.floor(Math.random() * 255 + min);
    }

    function createColorStyle(r, g, b) {
        return 'rgba(' + r + ',' + g + ',' + b + ', 0.8)';  // 设置透明度，0.8 让点看起来更有荧光感
    }

    function Color(min) {
        min = min || 0;
        this.r = colorValue(min);
        this.g = colorValue(min);
        this.b = colorValue(min);
        this.style = createColorStyle(this.r, this.g, this.b);
    }

    // 创建 Dot 类以及一系列方法
    function Dot() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        this.vx = -.5 + Math.random();
        this.vy = -.5 + Math.random();

        this.radius = Math.random() * 2;  // 点的大小可以保持不变

        this.color = new Color();
    }

    Dot.prototype = {
        draw: function () {
            ctx.beginPath();
            ctx.fillStyle = this.color.style;
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.fill();
        }
    };

    function moveDots() {  // Dot 对象的移动
        for (var i = 0; i < dots.nb; i++) {
            var dot = dots.array[i];

            if (dot.y < 0 || dot.y > canvas.height) {
                dot.vx = dot.vx;
                dot.vy = -dot.vy;
            }
            else if (dot.x < 0 || dot.x > canvas.width) {
                dot.vx = -dot.vx;
                dot.vy = dot.vy;
            }
            dot.x += dot.vx;
            dot.y += dot.vy;
        }
    }

    function connectDots() {  // Dot 对象的连接
        if (isMobile) return; // 在移动端不显示连线

        for (var i = 0; i < dots.nb; i++) {
            for (var j = i; j < dots.nb; j++) {
                var i_dot = dots.array[i];
                var j_dot = dots.array[j];

                if ((i_dot.x - j_dot.x) < dots.distance && (i_dot.y - j_dot.y) < dots.distance && (i_dot.x - j_dot.x) > -dots.distance && (i_dot.y - j_dot.y) > -dots.distance) {
                    if ((i_dot.x - mousePosition.x) < dots.d_radius && (i_dot.y - mousePosition.y) < dots.d_radius && (i_dot.x - mousePosition.x) > -dots.d_radius && (i_dot.y - mousePosition.y) > -dots.d_radius) {
                        ctx.beginPath();
                        ctx.strokeStyle = averageColorStyles(i_dot, j_dot);
                        ctx.moveTo(i_dot.x, i_dot.y);
                        ctx.lineTo(j_dot.x, j_dot.y);
                        ctx.stroke();  // 绘制定义的路线
                        ctx.closePath();  // 创建从当前点回到起始点的路径
                    }
                }
            }
        }
    }

    function createDots() {  // 创建 nb 个 Dot 对象
        for (var i = 0; i < dots.nb; i++) {
            dots.array.push(new Dot());
        }
    }

    function drawDots() {  // 引用 Dot 原型链，使用 draw 方法，在 canvas 上画出 Dot 对象
        for (var i = 0; i < dots.nb; i++) {
            var dot = dots.array[i];
            dot.draw();
        }
    }

    function animateDots() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);  // 清除画布，否则线条会连在一起
        moveDots();
        connectDots();
        drawDots();
        requestAnimationFrame(animateDots);
    }

    createDots();  // 使用创建 Dot 类函数
    requestAnimationFrame(animateDots);  // 使用 canvas 独有的 60Hz 刷新屏幕画布的方法

    document.querySelector('body').addEventListener('mousemove', function (e) {
        mousePosition.x = e.pageX;
        mousePosition.y = e.pageY;
    });

    document.querySelector('body').addEventListener('mouseleave', function (e) {  // 鼠标离开时，连接自动返回到画布中心
        mousePosition.x = canvas.width / 2;
        mousePosition.y = canvas.height / 2;
    });

};
