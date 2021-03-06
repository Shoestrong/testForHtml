function parabola(selector, start, end,callback) {
    // console.log(selector);
    // 默认顶点
    var vertex=20;
    // 速度
    var speed = 1.1;
    // 运动轨迹最高点top值
    var vtop = Math.min(start.top, end.top) - Math.abs(start.left - end.left) / 3;
    // 可能出现起点或者终点就是运动曲线顶点的情况
    if (vtop < vertex)vtop = Math.min(vertex, Math.min(start.top, end.top));

    var distance = Math.sqrt(Math.pow(start.top - end.top, 2) + Math.pow(start.left - end.left, 2)),
        // 元素移动次数
        steps = Math.ceil(Math.min(Math.max(Math.log(distance) / 0.05 - 75, 30), 100) / speed),
        ratio = start.top == vtop ? 0 : -Math.sqrt((end.top - vtop) / (start.top - vtop)),
        vleft = (ratio * start.left - end.left) / (ratio - 1),
        // 特殊情况，出现顶点left==终点left，将曲率设置为0，做直线运动。
        curvature = end.left == vleft ? 0 : (end.top - vtop) / Math.pow(end.left - vleft, 2);

    // 动画帧实现
    var count = 0;
    var animate = function() {
        // 计算left top值
        var left = start.left + (end.left - start.left) * count / steps,
            top = curvature == 0 ? start.top + (end.top - start.top) * count / steps : curvature * Math.pow(left - vleft, 2) + vtop;

        var css={};//提高性能人人有责

        // 运动过程中有改变大小
        if (end.width != null && end.height != null) {
            var i = steps / 2,
                width = end.width - (end.width - start.width) * Math.cos(count < i ? 0 : (count - i) / (steps - i) * Math.PI / 2),
                height = end.height - (end.height - start.height) * Math.cos(count < i ? 0 : (count - i) / (steps - i) * Math.PI / 2);
            css.width=width + "px";
            css.height=height + "px";
            css.fontSize=Math.min(width, height) + "px";
            
        }
        css.left=left + "px";
        css.top=top + "px";

        $(selector).css(css);

        count++;
        // 定时任务
        var time = window.requestAnimationFrame($.proxy(animate, this));
        if (count == steps) {
            window.cancelAnimationFrame(time);
            if(callback!=undefined)callback();
        }
    };
    // 开始
    $(selector).css({
        left:start.left+"px",
        top:start.top+"px"
    });
    animate();
}