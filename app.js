// Variáveis globais
let produtos = [];
let movimentacoes = [];
let responsaveis = [];
let linhas = [];
let usuarios = [];

// Quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o usuário está logado
    verificarAutenticacao();
    
    // Carregar dados iniciais
    carregarDados();
    
    // Configurar formulários
    configurarFormularios();
    
    // Configurar eventos
    configurarEventos();
    
    // Preencher data e horário atuais
    preencherDataHoraAtual();
});

// Função para verificar autenticação
function verificarAutenticacao() {
    // Aqui você pode implementar a lógica de autenticação
    // Por enquanto, vamos permitir acesso sem login
    console.log("Sistema carregado sem autenticação");
}

// Função para carregar dados iniciais
function carregarDados() {
    carregarProdutos();
    carregarMovimentacoes();
    carregarResponsaveis();
    carregarLinhas();
}

// Função para configurar formulários
function configurarFormularios() {
    // Formulário de movimentação
    const formMovimentacao = document.getElementById('form-movimentacao');
    if (formMovimentacao) {
        formMovimentacao.addEventListener('submit', function(e) {
            e.preventDefault();
            registrarMovimentacao();
        });
    }
    
    // Formulário de produto
    const formProduto = document.getElementById('form-produto');
    if (formProduto) {
        formProduto.addEventListener('submit', function(e) {
            e.preventDefault();
            cadastrarProduto();
        });
    }
    
    // Formulário de responsável
    const formResponsavel = document.getElementById('form-responsavel');
    if (formResponsavel) {
        formResponsavel.addEventListener('submit', function(e) {
            e.preventDefault();
            cadastrarResponsavel();
        });
    }
    
    // Formulário de linha
    const formLinha = document.getElementById('form-linha');
    if (formLinha) {
        formLinha.addEventListener('submit', function(e) {
            e.preventDefault();
            cadastrarLinha();
        });
    }
}

// Função para configurar eventos
function configurarEventos() {
    // Evento de seleção de SKU no formulário de movimentação
    const movSku = document.getElementById('mov-sku');
    if (movSku) {
        movSku.addEventListener('change', function() {
            const sku = this.value;
            const produto = produtos.find(p => p.sku === sku);
            
            if (produto) {
                document.getElementById('mov-descricao').value = produto.descricao;
            } else {
                document.getElementById('mov-descricao').value = '';
            }
        });
    }
    
    // Evento de seleção de SKU na consulta de produto
    const skuConsulta = document.getElementById('sku-consulta');
    if (skuConsulta) {
        skuConsulta.addEventListener('change', function() {
            const sku = this.value;
            const produto = produtos.find(p => p.sku === sku);
            
            if (produto) {
                document.getElementById('detalhe-sku').textContent = produto.sku;
                document.getElementById('detalhe-descricao').textContent = produto.descricao;
                document.getElementById('detalhe-linha').textContent = produto.linha;
                document.getElementById('detalhe-status').textContent = produto.status;
                document.getElementById('detalhe-quantidade').textContent = produto.quantidadeAtual;
                document.getElementById('detalhe-minimo').textContent = produto.minimoIdeal;
                
                // Calcular nível do estoque
                let nivel = 'OK';
                let nivelClass = 'status-ok';
                
                if (produto.quantidadeAtual < produto.minimoIdeal) {
                    nivel = 'Abaixo do mínimo';
                    nivelClass = 'status-baixo';
                } else if (produto.quantidadeAtual <= produto.minimoIdeal * 1.2) {
                    nivel = 'Próximo do mínimo';
                    nivelClass = 'status-proximo';
                }
                
                const nivelElement = document.getElementById('detalhe-nivel');
                nivelElement.textContent = nivel;
                nivelElement.className = nivelClass;
                
                document.getElementById('detalhes-produto').style.display = 'block';
            } else {
                document.getElementById('detalhes-produto').style.display = 'none';
            }
        });
    }
    
    // Evento de filtro no dashboard
    document.querySelectorAll('[data-filtro]').forEach(filtro => {
        filtro.addEventListener('click', function(e) {
            e.preventDefault();
            const tipoFiltro = this.getAttribute('data-filtro');
            filtrarProdutosDashboard(tipoFiltro);
        });
    });
    
    // Evento de ordenação no estoque geral
    document.querySelectorAll('[data-ordenar]').forEach(ordenar => {
        ordenar.addEventListener('click', function(e) {
            e.preventDefault();
            const tipoOrdenacao = this.getAttribute('data-ordenar');
            ordenarProdutosEstoque(tipoOrdenacao);
        });
    });
    
    // Evento de busca no estoque geral
    const btnBuscaEstoque = document.getElementById('btn-busca-estoque');
    if (btnBuscaEstoque) {
        btnBuscaEstoque.addEventListener('click', function() {
            const termoBusca = document.getElementById('busca-estoque').value.toLowerCase();
            buscarProdutosEstoque(termoBusca);
        });
    }
    
    // Evento de exportação de dados
    const exportarDados = document.getElementById('exportar-dados');
    if (exportarDados) {
        exportarDados.addEventListener('click', function() {
            exportarDados();
        });
    }
    
    // Evento de exportação de movimentações
    const exportarMovimentacoes = document.getElementById('exportar-movimentacoes');
    if (exportarMovimentacoes) {
        exportarMovimentacoes.addEventListener('click', function() {
            exportarMovimentacoes();
        });
    }
}

