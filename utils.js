// Função para formatar data
function formatarData(timestamp) {
    if (!timestamp) return 'Não informada';
    
    const data = new Date(timestamp.seconds * 1000);
    return data.toLocaleDateString();
}

// Função para formatar data e hora
function formatarDataHora(timestamp) {
    if (!timestamp) return 'Não informada';
    
    const data = new Date(timestamp.seconds * 1000);
    return data.toLocaleString();
}

// Função para validar SKU
function validarSKU(sku) {
    // Implementar validação de SKU
    return sku.length >= 3 && sku.length <= 20;
}

// Função para validar quantidade
function validarQuantidade(quantidade) {
    return !isNaN(quantidade) && quantidade >= 0;
}

// Função para gerar relatório de estoque
function gerarRelatorioEstoque() {
    // Implementar geração de relatório
    console.log("Gerando relatório de estoque...");
}

// Função para enviar notificação por email
function enviarNotificacaoEmail(destinatario, assunto, mensagem) {
    // Implementar envio de email
    console.log(`Enviando email para ${destinatario}: ${assunto} - ${mensagem}`);
}