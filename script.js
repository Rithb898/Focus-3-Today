// Select elements for checkboxes, input fields, error label, progress label, progress bar, 
// progress value, add task button, reset button, goals container, and hidden goals.
const checkBoxList = document.querySelectorAll(".custom-checkbox");
const inputFields = document.querySelectorAll(".goal-input");
const errorLabel = document.querySelector(".error-label");
const progressLabel = document.querySelector(".progress-label");
const progressBar = document.querySelector(".progress-bar");
const progressValue = document.querySelector(".progress-value");
const addTaskBtn = document.querySelector(".add-task-btn");
const resetBtn = document.querySelector(".reset-btn");
const goalsContainer = document.querySelector(".goals");
const hiddenGoals = document.querySelectorAll(".goal-hidden");

// List of motivational quotes to display based on completed goals.
const allQuotes = [
  "Raise the bar by completing your goals!",
  "Well begun is half done!",
  "Just a step away, keep going!",
  "Whoa! You just completed all the goals, time for chill :D",
];

// Load saved goals from local storage, or use default empty goals.
const allGoals = JSON.parse(localStorage.getItem("allGoals")) || {};

// Calculate the number of completed goals.
let completedGoalsCount = Object.values(allGoals).filter(
  (goal) => goal.completed
).length;

// Update the progress bar and label based on completed goals.
progressValue.style.width = `${
  (completedGoalsCount / inputFields.length) * 100
}%`;
progressValue.firstElementChild.innerText = `${completedGoalsCount}/${inputFields.length} completed`;
progressLabel.innerText = allQuotes[completedGoalsCount];

// Add event listener to each checkbox to update goal status and progress bar.
checkBoxList.forEach((checkbox) => {
  checkbox.addEventListener("click", (e) => {
    // Check if all input fields have values.
    const allGoalsAdded = [...inputFields].every(function (input) {
      return input.value;
    });

    if (allGoalsAdded) {
      // Toggle completed class and update goal status in local storage.
      checkbox.parentElement.classList.toggle("completed");
      const inputId = checkbox.nextElementSibling.id;
      allGoals[inputId].completed = !allGoals[inputId].completed;
      completedGoalsCount = Object.values(allGoals).filter(
        (goal) => goal.completed
      ).length;

      // Update progress bar and label.
      progressValue.style.width = `${
        (completedGoalsCount / inputFields.length) * 100
      }%`;
      progressValue.firstElementChild.innerText = `${completedGoalsCount}/${inputFields.length} completed`;
      progressLabel.innerText = allQuotes[completedGoalsCount];

      // Save updated goals to local storage.
      localStorage.setItem("allGoals", JSON.stringify(allGoals));
    } else {
      // Show error if not all input fields have values.
      progressBar.classList.add("show-error");
    }
  });
});

// Initialize input fields with saved goal values and add event listeners for input changes.
inputFields.forEach((input) => {
  if (allGoals[input.id]) {
    input.value = allGoals[input.id].name;

    if (allGoals[input.id].completed) {
      input.parentElement.classList.add("completed");
    }
  }

  input.addEventListener("focus", () => {
    progressBar.classList.remove("show-error");
  });

  input.addEventListener("input", (e) => {
    if (allGoals[input.id] && allGoals[input.id].completed) {
      input.value = allGoals[input.id].name;
      return;
    }

    if (allGoals[input.id]) {
      allGoals[input.id].name = input.value;
    } else {
      allGoals[input.id] = {
        name: input.value,
        completed: false,
      };
    }

    localStorage.setItem("allGoals", JSON.stringify(allGoals));
  });
});

// Function to reset tasks and progress at midnight.
function resetTasksAtMidnight() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  if (hours === 0 && minutes === 0 && seconds === 0) {
    // Reset all goals to default values.
    Object.keys(allGoals).forEach((key) => {
      allGoals[key].name = "";
      allGoals[key].completed = false;
    });

    // Clear input fields and remove completed class.
    inputFields.forEach((input) => {
      input.value = "";
      input.parentElement.classList.remove("completed");
    });

    // Reset progress bar and label.
    completedGoalsCount = 0;
    progressValue.style.width = "0%";
    progressValue.innerHTML = `<span>0/${inputFields.length} Completed</span>`;
    progressLabel.innerText = allQuotes[0];

    // Save reset goals to local storage.
    localStorage.setItem("allGoals", JSON.stringify(allGoals));
  }
}

// Check every second if it's midnight to reset tasks.
setInterval(resetTasksAtMidnight, 1000);
