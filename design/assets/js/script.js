/* File: assets/js/script.js
   Description: 流星精選網 核心腳本
*/

document.addEventListener('DOMContentLoaded', () => {

    // 1. 響應式導航菜單 (Mobile Menu Toggle)
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.main-nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            // 切換 active class 來顯示/隱藏菜單
            nav.classList.toggle('active');
            
            // 更改漢堡圖標為 'X'
            if (nav.classList.contains('active')) {
                menuToggle.innerHTML = '✖'; // 關閉圖標
            } else {
                menuToggle.innerHTML = '☰'; // 漢堡圖標
            }
        });
    }

    // 2. 標記當前頁面導航
    // 獲取當前頁面的路徑，例如 "/products.html"
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.main-nav li a');

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        // 如果是首頁 (index.html 或空路徑)
        if (currentPage === '' && (linkPage === 'index.html' || linkPage === '')) {
            link.classList.add('active');
        } 
        // 其他頁面
        else if (currentPage === linkPage && currentPage !== '') {
            link.classList.add('active');
        }
    });


    // 3. 商品詳情頁倒數計時器 (Countdown Timer)
    const countdownElement = document.getElementById('countdown-timer');
    
    if (countdownElement) {
        // 設定一個目標日期 (例如：3 天後)
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 3);
        targetDate.setHours(targetDate.getHours() + 4);
        targetDate.setMinutes(targetDate.getMinutes() + 30);
        
        // 更新倒數計時的函式
        function updateCountdown() {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;

            if (distance < 0) {
                clearInterval(interval);
                countdownElement.innerHTML = "拍賣已結束";
                return;
            }

            // 時間計算
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // 格式化 (補零)
            const format = (num) => String(num).padStart(2, '0');

            // 輸出結果到 HTML
            countdownElement.innerHTML = 
                `${days}d ${format(hours)}:${format(minutes)}:${format(seconds)}`;
        }

        // 立即執行一次，然後每秒更新
        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
    }

});