class StepByStepForm {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 3;
        this.formData = {};
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                this.setupFormStructure();
                this.setupEventListeners();
                this.setupValidation();
                this.setupInputMasks();
                this.showStep(1);
                this.setupCepFieldListener();
                this.toggleCnpjField(false);
            }, 200);
        });
    }

    setupFormStructure() {
        this.createStepHeader();
        this.organizeFieldsIntoSteps();
        this.createNavigation();
        this.adjustContainer();
    }

    findMoveableGroup(elementId) {
        const el = document.getElementById(elementId);
        if (!el) return null;
        return el.closest('.col-md-6') || el.closest('.form-group');
    }

    createStepHeader() {
        const container = document.querySelector('.login-wrapper');
        if (container) {
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
    }

    organizeFieldsIntoSteps() {
        const form = document.querySelector('.loginForm');
        if (!form) return;

        const stepsContainer = document.createElement('div');
        stepsContainer.className = 'steps-container';

        // Passo 1: Dados Pessoais
        const step1 = this.createStep(1, [
            this.createTwoColumnRow([this.findMoveableGroup('inputFirstName'), this.findMoveableGroup('inputLastName')]),
            this.createTwoColumnRow([this.findMoveableGroup('inputPhone'), this.findMoveableGroup('inputEmail')]),
            this.createTwoColumnRow([this.findMoveableGroup('customfield2'), this.findMoveableGroup('customfield3')]),
            this.createCheckboxField(),
            this.createTwoColumnRow([this.findMoveableGroup('customfield5'), this.findMoveableGroup('inputCompanyName')]),
        ]);

        // Passo 2: Endereço
        const step2 = this.createStep(2, [
            this.createTwoColumnRow([this.findMoveableGroup('inputPostcode'), this.findMoveableGroup('inputCountry')]),
            this.createTwoColumnRow([this.findMoveableGroup('inputAddress1'), this.findMoveableGroup('customfield18')]),
            this.createTwoColumnRow([this.findMoveableGroup('inputAddress2'), this.findMoveableGroup('customfield19')]),
            this.createTwoColumnRow([this.findMoveableGroup('inputCity'), this.findMoveableGroup('stateselect')])
        ]);

        
        const address2Group = this.findMoveableGroup('inputAddress2');
        if (address2Group) {
            const label = address2Group.querySelector('label');
            if (label) label.textContent = 'Bairro';
        }


        // --- CORREÇÃO APLICADA AQUI ---
        // Passo 3: Senha e Finalização
        // Em vez de pegar só o container, pegamos a seção inteira que o envolve.
        // Passo 3: Senha e Finalização
        const passwordSection = document.getElementById('containerNewUserSecurity'); // já é a section
        const termsSection = document.querySelector('input[name="accepttos"]').closest('.section');
        const mailingListSection = document.querySelector('input[name="marketingoptin"]').closest('.section');

        const step3 = this.createStep(3, [
            passwordSection,
            mailingListSection,
            termsSection
        ]);


        stepsContainer.appendChild(step1);
        stepsContainer.appendChild(step2);
        stepsContainer.appendChild(step3);

        // Limpeza de elementos que não serão mais exibidos no fluxo original
        const originalSectionsContainer = document.getElementById('containerNewUserSignup');
        if (originalSectionsContainer) {
            originalSectionsContainer.innerHTML = ''; // Limpa o container original
            originalSectionsContainer.appendChild(stepsContainer); // Adiciona a nova estrutura de passos
        }
    }

    createStep(stepNumber, elements) {
        const step = document.createElement('div');
        step.className = `form-step step-${stepNumber}`;
        step.setAttribute('data-step', stepNumber);
        const content = document.createElement('div');
        content.className = 'step-content';
        elements.forEach(element => {
            if (element) content.appendChild(element);
        });
        step.appendChild(content);
        return step;
    }

    createTwoColumnRow(elements) {
        const row = document.createElement('div');
        row.className = 'row';
        elements.forEach(element => {
            if (element) row.appendChild(element);
        });
        return row;
    }
    
    createCheckboxField() {
        const container = document.createElement('div');
        container.className = 'form-group col-md-12';
        container.innerHTML = `
            <div class="checkbox">
                <label>
                    <input type="checkbox" id="pessoaJuridica" name="pessoa_juridica" style="margin-right: 5px;">
                    Sou Pessoa Jurídica (usar CNPJ)
                </label>
            </div>
        `;
        return container;
    }

    createNavigation() {
        const form = document.querySelector('.loginForm');
        if (!form) return;
        const navigation = document.createElement('div');
        navigation.className = 'step-navigation';
        navigation.innerHTML = `
            <button type="button" class="btn btn-lg btn-default btn-prev" id="prevBtn" style="display: none;">Anterior</button>
            <button type="button" class="btn btn-lg btn-primary btn-next" id="nextBtn">Próximo</button>
        `;
        form.appendChild(navigation);
        const originalSubmit = form.querySelector('button[type="submit"]');
        if (originalSubmit) originalSubmit.style.display = 'none';
    }

    adjustContainer() {
        const container = document.querySelector('.login-wrapper');
        if (container) container.style.maxWidth = '700px';
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'nextBtn') this.nextStep();
            if (e.target.id === 'prevBtn') this.prevStep();
        });
        document.addEventListener('change', (e) => {
            if (e.target.id === 'pessoaJuridica') this.toggleCnpjField(e.target.checked);
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                const activeElement = document.activeElement;
                if (activeElement && activeElement.tagName === 'INPUT' && activeElement.type !== 'checkbox') {
                    e.preventDefault();
                    this.nextStep();
                }
            }
        });
    }