// Função para preencher data e hora atual
function preencherDataHoraAtual() {
    const agora = new Date();
    
    // Formatar data
    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const dia = String(agora.getDate()).padStart(2, '0');
    const dataFormatada = `${ano}-${mes}-${dia}`;
    
    // Formatar hora
    const horas = String(agora.getHours()).padStart(2, '0');
    const minutos = String(agora.getMinutes()).padStart(2, '0');
    const horaFormatada = `${horas}:${minutos}`;
    
    // Preencher campos
    const movData = document.getElementById('mov-data');
    if (movData) {
        movData.value = dataFormatada;
    }
    
    const movHorario = document.getElementById('mov-horario');
    if (movHorario) {
        movHorario.value = horaFormatada;
    }
}

// Função para carregar produtos
function carregarProdutos() {
    db.collection('produtos').get().then(snapshot => {
        produtos = [];
        snapshot.forEach(doc => {
            produtos.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        // Atualizar dashboard se estiver visível
        if (document.getElementById('dashboard')) {
            atualizarDashboard();
        }
        
        // Atualizar selects
        atualizarSelects();
    }).catch(error => {
        console.error("Erro ao carregar produtos: ", error);
        mostrarNotificacao("Erro ao carregar produtos", "danger");
    });
}

// Função para carregar movimentações
function carregarMovimentacoes() {
    db.collection('movimentacoes').orderBy('data', 'desc').get().then(snapshot => {
        movimentacoes = [];
        snapshot.forEach(doc => {
            movimentacoes.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        // Atualizar tabela de movimentações se estiver visível
        if (document.getElementById('tabela-movimentacoes')) {
            atualizarMovimentacoes();
        }
    }).catch(error => {
        console.error("Erro ao carregar movimentações: ", error);
        mostrarNotificacao("Erro ao carregar movimentações", "danger");
    });
}

// Função para carregar responsáveis
function carregarResponsaveis() {
    db.collection('responsaveis').get().then(snapshot => {
        responsaveis = [];
        snapshot.forEach(doc => {
            responsaveis.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        // Atualizar selects
        atualizarSelects();
    }).catch(error => {
        console.error("Erro ao carregar responsáveis: ", error);
        mostrarNotificacao("Erro ao carregar responsáveis", "danger");
    });
}

// Função para carregar linhas
function carregarLinhas() {
    db.collection('linhas').get().then(snapshot => {
        linhas = [];
        snapshot.forEach(doc => {
            linhas.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        // Atualizar selects
        atualizarSelects();
    }).catch(error => {
        console.error("Erro ao carregar linhas: ", error);
        mostrarNotificacao("Erro ao carregar linhas", "danger");
    });
}

// Função para atualizar selects
function atualizarSelects() {
    // Atualizar select de SKUs
    const skuSelects = ['mov-sku', 'sku-consulta'];
    skuSelects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            select.innerHTML = '<option value="">Selecione um SKU</option>';
            
            produtos.forEach(produto => {
                const option = document.createElement('option');
                option.value = produto.sku;
                option.textContent = `${produto.sku} - ${produto.descricao}`;
                select.appendChild(option);
            });
        }
    });
    
    // Atualizar select de responsáveis
    const responsavelSelect = document.getElementById('mov-responsavel');
    if (responsavelSelect) {
        responsavelSelect.innerHTML = '<option value="">Selecione</option>';
        
        responsaveis.filter(r => r.status === 'ativo').forEach(responsavel => {
            const option = document.createElement('option');
            option.value = `${responsavel.nome} ${responsavel.sobrenome}`;
            option.textContent = `${responsavel.nome} ${responsavel.sobrenome}`;
            responsavelSelect.appendChild(option);
        });
    }
    
    // Atualizar select de linhas
    const linhaSelects = ['produto-linha'];
    linhaSelects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            select.innerHTML = '<option value="">Selecione</option>';
            
            linhas.forEach(linha => {
                const option = document.createElement('option');
                option.value = linha.codigo;
                option.textContent = linha.nome;
                select.appendChild(option);
            });
        }
    });
}

// Função para atualizar dashboard
function atualizarDashboard() {
    // Calcular totais
    const totalProdutos = produtos.length;
    const produtosAtivos = produtos.filter(p => p.status === 'ativo').length;
    const produtosInativos = produtos.filter(p => p.status === 'inativo').length;
    const totalEstoque = produtos.reduce((sum, p) => sum + p.quantidadeAtual, 0);
    
    // Calcular status de estoque
    let estoqueOK = 0;
    let estoqueProximo = 0;
    let estoqueBaixo = 0;
    
    produtos.forEach(p => {
        if (p.quantidadeAtual < p.minimoIdeal) {
            estoqueBaixo++;
        } else if (p.quantidadeAtual <= p.minimoIdeal * 1.2) {
            estoqueProximo++;
        } else {
            estoqueOK++;
        }
    });
    
    // Atualizar cards
    const totalProdutosElement = document.getElementById('total-produtos');
    if (totalProdutosElement) totalProdutosElement.textContent = totalProdutos;
    
    const produtosAtivosElement = document.getElementById('produtos-ativos');
    if (produtosAtivosElement) produtosAtivosElement.textContent = produtosAtivos;
    
    const produtosInativosElement = document.getElementById('produtos-inativos');
    if (produtosInativosElement) produtosInativosElement.textContent = produtosInativos;
    
    const totalEstoqueElement = document.getElementById('total-estoque');
    if (totalEstoqueElement) totalEstoqueElement.textContent = totalEstoque;
    
    const estoqueOkElement = document.getElementById('estoque-ok');
    if (estoqueOkElement) estoqueOkElement.textContent = estoqueOK;
    
    const estoqueProximoElement = document.getElementById('estoque-proximo');
    if (estoqueProximoElement) estoqueProximoElement.textContent = estoqueProximo;
    
    const estoqueBaixoElement = document.getElementById('estoque-baixo');
    if (estoqueBaixoElement) estoqueBaixoElement.textContent = estoqueBaixo;
    
    // Atualizar tabela de produtos
    atualizarTabelaProdutosDashboard();
    
    // Verificar notificações de estoque baixo
    if (estoqueBaixo > 0) {
        mostrarNotificacao(`${estoqueBaixo} produtos abaixo do mínimo!`, "warning");
    }
}

// Função para atualizar tabela de produtos no dashboard
function atualizarTabelaProdutosDashboard() {
    const tbody = document.querySelector('#tabela-produtos tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    // Ordenar produtos: abaixo do mínimo, próximo do mínimo, OK
    const produtosOrdenados = [...produtos].sort((a, b) => {
        const getStatus = (p) => {
            if (p.quantidadeAtual < p.minimoIdeal) return 1;
            if (p.quantidadeAtual <= p.minimoIdeal * 1.2) return 2;
            return 3;
        };
        
        return getStatus(a) - getStatus(b);
    });
    
    produtosOrdenados.forEach(produto => {
        const tr = document.createElement('tr');
        
        // Determinar status e classe
        let status = 'OK';
        let statusClass = 'status-ok';
        
        if (produto.quantidadeAtual < produto.minimoIdeal) {
            status = 'Abaixo do mínimo';
            statusClass = 'status-baixo';
        } else if (produto.quantidadeAtual <= produto.minimoIdeal * 1.2) {
            status = 'Próximo do mínimo';
            statusClass = 'status-proximo';
        }
        
        tr.innerHTML = `
            <td><img src="${produto.fotoUrl || 'placeholder.png'}" class="produto-img" alt="${produto.descricao}"></td>
            <td>${produto.sku}</td>
            <td>${produto.descricao}</td>
            <td>${produto.linha}</td>
            <td>${produto.quantidadeAtual}</td>
            <td>${produto.minimoIdeal}</td>
            <td class="${statusClass}">${status}</td>
        `;
        
        tbody.appendChild(tr);
    });
}

// Função para filtrar produtos no dashboard
function filtrarProdutosDashboard(tipoFiltro) {
    const tbody = document.querySelector('#tabela-produtos tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    let produtosFiltrados = [...produtos];
    
    if (tipoFiltro === 'abaixo') {
        produtosFiltrados = produtos.filter(p => p.quantidadeAtual < p.minimoIdeal);
    } else if (tipoFiltro === 'proximo') {
        produtosFiltrados = produtos.filter(p => p.quantidadeAtual > p.minimoIdeal && p.quantidadeAtual <= p.minimoIdeal * 1.2);
    } else if (tipoFiltro === 'ok') {
        produtosFiltrados = produtos.filter(p => p.quantidadeAtual > p.minimoIdeal * 1.2);
    }
    
    produtosFiltrados.forEach(produto => {
        const tr = document.createElement('tr');
        
        // Determinar status e classe
        let status = 'OK';
        let statusClass = 'status-ok';
        
        if (produto.quantidadeAtual < produto.minimoIdeal) {
            status = 'Abaixo do mínimo';
            statusClass = 'status-baixo';
        } else if (produto.quantidadeAtual <= produto.minimoIdeal * 1.2) {
            status = 'Próximo do mínimo';
            statusClass = 'status-proximo';
        }
        
        tr.innerHTML = `
            <td><img src="${produto.fotoUrl || 'placeholder.png'}" class="produto-img" alt="${produto.descricao}"></td>
            <td>${produto.sku}</td>
            <td>${produto.descricao}</td>
            <td>${produto.linha}</td>
            <td>${produto.quantidadeAtual}</td>
            <td>${produto.minimoIdeal}</td>
            <td class="${statusClass}">${status}</td>
        `;
        
        tbody.appendChild(tr);
    });
}

// Função para atualizar estoque geral
function atualizarEstoqueGeral() {
    const tbody = document.querySelector('#tabela-estoque-geral tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    produtos.forEach(produto => {
        const tr = document.createElement('tr');
        
        // Formatar data de atualização
        let dataAtualizacao = 'Não informada';
        if (produto.ultimaAtualizacao) {
            const data = new Date(produto.ultimaAtualizacao.seconds * 1000);
            dataAtualizacao = data.toLocaleDateString();
        }
        
        tr.innerHTML = `
            <td><img src="${produto.fotoUrl || 'placeholder.png'}" class="produto-img" alt="${produto.descricao}"></td>
            <td>${produto.sku}</td>
            <td>${produto.descricao}</td>
            <td>${produto.linha}</td>
            <td>${produto.quantidadeAtual}</td>
            <td>${dataAtualizacao}</td>
            <td>${produto.minimoIdeal}</td>
            <td>
                <button class="btn btn-sm btn-primary btn-action" onclick="editarProduto('${produto.id}')">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger btn-action" onclick="excluirProduto('${produto.id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

// Função para ordenar produtos no estoque geral
function ordenarProdutosEstoque(tipoOrdenacao) {
    const tbody = document.querySelector('#tabela-estoque-geral tbody');
    if (!tbody) return;
    
    const linhas = Array.from(tbody.querySelectorAll('tr'));
    
    linhas.sort((a, b) => {
        let valorA, valorB;
        
        switch (tipoOrdenacao) {
            case 'quantidade-crescente':
                valorA = parseInt(a.cells[4].textContent);
                valorB = parseInt(b.cells[4].textContent);
                return valorA - valorB;
            case 'quantidade-decrescente':
                valorA = parseInt(a.cells[4].textContent);
                valorB = parseInt(b.cells[4].textContent);
                return valorB - valorA;
            case 'descricao':
                valorA = a.cells[2].textContent;
                valorB = b.cells[2].textContent;
                return valorA.localeCompare(valorB);
            case 'sku':
                valorA = a.cells[1].textContent;
                valorB = b.cells[1].textContent;
                return valorA.localeCompare(valorB);
            default:
                return 0;
        }
    });
    
    // Reordenar as linhas na tabela
    linhas.forEach(linha => tbody.appendChild(linha));
}

// Função para buscar produtos no estoque geral
function buscarProdutosEstoque(termoBusca) {
    const tbody = document.querySelector('#tabela-estoque-geral tbody');
    if (!tbody) return;
    
    const linhas = tbody.querySelectorAll('tr');
    
    linhas.forEach(linha => {
        const texto = linha.textContent.toLowerCase();
        if (texto.includes(termoBusca)) {
            linha.style.display = '';
        } else {
            linha.style.display = 'none';
        }
    });
}

// Função para atualizar movimentações
function atualizarMovimentacoes() {
    const tbody = document.querySelector('#tabela-movimentacoes tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    movimentacoes.forEach(movimentacao => {
        const tr = document.createElement('tr');
        
        // Formatar data e horário
        const data = new Date(movimentacao.data.seconds * 1000);
        const dataFormatada = data.toLocaleDateString();
        const horaFormatada = data.toLocaleTimeString();
        
        tr.innerHTML = `
            <td>${dataFormatada}</td>
            <td>${horaFormatada}</td>
            <td><img src="${movimentacao.fotoUrl || 'placeholder.png'}" class="produto-img" alt="${movimentacao.descricao}"></td>
            <td>${movimentacao.sku}</td>
            <td>${movimentacao.descricao}</td>
            <td>${movimentacao.linha}</td>
            <td>${movimentacao.tipoMovimentacao}</td>
            <td>${movimentacao.quantidade}</td>
            <td>${movimentacao.pedido || '-'}</td>
            <td>${movimentacao.responsavel}</td>
        `;
        
        tbody.appendChild(tr);
    });
}

// Função para registrar movimentação
function registrarMovimentacao() {
    const sku = document.getElementById('mov-sku').value;
    const tipo = document.getElementById('mov-tipo').value;
    const quantidade = parseInt(document.getElementById('mov-quantidade').value);
    const pedido = document.getElementById('mov-pedido').value;
    const responsavel = document.getElementById('mov-responsavel').value;
    
    // Validar campos
    if (!sku || !tipo || !quantidade || !responsavel) {
        mostrarNotificacao("Preencha todos os campos obrigatórios", "danger");
        return;
    }
    
    // Encontrar o produto
    const produto = produtos.find(p => p.sku === sku);
    if (!produto) {
        mostrarNotificacao("Produto não encontrado", "danger");
        return;
    }
    
    // Calcular nova quantidade
    let novaQuantidade;
    if (tipo === 'entrada') {
        novaQuantidade = produto.quantidadeAtual + quantidade;
    } else {
        if (quantidade > produto.quantidadeAtual) {
            mostrarNotificacao("Quantidade insuficiente em estoque", "danger");
            return;
        }
        novaQuantidade = produto.quantidadeAtual - quantidade;
    }
    
    // Criar objeto de movimentação
    const movimentacao = {
        data: firebase.firestore.Timestamp.now(),
        sku: sku,
        descricao: produto.descricao,
        linha: produto.linha,
        tipoMovimentacao: tipo,
        quantidade: quantidade,
        pedido: pedido,
        responsavel: responsavel,
        fotoUrl: produto.fotoUrl
    };
    
    // Salvar movimentação no Firestore
    db.collection('movimentacoes').add(movimentacao)
        .then(() => {
            // Atualizar quantidade do produto
            return db.collection('produtos').doc(produto.id).update({
                quantidadeAtual: novaQuantidade,
                ultimaAtualizacao: firebase.firestore.Timestamp.now()
            });
        })
        .then(() => {
            // Limpar formulário
            document.getElementById('form-movimentacao').reset();
            preencherDataHoraAtual();
            
            // Recarregar dados
            carregarProdutos();
            carregarMovimentacoes();
            
            // Mostrar notificação
            mostrarNotificacao("Movimentação registrada com sucesso", "success");
        })
        .catch(error => {
            console.error("Erro ao registrar movimentação: ", error);
            mostrarNotificacao("Erro ao registrar movimentação", "danger");
        });
}

// Função para atualizar formulário de produto
function atualizarFormularioProduto() {
    // Atualizar tabela de produtos cadastrados
    const tbody = document.querySelector('#tabela-produtos-cadastrados tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    produtos.forEach(produto => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td><img src="${produto.fotoUrl || 'placeholder.png'}" class="produto-img" alt="${produto.descricao}"></td>
            <td>${produto.sku}</td>
            <td>${produto.descricao}</td>
            <td>${produto.linha}</td>
            <td class="${produto.status === 'ativo' ? 'status-ativo' : 'status-inativo'}">${produto.status}</td>
            <td>
                <button class="btn btn-sm btn-primary btn-action" onclick="editarProduto('${produto.id}')">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger btn-action" onclick="excluirProduto('${produto.id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

// Função para cadastrar produto
function cadastrarProduto() {
    const status = document.getElementById('produto-status').value;
    const sku = document.getElementById('produto-sku').value;
    const descricao = document.getElementById('produto-descricao').value;
    const estoqueInicial = parseInt(document.getElementById('produto-estoque-inicial').value);
    const estoqueMinimo = parseInt(document.getElementById('produto-estoque-minimo').value);
    const linha = document.getElementById('produto-linha').value;
    const fotoFile = document.getElementById('produto-foto').files[0];
    
    // Validar campos
    if (!status || !sku || !descricao || !estoqueInicial || !estoqueMinimo || !linha) {
        mostrarNotificacao("Preencha todos os campos obrigatórios", "danger");
        return;
    }
    
    // Verificar se SKU já existe
    if (produtos.some(p => p.sku === sku)) {
        mostrarNotificacao("SKU já cadastrado", "danger");
        return;
    }
    
    // Criar objeto de produto
    const produto = {
        status: status,
        sku: sku,
        descricao: descricao,
        quantidadeAtual: estoqueInicial,
        minimoIdeal: estoqueMinimo,
        linha: linha,
        ultimaAtualizacao: firebase.firestore.Timestamp.now()
    };
    
    // Se houver foto, fazer upload
    if (fotoFile) {
        const storageRef = storage.ref(`produtos/${sku}`);
        const uploadTask = storageRef.put(fotoFile);
        
        uploadTask.on('state_changed', 
            (snapshot) => {
                // Progresso do upload
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            }, 
            (error) => {
                // Erro no upload
                console.error("Erro ao fazer upload da foto: ", error);
                mostrarNotificacao("Erro ao fazer upload da foto", "danger");
            }, 
            () => {
                // Upload concluído
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    produto.fotoUrl = downloadURL;
                    salvarProduto(produto);
                });
            }
        );
    } else {
        // Sem foto, usar placeholder
        produto.fotoUrl = 'placeholder.png';
        salvarProduto(produto);
    }
}

// Função para salvar produto no Firestore
function salvarProduto(produto) {
    db.collection('produtos').add(produto)
        .then(() => {
            // Limpar formulário
            document.getElementById('form-produto').reset();
            
            // Recarregar dados
            carregarProdutos();
            
            // Mostrar notificação
            mostrarNotificacao("Produto cadastrado com sucesso", "success");
        })
        .catch(error => {
            console.error("Erro ao cadastrar produto: ", error);
            mostrarNotificacao("Erro ao cadastrar produto", "danger");
        });
}

// Função para editar produto
function editarProduto(id) {
    // Implementar lógica de edição
    mostrarNotificacao("Funcionalidade de edição em desenvolvimento", "info");
}

// Função para excluir produto
function excluirProduto(id) {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
        db.collection('produtos').doc(id).delete()
            .then(() => {
                // Recarregar dados
                carregarProdutos();
                
                // Mostrar notificação
                mostrarNotificacao("Produto excluído com sucesso", "success");
            })
            .catch(error => {
                console.error("Erro ao excluir produto: ", error);
                mostrarNotificacao("Erro ao excluir produto", "danger");
            });
    }
}

// Função para atualizar formulário de responsável
function atualizarFormularioResponsavel() {
    // Atualizar tabela de responsáveis cadastrados
    const tbody = document.querySelector('#tabela-responsaveis tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    responsaveis.forEach(responsavel => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${responsavel.nome}</td>
            <td>${responsavel.sobrenome}</td>
            <td>${responsavel.departamento}</td>
            <td class="${responsavel.status === 'ativo' ? 'status-ativo' : 'status-inativo'}">${responsavel.status}</td>
            <td>
                <button class="btn btn-sm btn-primary btn-action" onclick="editarResponsavel('${responsavel.id}')">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger btn-action" onclick="excluirResponsavel('${responsavel.id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

// Função para cadastrar responsável
function cadastrarResponsavel() {
    const nome = document.getElementById('responsavel-nome').value;
    const sobrenome = document.getElementById('responsavel-sobrenome').value;
    const departamento = document.getElementById('responsavel-departamento').value;
    const status = document.getElementById('responsavel-status').value;
    
    // Validar campos
    if (!nome || !sobrenome || !departamento || !status) {
        mostrarNotificacao("Preencha todos os campos", "danger");
        return;
    }
    
    // Criar objeto de responsável
    const responsavel = {
        nome: nome,
        sobrenome: sobrenome,
        departamento: departamento,
        status: status
    };
    
    // Salvar no Firestore
    db.collection('responsaveis').add(responsavel)
        .then(() => {
            // Limpar formulário
            document.getElementById('form-responsavel').reset();
            
            // Recarregar dados
            carregarResponsaveis();
            
            // Mostrar notificação
            mostrarNotificacao("Responsável cadastrado com sucesso", "success");
        })
        .catch(error => {
            console.error("Erro ao cadastrar responsável: ", error);
            mostrarNotificacao("Erro ao cadastrar responsável", "danger");
        });
}

// Função para editar responsável
function editarResponsavel(id) {
    // Implementar lógica de edição
    mostrarNotificacao("Funcionalidade de edição em desenvolvimento", "info");
}

// Função para excluir responsável
function excluirResponsavel(id) {
    if (confirm("Tem certeza que deseja excluir este responsável?")) {
        db.collection('responsaveis').doc(id).delete()
            .then(() => {
                // Recarregar dados
                carregarResponsaveis();
                
                // Mostrar notificação
                mostrarNotificacao("Responsável excluído com sucesso", "success");
            })
            .catch(error => {
                console.error("Erro ao excluir responsável: ", error);
                mostrarNotificacao("Erro ao excluir responsável", "danger");
            });
    }
}

// Função para atualizar formulário de linha
function atualizarFormularioLinha() {
    // Atualizar tabela de linhas cadastradas
    const tbody = document.querySelector('#tabela-linhas tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    linhas.forEach(linha => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${linha.codigo}</td>
            <td>${linha.nome}</td>
            <td>
                <button class="btn btn-sm btn-primary btn-action" onclick="editarLinha('${linha.id}')">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger btn-action" onclick="excluirLinha('${linha.id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

// Função para cadastrar linha
function cadastrarLinha() {
    const codigo = document.getElementById('linha-codigo').value;
    const nome = document.getElementById('linha-nome').value;
    
    // Validar campos
    if (!codigo || !nome) {
        mostrarNotificacao("Preencha todos os campos", "danger");
        return;
    }
    
    // Verificar se código já existe
    if (linhas.some(l => l.codigo === codigo)) {
        mostrarNotificacao("Código de linha já cadastrado", "danger");
        return;
    }
    
    // Criar objeto de linha
    const linha = {
        codigo: codigo,
        nome: nome
    };
    
    // Salvar no Firestore
    db.collection('linhas').add(linha)
        .then(() => {
            // Limpar formulário
            document.getElementById('form-linha').reset();
            
            // Recarregar dados
            carregarLinhas();
            
            // Mostrar notificação
            mostrarNotificacao("Linha cadastrada com sucesso", "success");
        })
        .catch(error => {
            console.error("Erro ao cadastrar linha: ", error);
            mostrarNotificacao("Erro ao cadastrar linha", "danger");
        });
}

// Função para editar linha
function editarLinha(id) {
    // Implementar lógica de edição
    mostrarNotificacao("Funcionalidade de edição em desenvolvimento", "info");
}

// Função para excluir linha
function excluirLinha(id) {
    if (confirm("Tem certeza que deseja excluir esta linha?")) {
        db.collection('linhas').doc(id).delete()
            .then(() => {
                // Recarregar dados
                carregarLinhas();
                
                // Mostrar notificação
                mostrarNotificacao("Linha excluída com sucesso", "success");
            })
            .catch(error => {
                console.error("Erro ao excluir linha: ", error);
                mostrarNotificacao("Erro ao excluir linha", "danger");
            });
    }
}

// Função para exportar dados
function exportarDados() {
    // Implementar lógica de exportação
    mostrarNotificacao("Funcionalidade de exportação em desenvolvimento", "info");
}

// Função para exportar movimentações
function exportarMovimentacoes() {
    // Implementar lógica de exportação
    mostrarNotificacao("Funcionalidade de exportação em desenvolvimento", "info");
}

// Função para mostrar notificação
function mostrarNotificacao(mensagem, tipo) {
    const toastElement = document.getElementById('notificacao-estoque');
    const mensagemElement = document.getElementById('mensagem-notificacao');
    
    if (!toastElement || !mensagemElement) return;
    
    // Definir mensagem
    mensagemElement.textContent = mensagem;
    
    // Definir classe de acordo com o tipo
    toastElement.className = `toast show bg-${tipo}`;
    
    // Mostrar notificação
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
    
    // Esconder após 5 segundos
    setTimeout(() => {
        toast.hide();
    }, 5000);
}