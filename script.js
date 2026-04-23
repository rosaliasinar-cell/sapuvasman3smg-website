/* ========================================
   SAPUVA WEBSITE - COMPLETE JAVASCRIPT
   Game Logic, Charts, & Interactivity
   ======================================== */

// ========== GAME DATA ==========
const gameQuestions = [
    {
        id: 1,
        question: "Apa nama ilmiah ikan sapu-sapu?",
        options: [
            { text: "Hypostomus plecostomus", correct: true },
            { text: "Clarias batrachus", correct: false },
            { text: "Oreochromis niloticus", correct: false },
            { text: "Carassius auratus", correct: false }
        ],
        points: 10
    },
    {
        id: 2,
        question: "Berapa panjang maksimal ikan sapu-sapu?",
        options: [
            { text: "30 cm", correct: false },
            { text: "50-60 cm", correct: true },
            { text: "80 cm", correct: false },
            { text: "100 cm", correct: false }
        ],
        points: 10
    },
    {
        id: 3,
        question: "Ikan sapu-sapu masuk ke Indonesia melalui apa?",
        options: [
            { text: "Sungai alami", correct: false },
            { text: "Perdagangan ikan hias", correct: true },
            { text: "Program migrasi", correct: false },
            { text: "Impor pemerintah", correct: false }
        ],
        points: 10
    },
    {
        id: 4,
        question: "Bentuk mulut ikan sapu-sapu adalah?",
        options: [
            { text: "Mulut normal", correct: false },
            { text: "Cakram hisap (suckermouth)", correct: true },
            { text: "Mulut besar", correct: false },
            { text: "Mulut kecil runcing", correct: false }
        ],
        points: 10
    },
    {
        id: 5,
        question: "Berapa fekunditas ikan sapu-sapu per siklus?",
        options: [
            { text: "100-500 telur", correct: false },
            { text: "1,000-3,000 telur", correct: true },
            { text: "5,000-10,000 telur", correct: false },
            { text: "10,000+ telur", correct: false }
        ],
        points: 10
    },
    {
        id: 6,
        question: "Siklus reproduksi ikan sapu-sapu berapa lama?",
        options: [
            { text: "1-3 bulan", correct: false },
            { text: "6-12 bulan", correct: true },
            { text: "1-2 tahun", correct: false },
            { text: "2-3 tahun", correct: false }
        ],
        points: 10
    },
    {
        id: 7,
        question: "Apa dampak utama bioturbasi sapu-sapu?",
        options: [
            { text: "Meningkatkan oksigen", correct: false },
            { text: "Resuspensi sedimen & kekeruhan", correct: true },
            { text: "Memperbaiki air", correct: false },
            { text: "Menambah nutrisi", correct: false }
        ],
        points: 15
    },
    {
        id: 8,
        question: "Peningkatan kekeruhan (TSS) akibat sapu-sapu?",
        options: [
            { text: "50-100%", correct: false },
            { text: "100-150%", correct: false },
            { text: "200-400%", correct: true },
            { text: "500%+", correct: false }
        ],
        points: 15
    },
    {
        id: 9,
        question: "Penurunan biodiversitas ikan akibat sapu-sapu?",
        options: [
            { text: "10-20%", correct: false },
            { text: "40-60%", correct: true },
            { text: "70-80%", correct: false },
            { text: "90%+", correct: false }
        ],
        points: 15
    },
    {
        id: 10,
        question: "Ikan sapu-sapu memiliki respirasi tambahan berupa?",
        options: [
            { text: "Paru-paru", correct: false },
            { text: "Labirin insang", correct: true },
            { text: "Kulit pernapasan", correct: false },
            { text: "Kantong udara", correct: false }
        ],
        points: 10
    }
];

// ========== GAME STATE ==========
let gameState = {
    playerName: "",
    playerClass: "",
    playerLanguage: "id",
    currentQuestionIndex: 0,
    score: 0,
    answers: [],
    gameStarted: false,
    gameEnded: false,
    startTime: null,
    endTime: null,
    leaderboard: JSON.parse(localStorage.getItem('sapuvaLeaderboard')) || []
};

