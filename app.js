// app.js - 로직 및 차트 시뮬레이션

// 1. 가상 실험실 로직 (Chart.js 활용)
const distanceSlider = document.getElementById('distanceSlider');
const distanceVal = document.getElementById('distanceVal');
const startExpBtn = document.getElementById('startExpBtn');
const resetExpBtn = document.getElementById('resetExpBtn');
const cup = document.getElementById('cup');

let chartInstance = null;
let experimentInterval = null;

function initChart() {
    const ctx = document.getElementById('equilibriumChart').getContext('2d');
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = "'Pretendard', sans-serif";

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [], 
            datasets: [{
                label: '알루미늄 컵의 온도 (℃)',
                data: [],
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                borderWidth: 3,
                pointRadius: 0,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 0 },
            scales: {
                x: {
                    title: { display: true, text: '시간 (분)', font: { size: 14, weight: 'bold' } },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    min: 0, max: 30
                },
                y: {
                    title: { display: true, text: '온도 (℃)', font: { size: 14, weight: 'bold' } },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    min: 15, max: 60
                }
            },
            plugins: { legend: { labels: { font: { size: 14 } } } }
        }
    });
}

function updateVisuals(distance) {
    distanceVal.textContent = distance;
    // 화면 크기에 따라 이동 반경(multiplier) 조절
    const isMobile = window.innerWidth <= 768;
    const multiplier = isMobile ? 3 : 10;
    const baseTranslate = (distance - 10) * multiplier;
    cup.style.transform = `translateX(${baseTranslate}px)`;
}

window.addEventListener('resize', () => {
    if(distanceSlider) updateVisuals(distanceSlider.value);
});

if(distanceSlider) {
    distanceSlider.addEventListener('input', (e) => updateVisuals(e.target.value));
    startExpBtn.addEventListener('click', () => {
        if (experimentInterval) clearInterval(experimentInterval);
        runExperiment();
    });
    resetExpBtn.addEventListener('click', () => {
        if (experimentInterval) clearInterval(experimentInterval);
        chartInstance.data.labels = [];
        chartInstance.data.datasets[0].data = [];
        chartInstance.update();
        startExpBtn.disabled = false;
        distanceSlider.disabled = false;
    });
}

function runExperiment() {
    startExpBtn.disabled = true;
    distanceSlider.disabled = true;
    
    const distance = parseInt(distanceSlider.value);
    const baseTemp = 20; 
    const maxTemp = Math.max(25, 60 - (distance - 5) * 1.5); 
    const timeToEq = 10 + (distance * 0.5); 
    
    let currentTime = 0;
    chartInstance.data.labels = [];
    chartInstance.data.datasets[0].data = [];
    chartInstance.update();

    experimentInterval = setInterval(() => {
        if (currentTime > 30) {
            clearInterval(experimentInterval);
            startExpBtn.disabled = false;
            distanceSlider.disabled = false;
            return;
        }
        const currentTemp = baseTemp + (maxTemp - baseTemp) * (1 - Math.exp(-currentTime / (timeToEq/3)));
        chartInstance.data.labels.push(currentTime);
        chartInstance.data.datasets[0].data.push(currentTemp);
        chartInstance.update();
        currentTime += 1;
    }, 200); 
}

// 2. 듀얼 뷰 애니메이션 토글
window.toggleEarthAnimation = function() {
    const card = document.querySelector('.earth-card');
    card.classList.toggle('earth-animating');
    
    const hint = document.createElement('div');
    hint.textContent = card.classList.contains('earth-animating') ? "온실 효과 작용 중! 온도가 상승합니다." : "온실 효과 해제";
    hint.style.position = 'absolute';
    hint.style.bottom = '10px';
    hint.style.left = '50%';
    hint.style.transform = 'translateX(-50%)';
    hint.style.fontSize = '0.9rem';
    hint.style.color = '#fff';
    hint.style.background = 'rgba(239, 68, 68, 0.8)';
    hint.style.padding = '5px 10px';
    hint.style.borderRadius = '20px';
    hint.style.animation = 'fadeInUp 0.3s ease';
    
    card.appendChild(hint);
    setTimeout(() => hint.remove(), 2000);
}

