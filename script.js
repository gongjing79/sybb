document.addEventListener("DOMContentLoaded", function() {
    // ---------------------- 图片懒加载 ----------------------
    const lazyImages = document.querySelectorAll(".lazy");
    const lazyBg = document.querySelector(".inspire-bg");
    const observerOptions = { root: null, rootMargin: "0px", threshold: 0.1 };

    const loadImage = (img) => {
        if(img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.add("loaded");
            img.classList.remove("lazy");
        }
        // 励志板块背景图懒加载
        if(img === lazyBg && img.dataset.bg) {
            img.style.backgroundImage = `url(${img.dataset.bg})`;
            img.classList.add("loaded");
        }
    };

    if ("IntersectionObserver" in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadImage(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        lazyImages.forEach(img => imageObserver.observe(img));
        if(lazyBg) imageObserver.observe(lazyBg);
    } else {
        lazyImages.forEach(img => loadImage(img));
        if(lazyBg) loadImage(lazyBg);
    }

    // ---------------------- 图片点击放大 ----------------------
    window.showBigImg = function(el) {
        const modal = document.getElementById("imgModal");
        let imgSrc = "";
        // 区分普通图片和背景图
        if(el.tagName === "IMG") {
            imgSrc = el.src;
        } else if(el.classList.contains("inspire")) {
            imgSrc = el.querySelector(".inspire-bg").dataset.bg;
        }
        if(imgSrc) {
            modal.innerHTML = `<img src="${imgSrc}" class="modal-img">`;
            modal.style.display = "flex";
            // 禁止页面滚动
            document.body.style.overflow = "hidden";
        }
    };

    window.closeModal = function() {
        const modal = document.getElementById("imgModal");
        modal.style.display = "none";
        // 恢复页面滚动
        document.body.style.overflow = "auto";
    };

    // ---------------------- 回到顶部 ----------------------
    const backToTopBtn = document.getElementById("backToTop");
    window.addEventListener("scroll", () => {
        backToTopBtn.classList.toggle("show", window.scrollY > 300);
    });
    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // ---------------------- 大数据可视化图表 ----------------------
    // 1. 技能掌握程度饼图
    const pieChart = echarts.init(document.getElementById('pieChart'));
    pieChart.setOption({
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '0%',
            left: 'center'
        },
        series: [
            {
                name: '技能掌握度',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 20,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: 90, name: 'Python' },
                    { value: 85, name: 'MySQL数据库' },
                    { value: 75, name: 'java' },
                    { value: 80, name: 'web前端' },
                    { value: 70, name: '数据采集与预处理' }
                ]
            }
        ]
    });

    // 2. 周学习时长柱状图
    const barChart = echarts.init(document.getElementById('barChart'));
    barChart.setOption({
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '时长(h)'
            }
        ],
        series: [
            {
                name: '大数据学习',
                type: 'bar',
                barWidth: '60%',
                data: [4, 3, 2.5, 5, 4, 2, 1]
            }
        ]
    });

    // 自适应窗口大小变化
    window.addEventListener('resize', function() {
        pieChart.resize();
        barChart.resize();
    });

    // ---------------------- 新增：留言板功能 ----------------------
    // 1. 初始化加载留言
    const msgList = document.getElementById('msgList');
    let messages = JSON.parse(localStorage.getItem('blogMessages')) || [];
    renderMessages();

    // 2. 表单提交事件
    const msgForm = document.getElementById('msgForm');
    msgForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const useremail = document.getElementById('useremail').value.trim();
        const msgContent = document.getElementById('msgContent').value.trim();

        // 生成留言时间
        const now = new Date();
        const timeStr = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        // 添加新留言
        const newMsg = {
            username,
            useremail,
            content: msgContent,
            time: timeStr
        };
        messages.unshift(newMsg); // 最新留言在最前面
        localStorage.setItem('blogMessages', JSON.stringify(messages)); // 保存到本地存储
        renderMessages(); // 重新渲染留言
        msgForm.reset(); // 重置表单

        // 提示提交成功
        alert('留言提交成功！');
    });

    // 3. 渲染留言列表
    function renderMessages() {
        if(messages.length === 0) {
            msgList.innerHTML = '<div class="empty-tip">暂无留言，快来抢沙发吧～</div>';
            return;
        }

        let html = '';
        messages.forEach(msg => {
            html += `
                <div class="msg-item">
                    <div class="msg-header">
                        <span class="msg-username">${msg.username}</span>
                        <span class="msg-time">${msg.time}</span>
                    </div>
                    <div class="msg-content">${msg.content}</div>
                </div>
            `;
        });
        msgList.innerHTML = html;
    }
});