function getMonthDifference(startDate, endDate) {
  const years = endDate.getFullYear() - startDate.getFullYear();
  const months = endDate.getMonth() - startDate.getMonth();
  const days = endDate.getDate() - startDate.getDate();

  let monthDiff = years * 12 + months;

  // 如果当前日期的天数小于出生日期的天数，则认为未满一个月
  if (days < 0) {
    monthDiff--;
  }

  return monthDiff;
}

// 补贴计算功能 - 修正版
function calculateSubsidy() {
  const birthDate = document.getElementById("birth-date").value;

  if (!birthDate) {
    showNotification("请选择孩子的出生日期", "warning");
    return;
  }
  const birth = new Date(birthDate);

  const policyStart = new Date("2025-01-01");

  const ageInMonths = getMonthDifference(birth, policyStart);
  console.log(ageInMonths);
  if (ageInMonths > 36) {
    showNotification("很抱歉，该政策仅适用于3周岁以下的婴幼儿", "error");
    return;
  }

  // 计算补贴
  let totalAmount = 0;
  let subsidyMonths = 0;
  let calculationDetails = "";

  if (birth >= policyStart) {
    // 2025年1月1日及以后出生的孩子
    subsidyMonths = 36; // 满3年
    totalAmount = 36 * 300; // 10800元
    calculationDetails = `
            <div class="detail-item">
                <strong>💰 计算说明</strong>
                <p>🎉 孩子出生于2025年1月1日后，可享受完整的3年补贴期。</p>
                <p>📊 补贴期限：36个月 × 300元/月 = 10,800元</p>
            </div>
        `;
  } else {
    // 2025年1月1日前出生的孩子
    const birthYear = birth.getFullYear();
    const birthMonth = birth.getMonth() + 1; // getMonth()返回0-11，需要+1
    const birthDay = birth.getDate();

    // 计算从出生到2025年1月1日的月数（政策前的月数）
    const monthsBeforePolicy = Math.floor(
      (policyStart - birth) / (1000 * 60 * 60 * 24 * 30.44)
    );

    // 剩余补贴月数 = 总补贴期限36个月 - 政策前已过的月数
    subsidyMonths = Math.max(1, 36 - monthsBeforePolicy);

    totalAmount = subsidyMonths * 300;

    // 损失的补贴金额
    const lostAmount = monthsBeforePolicy * 300;

    calculationDetails = `
            <div class="detail-item">
                <strong>📋 计算说明</strong>
                <p>📅 孩子出生于${birthYear}年${birthMonth}月${birthDay}日，政策实施前已出生。</p>
                <p>⏰ 政策前已过月数：${monthsBeforePolicy}个月（不享受补贴）</p>
                <p>💸 损失金额：${lostAmount.toLocaleString()}元</p>
                <p>⏳ 剩余补贴期限：36 - ${monthsBeforePolicy} = ${subsidyMonths}个月</p>
                <p>💰 实际可领：${subsidyMonths}个月 × 300元/月 = ${totalAmount.toLocaleString()}元</p>
            </div>
        `;
  }

  // 显示结果动画
  showResults(totalAmount, subsidyMonths, calculationDetails);
}

// 显示结果的动画函数
function showResults(totalAmount, subsidyMonths, calculationDetails) {
  const calculatorCard = document.getElementById("calculator-card");
  const resultCard = document.getElementById("result-card");
  const resultSection = document.getElementById("result-section");

  // 隐藏计算表单，显示结果
  calculatorCard.classList.add("hidden");
  resultCard.classList.remove("hidden");

  // 显示庆祝消息
  showCelebrationMessage(totalAmount);

  // 先隐藏结果区域
  resultSection.style.opacity = "0";
  resultSection.style.transform = "translateY(20px)";

  // 数字动画效果
  animateNumber("total-amount", 0, totalAmount, 1000);
  animateNumber("subsidy-months", 0, subsidyMonths, 800);

  // 显示计算详情
  document.getElementById("calculation-details").innerHTML = calculationDetails;

  // 结果区域淡入动画
  setTimeout(() => {
    resultSection.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
    resultSection.style.opacity = "1";
    resultSection.style.transform = "translateY(0)";
  }, 200);

  // 根据金额触发礼炮特效
  if (totalAmount > 0) {
    setTimeout(() => {
      createConfettiEffect();
    }, 800);
  }

  // 成功提示
  showNotification("计算完成！", "success");
}

// 数字动画函数
function animateNumber(elementId, start, end, duration) {
  const element = document.getElementById(elementId);
  const startTime = performance.now();

  function updateNumber(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // 使用缓动函数
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(start + (end - start) * easeOutQuart);

    if (elementId === "total-amount") {
      element.textContent = current.toLocaleString() + "元";
    } else {
      element.textContent = current + "个月";
    }

    if (progress < 1) {
      requestAnimationFrame(updateNumber);
    }
  }

  requestAnimationFrame(updateNumber);
}

