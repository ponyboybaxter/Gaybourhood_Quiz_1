const SCRIPT_URL = "https://google.com";

const quizData = [
    { q: "Which artist released the 1994 album ‘Dummy’?", a: ["Portishead", "Massive Attack", "Tricky", "Morcheeba"], correct: 0 },
    { q: "Which was David Bowie’s final studio album released during his lifetime?", a: ["The Next Day", "Blackstar", "Heathen", "Reality"], correct: 1 },
    { q: "Which band released the album Mezzanine?", a: ["Portishead", "UNKLE", "Massive Attack", "Faithless"], correct: 2 },
    { q: "Who originally recorded ‘Tainted Love’ before Soft Cell made it a huge hit?", a: ["Sandie Shaw", "Gloria Jones", "Dusty Springfield", "P.P. Arnold"], correct: 1 },
    { q: "Which Fleetwood Mac album features the song ‘The Chain’?", a: ["Rumours", "Tusk", "Fleetwood Mac (1975)", "Mirage"], correct: 0 },
    { q: "Who sang the original version of ‘Nothing Comares 2 U’, written by Prince?", a: ["Sinéad O’Connor", "The Family", "Wendy & Lisa", "Chaka Khan"], correct: 1 },
    { q: "What was the first studio album released by The Cure?", a: ["Seventeen Seconds", "Faith", "Three Imaginary Boys", "Boys Don’t Cry"], correct: 2 },
    { q: "Which singer performed ’Unfinished Symphony’ with Massive Attack?", a: ["Neneh Cherry", "Shara Nelson", "Tracey Thorn", "Carleen Anderson"], correct: 1 },
    { q: "Which Beatles album was released first?", a: ["Rubber Soul", "Revolver", "Help!", "Sgt. Pepper’s Lonely Hearts Club Band"], correct: 2 },
    { q: "Who wrote and originally recorded ‘I Will Always Love You?", a: ["Dolly Parton", "Patsy Cline", "Tammy Wynette", "Loretta Lynn"], correct: 0 },
    { q: "Which songwriter behind Britney Spears’ ‘Toxic’ recently revealed that the track was just one of around 15 ideas he had that day?", a: ["Max Martin", "Christian Karlsson", "Bloodshy", "Dr. Luke"], correct: 1 },
    { q: "In which Taylor Swift song does she refer to a scarf left at someone’s sister’s house?", a: ["All Too Well", "Cardigan", "The Last Great American Dynasty", "Dear John"], correct: 0 },
    { q: "Which pop star condemned the White House in 2026 after one of her songs was used in a social media video without her approval?", a: ["Zara Larsson", "Charli XCX", "Olivia Rodrigo", "Chappell Roan"], correct: 0 },
    { q: "Which artists song ‘Fast Car’ tells the story of a narrator hoping to escape poverty with a partner?", a: ["Suzanne Vega", "Tracy Chapman", "Cheryl Crow", "Joan Osborne"], correct: 1 },
    { q: "Which artist released the 2026 album PRIMA, featuring the singles ‘Ain’t in LA’ and ‘Nicole Kidman’?", a: ["The Dare", "Charli XCX", "Chappell Roan", "Troye Sivan"], correct: 0 },
    { q: "In Queen’s ‘Bohemian Rhapsody’, which character does the narrator say he has killed?", a: ["Marco", "Galileo", "Figaro", "A man whose name is never given"], correct: 3 },
    { q: "Which artist released ‘Accelerando’ in 2026 as the lead single from the upcoming AI-Inspired album Psy Opera?", a: ["Grimes", "FKA Twigs", "Arca", "Caroline Polachek"], correct: 0 },
    { q: "Which singer recorded the demo of ‘Can’t Get You Out of My Head’ before Kylie Minogue took it to number one?", a: ["Sophie Ellis-Bextor", "Cathy Dennis", "Dannii Minogue", "Rachel Stevens"], correct: 1 },
    { q: "Which artist released the album The Idler Wheel…, featuring the track ‘Every Single Night’, in 2012?", a: ["Tori Amos", "Regina Spektor", "Fiona Apple", "Cat Power"], correct: 2 },
    { q: "Which artist released the album Post in 1995, featuring the songs ‘Army of Me’ and ‘Hyperballad’?", a: ["PJ Harvey", "Björk", "Alanis Morissette", "Fiona Apple"], correct: 1 }
];

let currentQuestionIndex = 0, score = 0, userName = "", userPhone = "", timerInterval = null, timeLeft = 10;

document.getElementById("start-quiz-trigger").onclick = function() {
    userName = document.getElementById("username").value.trim();
    userPhone = document.getElementById("userphone").value.trim();
    if (userName === "" || userPhone === "") { alert("Please fill out all fields."); return; }
    document.getElementById("setup-screen").className = "card hidden";
    document.getElementById("quiz-screen").className = "card";
    runNextQuestion();
};

document.getElementById("reload-quiz-trigger").onclick = function() { location.reload(); };

function runNextQuestion() {
    clearInterval(timerInterval); timeLeft = 10; document.getElementById("timer-bar").style.width = "100%";
    const currentQuestion = quizData[currentQuestionIndex];
    document.getElementById("question-text").innerText = "Question " + (currentQuestionIndex + 1) + " of " + quizData.length + ": " + currentQuestion.q;
    const container = document.getElementById("options-container"); container.innerHTML = "";
    currentQuestion.a.forEach(function(option, index) {
        const btn = document.createElement("button"); btn.className = "option-btn"; btn.innerText = option;
        btn.onclick = function() { checkUserChoice(index); }; container.appendChild(btn);
    });
    timerInterval = setInterval(function() {
        timeLeft--; document.getElementById("timer-bar").style.width = ((timeLeft / 10) * 100) + "%";
        if (timeLeft <= 0) { clearInterval(timerInterval); checkUserChoice(-1); }
    }, 1000);
}

function checkUserChoice(selectedIndex) {
    clearInterval(timerInterval);
    if (selectedIndex === quizData[currentQuestionIndex].correct) { score++; }
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) { runNextQuestion(); } else { uploadScoreData(); }
}

function uploadScoreData() {
    document.getElementById("quiz-screen").className = "card hidden";
    document.getElementById("leaderboard-screen").className = "card";
    fetch(SCRIPT_URL, {
        method: "POST", mode: "no-cors", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: userName, phone: userPhone, score: score })
    })
    .then(function() { setTimeout(downloadLeaderboard, 1500); })
    .catch(function(err) { downloadLeaderboard(); });
}

function downloadLeaderboard() {
    fetch(SCRIPT_URL)
    .then(function(res) { return res.json(); })
    .then(function(data) {
        const list = document.getElementById("leaderboard-list"); list.innerHTML = "";
        if (data.length === 0) { list.innerHTML = "<li>No scores yet!</li>"; return; }
        data.forEach(function(player, index) {
            const li = document.createElement("li");
            li.innerHTML = '<span><span class="rank">#' + (index + 1) + '</span>' + player.name + ' (' + player.phone + ')</span> <strong>' + player.score + '/' + quizData.length + '</strong>';
            list.appendChild(li);
        });
    })
    .catch(function(err) { document.getElementById("leaderboard-list").innerHTML = "<li>Error loading rankings.</li>"; });
}
