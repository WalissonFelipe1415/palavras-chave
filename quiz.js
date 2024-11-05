let allQuestions = [];
let questions = [];
let currentQuestion = 0;
let score = 0;
let level = 1; // 1 para nível fácil, 2 para nível difícil
const enableLevel2 = true; // Defina como 'false' se não quiser utilizar o nível 2

async function fetchQuestions() {
    try {
        const response = await fetch("https://raw.githubusercontent.com/WalissonFelipe1415/palavras-chave/refs/heads/main/quiz.json");

        if (!response.ok) {
            throw new Error(`Erro ao buscar o arquivo: ${response.status}`);
        }

        allQuestions = await response.json(); // Armazena todas as perguntas carregadas
        console.log("Dados carregados com sucesso:", allQuestions);
        
        startLevel(level); // Inicia o nível 1 após carregar as perguntas
    } catch (error) {
        console.error("Erro ao carregar perguntas:", error);
        alert("Não foi possível carregar as perguntas. Verifique a URL e a conexão com a internet.");
    }
}

function loadQuestionsByLevel(selectedLevel) {
    questions = allQuestions.filter(q => q.level === selectedLevel);

    if (selectedLevel === 1) {
        questions = questions.slice(0, 5); // 5 perguntas para nível fácil
    } else if (selectedLevel === 2) {
        questions = questions.slice(0, 10); // 10 perguntas para nível difícil
    }

    currentQuestion = 0;
    loadQuestion(); // Carrega a primeira pergunta do nível atual
    updateLevelDisplay(); // Atualiza a exibição do nível
}

function loadQuestion() {
    if (currentQuestion >= questions.length) {
        // Quando todas as perguntas de um nível forem respondidas
        if (level === 1 && enableLevel2) {
            // Se estiver no Nível 1 e o Nível 2 estiver habilitado
            level = 2; // Muda para o Nível 2
            loadQuestionsByLevel(level); // Carrega as perguntas do Nível 2
            return; // Sai da função para evitar a chamada de showResults
        } else {
            showResults(); // Caso contrário, mostre os resultados
            return;
        }
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
    }, 1000); // Espera 1 segundo antes de carregar a próxima pergunta
}

function showResults() {
    const quizContainer = document.getElementById("quiz");
    const percentage = (score / questions.length) * 100; // Calcula a porcentagem de acertos
    const congratulatoryMessage = percentage >= 60 ? "<h3>Parabéns! Você acertou ${score} de ${questions.length} perguntas!</h3>" : "";

    quizContainer.innerHTML = `
        <h2>Você acertou ${score} de ${questions.length} perguntas!</h2>
        ${congratulatoryMessage}
    `;
}

// Função para iniciar um nível específico
function startLevel(selectedLevel) {
    level = selectedLevel;
    score = 0;
    loadQuestionsByLevel(level);
}

// Função para atualizar a exibição do nível
function updateLevelDisplay() {
    document.getElementById("levelDisplay").innerText = `Nível: ${level}`;
}

// Inicia o quiz diretamente no nível 1 ao carregar as perguntas
fetchQuestions();
