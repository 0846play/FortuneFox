var telaAtual = 0
const dicionarioTelas = {
    0: `telaLogin`,
    1: `telaHome`,
    2: `roleta`,
    3: `foguete`,
    4: `jogoDoBicho`
}
var saldo = localStorage.getItem("saldo") ? parseFloat(localStorage.getItem("saldo")) : 1000.00; // Saldo inicial ou recuperado do localStorage
var totalAposta = localStorage.getItem("totalAposta") ? parseFloat(localStorage.getItem("totalAposta")) : 0.00; // Valor apostado inicial ou recuperado do localStorage

document.getElementById("valorAposta").addEventListener("input", function(e) {// Faz o input da aposta ficar bonito
    let input = e.target;

    // Remove tudo que não for número
    let valor = input.value.replace(/\D/g, "");

    // Converte para número e divide por 100 para manter 2 casas decimais
    valor = (parseInt(valor, 10) / 100).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    // Adiciona símbolo $ manualmente
    input.value = `$ ${valor}`;
});

function random(min, max) {return (Math.floor(Math.random() * (max - min + 1)) + min)}



function logar() {
    const user = document.getElementById(`user`).value;
    const senha = document.getElementById(`senha`).value
    if(user && senha){
        document.getElementById(`nomeUsuario`).textContent = user
        document.getElementById(`telaLogin`).classList.remove(`ativa`);
        document.getElementById(`telaHome`).classList.add(`ativa`);
        telaAtual = 1;
    }else{alert("Usuário ou senha inválidos!")}
}


function voltar() { // Antigo sair(), agora universal para voltar de qualquer tela (se configurado)
    if (telaAtual==1) { //telaHome
        document.getElementById(`telaHome`).classList.remove(`ativa`);
        document.getElementById(`telaLogin`).classList.add(`ativa`);

        document.getElementById(`user`).value = ``;
        document.getElementById(`senha`).value = ``;
        telaAtual = 0;
    }
    else {
        document.getElementById(`financeiroJogos`).style.display = "none"; //Tira o menu de apostas
        if (telaAtual==2) { //roleta
            document.getElementById(`roleta`).innerHTML = ``;
        }
        else if (telaAtual==3) {
            document.getElementById(`foguete`).style.display = "none";
        }
        else if (telaAtual==4) { //jogo do bicho
            document.getElementById(`bicho`).style.display = "none";
        }
        mostrarGrid();
        telaAtual = 1;
    }
}

function ocultarGrid() {
    document.getElementById(`fundoGrid`).style.display = `none`;
    const grids = document.getElementsByClassName(`grid-2x2`);
    for (let grid of grids) {
        grid.style.display = `none`;
    }
}
function mostrarGrid() {
    document.getElementById(`fundoGrid`).style.display = `flex`;
    const grids = document.getElementsByClassName(`grid-2x2`);
    for (let grid of grids) {
        grid.style.display = `grid`;
    }
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
    localStorage.setItem("saldo", saldo); // Salva o saldo atualizado no localStorage
    localStorage.setItem("totalAposta", totalAposta); // Salva o total apostado atualizado no localStorage
}
atualizarSaldo();

function apostar(funcao) { // funcao=0 para transferir o saldo para a aposta, funcao=1 para transferir a aposta para o saldo
    const valorAposta = document.getElementById("valorAposta").value;
    const valorNumerico = parseFloat(valorAposta.replace(/[^0-9,-]+/g, "").replace(",", "."));
    
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
        alert("Por favor, insira um valor válido para a aposta.");
        return;
    }
    
    if ((valorNumerico > saldo)&& (funcao==0)) {
        alert("Saldo insuficiente para realizar esta aposta.");
        return;
    }
    if ((valorNumerico > totalAposta)&& (funcao==1)) {
        alert("Valor apostado insuficiente para retirar esta quantia.");
        return;
    }
    if (funcao==0) {
        saldo -= valorNumerico;
        totalAposta += valorNumerico;
    } 
    else if (funcao==1) {
        saldo += valorNumerico;
        totalAposta -= valorNumerico;
    }
    atualizarSaldo();
    document.getElementById("valorAposta").value = `$ 0,00`; // Reseta o campo de aposta
    alert(`Aposta de R$ ${valorNumerico.toFixed(2)} realizada com sucesso!`);
}





