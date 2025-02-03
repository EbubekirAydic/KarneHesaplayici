document.getElementById("addLesson").addEventListener("click", addLesson);
document.getElementById("calculate").addEventListener("click", calculateReportCard);

loadFromStorage();

function addLesson(name = "", term1 = ["","","",""], term2 = ["","","",""], hours = "") {
    const lessonContainer = document.createElement("div");
    lessonContainer.classList.add("lesson");

    lessonContainer.innerHTML = `
        <input type="text" placeholder="Ders Adı" class="lessonName" value="${name}">
        <input type="number" class="weeklyHours" placeholder="Ders saati" value="${hours}">
        <h3>1. Dönem</h3>
        <input type="number" class="score term1" placeholder="Not 1" value="${term1[0]}">
        <input type="number" class="score term1" placeholder="Not 2" value="${term1[1]}">
        <br>
        <input type="number" class="score term1" placeholder="Not 3" value="${term1[2]}">
        <input type="number" class="score term1" placeholder="Not 4" value="${term1[3]}">
        
        <h3>2. Dönem</h3>
        <input type="number" class="score term2" placeholder="Not 1" value="">
        <input type="number" class="score term2" placeholder="Not 2" value="${term2[1]}">
        <br>
        <input type="number" class="score term2" placeholder="Not 3" value="${term2[2]}">
        <input type="number" class="score term2" placeholder="Not 4" value="${term2[3]}">

        <span class="average">Ortalama: 0</span>
        <button class="removeLesson">Kaldır</button>
    `;

    document.getElementById("lessons").appendChild(lessonContainer);

    lessonContainer.querySelectorAll("input").forEach(input => {
        input.addEventListener("input", () => {
            updateLessonAverage(lessonContainer);
            saveToStorage();
        });
    });

    lessonContainer.querySelector(".removeLesson").addEventListener("click", () => {
        lessonContainer.remove();
        saveToStorage();
    });

    updateLessonAverage(lessonContainer);
    saveToStorage();
}

function updateLessonAverage(lessonContainer) {
    const scoresTerm1 = [...lessonContainer.querySelectorAll(".term1")].map(input => Number(input.value));
    const scoresTerm2 = [...lessonContainer.querySelectorAll(".term2")].map(input => Number(input.value));

    const avgTerm1 = scoresTerm1.reduce((a, b) => a + b, 0) / scoresTerm1.length;
    const avgTerm2 = scoresTerm2.reduce((a, b) => a + b, 0) / scoresTerm2.length;

    const totalAvg = ((avgTerm1 + avgTerm2) / 2).toFixed(2);

    lessonContainer.querySelector(".average").innerText = `Ortalama: ${isNaN(totalAvg) ? 0 : totalAvg}`;
}

function calculateReportCard() {
    let totalScore = 0;
    let totalHours = 0;

    const lessons = document.querySelectorAll(".lesson");

    lessons.forEach(lesson => {
        const scoresTerm1 = [...lesson.querySelectorAll(".term1")].map(input => Number(input.value));
        const scoresTerm2 = [...lesson.querySelectorAll(".term2")].map(input => Number(input.value));
        const weeklyHours = Number(lesson.querySelector(".weeklyHours").value);

        const avgTerm1 = scoresTerm1.reduce((a, b) => a + b, 0) / scoresTerm1.length;
        const avgTerm2 = scoresTerm2.reduce((a, b) => a + b, 0) / scoresTerm2.length;

        const finalAvg = (avgTerm1 + avgTerm2) / 2;
        totalScore += finalAvg * weeklyHours;
        totalHours += weeklyHours;
    });

    const finalScore = totalScore / totalHours || 0;
    document.getElementById("result").innerText = `Karne Ortalaması: ${finalScore.toFixed(2)}`;
}

function saveToStorage() {
    const lessons = [];
    
    document.querySelectorAll(".lesson").forEach(lesson => {
        const name = lesson.querySelector(".lessonName").value;
        const scoresTerm1 = [...lesson.querySelectorAll(".term1")].map(input => Number(input.value));
        const scoresTerm2 = [...lesson.querySelectorAll(".term2")].map(input => Number(input.value));
        const weeklyHours = Number(lesson.querySelector(".weeklyHours").value);
        
        lessons.push({ name, scoresTerm1, scoresTerm2, weeklyHours });
    });

    localStorage.setItem("lessons", JSON.stringify(lessons));
}

function loadFromStorage() {
    const storedLessons = JSON.parse(localStorage.getItem("lessons")) || [];

    storedLessons.forEach(lesson => {
        addLesson(lesson.name, lesson.scoresTerm1, lesson.scoresTerm2, lesson.weeklyHours);
    });
      }
