let body = document.querySelector("body");
let startBtn = document.querySelector(".start-button");
let mainHeading = document.querySelector(".main-heading");
let questionContainer;
let data;
let score = 0;
let currentQuestion = 1;

data = [
  {
    question: "Web page editors works on a ____ principle.",
    options: ["WWW", "HTML", "WYSIWYG", "WYGWYS"],
    ans: 3,
  },
  {
    question: "Which program is used by web clients to view the web pages?",
    options: ["Web browser", "Protocol", "Web server", "Search Engine"],
    ans: 1,
  },
  {
    question:
      "What is the name of the location address of the hypertext documents?",
    options: ["URL", "Web server", "File", "Web address"],
    ans: 1,
  },
  {
    question: "What are shared on the Internet and are called as Web pages?",
    options: ["Programs", "Cables", "HTML Pages", "None"],
    ans: 3,
  },
  {
    question: "Which are used with a tag to modify its function?",
    options: ["Files", "Functions", "Attributes", "Documents"],
    ans: 3,
  },
];


//To be used when api is constructed

// fetch("../data/questions.json")
//   .then((response) => {
//     return response.json();
//   })
//   .then((d) => {
//     data = d;
//   });

function destory(element, after = 0) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      element.remove();
      resolve();
    }, after);
  });
}

//classes is array of strings
function create(type, classes) {
  return new Promise(function (resolve, reject) {
    let el = document.createElement(type);
    for (x in classes) {
      el.classList.add(classes[x]);
    }
    resolve(el);
  });
}

function addElement(parent, element, after = 0) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      parent.appendChild(element);
      resolve();
    }, after);
  });
}

function addDelay(time) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve();
    }, time);
  });
}

async function addQuestion(questionContainer) {
  let question = await create("p", []);
  question.innerText = data[currentQuestion - 1].question;
  questionContainer.appendChild(question);
  await addElement(body, questionContainer, 400);
  let currQuestionOptions = data[currentQuestion - 1].options;
  for (let i = 1; i <= 4; i++) {
    let option = await create("div", [
      "ans",
      "ans-top",
      `ans-left-${i}`,
      "animation-fade-in",
    ]);
    let attr = document.createAttribute("data-id");
    attr.value = i;
    option.setAttributeNode(attr);
    option.innerText = currQuestionOptions[i - 1];
    option.addEventListener("click", optionListener);
    await addElement(body, option, 150);
  }
}

async function optionListener(e) {
  if (e.detail > 1) return;
  let allOptions = document.querySelectorAll("[data-id]");
  if (allOptions.length < 4) return;
  let ans = e.currentTarget.getAttribute("data-id");
  let dArr = [];
  for (let x = 0; x < 4; x++) {
    allOptions[x].classList.add("animation-fade-out");
    dArr.push(destory(allOptions[x], 400));
  }
  await Promise.all(dArr);
  questionContainer.classList.add("animation-leave-left");
  await addDelay(400);
  await destory(questionContainer);
  let modal = await create("div", ["model"]);
  if (ans == data[currentQuestion - 1].ans) {
    score++;
    modal.innerHTML = "<i class='material-icons'>check_circle</i>";
  } else {
    score--;
    modal.innerHTML = "<i class='material-icons'>cancel</i>";
  }
  modal.classList.add("animation-enter-top");
  body.appendChild(modal);
  await addDelay(1500);
  modal.classList.remove("animation-enter-top");
  modal.classList.add("animation-fade-out-modal");
  await destory(modal, 400);
  if (currentQuestion < data.length) {
    questionContainer = await create("div", [
      "question-container",
      "animation-suck-out",
    ]);
    currentQuestion++;
    await addQuestion(questionContainer);
  } else {
    modal.innerHTML = `<p>SCORE:<br>${score}<p>`;
    modal.classList.remove("animation-fade-out-modal");
    modal.classList.add("animation-enter-top");
    body.appendChild(modal);
  }
}

startBtn.addEventListener("click", async function () {
  mainHeading.classList.add("animation-suck-in");
  await Promise.all([destory(mainHeading, 400), destory(startBtn)]);
  questionContainer = await create("div", [
    "question-container",
    "animation-suck-out",
  ]);
  await addQuestion(questionContainer);
});
