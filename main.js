/*Declaração de globais*/
var telaAtual = 0;
const dicionarioTelas = {
    0: telaLogin,
    1: telaHome,
    2: roleta,
    3: foguete,
    4: jogoDoBicho,
    5: miner
}
var saldo = localStorage.getItem("saldo") ? parseFloat(localStorage.getItem("saldo")) : 1000.00; // Saldo inicial ou recuperado do localStorage
var totalAposta = localStorage.getItem("totalAposta") ? parseFloat(localStorage.getItem("totalAposta")) : 0.00; // Valor apostado inicial ou recuperado do localStorage
isPortrait = (window.innerHeight > window.innerWidth);

(function valorApostaFormat (){
    /*Formatação*/
    document.getElementById("valorAposta").addEventListener("input", function(e) {// Faz o input da aposta ficar bonito
        let input = e.target;
        let valor = input.value.replace(/\D/g, ""); // Remove tudo que não for número
        valor = (parseInt(valor, 10) / 100).toLocaleString("pt-BR", { // Converte para número e divide por 100 para manter 2 casas decimais
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        input.value = `$ ${valor}`; // Adiciona símbolo $ manualmente
    });

    /*Atalhos do teclado*/
    document.getElementById("valorAposta").addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
            if ((e.shiftKey) && (document.getElementById("retirar").disabled == false)) {apostar(1)}
            else if ((e.altKey) && (document.getElementById("retirarTudo").disabled == false)){apostar(2)}
            else if (document.getElementById("apostar").disabled == false) {apostar(0)}
        }
    });
})();

function random(min, max, qtde = 1, repetir = true) {
    /*Sorteio simples de 1 número*/
    if (qtde==1) {return (Math.floor(Math.random() * (max - min + 1)) + min)}

    /*Sorteio de (qtde) números*/
    else if (repetir == true){
        let numeros = [];
        for (let i = 0; i < qtde; i++) {numeros.push(random(min, max))}
        return numeros;
    }

    /*Sorteio de (qtde) números distintos*/
    else {
        let numeros = [];
        while (numeros.length < qtde) {
            let num = random(min, max);
            if (!numeros.includes(num)) {numeros.push(num)}
        }
        return numeros;
    }
}


function logar() {
    const user = document.getElementById(`user`).value;
    const senha = document.getElementById(`senha`).value;

    /*Caso user e senha estejam válidos*/
    if (user && senha){
        document.getElementById(`nomeUsuario`).textContent = user;
        document.getElementById(`telaLogin`).style.display =`none`;
        document.getElementById(`telaHome`).style.display =`block`;
        document.getElementById(`user`).value = ``;
        document.getElementById(`senha`).value = ``;
        telaAtual = 1;
    } 

    /*Caso user ou senha não tenham sido preenchidos*/
    else {alert("Usuário ou senha inválidos!")}
}


function voltar() {
    if (telaAtual==1) { //telaHome
        document.getElementById(`telaHome`).style.display =`none`;
        document.getElementById(`telaLogin`).style.display =`block`;
        telaAtual = 0;
    }
    else {
        dicionarioTelas[telaAtual](-1);
        document.getElementById(`financeiroJogos`).style.display = "none";
        mostrarGrid();
        telaAtual = 1;
    }
}

function ocultarGrid() {
    document.getElementById(`fundoGrid`).style.display = `none`;
    document.getElementById(`grid-2x2`).style.display = `none`;
}
function mostrarGrid() {
    document.getElementById(`fundoGrid`).style.display = `flex`;
    document.getElementById(`grid-2x2`).style.display = `grid`;
}


