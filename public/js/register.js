class StepByStepForm {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 3;
        this.formData = {};
        this.summaryData = {}; 
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupFormStructure();
            this.setupEventListeners();
            this.setupValidation();
            this.setupInputMasks();
            this.showStep(1);
            this.initializePhoneInputWithTimeout(); 
            this.setupCepFieldListener();
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
        const interval = setInterval(() => {
            console.log("header - cron"); // Verificando se está entrando no intervalo

            const container = document.querySelector('.login-wrapper');
            if (container) {
                // Criar o header
                const header = document.createElement('div');
                header.className = 'step-header';
                header.innerHTML = `
                    <div class="header-top">
                        <div class="header-selectors">
                            <div class="selector-group">
                                <select id="headerCountry" class="header-select">
                                    <option value="BR" selected>Brasil</option>
                                    <option value="US">Estados Unidos</option>
                                    <option value="AR">Argentina</option>
                                    <option value="CA">Canadá</option>
                                    <option value="CL">Chile</option>
                                    <option value="CO">Colômbia</option>
                                    <option value="FR">França</option>
                                    <option value="DE">Alemanha</option>
                                    <option value="IT">Itália</option>
                                    <option value="JP">Japão</option>
                                    <option value="MX">México</option>
                                    <option value="PE">Peru</option>
                                    <option value="PT">Portugal</option>
                                    <option value="ES">Espanha</option>
                                    <option value="GB">Reino Unido</option>
                                    <option value="UY">Uruguai</option>
                                    <option value="VE">Venezuela</option>
                                </select>
                            </div>
                            <div class="selector-group">
                                <select id="headerCurrency" class="header-select">
                                    <option value="1" selected>BRL</option>
                                    <option value="2">EUR</option>
                                    <option value="3">USD</option>
                                </select>
                            </div>
                        </div>
                    </div>
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
                
                // Sincronizar seleções com campos do formulário
                this.syncHeaderSelectors();

                // Parar o intervalo quando o campo for encontrado
                clearInterval(interval);
            }
        }, 100); // Verificar a cada 100ms
    }


    syncHeaderSelectors() {
        const headerCountry = document.getElementById('headerCountry');
        const headerCurrency = document.getElementById('headerCurrency');
        
        if (headerCountry) {
            headerCountry.addEventListener('change', (e) => {
                const formCountry = document.getElementById('inputCountry');
                if (formCountry) formCountry.value = e.target.value;
            });
        }
        
        if (headerCurrency) {
            headerCurrency.addEventListener('change', (e) => {
                const formCurrency = document.getElementById('inputCurrency');
                if (formCurrency) formCurrency.value = e.target.value;
            });
        }
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
                this.createDateFieldWithCalendar('inputBirthDate', 'Data de Nascimento', 'dd/mm/aaaa'),
            ]),
            this.createCheckboxField(),
            this.createCnpjField()

        ]);

        // Passo 2: Endereço
        const step2 = this.createStep(2, [
            this.createTwoColumnRow([ 
                this.getFieldGroup('inputPostcode', 'CEP', '00000-000') // Movemos o CEP para cima
            ]),
            this.getFieldGroup('inputAddress1', 'Endereço', 'Rua, número'),
            this.getFieldGroup('inputAddress2', 'Complemento', 'Apartamento, bloco (opcional)'),
            this.createTwoColumnRow([
                this.getFieldGroup('inputCity', 'Cidade', 'Sua cidade'),
                this.getFieldGroup('stateinput', 'Estado', 'Seu estado')
            ]),
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

    fetchAddressFromCep(cep) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (data && !(data.errors && data.errors.length > 0)) {
                    document.getElementById('inputAddress1').value = data.logradouro || '';
                    document.getElementById('inputCity').value = data.localidade || '';
                    //document.getElementById('stateinput').value = data.uf || '';
                    this.showAddressFields();
                } else {
                    this.handleInvalidCep();
                }
            })
            .catch(error => {
                console.error(error);
                this.handleInvalidCep();
            });
    }

    showAddressFields() {
        const addressFields = [
            document.getElementById('inputAddress1'),
            document.getElementById('inputAddress2'),
            document.getElementById('inputCity'),
            document.getElementById('stateinput')
        ];

        addressFields.forEach(field => {
            if (field) {
                field.closest('.form-group').style.display = 'block'; // Exibe os campos de endereço
            }
        });
    }

    // Função para lidar com o CEP inválido
    handleInvalidCep() {
        alert("CEP Inválido");
        const cepField = document.getElementById('inputPostcode');
        if (cepField) {
            cepField.value = ''; // Limpar o campo de CEP
        }
        this.validateField(cepField);
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
        if (!originalField && fieldId !== 'inputBirthDate') return null;

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

    setupCepFieldListener() {
        const cepField = document.getElementById('inputPostcode');
        const addressFields = [
            document.getElementById('inputAddress1'),
            document.getElementById('inputAddress2'),
            document.getElementById('inputCity'),
            document.getElementById('stateinput')
        ];

        // Inicialmente, esconder os campos de endereço
        addressFields.forEach(field => {
            if (field) {
                field.closest('.form-group').style.display = 'none'; // Esconde os campos de endereço
            }
        });
        if (cepField) {
            cepField.addEventListener('change', (e) => {
                const cep = e.target.value.replace(/\D/g, ''); // Remove tudo que não for número
                if (cep.length === 8) { // Verifica se o CEP tem 8 dígitos
                    this.fetchAddressFromCep(cep);
                } else {
                    this.handleInvalidCep();
                }
            });
        }


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

    // CORREÇÃO: Campo país customizado com Brasil pré-selecionado
    createCountryField() {
        const group = document.createElement('div');
        group.className = 'form-group';

        const labelEl = document.createElement('label');
        labelEl.setAttribute('for', 'inputCountry');
        labelEl.className = 'label-required';
        labelEl.textContent = 'País';

        const selectEl = document.createElement('select');
        selectEl.id = 'inputCountry';
        selectEl.name = 'country';
        selectEl.className = 'form-control';
        selectEl.required = true;

        // Lista de países com Brasil pré-selecionado
        const countries = [
            { value: '', text: 'Selecione o país' },
            { value: 'BR', text: 'Brasil', selected: true },
            { value: 'US', text: 'Estados Unidos' },
            { value: 'AR', text: 'Argentina' },
            { value: 'CA', text: 'Canadá' },
            { value: 'CL', text: 'Chile' },
            { value: 'CO', text: 'Colômbia' },
            { value: 'FR', text: 'França' },
            { value: 'DE', text: 'Alemanha' },
            { value: 'IT', text: 'Itália' },
            { value: 'JP', text: 'Japão' },
            { value: 'MX', text: 'México' },
            { value: 'PE', text: 'Peru' },
            { value: 'PT', text: 'Portugal' },
            { value: 'ES', text: 'Espanha' },
            { value: 'GB', text: 'Reino Unido' },
            { value: 'UY', text: 'Uruguai' },
            { value: 'VE', text: 'Venezuela' }
        ];

        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.value;
            option.textContent = country.text;
            if (country.selected) {
                option.selected = true;
            }
            selectEl.appendChild(option);
        });

        group.appendChild(labelEl);
        group.appendChild(selectEl);

        // Remover campo original se existir
        const originalField = document.getElementById('inputCountry');
        if (originalField) {
            const originalGroup = originalField.closest('.form-group, .row');
            if (originalGroup) originalGroup.remove();
        }

        return group;
    }

    createDateField(fieldId, label, placeholder) {
        const group = document.createElement('div');
        group.className = 'form-group';

        const labelEl = document.createElement('label');
        labelEl.setAttribute('for', fieldId);
        labelEl.className = 'label-required';
        labelEl.textContent = label;

        const inputEl = document.createElement('input');
        inputEl.type = 'text';
        inputEl.id = fieldId;
        inputEl.name = 'birth_date';
        inputEl.className = 'form-control';
        inputEl.placeholder = placeholder;
        inputEl.required = true;
        inputEl.maxLength = 10;

        group.appendChild(labelEl);
        group.appendChild(inputEl);

        return group;
    }


    createDateFieldWithCalendar(fieldId, label, placeholder) {
        const group = document.createElement('div');
        group.className = 'form-group';

        const labelEl = document.createElement('label');
        labelEl.setAttribute('for', fieldId);
        labelEl.className = 'label-required';
        labelEl.textContent = label;

        const inputEl = document.createElement('input');
        inputEl.type = 'text';
        inputEl.id = fieldId;
        inputEl.name = 'birth_date';
        inputEl.className = 'form-control';
        inputEl.placeholder = placeholder;
        inputEl.required = true;
        inputEl.maxLength = 10;

        // Criar o ícone de calendário fora do campo
        const calendarIcon = document.createElement('i');
        calendarIcon.classList.add('calendar-icon');
        calendarIcon.textContent = '';

        // Adiciona o ícone ao lado do campo de data
        const inputContainer = document.createElement('div');
        inputContainer.classList.add('input-with-icon');
        inputContainer.appendChild(inputEl);
        inputContainer.appendChild(calendarIcon);

        // Adiciona o container no grupo
        group.appendChild(labelEl);
        group.appendChild(inputContainer);

        // Inicializa o flatpickr para o campo de data
        flatpickr(inputEl, {
            dateFormat: "d/m/Y", // Formato da data
            allowInput: true,    // Permite digitar manualmente
            onChange: function(selectedDates, dateStr, instance) {
                inputEl.value = dateStr; // Atualiza o valor do input com a data selecionada
            }
        });

        // Abre o calendário ao clicar no ícone
        calendarIcon.addEventListener('click', function () {
            inputEl._flatpickr.open(); // Abre o calendário ao clicar no ícone
        });

        return group;
    }


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

        group.appendChild(labelEl);
        group.appendChild(inputEl);
        
        // Inicialmente oculto
        group.style.display = 'none';
        group.id = 'cnpjGroup';

        return group;
    }

    createCurrencyField() {
        const group = document.createElement('div');
        group.className = 'form-group';

        const labelEl = document.createElement('label');
        labelEl.setAttribute('for', 'inputCurrency');
        labelEl.className = 'label-required';
        labelEl.textContent = 'Escolha a Moeda';

        const selectEl = document.createElement('select');
        selectEl.id = 'inputCurrency';
        selectEl.name = 'currency';
        selectEl.className = 'form-control';
        selectEl.required = true;

        // Adiciona as opções de moeda
        const options = [
            { value: '1', text: 'BRL', selected: true },
            { value: '2', text: 'EUR' },
            { value: '3', text: 'USD' }
        ];

        options.forEach(option => {
            const optionEl = document.createElement('option');
            optionEl.value = option.value;
            optionEl.textContent = option.text;
            if (option.selected) optionEl.selected = true;
            selectEl.appendChild(optionEl);
        });

        group.appendChild(labelEl);
        group.appendChild(selectEl);

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

        // Checkbox pessoa jurídica
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

setupInputMasks() {
    document.addEventListener('input', (e) => {
        const field = e.target;

        if (field.id === 'inputCompanyName') {
            this.applyCpfMask(field);
        } else if (field.id === 'inputCnpj') {
            this.applyCnpjMask(field);
        }  else if (field.id === 'inputPostcode') {
            this.applyCepMask(field);
        } else if (field.id === 'inputBirthDate') {
            this.applyDateMask(field);
        }
    });
}
    initializePhoneInputWithTimeout() {
        const checkInterval = 500; // Intervalo de 500ms para verificar
        const maxAttempts = 100;    // Máximo de tentativas (5 segundos no total)

        let attempts = 0;

        const interval = setInterval(() => {
            console.log("Campo de telefone - cron", attempts); // Verificando se está entrando no intervalo

            const phoneInput = document.querySelector("#inputPhone");
            if (phoneInput) {
                console.log("Campo de telefone - encontrou");
                clearInterval(interval); // Parar o intervalo quando o campo for encontrado

                const iti = window.intlTelInput(phoneInput, {
                    initialCountry: "br", // Detecta o país automaticamente com base no IP
                    separateDialCode: true, // Exibe o código de discagem separadamente
                    preferredCountries: ['br', 'us', 'ca', 'gb'], // Países preferidos, por exemplo
                    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js" // Script de validação
                });

                // Aplica a máscara de telefone conforme o país
                phoneInput.addEventListener("input", () => {
                    this.applyPhoneMask();
                });

            } else {
                console.log("Campo de telefone - nao encontrou");
            }

            // Se o campo não for encontrado após o número máximo de tentativas, parar
            attempts++;
            if (attempts >= maxAttempts) {
                clearInterval(interval); // Parar o intervalo
                console.log("Campo de telefone não encontrado após várias tentativas.");
            }
        }, checkInterval); // Checa a cada 500ms
    }

    // Função para aplicar a máscara de telefone de acordo com o país selecionado
    applyPhoneMaskBasedOnCountry(phoneInput, iti) {
        const countryData = iti.getSelectedCountryData();
        const countryCode = countryData.dialCode;

        // Aplica a máscara de telefone de acordo com o país
        let phoneValue = phoneInput.value.replace(/\D/g, ''); // Remover qualquer coisa que não seja número

        if (countryCode === '55') { // Brasil
            phoneValue = phoneValue.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
        } else if (countryCode === '1') { // EUA, Canadá
            phoneValue = phoneValue.replace(/^(\d{1})(\d{3})(\d{3})(\d{4})$/, "($1) $2-$3-$4");
        } else {
            // Adicione aqui para outros países, dependendo do formato que você precisar
            phoneValue = phoneValue.replace(/^(\d{1})(\d{3})(\d{3})(\d{4})$/, "($1) $2-$3-$4");
        }

        phoneInput.value = phoneValue;
    }
applyDateMask(field) {
    let value = field.value.replace(/\D/g, '');  // Remove qualquer caractere não numérico

    // Limita a 8 dígitos (ddmmaaaa)
    if (value.length > 8) {
        value = value.substring(0, 8);
    }

    // Formata apenas se houver dígitos suficientes
    if (value.length > 4) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4) + '/' + value.substring(4);
    } else if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2);
    }

    // Atualiza o valor do campo
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
        this.renderSummaries(); 
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

        this.saveStepData(); // <-- ADICIONE ESTA LINHA

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

        if (this.currentStep === 3) {
            isValid = this.validatePasswords() && isValid;
        }

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

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

        // Validação de nome completo
        if (value && field.id === 'inputFirstName') {
            // Verificar se o nome contém pelo menos um espaço
            const nameParts = value.trim().split(/\s+/); // Divide o valor por espaços em branco

            // Se o nome contiver menos de 2 partes, ou seja, sem espaço entre nome e sobrenome
            if (nameParts.length < 2) {
                isValid = false;
                errorMessage = 'Por favor, insira seu nome e sobrenome';
            }
        }


        // Aplicar classes visuais
        field.classList.remove('error', 'success');
        if (!isValid) {
            field.classList.add('error');
            
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

    toggleCnpjField(showCnpj) {
        const cnpjGroup = document.getElementById('cnpjGroup');
        const cpfField = document.getElementById('inputCompanyName');
        const cpfLabel = document.querySelector('label[for="inputCompanyName"]');

        if (cnpjGroup) {
            if (showCnpj) {
                cnpjGroup.style.display = 'block';
                if (cpfField) cpfField.required = false;
                if (cpfLabel) cpfLabel.textContent = 'CPF';
            } else {
                cnpjGroup.style.display = 'none';
                if (cpfField) cpfField.required = true;
                if (cpfLabel) cpfLabel.textContent = 'CPF';
                const cnpjField = document.getElementById('inputCnpj');
                if (cnpjField) cnpjField.value = '';
            }
        }
    }

    applyCpfMask(field) {
        let value = field.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
        
        // Limita o valor a no máximo 11 dígitos
        if (value.length > 11) {
            value = value.slice(0, 11); 
        }

        // Aplica a máscara do CPF
        if (value.length <= 11) {
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        }

        field.value = value; // Atualiza o campo com o valor formatado
    }

    applyCnpjMask(field) {
        let value = field.value.replace(/\D/g, '');
        
        if (value.length > 14) {
            value = value.slice(0, 14); 
        }
        
        if (value.length <= 14) {
            value = value.replace(/^(\d{2})(\d)/, '$1.$2');
            value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
            value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
            value = value.replace(/(\d{4})(\d)/, '$1-$2');
        }

        field.value = value;
    }


     applyPhoneMask(event) {
        const countryData = phoneInput.getSelectedCountryData();
        const countryCode = countryData.iso2.toUpperCase();
        let rawNumber = phoneInputField.value.replace(/\D/g, ""); 

        const maxDigits = getMaxDigitsForCountry(countryCode);

        if (rawNumber.length > maxDigits) {
            event.preventDefault();
            rawNumber = rawNumber.substring(0, maxDigits);
        }

        let formattedNumber = "";
        try {
            formattedNumber = new libphonenumber.AsYouType(countryCode).input(rawNumber);
        } catch (error) {
            formattedNumber = rawNumber;
        }

        if (event && event.inputType === "deleteContentBackward") {
            lastValue = phoneInputField.value;
            return;
        }

        phoneInputField.value = formattedNumber;
        lastValue = formattedNumber;
    }

    applyCepMask(field) {
        let value = field.value.replace(/\D/g, ''); // Remove qualquer caractere não numérico

        // Limita a 8 caracteres no formato do CEP
        if (value.length > 8) {
            value = value.substring(0, 8); // Garantir que não ultrapasse 8 caracteres
        }

        // Aplica a máscara: 00000-000
        value = value.replace(/^(\d{5})(\d)/, '$1-$2');

        field.value = value; // Atualiza o campo com a máscara de CEP
    }


    submitForm() {
        const form = document.querySelector('.loginForm');
        if (form) {
            const submitBtn = document.getElementById('nextBtn');
            if (submitBtn) {
                submitBtn.classList.add('loading');
                submitBtn.innerHTML = '<div class="spinner"></div>';
            }

            form.submit();
        }
    }

        /**
     * Salva os dados do passo atual no objeto formData.
     */
    saveStepData() {
        const currentStepEl = document.querySelector(`.form-step.step-${this.currentStep}`);
        if (!currentStepEl) return;

        const fields = currentStepEl.querySelectorAll('input, select');
        this.formData[this.currentStep] = {};

        fields.forEach(field => {
            if (field.id && field.value) {
                // Para o campo de telefone, obtemos o número completo com o código do país
                if (field.id === 'inputPhone' && window.intlTelInput) {
                    const iti = window.intlTelInputGlobals.getInstance(field);
                    if (iti) {
                        this.formData[this.currentStep][field.id] = iti.getNumber();
                    }
                } else {
                    this.formData[this.currentStep][field.id] = field.value;
                }
            }
        });
    }

    /**
     * Cria e exibe os resumos dos passos anteriores.
     */
    renderSummaries() {
        const stepsContainer = document.querySelector('.steps-container');
        if (!stepsContainer) return;

        // Limpa resumos antigos para não duplicar
        stepsContainer.querySelectorAll('.summary-box').forEach(box => box.remove());

        // Itera pelos passos anteriores ao atual
        for (let i = 1; i < this.currentStep; i++) {
            const stepData = this.formData[i];
            if (!stepData) continue;

            const summaryBox = this.createSummaryBox(i, stepData);
            const currentStepEl = stepsContainer.querySelector(`.step-${this.currentStep}`);
            
            // Insere o resumo antes do conteúdo do passo atual
            if (currentStepEl) {
                currentStepEl.before(summaryBox);
            }
        }
    }

    /**
     * Cria o HTML para um único bloco de resumo.
     * @param {number} stepNumber - O número do passo.
     * @param {object} data - Os dados do passo.
     * @returns {HTMLElement} - O elemento div do resumo.
     */
    createSummaryBox(stepNumber, data) {
        const summaryBox = document.createElement('div');
        summaryBox.className = 'summary-box';
        summaryBox.setAttribute('data-step-target', stepNumber);

        let content = '';
        const titles = ['Informações Pessoais', 'Endereço']; // Títulos para cada passo

        // Constrói o conteúdo do resumo baseado no passo
        if (stepNumber === 1) { // Resumo do Passo 1
            content = `
                <div class="summary-content">
                    <p><strong>${data.inputFirstName || ''}</strong></p>
                    <p>${data.inputPhone || ''}</p>
                    <p>${data.inputEmail || ''}</p>
                    <p>${data.inputCompanyName || ''}</p>
                    <p>${data.inputBirthDate || ''}</p>
                </div>
            `;
        } else if (stepNumber === 2) { // Resumo do Passo 2
             content = `
                <div class="summary-content">
                    <p><strong>${data.inputAddress1 || ''}, ${data.inputAddress2 || ''}</strong></p>
                    <p>${data.inputCity || ''} - ${data.stateinput || ''}</p>
                    <p>CEP: ${data.inputPostcode || ''}</p>
                </div>
            `;
        }

        summaryBox.innerHTML = `
            <div class="summary-header">
                <h4>${titles[stepNumber - 1]}</h4>
                <button type="button" class="edit-step-btn">✏️</button>
            </div>
            ${content}
        `;

        // Adiciona o evento de clique para voltar ao passo
        summaryBox.addEventListener('click', () => {
            this.showStep(stepNumber);
        });

        return summaryBox;
    }

}

new StepByStepForm();  
    