// 3. 스토리텔링 타임라인
window.revealStep = function(stepNum) {
    const stepContent = document.getElementById(`step${stepNum}`);
    if (stepContent.classList.contains('hidden-content')) {
        stepContent.classList.remove('hidden-content');
        stepContent.style.display = 'block';
        setTimeout(() => {
            stepContent.style.opacity = '1';
            stepContent.style.transform = 'translateY(0)';
        }, 50);
    }
}

// 5. 나의 실천 다이어리 (지구 건강도)
window.updateEarthHealth = function() {
    const checkboxes = document.querySelectorAll('.check-item input[type="checkbox"]');
    const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
    const totalCount = checkboxes.length;
    const percentage = (checkedCount / totalCount) * 100;
    
    const healthBar = document.getElementById('healthBar');
    const healthEarth = document.getElementById('healthEarth');
    const healthStatus = document.getElementById('healthStatus');
    
    healthBar.style.width = `${percentage}%`;
    
    if (percentage === 0) {
        healthEarth.textContent = '🤒';
        healthEarth.className = 'health-earth sick';
        healthBar.style.background = 'var(--accent-red)';
        healthStatus.textContent = '지구가 아파요... 실천 항목을 체크해주세요!';
    } else if (percentage < 50) {
        healthEarth.textContent = '😷';
        healthEarth.className = 'health-earth sick';
        healthBar.style.background = '#f59e0b';
        healthStatus.textContent = '조금씩 나아지고 있어요!';
    } else if (percentage < 100) {
        healthEarth.textContent = '🙂';
        healthEarth.className = 'health-earth recovering';
        healthBar.style.background = '#3b82f6';
        healthStatus.textContent = '지구가 회복 중입니다. 조금만 더 노력해봐요!';
    } else {
        healthEarth.textContent = '🌍';
        healthEarth.className = 'health-earth healthy';
        healthBar.style.background = 'var(--accent-green)';
        healthStatus.textContent = '완벽해요! 푸른 지구를 지켜냈습니다! 👏';
    }
}

// 6. 모의고사 플래시카드 데이터
const examData = [
    { q: "온도가 오르다가 일정해지는 복사 평형 상태가 되는 이유는?", a: "물체가 흡수하는 복사 에너지양과 방출하는 복사 에너지양이 같아졌기 때문" },
    { q: "광원과의 거리가 멀어질수록 복사 평형 온도는 어떻게 변하나요?", a: "단위 면적당 도달하는 복사 에너지 밀도가 줄어들어 평형 온도가 낮아진다." },
    { q: "지구 표면 온도가 달보다 높은 까닭은?", a: "지구에는 대기가 있어 방출되는 지구 복사 에너지 일부를 흡수했다가 재방출하는 '온실 효과'가 일어나기 때문" },
    { q: "현재 지구 평균 기온 상승(지구 온난화)의 주된 원인은?", a: "화석 연료 사용 급증으로 인한 온실 기체(이산화탄소, 메테인 등) 농도 증가" },
    { q: "온실 효과와 지구 온난화의 차이점은?", a: "온실 효과는 자연스러운 보온 현상, 지구 온난화는 인간 활동으로 온실 효과가 비정상적으로 강화되어 기온이 급격히 오르는 문제 현상" },
    { q: "영구동토층이 녹을 때 지구 온도가 더 급격히 치솟는 이유는?", a: "얼어있던 유기물이 분해되며 이산화탄소보다 수십 배 강력한 '메테인'이 대량 방출되는 '양의 되먹임' 때문" },
    { q: "지구 온난화로 인한 전 지구적 환경 시스템 변화 3가지는?", a: "1. 해수면 상승 2. 기상 이변 상시화 3. 생태계 파괴 및 식량 위기" }
];

function initExam() {
    const grid = document.querySelector('.exam-grid');
    if(!grid) return;
    
    examData.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'flashcard exam-card';
        card.innerHTML = `
            <div class="front">
                <span class="q-mark">Q${index + 1}</span>
                <p>${item.q}</p>
            </div>
            <div class="back">
                <span class="a-mark">A</span>
                <p>${item.a}</p>
            </div>
        `;
        card.addEventListener('click', function() {
            this.classList.toggle('flipped');
        });
        grid.appendChild(card);
    });
}

window.addEventListener('DOMContentLoaded', () => {
    initChart();
    if(distanceSlider) updateVisuals(distanceSlider.value);
    initExam();
});
