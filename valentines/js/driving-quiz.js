const MAX_QUESTIONS = 26;
const MAX_WRONG = 5;

const setOne = [
  { q: "Cand esti obligat sa acorzi prioritate pietonilor?", options: ["Cand se afla pe trecerea de pietoni", "Doar daca sunt copii", "Doar noaptea"], answer: 0 },
  { q: "Ce semnifica indicatorul STOP?", options: ["Reduci viteza", "Oprire obligatorie", "Prioritate fata de toate vehiculele"], answer: 1 },
  { q: "Ce trebuie sa faci inainte de schimbarea directiei de mers?", options: ["Semnalizezi si te asiguri", "Claxonezi lung", "Aprinzi avariile"], answer: 0 },
  { q: "Care este limita uzuala de viteza in localitate pentru categoria B?", options: ["50 km/h", "70 km/h", "90 km/h"], answer: 0 },
  { q: "Ce inseamna marcajul longitudinal continuu?", options: ["Poate fi incalcat la depasire", "Nu poate fi depasit/incalcat", "Separare pentru parcare"], answer: 1 },
  { q: "Cand folosesti luminile de intalnire ziua?", options: ["Doar pe autostrada", "In tunele, ceata sau vizibilitate redusa", "Niciodata"], answer: 1 },
  { q: "Cum procedezi la culoarea galbena a semaforului?", options: ["Accelerezi sa treci", "Opresti daca poti in siguranta", "Ai prioritate"], answer: 1 },
  { q: "Depasirea este interzisa:", options: ["La trecerile pentru pietoni semnalizate", "Pe drum drept", "Cand ai vizibilitate buna"], answer: 0 },
  { q: "Ce obligatii ai la trecerea la nivel cu calea ferata fara bariere?", options: ["Treci rapid", "Reduci, te asiguri si acorzi prioritate trenului", "Claxonezi si treci"], answer: 1 },
  { q: "Cand esti obligat sa porti centura de siguranta?", options: ["Numai in afara localitatii", "Numai pe autostrada", "In timpul deplasarii, in toate drumurile publice"], answer: 2 },
  { q: "Cum procedezi cand esti depasit?", options: ["Maresti viteza", "Pastrezi directia si nu accelerezi", "Te apropii de ax"], answer: 1 },
  { q: "In sens giratoriu, cine are prioritate?", options: ["Cei care intra", "Cei care circula deja in sens", "Vehiculele mari"], answer: 1 },
  { q: "Ce este distanta de siguranta?", options: ["Distanta minima care permite oprirea fara coliziune", "Distanta fata de bordura", "Distanta de la semafor"], answer: 0 },
  { q: "Ce faci daca observi un accident cu victime?", options: ["Pleci ca sa nu blochezi traficul", "Anunti 112 si acorzi primul ajutor daca poti", "Filmezi si postezi"], answer: 1 },
  { q: "Folosirea telefonului mobil la volan fara hands-free este:", options: ["Permisa", "Interzisa", "Permisa doar in localitate"], answer: 1 },
  { q: "Ce semnifica indicatorul triunghi cu margine rosie si copii?", options: ["Trecere pietoni", "Presemnalizare zona frecventata de copii", "Drum inchis"], answer: 1 },
  { q: "Cand poti folosi banda de urgenta pe autostrada?", options: ["Cand depasesti", "Doar in caz de urgenta/defectiune", "Cand e trafic"], answer: 1 },
  { q: "La pornirea de pe loc, trebuie sa:", options: ["Te asiguri si semnalizezi", "Pornesti imediat", "Claxonezi obligatoriu"], answer: 0 },
  { q: "Cum reactionezi la acvaplanare?", options: ["Franezi brusc", "Ridici treptat piciorul de pe acceleratie si tii directia", "Tragi de volan stanga-dreapta"], answer: 1 },
  { q: "Ce obligatie ai fata de vehiculele cu regim prioritar (semnale in functiune)?", options: ["Le ignori daca te grabesti", "Le acorzi prioritate si eliberezi calea", "Le depasesti"], answer: 1 },
  { q: "Cand este permisa stationarea pe trotuar?", options: ["Cand ramane spatiu pietonilor si este permis prin semnalizare", "Intotdeauna", "Niciodata"], answer: 0 },
  { q: "Semnificatia indicatorului Cedeaza trecerea este:", options: ["Oprire obligatorie in orice situatie", "Acordi prioritate vehiculelor de pe drumul prioritar", "Prioritate pentru tine"], answer: 1 },
  { q: "In ce situatie este interzisa intoarcerea?", options: ["In intersectii unde este interzisa prin indicator/ marcaj", "Pe drum national", "In afara localitatii"], answer: 0 },
  { q: "Ce faci cand un pieton intentioneaza sa traverseze regulamentar?", options: ["Maresti viteza", "Acordi prioritate", "Il ocolesti pe contrasens"], answer: 1 },
  { q: "Ce inseamna lumina rosie intermitenta la semafor pentru trecere la nivel?", options: ["Poti trece daca nu vine trenul", "Oprire obligatorie", "Circulatie libera"], answer: 1 },
  { q: "Care este rolul ABS?", options: ["Scurteaza mereu distanta indiferent de aderenta", "Previne blocarea rotilor la franare", "Creste viteza maxima"], answer: 1 },
  { q: "Cand este recomandata franarea de motor?", options: ["La coborari", "Doar pe autostrada", "Nu este recomandata"], answer: 0 },
  { q: "Pe timp de noapte, la intalnirea cu alt vehicul folosesti:", options: ["Faza lunga permanent", "Faza de intalnire", "Avariile"], answer: 1 },
  { q: "Cum se efectueaza depasirea corecta?", options: ["Asigurare, semnalizare, depasire rapida, revenire in siguranta", "Fara semnalizare", "Pe orice parte"], answer: 0 },
  { q: "Cand este interzisa oprirea voluntara?", options: ["In curbe cu vizibilitate redusa", "In parcare amenajata", "La marginea drumului unde e permis"], answer: 0 }
];