function atualizarSaldo() { // Atualiza o saldo e o valor apostado na tela
    document.getElementById("saldo").textContent = `$ ${saldo.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
    document.getElementById("valorApostando").textContent = `$ ${totalAposta.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
    document.getElementById("saldoPortrait").textContent = `$ ${saldo.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
    document.getElementById("valorApostandoPortrait").textContent = `$ ${totalAposta.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
    localStorage.setItem("saldo", saldo);
    localStorage.setItem("totalAposta", totalAposta);
}
atualizarSaldo();

function apostar(f) {
    const valorAposta = document.getElementById("valorAposta").value;
    const valorNumerico = parseFloat(valorAposta.replace(/[^0-9,-]+/g, "").replace(",", "."));
    
    if ((isNaN(valorNumerico) || (valorNumerico <= 0)) && (f!=2)) {
        if (f==0) alert("Por favor, insira um valor válido para a aposta.");
        else if (f==1) alert("Por favor, insira um valor válido para a retirada.");
        return;
    }
    else if ((valorNumerico > saldo) && (f==0)) {
        alert("Saldo insuficiente para realizar esta aposta.");
        return;
    }
    else if ((valorNumerico > totalAposta) && (f==1)){
        alert("Valor apostado insuficiente para retirar esta quantia.");
        return;
    }

    if (f==0) {
        saldo -= valorNumerico;
        totalAposta += valorNumerico;
        alert(`Aposta de R$ ${valorNumerico.toFixed(2)} realizada com sucesso!`);
    } 
    else if (f==1) {
        saldo += valorNumerico;
        totalAposta -= valorNumerico;
        alert(`Retirada de R$ ${valorNumerico.toFixed(2)} realizada com sucesso!`);
    }
    else if (f==2){
        if (totalAposta==0){alert("Você não possui nada para retirar")}
        else{
            saldo += totalAposta;
            alert(`Retirada de R$ ${totalAposta.toFixed(2)} realizada com sucesso!`);
            totalAposta = 0;
        }
    }
    atualizarSaldo();
    document.getElementById("valorAposta").value = `$ 0,00`;
    document.getElementById("valorAposta").blur();
}

function ativarAposta(f){
    if (f==0){
        document.getElementById(`apostar`).disabled = true;
        document.getElementById(`retirar`).disabled = true;
        document.getElementById(`retirarTudo`).disabled = true;
    }
    else if (f==1){
        document.getElementById(`apostar`).disabled = false;
        document.getElementById(`retirar`).disabled = false;
        document.getElementById(`retirarTudo`).disabled = false;
    }
}


(function corrigirLayout(){
    let alturaAnterior = window.innerHeight;
    window.addEventListener('resize', () => {
        const alturaAtual = window.innerHeight;
        if (alturaAtual > alturaAnterior) {correcao()}
        alturaAnterior = alturaAtual;
    });
    function correcao() {
        const fundo = document.getElementById('fundo');
        if (fundo) {fundo.style.height = window.innerHeight + 'px'}
        const fundo2 = document.getElementById('fundo2');
        if (fundo2) {fundo.style.height = window.innerHeight + 'px'}
    }
})();




async function roleta(f=0) {
    if (f === 0) {
        /*Inicialização*/
        telaAtual = 2;
        ocultarGrid();
        document.getElementById("financeiroJogos").style.display = "block";

        const premios = ["-10%", "+10%", "-20%", "+20%", "-35%", "+35%", "-50%", "+50%", "-100%", "+100%"];
        globalThis.animationFrameId = null;
        globalThis.forcarResultado = false;
        globalThis.resultado = null;
        globalThis.anguloPrevisto = null;

        /*Geração da roleta*/
        function criarRoleta(containerId, opcoes = {}, duracao) {
            const { width, height, items, colors, buttonLabel, zIndex } = opcoes;
            const container = document.getElementById(containerId);
            if (!container) return console.error("Contêiner da roleta não encontrado:", containerId);

            container.innerHTML = `
                <div id="roletaRoleta" style="text-align: center; font-family: sans-serif; z-index: ${zIndex}; position: relative;">
                    <canvas width="${width}px" height="${height}px" style="margin-bottom: 10px;"></canvas><br/>
                    <button class="botao-roleta">${buttonLabel}</button>
                </div>
            `;

            const canvas = container.querySelector("canvas");
            const ctx = canvas.getContext("2d");
            const raio = width / 2;
            let anguloAtual = 0;
            globalThis.girando = false;

            function desenharRoleta() {
                const anguloPorSegmento = 2 * Math.PI / items.length;
                ctx.clearRect(0, 0, width, height);

                for (let i = 0; i < items.length; i++) {
                    const anguloInicio = anguloAtual + i * anguloPorSegmento;
                    const anguloFim = anguloInicio + anguloPorSegmento;

                    /*Setores*/
                    ctx.beginPath();
                    ctx.moveTo(raio, raio);
                    ctx.arc(raio, raio, raio, anguloInicio, anguloFim);
                    ctx.fillStyle = colors[i % colors.length];
                    ctx.fill();

                    /*Texto*/
                    ctx.save();
                    ctx.translate(raio, raio);
                    ctx.rotate(anguloInicio + anguloPorSegmento / 2);
                    ctx.textAlign = "right";
                    ctx.fillStyle = colors[i % colors.length * -1 + 1];
                    ctx.font = "bold 20px sans-serif";
                    isPortrait ? ctx.fillText(items[i], raio - 20, 5) : ctx.fillText(items[i], raio - 50, 10);
                    ctx.restore();
                }

                /*Indicador*/
                ctx.fillStyle = "#000";
                ctx.beginPath();
                ctx.moveTo(raio, 30);
                ctx.lineTo(raio - 10, 10);
                ctx.lineTo(raio + 10, 10);
                ctx.closePath();
                ctx.fill();

                /*Borda*/
                ctx.beginPath();
                ctx.arc(raio, raio, raio - 5, 0, 2 * Math.PI); // -1 para ficar dentro da borda
                ctx.lineWidth = 10; // Espessura da borda
                ctx.strokeStyle = "#af9a57"; // Cor da borda (pode mudar)
                ctx.stroke();


            }
            desenharRoleta();

            /*Giro da roleta*/
            return function girar() {
                return new Promise(resolve => {
                    let resolvido = false;

                    if (girando) return;
                    girando = true;
                    forcarResultado = false;
                    resultado = null;

                    if (animationFrameId !== null) {
                        cancelAnimationFrame(animationFrameId);
                        animationFrameId = null;
                    }

                    const DURACAO = duracao;
                    const inicio = performance.now();
                    const velocidadeInicial = Math.random() * 0.15 + 0.5;

                    globalThis.anguloPrevisto = (() => {
                        let fator = 0;
                        let angulo = 0;
                        for (let t = 0; t <= DURACAO; t += 16) {
                            fator = (DURACAO - t) / DURACAO;
                            if (fator < 0) fator = 0;
                            angulo += velocidadeInicial * fator * fator;
                        }
                        return angulo % (2 * Math.PI);
                    })();

                    /*Animador*/
                    function animar(now) {
                        const tempoDecorrido = now - inicio;
                        let fator = (DURACAO - tempoDecorrido) / DURACAO;
                        if (fator < 0) fator = 0;
                        let velocidade = velocidadeInicial * fator * fator;

                        anguloAtual += velocidade;
                        anguloAtual %= 2 * Math.PI;
                        desenharRoleta();

                        if (tempoDecorrido < DURACAO && !forcarResultado) {
                            animationFrameId = requestAnimationFrame(animar);
                        } else {
                            girando = false;
                            cancelAnimationFrame(animationFrameId);
                            const anguloFinal = forcarResultado ? anguloPrevisto : anguloAtual;
                            const anguloPorSegmento = 2 * Math.PI / items.length;
                            const indice = Math.floor(((3 * Math.PI / 2 - anguloFinal + 2 * Math.PI) % (2 * Math.PI)) / anguloPorSegmento);
                            resultado = items[indice];

                            if (!resolvido) {
                                resolvido = true;
                                resolve(resultado);
                            }
                        }
                    }

                    animationFrameId = requestAnimationFrame(animar);
                });
            };
        }

        /*Chama o criarRoleta()*/
        let girarRoleta;
        const raio = isPortrait ? 300 : 500;// Raio (seForRetrato : seForPaisagem)
        girarRoleta = criarRoleta("roleta", {
            width: raio,
            height: raio,
            items: premios, // Prêmios
            colors: ["#0f0f0f", "#ffeaa7"], // Cores
            buttonLabel: "Tentar a sorte", // Texto do botão
            zIndex: 1000 // Z-Index
        }, 20000); // Duração

        /*Funcionamento do botão*/
        const botao = document.querySelector("#roleta button");
        botao.addEventListener("click", async () => {
            ativarAposta(0);
            const resultado = await girarRoleta();
            const evento = new CustomEvent("roleta-finalizada", { detail: resultado });
            document.dispatchEvent(evento);
        });

        /*Premiação*/
        if (!globalThis.listenerRegistradoRoleta) {
            document.addEventListener("roleta-finalizada", (e) => {
                ativarAposta(1);
                const resultado = e.detail;
                alert(`Você ${resultado.startsWith("-") ? "perdeu" : "ganhou"} ${resultado.replace("%", "")}% da sua aposta!`);
                totalAposta += parseFloat(resultado.replace("%", "")) / 100 * totalAposta;
                atualizarSaldo();
            });
            globalThis.listenerRegistradoRoleta = true;
        }
        globalThis.roletaCancelada = false;

    } else if (f === -1) {
        /*Limpeza*/
        ativarAposta(1);
        document.getElementById("roleta").innerHTML = ``;

        /*Premiar em caso de saída antes do fim do giro*/
        setTimeout(() => {
            if (!resultado && anguloPrevisto !== null) {
                const premios = ["-10%", "+10%", "-20%", "+20%", "-35%", "+35%", "-50%", "+50%", "-100%", "+100%"];
                const anguloPorSegmento = 2 * Math.PI / premios.length;
                const indice = Math.floor(((3 * Math.PI / 2 - anguloPrevisto + 2 * Math.PI) % (2 * Math.PI)) / anguloPorSegmento);
                resultado = premios[indice];

                const evento = new CustomEvent("roleta-finalizada", { detail: resultado });
                document.dispatchEvent(evento);
            }
            if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId);
                delete globalThis.animationFrameId;
                delete globalThis.girando;
                delete globalThis.anguloPrevisto;
            }
        }, 0);
    }
}