// ========== VERIFY PLAYER ==========
function verifyPlayer(event) {
    event.preventDefault();

    const playerName = document.getElementById('playerName').value.trim();
    const playerLanguage = document.getElementById('playerLanguage').value;
    const playerClass = document.getElementById('playerClass').value.trim();

    if (!playerName || !playerLanguage || !playerClass) {
        showNotification('⚠️ Mohon isi semua field!', 'error');
        return;
    }

    gameState.playerName = playerName;
    gameState.playerLanguage = playerLanguage;
    gameState.playerClass = playerClass;
    gameState.gameStarted = true;
    gameState.startTime = new Date();

    document.getElementById('verification-form').style.display = 'none';
    document.getElementById('gameInterface').style.display = 'block';

    document.getElementById('displayName').textContent = playerName;
    document.getElementById('displayClass').textContent = playerClass;

    loadQuestion(0);
    showNotification(`🎮 Selamat datang ${playerName}!`, 'success');
}

// ========== LOAD QUESTION ==========
function loadQuestion(index) {
    if (index >= gameQuestions.length) {
        endGame();
        return;
    }

    const question = gameQuestions[index];
    gameState.currentQuestionIndex = index;

    const quizContainer = document.getElementById('quizContainer');
    quizContainer.innerHTML = '';

    const card = document.createElement('div');
    card.className = 'quiz-card';

    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'];
    
    let cardHTML = `
        <div class="card-header">
            <div class="question-badge">Pertanyaan ${index + 1}</div>
            <div class="points-badge">${question.points} Poin</div>
        </div>
        <div class="card-body">
            <h3 class="question-text">${question.question}</h3>
            <div class="options-container">
    `;

    question.options.forEach((option, i) => {
        const isSelected = gameState.answers[index] === i;
        cardHTML += `
            <div class="option-card ${isSelected ? 'selected' : ''}" 
                 onclick="selectAnswer(${index}, ${i})">
                <div class="option-letter" style="background-color: ${colors[i % colors.length]};">
                    ${String.fromCharCode(65 + i)}
                </div>
                <div class="option-text">${option.text}</div>
            </div>
        `;
    });

    cardHTML += `</div></div>`;
    card.innerHTML = cardHTML;
    quizContainer.appendChild(card);

    updateProgress(index + 1, gameQuestions.length);

    const submitBtn = document.getElementById('submitBtn');
    if (index === gameQuestions.length - 1) {
        submitBtn.textContent = '✅ Selesai Game';
    } else {
        submitBtn.textContent = 'Selanjutnya →';
    }
}

// ========== SELECT ANSWER ==========
function selectAnswer(questionIndex, optionIndex) {
    gameState.answers[questionIndex] = optionIndex;

    const options = document.querySelectorAll('.option-card');
    options.forEach((opt, i) => {
        opt.classList.remove('selected');
        if (i === optionIndex) {
            opt.classList.add('selected');
        }
    });

    showNotification('✓ Jawaban tercatat!', 'success');
}

// ========== NEXT QUESTION ==========
function nextQuestion() {
    if (gameState.answers[gameState.currentQuestionIndex] === undefined) {
        showNotification('⚠️ Pilih jawaban terlebih dahulu!', 'error');
        return;
    }

    if (gameState.currentQuestionIndex === gameQuestions.length - 1) {
        submitAnswers();
    } else {
        loadQuestion(gameState.currentQuestionIndex + 1);
    }
}

// ========== PREVIOUS QUESTION ==========
function previousQuestion() {
    if (gameState.currentQuestionIndex > 0) {
        loadQuestion(gameState.currentQuestionIndex - 1);
    }
}

// ========== SUBMIT ANSWERS ==========
function submitAnswers() {
    let score = 0;

    gameQuestions.forEach((question, index) => {
        const selectedOptionIndex = gameState.answers[index];
        if (selectedOptionIndex !== undefined) {
            if (question.options[selectedOptionIndex].correct) {
                score += question.points;
            }
        }
    });

    gameState.score = score;
    gameState.endTime = new Date();

    saveToLeaderboard();
    showResults();
}

// ========== SAVE TO LEADERBOARD ==========
function saveToLeaderboard() {
    const entry = {
        name: gameState.playerName,
        class: gameState.playerClass,
        score: gameState.score,
        date: new Date().toLocaleString('id-ID'),
        duration: Math.round((gameState.endTime - gameState.startTime) / 1000) + 's'
    };

    gameState.leaderboard.push(entry);
    gameState.leaderboard.sort((a, b) => b.score - a.score);
    
    if (gameState.leaderboard.length > 20) {
        gameState.leaderboard = gameState.leaderboard.slice(0, 20);
    }

    localStorage.setItem('sapuvaLeaderboard', JSON.stringify(gameState.leaderboard));
}

