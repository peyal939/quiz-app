const quizData = [
    {
        question: "What is the name of the largest planet in our solar system?",
        answers: [
            { text: "Earth", correct: false },
            { text: "Mars", correct: false },
            { text: "Jupiter", correct: true },
            { text: "Saturn", correct: false }
        ]
    },
    {
        question: "Who is the founder of Microsoft?",
        answers: [
            { text: "Bill Gates", correct: true },
            { text: "Steve Jobs", correct: false },
            { text: "Elon Musk", correct: false },
            { text: "Jeff Bezos", correct: false }
        ]
    },
    {
        question: "How many divisons are there in Bangladesh?",
        answers: [
            { text: "6", correct: false },
            { text: "8", correct: true },
            { text: "10", correct: false },
            { text: "12", correct: false }
        ]
    },
    {
        question: "Where is IUB located?",
        answers: [
            { text: "Bashundhara", correct: true },
            { text: "Gulshan", correct: false },
            { text: "Uttara", correct: false },
            { text: "Mirpur", correct: false }
        ]
    },
    {
        question: "What is the capital of Bangladesh?",
        answers: [
            { text: "Dhaka", correct: true },
            { text: "Khulna", correct: false },
            { text: "Rajshahi", correct: false },
            { text: "Chittagong", correct: false }
        ]
    },
    {
        question: "Who is the founder of Google?",
        answers: [
            { text: "Larry Page", correct: true },
            { text: "Elon Musk", correct: false },
            { text: "Bill Gates", correct: false },
            { text: "Steve Jobs", correct: false }
        ]
    }
    
];

// DOM Elements
const qContainer = document.getElementById('question-container');
const qText = document.getElementById('question-text');
const answerBtns = document.getElementById('answer-buttons');
const nextBtn = document.getElementById('next-btn');
const scoreBox = document.getElementById('score-container');
const scoreText = document.getElementById('score');
const restartBtn = document.getElementById('restart-btn');

let qIndex = 0;
let score = 0;
let userAnswer = null;
let shuffledQuestions = [];

function shuffleArray(array) {
    let currentIndex = array.length;
    let temporaryValue, randomIndex;
    
    const arrayCopy = [...array];
    
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        
        temporaryValue = arrayCopy[currentIndex];
        arrayCopy[currentIndex] = arrayCopy[randomIndex];
        arrayCopy[randomIndex] = temporaryValue;
    }
    
    return arrayCopy;
}

// Initialize quiz
function init() {
    shuffledQuestions = shuffleArray(quizData);
    qIndex = 0;
    score = 0;
    nextBtn.innerHTML = 'Next';
    showNextQuestion();
    
    qContainer.classList.remove('hide');
    nextBtn.classList.remove('hide');
    scoreBox.classList.add('hide');
}

// Display current question
function showNextQuestion() {
    clearQuestion();
    let q = shuffledQuestions[qIndex];
    let num = qIndex + 1;
    qText.innerHTML = num + ". " + q.question;

    let shuffledAnswers = shuffleArray(q.answers);
    
    shuffledAnswers.forEach(ans => {
        let btn = document.createElement('button');
        btn.innerHTML = ans.text;
        btn.classList.add('btn');
        btn.dataset.correct = ans.correct;
        btn.addEventListener('click', pickAnswer);
        answerBtns.appendChild(btn);
    });
}

// Reset UI state for next question
function clearQuestion() {
    nextBtn.disabled = true;
    userAnswer = null;
    while (answerBtns.firstChild) {
        answerBtns.removeChild(answerBtns.firstChild);
    }
}

// Handle answer selection
function pickAnswer(e) {
    let btn = e.target;
    userAnswer = btn.dataset.correct === 'true';
    
    let allButtons = Array.from(answerBtns.children);
    for (let i = 0; i < allButtons.length; i++) {
        allButtons[i].classList.remove('selected');
        allButtons[i].disabled = true;
    }
    
    btn.classList.add('selected');
    
    if (userAnswer) {
        btn.classList.add('correct');
        score++;
    } else {
        btn.classList.add('wrong');
        
        for (let i = 0; i < allButtons.length; i++) {
            if (allButtons[i].dataset.correct === 'true') {
                allButtons[i].classList.add('correct');
            }
        }
    }
    
    nextBtn.disabled = false;
}

// Handle next button click
function goToNext() {
    qIndex++;
    
    if (qIndex < shuffledQuestions.length) {
        showNextQuestion();
    } else {
        showFinalScore();
    }
}

// Show final score
function showFinalScore() {
    clearQuestion();
    qContainer.classList.add('hide');
    nextBtn.classList.add('hide');
    scoreBox.classList.remove('hide');
    scoreText.innerHTML = score + " / " + shuffledQuestions.length;
    
    saveToStorage();
}

// Save score to localStorage
function saveToStorage() {
    let saved = JSON.parse(localStorage.getItem('quizScores') || '[]');
    let now = new Date().toLocaleString();
    
    saved.push({
        date: now,
        score: score,
        total: shuffledQuestions.length
    });
    
    localStorage.setItem('quizScores', JSON.stringify(saved));
}

// Event listeners
nextBtn.addEventListener('click', function() {
    if (userAnswer !== null) {
        goToNext();
    }
});

restartBtn.onclick = function() {
    init();
};

// Start the quiz when the page loads
window.onload = init; 