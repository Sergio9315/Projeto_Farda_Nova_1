document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // 1. LOGIN / SESSÃO
    // =====================================================

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const usuarioCampo = document.getElementById("loginUsuario");
            const senhaCampo = document.getElementById("loginSenha");
            const message = document.getElementById("loginMessage");

            // Usa diretamente o valor atual dos campos.
            const usuario = (usuarioCampo?.value || "").trim();
            const senha = senhaCampo?.value || "";

            if (!usuario || !senha) {
                message.textContent = "Informe o usuário e a senha.";
                message.style.color = "#a82424";
                return;
            }

            // Credenciais somente para demonstração acadêmica.
            if (usuario === "admin" && senha === "1234") {
                localStorage.setItem("fardaNovaLogado", "true");
                localStorage.setItem("fardaNovaUsuario", usuario);

                message.textContent =
                    "Login realizado com sucesso. Abrindo cadastro do colaborador...";
                message.style.color = "#315d24";

                // Acesso direto ao painel após o login.
                window.location.href = "dashboard.html";
            } else {
                message.textContent =
                    "Usuário ou senha inválidos. Use o acesso de demonstração informado na tela.";
                message.style.color = "#a82424";
            }
        });
    }


    // =====================================================
    // 1.1 FUNÇÕES DA PÁGINA INICIAL DO SISTEMA
    // =====================================================

    const featureButtons =
        document.querySelectorAll("[data-feature]");

    const featureResult =
        document.getElementById("featureResult");

    featureButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const feature = button.dataset.feature;

            featureButtons.forEach((item) => {
                item.classList.remove("active");
            });

            button.classList.add("active");

            if (!featureResult) {
                return;
            }

            if (feature === "estoque") {
                const kit =
                    localStorage.getItem("fardaNovaKitSelecionado");

                const status =
                    localStorage.getItem("fardaNovaStatusRequisicao");

                const lista =
                    JSON.parse(
                        localStorage.getItem("fardaNovaListaKits") || "[]"
                    );

                featureResult.innerHTML = `
                    <h3>01 — Controle de Estoque</h3>
                    <p>
                        Consulte os kits registrados e acompanhe a situação
                        da separação pelo Almoxarifado.
                    </p>

                    <div class="feature-data">
                        <p><strong>Kit principal:</strong>
                            ${kit || "Nenhum kit registrado"}
                        </p>
                        <p><strong>Status:</strong>
                            ${status || "Nenhuma requisição registrada"}
                        </p>
                        <p><strong>Kits na lista de aquisição:</strong>
                            ${lista.length}
                        </p>
                    </div>

                    <a class="btn btn-primary feature-link"
                       href="pages/alistamento.html">
                        Gerenciar Requisição
                    </a>
                `;
            }

            if (feature === "seguranca") {
                featureResult.innerHTML = `
                    <h3>02 — Segurança no Trabalho</h3>
                    <p>
                        Consulte as orientações básicas para utilização,
                        conservação e substituição dos equipamentos.
                    </p>

                    <ul class="feature-list">
                        <li>Utilizar o EPI indicado para cada atividade.</li>
                        <li>Manter os equipamentos limpos e conservados.</li>
                        <li>Não utilizar equipamento danificado.</li>
                        <li>Solicitar substituição quando necessário.</li>
                        <li>Seguir as normas internas da empresa.</li>
                    </ul>

                    <a class="btn btn-primary feature-link"
                       href="pages/servicos.html">
                        Abrir Portal do Colaborador
                    </a>
                `;
            }

            if (feature === "rh") {
                const colaborador =
                    JSON.parse(
                        localStorage.getItem("fardaNovaColaborador") || "null"
                    );

                const protocolo =
                    localStorage.getItem("fardaNovaNumeroRequisicao");

                featureResult.innerHTML = `
                    <h3>03 — Agilidade de RH</h3>
                    <p>
                        Centraliza o cadastro e o acompanhamento das
                        solicitações de fardamento.
                    </p>

                    <div class="feature-data">
                        <p><strong>Colaborador cadastrado:</strong>
                            ${colaborador?.nome || "Nenhum cadastro realizado"}
                        </p>
                        <p><strong>Protocolo:</strong>
                            ${protocolo || "Nenhuma requisição finalizada"}
                        </p>
                    </div>

                    <a class="btn btn-primary feature-link"
                       href="pages/cadastro.html">
                        Abrir Cadastro de Colaborador
                    </a>
                `;
            }
        });
    });

    // =====================================================
    // 2. PROTEÇÃO DAS PÁGINAS INTERNAS
    // =====================================================

    const caminho = window.location.pathname.toLowerCase();
    const paginaInterna =
        caminho.includes("/pages/") ||
        caminho.endsWith("/dashboard.html");

    if (
        paginaInterna &&
        localStorage.getItem("fardaNovaLogado") !== "true"
    ) {
        window.location.href = caminho.includes("/pages/")
            ? "../index.html"
            : "index.html";
        return;
    }

    // =====================================================
    // 3. LOGOUT
    // =====================================================

    const logoutButtons = [
        document.getElementById("logoutButton"),
        document.getElementById("logoutPortal")
    ].filter(Boolean);

    logoutButtons.forEach((button) => {
        button.addEventListener("click", () => {
            localStorage.removeItem("fardaNovaLogado");
            localStorage.removeItem("fardaNovaUsuario");

            // O botão de sair retorna para a tela de login.
            window.location.href = window.location.pathname.includes("/pages/")
                ? "../index.html"
                : "index.html";
        });
    });

    // =====================================================
    // 4. CADASTRO DO COLABORADOR
    // =====================================================

    const cadastroForm = document.getElementById("cadastroForm");

    if (cadastroForm) {
        const message = document.getElementById("formMessage");

        cadastroForm.addEventListener("submit", (event) => {
            event.preventDefault();

            if (!cadastroForm.checkValidity()) {
                cadastroForm.reportValidity();

                if (message) {
                    message.textContent =
                        "Preencha todos os campos obrigatórios.";
                    message.style.color = "#a82424";
                }

                return;
            }

            const dados = Object.fromEntries(
                new FormData(cadastroForm).entries()
            );

            localStorage.setItem(
                "fardaNovaColaborador",
                JSON.stringify(dados)
            );

            localStorage.setItem(
                "fardaNovaCadastroRealizado",
                "true"
            );

            // Inicia uma nova requisição.
            localStorage.removeItem("fardaNovaKitSelecionado");
            localStorage.removeItem("fardaNovaStatusRequisicao");
            localStorage.removeItem("fardaNovaNumeroRequisicao");

            if (message) {
                message.textContent =
                    "Cadastro realizado com sucesso. Redirecionando para a escolha do kit...";
                message.style.color = "#315d24";
            }

            setTimeout(() => {
                window.location.href = "alistamento.html";
            }, 900);
        });
    }

    // =====================================================
    // 5. REQUISIÇÃO DE KIT
    // =====================================================

    const optionCards =
        document.querySelectorAll("[data-option]");

    const optionResult =
        document.getElementById("optionResult");

    // Materiais disponíveis para cada kit, com quantidade individual.
    const materiaisPorKit = {
        "Kit Vigilância Patrimonial": [
            "Camisa social",
            "Calça tática",
            "Coturno",
            "Jaqueta de frio"
        ],
        "Kit Escolta Armada": [
            "Fardamento tático",
            "Colete balístico",
            "Cinto de guarnição",
            "Coturno"
        ],
        "Kit Administrativo": [
            "Camisa polo corporativa",
            "Calça social",
            "Crachá"
        ],
        "Kit Serviços Gerais": [
            "Uniforme de serviço",
            "Bota de segurança",
            "Luvas",
            "Óculos de proteção",
            "Protetor auricular",
            "Colete refletivo"
        ]
    };

    const materialsContainer =
        document.getElementById("kitMaterialsContainer");

    function obterMateriaisSalvos() {
        return JSON.parse(
            localStorage.getItem("fardaNovaMateriaisAquisicao") || "[]"
        );
    }

    function salvarMateriaisAquisicao() {
        if (!materialsContainer) return;

        const blocos = Array.from(
            materialsContainer.querySelectorAll(".kit-material-block")
        );

        const dados = blocos.map((bloco) => {
            const kit = bloco.dataset.kit;
            const quantidadeKit = Math.max(
                1,
                Number(bloco.querySelector(".material-kit-quantity")?.value || 1)
            );

            const materiais = Array.from(
                bloco.querySelectorAll(".material-quantity")
            ).map((input) => ({
                material: input.dataset.material,
                quantidade: Math.max(1, Number(input.value || 1))
            }));

            return { kit, quantidadeKit, materiais };
        });

        localStorage.setItem(
            "fardaNovaMateriaisAquisicao",
            JSON.stringify(dados)
        );

        return dados;
    }

    function renderizarMateriaisAquisicao() {
        if (!materialsContainer) return;

        const selecionados = Array.from(kitChecks || [])
            .filter((check) => check.checked)
            .map((check) => check.value);

        if (!selecionados.length && kitSelecionado) {
            selecionados.push(kitSelecionado);
        }

        if (!selecionados.length) {
            materialsContainer.innerHTML = `
                <div class="material-empty">
                    Selecione um dos kits acima para visualizar os materiais e informar as quantidades.
                </div>`;
            return;
        }

        const salvos = obterMateriaisSalvos();

        materialsContainer.innerHTML = selecionados.map((kit) => {
            const salvo = salvos.find((item) => item.kit === kit);
            const quantidadeKit = salvo?.quantidadeKit ||
                Number(document.querySelector(`.kit-quantity[data-kit="${CSS.escape(kit)}"]`)?.value || 1);

            return `
                <div class="kit-material-block" data-kit="${kit}">
                    <div class="kit-material-header">
                        <div>
                            <span class="material-tag">KIT</span>
                            <h3>${kit}</h3>
                        </div>
                        <label class="kit-total-label">
                            Quantidade de kits
                            <input type="number" class="material-kit-quantity" min="1" value="${quantidadeKit}" aria-label="Quantidade de ${kit}">
                        </label>
                    </div>
                    <p class="material-help">Informe individualmente a quantidade de cada material que deverá ser adquirido.</p>
                    <div class="material-rows">
                        ${(materiaisPorKit[kit] || []).map((material) => {
                            const salvoMaterial = salvo?.materiais?.find((item) => item.material === material);
                            const quantidade = salvoMaterial?.quantidade || 1;
                            return `
                                <label class="material-row">
                                    <span>${material}</span>
                                    <input type="number" class="material-quantity" data-material="${material}" min="1" value="${quantidade}" aria-label="Quantidade de ${material}">
                                </label>`;
                        }).join("")}
                    </div>
                </div>`;
        }).join("");

        materialsContainer.querySelectorAll("input").forEach((input) => {
            input.addEventListener("input", salvarMateriaisAquisicao);
            input.addEventListener("change", salvarMateriaisAquisicao);
        });

        salvarMateriaisAquisicao();
    }

    const finishRequest =
        document.getElementById("finishRequest");

    const requestMessage =
        document.getElementById("requestMessage");

    let kitSelecionado =
        localStorage.getItem("fardaNovaKitSelecionado");

    optionCards.forEach((card) => {
        if (card.dataset.option === kitSelecionado) {
            card.classList.add("selected");
        }

        card.addEventListener("click", () => {
            optionCards.forEach((item) => {
                item.classList.remove("selected");
            });

            card.classList.add("selected");

            kitSelecionado = card.dataset.option;

            const correspondingCheck = Array.from(
                document.querySelectorAll(".kit-check")
            ).find((check) => check.value === kitSelecionado);

            if (correspondingCheck) {
                correspondingCheck.checked = true;
            }

            localStorage.setItem(
                "fardaNovaKitSelecionado",
                kitSelecionado
            );

            localStorage.setItem(
                "fardaNovaStatusRequisicao",
                "Kit selecionado — aguardando finalização"
            );

            if (optionResult) {
                optionResult.innerHTML = `
                    <h3>Kit Selecionado: ${kitSelecionado}</h3>
                    <p>
                        A seleção foi registrada.
                        Confira abaixo os materiais e informe a quantidade de cada item.
                    </p>
                `;
            }

            atualizarListaAquisicao();
            renderizarMateriaisAquisicao();
        });
    });

    if (finishRequest) {
        finishRequest.addEventListener("click", () => {

            if (!kitSelecionado) {
                if (requestMessage) {
                    requestMessage.textContent =
                        "Selecione um kit antes de finalizar a requisição.";
                    requestMessage.style.color = "#a82424";
                }
                return;
            }

            const listaAquisicao = JSON.parse(
                localStorage.getItem("fardaNovaListaKits") || "[]"
            );

            const materiaisAquisicao = salvarMateriaisAquisicao() || [];

            if (listaAquisicao.length === 0) {
                if (requestMessage) {
                    requestMessage.textContent =
                        "Adicione pelo menos um kit à lista de aquisição antes de finalizar.";
                    requestMessage.style.color = "#a82424";
                }
                return;
            }

            const kitsSemMateriais = listaAquisicao.filter((item) => {
                const registro = materiaisAquisicao.find((material) => material.kit === item.kit);
                return !registro || !registro.materiais || registro.materiais.length === 0;
            });

            if (kitsSemMateriais.length > 0) {
                if (requestMessage) {
                    requestMessage.textContent =
                        "Informe os materiais e as quantidades de cada kit selecionado.";
                    requestMessage.style.color = "#a82424";
                }
                renderizarMateriaisAquisicao();
                return;
            }

            // Cada finalização gera um protocolo novo e preserva as requisições anteriores.
            const historicoRequisicoes = JSON.parse(
                localStorage.getItem("fardaNovaRequisicoes") || "[]"
            );
            const protocolosExistentes = new Set(
                historicoRequisicoes.map((registro) => String(registro.protocolo || "").toUpperCase())
            );
            const protocoloAtual = localStorage.getItem("fardaNovaNumeroRequisicao");
            if (protocoloAtual) protocolosExistentes.add(protocoloAtual.toUpperCase());

            let numero;
            do {
                numero = "FN-" + String(Math.floor(Math.random() * 1000000)).padStart(6, "0");
            } while (protocolosExistentes.has(numero));

            const statusRequisicao = "Aguardando separação pelo Almoxarifado";
            const dataRequisicao = new Date().toLocaleString("pt-BR");
            const registroRequisicao = {
                protocolo: numero,
                data: dataRequisicao,
                colaborador: colaborador?.nome || JSON.parse(localStorage.getItem("fardaNovaColaborador") || "null")?.nome || "Não informado",
                kit: kitSelecionado,
                status: statusRequisicao,
                listaKits: JSON.parse(JSON.stringify(listaAquisicao)),
                materiais: JSON.parse(JSON.stringify(materiaisAquisicao))
            };
            historicoRequisicoes.push(registroRequisicao);
            localStorage.setItem("fardaNovaRequisicoes", JSON.stringify(historicoRequisicoes));

            // Mantém também as chaves atuais para compatibilidade com as demais telas.
            localStorage.setItem("fardaNovaNumeroRequisicao", numero);
            localStorage.setItem("fardaNovaStatusRequisicao", statusRequisicao);
            localStorage.setItem("fardaNovaListaKits", JSON.stringify(listaAquisicao));
            localStorage.setItem("fardaNovaMateriaisAquisicao", JSON.stringify(materiaisAquisicao));

            if (optionResult) {
                optionResult.innerHTML = `
                    <h3>Requisição realizada com sucesso!</h3>
                    <p>
                        <strong>Protocolo:</strong> ${numero}<br>
                        <strong>Kit:</strong> ${kitSelecionado}<br>
                        <strong>Status:</strong> Aguardando separação pelo Almoxarifado.
                    </p>
                `;
            }

            if (requestMessage) {
                requestMessage.textContent =
                    "Requisição finalizada com sucesso! Protocolo: " + numero + ". Abrindo o Portal do Colaborador...";
                requestMessage.style.color = "#315d24";
            }

            // Após finalizar, encaminha automaticamente para a próxima página
            // do fluxo: Portal do Colaborador.
            setTimeout(() => {
                window.location.href = "servicos.html";
            }, 1000);
        });
    }


    // =====================================================
    // 5.1 LISTA DE KITS A SEREM ADQUIRIDOS
    // =====================================================

    const kitChecks = document.querySelectorAll(".kit-check");
    const kitQuantities = document.querySelectorAll(".kit-quantity");
    const acquisitionSummary =
        document.getElementById("acquisitionSummary");

    function atualizarListaAquisicao() {
        if (!acquisitionSummary) {
            return;
        }

        const lista = [];

        kitChecks.forEach((check) => {
            if (check.checked) {
                const quantityInput =
                    document.querySelector(
                        `.kit-quantity[data-kit="${CSS.escape(check.value)}"]`
                    );

                const quantidade =
                    Math.max(1, Number(quantityInput?.value || 1));

                lista.push({
                    kit: check.value,
                    quantidade: quantidade
                });
            }
        });

        localStorage.setItem(
            "fardaNovaListaKits",
            JSON.stringify(lista)
        );

        if (lista.length === 0) {
            acquisitionSummary.textContent =
                "Nenhum kit foi adicionado à lista de aquisição.";
            return;
        }

        acquisitionSummary.innerHTML = `
            <strong>Lista de aquisição:</strong>
            <ul>
                ${lista.map(item =>
                    `<li>${item.quantidade} × ${item.kit}</li>`
                ).join("")}
            </ul>
        `;
    }

    kitChecks.forEach((check) => {
        check.addEventListener("change", () => {
            if (check.checked) {
                kitSelecionado = check.value;
                localStorage.setItem("fardaNovaKitSelecionado", kitSelecionado);
            }
            atualizarListaAquisicao();
            renderizarMateriaisAquisicao();
        });
    });

    kitQuantities.forEach((input) => {
        input.addEventListener("input", atualizarListaAquisicao);
    });

    // Recupera a lista caso a página seja reaberta.
    const listaSalva =
        JSON.parse(
            localStorage.getItem("fardaNovaListaKits") || "[]"
        );

    listaSalva.forEach((item) => {
        const check = Array.from(kitChecks)
            .find((element) => element.value === item.kit);

        const quantity = Array.from(kitQuantities)
            .find((element) => element.dataset.kit === item.kit);

        if (check) {
            check.checked = true;
        }

        if (quantity) {
            quantity.value = item.quantidade;
        }
    });

    atualizarListaAquisicao();
    renderizarMateriaisAquisicao();

    // =====================================================
    // 6. PORTAL DO COLABORADOR
    // =====================================================

    const serviceCards =
        document.querySelectorAll("[data-service]");

    const serviceResult =
        document.getElementById("serviceResult");

    const colaborador = JSON.parse(
        localStorage.getItem("fardaNovaColaborador") || "null"
    );

    const portalSummary =
        document.getElementById("portalSummary");

    if (portalSummary && colaborador?.nome) {
        portalSummary.textContent =
            `Olá, ${colaborador.nome}. Consulte sua requisição, solicite troca de peças ou acesse os documentos.`;
    }

    // -----------------------------------------------------
    // 6.1 ACOMPANHAR REQUISIÇÃO
    // -----------------------------------------------------

    function obterNumeroRequisicao() {
        let protocolo = localStorage.getItem("fardaNovaNumeroRequisicao");
        const statusAtual = localStorage.getItem("fardaNovaStatusRequisicao") || "";
        const lista = JSON.parse(localStorage.getItem("fardaNovaListaKits") || "[]");
        const materiais = JSON.parse(localStorage.getItem("fardaNovaMateriaisAquisicao") || "[]");

        // Se a requisição já foi finalizada e o protocolo foi perdido,
        // recupera criando um novo e salvando imediatamente.
        if (!protocolo && statusAtual === "Aguardando separação pelo Almoxarifado" && lista.length > 0) {
            protocolo = "FN-" + Date.now().toString().slice(-6);
            localStorage.setItem("fardaNovaNumeroRequisicao", protocolo);
        }

        return protocolo;
    }

    function mostrarRequisicao() {
        const kit = localStorage.getItem("fardaNovaKitSelecionado");
        const status = localStorage.getItem("fardaNovaStatusRequisicao");
        const protocolo = obterNumeroRequisicao();
        const listaAquisicao = JSON.parse(localStorage.getItem("fardaNovaListaKits") || "[]");
        let materiaisAquisicao = JSON.parse(localStorage.getItem("fardaNovaMateriaisAquisicao") || "[]");

        // Compatibilidade com requisições criadas em versões anteriores:
        // se não houver detalhamento salvo, monta automaticamente a lista
        // de materiais de cada kit da lista de aquisição.
        if ((!materiaisAquisicao || materiaisAquisicao.length === 0) && listaAquisicao.length) {
            materiaisAquisicao = listaAquisicao.map((item) => ({
                kit: item.kit,
                quantidadeKit: Number(item.quantidade || 1),
                materiais: (materiaisPorKit[item.kit] || []).map((material) => ({
                    material,
                    quantidade: Number(item.quantidade || 1)
                }))
            }));
            localStorage.setItem("fardaNovaMateriaisAquisicao", JSON.stringify(materiaisAquisicao));
        }

        if (!kit || !status) {
            return `
                <h3>Acompanhar Requisição</h3>
                <p>Nenhuma requisição de kit foi encontrada. Faça o cadastro e selecione um kit primeiro.</p>
            `;
        }

        return `
            <h3>Acompanhar Requisição</h3>
            <div class="protocol-details">
                <p><strong>Protocolo:</strong> ${protocolo || "Ainda não gerado"}</p>
                ${!protocolo ? `
                    <p class="form-message" style="color:#a82424;">
                        A requisição ainda não foi finalizada. Volte à etapa de requisição e clique em <strong>Finalizar Requisição</strong>.
                    </p>
                    <a class="btn btn-primary" href="alistamento.html">Finalizar Requisição</a>
                ` : ""}
                <p><strong>Colaborador:</strong> ${colaborador?.nome || "Não informado"}</p>
                <p><strong>Kit principal:</strong> ${kit}</p>
                <p><strong>Status:</strong> ${status}</p>
            </div>

            <h4>Materiais solicitados para aquisição</h4>
            <div class="requested-materials">
                ${materiaisAquisicao.length ? materiaisAquisicao.map((registro) => `
                    <div class="requested-kit">
                        <h5>${registro.kit} — ${registro.quantidadeKit || 1} kit(s)</h5>
                        <ul class="item-list">
                            ${(registro.materiais || []).map((material) => `<li><strong>${material.quantidade} ×</strong> ${material.material}</li>`).join("") || "<li>Nenhum material informado.</li>"}
                        </ul>
                    </div>
                `).join("") : "<p>Nenhum material detalhado foi registrado.</p>"}
            </div>

            <h4>Resumo dos kits adquiridos</h4>
            <ul class="item-list">
                ${listaAquisicao.length ? listaAquisicao.map(item => `<li><strong>${item.quantidade} ×</strong> ${item.kit}</li>`).join("") : "<li>Lista de aquisição não informada.</li>"}
            </ul>
        `;
    }

    function obterItensKit(kit) {
        const kits = {
            "Kit Vigilância Patrimonial": [
                "Camisa social",
                "Calça tática",
                "Coturno",
                "Jaqueta de frio"
            ],
            "Kit Escolta Armada": [
                "Fardamento tático",
                "Colete balístico",
                "Cinto de guarnição",
                "Coturno"
            ],
            "Kit Administrativo": [
                "Camisa polo corporativa",
                "Calça social",
                "Crachá"
            ],
            "Kit Serviços Gerais": [
                "Uniforme de serviço",
                "Bota de segurança",
                "Luvas",
                "Equipamentos de proteção adequados à função"
            ]
        };

        return kits[kit] || ["Itens do kit não cadastrados."];
    }

    // -----------------------------------------------------
    // 6.2 LISTA DE PEÇAS PARA TROCA
    // -----------------------------------------------------

    function mostrarTrocaPeca() {
        const kit = localStorage.getItem("fardaNovaKitSelecionado");

        // Se houver um kit escolhido, mostra suas peças. Se não houver,
        // apresenta todas as peças possíveis cadastradas no sistema.
        const itensKit = obterItensKit(kit);
        const todosItens = [
            "Camisa social",
            "Calça tática",
            "Coturno",
            "Jaqueta de frio",
            "Fardamento tático",
            "Colete balístico",
            "Cinto de guarnição",
            "Camisa polo corporativa",
            "Calça social",
            "Crachá",
            "Uniforme de serviço",
            "Bota de segurança",
            "Luvas",
            "Óculos de proteção",
            "Protetor auricular",
            "Colete refletivo"
        ];

        const itens = kit
            ? [...new Set(itensKit)]
            : [...new Set(todosItens)];

        const trocaSalva = JSON.parse(
            localStorage.getItem("fardaNovaTroca") || "null"
        );

        const pecasSalvas = trocaSalva?.peças || [];

        return `
            <h3>Solicitar Troca de Peça</h3>

            <p>
                ${kit
                    ? `Kit selecionado: <strong>${kit}</strong>. Selecione uma ou mais peças que precisam ser trocadas.`
                    : "Selecione uma ou mais peças de fardamento ou EPI para solicitar a troca."}
            </p>

            <div class="exchange-list">
                ${itens.map((item) => {
                    const salva = pecasSalvas.find(p => p.peça === item);
                    return `
                        <label class="exchange-item">
                            <input
                                type="checkbox"
                                class="exchange-piece"
                                value="${item}"
                                ${salva ? "checked" : ""}
                            >

                            <span class="exchange-piece-name">
                                ${item}
                            </span>

                            <input
                                type="number"
                                class="exchange-quantity"
                                data-piece="${item}"
                                min="1"
                                value="${salva?.quantidade || 1}"
                                aria-label="Quantidade de ${item}"
                            >
                        </label>
                    `;
                }).join("")}
            </div>

            <div class="exchange-form">
                <label for="exchangeReason">
                    Motivo da troca
                    <select id="exchangeReason">
                        <option value="">Selecione o motivo</option>
                        <option value="Desgaste natural" ${trocaSalva?.motivo === "Desgaste natural" ? "selected" : ""}>Desgaste natural</option>
                        <option value="Dano na peça" ${trocaSalva?.motivo === "Dano na peça" ? "selected" : ""}>Dano na peça</option>
                        <option value="Tamanho incorreto" ${trocaSalva?.motivo === "Tamanho incorreto" ? "selected" : ""}>Tamanho incorreto</option>
                        <option value="Perda ou extravio" ${trocaSalva?.motivo === "Perda ou extravio" ? "selected" : ""}>Perda ou extravio</option>
                        <option value="Outro motivo" ${trocaSalva?.motivo === "Outro motivo" ? "selected" : ""}>Outro motivo</option>
                    </select>
                </label>

                <label for="exchangeDetails">
                    Observação
                    <textarea id="exchangeDetails" rows="3" placeholder="Descreva, se necessário, o problema da peça.">${trocaSalva?.observacao || ""}</textarea>
                </label>

                <button class="btn btn-primary" id="submitExchange" type="button">
                    Registrar Solicitação de Troca
                </button>

                <p id="exchangeMessage" class="form-message" aria-live="polite"></p>
            </div>
        `;
    }

    // -----------------------------------------------------
    // 6.3 STATUS DA TROCA
    // -----------------------------------------------------

    function mostrarStatusTroca() {
        let troca = null;
        try { troca = JSON.parse(localStorage.getItem("fardaNovaTroca") || "null"); } catch (e) {}
        if (!troca) {
            const protocolo = localStorage.getItem("fardaNovaUltimoProtocoloTroca");
            if (protocolo) {
                let pecas = [];
                try { pecas = JSON.parse(localStorage.getItem("fardaNovaPecasTroca") || "[]"); } catch (e) {}
                troca = { protocolo, status: localStorage.getItem("fardaNovaStatusTroca") || "Aguardando análise do RH", data: localStorage.getItem("fardaNovaUltimaDataTroca") || "—", motivo: localStorage.getItem("fardaNovaMotivoTroca") || "—", peças: pecas };
            }
        }

        if (!troca) {
            return `
                <h3>Status da Troca de Peça</h3>
                <div class="feature-data">
                    <p><strong>Status:</strong> Nenhuma solicitação de troca registrada.</p>
                    <p>Acesse o serviço <strong>Solicitar Troca de Peça</strong> para registrar uma solicitação.</p>
                </div>
            `;
        }

        return `
            <h3>Status da Troca de Peça</h3>
            <div class="feature-data">
                <p><strong>Protocolo:</strong> ${troca.protocolo || "Não informado"}</p>
                <p><strong>Status atual:</strong> ${troca.status || "Aguardando análise do RH"}</p>
                <p><strong>Data da solicitação:</strong> ${troca.data || "Não informada"}</p>
                <p><strong>Motivo:</strong> ${troca.motivo || "Não informado"}</p>
            </div>
            <h4>Peças solicitadas</h4>
            <ul class="item-list">
                ${(troca.peças || []).map(item => `<li>${item.quantidade} × ${item.peça}</li>`).join("") || "<li>Nenhuma peça informada.</li>"}
            </ul>
            <a class="btn btn-secondary" href="troca.html">Abrir solicitação de troca</a>
        `;
    }

    // -----------------------------------------------------
    // 6.4 CONSULTA DE PROTOCOLO
    // -----------------------------------------------------

    function mostrarConsultaProtocolo() {
        return `
            <h3>Consultar Protocolo</h3>

            <p>
                Digite o número do protocolo gerado ao finalizar a requisição.
            </p>

            <div class="protocol-search">
                <label for="protocolInput">
                    Número do protocolo
                    <input
                        type="text"
                        id="protocolInput"
                        placeholder="Ex.: FN-123456 ou TR-123456"
                        autocomplete="off"
                    >
                </label>

                <button class="btn btn-primary" id="consultProtocol" type="button">
                    Consultar Protocolo
                </button>

                <p id="protocolMessage" class="form-message" aria-live="polite"></p>
            </div>
        `;
    }

    // -----------------------------------------------------
    // 6.4 EVENTOS DOS BOTÕES DO PORTAL
    // -----------------------------------------------------

    serviceCards.forEach((card) => {
        card.addEventListener("click", () => {

            serviceCards.forEach((item) => {
                item.classList.remove("selected");
            });

            card.classList.add("selected");

            const service = card.dataset.service;

            localStorage.setItem(
                "fardaNovaUltimoServico",
                service
            );

            if (!serviceResult) {
                return;
            }

            if (service === "Acompanhar Requisição") {
                serviceResult.innerHTML = mostrarRequisicao();
                return;
            }

            if (service === "Solicitar Troca de Peça") {
                serviceResult.innerHTML = mostrarTrocaPeca();
                configurarTroca();
                return;
            }

            if (service === "Status da Troca") {
                serviceResult.innerHTML = mostrarStatusTroca();
                return;
            }

            if (service === "Consultar Protocolo") {
                serviceResult.innerHTML = mostrarConsultaProtocolo();
                configurarConsultaProtocolo();
                return;
            }

            if (service === "Manual de Uso") {
                serviceResult.innerHTML = `
                    <h3>Manual de Uso</h3>
                    <p>
                        <strong>Orientações de utilização:</strong>
                    </p>
                    <ul class="item-list">
                        <li>Utilize o fardamento conforme as normas internas.</li>
                        <li>Mantenha as peças limpas e conservadas.</li>
                        <li>Utilize os EPIs indicados para cada atividade.</li>
                        <li>Não altere as características de segurança dos EPIs.</li>
                        <li>Solicite substituição quando houver dano ou tamanho inadequado.</li>
                    </ul>
                `;
                return;
            }

            if (service === "Termo de Responsabilidade") {
                localStorage.setItem(
                    "fardaNovaTermoConsultado",
                    "true"
                );

                serviceResult.innerHTML = `
                    <h3>Termo de Responsabilidade</h3>
                    <p>
                        O Termo de Responsabilidade foi consultado e
                        registrado no <strong>localStorage</strong>.
                    </p>
                    <p>
                        Nesta versão acadêmica, a assinatura digital é
                        simulada. Em um sistema real, seria necessária
                        autenticação e assinatura eletrônica.
                    </p>
                `;
            }
        });
    });

    // -----------------------------------------------------
    // 6.5 REGISTRO DA TROCA
    // -----------------------------------------------------

    function configurarTroca() {
        const button =
            document.getElementById("submitExchange");

        if (!button) {
            return;
        }

        button.addEventListener("click", () => {
            const selecionadas =
                Array.from(
                    document.querySelectorAll(".exchange-piece:checked")
                );

            const reason =
                document.getElementById("exchangeReason").value;

            const message =
                document.getElementById("exchangeMessage");

            if (selecionadas.length === 0 || !reason) {
                message.textContent =
                    "Selecione pelo menos uma peça e informe o motivo da troca.";
                message.style.color = "#a82424";
                return;
            }

            const pecas = selecionadas.map((checkbox) => {
                const quantityInput =
                    document.querySelector(
                        `.exchange-quantity[data-piece="${CSS.escape(checkbox.value)}"]`
                    );

                return {
                    peça: checkbox.value,
                    quantidade: Math.max(
                        1,
                        Number(quantityInput?.value || 1)
                    )
                };
            });

            const observacao =
                document.getElementById("exchangeDetails")?.value.trim() || "";

            const protocoloTroca =
                "TR-" + Date.now().toString().slice(-6);

            const troca = {
                protocolo: protocoloTroca,
                peças: pecas,
                motivo: reason,
                observacao: observacao,
                status: "Aguardando análise do RH",
                data: new Date().toLocaleString("pt-BR")
            };

            localStorage.setItem(
                "fardaNovaTroca",
                JSON.stringify(troca)
            );
            localStorage.setItem("fardaNovaUltimoProtocoloTroca", protocoloTroca);
            localStorage.setItem("fardaNovaUltimaDataTroca", troca.data);
            localStorage.setItem("fardaNovaStatusTroca", troca.status);
            localStorage.setItem("fardaNovaMotivoTroca", troca.motivo);
            localStorage.setItem("fardaNovaPecasTroca", JSON.stringify(troca.peças));

            message.innerHTML=
                `Solicitação registrada com sucesso. <strong>Protocolo: ${protocoloTroca}</strong> — ${pecas.length} peça(s) enviada(s) para análise do RH.`;
            message.style.color = "#315d24";
        });
    }

    // -----------------------------------------------------
    // 6.6 CONSULTA DO PROTOCOLO
    // -----------------------------------------------------

    function configurarConsultaProtocolo() {
        const button = document.getElementById("consultProtocol");
        if (!button) return;

        button.addEventListener("click", () => {
            const input = document.getElementById("protocolInput");
            const message = document.getElementById("protocolMessage");
            const digitado = (input?.value || "").trim().toUpperCase();

            if (!digitado) {
                message.textContent = "Digite um número de protocolo (FN-XXXXXX ou TR-XXXXXX).";
                message.style.color = "#a82424";
                return;
            }

            // Consulta de troca de peça: TR-XXXXXX
            if (digitado.startsWith("TR-")) {
                let troca = null;
                try { troca = JSON.parse(localStorage.getItem("fardaNovaTroca") || "null"); } catch (e) {}

                if (!troca || String(troca.protocolo || "").toUpperCase() !== digitado) {
                    message.textContent = "Protocolo de troca não encontrado. Verifique o número informado.";
                    message.style.color = "#a82424";
                    return;
                }

                const pecas = (troca.peças || []).map(item =>
                    `<li><strong>${Number(item.quantidade || 1)} ×</strong> ${item.peça}</li>`
                ).join("") || "<li>Nenhuma peça informada.</li>";

                message.innerHTML = `
                    <span style="color:#315d24;font-weight:700;">Protocolo de troca localizado com sucesso.</span>
                    <div class="protocol-details" style="margin-top:16px;">
                        <p><strong>Protocolo:</strong> ${troca.protocolo}</p>
                        <p><strong>Status:</strong> ${troca.status || "Aguardando análise do RH"}</p>
                        <p><strong>Data:</strong> ${troca.data || "—"}</p>
                        <p><strong>Motivo:</strong> ${troca.motivo || "—"}</p>
                        ${troca.observacao ? `<p><strong>Observação:</strong> ${troca.observacao}</p>` : ""}
                        <p><strong>Peças solicitadas:</strong></p>
                        <ul class="item-list">${pecas}</ul>
                    </div>`;
                message.style.color = "inherit";
                return;
            }

            // Consulta de requisição: pesquisa primeiro no histórico para aceitar protocolos antigos.
            const historicoRequisicoes = JSON.parse(
                localStorage.getItem("fardaNovaRequisicoes") || "[]"
            );
            let registroEncontrado = historicoRequisicoes.find(
                (registro) => String(registro.protocolo || "").toUpperCase() === digitado
            );

            // Compatibilidade com requisições antigas, criadas antes do histórico existir.
            const protocoloAtual = obterNumeroRequisicao();
            if (!registroEncontrado && protocoloAtual && digitado === protocoloAtual.toUpperCase()) {
                registroEncontrado = {
                    protocolo: protocoloAtual,
                    data: "—",
                    colaborador: colaborador?.nome || "Não informado",
                    kit: localStorage.getItem("fardaNovaKitSelecionado"),
                    status: localStorage.getItem("fardaNovaStatusRequisicao") || "Aguardando separação pelo Almoxarifado",
                    listaKits: JSON.parse(localStorage.getItem("fardaNovaListaKits") || "[]"),
                    materiais: JSON.parse(localStorage.getItem("fardaNovaMateriaisAquisicao") || "[]")
                };
                historicoRequisicoes.push(registroEncontrado);
                localStorage.setItem("fardaNovaRequisicoes", JSON.stringify(historicoRequisicoes));
            }

            if (!registroEncontrado) {
                message.textContent = "Protocolo não encontrado. Confira o número informado.";
                message.style.color = "#a82424";
                return;
            }

            const protocolo = registroEncontrado.protocolo;
            const kit = registroEncontrado.kit;
            const status = registroEncontrado.status || "Aguardando separação pelo Almoxarifado";
            const listaAquisicao = registroEncontrado.listaKits || [];
            let materiaisAquisicao = registroEncontrado.materiais || [];

            if ((!materiaisAquisicao || materiaisAquisicao.length === 0) && listaAquisicao.length) {
                materiaisAquisicao = listaAquisicao.map(item => ({
                    kit: item.kit,
                    quantidadeKit: Number(item.quantidade || 1),
                    materiais: (materiaisPorKit[item.kit] || []).map(material => ({
                        material,
                        quantidade: Number(item.quantidade || 1)
                    }))
                }));
                localStorage.setItem("fardaNovaMateriaisAquisicao", JSON.stringify(materiaisAquisicao));
            }

            const materiaisHtml = materiaisAquisicao.map(registro => `
                <div class="requested-kit">
                    <h5>${registro.kit} — ${registro.quantidadeKit || 1} kit(s)</h5>
                    <ul class="item-list">
                        ${(registro.materiais || []).map(material => `<li><strong>${Number(material.quantidade || 1)} ×</strong> ${material.material}</li>`).join("")}
                    </ul>
                </div>
            `).join("") || "<p>Nenhum material detalhado foi registrado.</p>";

            message.innerHTML = `
                <span style="color:#315d24;font-weight:700;">Protocolo localizado com sucesso.</span>
                <div class="protocol-details" style="margin-top:16px;">
                    <p><strong>Protocolo:</strong> ${protocolo}</p>
                    <p><strong>Colaborador:</strong> ${registroEncontrado.colaborador || colaborador?.nome || "Não informado"}</p>
                    <p><strong>Data:</strong> ${registroEncontrado.data || "—"}</p>
                    <p><strong>Kit principal:</strong> ${kit || "Não informado"}</p>
                    <p><strong>Status:</strong> ${status}</p>
                    <h4>Materiais solicitados</h4>
                    ${materiaisHtml}
                </div>`;
            message.style.color = "inherit";
        });
    }

});
