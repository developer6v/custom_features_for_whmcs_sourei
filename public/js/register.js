// JavaScript para Sistema de Passos (Step-by-Step) - VERSÃO CORRIGIDA

class StepByStepForm {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 3;
        this.formData = {};
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupFormStructure();
            this.setupEventListeners();
            this.setupValidation();
            this.setupInputMasks();
            this.showStep(1);
        });
    }

    setupFormStructure() {
        // Criar estrutura do header com indicador de progresso
        this.createStepHeader();
        
        // Reorganizar campos em passos
        this.organizeFieldsIntoSteps();
        
        // Criar navegação
        this.createNavigation();
        
        // Ajustar container
        this.adjustContainer();
    }

    createStepHeader() {
        const container = document.querySelector('.login-container');
        if (!container) return;

        const header = document.createElement('div');
        header.className = 'step-header';
        header.innerHTML = `
            <div class="progress-indicator">
                <div class="progress-line" id="progressLine"></div>
                <div class="step-indicator active" data-step="1">1</div>
                <div class="step-indicator" data-step="2">2</div>
                <div class="step-indicator" data-step="3">3</div>
            </div>
            <h1 class="step-title" id="stepTitle">Dados Pessoais</h1>
            <p class="step-subtitle" id="stepSubtitle">Preencha suas informações básicas</p>
        `;

        container.insertBefore(header, container.firstChild);
    }

    organizeFieldsIntoSteps() {
        const form = document.querySelector('.loginForm');
        if (!form) return;

        // Criar container dos passos
        const stepsContainer = document.createElement('div');
        stepsContainer.className = 'steps-container';

        // Passo 1: Dados Pessoais
        const step1 = this.createStep(1, [
            this.getFieldGroup('inputFirstName', 'Nome Completo', 'Digite seu nome completo'),
            this.createTwoColumnRow([
                this.getFieldGroup('inputPhone', 'Telefone', 'Seu número'),
                this.getFieldGroup('inputEmail', 'E-mail', 'Insira seu e-mail')
            ]),
            this.createTwoColumnRow([
                this.getFieldGroup('inputCompanyName', 'CPF', 'Coloque seu CPF'),
                this.createCnpjField() // CORREÇÃO: Criar campo CNPJ separado
            ]),
            this.createDateField('inputBirthDate', 'Data de Nascimento', 'dd/mm/aaaa'), // CORREÇÃO: Máscara de data
        ]);

        // Passo 2: Endereço
        const step2 = this.createStep(2, [
            this.getFieldGroup('inputAddress1', 'Endereço', 'Rua, número'),
            this.getFieldGroup('inputAddress2', 'Complemento', 'Apartamento, bloco (opcional)'),
            this.createTwoColumnRow([
                this.getFieldGroup('inputCity', 'Cidade', 'Sua cidade'),
                this.getFieldGroup('inputPostcode', 'CEP', '00000-000')
            ]),
            this.createTwoColumnRow([
                this.getFieldGroup('inputCountry', 'País', '', 'select'),
                this.getFieldGroup('stateinput', 'Estado', 'Seu estado')
            ])
        ]);

        // Passo 3: Senha e Finalização
        const step3 = this.createStep(3, [
            this.getPasswordFields(),
            this.getTermsAndConditions()
        ]);

        stepsContainer.appendChild(step1);
        stepsContainer.appendChild(step2);
        stepsContainer.appendChild(step3);

        // Substituir conteúdo do formulário
        const personalInfo = document.getElementById('personalInformation');
        if (personalInfo) {
            personalInfo.innerHTML = '';
            personalInfo.appendChild(stepsContainer);
        }
    }

    createStep(stepNumber, fields) {
        const step = document.createElement('div');
        step.className = `form-step step-${stepNumber}`;
        step.setAttribute('data-step', stepNumber);

        const content = document.createElement('div');
        content.className = 'step-content';

        fields.forEach(field => {
            if (field) content.appendChild(field);
        });

        step.appendChild(content);
        return step;
    }

    getFieldGroup(fieldId, label, placeholder, type = 'input') {
        const originalField = document.getElementById(fieldId);
        if (!originalField && fieldId !== 'inputBirthDate') return null; // Permitir campo de data mesmo sem original

        const group = document.createElement('div');
        group.className = 'form-group';

        const labelEl = document.createElement('label');
        labelEl.setAttribute('for', fieldId);
        labelEl.className = 'label-required';
        labelEl.textContent = label;

        let inputEl;
        if (type === 'select') {
            inputEl = originalField.cloneNode(true);
        } else {
            inputEl = document.createElement('input');
            inputEl.type = originalField ? originalField.type || 'text' : 'text';
            inputEl.id = fieldId;
            inputEl.name = originalField ? originalField.name : fieldId.replace('input', '').toLowerCase();
            inputEl.className = 'form-control';
            inputEl.placeholder = placeholder;
            inputEl.value = originalField ? originalField.value || '' : '';
            if (originalField && originalField.required) inputEl.required = true;
        }

        group.appendChild(labelEl);
        group.appendChild(inputEl);

        // Remover campo original se existir
        if (originalField) {
            const originalGroup = originalField.closest('.form-group, .row');
            if (originalGroup) originalGroup.remove();
        }

        return group;
    }

    createTwoColumnRow(fields) {
        const row = document.createElement('div');
        row.className = 'row';

        fields.forEach(field => {
            if (field) {
                const col = document.createElement('div');
                col.className = 'col-md-6';
                col.appendChild(field);
                row.appendChild(col);
            }
        });

        return row;
    }

    // CORREÇÃO: Campo de data com máscara correta
    createDateField(fieldId, label, placeholder) {
        const group = document.createElement('div');
        group.className = 'form-group';

        const labelEl = document.createElement('label');
        labelEl.setAttribute('for', fieldId);
        labelEl.className = 'label-required';
        labelEl.textContent = label;

        const inputEl = document.createElement('input');
        inputEl.type = 'text'; // CORREÇÃO: Usar text em vez de date para aplicar máscara
        inputEl.id = fieldId;
        inputEl.name = 'birth_date';
        inputEl.className = 'form-control';
        inputEl.placeholder = placeholder;
        inputEl.required = true;
        inputEl.maxLength = 10; // dd/mm/aaaa

        group.appendChild(labelEl);
        group.appendChild(inputEl);

        return group;
    }

    // CORREÇÃO: Criar campo CNPJ separado
    createCnpjField() {
        const group = document.createElement('div');
        group.className = 'form-group';

        const labelEl = document.createElement('label');
        labelEl.setAttribute('for', 'inputCnpj');
        labelEl.textContent = 'CNPJ (opcional)';

        const inputEl = document.createElement('input');
        inputEl.type = 'text';
        inputEl.id = 'inputCnpj';
        inputEl.name = 'cnpj';
        inputEl.className = 'form-control';
        inputEl.placeholder = 'Digite seu CNPJ (opcional)';
        inputEl.style.display = 'none'; // Inicialmente oculto

        group.appendChild(labelEl);
        group.appendChild(inputEl);
        
        // Ocultar grupo inicialmente
        group.style.display = 'none';
        group.id = 'cnpjGroup';

        return group;
    }

    createCheckboxField() {
        const container = document.createElement('div');
        container.className = 'checkbox-container';
        container.innerHTML = `
            <input type="checkbox" id="pessoaJuridica" name="pessoa_juridica">
            <label for="pessoaJuridica">Pessoa Jurídica (CNPJ)</label>
        `;
        return container;
    }

    getPasswordFields() {
        const container = document.createElement('div');
        container.className = 'password-section';

        // Buscar campos de senha existentes
        const password1 = document.getElementById('inputNewPassword1');
        const password2 = document.getElementById('inputNewPassword2');

        if (password1 && password2) {
            const group1 = password1.closest('.form-group');
            const group2 = password2.closest('.form-group');

            if (group1) container.appendChild(group1.cloneNode(true));
            if (group2) container.appendChild(group2.cloneNode(true));
        } else {
            // Criar campos de senha se não existirem
            container.innerHTML = `
                <div class="form-group">
                    <label for="inputPassword" class="label-required">Senha</label>
                    <input type="password" id="inputPassword" name="password" class="form-control" placeholder="Crie uma senha segura" required>
                    <div class="password-strength">
                        <div class="progress">
                            <div class="progress-bar" role="progressbar"></div>
                        </div>
                        <small class="text-muted">Força da senha</small>
                    </div>
                </div>
                <div class="form-group">
                    <label for="inputPasswordConfirm" class="label-required">Confirmar Senha</label>
                    <input type="password" id="inputPasswordConfirm" name="password_confirm" class="form-control" placeholder="Confirme sua senha" required>
                </div>
            `;
        }

        return container;
    }

    getTermsAndConditions() {
        const container = document.createElement('div');
        container.className = 'checkbox-container';
        container.innerHTML = `
            <input type="checkbox" id="acceptTerms" name="accept_terms" checked required>
            <label for="acceptTerms">Aceito os <a href="#" target="_blank">termos de uso</a> e <a href="#" target="_blank">política de privacidade</a></label>
        `;
        return container;
    }

    createNavigation() {
        const form = document.querySelector('.loginForm');
        if (!form) return;

        const navigation = document.createElement('div');
        navigation.className = 'step-navigation';
        navigation.innerHTML = `
            <button type="button" class="btn-step btn-prev" id="prevBtn" style="display: none;">Anterior</button>
            <button type="button" class="btn-step btn-next" id="nextBtn">Próximo</button>
        `;

        form.appendChild(navigation);

        // Remover botão de submit original
        const originalSubmit = form.querySelector('button[type="submit"]');
        if (originalSubmit) originalSubmit.remove();
    }

    adjustContainer() {
        const container = document.querySelector('.login-container');
        if (container) {
            container.style.maxWidth = '600px';
        }
    }

    setupEventListeners() {
        // Botões de navegação
        document.addEventListener('click', (e) => {
            if (e.target.id === 'nextBtn') {
                this.nextStep();
            } else if (e.target.id === 'prevBtn') {
                this.prevStep();
            }
        });

        // CORREÇÃO: Checkbox pessoa jurídica para mostrar/ocultar campo CNPJ
        document.addEventListener('change', (e) => {
            if (e.target.id === 'pessoaJuridica') {
                this.toggleCnpjField(e.target.checked);
            }
        });

        // Enter para próximo passo
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                const activeElement = document.activeElement;
                if (activeElement && activeElement.classList.contains('form-control')) {
                    e.preventDefault();
                    this.nextStep();
                }
            }
        });
    }

    setupValidation() {
        // Validação em tempo real
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('form-control')) {
                this.validateField(e.target);
            }
        });

        document.addEventListener('blur', (e) => {
            if (e.target.classList.contains('form-control')) {
                this.validateField(e.target);
            }
        });
    }

    // CORREÇÃO: Máscaras de input corrigidas
    setupInputMasks() {
        document.addEventListener('input', (e) => {
            const field = e.target;
            
            if (field.id === 'inputCompanyName') {
                this.applyCpfMask(field); // Sempre CPF para este campo
            } else if (field.id === 'inputCnpj') {
                this.applyCnpjMask(field); // CNPJ para o campo separado
            } else if (field.id === 'inputPhone') {
                this.applyPhoneMask(field);
            } else if (field.id === 'inputPostcode') {
                this.applyCepMask(field);
            } else if (field.id === 'inputBirthDate') {
                this.applyDateMask(field); // CORREÇÃO: Máscara de data corrigida
            }
        });
    }

    // CORREÇÃO: Máscara de data funcionando
    applyDateMask(field) {
        let value = field.value.replace(/\D/g, ''); // Remove tudo que não é dígito
        
        // Aplica a máscara dd/mm/aaaa
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2);
        }
        if (value.length >= 5) {
            value = value.substring(0, 5) + '/' + value.substring(5, 9);
        }
        
        field.value = value;
    }

    showStep(stepNumber) {
        // Ocultar todos os passos
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active', 'slide-in-left', 'slide-in-right');
        });

        // Mostrar passo atual
        const currentStepEl = document.querySelector(`.form-step.step-${stepNumber}`);
        if (currentStepEl) {
            currentStepEl.classList.add('active');
            
            // Animação baseada na direção
            if (stepNumber > this.currentStep) {
                currentStepEl.classList.add('slide-in-right');
            } else if (stepNumber < this.currentStep) {
                currentStepEl.classList.add('slide-in-left');
            }
        }

        this.currentStep = stepNumber;
        this.updateProgressIndicator();
        this.updateNavigation();
        this.updateStepInfo();
    }

    updateProgressIndicator() {
        // Atualizar indicadores
        document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
            const stepNum = index + 1;
            indicator.classList.remove('active', 'completed');
            
            if (stepNum < this.currentStep) {
                indicator.classList.add('completed');
            } else if (stepNum === this.currentStep) {
                indicator.classList.add('active');
            }
        });

        // Atualizar linha de progresso
        const progressLine = document.getElementById('progressLine');
        if (progressLine) {
            const progress = ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
            progressLine.style.width = `${progress}%`;
        }
    }

    updateNavigation() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        if (prevBtn) {
            prevBtn.style.display = this.currentStep > 1 ? 'inline-flex' : 'none';
        }

        if (nextBtn) {
            if (this.currentStep === this.totalSteps) {
                nextBtn.textContent = 'Finalizar Cadastro';
                nextBtn.className = 'btn-step btn-next btn-submit';
            } else {
                nextBtn.textContent = 'Próximo';
                nextBtn.className = 'btn-step btn-next';
            }
        }
    }

    updateStepInfo() {
        const titles = [
            'Dados Pessoais',
            'Endereço',
            'Senha e Finalização'
        ];

        const subtitles = [
            'Preencha suas informações básicas',
            'Informe seu endereço completo',
            'Crie uma senha segura para sua conta'
        ];

        const titleEl = document.getElementById('stepTitle');
        const subtitleEl = document.getElementById('stepSubtitle');

        if (titleEl) titleEl.textContent = titles[this.currentStep - 1];
        if (subtitleEl) subtitleEl.textContent = subtitles[this.currentStep - 1];
    }

    nextStep() {
        if (!this.validateCurrentStep()) {
            return;
        }

        if (this.currentStep < this.totalSteps) {
            this.showStep(this.currentStep + 1);
        } else {
            this.submitForm();
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.showStep(this.currentStep - 1);
        }
    }

    validateCurrentStep() {
        const currentStepEl = document.querySelector(`.form-step.step-${this.currentStep}`);
        if (!currentStepEl) return false;

        const requiredFields = currentStepEl.querySelectorAll('input[required], select[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        // Validações específicas
        if (this.currentStep === 3) {
            isValid = this.validatePasswords() && isValid;
        }

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remover mensagens de erro anteriores
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) existingError.remove();

        // Validação de campo obrigatório
        if (field.required && !value) {
            isValid = false;
            errorMessage = 'Este campo é obrigatório';
        }

        // Validações específicas por tipo
        if (value && field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'E-mail inválido';
            }
        }

        // Validação de data
        if (value && field.id === 'inputBirthDate') {
            const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
            if (!dateRegex.test(value)) {
                isValid = false;
                errorMessage = 'Data inválida (use dd/mm/aaaa)';
            }
        }

        // Aplicar classes visuais
        field.classList.remove('error', 'success');
        if (!isValid) {
            field.classList.add('error');
            
            // Adicionar mensagem de erro
            const errorEl = document.createElement('span');
            errorEl.className = 'error-message';
            errorEl.textContent = errorMessage;
            field.parentNode.appendChild(errorEl);
        } else if (value) {
            field.classList.add('success');
        }

        return isValid;
    }

    validatePasswords() {
        const password1 = document.getElementById('inputPassword') || document.getElementById('inputNewPassword1');
        const password2 = document.getElementById('inputPasswordConfirm') || document.getElementById('inputNewPassword2');

        if (!password1 || !password2) return true;

        let isValid = true;

        if (password1.value !== password2.value) {
            password2.classList.add('error');
            
            const errorEl = document.createElement('span');
            errorEl.className = 'error-message';
            errorEl.textContent = 'As senhas não coincidem';
            password2.parentNode.appendChild(errorEl);
            
            isValid = false;
        }

        return isValid;
    }

    // CORREÇÃO: Função para mostrar/ocultar campo CNPJ
    toggleCnpjField(showCnpj) {
        const cnpjGroup = document.getElementById('cnpjGroup');
        const cpfField = document.getElementById('inputCompanyName');
        const cpfLabel = document.querySelector('label[for="inputCompanyName"]');

        if (cnpjGroup) {
            if (showCnpj) {
                cnpjGroup.style.display = 'block';
                if (cpfField) cpfField.required = false; // CPF não obrigatório se CNPJ está sendo usado
                if (cpfLabel) cpfLabel.textContent = 'CPF (opcional)';
            } else {
                cnpjGroup.style.display = 'none';
                if (cpfField) cpfField.required = true; // CPF obrigatório se CNPJ não está sendo usado
                if (cpfLabel) cpfLabel.textContent = 'CPF';
                // Limpar campo CNPJ
                const cnpjField = document.getElementById('inputCnpj');
                if (cnpjField) cnpjField.value = '';
            }
        }
    }

    // CORREÇÃO: Máscara CPF separada
    applyCpfMask(field) {
        let value = field.value.replace(/\D/g, '');
        
        // Máscara CPF: 000.000.000-00
        if (value.length <= 11) {
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        }

        field.value = value;
    }

    // CORREÇÃO: Máscara CNPJ separada
    applyCnpjMask(field) {
        let value = field.value.replace(/\D/g, '');
        
        // Máscara CNPJ: 00.000.000/0000-00
        if (value.length <= 14) {
            value = value.replace(/^(\d{2})(\d)/, '$1.$2');
            value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
            value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
            value = value.replace(/(\d{4})(\d)/, '$1-$2');
        }

        field.value = value;
    }

    applyPhoneMask(field) {
        let value = field.value.replace(/\D/g, '');

        // Máscara telefone: (00) 00000-0000
        if (value.length <= 11) {
            value = value.replace(/^(\d{2})(\d)/, '($1) $2');
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
        }

        field.value = value;
    }

    applyCepMask(field) {
        let value = field.value.replace(/\D/g, '');

        // Máscara CEP: 00000-000
        if (value.length <= 8) {
            value = value.replace(/^(\d{5})(\d)/, '$1-$2');
        }

        field.value = value;
    }

    submitForm() {
        const form = document.querySelector('.loginForm');
        if (form) {
            // Mostrar loading
            const submitBtn = document.getElementById('nextBtn');
            if (submitBtn) {
                submitBtn.classList.add('loading');
                submitBtn.innerHTML = '<div class="spinner"></div>';
            }

            // Submeter formulário original
            form.submit();
        }
    }
}

// Função para gerar uma senha aleatória
function generateRandomPassword(length = 8) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}

// Função para preencher os campos de senha
function fillGeneratedPassword() {
    const password = generateRandomPassword(12);

    // Preenche os campos de senha
    const passwordField1 = document.getElementById('inputNewPassword1') || document.getElementById('inputPassword');
    const passwordField2 = document.getElementById('inputNewPassword2') || document.getElementById('inputPasswordConfirm');

    if (passwordField1 && passwordField2) {
        passwordField1.value = password;
        passwordField2.value = password;
    }
}

// Event listener para botão de gerar senha
document.addEventListener('DOMContentLoaded', function() {
    const generatePasswordButton = document.querySelector('.generate-password');
    if (generatePasswordButton) {
        generatePasswordButton.addEventListener('click', function() {
            fillGeneratedPassword();
        });
    }
});

// Inicializar o sistema de passos
new StepByStepForm();