function foguete(f=0){
    if (f==-1) {
        /*Limpezas*/
        if (fogueteAtivo){pararFoguete()}
        delete globalThis.fogueteAtivo;
        delete globalThis.intervalFoguete;
        delete globalThis.multiplicadorAtual;
        delete globalThis.ouvintesAdicionados;
        document.getElementById(`foguete`).style.display = "none";
        return;
    }

    /*Inicialização*/
    telaAtual = 3;
    ocultarGrid();
    document.getElementById("financeiroJogos").style.display = "block";
    document.getElementById("foguete").style.display = "block";

    /*Constantes*/
    const chanceCrash = 10; // Chance de crash por iteração
    const razaoAumento = 1; // Razão de aumento do multiplicador por iteração (em décimos)
    const delay = 1000; // Tempo de espera entre aumentos
    const multiplicadorInicial = 5; // Multiplicador inicial do foguete (em décimos)

    /*Declaração de variáveis*/
    globalThis.fogueteAtivo = false;
    globalThis.intervalFoguete = null;
    globalThis.multiplicadorAtual = 0;
    globalThis.ouvintesAdicionados = false;

    function iniciarFoguete() {
        if (fogueteAtivo) return;

        /*Resets*/
        fogueteAtivo = true;
        ativarAposta(0);
        multiplicadorAtual = multiplicadorInicial;
        document.getElementById("multiplicadorDisplay").textContent = `${(multiplicadorAtual/10).toFixed(2)}x`;
        document.getElementById("statusFoguete").textContent = "Foguete decolando...";
        document.getElementById("btDecolar").disabled = true;
        document.getElementById("btParar").disabled = false;

        /*Declaração de imagens*/
        const chao = document.getElementById('chaoIMG');
        const linha = document.getElementById("linhaIMG");
        const foguete = document.getElementById("fogueteIMG");

        /*Resets do display de animação*/
        foguete.src = "src/foguete/foguete.png";
        let deslocamento = 0;
        let passos = 0;
        chao.style.transform = `translate(-50%, -50%)`;
        chao.style.opacity = 1;
        linha.style.top = "-100px";
        linha.style.opacity = 0;

        /*Move o chaoIMG para baixo*/
        function moverParaBaixo() {
            passos++;
            deslocamento += 50;
            chao.style.transform = `translate(-50%, calc(-50% + ${deslocamento}px))`;
            let novaOpacity = Math.max(0, 1 - passos / 3);
            chao.style.opacity = novaOpacity;
        }

        /*Loop de aumento*/
        intervalFoguete = setInterval(() => {
            /*Crash*/
            if (Math.random() * 100 < chanceCrash) {
                clearInterval(intervalFoguete);

                foguete.src = "src/foguete/explosao.png";
                fogueteAtivo = false;

                document.getElementById("btDecolar").disabled = false;
                document.getElementById("btParar").disabled = true;
                document.getElementById("statusFoguete").textContent = "O foguete explodiu!";

                setTimeout(() => {alert(`O foguete crashou! Você perdeu R$ ${totalAposta.toFixed(2)}.`)}, 500);
                totalAposta = 0.00;
                atualizarSaldo();
                ativarAposta(1);

            /*Aumento*/
            } else {
                multiplicadorAtual += razaoAumento;
                document.getElementById("multiplicadorDisplay").textContent = `${(multiplicadorAtual/10).toFixed(2)}x`;

                /*Display de animação*/
                foguete.src = "src/foguete/fogueteVoando.png";
                moverParaBaixo();
                if (parseInt(multiplicadorAtual) == (10-razaoAumento)){ // Antes do foguete
                    linha.style.opacity = 1;
                    linha.style.top = "calc(50% - 120px)";
                } else if (parseInt(multiplicadorAtual) == 10) { // No meio do foguete
                    linha.style.top = "calc(50% - 80px)";
                } else if (parseInt(multiplicadorAtual) == 10+razaoAumento) { // Depois do foguete
                    linha.style.top = "calc(50% - 40px)";
                } else if (parseInt(multiplicadorAtual) > 10 + razaoAumento) { // Despenca para baixo
                    linha.style.top = "calc(50% + 100px)";
                    linha.style.opacity = 0;
                }
            }
        }, delay);
    }

    function pararFoguete() {
        clearInterval(intervalFoguete);
        fogueteAtivo = false;
        
        /*Alterações do display de animação*/
        document.getElementById("fogueteIMG").src = "src/foguete/foguete.png";
        document.getElementById("chaoIMG").style.transform = `translate(-50%, -50%)`;
        document.getElementById("chaoIMG").style.opacity = 1;
        document.getElementById("linhaIMG").style.top = "-100px";
        document.getElementById("linhaIMG").style.opacity = 0;

        /*Alterações do display do menu*/
        document.getElementById("statusFoguete").textContent = "Você parou o foguete!";
        document.getElementById("btDecolar").disabled = false;
        document.getElementById("btParar").disabled = true;

        fogueteAtivo = false;
        multiplicadorAtual /= 10;

        /*Financeiro*/
        const lucro = totalAposta * (multiplicadorAtual - 1);
        totalAposta *= multiplicadorAtual;
        setTimeout(() => {
            if (multiplicadorAtual.toFixed(2)>1) alert(`Você ganhou R$ ${lucro.toFixed(2)} com ${multiplicadorAtual.toFixed(2)}x!`);
            else if (multiplicadorAtual.toFixed(2)==1) alert(`Você não ganhou nem perdeu nada com ${multiplicadorAtual.toFixed(2)}x!`);
            else alert(`Você perdeu R$ ${Math.abs(lucro).toFixed(2)} com ${multiplicadorAtual.toFixed(2)}x!`);
        }, 500);
        atualizarSaldo();
        ativarAposta(1);
    }


    /*Cliques dos botões*/
    if (!ouvintesAdicionados) {
        document.getElementById("btDecolar").addEventListener("click", iniciarFoguete);
        document.getElementById("btParar").addEventListener("click", function () {
            if (!fogueteAtivo) return;
            pararFoguete();
        });
        ouvintesAdicionados = true;
    }

    /*Reset visual*/
    document.getElementById("multiplicadorDisplay").textContent = `0.00x`;
    document.getElementById("statusFoguete").textContent = `Faça sua aposta e clique em "Decolar"!`;
    document.getElementById("btDecolar").disabled = false;
    document.getElementById("btParar").disabled = true;
}