toggleCnpjField(showCnpj) {
    const cnpjGroup = this.findMoveableGroup('customfield5');
    const cpfGroup = this.findMoveableGroup('customfield2');
    const companyNameGroup = this.findMoveableGroup('inputCompanyName');

    const cpfField = document.getElementById('customfield2');
    const cnpjField = document.getElementById('customfield5');
    const companyNameField = document.getElementById('inputCompanyName');

    const cnpjLabel = document.querySelector('label[for="customfield5"]');
    const companyNameLabel = document.querySelector('label[for="inputCompanyName"]');

    if (cnpjGroup && cpfGroup && cpfField && cnpjField && companyNameGroup && companyNameField) {
        if (showCnpj) {
            cnpjGroup.style.display = 'block';
            companyNameGroup.style.display = 'block';
            cpfGroup.style.display = 'none';

            cpfField.required = false;
            cnpjField.required = true;
            companyNameField.required = true;

            // 🔹 Ajusta labels (remove "(opcional)")
            if (cnpjLabel) cnpjLabel.textContent = 'CNPJ';
            if (companyNameLabel) companyNameLabel.textContent = 'Empresa';
        } else {
            cnpjGroup.style.display = 'none';
            companyNameGroup.style.display = 'none';
            cpfGroup.style.display = 'block';

            cpfField.required = true;
            cnpjField.required = false;
            companyNameField.required = false;

            cnpjField.value = '';
            companyNameField.value = '';

            // 🔹 Volta labels para opcionais
            if (cnpjLabel) cnpjLabel.textContent = 'CNPJ (opcional)';
            if (companyNameLabel) companyNameLabel.textContent = 'Empresa (opcional)';
        }
    }
}


    setupValidation() {
        document.querySelectorAll('.form-control').forEach(field => {
            field.addEventListener('input', () => this.validateField(field));
            field.addEventListener('blur', () => this.validateField(field));
        });
    }

    setupInputMasks() {
        document.addEventListener('input', (e) => {
            const field = e.target;
            if (field.id === 'customfield2') this.applyCpfMask(field);
            else if (field.id === 'customfield5') this.applyCnpjMask(field);
            else if (field.id === 'inputPostcode') this.applyCepMask(field);
            else if (field.id === 'customfield3') this.applyDateMask(field);
        });
    }

    setupCepFieldListener() {
        const cepField = document.getElementById('inputPostcode');
        const addressFields = [
            'inputAddress1',
            'inputAddress2',
            'customfield18',
            'customfield19',
            'inputCity',
            'stateselect'
        ];

        // 🔹 Esconde todos de início
        addressFields.forEach(id => {
            const group = this.findMoveableGroup(id);
            if (group) group.style.display = 'none';
        });

        if (cepField) {
            cepField.addEventListener('blur', (e) => {
                const cep = e.target.value.replace(/\D/g, '');
                if (cep.length === 8) {
                    this.fetchAddressFromCep(cep, addressFields);
                }
            });
        }
    }


    fetchAddressFromCep(cep, addressFields) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (data && !data.erro) {
                    document.getElementById('inputAddress1').value = data.logradouro || '';
                    document.getElementById('inputCity').value = data.localidade || '';
                    document.getElementById('inputAddress2').value = data.bairro || '';

                    const stateSelect = document.getElementById('stateselect');
                    if (stateSelect) stateSelect.value = data.uf || '';

                    // 🔹 Mostra todos os campos porque o CEP foi validado
                    addressFields.forEach(id => {
                        const group = this.findMoveableGroup(id);
                        if (group) group.style.display = 'block';
                    });
                } else {
                    alert("CEP não encontrado.");
                }
            })
            .catch(error => console.error('Erro ao buscar CEP:', error));
    }

    showStep(stepNumber) {
        document.querySelectorAll('.form-step').forEach(step => {
            step.style.display = 'none';
            step.classList.remove('active');
        });
        const currentStepEl = document.querySelector(`.form-step.step-${stepNumber}`);
        if (currentStepEl) {
            currentStepEl.style.display = 'block';
            currentStepEl.classList.add('active');
        }
        this.currentStep = stepNumber;
        this.updateProgressIndicator();
        this.updateNavigation();
        this.updateStepInfo();
    }

    updateProgressIndicator() {
        document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
            const stepNum = index + 1;
            indicator.classList.remove('active', 'completed');
            if (stepNum < this.currentStep) indicator.classList.add('completed');
            else if (stepNum === this.currentStep) indicator.classList.add('active');
        });
        const progressLine = document.getElementById('progressLine');
        if (progressLine) {
            const progress = ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
            progressLine.style.width = `${progress}%`;
        }
    }

    updateNavigation() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        if (prevBtn) prevBtn.style.display = this.currentStep > 1 ? 'inline-block' : 'none';
        if (nextBtn) {
            nextBtn.textContent = this.currentStep === this.totalSteps ? 'Finalizar Cadastro' : 'Próximo';
        }
    }

    updateStepInfo() {
        const titles = ['Dados Pessoais', 'Endereço', 'Segurança e Finalização'];
        const subtitles = ['Preencha suas informações básicas', 'Informe seu endereço completo', 'Crie uma senha e finalize seu cadastro'];
        const titleEl = document.getElementById('stepTitle');
        const subtitleEl = document.getElementById('stepSubtitle');
        if (titleEl) titleEl.textContent = titles[this.currentStep - 1];
        if (subtitleEl) subtitleEl.textContent = subtitles[this.currentStep - 1];
    }

    nextStep() {
        if (!this.validateCurrentStep()) return;
        if (this.currentStep < this.totalSteps) {
            this.showStep(this.currentStep + 1);
        } else {
            this.submitForm();
        }
    }

    prevStep() {
        if (this.currentStep > 1) this.showStep(this.currentStep - 1);
    }

    validateCurrentStep() {
        const currentStepEl = document.querySelector(`.form-step.step-${this.currentStep}`);
        if (!currentStepEl) return false;
        const fields = currentStepEl.querySelectorAll('input[required], select[required]');
        let isStepValid = true;
        fields.forEach(field => {
            if (field.offsetParent !== null) {
                if (!this.validateField(field)) isStepValid = false;
            }
        });
        return isStepValid;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        const group = field.closest('.form-group');
        if (!group) return true;
        const existingError = group.querySelector('.error-message');
        if (existingError) existingError.remove();
        field.classList.remove('error', 'success');
        if (field.required && !value) {
            isValid = false;
            errorMessage = 'Este campo é obrigatório.';
        } else if (value && field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            isValid = false;
            errorMessage = 'E-mail inválido.';
        } else if (value && field.id === 'customfield2' && value.replace(/\D/g, '').length < 11) {
            isValid = false;
            errorMessage = 'CPF inválido.';
        } else if (value && field.id === 'customfield5' && value.replace(/\D/g, '').length < 14) {
            isValid = false;
            errorMessage = 'CNPJ inválido.';
        }
        if (!isValid) {
            field.classList.add('error');
            const errorEl = document.createElement('span');
            errorEl.className = 'error-message';
            errorEl.textContent = errorMessage;
            errorEl.style.color = '#e53935';
            errorEl.style.fontSize = '0.8em';
            group.appendChild(errorEl);
        } else if (value) {
            field.classList.add('success');
        }
        return isValid;
    }

    submitForm() {
        const form = document.querySelector('.loginForm');
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) submitButton.click();
        else form.submit();
    }

    applyCpfMask(field) {
        let v = field.value.replace(/\D/g, '').slice(0, 11);
        v = v.replace(/(\d{3})(\d)/, '$1.$2');
        v = v.replace(/(\d{3})(\d)/, '$1.$2');
        v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        field.value = v;
    }

    applyCnpjMask(field) {
        let v = field.value.replace(/\D/g, '').slice(0, 14);
        v = v.replace(/^(\d{2})(\d)/, '$1.$2');
        v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        v = v.replace(/\.(\d{3})(\d)/, '.$1/$2');
        v = v.replace(/(\d{4})(\d)/, '$1-$2');
        field.value = v;
    }

    applyCepMask(field) {
        let v = field.value.replace(/\D/g, '').slice(0, 8);
        v = v.replace(/^(\d{5})(\d)/, '$1-$2');
        field.value = v;
    }

    applyDateMask(field) {
        let v = field.value.replace(/\D/g, '').slice(0, 8);
        if (v.length > 4) v = v.replace(/(\d{2})(\d{2})(\d{1,4})/, '$1/$2/$3');
        else if (v.length > 2) v = v.replace(/(\d{2})(\d{1,2})/, '$1/$2');
        field.value = v;
    }
}

new StepByStepForm();
