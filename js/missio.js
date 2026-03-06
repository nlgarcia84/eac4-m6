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

    retryFormElement.addEventListener('submit', (e) => {
      e.preventDefault();
      reset();
    });

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

    // Funcio FailIncrement reutilitzable
    const failIncrement = () => {
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

            // Un cop arribat a cinc intents desactivem el botó de 'Provar'
            tryBtnElement.setAttribute('disabled', true);
            // Imprimim missatge de no-exit
            msgElement.textContent = `Agent ${agentName} (${agentRank}), missió fallida! El fitxer ha estat esborrat.`;

            reset();

            gameOver;
            break;
        }
      }
    };

    //
    tryBtnElement.addEventListener('click', () => {
      // Setegem la classe de msgElement per si está vermella
      msgElement.classList.remove('bad');

      if (codeInputElement.value === SECRET) {
        tryBtnElement.setAttribute('disabled', true);
        reset();

        // Guardem al LS l'últim agent que ha guanyat
        localStorage.setItem('rang', agentRank);
        localStorage.setItem('nom', agentName);

        // Estilem el missatge en verd indicant l'acert
        msgElement.classList.add('ok');

        // Innjectem el texte d'èxit
        msgElement.textContent = `Agent ${agentName} (${agentRank}), caixa oberta! Fitxer salvat.`;
      } else {
        // Incrementem el número de fails fins a 5
        failIncrement();
      }
    });

    // Aqui els events de 'mouseover' i 'mouseout'
    // Mostra el missatge de la pista al pasar per sobre de la lupa

    if ((fails < MAX_FAILS) & (codeInputElement.value !== SECRET)) {
      lupaElement.addEventListener('mouseover', () => {
        lupaMessage();
      });

      // Elimina el missatge al sortir de la lupa
      lupaElement.addEventListener('mouseout', () => {
        hintBoxElement.classList.add('hidden');
      });
    } else {
      tryBtnElement.setAttribute('disable', true);

      lupaElement.removeEventListener('mouseover', () => {
        lupaMessage();
      });
    }

    // Funció que genera el missatge de la pista
    const lupaMessage = () => {
      // Condicionem l'aparició del missatge segons s'hagi descobert el codi secret o no
      if (codeInputElement.value !== SECRET) {
        // Incrementa un fail
        failIncrement();

        // Creem el text amb el digit aleatori
        let randomPosition = Math.floor(Math.random() * 4);
        hintBoxElement.textContent = `Pista: el codi conté el número ${SECRET.charAt(randomPosition)}`;

        // Mostrem el missatge
        hintBoxElement.classList.remove('hidden');
      }
    };

    // Recuperem el LS i el renderitzem al Record
    let recordName = localStorage.getItem('nom');
    let recordRank = localStorage.getItem('rang');
    recordTextElement.textContent = `${recordRank} ${recordName}`;

    // Funció per resetejar
    const reset = () => {
      if (fails === MAX_FAILS || codeInputElement.value === SECRET) {
        retryFormElement.classList.remove('hidden');
        retryBtnElement.addEventListener('click', () => {
          tryBtnElement.removeAttribute('disabled');
          statusImgElement.src = '/img/estat0.png';
          fails = 0;
          failsElement.textContent = fails;
          msgElement.textContent = '';
        });
      } else {
        retryFormElement.classList.add('hidden');
      }
    };
  });
}