// 通知系统
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;

  const icons = {
    success: "✅",
    warning: "⚠️",
    error: "❌",
    info: "ℹ️",
  };

  notification.innerHTML = `
        <span class="notification-icon">${icons[type]}</span>
        <span class="notification-message">${message}</span>
    `;

  document.body.appendChild(notification);

  // 显示动画
  setTimeout(() => {
    notification.classList.add("show");
  }, 100);

  // 自动隐藏
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// FAQ 切换功能
function toggleFaq(element) {
  const faqItem = element.parentElement;
  const answer = faqItem.querySelector(".faq-answer");

  // 关闭其他打开的FAQ
  document.querySelectorAll(".faq-item").forEach((item) => {
    if (item !== faqItem) {
      item.classList.remove("active");
      item.querySelector(".faq-answer").classList.remove("active");
    }
  });

  // 切换当前FAQ
  faqItem.classList.toggle("active");
  answer.classList.toggle("active");
}

// 页面加载完成后的初始化
document.addEventListener("DOMContentLoaded", function () {
  // 设置日期输入框的默认最大值为今天
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("birth-date").setAttribute("max", today);

  // 添加页面加载动画
  initPageAnimations();

  // 添加交互效果
  initInteractiveEffects();

  // 添加样式
  addCustomStyles();
});

// 页面加载动画
function initPageAnimations() {
  const calculatorCard = document.querySelector(".calculator-card");
  const header = document.querySelector(".header");

  // 初始状态
  calculatorCard.style.opacity = "0";
  calculatorCard.style.transform = "translateY(30px) scale(0.95)";
  header.style.opacity = "0";
  header.style.transform = "translateY(-20px)";

  // 动画进入
  setTimeout(() => {
    header.style.transition = "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
    header.style.opacity = "1";
    header.style.transform = "translateY(0)";
  }, 200);

  setTimeout(() => {
    calculatorCard.style.transition = "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
    calculatorCard.style.opacity = "1";
    calculatorCard.style.transform = "translateY(0) scale(1)";
  }, 400);
}

// 交互效果
function initInteractiveEffects() {
  // 输入框焦点动画
  const input = document.getElementById("birth-date");
  input.addEventListener("focus", function () {
    this.parentElement.style.transform = "scale(1.02)";
    this.parentElement.style.transition = "transform 0.3s ease";
  });

  input.addEventListener("blur", function () {
    this.parentElement.style.transform = "scale(1)";
  });

  // 按钮点击波纹效果
  const button = document.querySelector(".btn-calculate");
  button.addEventListener("click", function (e) {
    createRippleEffect(e, this);
  });

  // 鼠标跟随效果
  document.addEventListener("mousemove", function (e) {
    const cursor = document.querySelector(".custom-cursor");
    if (cursor) {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    }
  });
}

// 波纹效果
function createRippleEffect(e, element) {
  const ripple = document.createElement("span");
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;

  ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    `;

  element.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 600);
}

// 添加自定义样式
function addCustomStyles() {
  const style = document.createElement("style");
  style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 10px;
            transform: translateX(100%);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 1000;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-success {
            border-left: 4px solid #10b981;
        }
        
        .notification-warning {
            border-left: 4px solid #f59e0b;
        }
        
        .notification-error {
            border-left: 4px solid #ef4444;
        }
        
        .notification-info {
            border-left: 4px solid #3b82f6;
        }
        
        .notification-icon {
            font-size: 1.2rem;
        }
        
        .notification-message {
            font-weight: 500;
            color: #2d3748;
        }
        
        .result-item {
            animation: slideInRight 0.5s ease-out;
            animation-fill-mode: both;
        }
        
        .result-item:nth-child(2) {
            animation-delay: 0.1s;
        }
        
        .result-item:nth-child(3) {
            animation-delay: 0.2s;
        }
        
        .result-item:nth-child(4) {
            animation-delay: 0.3s;
        }
        
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        .info-card {
            animation: fadeInUp 0.6s ease-out;
            animation-fill-mode: both;
        }
        
        .info-card:nth-child(2) {
            animation-delay: 0.2s;
        }
        
        .info-card:nth-child(3) {
            animation-delay: 0.4s;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .detail-item {
            animation: fadeIn 0.5s ease-out;
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
    `;
  document.head.appendChild(style);
}

// 表单验证
function validateBirthDate() {
  const birthDate = document.getElementById("birth-date").value;
  if (birthDate) {
    const birth = new Date(birthDate);
    const now = new Date();
    const threeYearsAgo = new Date();
    threeYearsAgo.setFullYear(now.getFullYear() - 3);

    if (birth < threeYearsAgo) {
      document.getElementById("birth-date").style.borderColor = "#ef4444";
      return false;
    } else {
      document.getElementById("birth-date").style.borderColor = "#e2e8f0";
      return true;
    }
  }
  return true;
}