// ========== SHOW RESULTS ==========
function showResults() {
    document.getElementById('quizContainer').style.display = 'none';
    document.getElementById('gameInterface').querySelector('.progress-section').style.display = 'none';
    document.getElementById('gameInterface').querySelector('.game-buttons').style.display = 'none';

    const resultsCard = document.getElementById('resultsCard');
    resultsCard.style.display = 'block';

    const accuracy = Math.round((gameState.score / 100) * 100);
    const correctAns = gameState.answers.filter((_, i) => gameQuestions[i].options[_]?.correct).length;

    let resultsHTML = `
        <h3>🏆 Hasil Akhir</h3>
        <div class="final-score">
            <p>Skor: <strong>${gameState.score}</strong> / 100</p>
            <p>Akurasi: ${accuracy}% | Benar: ${correctAns}/${gameQuestions.length}</p>
        </div>
        <button class="btn btn-primary" onclick="downloadResults()" style="width:100%; margin:10px 0;">
            📥 Download Hasil (JPG)
        </button>
        <button class="btn btn-secondary" onclick="resetGame()" style="width:100%; margin:10px 0;">
            🔄 Main Lagi
        </button>
    `;

    resultsCard.innerHTML = resultsHTML;
}

// ========== DOWNLOAD RESULTS AS JPG ==========
function downloadResults() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 600;
    canvas.height = 800;

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1a5f7a');
    gradient.addColorStop(1, '#00d2ff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Card putih
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(50, 100, 500, 600);

    // Judul
    ctx.fillStyle = '#1a5f7a';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('SAPUVA QUEST', canvas.width / 2, 170);
    
    ctx.font = '18px Arial';
    ctx.fillStyle = '#555';
    ctx.fillText('HASIL AKHIR', canvas.width / 2, 200);

    // Garis
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(100, 230);
    ctx.lineTo(500, 230);
    ctx.stroke();

    // Info pemain
    ctx.textAlign = 'left';
    ctx.fillStyle = '#333';
    ctx.font = 'bold 18px Arial';
    ctx.fillText(`Nama: ${gameState.playerName}`, 100, 280);
    ctx.fillText(`Kelas: ${gameState.playerClass}`, 100, 310);

    // Score circle
    ctx.beginPath();
    ctx.arc(300, 440, 80, 0, Math.PI * 2);
    ctx.fillStyle = '#f8f9fa';
    ctx.fill();
    ctx.strokeStyle = '#00d2ff';
    ctx.lineWidth = 10;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#1a5f7a';
    ctx.font = 'bold 50px Arial';
    ctx.fillText(gameState.score, 300, 450);
    ctx.font = '16px Arial';
    ctx.fillText('POIN', 300, 475);

    // Stats
    ctx.font = 'bold 18px Arial';
    ctx.fillStyle = '#2d3436';
    ctx.fillText(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`, 300, 580);

    // Convert to JPG
    const link = document.createElement('a');
    link.download = `SAPUVA_Result_${gameState.playerName}.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.95);
    link.click();

    showNotification('📥 Hasil berhasil diunduh!', 'success');
}

// ========== RESET GAME ==========
function resetGame() {
    gameState = {
        playerName: "",
        playerClass: "",
        playerLanguage: "id",
        currentQuestionIndex: 0,
        score: 0,
        answers: [],
        gameStarted: false,
        gameEnded: false,
        startTime: null,
        endTime: null,
        leaderboard: JSON.parse(localStorage.getItem('sapuvaLeaderboard')) || []
    };

    document.getElementById('verification-form').style.display = 'block';
    document.getElementById('gameInterface').style.display = 'none';
    document.getElementById('quizContainer').style.display = 'block';
    document.getElementById('resultsCard').style.display = 'none';
    document.getElementById('playerForm').reset();
    document.getElementById('currentScore').textContent = '0';

    document.getElementById('gameInterface').querySelector('.progress-section').style.display = 'block';
    document.getElementById('gameInterface').querySelector('.game-buttons').style.display = 'flex';

    showNotification('🔄 Game direset!', 'info');
}

// ========== UPDATE PROGRESS ==========
function updateProgress(current, total) {
    const percentage = (current / total) * 100;
    document.getElementById('progressFill').style.width = percentage + '%';
    document.getElementById('currentQuestion').textContent = current;
    document.getElementById('totalQuestions').textContent = total;
}