async function roleta(){
    telaAtual = 2;
    ocultarGrid();
    document.getElementById("financeiroJogos").style.display = "block";
    let premios = ["-10%", "+10%", "-20%", "+20%", "-35%", "+35%", "-50%", "+50%", "-100%", "+100%"] // Itens da roleta


    function criarRoleta(containerId, opcoes = {}, duracao) {

        const {width, height, items, colors, buttonLabel, zIndex} = opcoes;
        const container = document.getElementById(containerId);
        if (!container) return console.error("Contêiner da roleta não encontrado:", containerId);

        // Criação do HTML isolado
        container.innerHTML = `
            <div style="text-align: center; font-family: sans-serif; z-index: ${zIndex}; position: relative;">
            <canvas width="${width}px" height="${height}px" style="margin-bottom: 10px;"></canvas><br/>
            <button class="botao-roleta">${buttonLabel}</button>
            </div>
        `;

        const canvas = container.querySelector("canvas");
        const button = container.querySelector("button");
        const ctx = canvas.getContext("2d");
        const raio = width / 2;
        let anguloAtual = 0;
        let girando = false;

        function desenharRoleta() {
            const anguloPorSegmento = 2 * Math.PI / items.length;
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < items.length; i++) {
                const anguloInicio = anguloAtual + i * anguloPorSegmento;
                const anguloFim = anguloInicio + anguloPorSegmento;

                ctx.beginPath();
                ctx.moveTo(raio, raio);
                ctx.arc(raio, raio, raio, anguloInicio, anguloFim);
                ctx.fillStyle = colors[i % colors.length];
                ctx.fill();

                // Texto
                ctx.save();
                ctx.translate(raio, raio);
                ctx.rotate(anguloInicio + anguloPorSegmento / 2);
                ctx.textAlign = "right";
                ctx.fillStyle = colors[i % colors.length *(-1) +1];
                ctx.font = "bold 40px sans-serif";
                ctx.fillText(items[i], raio - 50, 10);
                ctx.restore();
            }

            // Indicador
            ctx.fillStyle = "#000";
            ctx.beginPath();
            ctx.moveTo(raio, 10);
            ctx.lineTo(raio - 10, 30);
            ctx.lineTo(raio + 10, 30);
            ctx.closePath();
            ctx.fill();
        }
        desenharRoleta();
        

        return function girar() {
            return new Promise(resolve => {
                if (girando) return;
                girando = true;

                const DURACAO = duracao;
                const inicio = performance.now();
                const velocidadeInicial = Math.random() * 0.15 + 0.5;

                function animar(now) {
                    const tempoDecorrido = now - inicio;
                    const tempoRestante = DURACAO - tempoDecorrido;

                    // Calcula a velocidade proporcional ao tempo restante (quadrática)
                    let fator = tempoRestante / DURACAO;
                    if (fator < 0) fator = 0;
                    let velocidade = velocidadeInicial * fator * fator;


                    anguloAtual += velocidade;
                    anguloAtual %= 2 * Math.PI;
                    desenharRoleta();

                    if (tempoDecorrido < DURACAO) requestAnimationFrame(animar);
                    else {
                        girando = false;
                        const anguloPorSegmento = 2 * Math.PI / items.length;
                        const indice = Math.floor(((3 * Math.PI / 2 - anguloAtual + 2 * Math.PI) % (2 * Math.PI)) / anguloPorSegmento);
                        const resultado = items[indice];
                        resolve(resultado);
                    }
                }
                requestAnimationFrame(animar);
            })
        }
    }

    /*Fazer alterações na configuração da roleta abaixo*/
    let girarRoleta = criarRoleta("roleta", {
        width: diametro = 500, // Diâmetro da roleta
        height: diametro,
        items: premios, // Itens da roleta
        colors: ["#0f0f0f", "#ffeaa7"], // Cores dos segmentos
        buttonLabel: "Tentar a sorte", // Texto do botão
        zIndex: 1000 // Controle de sobreposição
    }, 20000); // Duração do giro em milissegundos



    const botao = document.querySelector("#roleta button");
    botao.addEventListener("click", async () => {
        const resultado = await girarRoleta();
        
        const evento = new CustomEvent("roleta-finalizada", {detail: resultado});
        document.dispatchEvent(evento);
    });

    document.addEventListener("roleta-finalizada", (e) => {
        const resultado = e.detail;
        alert(`Você ${resultado.startsWith("-") ? "perdeu" : "ganhou"} ${resultado.replace("%", "")}% da sua aposta!`);
        totalAposta += parseFloat(resultado.replace("%", "")) / 100 * totalAposta;
        atualizarSaldo();
    });
}

