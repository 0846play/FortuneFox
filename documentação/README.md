0- Sumário:
    1- Sobre o projeto;
    2- Informações técnicas;
    3- Utilidade das funções;
    4- Faixa de operação de funções (f);
    5- Styles;





1- Sobre o projeto:

    a) Nome: FortuneFox;
    b) Descrição: Plataforma de jogos de azar que não envolve dinheiro real;
    c) Motivo de criação: Tédio, aprendizado e atividades acadêmicas;
    d) Colaboradores: 0846play, luisfreits;
    e) Proposta: Criar uma alternativa de jogos de azar, para que pessoas que gostam de jogar esses jogos não percam dinheiro real, e ainda tenham a emoção de correr riscos de perder;





2- Informações técnicas:
    
    a) Publicação: Página do GitHub pages: https://0846play.github.io/FortuneFox/
    b) Licença:
        Este projeto está licenciado sob a Licença Creative Commons Atribuição-NãoComercial-CompartilhaIgual 4.0 Internacional (CC BY-NC-SA 4.0).
        Você pode compartilhar, adaptar e reutilizar o conteúdo, desde que:
        - Dê os devidos créditos;
        - Não utilize para fins comerciais;
        - Compartilhe suas modificações sob a mesma licença.
        Mais informações no arquivo license desta mesma pasta, ou em: https://creativecommons.org/licenses/by-nc-sa/4.0/;

    c) Como executar localmente:

        i. Clone o repositório: git clone https://github.com/0846play/FortuneFox.git

        ii. Acesse a pasta: cd FortuneFox

        iii. Abra o arquivo index.html em um navegador moderno.

    d) Versão atual: Release 1.0;
    e) Linguagens utilizadas: HTML, JavaScript, CSS;
    f) Logs de atualizações:
        
        -ii. Beta 1.0: 
            -Criação;

        -i. Beta 1.1:
            -Adicionado protótipo do Jogo do Bicho
            -Protótipo de mudanças no Foguete;
            -Mudanças visuais:
                -Mudança do plano de fundo;
                -Mudança de cores em diversas áreas;
            -Troca da função do botãoSair:
                Antes: Saía para a tela de login;
                Depois: Volta para a tela anterior;

        i. Release 1.0: 
            -Adição do Miner;
            -Finalizado Jogo do Bicho, Roleta e Foguete;
            -Modo de tela retrato agora é suportado;
            -Diversas mudanças visuais;
            -Correções de bugs;
            -Otimizações;
            -Mudanças menores;





3- Utilidade das funções:
    
    a) valorApostaFormat():
        IIFE que adiciona eventListeners para a formatação do menu financeiroJogos: 
            Obrigando o input a mostrar só valores monetários; 
            Adicionando chaves de teclado para os botões;

    b) random(min, max, qtde = 1, repetir = true):
        Sorteia um número aleatório entre min e max (ambos inclusivos);
        (qtde > 1) sorteia (qtde) números, e retorna um array com eles; 
        (repetir = false) garante que, quando (qtde > 1), todos os números sorteados serão distintos. O oposto permite repetições;

    c) logar():
        Gerencia o clique do botaoLogin, avançando a tela caso os inputs tenham valores válidos;

    d) voltar():
        Gerencia o clique do botaoSair, voltando para a tela anterior à atual;

    e) ocultarGrid():
        Oculta o grid do menu de jogos (grid-2x2);

    f) mostrarGrid():
        Exibe o grid do menu de jogos (grid-2x2);

    g) atualizarSaldo():
        Recarrega os valores visuais de saldo e totalAposta em financeiroJogos;
        Salva esses valores no localStorage;

    h) apostar(f):
        (f): V. [4-a)]
        Gerencia o clique dos botões do financeiroJogos e faz as transferências de valores;

    i) ativarAposta(f):
        (f): V. [4-b)]
        Trava e destrava os botões do financeiroJogos;
        
    j) corrigirLayout():
        Evita bugs com o teclado em navegadores que o apresentam em dispositivos mobile;

    k) roleta(f):
        (f): V. [4-c)]
        Gerencia a tela da Roleta;

    l) foguete(f):
        (f): V. [4-d)]
        Gerencia a tela do Foguete;

    m) jogoDoBicho(f):
        (f): V. [4-e)]
        Gerencia a tela do Jogo do Bicho;

    n) miner(f):
        (f): V. [4-f)]
        Gerencia a tela do Miner;
        
    

    

4- Faixa de operação de funções (f):
    
    Obs: (f=(-1)), em funções que gerenciam telas e jogos, é por padrão a faixa de operação destinada à função voltar();

    a) apostar(f)
        f=0: Transferir o saldo para a aposta; 
        f=1: Transferir a aposta para o saldo; 
        f=2: Transferir tudo para o saldo;

    b) ativarAposta(f)
        f=0: Desativar; 
        f=1: Ativar;

    c) roleta(f=0)
        f=(-1): Voltar estando na tela da Roleta;
        f=0: Funcionamento padrão da Roleta;

    d) foguete(f=0)
        f=(-1): Voltar estando na tela do Foguete;
        f=0: Funcionamento padrão do Foguete;

    e) jogoDoBicho(f=0)
        f=(-2): Limpar variáveis do jogoDoBicho no localStorage (função para dev);
        f=(-1): Voltar estando na tela do Jogo do Bicho;
        f=0: Funcionamento padrão do Jogo do Bicho;

    f) miner(f=0)
        f=(-2): Iniciar a tela do Miner;
        f=(-1): Voltar estando na tela do Miner / Limpar o grid de botões (Alterna automaticamente);
        f=0: Inicialização e geração do grid;
        f=(else(Entrada)): Computa o clique de btMinerEntrada e age com base nele;





5- Styles:

    a) styleLandscape.css:
        Utilizado em caso de dispositivos no modo paisagem;

    b)stylePortrait.css:
        Utilizado em caso de dispositivos no modo retrato;