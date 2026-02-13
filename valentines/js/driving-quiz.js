const questions = [
  { id: 1, q: "Ce semnifica bratul ridicat vertical al politistului rutier?", options: ["Liber trecerea pentru vehiculele din fata politistului", "Atentie, oprire pentru toti participantii care se apropie (cu exceptia celor care nu pot opri in siguranta)", "Obligatie de a vira la dreapta"], answer: 1, exp: "Bratul ridicat vertical inseamna Atentie, oprire pentru participantii care se apropie, cu exceptia celor care nu mai pot opri in siguranta." },
  { id: 2, q: "Bratul sau bratele intinse orizontal ale politistului rutier indica oprirea pentru:", options: ["Participantii care circula din directia/directiile intersectate de bratul/bratele intinse", "Doar vehiculele care vin din spatele politistului", "Doar pietonii care traverseaza"], answer: 0, exp: "Semnalul cu bratul/bratele intinse orizontal inseamna Oprire pentru directiile intersectate de bratele intinse." },
  { id: 3, q: "Dupa ce politistul a facut semnalul cu bratele intinse orizontal si apoi le coboara, semnificatia devine:", options: ["Liber trecerea", "Tot Oprire pentru cei care vin din fata ori din spate", "Reduceti viteza"], answer: 1, exp: "Dupa semnalul de Oprire, politistul poate cobori bratele, iar pozitia ramane Oprire pentru cei din fata si din spate." },
  { id: 4, q: "Noaptea, balansarea pe verticala a unui dispozitiv cu lumina rosie sau a bastonului fluorescent-reflectorizant semnifica:", options: ["Continuarea deplasarii", "Oprire pentru participantii spre care este indreptat semnalul", "Marirea vitezei"], answer: 1, exp: "Balansarea pe verticala a luminii rosii/bastonului inseamna Oprire pentru cei catre care este indreptat semnalul." },
  { id: 5, q: "Balansarea pe verticala a bratului cu palma orientata catre sol semnifica:", options: ["Reducerea vitezei", "Oprire imediata", "Obligatie de depasire"], answer: 0, exp: "Semnalul cu palma orientata catre sol indica reducerea vitezei." },
  { id: 6, q: "Rotirea vioaie a bratului politistului rutier semnifica:", options: ["Oprire", "Marirea vitezei de deplasare a vehiculelor / grabirea traversarii de catre pietoni", "Intoarcere interzisa"], answer: 1, exp: "Rotirea vioaie a bratului este semnalul pentru marirea vitezei sau grabirea traversarii pietonilor, dupa caz." },
  { id: 7, q: "Politistul care dirijeaza circulatia poate folosi fluierul:", options: ["Doar pentru pietoni", "Doar in afara localitatii", "Pentru a intari/insoti comenzile si semnalele"], answer: 2, exp: "Regulamentul permite folosirea fluierului la efectuarea comenzilor si semnalelor de dirijare." },
  { id: 8, q: "Oprirea participantilor la trafic este obligatorie si la semnalele date de:", options: ["Agentul de cale ferata, la trecerile la nivel", "Orice persoana aflata pe marginea drumului", "Orice pasager dintr-un vehicul"], answer: 0, exp: "Regulamentul prevede obligativitatea opririi la semnalele agentilor de cale ferata la trecerile la nivel." },
  { id: 9, q: "Daca semnalul brat ridicat vertical este dat intr-o intersectie, acesta:", options: ["Impune oprirea si vehiculelor deja angajate in traversare", "Nu impune oprirea vehiculelor deja angajate in traversare", "Obliga vehiculele sa dea inapoi"], answer: 1, exp: "Semnalul dat in intersectie nu impune oprirea celor deja angajati in traversare." },
  { id: 10, q: "Intr-o intersectie dirijata, daca semnalele politistului contrazic semaforul, conduita corecta este:", options: ["Respecti semaforul", "Respecti semnalul politistului rutier", "Intri doar daca nu vine nimeni"], answer: 1, exp: "In intersectiile dirijate, se respecta indicatiile politistului rutier." },

  { id: 11, q: "La intersectiile cu circulatie nedirijata, trebuie sa acorzi prioritate:", options: ["Vehiculelor care vin din stanga", "Vehiculelor care vin din dreapta", "Vehiculului mai mare"], answer: 1, exp: "In intersectiile nedirijate se aplica prioritatea de dreapta." },
  { id: 12, q: "In intersectiile cu circulatie dirijata, conducatorul trebuie sa respecte:", options: ["Doar regula prioritatii de dreapta", "Doar marcajele, ignorand semaforul", "Indicatoarele, culoarea semaforului sau semnalele politistului rutier"], answer: 2, exp: "In intersectiile dirijate se respecta semnalizarea existenta si, dupa caz, politistul." },
  { id: 13, q: "La apropierea de o intersectie, trebuie sa circuli:", options: ["Cu viteza cat mai mare", "Cu viteza care iti permite oprirea pentru acordarea prioritatii", "Cu aceeasi viteza indiferent de conditii"], answer: 1, exp: "Legea cere viteza de apropiere care permite oprirea in siguranta." },
  { id: 14, q: "Este permis sa patrunzi intr-o intersectie pe semnal verde daca se va bloca intersectia?", options: ["Da", "Nu", "Da, daca folosesti avariile"], answer: 1, exp: "Este interzisa patrunderea in intersectie daca se produce blocarea acesteia." },
  { id: 15, q: "In intersectiile cu sens giratoriu semnalizate ca atare, prioritate au:", options: ["Vehiculele care circula in interiorul sensului", "Vehiculele care urmeaza sa patrunda", "Vehiculele care vin din stanga"], answer: 0, exp: "Vehiculele aflate deja in sensul giratoriu au prioritate." },
  { id: 16, q: "In intersectia dintre un drum public si un drum inchis circulatiei publice, prioritate au:", options: ["Vehiculele de pe drumul inchis", "Vehiculele de pe drumul public", "Se aplica intotdeauna prioritatea de dreapta"], answer: 1, exp: "Vehiculele care circula pe drumul public au prioritate." },
  { id: 17, q: "In intersectiile nedirijate, trebuie sa acorzi prioritate:", options: ["Vehiculelor pe sine (tramvai)", "Doar autovehiculelor", "Doar motocicletelor"], answer: 0, exp: "In intersectiile nedirijate, vehiculele pe sine au prioritate." },
  { id: 18, q: "Vehiculul care circula pe sine (tramvaiul) isi pierde prioritatea cand:", options: ["Schimba banda", "Efectueaza virajul spre stanga (sau semnalizarea stabileste altfel)", "Depaseste 30 km/h"], answer: 1, exp: "Tramvaiul isi pierde prioritatea la viraj stanga, daca nu exista alta reglementare." },
  { id: 19, q: "In intersectii dirijate prin indicatoare cu aceeasi semnificatie pentru ambele drumuri, prioritatea se acorda:", options: ["Conform prioritatii de dreapta", "Celor din stanga", "Cui accelereaza primul"], answer: 0, exp: "Cand semnificatia indicatorului este aceeasi, se aplica prioritatea de dreapta." },
  { id: 20, q: "Vehiculul care circula pe un drum semnalizat cu Drum cu prioritate are:", options: ["Obligatia de a opri la fiecare intersectie", "Prioritate fata de vehiculele de pe drumul fara prioritate", "Prioritate doar daca este taxi"], answer: 1, exp: "Indicatorul Drum cu prioritate confera prioritate de trecere in raport cu drumul fara prioritate." },

  { id: 21, q: "Marcajul longitudinal cu linie continua inseamna:", options: ["Poti trece peste el daca semnalizezi", "Este interzisa incalcarea lui", "Este doar orientativ"], answer: 1, exp: "Linia continua nu poate fi incalcata." },
  { id: 22, q: "Marcajul longitudinal discontinuu permite trecerea peste el:", options: ["Numai noaptea", "Niciodata", "Daca manevra/reglementarile permit"], answer: 2, exp: "Linia discontinua poate fi trecuta cand manevra este permisa." },
  { id: 23, q: "Marcajul cu o linie continua si una discontinua alaturate se respecta:", options: ["Conform liniei mai apropiate in sensul de mers", "Conform liniei mai departate", "Oricare, la alegere"], answer: 0, exp: "Se respecta semnificatia liniei celei mai apropiate de vehicul." },
  { id: 24, q: "Marcajul transversal cu linie continua asociat indicatorului Oprire indica:", options: ["Linia inaintea careia vehiculul trebuie oprit", "Zona de parcare", "Loc de claxonare obligatorie"], answer: 0, exp: "Linia continua transversala indica locul opririi." },
  { id: 25, q: "Marcajul transversal cu linie discontinua indica:", options: ["Loc permis depasirii", "Linia care nu trebuie depasita cand se impune cedarea", "Loc de intoarcere"], answer: 1, exp: "Linia de cedare marcheaza limita de oprire/cedare." },
  { id: 26, q: "Inscriptia STOP pe carosabil:", options: ["Nu se foloseste niciodata", "Se poate aplica inaintea marcajului de oprire", "Apare doar pe autostrazi"], answer: 1, exp: "STOP poate insoti marcajul asociat indicatorului Oprire." },
  { id: 27, q: "Indicatoarele instalate pe drumurile publice sunt, in principal:", options: ["De avertizare, reglementare, orientare/informare si pentru lucrari", "Doar de avertizare si orientare", "Doar de interzicere"], answer: 0, exp: "Clasificarea include avertizare, reglementare, orientare/informare si lucrari." },
  { id: 28, q: "Daca un indicator este instalat deasupra unei benzi, semnificatia lui este valabila:", options: ["Pentru intreaga parte carosabila", "Doar pentru banda/benzile deasupra carora este instalat", "Doar pentru vehicule lente"], answer: 1, exp: "Indicatorul deasupra benzii se aplica acelei benzi." },
  { id: 29, q: "Indicatoarele temporare pentru lucrari se deosebesc, de regula, prin:", options: ["Sunt intotdeauna luminoase", "Fond verde", "Fond galben"], answer: 2, exp: "Indicatoarele temporare folosesc fond galben." },
  { id: 30, q: "In lipsa semnalizarii lungimii sectorului ori a indicatorului de sfarsit, indicatoarele de restrictie isi inceteaza semnificatia:", options: ["Dupa 500 m", "La intersectia cea mai apropiata", "La iesirea din localitate"], answer: 1, exp: "Fara alta precizare, efectul restrictiei inceteaza la prima intersectie." },

  { id: 31, q: "Inainte de depasire, conducatorul este obligat sa:", options: ["Se asigure ca poate depasi fara pericol", "Folosesca avariile", "Opreasca si sa ceara permisiune"], answer: 0, exp: "Depasirea se face doar dupa asigurare completa." },
  { id: 32, q: "Conducatorul vehiculului depasit are obligatia sa:", options: ["Mareasca viteza", "Nu mareasca viteza", "Se opreasca imediat"], answer: 1, exp: "Vehiculul depasit nu are voie sa accelereze." },
  { id: 33, q: "Depasirea este interzisa in intersectii cu circulatie:", options: ["Dirijata", "Nedirijata", "In sens giratoriu in toate cazurile"], answer: 1, exp: "Depasirea este interzisa in intersectiile nedirijate." },
  { id: 34, q: "Depasirea pe trecerile pentru pietoni semnalizate este:", options: ["Permisa daca nu sunt pietoni", "Interzisa", "Permisa doar motocicletelor"], answer: 1, exp: "Pe trecerea pentru pietoni depasirea este interzisa." },
  { id: 35, q: "Se interzice depasirea la trecerile la nivel cu calea ferata si la mai putin de 50 m inainte:", options: ["Adevarat", "Fals", "Depinde de vehicul"], answer: 0, exp: "Regula interzice depasirea in aceste zone." },
  { id: 36, q: "Depasirea pe poduri, sub poduri si in tuneluri este:", options: ["Permisa intotdeauna", "Interzisa, cu exceptii limitate", "Permisa doar in localitate"], answer: 1, exp: "In mod general, depasirea este interzisa in aceste locuri." },
  { id: 37, q: "Depasirea este interzisa cand manevra implica incalcarea marcajului continuu ce separa sensurile:", options: ["Nu, daca semnalizezi", "Da", "Doar pe drumuri europene"], answer: 1, exp: "Marcajul continuu nu poate fi incalcat pentru depasire." },
  { id: 38, q: "Cand vehiculul din fata a semnalizat si s-a incadrat pentru viraj la stanga, depasirea se face:", options: ["Prin dreapta", "Prin stanga", "Nu se depaseste niciodata"], answer: 0, exp: "Vehiculul care vireaza stanga se depaseste prin dreapta in conditiile legii." },
  { id: 39, q: "Depasirea in curbe sau in locuri cu vizibilitate sub 50 m este:", options: ["Permisa cu faruri aprinse", "Interzisa", "Permisa doar bicicletelor"], answer: 1, exp: "Vizibilitatea redusa sub 50 m interzice depasirea." },
  { id: 40, q: "Este interzisa depasirea unei coloane in asteptare daca intri pe sensul opus:", options: ["Adevarat", "Fals", "Doar pe autostrada"], answer: 0, exp: "Manevra este interzisa daca presupune intrarea pe sensul opus." },

  { id: 41, q: "Semnalul verde al semaforului pentru vehicule:", options: ["Permite trecerea", "Interzice trecerea", "Permite doar viraj dreapta"], answer: 0, exp: "Semnalul verde permite trecerea." },
  { id: 42, q: "Sageata verde intermitenta spre dreapta sub semaforul principal:", options: ["Permite virajul dreapta cu acordare prioritate", "Permite mersul inainte", "Interzice dreapta"], answer: 0, exp: "Sageata permite dreapta, cu acordarea prioritatii participantilor indreptatiti." },
  { id: 43, q: "Semnalul rosu al semaforului pentru vehicule:", options: ["Interzice trecerea", "Permite trecerea cu prudenta", "Permite schimbarea benzii in intersectie"], answer: 0, exp: "Rosu inseamna oprire." },
  { id: 44, q: "La rosu, vehiculul se opreste:", options: ["Inainte de marcajul STOP/trecere pietoni ori in dreptul semaforului", "Dupa trecerea de pietoni", "Doar daca vine cineva"], answer: 0, exp: "Pozitia de oprire este inaintea marcajelor/trecerii ori in dreptul semaforului, dupa caz." },
  { id: 45, q: "Rosu si galben concomitent indica:", options: ["Urmeaza verde", "Urmeaza galben intermitent", "Urmeaza rosu"], answer: 0, exp: "Rosu + galben anunta aparitia semnalului verde." },
  { id: 46, q: "Cand galbenul apare dupa verde, conducatorul:", options: ["Nu trece de locul de oprire, exceptand imposibilitatea opririi in siguranta", "Accelereaza obligatoriu", "Opreste in mijlocul intersectiei"], answer: 0, exp: "Galben dupa verde impune oprire, daca aceasta poate fi facuta in siguranta." },
  { id: 47, q: "Semnalul galben intermitent:", options: ["Interzice trecerea", "Permite trecerea cu viteza redusa si respectarea regulilor", "Permite trecerea fara obligatii"], answer: 1, exp: "Galbenul intermitent permite trecerea cu prudenta." },
  { id: 48, q: "Conducatorul care intra in intersectie la verde este obligat sa respecte:", options: ["Si indicatoarele din interiorul intersectiei", "Doar semaforul", "Doar marcajele"], answer: 0, exp: "Indicatoarele din interiorul intersectiei raman obligatorii." },
  { id: 49, q: "Pentru pietoni, semnalul verde intermitent indica:", options: ["Traversarea trebuie inceputa acum", "Timpul de traversare se epuizeaza; pietonul aflat in traversare trebuie sa grabeasca", "Pietonul trebuie sa se opreasca pe carosabil"], answer: 1, exp: "Verdele intermitent pentru pietoni anunta apropierea semnalului rosu." },
  { id: 50, q: "Semnalul rosu pentru pietoni:", options: ["Interzice angajarea in traversare", "Permite traversarea daca nu vin masini", "Permite traversarea doar in alergare"], answer: 0, exp: "Rosu pentru pietoni interzice traversarea." },

  { id: 51, q: "Limita maxima de viteza in localitati, daca nu exista alta reglementare, este:", options: ["60 km/h", "50 km/h", "40 km/h"], answer: 1, exp: "In localitati, limita uzuala este 50 km/h." },
  { id: 52, q: "Pe autostrazi, limita maxima pentru categoria B este:", options: ["130 km/h", "110 km/h", "90 km/h"], answer: 0, exp: "Pentru categoria B pe autostrada, limita este 130 km/h." },
  { id: 53, q: "Pe drum expres sau drum national european (E), limita maxima pentru categoria B este:", options: ["90 km/h", "100 km/h", "120 km/h"], answer: 1, exp: "Pentru categoria B, limita este 100 km/h pe aceste drumuri." },
  { id: 54, q: "Pe celelalte drumuri in afara localitatilor, limita maxima pentru categoria B este:", options: ["80 km/h", "90 km/h", "100 km/h"], answer: 1, exp: "Limita uzuala in afara localitatilor, pe celelalte drumuri, este 90 km/h." },
  { id: 55, q: "In localitati, administratorul drumului poate stabili pentru A si B o limita superioara, dar nu mai mult de:", options: ["70 km/h", "80 km/h", "90 km/h"], answer: 1, exp: "Pentru A si B, limita superioara in localitate nu poate depasi 80 km/h." },
  { id: 56, q: "Conducatorul trebuie sa respecte regimul legal de viteza si sa o adapteze conditiilor astfel incat sa poata manevra in siguranta:", options: ["Da", "Nu", "Doar pe ploaie"], answer: 0, exp: "Viteza trebuie adaptata permanent conditiilor reale de trafic." },
  { id: 57, q: "Conducatorul care circula in spatele altui vehicul are obligatia:", options: ["Sa pastreze distanta suficienta", "Sa se lipeasca de vehiculul din fata", "Sa claxoneze intermitent"], answer: 0, exp: "Trebuie pastrata distanta de siguranta pentru evitarea coliziunii." },
  { id: 58, q: "In afara localitatilor, viteza maxima pentru autovehicule care tracteaza remorci/semiremorci este:", options: ["Cu 10 km/h mai mica decat limita categoriei", "Cu 10 km/h mai mare", "Identica"], answer: 0, exp: "La tractare, limita se reduce cu 10 km/h in afara localitatilor." },
  { id: 59, q: "Pentru conducatorii cu mai putin de un an practica, viteza maxima admisa este:", options: ["Cu 20 km/h mai mica", "Cu 20 km/h mai mare", "Identica"], answer: 0, exp: "Conducatorii incepatori au limita redusa cu 20 km/h." },
  { id: 60, q: "Pentru tractoare si mopede, viteza maxima admisa este:", options: ["45 km/h", "60 km/h", "70 km/h"], answer: 0, exp: "Pentru tractoare si mopede, limita este 45 km/h." },

  { id: 61, q: "Oprirea voluntara pe trecerile pentru pietoni este:", options: ["Permisa sub 30 secunde", "Interzisa", "Permisa daca nu sunt pietoni"], answer: 1, exp: "Oprirea voluntara pe trecerea pentru pietoni este interzisa." },
  { id: 62, q: "Oprirea voluntara la mai putin de 25 m inainte sau dupa o trecere pentru pietoni este:", options: ["Permisa", "Interzisa", "Permisa doar noaptea"], answer: 1, exp: "Regulamentul interzice oprirea in zona de 25 m inainte/dupa trecere." },
  { id: 63, q: "Oprirea voluntara in intersectii (inclusiv in sens giratoriu) este:", options: ["Interzisa", "Permisa daca nu stânjenesti", "Permisa doar pentru incarcare"], answer: 0, exp: "Oprirea voluntara in intersectie este interzisa." },
  { id: 64, q: "Oprirea voluntara pe poduri, pe si sub pasaje denivelate si pe viaducte este:", options: ["Permisa daca exista trotuar", "Interzisa", "Permisa cu avarii"], answer: 1, exp: "Aceste zone sunt interzise pentru oprire voluntara." },
  { id: 65, q: "Oprirea voluntara in curbe sau in locuri cu vizibilitate sub 50 m este:", options: ["Permisa daca esti pe dreapta", "Interzisa", "Permisa in afara carosabilului indiferent de loc"], answer: 1, exp: "Vizibilitatea sub 50 m interzice oprirea voluntara." },
  { id: 66, q: "Oprirea voluntara in statiile de transport public si la mai putin de 25 m inainte/dupa acestea este:", options: ["Interzisa", "Permisa daca nu vine autobuz", "Permisa doar in weekend"], answer: 0, exp: "Regula interzice oprirea in statii si in zona de protectie de 25 m." },
  { id: 67, q: "Oprirea voluntara pe partea carosabila a autostrazilor, drumurilor expres si drumurilor nationale europene (E) este:", options: ["Interzisa", "Permisa pe banda 1", "Permisa doar ziua"], answer: 0, exp: "Pe aceste drumuri, oprirea voluntara pe carosabil este interzisa." },
  { id: 68, q: "Oprirea voluntara pe trotuar este permisa numai daca:", options: ["Ramane liber cel putin 1 m pentru pietoni", "Ai vehicul mic", "Pui triunghi reflectorizant"], answer: 0, exp: "Trebuie asigurat minimum 1 m pentru circulatia pietonilor." },
  { id: 69, q: "Stationarea voluntara este interzisa:", options: ["Doar unde este indicator Stationarea interzisa", "In toate cazurile in care oprirea voluntara este interzisa", "Doar pe autostrada"], answer: 1, exp: "Stationarea e interzisa oriunde oprirea e interzisa, plus alte cazuri." },
  { id: 70, q: "Stationarea voluntara pe drumuri publice cu latime mai mica de 6 m este:", options: ["Interzisa", "Permisa daca ramane loc", "Permisa cu acordul politiei"], answer: 0, exp: "Stationarea pe drumuri mai inguste de 6 m este interzisa." },

  { id: 71, q: "La apropierea unui autovehicul de interventie cu semnal rosu + sonor, trebuie:", options: ["Sa opresti imediat pe acostament sau cat mai aproape de margine", "Sa accelerezi", "Sa continui normal"], answer: 0, exp: "La semnale rosii si sonore, trebuie sa eliberezi de urgenta calea." },
  { id: 72, q: "La apropierea unui autovehicul de interventie cu semnal albastru + sonor, trebuie:", options: ["Sa opresti intotdeauna", "Sa reduci viteza, sa mergi cat mai aproape de margine si sa acorzi prioritate", "Sa accelerezi"], answer: 1, exp: "La albastru + sonor, se reduce viteza si se acorda prioritate." },
  { id: 73, q: "Au regim de circulatie prioritară numai autovehiculele in misiuni de urgenta care:", options: ["Au doar semnale luminoase", "Nu au nevoie de semnalizare", "Au in functiune semnalele luminoase si sonore"], answer: 2, exp: "Regimul prioritar presupune semnale luminoase si sonore active." },
  { id: 74, q: "Daca te apropii de intrarea in intersectie simultan cu un autovehicul prioritar cu semnale, esti obligat:", options: ["Sa ii acorzi prioritate", "Sa intri primul daca ai verde", "Sa claxonezi si sa continui"], answer: 0, exp: "Autovehiculul prioritar are prioritate de trecere." },
  { id: 75, q: "La o statie cu alveola, din care un autobuz semnalizeaza iesirea, conducatorul de pe banda de langa bordura trebuie:", options: ["Sa reduca viteza si, la nevoie, sa opreasca pentru a-i permite reintrarea", "Sa continue constant", "Sa depaseasca pe trotuar"], answer: 0, exp: "Trebuie facilitata reintrarea in trafic a autobuzului din alveola." },
  { id: 76, q: "Daca tramvaiul e oprit in statie fara refugiu, trebuie sa acorzi prioritate:", options: ["Pietonilor care urca/coboara", "Doar tramvaiului", "Nimanui"], answer: 0, exp: "Pietonii care urca/coboara au prioritate in aceasta situatie." },
  { id: 77, q: "Vehiculul pe drum cu indicatorul Drum cu prioritate are prioritate:", options: ["Da, fata de vehiculele de pe drumul fara prioritate", "Nu, se aplica mereu dreapta", "Doar ziua"], answer: 0, exp: "Drumul cu prioritate confera prioritate fata de drumul fara prioritate." },
  { id: 78, q: "Daca trebuie sa intri pe sens opus pentru a ocoli obstacol, trebuie:", options: ["Sa reduci viteza si, la nevoie, sa opresti pentru sensul opus", "Sa intri rapid", "Sa claxonezi continuu"], answer: 0, exp: "Trebuie permis traficului din sens opus sa treaca in siguranta." },
  { id: 79, q: "Poti depasi o coloana oficiala:", options: ["Niciodata", "Doar daca politistul rutier semnalizeaza manevra", "Oricand"], answer: 1, exp: "Manevra e permisa doar la semnalul politistului rutier." },
  { id: 80, q: "Pe un drum in panta, daca pe sensul celui care urca exista obstacol imobil, prioritate are:", options: ["Vehiculul care coboara", "Vehiculul care urca", "Vehiculul mai puternic"], answer: 1, exp: "In aceasta situatie, prioritate are vehiculul care urca." },

  { id: 81, q: "Este permisa folosirea telefonului mobil in timpul conducerii:", options: ["Da, in localitate", "Nu, exceptand dispozitivele hands-free", "Da, pe banda intai"], answer: 1, exp: "Folosirea telefonului in mana in timpul condusului este interzisa." },
  { id: 82, q: "Centura/dispozitivele de siguranta omologate trebuie purtate:", options: ["Doar de conducator", "De conducator si ocupantii locurilor prevazute cu centuri, cu exceptiile legale", "Doar in afara localitatii"], answer: 1, exp: "Obligatia se aplica conducatorului si ocupantilor locurilor prevazute cu centuri." },
  { id: 83, q: "Copiii cu varsta sub 3 ani se transporta:", options: ["Obligatoriu in dispozitive de retinere omologate", "In brate pe bancheta", "Doar pe scaunul din fata"], answer: 0, exp: "Copiii sub 3 ani trebuie transportati in dispozitive de retinere omologate." },
  { id: 84, q: "Copiii sub 12 ani sau cu inaltime sub 150 cm trebuie:", options: ["Sa poarte centuri adaptate greutatii si dimensiunilor", "Sa stea fara centura daca sunt in spate", "Sa fie tinuti in brate"], answer: 0, exp: "Copiii trebuie asigurati cu sisteme adaptate dimensiunii si greutatii." },
  { id: 85, q: "Transportul copiilor pana la 12 ani pe scaunul din fata (inclusiv in brate) este:", options: ["Obligatoriu", "Permis daca sunt tinuti de un adult", "Interzis"], answer: 2, exp: "Transportul copiilor de pana la 12 ani pe scaunul din fata este interzis." },
  { id: 86, q: "Conducatorii motocicletelor/mopedelor si pasagerii au obligatia sa poarte:", options: ["Casca de protectie omologata", "Centura", "Vesta reflectorizanta in orice conditii"], answer: 0, exp: "Pentru motociclete/mopede, casca omologata este obligatorie." },
  { id: 87, q: "Pe autostrazi este interzisa circulatia vehiculelor care nu pot depasi viteza de:", options: ["40 km/h", "50 km/h", "60 km/h"], answer: 1, exp: "Vehiculele care nu pot depasi 50 km/h nu au voie pe autostrada." },
  { id: 88, q: "Pe autostrazi este interzisa oprirea/stationarea pe banda de urgenta:", options: ["Cu exceptia cazurilor justificate si a autovehiculelor cu regim prioritar", "In orice situatie, fara exceptii", "Doar ziua"], answer: 0, exp: "Banda de urgenta se foloseste doar in cazuri justificate sau de catre vehicule prioritare." },
  { id: 89, q: "Mijloacele de avertizare sonora (claxonul) pot fi folosite:", options: ["Oricand, fara limitari", "Cu respectarea conditiilor legale si nu in zona Claxonarea interzisa", "Doar in parcari"], answer: 1, exp: "Claxonul se foloseste doar in conditiile legii si nu in zonele interzise." },
  { id: 90, q: "Daca ai creat un obstacol pe drumul public si nu il poti evita, ai obligatia:", options: ["Sa il inlaturi sau sa il semnalizezi si sa anunti administratorul drumului si politia", "Sa pleci", "Sa astepti fara semnalizare"], answer: 0, exp: "Obstacolul trebuie inlaturat sau semnalizat si raportat autoritatilor competente." }
];

