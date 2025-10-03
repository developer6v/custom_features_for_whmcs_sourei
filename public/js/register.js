class StepByStepForm {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 3;
        this.formData = {};
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            // Um pequeno atraso para garantir que outros scripts (como o intl-tel-input) já tenham rodado
            setTimeout(() => {
                this.setupFormStructure();
                this.setupEventListeners();
                this.setupValidation();
                this.setupInputMasks();
                this.showStep(1);
                this.setupCepFieldListener();
                this.toggleCnpjField(false); // Garante que o CNPJ comece oculto
            }, 200); // Aumentei um pouco o tempo para garantir
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
        // Prioriza a coluna (col-md-6) para manter a estrutura de duas colunas
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
            this.createTwoColumnRow([
                this.findMoveableGroup('inputFirstName'),
                this.findMoveableGroup('inputLastName')
            ]),
            this.createTwoColumnRow([
                this.findMoveableGroup('inputPhone'),
                this.findMoveableGroup('inputEmail')
            ]),
            this.createTwoColumnRow([
                this.findMoveableGroup('customfield2'), // CPF
                this.findMoveableGroup('customfield3')  // Data de Nascimento
            ]),
            this.createCheckboxField(),
            this.findMoveableGroup('customfield5') // CNPJ
        ]);

        // Passo 2: Endereço
        const step2 = this.createStep(2, [
             this.createTwoColumnRow([
                this.findMoveableGroup('inputPostcode'),
                this.findMoveableGroup('inputCountry')
            ]),
            this.createTwoColumnRow([
                this.findMoveableGroup('inputAddress1'),
                this.findMoveableGroup('customfield18') // Número
            ]),
             this.createTwoColumnRow([
                this.findMoveableGroup('inputAddress2'),
                this.findMoveableGroup('customfield19') // Complemento
            ]),
            this.createTwoColumnRow([
                this.findMoveableGroup('inputCity'),
                this.findMoveableGroup('stateselect')
            ]),
        ]);

        // Passo 3: Senha e Finalização
        const passwordSection = document.getElementById('containerNewUserSecurity');
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

        // Esconde elementos que não serão usados ou já foram movidos
        const companyName = this.findMoveableGroup('inputCompanyName');
        if(companyName) companyName.style.display = 'none';
        
        const additionalInfoTitle = document.querySelector('label[for="customfield2"]')?.closest('.section');
        if(additionalInfoTitle) additionalInfoTitle.style.display = 'none';

        // Substitui o conteúdo do formulário original pelos passos
        const personalInfoSection = document.getElementById('personalInformation')?.closest('.section');
        if (personalInfoSection) {
            const mainContainer = personalInfoSection.parentElement;
            mainContainer.innerHTML = ''; // Limpa o container
            mainContainer.appendChild(stepsContainer);
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
            if (element) {
                row.appendChild(element);
            }
        });
        return row;
    }
    
    createCheckboxField() {
        const container = document.createElement('div');
        container.className = 'checkbox-container form-group col-md-12';
        container.innerHTML = `
            <div class="checkbox">
                <label>
                    <input type="checkbox" id="pessoaJuridica" name="pessoa_juridica">
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
        if (container) {
            container.style.maxWidth = '700px';
        }
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'nextBtn') this.nextStep();
            if (e.target.id === 'prevBtn') this.prevStep();
        });
        document.addEventListener('change', (e) => {
            if (e.target.id === 'pessoaJuridica') {
                this.toggleCnpjField(e.target.checked);
            }
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
        const cpfField = document.getElementById('customfield2');
        const cnpjField = document.getElementById('customfield5');

        if (cnpjGroup && cpfGroup && cpfField && cnpjField) {
            if (showCnpj) {
                cnpjGroup.style.display = 'block';
                cpfGroup.style.display = 'none';
                cpfField.required = false;
                cnpjField.required = true;
            } else {
                cnpjGroup.style.display = 'none';
                cpfGroup.style.display = 'block';
                cpfField.required = true;
                cnpjField.required = false;
                cnpjField.value = '';
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
        if (cepField) {
            cepField.addEventListener('blur', (e) => {
                const cep = e.target.value.replace(/\D/g, '');
                if (cep.length === 8) {
                    this.fetchAddressFromCep(cep);
                }
            });
        }
    }

    fetchAddressFromCep(cep) {
        fetch(`https://viacep.com.br/ws/${cep}/json/` )
            .then(response => response.json())
            .then(data => {
                if (data && !data.erro) {
                    document.getElementById('inputAddress1').value = data.logradouro || '';
                    document.getElementById('inputCity').value = data.localidade || '';
                    const stateSelect = document.getElementById('stateselect');
                    if (stateSelect) stateSelect.value = data.uf || '';
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
            if (stepNum < this.currentStep) {
                indicator.classList.add('completed');
            } else if (stepNum === this.currentStep) {
                indicator.classList.add('active');
            }
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
        const originalSubmit = document.querySelector('.loginForm button[type="submit"]');

        if (prevBtn) prevBtn.style.display = this.currentStep > 1 ? 'inline-block' : 'none';

        if (nextBtn) {
            if (this.currentStep === this.totalSteps) {
                nextBtn.textContent = 'Finalizar Cadastro';
            } else {
                nextBtn.textContent = 'Próximo';
            }
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

        const fields = currentStepEl.querySelectorAll('input[required], select[required]');
        let isStepValid = true;

        fields.forEach(field => {
            // Apenas valida campos que estão visíveis
            if (field.offsetParent !== null) {
                if (!this.validateField(field)) {
                    isStepValid = false;
                }
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
        if (submitButton) {
            // Clica no botão de submit original para disparar qualquer evento do WHMCS
            submitButton.click();
        } else {
            // Fallback caso o botão não seja encontrado
            form.submit();
        }
    }

    applyCpfMask(field) {
        let value = field.value.replace(/\D/g, '').slice(0, 11);
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        field.value = value;
    }

    applyCnpjMask(field) {
        let value = field.value.replace(/\D/g, '').slice(0, 14);
        value = value.replace(/^(\d{2})(\d)/, '$1.$2');
        value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
        value = value.replace(/(\d{4})(\d)/, '$1-$2');
        field.value = value;
    }

    applyCepMask(field) {
        let value = field.value.replace(/\D/g, '').slice(0, 8);
        value = value.replace(/^(\d{5})(\d)/, '$1-$2');
        field.value = value;
    }

    applyDateMask(field) {
        let value = field.value.replace(/\D/g, '').slice(0, 8);
        if (value.length > 4) {
            value = value.replace(/(\d{2})(\d{2})(\d{1,4})/, '$1/$2/$3');
        } else if (value.length > 2) {
            value = value.replace(/(\d{2})(\d{1,2})/, '$1/$2');
        }
        field.value = value;
    }
}

// Inicia a classe
new StepByStepForm();
