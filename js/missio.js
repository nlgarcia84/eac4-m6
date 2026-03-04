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
        reset();
        // Guardem al LS l'últim agent que ha guanyat
        localStorage.setItem('rang', agentRank);
        localStorage.setItem('nom', agentName);

        // Posem en escolta la lupa amb l'event mouseover
        lupaElement.removeEventListener('mouseover', lupaMessage);

        // Estilem el missatge en verd indicant l'acert
        msgElement.classList.add('ok');

        // Innjectem el texte d'èxit
        msgElement.textContent = `Agent ${agentName} (${agentRank}), caixa oberta! Fitxer salvat.`;

        // Desactivem el botó de 'Provar' un cop descobert el codi
        tryBtnElement.setAttribute('disabled', true);
      } else {
        // Incrementem el número de fails fins a 5
        failIncrement();
      }
    });

    // Mostra el missatge de la pista al pasar per sobre de la lupa
    lupaElement.addEventListener('mouseover', () => {
      lupaMessage();
    });

    // Elimina el missatge al sortir de la lupa
    lupaElement.addEventListener('mouseout', () => {
      hintBoxElement.classList.add('hidden');
    });

    // Funció que genera el missatge de la pista
    const lupaMessage = () => {
      if (fails < MAX_FAILS) {
        failIncrement();
        let randomPosition = Math.floor(Math.random() * 4);
        hintBoxElement.textContent = `Pista: el codi conté el número ${SECRET.charAt(randomPosition)}`;
        hintBoxElement.classList.remove('hidden');
      }
    };

    // Recuperem el LS i el renderitzem al Record
    let recordName = localStorage.getItem('nom');
    let recordRank = localStorage.getItem('rang');
    recordTextElement.textContent = `${recordRank} ${recordName}`;

    const reset = () => {
      // Mostra el missatge de la pista al pasar per sobre de la lupa
      lupaElement.removeEventListener('mouseover', () => {
        lupaMessage();
      });

      // Mostrem el 'Tornar a Provar'
      retryFormElement.classList.remove('hidden');
      retryBtnElement.addEventListener('submit', (e) => {
        e.preventDefault();
      });
    };
  });
}