function foguete(){
    /*Inicialização*/
    telaAtual = 3;
    ocultarGrid();
    document.getElementById("financeiroJogos").style.display = "block";
    document.getElementById("foguete").style.display = "block";

    /*Constantes*/
    const chanceCrash = 10; // Chance de crash por iteração
    const razaoAumento = 0.1; // Razão de aumento do multiplicador por iteração
    const multiplicadorInicial = 0.5; // Multiplicador inicial do foguete

    /*Declaração de variáveis*/
    let foguetinhoAtivo = false;
    let multiplicadorAtual = 0.00;
    let intervalFoguetinho = null;
    let ouvintesAdicionados = false;

    function iniciarFoguetinho() {
        if (foguetinhoAtivo) return; // Se já estiver ativo, não faz nada
        foguetinhoAtivo = true;
        multiplicadorAtual = multiplicadorInicial; // Reseta o multiplicador
        document.getElementById("multiplicadorDisplay").textContent = `${multiplicadorAtual.toFixed(2)}x`;
        document.getElementById("statusFoguetinho").textContent = "Foguetinho decolando...";
        document.getElementById("btDecolar").disabled = true; // Desabilita o botão de decolar
        document.getElementById("btParar").disabled = false; // Habilita o botão de parar

            intervalFoguetinho = setInterval(() => {
            if (Math.random() * 100 < chanceCrash) {
                clearInterval(intervalFoguetinho); // Para o foguete
                foguetinhoAtivo = false;

                document.getElementById("btDecolar").disabled = false;
                document.getElementById("btParar").disabled = true;
                document.getElementById("statusFoguetinho").textContent = "O foguete explodiu!";

                alert(`O foguete crashou! Você perdeu R$ ${totalAposta.toFixed(2)}.`);
                totalAposta = 0.00;
                atualizarSaldo();
            } else {
                multiplicadorAtual += razaoAumento;
                document.getElementById("multiplicadorDisplay").textContent = `${multiplicadorAtual.toFixed(2)}x`;
            }
        }, 1000);
    }

    function pararFoguetinho() {
        clearInterval(intervalFoguetinho);
        foguetinhoAtivo = false;
        document.getElementById("statusFoguetinho").textContent = "Você parou o foguete!";
        document.getElementById("btDecolar").disabled = false; // Habilita o botão de decolar novamente
        document.getElementById("btParar").disabled = true; // Desabilita o botão de parar
        foguetinhoAtivo = false;
        const lucro = totalAposta * (multiplicadorAtual - 1);
        totalAposta *= multiplicadorAtual;
        if (multiplicadorAtual.toFixed(2)>1) alert(`Você ganhou R$ ${lucro.toFixed(2)} com ${multiplicadorAtual.toFixed(2)}x!`);
        else if (multiplicadorAtual.toFixed(2)==1) alert(`Você não ganhou nem perdeu nada com ${multiplicadorAtual.toFixed(2)}x!`);
        else alert(`Você perdeu R$ ${Math.abs(lucro).toFixed(2)} com ${multiplicadorAtual.toFixed(2)}x!`);
        atualizarSaldo();
    }


    /*Cliques dos botões*/
    if (!ouvintesAdicionados) {
        document.getElementById("btDecolar").addEventListener("click", iniciarFoguetinho);
        document.getElementById("btParar").addEventListener("click", function () {
            if (!foguetinhoAtivo) return;
            pararFoguetinho();
        });
        ouvintesAdicionados = true;
    }

    /*Reset visual*/
    document.getElementById("multiplicadorDisplay").textContent = `0.00x`;
    document.getElementById("statusFoguetinho").textContent = `Faça sua aposta e clique em "Decolar"!`;
    document.getElementById("btDecolar").disabled = false;
    document.getElementById("btParar").disabled = true;


}

