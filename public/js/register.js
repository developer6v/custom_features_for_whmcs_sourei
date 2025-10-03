class StepByStepForm {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 3;
        this.formData = {};
        this.iti = null;
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
                this.initializePhoneInput();
                this.setupCountryListener();

                const ensureTermsChecked = () => {
                    const termsCheckbox = document.querySelector('input[name="accepttos"]');
                    if (termsCheckbox) {
                        termsCheckbox.checked = true;
                        termsCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
                        console.log("✅ Checkbox de termos marcado automaticamente");
                        clearInterval(interval); // para de checar
                    }
                };

                const interval = setInterval(ensureTermsChecked, 200);

            }, 200);
        });
    }

    setupFormStructure() {
        this.createStepHeader();
        this.organizeFieldsIntoSteps();
        this.createNavigation();
        this.adjustContainer();
    }

    initializePhoneInput() {
        const phoneInput = document.getElementById('inputPhone');
        if (phoneInput && window.intlTelInputGlobals) {
            this.iti = window.intlTelInputGlobals.getInstance(phoneInput);

            // Mascara + limitação em tempo real
            phoneInput.addEventListener("input", (e) => {
                this.applyPhoneMask(phoneInput, e);
            });
        }
    }


    createStepHeader() {
        const container = document.querySelector('.login-wrapper');
        const currencyGroup = this.findMoveableGroup('inputCurrency');

        if (container && currencyGroup) {
            currencyGroup.querySelector('label')?.remove();
            currencyGroup.classList.add('header-selector-group');

            const header = document.createElement('div');
            header.className = 'step-header';
            header.innerHTML = `
                <div class="header-top"></div>
                <div class="progress-indicator">
                    <div class="progress-line" id="progressLine"></div>
                    <div class="step-indicator active" data-step="1">1</div>
                    <div class="step-indicator" data-step="2">2</div>
                    <div class="step-indicator" data-step="3">3</div>
                </div>
                <h1 class="step-title" id="stepTitle">Dados Pessoais</h1>
                <p class="step-subtitle" id="stepSubtitle">Preencha suas informações básicas</p>
            `;
            
            header.querySelector('.header-top').appendChild(currencyGroup);
            container.insertBefore(header, container.firstChild);
        }
    }

    setupCountryListener() {
        const countrySelect = document.getElementById('inputCountry');
        if (countrySelect) {
            countrySelect.addEventListener('change', (e) => this.handleCountryChange(e.target.value));
            this.handleCountryChange(countrySelect.value);
        }
    }

    handleCountryChange(countryCode) {
        const cepLabel = document.querySelector('label[for="inputPostcode"]');
        const cepField = document.getElementById('inputPostcode');
        const addressFields = ['inputAddress1', 'inputAddress2', 'customfield18', 'customfield19', 'inputCity', 'stateselect'];
        const address2Label = document.querySelector('label[for="inputAddress2"]');

        if(cepField) cepField.value = '';

        this.populateStates(countryCode);

        if (countryCode === 'BR') {
            if (cepLabel) cepLabel.textContent = 'CEP';
            if (cepField) cepField.placeholder = '00000-000';
            if (this.iti) this.iti.setCountry('br');
            if (address2Label) address2Label.textContent = 'Bairro';

            addressFields.forEach(id => {
                const group = this.findMoveableGroup(id);
                if (group) group.style.display = 'none';
            });

        } else {
            if (address2Label) address2Label.textContent = 'Bairro';

            if (countryCode === 'US') {
                if (cepLabel) cepLabel.textContent = 'Zip Code';
                if (cepField) cepField.placeholder = 'e.g., 90210';
                if (this.iti) this.iti.setCountry('us');
            } else {
                if (cepLabel) cepLabel.textContent = 'Código Postal';
                if (cepField) cepField.placeholder = '';
                if (this.iti) this.iti.setCountry(countryCode.toLowerCase());
            }

            addressFields.forEach(id => {
                const group = this.findMoveableGroup(id);
                if (group) {
                    group.style.display = (id === 'stateselect' && countryCode !== 'US') ? 'none' : 'block';
                }
            });
        }
        this.checkStepValidationForButton();
    }

    populateStates(countryCode) {
        const stateSelect = document.getElementById('stateselect');
        if (!stateSelect) return;

        const usStates = { "AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas", "CA": "California", "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "FL": "Florida", "GA": "Georgia", "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa", "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MD": "Maryland", "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri", "MT": "Montana", "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico", "NY": "New York", "NC": "North Carolina", "ND": "North Dakota", "OH": "Ohio", "OK": "Oklahoma", "OR": "Oregon", "PA": "Pennsylvania", "RI": "Rhode Island", "SC": "South Carolina", "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont", "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming" };
        const brStates = { "AC": "Acre", "AL": "Alagoas", "AP": "Amapá", "AM": "Amazonas", "BA": "Bahia", "CE": "Ceará", "DF": "Distrito Federal", "ES": "Espírito Santo", "GO": "Goiás", "MA": "Maranhão", "MT": "Mato Grosso", "MS": "Mato Grosso do Sul", "MG": "Minas Gerais", "PA": "Pará", "PB": "Paraíba", "PR": "Paraná", "PE": "Pernambuco", "PI": "Piauí", "RJ": "Rio de Janeiro", "RN": "Rio Grande do Norte", "RS": "Rio Grande do Sul", "RO": "Rondônia", "RR": "Roraima", "SC": "Santa Catarina", "SP": "São Paulo", "SE": "Sergipe", "TO": "Tocantins" };

        let states = {};
        if (countryCode === 'US') states = usStates;
        else if (countryCode === 'BR') states = brStates;

        stateSelect.innerHTML = '<option value="">Selecione um estado</option>';

        for (const code in states) {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = states[code];
            stateSelect.appendChild(option);
        }
    }
    applyPhoneMask(phoneInputField, event) {
        if (!this.iti) {
            console.warn("❌ iti não inicializado");
            return;
        }

        const countryData = this.iti.getSelectedCountryData();
        console.log("🌍 País detectado:", countryData);

        let rawNumber = phoneInputField.value.replace(/\D/g, "");
        console.log("📞 Número cru:", rawNumber);

        const maxDigits = this.getMaxDigitsForCountry(countryData?.iso2?.toUpperCase() || "US");
        console.log("🔢 Limite de dígitos:", maxDigits);

        if (rawNumber.length > maxDigits) {
            rawNumber = rawNumber.substring(0, maxDigits);
            console.log("✂️ Número cortado:", rawNumber);
        }

        try {
            const formatted = this.iti.getNumber(intlTelInputUtils.numberFormat.INTERNATIONAL);
            console.log("✅ Formatado pelo iti:", formatted);

            // atualiza o campo com o que o iti acha válido
            phoneInputField.value = formatted;
        } catch (e) {
            console.error("⚠️ Erro formatando:", e);
            phoneInputField.value = rawNumber;
        }
    }



    getMaxDigitsForCountry(countryCode) {
        const countryMaxDigits = {
            US: 10, 
            CA: 10, 
            BR: 11, 
            GB: 10, 
            FR: 9,  
            DE: 11, 
            IN: 10, 
            MX: 10, 
            AU: 9, 
            JP: 10, 
            PT: 9
        };

        return countryMaxDigits[countryCode] || 15; 
    }

    organizeFieldsIntoSteps() {
        const form = document.querySelector('.loginForm');
        if (!form) return;

        const stepsContainer = document.createElement('div');
        stepsContainer.className = 'steps-container';

        const step1 = this.createStep(1, [
            this.createTwoColumnRow([this.findMoveableGroup('inputFirstName'), this.findMoveableGroup('inputLastName')]),
            this.createTwoColumnRow([this.findMoveableGroup('inputPhone'), this.findMoveableGroup('inputEmail')]),
            this.createTwoColumnRow([this.findMoveableGroup('customfield2'), this.findMoveableGroup('customfield3')]),
            this.createCheckboxField(),
            this.createTwoColumnRow([this.findMoveableGroup('customfield5'), this.findMoveableGroup('inputCompanyName')]),
        ]);

        const step2 = this.createStep(2, [
            this.createTwoColumnRow([this.findMoveableGroup('inputCountry'), this.findMoveableGroup('inputPostcode')]),
            this.createTwoColumnRow([this.findMoveableGroup('inputAddress1'), this.findMoveableGroup('customfield18')]),
            this.createTwoColumnRow([this.findMoveableGroup('inputAddress2'), this.findMoveableGroup('customfield19')]),
            this.createTwoColumnRow([this.findMoveableGroup('inputCity'), this.findMoveableGroup('stateselect')])
        ]);

        const passwordSection = document.getElementById('containerNewUserSecurity');
        const termsSection = document.querySelector('input[name="accepttos"]').closest('.section');
        const mailingListSection = document.querySelector('input[name="marketingoptin"]').closest('.section');
        const step3 = this.createStep(3, [passwordSection, mailingListSection, termsSection]);

        stepsContainer.appendChild(step1);
        stepsContainer.appendChild(step2);
        stepsContainer.appendChild(step3);

        const originalSectionsContainer = document.getElementById('containerNewUserSignup');
        if (originalSectionsContainer) {
            originalSectionsContainer.innerHTML = '';
            originalSectionsContainer.appendChild(stepsContainer);
        }
    }

    findMoveableGroup(elementId) { const el = document.getElementById(elementId); if (!el) return null; return el.closest('.col-md-6') || el.closest('.form-group'); }
    createStep(stepNumber, elements) { const step = document.createElement('div'); step.className = `form-step step-${stepNumber}`; step.setAttribute('data-step', stepNumber); const content = document.createElement('div'); content.className = 'step-content'; elements.forEach(element => { if (element) content.appendChild(element); }); step.appendChild(content); return step; }
    createTwoColumnRow(elements) { const row = document.createElement('div'); row.className = 'row'; elements.forEach(element => { if (element) row.appendChild(element); }); return row; }
    createCheckboxField() { const container = document.createElement('div'); container.className = 'form-group col-md-12'; container.innerHTML = `<div class="checkbox"><label><input type="checkbox" id="pessoaJuridica" name="pessoa_juridica" style="margin-right: 5px;"> Sou Pessoa Jurídica (usar CNPJ)</label></div>`; return container; }
    createNavigation() { const form = document.querySelector('.loginForm'); if (!form) return; const navigation = document.createElement('div'); navigation.className = 'step-navigation'; navigation.innerHTML = `<button type="button" class="btn btn-lg btn-default btn-prev" id="prevBtn" style="display: none;">Anterior</button><button type="button" class="btn btn-lg btn-primary btn-next" id="nextBtn" disabled>Próximo</button>`; form.appendChild(navigation); const originalSubmit = form.querySelector('button[type="submit"]'); if (originalSubmit) originalSubmit.style.display = 'none'; }
    adjustContainer() { const container = document.querySelector('.login-wrapper'); if (container) container.style.maxWidth = '700px'; }

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
                    if (!document.getElementById('nextBtn').disabled) {
                        this.nextStep();
                    }
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
                if (cnpjLabel) cnpjLabel.textContent = 'CNPJ (opcional)'; 
                if (companyNameLabel) companyNameLabel.textContent = 'Empresa (opcional)'; 
            } 
        }
        this.checkStepValidationForButton();
    }
    
    setupValidation() {
        const form = document.querySelector('.loginForm');
        if (!form) return;

        // Marca campo como "tocado" quando o usuário sai dele
        form.addEventListener('blur', (e) => {
            if (e.target.matches('.form-control, input[type="checkbox"]')) {
                e.target.dataset.touched = "true";
                this.validateField(e.target);
                this.checkStepValidationForButton();
            }
        }, true);

        // Validação em tempo real, mas só aplica erro se já foi tocado
        form.addEventListener('input', (e) => {
            if (e.target.matches('.form-control, input[type="checkbox"]')) {
                if (e.target.dataset.touched === "true") {
                    this.validateField(e.target);
                }
                this.checkStepValidationForButton();
            }
        });
    }

    setupInputMasks() {
        document.addEventListener('input', (e) => {
            const field = e.target;
            if (field.id === 'customfield2') this.applyCpfMask(field);
            else if (field.id === 'customfield5') this.applyCnpjMask(field);
            else if (field.id === 'customfield3') this.applyDateMask(field);
            else if (field.id === 'inputPostcode') {
                const country = document.getElementById('inputCountry').value;
                if (country === 'US') this.applyZipCodeMask(field);
                else if (country === 'BR') this.applyCepMask(field);
            }
        });
    }

    setupCepFieldListener() {
        const cepField = document.getElementById('inputPostcode');
        if (cepField) {
            cepField.addEventListener('blur', () => {
                const cep = cepField.value.replace(/\D/g, '');
                if (cep.length === 8 && document.getElementById('inputCountry').value === 'BR') {
                    this.fetchAddressFromCep();
                }
            });
        }
    }

    fetchAddressFromCep() {
        const cepField = document.getElementById('inputPostcode');
        const cep = cepField.value.replace(/\D/g, '');
        
        fetch(`https://viacep.com.br/ws/${cep}/json/` )
            .then(response => response.json())
            .then(data => {
                const group = cepField.closest('.form-group');
                const existingError = group.querySelector('.error-message');
                if (existingError) existingError.remove();

                if (data && !data.erro) {
                    cepField.classList.remove('error');
                    cepField.classList.add('success');
                    document.getElementById('inputAddress1').value = data.logradouro || '';
                    document.getElementById('inputCity').value = data.localidade || '';
                    document.getElementById('inputAddress2').value = data.bairro || '';
                    const stateSelect = document.getElementById('stateselect');
                    if (stateSelect) stateSelect.value = data.uf || '';

                    const addressFields = ['inputAddress1', 'inputAddress2', 'customfield18', 'customfield19', 'inputCity', 'stateselect'];
                    addressFields.forEach(id => {
                        const group = this.findMoveableGroup(id);
                        if (group) group.style.display = 'block';
                    });
                } else {
                    cepField.classList.remove('success');
                    cepField.classList.add('error');
                    const errorEl = document.createElement('span');
                    errorEl.className = 'error-message';
                    errorEl.textContent = 'CEP não encontrado.';
                    group.appendChild(errorEl);
                }
                this.checkStepValidationForButton();
            })
            .catch(error => {
                cepField.classList.add('error');
                console.error('Erro ao buscar CEP:', error);
                this.checkStepValidationForButton();
            });
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
        this.checkStepValidationForButton(); // Valida o botão sempre que um passo é mostrado
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
        const subtitles = [
            'Preencha suas informações básicas',
            'Informe seu endereço completo',
            'Crie uma senha e finalize seu cadastro'
        ];
        const titleEl = document.getElementById('stepTitle');
        const subtitleEl = document.getElementById('stepSubtitle');
        if (titleEl) titleEl.textContent = titles[this.currentStep - 1];
        if (subtitleEl) subtitleEl.textContent = subtitles[this.currentStep - 1];
    }

    nextStep() {
        // Aqui forçamos a validação final com mensagens de erro
        if (!this.validateCurrentStep(true)) return;
        if (this.currentStep < this.totalSteps) {
            this.showStep(this.currentStep + 1);
        } else {
            this.submitForm();
        }
    }

    prevStep() {
        if (this.currentStep > 1) this.showStep(this.currentStep - 1);
    }
    validateCurrentStep(force = false) {
        const currentStepEl = document.querySelector(`.form-step.step-${this.currentStep}`);
        if (!currentStepEl) return false;

        const fields = currentStepEl.querySelectorAll('input[required], select[required]');
        let isStepValid = true;

        fields.forEach(field => {
            if (field.offsetParent !== null) {
                if (!this.validateField(field, force)) {
                    isStepValid = false;
                }
            }
        });
        return isStepValid;
    }
    validateField(field, force = false) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        const group = field.closest('.form-group, .checkbox');
        if (!group) return true;

        // Se não foi tocado ainda e não estamos forçando (ex: clique em "Próximo"), não mostra erro
        if (!force && field.dataset.touched !== "true") {
            return !!value || field.type === 'checkbox' ? field.checked : true;
        }

        const existingError = group.querySelector('.error-message');
        if (existingError) existingError.remove();
        field.classList.remove('error', 'success');

        if (field.type === 'checkbox') {
            isValid = field.checked;
            if (!isValid) errorMessage = 'Você deve aceitar os termos.';
        } else if (field.required && !value) {
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
        } else if (field.id === 'inputPostcode' &&
                document.getElementById('inputCountry').value === 'BR' &&
                value.replace(/\D/g, '').length < 8) {
            isValid = false;
            errorMessage = 'CEP inválido.';
        }

        if (!isValid) {
            field.classList.add('error');
            const errorEl = document.createElement('span');
            errorEl.className = 'error-message';
            errorEl.textContent = errorMessage;
            group.appendChild(errorEl);
        } else if (value || field.checked) {
            field.classList.add('success');
        }
        return isValid;
    }


    checkStepValidationForButton() {
        const nextBtn = document.getElementById('nextBtn');
        if (!nextBtn) return;

        const currentStepEl = document.querySelector(`.form-step.step-${this.currentStep}`);
        if (!currentStepEl) return;

        const fields = currentStepEl.querySelectorAll('input[required], select[required]');
        let allValid = true;

        fields.forEach(field => {
            if (field.offsetParent !== null) {
                if (!field.value.trim() && field.type !== 'checkbox') {
                    allValid = false;
                }
                if (field.type === 'checkbox' && !field.checked) {
                    allValid = false;
                }
            }
        });

        nextBtn.disabled = !allValid;
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

    applyZipCodeMask(field) {
        let v = field.value.replace(/\D/g, '').slice(0, 9);
        if (v.length > 5) {
            v = v.replace(/^(\d{5})(\d{1,4})/, '$1-$2');
        }
        field.value = v;
    }
}

new StepByStepForm();