// 添加出生日期验证
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("birth-date")
    .addEventListener("change", validateBirthDate);
});
// 显示庆祝消息
function showCelebrationMessage(amount) {
  const celebrationText = document.getElementById("celebration-text");
  let message = "";
  let level = "";

  if (amount >= 10000) {
    message = "🎉 哇！满额补贴！太让人羡慕了！";
    level = "level-5";
  } else if (amount >= 8000) {
    message = "😍 补贴金额很不错呢！真是太幸福了！";
    level = "level-4";
  } else if (amount >= 5000) {
    message = "👏 还不错的补贴呢！挺让人羡慕的！";
    level = "level-3";
  } else if (amount >= 2000) {
    message = "😊 有补贴总是好的！聊胜于无！";
    level = "level-2";
  } else if (amount > 0) {
    message = "🤏 补贴不多，但蚊子腿也是肉！";
    level = "level-1";
  } else {
    message = "😢 很遗憾，暂时没有补贴...";
    level = "level-1";
  }

  celebrationText.textContent = message;
  celebrationText.className = `celebration-text ${level}`;
}

// 创建礼炮特效
function createConfettiEffect() {
  console.log("🎊 礼炮特效开始！"); // 调试用

  const colors = [
    "#f39c12",
    "#e74c3c",
    "#3498db",
    "#2ecc71",
    "#9b59b6",
    "#f1c40f",
    "#ff6b6b",
    "#4ecdc4",
    "#45b7d1",
    "#96ceb4",
    "#feca57",
    "#ff9ff3",
  ];
  const confettiCount = 100; // 增加数量

  for (let i = 0; i < confettiCount; i++) {
    setTimeout(() => {
      const confetti = document.createElement("div");
      confetti.className = "confetti";

      // 设置位置
      confetti.style.position = "fixed";
      confetti.style.left = Math.random() * window.innerWidth + "px";
      confetti.style.top = "-20px"; // 从屏幕顶部开始
      confetti.style.zIndex = "9999";

      // 设置颜色
      confetti.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];

      // 随机大小
      const size = Math.random() * 12 + 8;
      confetti.style.width = size + "px";
      confetti.style.height = size + "px";

      // 随机形状
      if (Math.random() > 0.5) {
        confetti.style.borderRadius = "50%";
      }

      // 添加到页面
      document.body.appendChild(confetti);

      console.log("🎊 创建了一个礼炮元素"); // 调试用

      // 5秒后移除
      setTimeout(() => {
        if (confetti.parentNode) {
          confetti.remove();
        }
      }, 5000);
    }, i * 20); // 减少间隔
  }

  // 播放庆祝音效
  playSuccessSound();
}

