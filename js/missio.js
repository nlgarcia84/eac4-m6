// Config joc
const SECRET = '4978';
const MAX_FAILS = 5;
let fails = 0;
let gameOver = false;

// Escriu aquí el teu codi

if (!sessionStorage.getItem('nom') || !sessionStorage.getItem('rank')) {
  window.location.href = '/index.html';
} else {
  document.addEventListener('DOMContentLoaded', () => {
    const agentInfoElement = document.getElementById('agentInfo');
    const failsElement = document.getElementById('fails');
    const statusImgElement = document.getElementById('statusImg');
    const codeInputElement = document.getElementById('codeInput');
    const tryBtnElement = document.getElementById('tryBtn');
    const retryFormElement = document.getElementById('retryForm');
    const retryBtnElement = document.getElementById('retryBtn');
    const msgElement = document.getElementById('msg');
    const lupaElement = document.getElementById('lupa');
    const hintBoxElement = document.getElementById('hintBox');
    const recordTextElement = document.getElementById('recordText');
    const agentName = sessionStorage.getItem('nom');
    const agentRank = sessionStorage.getItem('rank');

    agentInfoElement.textContent = `${agentRank} ${agentName}`;

    // Comprovació camp input del codi, only numbers
    codeInputElement.addEventListener('keypress', (e) => {
      // Setegem el missatge
      msgElement.textContent = ``;

      // Limitem a quatre digits el codi
      codeInputElement.maxLength = 4;

      // Regex per lletres
      let lettersPattern = /[a-z]/i;

      // Regex per números
      let numbersPattern = /^[0-4]\d$/;

      if (e.key.match(lettersPattern)) {
        msgElement.textContent = `Només s'accepten caràcters numèrics.`;
      }

      if (e.key.match(numbersPattern)) {
        msgElement.textContent = ``;
      }
    });

    // Funcio Fail reutilitzable
    const fail = () => {
      if (codeInputElement.value === SECRET) {
        // Guardem al LS l'últim agent que ha guanyat
        localStorage.setItem('rang', agentRank);
        localStorage.setItem('nom', agentName);

        // Recuperem el LS i el renderitzem al Record
        let recordName = localStorage.getItem('nom');
        let recordRank = localStorage.getItem('rang');
        recordTextElement.textContent = `${recordRank} ${recordName}`;

        msgElement.classList.add('ok');
        msgElement.textContent = `Agent ${agentName} (${agentRank}), caixa oberta! Fitxer salvat.`;
        tryBtnElement.setAttribute('disabled', true);
        retryFormElement.classList.remove('hidden');
      } else {
        if (fails < MAX_FAILS) {
          fails++;
          failsElement.textContent = fails;
          msgElement.classList.add('bad');
          msgElement.textContent = 'Codi incorrecte. Torna-ho a intentar.';

          switch (fails) {
            case 0:
              statusImgElement.src = '/img/estat0.png';
              break;
            case 1:
              statusImgElement.src = '/img/estat1.png';
              break;
            case 2:
              statusImgElement.src = '/img/estat2.png';
              break;
            case 3:
              statusImgElement.src = '/img/estat3.png';
              break;
            case 4:
              statusImgElement.src = '/img/estat4.png';
              break;
            case 5:
              statusImgElement.src = '/img/estat5.png';
              break;
          }
        }
        if (fails === 5) {
          tryBtnElement.setAttribute('disabled', true);
          msgElement.textContent = `Agent ${agentName} (${agentRank}), missió fallida! El fitxer ha estat esborrat.`;
          retryFormElement.classList.remove('hidden');
          retryBtnElement.addEventListener('click', (e) => e.preventDefault());
          gameOver;
        }
      }
    };

    //
    tryBtnElement.addEventListener('click', () => {
      fail();
    });

    lupaElement.addEventListener('mouseover', () => {
      fail();
      let randomPosition = Math.floor(Math.random() * 4);
      hintBoxElement.textContent = `Pista: el codi conté el número ${SECRET.charAt(randomPosition)}`;
      hintBoxElement.classList.remove('hidden');
    });

    lupaElement.addEventListener('mouseout', () => {
      hintBoxElement.classList.add('hidden');
    });
  });
}
