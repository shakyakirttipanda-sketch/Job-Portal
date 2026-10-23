// Mobile navigation
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => navLinks.classList.remove("show"));
});

// Course buttons
document.querySelectorAll(".course-btn").forEach(button => {
  button.addEventListener("click", () => {
    const course = button.dataset.course;
    alert(`Welcome to ${course}! Your course has started.`);
    localStorage.setItem("selectedCourse", course);
  });
});

// Login modal
const loginBtn = document.getElementById("loginBtn");
const loginModal = document.getElementById("loginModal");
const closeModal = document.getElementById("closeModal");
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

loginBtn.addEventListener("click", () => loginModal.classList.add("show"));
closeModal.addEventListener("click", () => loginModal.classList.remove("show"));

loginModal.addEventListener("click", (event) => {
  if (event.target === loginModal) {
    loginModal.classList.remove("show");
  }
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value;
  localStorage.setItem("studentEmail", email);
  loginMessage.textContent = "Login successful! Welcome to LearnHub.";
  loginForm.reset();
});

// Quiz
const questions = [
  {
    question: "Which language is used to structure a web page?",
    options: ["HTML", "Python", "Java", "SQL"],
    answer: "HTML"
  },
  {
    question: "Which language is commonly used for web page styling?",
    options: ["CSS", "C", "Java", "PHP"],
    answer: "CSS"
  },
  {
    question: "Which language adds interactivity to web pages?",
    options: ["HTML", "CSS", "JavaScript", "XML"],
    answer: "JavaScript"
  },
  {
    question: "Which programming language is known for its simple syntax?",
    options: ["Python", "Assembly", "COBOL", "Fortran"],
    answer: "Python"
  },
  {
    question: "AI stands for:",
    options: [
      "Automatic Internet",
      "Artificial Intelligence",
      "Advanced Interface",
      "Applied Information"
    ],
    answer: "Artificial Intelligence"
  }
];

const quizContainer = document.getElementById("quizContainer");

questions.forEach((item, index) => {
  const div = document.createElement("div");
  div.className = "question";

  let html = `<h3>${index + 1}. ${item.question}</h3>`;
  item.options.forEach(option => {
    html += `
      <label class="option">
        <input type="radio" name="question${index}" value="${option}">
        ${option}
      </label>`;
  });

  div.innerHTML = html;
  quizContainer.appendChild(div);
});

document.getElementById("submitQuiz").addEventListener("click", () => {
  let score = 0;

  questions.forEach((item, index) => {
    const selected = document.querySelector(
      `input[name="question${index}"]:checked`
    );

    if (selected && selected.value === item.answer) {
      score++;
    }
  });

  const percentage = Math.round((score / questions.length) * 100);
  document.getElementById("quizResult").textContent =
    `Your Score: ${score}/${questions.length} (${percentage}%)`;
});

// Contact form
document.getElementById("contactForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("name").value;
  alert(`Thank you, ${name}! Your message has been submitted.`);
  event.target.reset();
});

// Display previously selected course if available
const selectedCourse = localStorage.getItem("selectedCourse");
if (selectedCourse) {
  console.log("Last selected course:", selectedCourse);
}