const totalQuestions = questions.length;

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

let currentIndex = 0;
let correctCount = 0;
let wrongCount = 0;
let answered = false;

metaLine.textContent = `90 intrebari grila • Categoria B • A/B/C`;
renderQuestion();

nextBtn.addEventListener("click", () => {
  if (currentIndex >= totalQuestions - 1) {
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
  const current = questions[currentIndex];
  answered = false;
  feedbackText.textContent = "";
  feedbackText.className = "feedback-text";
  nextBtn.disabled = true;
  nextBtn.textContent = currentIndex === totalQuestions - 1 ? "Finalizare" : "Urmatoarea";

  progressText.textContent = `Intrebarea ${currentIndex + 1}/${totalQuestions} • Corecte: ${correctCount} • Gresite: ${wrongCount}`;
  questionText.textContent = `${current.id}. ${current.q}`;
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
  const current = questions[currentIndex];
  const buttons = Array.from(optionsWrap.querySelectorAll(".option-btn"));

  buttons.forEach((button, idx) => {
    button.disabled = true;
    if (idx === current.answer) {
      button.classList.add("correct");
    }
  });

  if (chosenIndex === current.answer) {
    correctCount += 1;
    feedbackText.classList.add("good");
    feedbackText.textContent = `Corect. ${current.exp}`;
  } else {
    wrongCount += 1;
    clickedButton.classList.add("wrong");
    feedbackText.classList.add("bad");
    feedbackText.textContent = `Gresit. ${current.exp}`;
  }

  progressText.textContent = `Intrebarea ${currentIndex + 1}/${totalQuestions} • Corecte: ${correctCount} • Gresite: ${wrongCount}`;
  nextBtn.disabled = false;
}

function finishQuiz() {
  quizPanel.classList.add("hidden");
  resultPanel.classList.remove("hidden");

  const score = Math.round((correctCount / totalQuestions) * 100);
  resultTitle.textContent = "Simulare terminata";
  resultText.textContent = `Scor: ${correctCount}/${totalQuestions} (${score}%). Gresite: ${wrongCount}.`;
  resultBtn.textContent = "Continua";
  resultBtn.dataset.action = "continue";
}