function jogoDoBicho(f=0){
    if (f==(-1)){
        /*Limpeza*/
        document.getElementById(`bicho`).style.display = "none";
        return;
    }
    
    /*Inicialização*/
    const num = localStorage.getItem("numApostaBicho");
    const valor = localStorage.getItem("valorApostaBicho");
    telaAtual = 4;
    ocultarGrid();
    document.getElementById("financeiroJogos").style.display = "block";
    document.getElementById("bicho").style.display = "block";

    /*Zera localStorage em caso de indefinição*/
    if (num === null || num === "undefined" || isNaN(parseInt(num)) || valor === null || valor === "undefined" || isNaN(parseFloat(valor))) {
        localStorage.setItem("numApostaBicho", -1);
        localStorage.setItem("valorApostaBicho", 0);
    }

    /*Constantes*/
    const animais = ["Avestruz", "Águia", "Burro", "Borboleta", "Cachorro", "Cabra", "Carneiro", "Camelo", "Cobra", "Coelho", "Cavalo", "Elefante", "Galo", "Gato", "Jacaré", "Leão", "Macaco", "Porco", "Pavão", "Peru", "Touro", "Tigre", "Urso", "Veado", "Vaca"]; // Lista de animais do jogo do bicho
    const valores = { // Multiplicadores para cada tipo de acerto
        animal: 10,
        número: 100,
    }
    const horarios = [4, 10, 16, 22]; // Horários de sorteio

    /*Definição de horas*/
    let agora = new Date();
    let hora = agora.getHours();
    let sorteio = parseInt(localStorage.getItem("sorteio"));
    let horaSorteio = parseInt(localStorage.getItem("horaSorteio"));
    

    /*Sorteador*/
    function sortear(tempHoraSorteio){
        horaSorteio = tempHoraSorteio;
        sorteio = random(0, 100);
        localStorage.setItem("horaSorteio", horaSorteio);
        localStorage.setItem("dataSorteio", (new Date()).setHours(0,0,0,0));
        localStorage.setItem("sorteio", sorteio);
    }

    /*Garantia de que exista um sorteio*/
    let diferencaAtual = [];
    for (let i = 0; i<horarios.length; i++) {diferencaAtual.push(hora-horarios[i])};
    for (let i = 0; i < diferencaAtual.length; i++) {if (diferencaAtual[i] < 0) diferencaAtual[i] += 48};
    const menorDiferencaAtual = Math.min(...diferencaAtual);
    if (localStorage.getItem("horaSorteio") === null) {sortear(horarios[diferencaAtual.indexOf(menorDiferencaAtual)])}

    /*Atualização do sorteio caso já tenha passado do horário*/
    let diferenca = [];
    for (let i = 0; i<horarios.length; i++) {diferenca.push(horaSorteio-horarios[i])};
    for (let i = 0; i < diferenca.length; i++) {if (diferenca[i] < 0) diferenca[i] += 48}
    const menorDiferenca = Math.min(...diferenca);
    if (diferenca.indexOf(menorDiferenca) != diferencaAtual.indexOf(menorDiferencaAtual)) {sortear(horarios[diferencaAtual.indexOf(menorDiferencaAtual)])}

    /*Definição do animal*/
    if (sorteio==0) sorteio = 100;
    let animalNum = parseInt((sorteio-1)/4);
    let animal = animais[animalNum];
    if (sorteio==100) sorteio = 0;

    
    
    /*Exibição na tela*/
    document.getElementById("ultimoSorteio").textContent = `Número: ${String(sorteio).padStart(2, '0')} (${animal})`;
    document.getElementById("horaUltimoSorteio").textContent = `Horário do sorteio: ${String(horaSorteio).padStart(2, '0')}:00`;

    /* Atualização da aposta feita*/
    function atualizarAposta() { 
        if ((localStorage.getItem("numApostaBicho") == (-1))||(isNaN(parseInt(localStorage.getItem("numApostaBicho"))))) {
            document.getElementById("apostaFeita").textContent = `Aposta feita: Nenhuma`;
            document.getElementById("valorApostaFeita").textContent = `Valor apostado: R$ ${(0).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`;
        } else {
            document.getElementById("apostaFeita").textContent = `Aposta feita: ${String(localStorage.getItem("numApostaBicho")).padStart(2, '0')}`;
            document.getElementById("valorApostaFeita").textContent = `Valor apostado: R$ ${parseFloat(localStorage.getItem("valorApostaBicho")).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`;
        }
    }
    atualizarAposta();

    /*Formatação do input*/
    document.getElementById("numApostaBicho").addEventListener("input", function(e) {
        let input = e.target;
        let valor = input.value.replace(/\D/g, "");
        if (valor.length > 2) valor = valor.slice(0, 2);
        input.value = `${valor}`;
    });
    
    /*Clique ou Enter em apostar*/
    function apostarBicho(){
        alert("Aposta feita!");
        localStorage.setItem("numApostaBicho", document.getElementById("numApostaBicho").value);
        localStorage.setItem("valorApostaBicho", totalAposta);
        localStorage.setItem("horarioApostaBicho", horaSorteio);
        localStorage.setItem("dataApostaBicho", (new Date()).setHours(0,0,0,0));
        totalAposta = 0.00;
        atualizarSaldo();
        atualizarAposta();
    }
    if (!globalThis.listenerRegistradoBicho) {
        document.getElementById("apostarBicho").addEventListener("click", function() {apostarBicho()});
        globalThis.listenerRegistradoBicho = true;
    }
    if (!globalThis.listenerRegistradoBichoEnter) {
        document.getElementById("numApostaBicho").addEventListener("keydown", function(e) {if (e.key === "Enter") {apostarBicho()}});
        globalThis.listenerRegistradoBichoEnter = true;
    }

    /*Premiação e pagamento*/
    if (((parseInt(localStorage.getItem("numApostaBicho"))) != (-1)) && ((localStorage.getItem("numApostaBicho")) != (0)) && ((localStorage.getItem("horarioApostaBicho") != horaSorteio)||(localStorage.getItem("dataApostaBicho") < localStorage.getItem("dataSorteio")))) {
        let numApostaBicho = parseInt(localStorage.getItem("numApostaBicho"));
        let valorApostaBicho = parseFloat(localStorage.getItem("valorApostaBicho"));
        if (numApostaBicho == sorteio) {
            alert(`Parabéns! Você acertou o número ${sorteio} e ganhou R$ ${(valores.número * valorApostaBicho).toFixed(2)}!`);
            saldo += valores.número * valorApostaBicho;
            atualizarSaldo();
        } else if ((parseInt((numApostaBicho-1)/4) == animalNum)) {
            alert(`Parabéns! Você acertou o animal ${animal} e ganhou R$ ${(valores.animal * valorApostaBicho).toFixed(2)}!`);
            saldo += valores.animal * valorApostaBicho;
            atualizarSaldo();
        } else {
            alert(`Você apostou no número ${numApostaBicho}, mas o sorteio foi ${sorteio} (${animal}). Tente novamente!`);
        }
        localStorage.setItem("numApostaBicho", -1);
        localStorage.removeItem("horarioApostaBicho");
        localStorage.setItem("valorApostaBicho", 0);
        atualizarAposta();
    }
}