const setTwo = [
  { q: "Ce faci cand intri pe un drum cu prioritate?", options: ["Ai prioritate fata de cei de pe acelasi drum", "Trebuie sa opresti la fiecare intersectie", "Nu mai semnalizezi"], answer: 0 },
  { q: "Cand este obligatoare folosirea anvelopelor de iarna?", options: ["Cand carosabilul este acoperit cu zapada, gheata sau polei", "Din noiembrie pana in martie obligatoriu", "Doar pe autostrada"], answer: 0 },
  { q: "Ce inseamna dublul marcaj continuu?", options: ["Depasirea permisa pentru motociclete", "Interzis sa il incalci", "Banda reversibila"], answer: 1 },
  { q: "Care este regula de prioritate in intersectia nedirijata?", options: ["Prioritate de dreapta", "Prioritate pentru vehiculul mai mare", "Primul venit trece"], answer: 0 },
  { q: "Cand ai voie sa folosesti claxonul?", options: ["Pentru a saluta prieteni", "Pentru evitarea unui pericol imediat", "Cand te enervezi"], answer: 1 },
  { q: "Ce trebuie sa verifici inainte de plecare?", options: ["Starea tehnica de baza: lumini, frane, anvelope", "Doar nivelul radio", "Numai combustibilul"], answer: 0 },
  { q: "La semafor verde poti porni:", options: ["Fara asigurare", "Doar dupa ce te asiguri ca poti traversa in siguranta", "Numai daca ai claxonat"], answer: 1 },
  { q: "Cum procedezi la trecerea unei coloane oficiale?", options: ["Te aliniezi dupa ea", "Acordi prioritate si opresti daca e necesar", "Depasesti coloana"], answer: 1 },
  { q: "Cand este interzisa depasirea biciclistilor?", options: ["Cand nu ai spatiu lateral suficient", "Cand merg incet", "Cand ai masina puternica"], answer: 0 },
  { q: "Ce semnifica indicatorul cu cerc rosu si fond alb?", options: ["Interzis accesul tuturor vehiculelor", "Drum prioritar", "Parcare obligatorie"], answer: 0 },
  { q: "Conducerea sub influenta alcoolului este:", options: ["Permisa in cantitati mici", "Interzisa", "Permisa noaptea"], answer: 1 },
  { q: "Cum reduci riscul de oboseala la drum lung?", options: ["Pauze regulate", "Muzica foarte tare si fara pauze", "Mergi continuu"], answer: 0 },
  { q: "Ce faci cand esti orbit de farurile unui vehicul din sens opus?", options: ["Privesti usor spre marginea din dreapta", "Aprinzi faza lunga", "Accelerezi"], answer: 0 },
  { q: "Pe carosabil umed, distanta de franare:", options: ["Scade", "Creste", "Ramane aceeasi"], answer: 1 },
  { q: "Cand trebuie folosita semnalizarea?", options: ["La orice schimbare de directie sau banda", "Doar la viraj dreapta", "Numai in oras"], answer: 0 },
  { q: "Ce faci daca ratai iesirea de pe autostrada?", options: ["Mers inapoi pe banda de urgenta", "Continui pana la urmatoarea iesire", "Intorci imediat"], answer: 1 },
  { q: "In apropierea scolilor, conduita corecta este:", options: ["Atentie sporita si viteza redusa", "Claxon repetat", "Accelerare"], answer: 0 },
  { q: "Cand este obligatorie oprirea la semnalul politistului rutier?", options: ["Numai noaptea", "Intotdeauna cand este semnalizat", "Doar daca esti in localitate"], answer: 1 },
  { q: "Ce inseamna marcajul in zig-zag langa statie?", options: ["Zona unde oprirea/ stationarea este restrictionata", "Loc de depasire", "Parcare rezidentiala"], answer: 0 },
  { q: "In ce situatie poti trece pe galben intermitent?", options: ["Cu respectarea semnificatiei indicatorului de prioritate", "Ai prioritate absoluta", "Doar cu avarii"], answer: 0 },
  { q: "Care este comportamentul corect la o pana de cauciuc in mers?", options: ["Ti directia ferm si reduci treptat viteza", "Franezi violent", "Tragi brusc de volan"], answer: 0 },
  { q: "Ce document trebuie sa ai la tine cand conduci?", options: ["Permis de conducere valabil", "Doar buletin", "Doar talon"], answer: 0 },
  { q: "Cand se folosesc luminile de ceata?", options: ["In conditii de ceata densa/ ninsoare abundenta", "In orice seara", "Cand ploua usor"], answer: 0 },
  { q: "Inainte de a deschide portiera pe partea carosabila:", options: ["Te asiguri din spate si lateral", "O deschizi rapid", "Claxonezi"], answer: 0 },
  { q: "In cazul unei franari de urgenta, pasagerii sunt protejati mai bine de:", options: ["Centuri si tetiere corect reglate", "Scaun inclinat mult pe spate", "Geamuri deschise"], answer: 0 },
  { q: "Ce obligatii ai la indicatorul Drum in lucru?", options: ["Reduci viteza si respecti semnalizarea temporara", "Ignori indicatoarele temporare", "Depasesti orice utilaj"], answer: 0 },
  { q: "Cum procedezi cand semaforul nu functioneaza intr-o intersectie?", options: ["Aplici regulile de prioritate si indicatoarele existente", "Treci primul", "Astepti politie obligatoriu"], answer: 0 },
  { q: "Ce inseamna conducere preventiva?", options: ["Anticipare, adaptare viteza si pastrare distantei", "Conducere agresiva", "Conducere cat mai rapida"], answer: 0 },
  { q: "Ce faci daca vehiculul derapeaza usor in curba?", options: ["Corectezi fin directia si reduci usor acceleratia", "Franezi brusc", "Tragi frana de mana"], answer: 0 },
  { q: "Cand este permisa oprirea pe banda 1 in oras?", options: ["Cand nu este interzisa si nu incomodezi circulatia", "Oriunde", "Doar cu avarii pornite"], answer: 0 }
];

