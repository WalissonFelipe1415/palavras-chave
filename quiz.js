let allQuestions = [];
let questions = [];
let currentQuestion = 0;
let score = 0;

async function fetchQuestions() {
    try {
        const response = await fetch("https://raw.githubusercontent.com/WalissonFelipe1415/palavras-chave/refs/heads/main/quiz.json");

        if (!response.ok) {
            throw new Error(`Erro ao buscar o arquivo: ${response.status}`);
        }

        allQuestions = await response.json(); // Armazena todas as perguntas carregadas
        console.log("Dados carregados com sucesso:", allQuestions);
        
        startQuiz(); // Inicia o quiz após carregar as perguntas
    } catch (error) {
        console.error("Erro ao carregar perguntas:", error);
        alert("Não foi possível carregar as perguntas. Verifique a URL e a conexão com a internet.");
    }
}

function startQuiz() {
    questions = allQuestions; // Carrega todas as perguntas
    currentQuestion = 0;
    score = 0;
    loadQuestion(); // Carrega a primeira pergunta
}

function loadQuestion() {
    if (currentQuestion >= questions.length) {
        showResults(); // Mostra os resultados quando todas as perguntas são respondidas
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
        optionButtons[selectedOption].style.backgroundColor = "#28a745"; // Verde se acertar
    } else {
        optionButtons[selectedOption].style.backgroundColor = "#dc3545"; // Vermelho se errar
        optionButtons[question.answer].style.backgroundColor = "#28a745"; // Verde para a resposta correta
    }

    optionButtons.forEach(button => button.disabled = true);
    document.getElementById("nextBtn").disabled = false;

    // Espera 1 segundo antes de carregar a próxima pergunta
    setTimeout(() => {
        currentQuestion++;
        loadQuestion();
    }, 1000);
}

function showResults() {
    const quizContainer = document.getElementById("quiz");
    const percentage = (score / questions.length) * 100;
    const congratulatoryMessage = percentage >= 60 ? `<h3>Parabéns! Você acertou ${score} de ${questions.length} perguntas!</h3>` : "";

    quizContainer.innerHTML = `
        <h2>Você acertou ${score} de ${questions.length} perguntas!</h2>
        ${congratulatoryMessage}
    `;
}

// Inicia o quiz ao carregar as perguntas
fetchQuestions();
