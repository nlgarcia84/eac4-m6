const recordTextElement = document.getElementById('recordText');
const formElement = document.getElementById('agentForm');
const agentNameElement = document.getElementById('agentName');
const agentRankElement = document.getElementById('agentRank');
const formRadios = formElement.querySelectorAll('input[type="radio"]');
const errorBoxElement = document.getElementById('errorBox');

let errorMessage = '';

// Recuperem el LS i el renderitzem al Record
let recordName = localStorage.getItem('nom');
let recordRank = localStorage.getItem('rang');
recordTextElement.textContent = `${recordRank} ${recordName}`;

formElement.addEventListener('submit', (e) => {
  e.preventDefault();

  // Seteja el missatge d'error cada cop que fem un submit
  errorMessage = '';

  // Apliquem validacions
  globalValidation();

  // Injectem errorMessage al paragraf
  errorBoxElement.textContent = errorMessage;

  // Guardem a sessionStorage
  sessionStorage.setItem('nom', agentNameElement.value);
  sessionStorage.setItem('rank', agentRankElement.value);
});

const globalValidation = () => {
  // Validació del nom
  if (!agentNameElement.value) {
    errorMessage += "Has d'indicar el nom de l'agent. ";
  }

  // Validació del rang
  if (!agentRankElement.value) {
    errorMessage += 'Has de seleccionar un rang. ';
  }

  // Validació del grup de suport
  let isChecked = false;
  formRadios.forEach((radio) => {
    if (radio.checked) {
      isChecked = true;
    }
  });
  if (!isChecked) {
    errorMessage += 'Has de triar un equip de suport';
  }

  // Si están complets es redirigeix a missii.html
  if (agentNameElement.value && agentRankElement.value && isChecked) {
    window.location.href = '/missio.html';
  }
};