// 播放成功音效
function playSuccessSound() {
  try {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.5
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (e) {
    // 如果浏览器不支持Web Audio API，就忽略音效
    console.log("Audio not supported");
  }
}
// 测试礼炮特效（可以在控制台调用）
function testConfetti() {
  createConfettiEffect();
}
// 重置计算器
function resetCalculator() {
  //刷新页面
  location.reload();
}

// 生成分享图功能
function generateShareImage() {
  const canvas = document.getElementById("shareCanvas");
  const ctx = canvas.getContext("2d");

  // 设置画布尺寸 (适合社交媒体分享的尺寸)
  canvas.width = 800;
  canvas.height = 1000;

  // 获取计算结果数据
  const totalAmount = document.getElementById("total-amount").textContent;
  const subsidyMonths = document.getElementById("subsidy-months").textContent;
  const birthDate = document.getElementById("birth-date").value;

  // 创建渐变背景
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#667eea");
  gradient.addColorStop(0.5, "#764ba2");
  gradient.addColorStop(1, "#f093fb");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 添加半透明覆盖层
  ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 绘制装饰性圆圈
  drawDecorativeCircles(ctx, canvas.width, canvas.height);

  // 绘制主要内容
  drawShareImageContent(ctx, canvas.width, canvas.height, {
    totalAmount,
    subsidyMonths,
    birthDate,
  });

  // 下载图片
  downloadShareImage(canvas);

  // 显示成功提示
  showNotification("分享图生成成功！", "success");
}

// 绘制装饰性圆圈
function drawDecorativeCircles(ctx, width, height) {
  const circles = [
    { x: width * 0.1, y: height * 0.15, radius: 60, alpha: 0.1 },
    { x: width * 0.9, y: height * 0.25, radius: 40, alpha: 0.15 },
    { x: width * 0.2, y: height * 0.8, radius: 80, alpha: 0.08 },
    { x: width * 0.85, y: height * 0.7, radius: 50, alpha: 0.12 },
  ];

  circles.forEach((circle) => {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${circle.alpha})`;
    ctx.fill();
  });
}

// 绘制分享图主要内容
function drawShareImageContent(ctx, width, height, data) {
  // 设置文本样式
  ctx.textAlign = "center";
  ctx.fillStyle = "#ffffff";

  // 标题
  ctx.font = "bold 48px Inter, sans-serif";
  ctx.fillText("🍼 育儿补贴计算结果", width / 2, 120);

  // 副标题
  ctx.font = "24px Inter, sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  ctx.fillText("2025年国家育儿补贴政策", width / 2, 170);

  // 主要结果区域背景
  const resultBoxY = 220;
  const resultBoxHeight = 400;

  // 绘制结果背景框
  ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
  ctx.roundRect(60, resultBoxY, width - 120, resultBoxHeight, 20);
  ctx.fill();

  // 绘制结果内容
  ctx.fillStyle = "#2d3748";

  // 出生日期
  if (data.birthDate) {
    ctx.font = "bold 28px Inter, sans-serif";
    ctx.fillText("孩子出生日期", width / 2, resultBoxY + 60);

    ctx.font = "32px Inter, sans-serif";
    ctx.fillStyle = "#667eea";
    const formattedDate = new Date(data.birthDate).toLocaleDateString("zh-CN");
    ctx.fillText(formattedDate, width / 2, resultBoxY + 100);
  }

  // 总金额 - 突出显示
  ctx.fillStyle = "#10b981";
  ctx.font = "bold 36px Inter, sans-serif";
  ctx.fillText("总计可领取", width / 2, resultBoxY + 160);

  ctx.font = "bold 64px Inter, sans-serif";
  ctx.fillStyle = "#059669";
  ctx.fillText(data.totalAmount, width / 2, resultBoxY + 230);

  // 补贴期限
  ctx.fillStyle = "#2d3748";
  ctx.font = "bold 28px Inter, sans-serif";
  ctx.fillText("补贴期限", width / 2, resultBoxY + 290);

  ctx.font = "36px Inter, sans-serif";
  ctx.fillStyle = "#667eea";
  ctx.fillText(data.subsidyMonths, width / 2, resultBoxY + 330);

  // 政策说明
  ctx.fillStyle = "#4a5568";
  ctx.font = "20px Inter, sans-serif";
  ctx.fillText("每月300元 × 最长36个月", width / 2, resultBoxY + 370);

  // 底部信息
  const bottomY = height - 200;

  // 绘制底部背景
  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  ctx.roundRect(60, bottomY, width - 120, 120, 15);
  ctx.fill();

  // 政策信息
  ctx.fillStyle = "#2d3748";
  ctx.font = "bold 24px Inter, sans-serif";
  ctx.fillText("政策要点", width / 2, bottomY + 35);

  ctx.font = "18px Inter, sans-serif";
  ctx.fillStyle = "#4a5568";
  ctx.fillText("• 适用于3周岁以下婴幼儿", width / 2, bottomY + 65);
  ctx.fillText("• 2025年1月1日起实施", width / 2, bottomY + 90);

  // 生成时间和二维码区域
  const qrY = height - 60;
  ctx.font = "16px Inter, sans-serif";
  ctx.fillStyle = "#64748b";
  ctx.textAlign = "left";
  ctx.fillText(`生成时间: ${new Date().toLocaleString("zh-CN")}`, 80, qrY);

  // 右下角添加小图标
  ctx.textAlign = "right";
  ctx.font = "20px Inter, sans-serif";
  ctx.fillText("💰📊", width - 80, qrY);
}

// Canvas roundRect polyfill (兼容性处理)
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (
    x,
    y,
    width,
    height,
    radius
  ) {
    this.beginPath();
    this.moveTo(x + radius, y);
    this.lineTo(x + width - radius, y);
    this.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.lineTo(x + width, y + height - radius);
    this.quadraticCurveTo(
      x + width,
      y + height,
      x + width - radius,
      y + height
    );
    this.lineTo(x + radius, y + height);
    this.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.lineTo(x, y + radius);
    this.quadraticCurveTo(x, y, x + radius, y);
    this.closePath();
  };
}

// 下载分享图
function downloadShareImage(canvas) {
  try {
    // 创建下载链接
    const link = document.createElement("a");
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
    link.download = `育儿补贴计算结果_${timestamp}.png`;

    // 转换为blob并创建URL
    canvas.toBlob(
      function (blob) {
        const url = URL.createObjectURL(blob);
        link.href = url;

        // 触发下载
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 清理URL
        setTimeout(() => URL.revokeObjectURL(url), 100);
      },
      "image/png",
      0.95
    );
  } catch (error) {
    console.error("生成分享图失败:", error);
  }
}