// ========== NOTIFICATION ==========
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    const bgColor = type === 'success' ? '#32CD32' : type === 'error' ? '#FF6347' : '#1E90FF';
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 12px;
        background: ${bgColor};
        color: white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        animation: slideInRight 0.3s ease-out;
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========== TAB SWITCHING ==========
function switchTab(tabName) {
    const panels = document.querySelectorAll('.tab-panel');
    panels.forEach(panel => panel.classList.remove('active'));
    
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) selectedTab.classList.add('active');
    
    event.target.classList.add('active');
}

// ========== DRAW CHARTS ==========
document.addEventListener('DOMContentLoaded', () => {
    drawLightPenetrationChart();
    drawNutrientChart();
    drawPopulationChart();
});

function drawLightPenetrationChart() {
    const canvas = document.getElementById('lightChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.offsetWidth;
    const height = 300;
    
    canvas.width = width;
    canvas.height = height;

    const padding = 40;
    const plotWidth = width - 2 * padding;
    const plotHeight = height - 2 * padding;

    const depths = [0, 2, 4, 6, 8];
    const normalLight = [100, 70, 30, 5, 0];
    const sapuSapuLight = [50, 15, 2, 0, 0];

    ctx.fillStyle = '#E8F4F8';
    ctx.fillRect(0, 0, width, height);

    // Draw axes
    ctx.strokeStyle = '#228B22';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Normal Light
    ctx.strokeStyle = '#228B22';
    ctx.lineWidth = 3;
    ctx.beginPath();
    normalLight.forEach((val, i) => {
        const x = padding + (i / (depths.length - 1)) * plotWidth;
        const y = (height - padding) - (val / 100) * plotHeight;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Sapu-Sapu Light
    ctx.strokeStyle = '#FF6347';
    ctx.lineWidth = 3;
    ctx.beginPath();
    sapuSapuLight.forEach((val, i) => {
        const x = padding + (i / (depths.length - 1)) * plotWidth;
        const y = (height - padding) - (val / 100) * plotHeight;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    depths.forEach((depth, i) => {
        const x = padding + (i / (depths.length - 1)) * plotWidth;
        ctx.fillText(depth + 'm', x, height - padding + 20);
    });
}

function drawNutrientChart() {
    const canvas = document.getElementById('nutrientChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.offsetWidth;
    const height = 250;
    
    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = '#E8F4F8';
    ctx.fillRect(0, 0, width, height);

    const data = [
        { label: 'N Normal', value: 0.5, color: '#228B22' },
        { label: 'N Sapu', value: 2.5, color: '#FF6347' },
        { label: 'P Normal', value: 0.08, color: '#90EE90' },
        { label: 'P Sapu', value: 0.75, color: '#FFB6C1' }
    ];

    const maxValue = 3;
    const barWidth = width / data.length;
    const padding = 40;

    data.forEach((item, i) => {
        const barHeight = (item.value / maxValue) * (height - padding);
        const x = i * barWidth + barWidth / 4;
        const y = height - padding - barHeight;

        ctx.fillStyle = item.color;
        ctx.fillRect(x, y, barWidth / 2, barHeight);

        ctx.fillStyle = '#333';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(item.label, x + barWidth / 4, height - 10);
    });
}

function drawPopulationChart() {
    const canvas = document.getElementById('populationChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.offsetWidth;
    const height = 300;
    
    canvas.width = width;
    canvas.height = height;

    const padding = 40;
    const plotWidth = width - 2 * padding;
    const plotHeight = height - 2 * padding;

    const years = [0, 1, 2, 3, 4, 5];
    const populationData = [10, 25, 60, 150, 300, 600];

    ctx.fillStyle = '#E8F4F8';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#228B22';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();

    const maxPopulation = Math.max(...populationData);

    ctx.strokeStyle = '#FF6347';
    ctx.lineWidth = 3;
    ctx.beginPath();

    populationData.forEach((value, index) => {
        const x = padding + (index / (years.length - 1)) * plotWidth;
        const y = (height - padding) - (value / maxPopulation) * plotHeight;

        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();

    // Points
    populationData.forEach((value, index) => {
        const x = padding + (index / (years.length - 1)) * plotWidth;
        const y = (height - padding) - (value / maxPopulation) * plotHeight;

        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FF6347';
        ctx.lineWidth = 2;
        ctx.stroke();
    });
}

// ========== CONTACT FORM ==========
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !subject || !message) {
            showNotification('⚠️ Mohon isi semua field!', 'error');
            return;
        }

        showNotification(`✅ Terima kasih! Pesan dari ${name} telah diterima.`, 'success');
        this.reset();
    });
}

// ========== SMOOTH SCROLLING ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
