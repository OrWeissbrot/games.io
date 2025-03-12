document.addEventListener("DOMContentLoaded", function () {
    console.log("🔹 המשחק נטען בהצלחה!");

    const words = [

        { hard: "רַהַב", easy: "חבר שמגזים עם הסיפורים שלו" },
        { hard: "סַחְבָּקִיּוּת", easy: '"בוא, אחי, אני מסדר לך הנחה"' },
        { hard: "בְּלוּי מְיוּשָּן", easy: "החולצה שאמא עדיין חושבת שמתאימה לך" },
        { hard: "הִתְגּוֹנְנוּת", easy: "כשאתה מנסה להסביר למורה למה האיחור לא אשמתך" },
        { hard: "נוּגה", easy: "כשנגמר האינטרנט בבית" },
        { hard: "סוּגְיָה מוּרְכֶּבֶת", easy: "לנסות להבין את מערכת היחסים של החברים שלך" },
        { hard: "מַשְׂאַת נֶפֶשׁ", easy: "לקבל רישיון ולהפסיק לבקש טרמפים" },
{ hard: "יהיר", easy: "הוא נכנס לחדר כאילו הוא הבעלים של המקום, למרות שהוא רק האורח." },
{ hard: "ענווה", easy: "היא תמיד נותנת לאחרים את הקרדיט, אפילו כשהיא עשתה את כל העבודה." },
{ hard: "כאוס", easy: "החדר שלו נראה כמו אחרי סופת טורנדו, אבל הוא טוען שזה 'סדר יצירתי'." },
{ hard: "אפיפית", easy: "הקינוח הפריך הזה שכולם אוהבים לטבול בקפה." },
{ hard: "כתיתה", easy: "המנה המטוגנת שאמא מכינה, שתמיד נעלמת מהצלחת תוך שניות." },
{ hard: "אביון", easy: "הוא טוען שאין לו כסף, אבל תמיד מוצא דרך להזמין את הגאדג'ט הכי חדש." },
{ hard: "אַנְדַּרְלָמוּסְיָה", easy: "כאשר שולחן העבודה שלך נראה כמו אזור אסון." },
{ hard: "פִּכְפוּךְ", easy: "הצליל המרגיע של מים זורמים, עד שאתה נזכר ששכחת לסגור את הברז." },
{ hard: "יָגוֹן", easy: "התחושה כשאתה מגלה שהסדרה האהובה עליך בוטלה." },
{ hard: "מַהֲלוּמָה", easy: "ההלם שאתה חווה כשאתה רואה את חשבון החשמל החודשי." }

    ];

    let playerName = "";
    let score = 0;
    let timeLeft = 25;
    let timerInterval;
    let currentWord;
    let usedQuestions = new Set();

    const playerDisplay = document.getElementById("player-display");
    const timerEl = document.getElementById("time-left");
    const wordHardEl = document.getElementById("word-hard");
    const optionsEl = document.getElementById("options");
    const scoreEl = document.getElementById("player-score");
    const gameContainer = document.querySelector(".game-container");

    const startScreen = document.getElementById("start-screen");
    const gameScreen = document.getElementById("game");
    const leaderboardScreen = document.getElementById("leaderboard");

    document.getElementById("start-btn").addEventListener("click", startGame);
    document.getElementById("leaderboard-btn").addEventListener("click", showLeaderboard);
    document.getElementById("back-btn").addEventListener("click", backToMenu);
    document.getElementById("restart").addEventListener("click", resetGame);

    function startGame() {
        playerName = document.getElementById("player-name").value.trim();
        if (!playerName) {
            alert("אנא הכנס שם!");
            return;
        }

        startScreen.style.display = "none";
        gameScreen.style.display = "block";
        playerDisplay.textContent = `👤 שחקן: ${playerName}`;
        score = 0;
        updateScore();
        usedQuestions.clear();
        nextRound();
    }

    function startTimer() {
        clearInterval(timerInterval);
        timeLeft = 25;
        timerEl.textContent = timeLeft;

        timerInterval = setInterval(() => {
            timeLeft--;
            timerEl.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                flashRed();
                nextRound();
            }
        }, 1000);
    }

    function nextRound() {
        clearInterval(timerInterval);
        startTimer();
        optionsEl.innerHTML = "";

        let unusedWords = words.filter(w => !usedQuestions.has(w.hard));

        if (unusedWords.length === 0) {
            alert("🎉 כל השאלות נענו! המשחק יסתיים.");
            saveScore();
            return;
        }

        let randomIndex = Math.floor(Math.random() * unusedWords.length);
        currentWord = unusedWords[randomIndex];
        usedQuestions.add(currentWord.hard);

        wordHardEl.textContent = currentWord.hard;

        let options = [currentWord.easy];
        while (options.length < 3) {
            let randomEasy = words[Math.floor(Math.random() * words.length)].easy;
            if (!options.includes(randomEasy)) {
                options.push(randomEasy);
            }
        }

        options.sort(() => Math.random() - 0.5);
        options.forEach(option => {
            let btn = document.createElement("button");
            btn.classList.add("option-btn");
            btn.textContent = option;
            btn.onclick = function () {
                checkAnswer(option, currentWord.easy);
            };
            optionsEl.appendChild(btn);
        });
    }

    function checkAnswer(selected, correct) {
        clearInterval(timerInterval);
        if (selected === correct) {
            score += 10;
            updateScore();
        } else {
            flashRed();
        }
        nextRound();
    }

    function flashRed() {
        gameContainer.classList.add("flash-red");
        setTimeout(() => {
            gameContainer.classList.remove("flash-red");
        }, 500);
    }

    function updateScore() {
        scoreEl.textContent = score;
    }

    function saveScore() {
        let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
        leaderboard.push({ name: playerName, score });
        leaderboard.sort((a, b) => b.score - a.score);
        localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
        showLeaderboard();
    }

    function showLeaderboard() {
        gameScreen.style.display = "none";
        leaderboardScreen.style.display = "block";
        let leaderboardList = document.getElementById("leaderboard-list");
        leaderboardList.innerHTML = "";
        let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
        leaderboard.forEach(entry => {
            let li = document.createElement("li");
            li.textContent = `${entry.name}: ${entry.score} נק'`;
            leaderboardList.appendChild(li);
        });
    }

    function backToMenu() {
        leaderboardScreen.style.display = "none";
        startScreen.style.display = "block";
    }

    function resetGame() {
        gameScreen.style.display = "none";
        startScreen.style.display = "block";
    }
});
