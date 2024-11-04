let questions = [];
let currentQuestion = 0;
let score = 0;
let level = 1; // 1 para nível fácil, 2 para nível difícil
const enableLevel2 = false; // Defina como 'false' se não quiser utilizar o nível 2

async function fetchQuestions() {
    try {
        const response = await fetch("https://raw.githubusercontent.com/WalissonFelipe1415/palavras-chave/main/quiz.json");

        if (!response.ok) {
            throw new Error(`Erro ao buscar o arquivo: ${response.status}`);
        }

        const data = await response.json();
        console.log("Dados carregados com sucesso:", data); // Verifica o carregamento do JSON

        // Filtra as perguntas por nível e limita o número conforme o nível
        questions = data.filter(q => q.level === level);
        if (level === 1) {
            questions = questions.slice(0, 5); // 5 perguntas para nível fácil
        } else if (level === 2) {
            questions = questions.slice(0, 10); // 10 perguntas para nível difícil
        }

        if (questions.length === 0) {
            throw new Error("Nenhuma pergunta encontrada para este nível.");
        }

        loadQuestion();  // Carrega a primeira pergunta do nível
    } catch (error) {
        console.error("Erro ao carregar perguntas:", error);
        alert("Não foi possível carregar as perguntas. Verifique a URL e a conexão com a internet.");
    }
}

function loadQuestion() {
    if (currentQuestion >= questions.length) {
        if (level === 1 && enableLevel2) {
            showLevelComplete();
        } else {
            showResults();
        }
        return;
    }

    document.getElementById("nextBtn").disabled = true;

    const questionElement = document.getElementById("question");
    const optionButtons = document.querySelectorAll(".option");

    questionElement.innerText = questions[currentQuestion].question;
    optionButtons.forEach((button, index) => {
        button.innerText = questions[currentQuestion].options[index];
        button.style.backgroundColor = "#007bff";
        button.disabled = false;
    });
}

function selectOption(selectedOption) {
    const question = questions[currentQuestion];
    const optionButtons = document.querySelectorAll(".option");

    if (selectedOption === question.answer) {
        score++;
        optionButtons[selectedOption].style.backgroundColor = "#28a745";
    } else {
        optionButtons[selectedOption].style.backgroundColor = "#dc3545";
        optionButtons[question.answer].style.backgroundColor = "#28a745";
    }

    optionButtons.forEach(button => button.disabled = true);
    document.getElementById("nextBtn").disabled = false;
}

function nextQuestion() {
    currentQuestion++;
    loadQuestion();
}

function showLevelComplete() {
    const quizContainer = document.getElementById("quiz");
    quizContainer.innerHTML = `
        <h2>Parabéns! Você completou o nível 1.</h2>
        ${enableLevel2 ? '<button id="level2Btn" onclick="startLevel(2)">Ir para o Nível 2</button>' : ''}
    `;
}

function showResults() {
    const quizContainer = document.getElementById("quiz");
    quizContainer.innerHTML = `<h2>Você acertou ${score} de ${questions.length} perguntas!</h2>`;
}

// Função para iniciar um nível específico
function startLevel(selectedLevel) {
    level = selectedLevel;
    currentQuestion = 0;
    score = 0;
    fetchQuestions();
}

// Inicia o quiz diretamente no nível 1
startLevel(1);