const questionSets = [setOne, setTwo];

const metaLine = document.getElementById("metaLine");
const progressText = document.getElementById("progressText");
const questionText = document.getElementById("questionText");
const optionsWrap = document.getElementById("optionsWrap");
const feedbackText = document.getElementById("feedbackText");
const nextBtn = document.getElementById("nextBtn");
const quizPanel = document.getElementById("quizPanel");
const resultPanel = document.getElementById("resultPanel");
const resultTitle = document.getElementById("resultTitle");
const resultText = document.getElementById("resultText");
const resultBtn = document.getElementById("resultBtn");

let selectedSetIndex = Math.floor(Math.random() * questionSets.length);
let sessionQuestions = shuffle([...questionSets[selectedSetIndex]]).slice(0, MAX_QUESTIONS);
let currentIndex = 0;
let wrongCount = 0;
let correctCount = 0;
let answered = false;

metaLine.textContent = `Set ${selectedSetIndex + 1} din 2 • ${MAX_QUESTIONS} intrebari • Maxim ${MAX_WRONG} greseli`;
renderQuestion();

nextBtn.addEventListener("click", () => {
  if (currentIndex >= sessionQuestions.length - 1) {
    finishQuiz();
    return;
  }

  currentIndex += 1;
  renderQuestion();
});