function miner(f=0){
    if (f==(-3)){
        /*Premiação*/
        if (typeof(minerVars) !== `undefined`) {
            if (minerVars.explodido == false){alert(`Parabéns! Você saiu com R$${(totalAposta * minerVars.multiplicadorAtual).toFixed(2)}, um lucro de R$${(totalAposta * (minerVars.multiplicadorAtual - 1)).toFixed(2)}!`)}
            totalAposta *= minerVars.multiplicadorAtual;
        }
        /*Reset dos elementos*/
        atualizarSaldo();
        document.getElementById(`gridMiner`).innerHTML = ``;
        delete globalThis.minerVars;
        document.getElementById("btMiner0").textContent = "Começar";
        document.getElementById("financeiroJogos").style.display = "block";
        document.getElementById("miner").style.display = "block";
        document.getElementById("btMiner0").onclick = () => miner(0);
        ativarAposta(1);
        document.getElementById("txtMenuMiner").textContent = `Multiplicador: 1x`;
    }
    else if (f==(-2)){
        /*Inicialização*/
        telaAtual = 5;
        ocultarGrid();
        miner(-3)
    }
    else if (f==(-1)){
        /*Premiação*/
        if (typeof(minerVars) !== `undefined`) {
            if (minerVars.explodido == false){alert(`Parabéns! Você saiu com R$${(totalAposta * minerVars.multiplicadorAtual).toFixed(2)}, um lucro de R$${(totalAposta * (minerVars.multiplicadorAtual - 1)).toFixed(2)}!`)}
            totalAposta *= minerVars.multiplicadorAtual;
        }

        /*Limpeza dos elementos*/
        atualizarSaldo();
        document.getElementById(`gridMiner`).innerHTML = ``;
        delete globalThis.minerVars;
        document.getElementById("btMiner0").textContent = "Começar";
        document.getElementById("miner").style.display = "none";
        document.getElementById("btMiner0").onclick = () => miner(0);
        ativarAposta(1);
        document.getElementById("txtMenuMiner").textContent = `Multiplicador: 1x`;
    }
    else if (f==0) {
        /*Alterações de design*/
        ativarAposta(0);
        document.getElementById("btMiner0").textContent = `Parar`;
        document.getElementById("btMiner0").onclick = () => miner(-3);
        document.getElementById("txtMenuMiner").textContent = `Multiplicador: 1x`;

        /*Constantes*/
        const lado = 5; // Lado do grid (5x5)
        const qtdeBombas = 5; // Quantidade de bombas
        const multiplicador = 1.5; // Multiplicador por diamante
        
        /*Sorteio das bombas*/
        globalThis.minerVars = {
            qtde: lado * lado,
            diamantes: 0,
            jogando: false,
            explodido: false,
            multiplicador: multiplicador,
            multiplicadorAtual: 1
        }
        minerVars.bombas = random(1, minerVars.qtde, qtdeBombas, false);

        /*Geração do grid*/
        const container = document.getElementById("gridMiner");
        container.style.gridTemplateColumns = `repeat(${lado}, 1fr)`;
        for (let i = 1; i <= minerVars.qtde; i++) {
            const bt = document.createElement("button");
            bt.id = `btMiner${i}`;
            bt.onclick = () => miner(i);
            bt.disabled = false;
            container.appendChild(bt);
        }

    } else {
        const imgBtMiner = document.createElement("img");
        minerVars.jogando = true;

        /*Clique em diamante*/
        if (!minerVars.bombas.includes(f)){
            imgBtMiner.src = `src/miner/diamond.png`;
            minerVars.diamantes++;
            minerVars.multiplicadorAtual = (minerVars.multiplicadorAtual *= minerVars.multiplicador).toFixed(2);
            document.getElementById("txtMenuMiner").textContent = `Multiplicador: ${minerVars.multiplicadorAtual}x`;
        } 
        /*Clique em bomba*/
        else{
            imgBtMiner.src = `src/miner/bomb.png`;
            totalAposta = 0;
            atualizarSaldo();
            minerVars.multiplicadorAtual = 1;
            document.getElementById("txtMenuMiner").textContent = `Multiplicador: 0x`;
            for (let i = 1; i<=minerVars.qtde; i++){
                if ((document.getElementById(`btMiner${i}`).disabled == false)&&(i!=f)){
                    const imgBtMiner = document.createElement("img");
                    if (!minerVars.bombas.includes(i)){imgBtMiner.src = `src/miner/diamond.png`} 
                    else{imgBtMiner.src = `src/miner/bomb.png`}
                    document.getElementById(`btMiner${i}`).appendChild(imgBtMiner);
                    document.getElementById(`btMiner${i}`).disabled = true;
                }
            }
            minerVars.explodido = true;
            document.getElementById("btMiner0").textContent = `Reiniciar`;
            setTimeout(function() {alert("Você acertou uma bomba e perdeu!")}, 100);
        }
        document.getElementById(`btMiner${f}`).appendChild(imgBtMiner);
        document.getElementById(`btMiner${f}`).disabled = true;
    }
}