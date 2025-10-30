/*
 * MÓDULO DE VALIDAÇÃO DE FORMULÁRIO
 * validação em tempo real (no evento 'input')
 * e validação final (no evento 'submit').
 */

document.addEventListener("DOMContentLoaded", function() {

    const form = document.getElementById("cadastroForm");
    if (!form) return; // Se não achar o formulário, para o script

    const allRequiredInputs = form.querySelectorAll("input[required]");

    // Adiciona um "ouvinte" a CADA input obrigatório.
    // Este evento 'input' é disparado toda vez que o usuário digita uma tecla.
    allRequiredInputs.forEach(input => {
        input.addEventListener("input", function() {
            // Valida APENAS o campo que o usuário está digitando,
            // dando o feedback instantâneo de verde/vermelho.
            validateInput(input);
        });
    });

    // 1. OUVINTE DE EVENTO 'SUBMIT' 
    form.addEventListener("submit", function(event) {
        event.preventDefault(); 
        
        // A função 'validateForm' agora só precisa chamar 'validateInput'
        // para todos os campos de uma vez, para garantir.
        const isFormValid = validateForm();

        if (isFormValid) {
            showSuccessMessage(form);
        } else {
            console.log("Formulário contém erros.");
            // Foca no primeiro campo inválido para acessibilidade
            form.querySelector(".invalid input").focus();
        }
    });

    // 2. FUNÇÃO PRINCIPAL DE VALIDAÇÃO 
    function validateForm() {
        let isValid = true; // Assumimos que o formulário é válido
        
        allRequiredInputs.forEach(input => {
            // Se 'validateInput' retornar false (inválido) para QUALQUER campo,
            // o formulário inteiro é considerado inválido.
            if (!validateInput(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    // 3. FUNÇÃO DE VALIDAÇÃO DE CAMPO ÚNICO

    function validateInput(input) {
        const formGroup = input.parentElement;
        const errorMessageSpan = formGroup.querySelector(".error-message");

        // input.validity.valid usa as regras nativas (required, pattern, type="email")
        if (!input.validity.valid) {
            // O campo é INVÁLIDO

            let message = "";
            if (input.validity.valueMissing) {
                message = "Este campo é obrigatório.";
            } else if (input.validity.patternMismatch) {
                message = input.title || "Por favor, use o formato correto.";
            } else if (input.validity.typeMismatch) {
                message = "Por favor, insira um e-mail válido.";
            } else {
                message = "Este campo contém um erro.";
            }
            
            errorMessageSpan.textContent = message; 
            formGroup.classList.add("invalid");
            
            // Remove a classe "valid" (verde) caso ela exista
            formGroup.classList.remove("valid");

            return false; // Retorna que o campo é inválido

        } else {
            // O campo é VÁLIDO

            formGroup.classList.remove("invalid"); // Remove o vermelho
            formGroup.classList.add("valid");     // Adiciona o verde
            errorMessageSpan.textContent = "";  // Limpa a mensagem de erro

            return true; // Retorna que o campo é válido
        }
    }


    // 4. FUNÇÃO DE SUCESSO 
    function showSuccessMessage(form) {
        const formContainer = form.parentElement;
        form.style.display = "none";

        const successTemplate = `
            <div class="alert alert-success" role="alert">
                <h4 class="alert-heading">Cadastro Enviado com Sucesso!</h4>
                <p>Obrigado por se juntar à ONG Impacto Social. Entraremos em contato em breve.</p>
            </div>
        `;
        formContainer.innerHTML += successTemplate;

        // Adiciona estilos para o .alert-success 
        const style = document.createElement('style');
        style.innerHTML = `
            .alert-success {
                color: #155724; background-color: #d4edda; border-color: #c3e6cb;
                padding: var(--spacing-3); border-radius: var(--border-radius);
            }
            .alert-success .alert-heading { color: inherit; }
        `;
        document.head.appendChild(style);
    }
});