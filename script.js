const checkBoxList = document.querySelectorAll(".custom-checkbox");
const inputFields = document.querySelectorAll(".goal-input");
const errorLabel = document.querySelector(".error-label");
const progressBar = document.querySelector(".progress-bar");
const progressValue = document.querySelector(".progress-value");
const progressLabel = document.querySelector(".progress-label");

const allQuotes = [
  "Raise the bar by completing your goals!",
  "Well begun is half done!",
  "Just a step away, keep going!",
  "Whoa! You just completed all the goals, time for chill :D",
];

const allTasks = JSON.parse(localStorage.getItem("allTasks")) || {
  first: {
    name: "",
    completed: false,
  },
  second: {
    name: "",
    completed: false,
  },
  third: {
    name: "",
    completed: false,
  },
};

let completedTasksCount = Object.values(allTasks).filter(
  (goal) => goal.completed
).length;
progressValue.style.width = `${
  (completedTasksCount / inputFields.length) * 100
}%`;
progressValue.innerHTML = `<span>${completedTasksCount}/${inputFields.length} Completed</span>`;
progressLabel.innerText = allQuotes[completedTasksCount];

checkBoxList.forEach((checkbox) => {
  checkbox.addEventListener("click", (e) => {
    const allGoalsAdded = [...inputFields].every(function (input) {
      return input.value;
    });

    if (allGoalsAdded) {
      checkbox.parentElement.classList.toggle("completed");
      // progressValue.style.width = "33.33%";
      const inputId = checkbox.nextElementSibling.id;
      allTasks[inputId].completed = !allTasks[inputId].completed;
      completedTasksCount = Object.values(allTasks).filter(
        (goal) => goal.completed
      ).length;
      progressValue.style.width = `${
        (completedTasksCount / inputFields.length) * 100
      }%`;
      progressValue.innerHTML = `<span>${completedTasksCount}/${inputFields.length} Completed</span>`;
      progressLabel.innerText = allQuotes[completedTasksCount];
      localStorage.setItem("allTasks", JSON.stringify(allTasks));
    } else {
      progressBar.classList.add("show-error");
    }
  });
});

inputFields.forEach((input) => {
  input.value = allTasks[input.id].name;

  if (allTasks[input.id].completed) {
    input.parentElement.classList.add("completed");
  }

  input.addEventListener("focus", () => {
    progressBar.classList.remove("show-error");
  });

  input.addEventListener("input", (e) => {
    if (allTasks[input.id].completed) {
      input.value = allTasks[input.id].name;
      return;
    }

    allTasks[input.id].name = input.value;

    localStorage.setItem("allTasks", JSON.stringify(allTasks));
  });
});