function jogoDoBicho(){
    /*Inicialização*/
    localStorage.setItem("valorApostaBicho", 0);
    telaAtual = 4;
    ocultarGrid();
    document.getElementById("financeiroJogos").style.display = "block";
    document.getElementById("bicho").style.display = "block";
    document.getElementById("bichoMenu").style.display = "block";

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
    let sorteio = localStorage.getItem("sorteio");
    let horaSorteio = localStorage.getItem("horaSorteio");
    

    /*Sorteador*/
    function sortear(tempHoraSorteio){
        horaSorteio = tempHoraSorteio; // Atualiza o horário do sorteio
        sorteio = random(0, 100); // Sorteia um número aleatório entre 0 e 100
        localStorage.setItem("horaSorteio", horaSorteio); //Salva hora
        localStorage.setItem("sorteio", sorteio); //salva sorteio
    }

    /*Garantia de que exista um sorteio*/
    let diferencaAtual = []
    for (let i = 0; i<horarios.length; i++) {diferencaAtual.push(hora-horarios[i])}; // Diferença entre o horário atual e os horários de sorteio
    for (let i = 0; i < diferencaAtual.length; i++) {if (diferencaAtual[i] < 0) diferencaAtual[i] += 48}; // Descarta diferenças negativas
    const menorDiferencaAtual = Math.min(...diferencaAtual); // Menor diferença
    if (localStorage.getItem("horaSorteio") == `undefined`) {// Sorteia se não houver sorteio
        sortear(horarios[diferencaAtual.indexOf(menorDiferencaAtual)]); 
        console.log(`New h=${horaSorteio}; n=${sorteio}`); //Log da mudança
    }

    /*Atualização do sorteio caso já tenha passado do horário*/
    let diferenca = [];
    for (let i = 0; i<horarios.length; i++) {diferenca.push(horaSorteio-horarios[i])}; // Diferença entre o último sorteio e os horários de sorteio
    for (let i = 0; i < diferenca.length; i++) {if (diferenca[i] < 0) diferenca[i] += 48} // Descarta diferenças negativas
    const menorDiferenca = Math.min(...diferenca); // Menor diferença
    if (diferenca.indexOf(menorDiferenca) != diferencaAtual.indexOf(menorDiferencaAtual)) { // Sorteia novamente
        sortear(horarios[diferencaAtual.indexOf(menorDiferencaAtual)]);
        console.log(`Reload h=${horaSorteio}; n=${sorteio}`); // Log da mudança
    }

    /*Definição do animal*/
    if(sorteio==0) sorteio = 100
    let animalNum = parseInt((sorteio-1)/4)
    let animal = animais[animalNum];
    
    /*Exibição na tela*/
    document.getElementById("ultimoSorteio").textContent = `Número: ${sorteio} (${animal})`;
    document.getElementById("horaUltimoSorteio").textContent = `Horário do sorteio: ${horaSorteio}:00`;

    /*Formatação do input*/
    document.getElementById("numApostaBicho").addEventListener("input", function(e) {
    let input = e.target;
    let valor = input.value.replace(/\D/g, "");// Remove tudo que não for número
    if (valor.length > 2) valor = valor.slice(0, 2);// Obriga o número a ter no máximo 2 dígitos
    input.value = `${valor}`;//Atualiza
    });

    /* Atualização da aposta feita*/
    function atualizarAposta() { 
        if (localStorage.getItem("valorApostaBicho") == 0) document.getElementById("apostaFeita").textContent = `Aposta feita: Nenhuma`;
        else {
            document.getElementById("apostaFeita").textContent = `Aposta feita: ${localStorage.getItem("numAposta")}`;
            document.getElementById("valorApostaFeita").textContent = `Valor apostado: R$ ${parseFloat(localStorage.getItem("valorApostaBicho")).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`;
        }
    }
    atualizarAposta();
    
    /*Clique em apostar*/
    document.getElementById("apostarBicho").addEventListener("click", function() {
        alert("Aposta feita!");
        localStorage.setItem("numAposta", document.getElementById("numApostaBicho").value);
        localStorage.setItem("valorApostaBicho", totalAposta);
        localStorage.setItem("horarioApostaBicho", horaSorteio);
        totalAposta = 0.00;
        atualizarSaldo();
        atualizarAposta();
    });
    
    /*Premiação e pagamento*/
    if((!isNaN(localStorage.getItem("numAposta"))) && (localStorage.getItem("horarioApostaBicho") != horaSorteio)) {
        let numAposta = parseInt(localStorage.getItem("numAposta"));
        totalAposta = parseFloat(localStorage.getItem("valorApostaBicho"));
        if (numAposta == sorteio) {
            alert(`Parabéns! Você acertou o número ${sorteio} e ganhou R$ ${(valores.número * totalAposta).toFixed(2)}!`);
            saldo += valores.número * totalAposta;
            atualizarSaldo();
        } else if (numAposta >= animalNum*4 && numAposta <= animalNum*4+3) {
            alert(`Parabéns! Você acertou o animal ${animal} e ganhou R$ ${(valores.animal * totalAposta).toFixed(2)}!`);
            saldo += valores.animal * totalAposta;
            atualizarSaldo();
        } else {
            alert(`Você apostou no número ${numAposta}, mas o sorteio foi ${sorteio} (${animal}). Tente novamente!`);
        }
        localStorage.setItem("numAposta", `undefined`);
        localStorage.setItem("horarioApostaBicho", `undefined`);
        localStorage.setItem("valorApostaBicho", 0);
        atualizarAposta();
    }
}

function miner(e=0){
    alert("Jogo em desenvolvimento!")
}
