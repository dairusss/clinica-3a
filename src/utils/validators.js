// Utilitários de validação
const validarCPF = (cpf) => {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/\D/g, '');

    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) {
        return false;
    }

    // Verifica se todos os dígitos são iguais (CPF inválido)
    if (/^(\d)\1+$/.test(cpf)) {
        return false;
    }

    // Calcula primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    let digito1 = resto === 10 ? 0 : resto;

    // Calcula segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    let digito2 = resto === 10 ? 0 : resto;

    // Verifica se os dígitos calculados conferem com os informados
    return parseInt(cpf.charAt(9)) === digito1 && parseInt(cpf.charAt(10)) === digito2;
};

// Validação customizada para express-validator
const cpfValidator = (value) => {
    if (!value) return true; // CPF opcional

    const cpfLimpo = value.replace(/\D/g, '');

    if (cpfLimpo.length !== 11) {
        throw new Error('CPF deve ter 11 dígitos');
    }

    if (!validarCPF(cpfLimpo)) {
        throw new Error('CPF inválido');
    }

    return true;
};

module.exports = {
    validarCPF,
    cpfValidator
};