resultBtn.addEventListener("click", () => {
  if (resultBtn.dataset.action === "continue") {
    window.location.href = "yoyo2007.htm";
    return;
  }

  window.location.reload();
});

function renderQuestion() {
  const current = sessionQuestions[currentIndex];
  answered = false;
  feedbackText.textContent = "";
  feedbackText.className = "feedback-text";
  nextBtn.disabled = true;
  nextBtn.textContent = currentIndex === sessionQuestions.length - 1 ? "Finalizare" : "Urmatoarea";

  progressText.textContent = `Intrebarea ${currentIndex + 1}/${MAX_QUESTIONS} • Corecte: ${correctCount} • Greseli: ${wrongCount}/${MAX_WRONG}`;
  questionText.textContent = current.q;
  optionsWrap.innerHTML = "";

  current.options.forEach((opt, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option-btn";
    btn.textContent = `${String.fromCharCode(65 + index)}. ${opt}`;
    btn.addEventListener("click", () => handleAnswer(index, btn));
    optionsWrap.appendChild(btn);
  });
}

function handleAnswer(chosenIndex, clickedButton) {
  if (answered) {
    return;
  }

  answered = true;
  const current = sessionQuestions[currentIndex];
  const optionButtons = Array.from(optionsWrap.querySelectorAll(".option-btn"));

  optionButtons.forEach((button, idx) => {
    button.disabled = true;
    if (idx === current.answer) {
      button.classList.add("correct");
    }
  });

  if (chosenIndex === current.answer) {
    correctCount += 1;
    feedbackText.textContent = "Corect.";
    feedbackText.classList.add("good");
  } else {
    wrongCount += 1;
    clickedButton.classList.add("wrong");
    feedbackText.textContent = "Gresit.";
    feedbackText.classList.add("bad");
  }

  progressText.textContent = `Intrebarea ${currentIndex + 1}/${MAX_QUESTIONS} • Corecte: ${correctCount} • Greseli: ${wrongCount}/${MAX_WRONG}`;

  if (wrongCount > MAX_WRONG) {
    showFail();
    return;
  }

  nextBtn.disabled = false;
}

function finishQuiz() {
  if (wrongCount > MAX_WRONG) {
    showFail();
    return;
  }

  quizPanel.classList.add("hidden");
  resultPanel.classList.remove("hidden");
  resultTitle.textContent = "Ai trecut testul.";
  resultText.textContent = `Rezultat: ${correctCount} corecte, ${wrongCount} gresite.`;
  resultBtn.textContent = "Continua";
  resultBtn.dataset.action = "continue";
}

function showFail() {
  quizPanel.classList.add("hidden");
  resultPanel.classList.remove("hidden");
  resultTitle.textContent = "Test picat.";
  resultText.textContent = `Ai depasit limita de ${MAX_WRONG} greseli. Incearca din nou.`;
  resultBtn.textContent = "Reia testul";
  resultBtn.dataset.action = "retry";
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
