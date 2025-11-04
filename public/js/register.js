class StepByStepForm {
    constructor() {
        this.captchaEl = null;
        this.captchaClearfix = null;
        this.currentStep = 1;
        this.totalSteps = 3;
        this.formData = {};
        this.iti = null;
        this._lastDupChecked = { email: '', cpf: '' };
        this.serverCpfExists = false;
        this.serverEmailExists = false;
        this.currentLanguage = 'pt-BR';
        this.translations = window.FormGeoI18n.getTranslation(this.currentLanguage);
        this.urlvalidateemailcpf = "/modules/addons/custom_features_for_whmcs_sourei/src/Controllers/validateEmailCpf.php" ;
        this.init();
    }

    // ============================================
    // MÉTODO NOVO: initTranslations
    // Define todas as traduções da interface
    // ============================================
    initTranslations() {
        return {
            'pt-BR': {
                // Títulos dos steps
                stepTitles: ['Dados Pessoais', 'Endereço', 'Segurança'],
                stepSubtitles: [
                    'Preencha suas informações básicas',
                    'Informe seu endereço completo',
                    'Crie sua senha de acesso'
                ],
                // Labels de campos
                fullName: 'Nome Completo',
                phone: 'Telefone',
                email: 'E-mail',
                birthdate: 'Data de Nascimento',
                company: 'Empresa',
                country: 'País',
                postalCode: 'CEP',
                address: 'Endereço',
                addressNumber: 'Número',
                neighborhood: 'Bairro',
                complement: 'Complemento',
                city: 'Cidade',
                state: 'Estado',
                password: 'Senha',
                confirmPassword: 'Confirmar Senha',
                // Placeholders
                fullNamePlaceholder: 'Digite seu nome completo',
                emailPlaceholder: 'seu@email.com',
                birthdatePlaceholder: 'DD/MM/AAAA',
                postalCodePlaceholder: '00000-000',
                addressPlaceholder: 'Rua, Avenida, etc.',
                numberPlaceholder: 'Nº',
                neighborhoodPlaceholder: 'Bairro',
                complementPlaceholder: 'Apto, Bloco, etc.',
                cityPlaceholder: 'Cidade',
                statePlaceholder: 'Selecione um estado',
                // Checkbox e botões
                legalPerson: 'Sou Pessoa Jurídica (usar CNPJ)',
                nextButton: 'Próximo',
                prevButton: 'Voltar',
                finishButton: 'Finalizar',
                // Resumos
                summaryPersonalData: 'Seus Dados Pessoais',
                summaryPersonalDataTitle: 'Dados Pessoais',
                summaryAddressTitle: 'Endereço',
                // Mensagens de erro
                errorRequired: 'Este campo é obrigatório.',
                errorEmail: 'E-mail inválido.',
                errorFullName: 'Por favor, insira nome e sobrenome',
                errorCep: 'CEP inválido. Verifique e tente novamente.',
                errorCepFetch: 'Erro ao buscar CEP. Tente novamente.'
            },
            'en-US': {
                stepTitles: ['Personal Information', 'Address', 'Security'],
                stepSubtitles: [
                    'Fill in your basic information',
                    'Enter your complete address',
                    'Create your access password'
                ],
                fullName: 'Full Name',
                phone: 'Phone',
                email: 'Email',
                birthdate: 'Date of Birth',
                company: 'Company',
                country: 'Country',
                postalCode: 'Zip Code',
                address: 'Address',
                addressNumber: 'Number',
                neighborhood: 'Neighborhood',
                complement: 'Complement',
                city: 'City',
                state: 'State',
                password: 'Password',
                confirmPassword: 'Confirm Password',
                fullNamePlaceholder: 'Enter your full name',
                emailPlaceholder: 'your@email.com',
                birthdatePlaceholder: 'MM/DD/YYYY',
                postalCodePlaceholder: 'e.g., 90210',
                addressPlaceholder: 'Street, Avenue, etc.',
                numberPlaceholder: 'No.',
                neighborhoodPlaceholder: 'Neighborhood',
                complementPlaceholder: 'Apt, Unit, etc.',
                cityPlaceholder: 'City',
                statePlaceholder: 'Select a state',
                legalPerson: 'I am a Legal Entity (use EIN)',
                nextButton: 'Next',
                prevButton: 'Back',
                finishButton: 'Finish',
                summaryPersonalData: 'Your Personal Information',
                summaryPersonalDataTitle: 'Personal Information',
                summaryAddressTitle: 'Address',
                errorRequired: 'This field is required.',
                errorEmail: 'Invalid email.',
                errorFullName: 'Please enter first and last name',
                errorCep: 'Invalid ZIP code. Please verify and try again.',
                errorCepFetch: 'Error fetching ZIP code. Please try again.'
            },
            'es-ES': {
                stepTitles: ['Datos Personales', 'Dirección', 'Seguridad'],
                stepSubtitles: [
                    'Complete su información básica',
                    'Ingrese su dirección completa',
                    'Cree su contraseña de acceso'
                ],
                fullName: 'Nombre Completo',
                phone: 'Teléfono',
                email: 'Correo Electrónico',
                birthdate: 'Fecha de Nacimiento',
                company: 'Empresa',
                country: 'País',
                postalCode: 'Código Postal',
                address: 'Dirección',
                addressNumber: 'Número',
                neighborhood: 'Barrio',
                complement: 'Complemento',
                city: 'Ciudad',
                state: 'Estado',
                password: 'Contraseña',
                confirmPassword: 'Confirmar Contraseña',
                fullNamePlaceholder: 'Ingrese su nombre completo',
                emailPlaceholder: 'su@email.com',
                birthdatePlaceholder: 'DD/MM/AAAA',
                postalCodePlaceholder: '00000',
                addressPlaceholder: 'Calle, Avenida, etc.',
                numberPlaceholder: 'Nº',
                neighborhoodPlaceholder: 'Barrio',
                complementPlaceholder: 'Piso, Depto, etc.',
                cityPlaceholder: 'Ciudad',
                statePlaceholder: 'Seleccione un estado',
                legalPerson: 'Soy Persona Jurídica (usar CIF)',
                nextButton: 'Siguiente',
                prevButton: 'Volver',
                finishButton: 'Finalizar',
                summaryPersonalData: 'Sus Datos Personales',
                summaryPersonalDataTitle: 'Datos Personales',
                summaryAddressTitle: 'Dirección',
                errorRequired: 'Este campo es obligatorio.',
                errorEmail: 'Correo electrónico inválido.',
                errorFullName: 'Por favor, ingrese nombre y apellido',
                errorCep: 'Código postal inválido. Verifique e intente nuevamente.',
                errorCepFetch: 'Error al buscar código postal. Intente nuevamente.'
            },
            'pt-PT': {
                stepTitles: ['Dados Pessoais', 'Morada', 'Segurança'],
                stepSubtitles: [
                    'Preencha as suas informações básicas',
                    'Indique a sua morada completa',
                    'Crie a sua palavra-passe de acesso'
                ],
                fullName: 'Nome Completo',
                phone: 'Telefone',
                email: 'E-mail',
                birthdate: 'Data de Nascimento',
                company: 'Empresa',
                country: 'País',
                postalCode: 'Código Postal',
                address: 'Morada',
                addressNumber: 'Número',
                neighborhood: 'Freguesia',
                complement: 'Complemento',
                city: 'Cidade',
                state: 'Distrito',
                password: 'Palavra-passe',
                confirmPassword: 'Confirmar Palavra-passe',
                fullNamePlaceholder: 'Introduza o seu nome completo',
                emailPlaceholder: 'seu@email.com',
                birthdatePlaceholder: 'DD/MM/AAAA',
                postalCodePlaceholder: '0000-000',
                addressPlaceholder: 'Rua, Avenida, etc.',
                numberPlaceholder: 'Nº',
                neighborhoodPlaceholder: 'Freguesia',
                complementPlaceholder: 'Andar, Porta, etc.',
                cityPlaceholder: 'Cidade',
                statePlaceholder: 'Selecione um distrito',
                legalPerson: 'Sou Pessoa Coletiva (usar NIPC)',
                nextButton: 'Seguinte',
                prevButton: 'Voltar',
                finishButton: 'Finalizar',
                summaryPersonalData: 'Os Seus Dados Pessoais',
                summaryPersonalDataTitle: 'Dados Pessoais',
                summaryAddressTitle: 'Morada',
                errorRequired: 'Este campo é obrigatório.',
                errorEmail: 'E-mail inválido.',
                errorFullName: 'Por favor, introduza nome e apelido',
                errorCep: 'Código postal inválido. Verifique e tente novamente.',
                errorCepFetch: 'Erro ao buscar código postal. Tente novamente.'
            },
            'fr-FR': {
                stepTitles: ['Données Personnelles', 'Adresse', 'Sécurité'],
                stepSubtitles: [
                    'Remplissez vos informations de base',
                    'Entrez votre adresse complète',
                    'Créez votre mot de passe d\'accès'
                ],
                fullName: 'Nom Complet',
                phone: 'Téléphone',
                email: 'E-mail',
                birthdate: 'Date de Naissance',
                company: 'Entreprise',
                country: 'Pays',
                postalCode: 'Code Postal',
                address: 'Adresse',
                addressNumber: 'Numéro',
                neighborhood: 'Quartier',
                complement: 'Complément',
                city: 'Ville',
                state: 'Région',
                password: 'Mot de passe',
                confirmPassword: 'Confirmer le mot de passe',
                fullNamePlaceholder: 'Entrez votre nom complet',
                emailPlaceholder: 'votre@email.com',
                birthdatePlaceholder: 'JJ/MM/AAAA',
                postalCodePlaceholder: '00000',
                addressPlaceholder: 'Rue, Avenue, etc.',
                numberPlaceholder: 'Nº',
                neighborhoodPlaceholder: 'Quartier',
                complementPlaceholder: 'Apt, Bât, etc.',
                cityPlaceholder: 'Ville',
                statePlaceholder: 'Sélectionnez une région',
                legalPerson: 'Je suis une Personne Morale (utiliser SIRET)',
                nextButton: 'Suivant',
                prevButton: 'Retour',
                finishButton: 'Terminer',
                summaryPersonalData: 'Vos Données Personnelles',
                summaryPersonalDataTitle: 'Données Personnelles',
                summaryAddressTitle: 'Adresse',
                errorRequired: 'Ce champ est obligatoire.',
                errorEmail: 'E-mail invalide.',
                errorFullName: 'Veuillez entrer le prénom et le nom',
                errorCep: 'Code postal invalide. Veuillez vérifier et réessayer.',
                errorCepFetch: 'Erreur lors de la récupération du code postal. Veuillez réessayer.'
            }
        };
    }

    async checkEmailCpfDuplicate_(){
        const t        = this.translations || window.FormGeoI18n.getTranslation('pt-BR') || {};
        const country  = document.getElementById('inputCountry')?.value || 'BR';
        const emailEl  = document.getElementById('inputEmail');
        const cpfEl    = document.getElementById('customfield2');

        const rawEmail = (emailEl?.value || '').trim();
        const rawCpf   = (cpfEl?.value || '').trim();

        // --- validação local: só chama servidor se estiver OK localmente
        const emailOk = !!rawEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail);
        const cpfOk   = (country === 'BR') && !!rawCpf && this.isValidCpf_(rawCpf);

        if (!emailOk && !cpfOk){
            // nada a checar remotamente; limpa flags desse(s) campo(s)
            if (!emailOk) { this.serverEmailExists = false; this.clearFieldError_('inputEmail'); }
            if (!cpfOk)   { this.serverCpfExists   = false; this.clearFieldError_('customfield2'); }
            this.checkStepValidationForButton();
            return;
        }

        const normEmail = emailOk ? rawEmail.toLowerCase() : '';
        const normCpf   = cpfOk   ? rawCpf.replace(/\D/g,'') : '';

        // evita repetir a mesma chamada para o mesmo valor
        if (normEmail === this._lastDupChecked.email && normCpf === this._lastDupChecked.cpf){
            return;
        }

        try{
            const resp = await fetch(this.urlvalidateemailcpf, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'omit',
            body: JSON.stringify({ email: normEmail, cpf: normCpf })
            });
            if (!resp.ok) throw new Error('HTTP '+resp.status);
            const data = await resp.json();

            // zera erros antigos "de servidor"
            this.clearFieldError_('inputEmail');
            this.clearFieldError_('customfield2');

            // flags internas reaproveitadas pelo seu checkStepValidationForButton()
            this.serverEmailExists = !!(emailOk && data.email);
            this.serverCpfExists   = !!(cpfOk   && data.cpf);

            if (this.serverEmailExists){
            this.showFieldError_('inputEmail', t.errorEmailExists || 'E-mail já cadastrado.');
            }
            if (this.serverCpfExists){
            this.showFieldError_('customfield2', t.errorCpfExists || 'CPF já cadastrado.');
            }

            this._lastDupChecked.email = normEmail || this._lastDupChecked.email;
            this._lastDupChecked.cpf   = normCpf   || this._lastDupChecked.cpf;

        } catch(err){
            console.error('[dup-check] erro de rede', err);
            // não bloqueia o fluxo; só não marca duplicado
        }

        this.checkStepValidationForButton();
    }


    // ============================================
    // MÉTODO NOVO: translatePage
    // Traduz toda a página para o idioma selecionado
    // ============================================
    translatePage(language) {
        this.currentLanguage = language;
        this.translations = window.FormGeoI18n.getTranslation(language);
        const t = this.translations;        
        if (!t) {
            console.warn(`[Translation] Idioma ${language} não encontrado`);
            return;
        }
        
        // Traduz títulos e subtítulos dos steps
        this.updateStepContent(this.currentStep);
        
        // Traduz labels de campos
        this.translateLabel('inputFullName', t.fullName);
        this.translateLabel('inputPhone', t.phone);
        this.translateLabel('inputEmail', t.email);
        this.translateLabel('customfield3', t.birthdate);
        this.translateLabel('inputCompanyName', t.company);
        this.translateLabel('inputCountry', t.country);
        this.translateLabel('inputPostcode', t.postalCode);
        this.translateLabel('inputAddress1', t.address);
        this.translateLabel('customfield18', t.addressNumber);
        this.translateLabel('inputAddress2', t.neighborhood);
        this.translateLabel('customfield19', t.complement);
        this.translateLabel('inputCity', t.city);
        this.translateLabel('stateselect', t.state);
        
        // Traduz placeholders
        this.translatePlaceholder('inputFullName', t.fullNamePlaceholder);
        this.translatePlaceholder('inputEmail', t.emailPlaceholder);
        this.translatePlaceholder('customfield3', t.birthdatePlaceholder);
        this.translatePlaceholder('inputPostcode', t.postalCodePlaceholder);
        this.translatePlaceholder('inputAddress1', t.addressPlaceholder);
        this.translatePlaceholder('customfield18', t.numberPlaceholder);
        this.translatePlaceholder('inputAddress2', t.neighborhoodPlaceholder);
        this.translatePlaceholder('customfield19', t.complementPlaceholder);
        this.translatePlaceholder('inputCity', t.cityPlaceholder);
        
        // Traduz checkbox
        const checkboxLabel = document.querySelector('.checkbox-label');
        if (checkboxLabel) checkboxLabel.textContent = t.legalPerson;
        
        // Traduz botões
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        if (nextBtn) {
            nextBtn.textContent = this.currentStep === this.totalSteps ? t.finishButton : t.nextButton;
        }
        if (prevBtn) prevBtn.textContent = t.prevButton;
        
        // Traduz títulos dos resumos
        const summaryHeaders = document.querySelectorAll('.summary-header h4');
        summaryHeaders.forEach((header, index) => {
            if (index === 0) header.textContent = t.summaryPersonalDataTitle;
            if (index === 1 && this.currentStep === 3) header.textContent = t.summaryAddressTitle;
        });
        
        console.log(`[Translation] Página traduzida para: ${language}`);
        this.applyStaticTranslations_();
        CountrySelect.relabel('inputCountry', language);
        const hdr = document.getElementById('headerCountrySelect');
        if (hdr) CountrySelect.relabel(hdr, language);

    }

    applyStaticTranslations_() {
        const t = this.translations || window.FormGeoI18n.getTranslation('pt-BR');
        if (!t) return;

        // ajudantes
        const setText = (sel, val) => { const el = document.querySelector(sel); if (el && val != null) el.textContent = val; };
        const setHTML = (sel, html) => { const el = document.querySelector(sel); if (el && html != null) el.innerHTML = html; };

        // ====== Senha / Segurança ======
        setText('#containerNewUserSecurity .section-title', t.passwordSectionTitle);
        setText('#newPassword1 label[for="inputNewPassword1"]', t.passwordLabel);
        setText('#newPassword2 label[for="inputNewPassword2"]', t.passwordConfirmLabel);

        // botão "Gerar Senha" (mantém o ícone)
        const genBtn = document.querySelector('.generate-password');
        if (genBtn) genBtn.innerHTML = `<i class="ls ls-refresh"></i>${t.passwordGenerate}`;

        // força da senha (strings globais usadas pelo script já existente)
        window.langPasswordWeak = t.passwordWeak;
        window.langPasswordModerate = t.passwordModerate;
        window.langPasswordStrong = t.passwordStrong;
        window.langPasswordTooShort = t.passwordTooShort;

        // acessibilidade da barra (prefixo do texto)
        const srOnly = document.querySelector('#passwordStrengthBar .sr-only');
        if (srOnly) srOnly.textContent = `${t.passwordRatingPrefix || ''}0%`;

        // mensagem de senhas não conferem
        const nonMatch = document.getElementById('nonMatchingPasswordResult');
        if (nonMatch) nonMatch.textContent = t.passwordMismatch;

        // ====== Mailing list ======
        setText('.section .section-header h2.section-title', t.mailingTitle);
        setText('.section .section-header p.section-desc', t.mailingDesc);
        setText('.panel-switch .switch-label', t.mailingReceived);

        // ====== Ajuda / help-blocks ======
        setText('label[for="customfield2"] + input + .help-block', t.helpCpf);
        setText('label[for="customfield3"] + input + .help-block', t.helpBirthdate);
        setText('label[for="customfield5"] + input + .help-block', t.helpCnpj);
        setText('label[for="customfield18"] + input + .help-block', t.helpNumber);
        setText('label[for="customfield19"] + input + .help-block', t.helpComplement);

        // ====== Botão principal (submit) ======
        setText('.form-actions .btn .btn-text', t.registerButton);

        // ====== Termos de serviço (mantém o link) ======
        const tosSpan = document.querySelector('.accepttos')?.closest('label')?.querySelector('span.label-required');
        if (tosSpan) {
            const link = tosSpan.querySelector('a');
            if (link) {
            // reconstrói: prefixo + link intacto
            tosSpan.innerHTML = '';
            tosSpan.append(document.createTextNode(t.tosPrefix || ''));
            tosSpan.appendChild(link);
            } else {
            setText('.accepttos + span.label-required', t.tosPrefix);
            }
        }
        }


    // ============================================
    // MÉTODO NOVO: translateLabel
    // Traduz um label específico
    // ============================================
    translateLabel(fieldId, text) {
        const label = document.querySelector(`label[for="${fieldId}"]`);
        if (label) {
            const hasRequired = label.querySelector('span');
            label.innerHTML = hasRequired ? `${text} <span>*</span>` : text;
        }
    }

    // ============================================
    // MÉTODO NOVO: translatePlaceholder
    // Traduz um placeholder específico
    // ============================================
    translatePlaceholder(fieldId, text) {
        const field = document.getElementById(fieldId);
        if (field) field.placeholder = text;
    }
    hideLoader() {
        console.log("hide loader called")
        const loader = document.getElementById('page-loader');
        if (!loader) return;
        loader.style.transition = 'opacity 0.4s ease';
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 400);
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                this.setupFormStructure();
                CountrySelect.relabel('inputCountry', this.currentLanguage);
                this.setupEventListeners();
                this.setupValidation();
                this.setupInputMasks();
                this.showStep(1);
                this.applyStaticTranslations_();
                this.setupCepFieldListener();
                this.toggleCnpjField(false);
                this.initializePhoneInput();
                this.setupCountryListener();
                this.setupHeaderCountryListener(); // ← NOVO: Listener do seletor de país no header

               /* const ensureTermsChecked = () => {
                const termsCheckbox = document.querySelector('input[name="accepttos"]');
                if (!termsCheckbox) return;

                // marca como aceito (para o WHMCS não barrar no submit)
                termsCheckbox.checked = true;
                termsCheckbox.dispatchEvent(new Event('change', { bubbles: true }));

                // esconde a seção inteira dos termos
                const termsSection =
                    termsCheckbox.closest('.section') ||
                    termsCheckbox.closest('.section-sm') ||
                    (termsCheckbox.closest('.section-body') && termsCheckbox.closest('.section-body').closest('.section'));

                if (termsSection) termsSection.style.display = 'none';

                clearInterval(interval); // usa o mesmo 'interval' que você já tem
                };


                const interval = setInterval(ensureTermsChecked, 200);*/

                this.hideLoader();


            }, 200);
        });
    }
    ensureNameFieldsExist() {
    const form = document.querySelector('.loginForm');
    console.log('[NameCheck] form encontrado?', !!form);
    if (!form) return;

    const ensure = (id, name) => {
        let el = document.getElementById(id) || form.querySelector(`input[name="${name}"]`);
        if (!el) {
        el = document.createElement('input');
        el.type = 'hidden';
        el.id = id;
        el.name = name;
        form.appendChild(el);
        console.log(`[NameCheck] ${name} CRIADO (hidden)`);
        } else {
        el.id = id;
        el.name = name;
        const group = el.closest('.form-group') || el.closest('.col-md-6');
        if (group) group.style.display = 'none';
        console.log(`[NameCheck] ${name} ENCONTRADO e ocultado`);
        }
        return el;
    };

    const first = ensure('inputFirstName', 'firstname');
    const last  = ensure('inputLastName',  'lastname');

    console.log('[NameCheck] resumo', {
        firstSelector: '#inputFirstName / [name="firstname"]',
        lastSelector:  '#inputLastName / [name="lastname"]',
        firstExists: !!first,
        lastExists:  !!last
    });
    }

    ensureReferralFieldExists() {
    const form = document.querySelector('.loginForm');
    console.log('[ReferralCheck] form encontrado?', !!form);
    if (!form) return null;

    // tenta achar por id OU pelo name correto do WHMCS
    let el = document.getElementById('customfield157') ||
            form.querySelector('input[name="customfield[157]"]');

    if (!el) {
        // cria o hidden compatível com WHMCS
        el = document.createElement('input');
        el.type = 'hidden';
        el.id = 'customfield157';       // útil pra selecionar no seu JS
        el.name = 'customfield[157]';   // ESSENCIAL pro WHMCS
        form.appendChild(el);
        console.log('[ReferralCheck] customfield[157] CRIADO (hidden)');
    } else {
        // normaliza e oculta o grupo original
        el.id = 'customfield157';
        el.name = 'customfield[157]';
        el.type = 'hidden';
        el.disabled = false;

        const group = el.closest('.form-group') || el.closest('.col-md-6');
        if (group) group.style.display = 'none';

        console.log('[ReferralCheck] customfield[157] ENCONTRADO e ocultado/normalizado');
    }

    // não use required em hidden; a validação é sua (JS) ou do servidor
    el.required = false;

    return el;
    }


    setupFormStructure() {
        this.createStepHeader();
        this.organizeFieldsIntoSteps();
        this.createNavigation();
        this.createSummaryBoxes();
        this.adjustContainer();
        this.ensureNameFieldsExist();
        this.ensureReferralFieldExists();
        this.translateLabel('inputEmail', (this.translations?.email || 'E-mail'));

    }

    initializePhoneInput() {
        const phoneInput = document.getElementById('inputPhone');
        if (phoneInput && window.intlTelInputGlobals) {
            this.iti = window.intlTelInputGlobals.getInstance(phoneInput);

            phoneInput.addEventListener("input", (e) => {
                this.applyPhoneMask(phoneInput, e);
            });
        }
    }

    // ============================================
    // MÉTODO MODIFICADO: createStepHeader
    // Agora inclui o seletor de país
    // ============================================
    createStepHeader() {
        const container = document.querySelector('.login-wrapper');
        const currencyGroup = this.findMoveableGroup('inputCurrency');

        if (container && currencyGroup) {
            currencyGroup.querySelector('label')?.remove();
            currencyGroup.classList.add('header-selector-group');

            const header = document.createElement('div');
            header.className = 'step-header';
            header.innerHTML = `
                <div class="header-top">
                    <div class="header-selectors-container">
                        <!-- Seletor de País -->
                        <div class="header-selector-group">
                            <select id="headerCountrySelect" class="header-select">
                              
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
            
            // Adiciona o seletor de moeda após o seletor de país
            const selectorsContainer = header.querySelector('.header-selectors-container');
            selectorsContainer.appendChild(currencyGroup);
            
            container.insertBefore(header, container.firstChild);
        }
    }

    // ============================================
    // MÉTODO NOVO: setupHeaderCountryListener
    // Sincroniza o seletor de país do header com o formulário
    // ============================================
    setupHeaderCountryListener() {
        const headerCountrySelect = document.getElementById('headerCountrySelect');
        const formCountrySelect = document.getElementById('inputCountry');
        CountrySelect.populate('headerCountrySelect', this.currentLanguage, []);

        if (headerCountrySelect && formCountrySelect) {
            // Sincroniza o valor inicial
            headerCountrySelect.value = formCountrySelect.value || 'BR';
            
            // Quando o usuário trocar o país no header
            headerCountrySelect.addEventListener('change', (e) => {
                const selectedCountry = e.target.value;
                
                // Atualiza o campo de país no formulário
                formCountrySelect.value = selectedCountry;
                
                // Dispara o evento change para acionar outras lógicas
                formCountrySelect.dispatchEvent(new Event('change', { bubbles: true }));
                
                // Traduz a página para o idioma do país
                const lang = window.FormGeoI18n.getCountryLanguage(selectedCountry);
                this.translatePage(lang);

                // Adapta os nomes dos campos conforme o país
                this.adaptFieldLabels(selectedCountry);
                
                console.log(`[Header Country] País alterado para: ${selectedCountry}`);
            });
            
            // Sincronização reversa: se o campo do formulário mudar, atualiza o header
            formCountrySelect.addEventListener('change', (e) => {
                headerCountrySelect.value = e.target.value;
                this.adaptFieldLabels(e.target.value);
            });
            
            // Aplica as labels iniciais
            this.adaptFieldLabels(headerCountrySelect.value);
        }
    }

    // ============================================
    // MÉTODO NOVO: adaptFieldLabels
    // Adapta os nomes dos campos conforme o país selecionado
    // ============================================
    adaptFieldLabels(countryCode) {
        const cpfLabel = document.querySelector('label[for="customfield2"]');
        const cnpjLabel = document.querySelector('label[for="customfield5"]');
        const cpfField = document.getElementById('customfield2');
        const cnpjField = document.getElementById('customfield5');
        
        // Define os labels conforme o país
        const fieldLabels = {
            'BR': {
                cpf: 'CPF',
                cnpj: 'CNPJ',
                cpfPlaceholder: '000.000.000-00',
                cnpjPlaceholder: '00.000.000/0000-00'
            },
            'US': {
                cpf: 'SSN',
                cnpj: 'EIN',
                cpfPlaceholder: '000-00-0000',
                cnpjPlaceholder: '00-0000000'
            },
            'PT': {
                cpf: 'NIF',
                cnpj: 'NIPC',
                cpfPlaceholder: '000000000',
                cnpjPlaceholder: '000000000'
            },
            'ES': {
                cpf: 'DNI',
                cnpj: 'CIF',
                cpfPlaceholder: '00000000A',
                cnpjPlaceholder: 'A00000000'
            },
            'AR': {
                cpf: 'DNI',
                cnpj: 'CUIT',
                cpfPlaceholder: '00.000.000',
                cnpjPlaceholder: '00-00000000-0'
            },
            'MX': {
                cpf: 'CURP',
                cnpj: 'RFC',
                cpfPlaceholder: 'AAAA000000AAAAAA00',
                cnpjPlaceholder: 'AAA000000AA0'
            },
            // Genérico para outros países
            'DEFAULT': {
                cpf: 'Documento de Identificação',
                cnpj: 'Registro Empresarial',
                cpfPlaceholder: '',
                cnpjPlaceholder: ''
            }
        };
        
        // Seleciona as labels apropriadas
        const labels = fieldLabels[countryCode] || fieldLabels['DEFAULT'];
        
        // Atualiza os labels
        if (cpfLabel) {
            const isRequired = cpfField?.required;
            cpfLabel.innerHTML = `${labels.cpf} ${isRequired ? '<span>*</span>' : ''}`;
        }
        
        if (cnpjLabel) {
            const isRequired = cnpjField?.required;
            cnpjLabel.innerHTML = `${labels.cnpj} ${isRequired ? '<span>*</span>' : ''}`;
        }
        
        // Atualiza os placeholders
        if (cpfField) {
            cpfField.placeholder = labels.cpfPlaceholder;
        }
        
        if (cnpjField) {
            cnpjField.placeholder = labels.cnpjPlaceholder;
        }
        
        console.log(`[Field Labels] Labels atualizados para: ${countryCode}`, labels);
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
        const states = window.FormGeoI18n.getStates(countryCode);

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
            phoneInputField.value = formatted;
        } catch (e) {
            console.error("⚠️ Erro formatando:", e);
            phoneInputField.value = rawNumber;
        }
    }

    getMaxDigitsForCountry(countryCode) {
        return window.FormGeoI18n.getPhoneMaxDigits(countryCode) ;


    }

    

    // ============================================
    // MÉTODO MODIFICADO: organizeFieldsIntoSteps
    // ============================================
    organizeFieldsIntoSteps() {
        const form = document.querySelector('.loginForm');
        if (!form) return;

        const stepsContainer = document.createElement('div');
        stepsContainer.className = 'steps-container';

        // STEP 1
        const step1 = this.createStep(1, [
        this.createFullNameField(),
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
        const termsSection = document.querySelector('input[name="accepttos"]')?.closest('.section');
        const mailingListSection = document.querySelector('input[name="marketingoptin"]')?.closest('.section');
        const referralSection = this.createReferralField();


        // === NORMALIZA TERMOS: mostrar no Step 3 e tornar obrigatório ===
        if (termsSection) {
        // revela se alguém escondeu antes
        termsSection.style.display = '';
        // tenta achar o checkbox
        const termsCheckbox = termsSection.querySelector('input[name="accepttos"]');
        if (termsCheckbox) {
            termsCheckbox.required = true;       // força validação local
            termsCheckbox.checked = false;       // não pré-marca
        }
        // título amigável (opcional)
        const header = termsSection.querySelector('.section-header .section-title');
        if (header && !/Termos/i.test(header.textContent)) {
            header.textContent = 'Termos de Serviço & Privacidade';
        }
        }


        const step3Elements = [passwordSection, mailingListSection, referralSection, termsSection];

        const step3 = this.createStep(3, step3Elements.filter(el => el !== null));

        stepsContainer.appendChild(step1);
        stepsContainer.appendChild(step2);
        stepsContainer.appendChild(step3);

        const originalSectionsContainer = document.getElementById('containerNewUserSignup');
        if (originalSectionsContainer) {
            originalSectionsContainer.innerHTML = '';
            originalSectionsContainer.appendChild(stepsContainer);
        }

        // ... depois de criar const step3 = this.createStep(3, step3Elements.filter(...))

        // pega o captcha e o clearfix que vem logo depois dele
        this.captchaEl = document.getElementById('captchaContainer');
        if (this.captchaEl) {
        // se o próximo irmão for um clearfix, guardamos também
        const next = this.captchaEl.nextElementSibling;
        if (next && next.classList && next.classList.contains('clearfix')) {
            this.captchaClearfix = next;
        }

        // move os elementos para dentro do conteúdo do step 3
        const step3Content = step3.querySelector('.step-content');
        // esconde inicialmente
        this.captchaEl.style.display = 'none';
        step3Content.appendChild(this.captchaEl);

        if (this.captchaClearfix) {
            this.captchaClearfix.style.display = 'none';
            step3Content.appendChild(this.captchaClearfix);
        }
        }

    }

    createFullNameField() {
        // Oculta os campos originais
        const firstNameGroup = this.findMoveableGroup('inputFirstName');
        const lastNameGroup = this.findMoveableGroup('inputLastName');
        
        if (firstNameGroup) firstNameGroup.style.display = 'none';
        if (lastNameGroup) lastNameGroup.style.display = 'none';

        // Cria o novo campo de nome completo
        const container = document.createElement('div');
        container.className = 'form-group col-md-12';
        container.innerHTML = `
            <label for="inputFullName">Nome Completo <span >*</span></label>
            <input 
                type="text" 
                id="inputFullName" 
                name="fullname" 
                class="form-control" 
                placeholder="Digite seu nome completo"
                required
                autocomplete="name"
            >
            <span class="error-message" id="fullNameError"></span>
        `;

        return container;
    }

    // ============================================
    // MÉTODO NOVO: validateAndMapFullName
    // ============================================
    validateAndMapFullName(fullNameInput) {
        const fullName = fullNameInput.value.trim();
        const errorSpan = document.getElementById('fullNameError');
        const firstNameInput = document.getElementById('inputFirstName');
        const lastNameInput = document.getElementById('inputLastName');

        // Remove mensagens de erro anteriores
        if (errorSpan) errorSpan.textContent = '';
        fullNameInput.classList.remove('error', 'success');

        // Valida se há pelo menos 2 palavras
        const nameParts = fullName.split(/\s+/).filter(part => part.length > 0);

        if (fullName === '') {
            // Campo vazio
            if (fullNameInput.dataset.touched === "true") {
                fullNameInput.classList.add('error');
                if (errorSpan) errorSpan.textContent = 'Por favor, insira seu nome completo';
            }
            return false;
        }

        if (nameParts.length < 2) {
            // Menos de 2 palavras
            fullNameInput.classList.add('error');
            if (errorSpan) errorSpan.textContent = 'Por favor, insira nome e sobrenome';
            return false;
        }

        // Validação bem-sucedida
        fullNameInput.classList.add('success');

        // Mapeia para os campos ocultos
        if (firstNameInput && lastNameInput) {
            firstNameInput.value = nameParts[0]; // Primeiro nome
            lastNameInput.value = nameParts.slice(1).join(' '); // Restante como sobrenome
            
            // Marca os campos ocultos como válidos
            firstNameInput.classList.add('success');
            lastNameInput.classList.add('success');
        }

        return true;
    }





    findMoveableGroup(elementId) { 
        const el = document.getElementById(elementId); 
        if (!el) return null; 
        return el.closest('.col-md-6') || el.closest('.form-group'); 
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

    createTwoColumnRow(groups) { 
        const row = document.createElement('div'); 
        row.className = 'row'; 
        groups.forEach(group => { 
            if (group) { 
                group.classList.add('col-md-6'); 
                row.appendChild(group); 
            } 
        }); 
        return row; 
    }

    createCheckboxField() { 
        const container = document.createElement('div'); 
        container.className = 'form-group col-md-12'; 
        container.innerHTML = ` 
            <label class="checkbox-container"> 
                <input type="checkbox" id="pessoaJuridica" name="pessoaJuridica"> 
                <span class="checkbox-label">Sou Pessoa Jurídica (usar CNPJ)</span> 
            </label> 
        `; 
        return container; 
    }

    createNavigation() { 
        const form = document.querySelector('.loginForm'); 
        if (!form) return; 
        const nav = document.createElement('div'); 
        nav.className = 'step-navigation'; 
        nav.innerHTML = ` 
            <button type="button" class="btn-step btn-prev" id="prevBtn">Voltar</button> 
            <button type="button" class="btn-step btn-next" id="nextBtn">Próximo</button> 
        `; 
        form.appendChild(nav); 
    }

    createSummaryBoxes() {
        const step2 = document.querySelector('.form-step[data-step="2"]');

        if (step2) {
            const summaryBox = document.createElement('div');
            summaryBox.className = 'summary-box';
            summaryBox.innerHTML = `
                <div class="summary-header">
                    <h4>Seus Dados Pessoais</h4>
                    <button type="button" class="edit-step-btn" data-target-step="1">✏️</button>
                </div>
                <div class="summary-content">
                    <p><strong>Nome:</strong> <span id="summaryNameStep2">-</span></p>
                    <p><strong>E-mail:</strong> <span id="summaryEmailStep2">-</span></p>
                    <p><strong>Telefone:</strong> <span id="summaryPhoneStep2">-</span></p>
                    <p><strong>CPF:</strong> <span id="summaryCpfStep2">-</span></p>
                    <p><strong>Data de Nascimento:</strong> <span id="summaryBirthdateStep2">-</span></p>
                </div>
            `;
            step2.querySelector('.step-content').insertBefore(summaryBox, step2.querySelector('.step-content').firstChild);
        }

        // Cria resumo no Step 3
        const step3 = document.querySelector('.form-step[data-step="3"]');
        if (step3) {
            const summaryContainer3 = document.createElement('div');
            summaryContainer3.className = 'summary-container';
            summaryContainer3.innerHTML = `
            <div class="summary-box" id="summaryPersonalInfoStep3" data-goto="1">
                <div class="summary-header">
                <h4>Informações Pessoais:</h4>
                <button type="button" class="edit-step-btn" data-target-step="1">✏️</button>
                </div>
                <div class="summary-content">
                <p><strong>Nome:</strong> <span id="summaryNameStep3">-</span></p>
                <p><strong>E-mail:</strong> <span id="summaryEmailStep3">-</span></p>
                <p><strong>Telefone:</strong> <span id="summaryPhoneStep3">-</span></p>
                <p><strong>CPF:</strong> <span id="summaryCpfStep3">-</span></p>
                <p><strong>Data de Nascimento:</strong> <span id="summaryBirthdateStep3">-</span></p>
                </div>
            </div>

            <div class="summary-box" id="summaryAddressStep3" data-goto="2">
                <div class="summary-header">
                <h4>Endereço:</h4>
                <button type="button" class="edit-step-btn" data-target-step="2">✏️</button>
                </div>
                <div class="summary-content">
                <p><strong>Rua:</strong> <span id="summaryStreetStep3">-</span></p>
                <p><strong>Número:</strong> <span id="summaryNumberStep3">-</span></p>
                <p><strong>Complemento:</strong> <span id="summaryComplementStep3">-</span></p>
                <p><strong>Bairro:</strong> <span id="summaryNeighborhoodStep3">-</span></p>
                <p><strong>CEP:</strong> <span id="summaryCepStep3">-</span></p>
                <p><strong>Cidade:</strong> <span id="summaryCityStep3">-</span></p>
                <p><strong>Estado:</strong> <span id="summaryStateStep3">-</span></p>
                <p><strong>País:</strong> <span id="summaryCountryStep3">-</span></p>
                </div>
            </div>
            `;
            // === PATCH STEP 3: sumário DEPOIS do bloco de senha ===
            const stepContent3 = step3.querySelector('.step-content');
            if (stepContent3) {
            const pwd = document.getElementById('containerNewUserSecurity');
            if (pwd && stepContent3.contains(pwd)) {
                // senha fica na frente; sumário vem logo depois
                pwd.insertAdjacentElement('afterend', summaryContainer3);
            } else {
                stepContent3.appendChild(summaryContainer3);
            }
            }

        }

        document.querySelectorAll('.edit-step-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetStep = parseInt(e.target.getAttribute('data-target-step'));
                this.currentStep = targetStep;
                this.showStep(targetStep);
            });
        });
    }

    updateSummary() {
    // Pessoais
    const fullName  = document.getElementById('inputFullName')?.value || '-';
    const email     = document.getElementById('inputEmail')?.value || '-';
    const phone     = document.getElementById('inputPhone')?.value || '-';
    const cpf       = document.getElementById('customfield2')?.value || '-';
    const birthdate = document.getElementById('customfield3')?.value || '-';

    // Endereço (campos)
    const street     = document.getElementById('inputAddress1')?.value || '-';
    const number     = document.getElementById('customfield18')?.value || '-';
    const complement = document.getElementById('customfield19')?.value || '-';
    const neighborhood = document.getElementById('inputAddress2')?.value || '-';
    const cep        = document.getElementById('inputPostcode')?.value || '-';
    const city       = document.getElementById('inputCity')?.value || '-';

    // Estado: prioriza o texto da option selecionada (ex.: "Minas Gerais")
    const stateSel   = document.getElementById('stateselect');
    const stateText  = stateSel
        ? (stateSel.options[stateSel.selectedIndex]?.text?.trim() || stateSel.value || '-')
        : '-';

    // País: idem — tenta o texto do <select>, senão código (ex.: "Brasil" ou "BR")
    const countrySel = document.getElementById('inputCountry') || document.getElementById('headerCountrySelect');
    const countryText = countrySel
        ? (countrySel.options[countrySel.selectedIndex]?.text?.trim() || countrySel.value || '-')
        : '-';

    // ===== Step 2 (box de dados pessoais) =====
    const summaryNameStep2       = document.getElementById('summaryNameStep2');
    const summaryEmailStep2      = document.getElementById('summaryEmailStep2');
    const summaryPhoneStep2      = document.getElementById('summaryPhoneStep2');
    const summaryCpfStep2        = document.getElementById('summaryCpfStep2');
    const summaryBirthdateStep2  = document.getElementById('summaryBirthdateStep2');

    if (summaryNameStep2)      summaryNameStep2.textContent = fullName;
    if (summaryEmailStep2)     summaryEmailStep2.textContent = email;
    if (summaryPhoneStep2)     summaryPhoneStep2.textContent = phone;
    if (summaryCpfStep2)       summaryCpfStep2.textContent = cpf;
    if (summaryBirthdateStep2) summaryBirthdateStep2.textContent = birthdate;

    // ===== Step 3 (pessoais) =====
    const summaryNameStep3       = document.getElementById('summaryNameStep3');
    const summaryEmailStep3      = document.getElementById('summaryEmailStep3');
    const summaryPhoneStep3      = document.getElementById('summaryPhoneStep3');
    const summaryCpfStep3        = document.getElementById('summaryCpfStep3');
    const summaryBirthdateStep3  = document.getElementById('summaryBirthdateStep3');

    if (summaryNameStep3)      summaryNameStep3.textContent = fullName;
    if (summaryEmailStep3)     summaryEmailStep3.textContent = email;
    if (summaryPhoneStep3)     summaryPhoneStep3.textContent = phone;
    if (summaryCpfStep3)       summaryCpfStep3.textContent = cpf;
    if (summaryBirthdateStep3) summaryBirthdateStep3.textContent = birthdate;

    // ===== Step 3 (endereço completo) =====
    const summaryStreetStep3       = document.getElementById('summaryStreetStep3');
    const summaryNumberStep3       = document.getElementById('summaryNumberStep3');
    const summaryComplementStep3   = document.getElementById('summaryComplementStep3');
    const summaryNeighborhoodStep3 = document.getElementById('summaryNeighborhoodStep3');
    const summaryCepStep3          = document.getElementById('summaryCepStep3');
    const summaryCityStep3         = document.getElementById('summaryCityStep3');
    const summaryStateStep3        = document.getElementById('summaryStateStep3');
    const summaryCountryStep3      = document.getElementById('summaryCountryStep3');

    if (summaryStreetStep3)       summaryStreetStep3.textContent       = street;
    if (summaryNumberStep3)       summaryNumberStep3.textContent       = number || '-';
    if (summaryComplementStep3)   summaryComplementStep3.textContent   = complement || '-';
    if (summaryNeighborhoodStep3) summaryNeighborhoodStep3.textContent = neighborhood || '-';
    if (summaryCepStep3)          summaryCepStep3.textContent          = cep;
    if (summaryCityStep3)         summaryCityStep3.textContent         = city;
    if (summaryStateStep3)        summaryStateStep3.textContent        = stateText;
    if (summaryCountryStep3)      summaryCountryStep3.textContent      = countryText;
    }


    adjustContainer() { 
        const container = document.querySelector('.login-wrapper'); 
        if (container) container.style.maxWidth = '700px'; 
    }

    setupEventListeners() {
        // dentro de setupEventListeners(), junto com os outros listeners
        document.addEventListener('input', (e) => {
        if (e.target && e.target.id === 'inputEmail') {
            // limpa erro de servidor para email ao editar
            if (this.serverEmailExists) {
            this.serverEmailExists = false;
            this.clearFieldError_('inputEmail');
            this.checkStepValidationForButton();
            }
        }
        if (e.target && e.target.id === 'customfield2') {
            // limpa erro de servidor para cpf ao editar
            if (this.serverCpfExists) {
            this.serverCpfExists = false;
            this.clearFieldError_('customfield2');
            this.checkStepValidationForButton();
            }
        }

        
            if (e.target.id === 'inputEmail' || e.target.id === 'customfield2') {
                // respeita suas regras locais já existentes
                this.validateField(e.target);
                // só chama servidor se o local estiver OK (o método já revalida de novo)
                this.checkEmailCpfDuplicate_();
            }
        });

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

    // ============================================
    // MÉTODO MODIFICADO: setupValidation
    // ============================================
    setupValidation() {
        const form = document.querySelector('.loginForm');
        if (!form) return;

        // Event listener de BLUR - MODIFICADO
        form.addEventListener('blur', (e) => {
            if (e.target.matches('.form-control, input[type="checkbox"]')) {
                e.target.dataset.touched = "true";
                
                // Validação especial para nome completo
                if (e.target.id === 'inputFullName') {
                    this.validateAndMapFullName(e.target);
                } else {
                    this.validateField(e.target);
                }
                
                this.checkStepValidationForButton();
            }
        }, true);

        // Event listener de INPUT - MODIFICADO
        form.addEventListener('input', (e) => {
            if (e.target.matches('.form-control, input[type="checkbox"]')) {
                
                // Validação em tempo real para nome completo
                if (e.target.id === 'inputFullName' && e.target.dataset.touched === "true") {
                    this.validateAndMapFullName(e.target);
                } else if (e.target.dataset.touched === "true") {
                    this.validateField(e.target);
                }
                
                this.checkStepValidationForButton();
            }
        });
    }

    setupInputMasks() {
    document.addEventListener('input', (e) => {
        const country = document.getElementById('inputCountry')?.value || 'BR';

        // CPF
        if (e.target.id === 'customfield2') {
        if (country === 'BR') this.applyCpfMask(e.target); // só mascara no BR
        // fora do BR: sem máscara (deixa livre)
        }

        // CNPJ
        if (e.target.id === 'customfield5') {
        if (country === 'BR') this.applyCnpjMask(e.target); // só mascara no BR
        // fora do BR: sem máscara (deixa livre)
        }

        // CEP / ZIP
        if (e.target.id === 'inputPostcode') {
        if (country === 'BR') this.applyCepMask(e.target);
        else if (country === 'US') this.applyZipCodeMask(e.target);
        // demais países: sem máscara
        }

        // Data de nascimento
        if (e.target.id === 'customfield3') this.applyDateMask(e.target);
    });
    }

    
setupCepFieldListener() {
  const cepField = document.getElementById('inputPostcode');
  if (!cepField) return;

  let debounceTimer = null;

  const triggerIfComplete = async () => {
    const country = document.getElementById('inputCountry')?.value;
    const digits = cepField.value.replace(/\D/g, '');

    // Valida automaticamente quando completar o tamanho do CEP (BR = 8)
    if (country === 'BR' && digits.length === 8 && cepField.dataset.lastValidated !== digits) {
      cepField.dataset.lastValidated = digits;
      await this.validateCepField(cepField);
    }
  };

  // Valida ao digitar quando atingir o tamanho do CEP
  cepField.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(triggerIfComplete, 150);
  });

  // Valida ao perder foco
  cepField.addEventListener('blur', async () => {
    cepField.dataset.lastValidated = ''; // força revalidação no blur
    await this.validateCepField(cepField);
  });

  // Valida em mudanças programáticas
  cepField.addEventListener('change', async () => {
    cepField.dataset.lastValidated = '';
    await this.validateCepField(cepField);
  });

  // Se já vier preenchido no load, tenta validar também
  setTimeout(triggerIfComplete, 0);
}


async validateCepField(cepField) {
    const cep = cepField.value.replace(/\D/g, '');  // Remove tudo que não for número
    const country = document.getElementById('inputCountry')?.value;

    if (country !== 'BR' || cep.length !== 8) return;  // Só valida se for CEP do Brasil com 8 dígitos

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
            this.showCepError('CEP inválido. Verifique e tente novamente.');
            this.checkStepValidationForButton();  // Atualiza o botão "Próximo"
        } else {
            this.showCepError('');
            // Preenche os campos de endereço com os dados do CEP
            const addressField = document.getElementById('inputAddress1');
            const neighborhoodField = document.getElementById('inputAddress2');
            const cityField = document.getElementById('inputCity');
            const stateField = document.getElementById('stateselect');

            if (addressField) addressField.value = data.logradouro || '';
            if (neighborhoodField) neighborhoodField.value = data.bairro || '';
            if (cityField) cityField.value = data.localidade || '';
            if (stateField) stateField.value = data.uf || '';

            this.showAddressFields(true);  // Exibe os campos de endereço
            this.checkStepValidationForButton();  // Atualiza o botão "Próximo"
        }
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        this.showCepError('Erro ao buscar CEP. Tente novamente.');
    }
}

    showAddressFields(shouldShow) {
        const addressFields = ['inputAddress1', 'inputAddress2', 'inputCity', 'stateselect', 'customfield18', 'customfield19'];
        
        addressFields.forEach(id => {
            const group = this.findMoveableGroup(id);
            if (group) {
                group.style.display = shouldShow ? 'block' : 'none';
            }
        });
    }

    showStep(stepNumber) {
        document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
        const targetStep = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
        if (targetStep) targetStep.classList.add('active');

        document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
            indicator.classList.remove('active', 'completed');
            if (index + 1 < stepNumber) indicator.classList.add('completed');
            if (index + 1 === stepNumber) indicator.classList.add('active');
        });

        const progressLine = document.getElementById('progressLine');
        if (progressLine) {
            const progress = ((stepNumber - 1) / (this.totalSteps - 1)) * 100;
            progressLine.style.width = `${progress}%`;
        }

        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        if (prevBtn) prevBtn.style.display = stepNumber === 1 ? 'none' : 'block';
        if (nextBtn) nextBtn.textContent = stepNumber === this.totalSteps ? 'Finalizar' : 'Próximo';

        this.updateStepContent(stepNumber);
        
        // Atualiza o resumo quando chegar no step 2 ou 3
        if (stepNumber === 2 || stepNumber === 3) {
            this.updateSummary(); // ← ADICIONE ESTA LINHA
        }
        
        this.checkStepValidationForButton();
        // exibe o captcha apenas no step 3
        if (this.captchaEl) {
        this.captchaEl.style.display = (stepNumber === 3 ? '' : 'none');
        }
        if (this.captchaClearfix) {
        this.captchaClearfix.style.display = (stepNumber === 3 ? '' : 'none');
        }

        // exibe Termos só no step 3 (opcional, caso o tema mexa)
        const termsInStep3 = document.querySelector('.form-step.step-3 input[name="accepttos"]')?.closest('.section');
        if (termsInStep3) {
        termsInStep3.style.display = (stepNumber === 3 ? '' : 'none');
        }


    }
    updateStepContent(stepNumber) {
        const t = this.translations;
        const titles = t ? t.stepTitles : ['Dados Pessoais', 'Endereço', 'Segurança'];
        const subtitles = t ? t.stepSubtitles : [
            'Preencha suas informações básicas',
            'Informe seu endereço completo',
            'Crie sua senha de acesso'
        ];

        const titleEl = document.getElementById('stepTitle');
        const subtitleEl = document.getElementById('stepSubtitle');
        if (titleEl) titleEl.textContent = titles[stepNumber - 1] || '';
        if (subtitleEl) subtitleEl.textContent = subtitles[stepNumber - 1] || '';
        
        // Atualiza o texto do botão conforme o idioma
        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn && t) {
            nextBtn.textContent = stepNumber === this.totalSteps ? t.finishButton : t.nextButton;
        }
    }

    async nextStep() {
    const nextBtn = document.getElementById('nextBtn');
    const t = this.translations || window.FormGeoI18n.getTranslation('pt-BR');
    const validatingLabel = (t && t.validating) ? t.validating : 'Validando...';
    // guarda label antigo só por garantia (não estraga nada)
    const oldLabel = nextBtn ? nextBtn.textContent : '';

    // Se estivermos no Step 1, mostra "Validando..." e trava o botão
    if (this.currentStep === 1 && nextBtn) {
        nextBtn.disabled = true;
        nextBtn.textContent = validatingLabel;
    }

    try {
        if (this.currentStep == 1) {
        const email = (document.getElementById('inputEmail')?.value || '').trim();
        const cpf = (document.getElementById('customfield2')?.value || '').trim();

        try {
            let resp = null;
            if (this.urlvalidateemailcpf) {
            resp = await fetch(this.urlvalidateemailcpf, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, cpf }),
                credentials: 'omit'
            });
            } else {
            // se por algum motivo a URL não existir, pula a validação remota
            resp = null;
            }

            if (resp) {
            if (!resp.ok) {
                console.error('[validate] resposta HTTP', resp.status);
                // mostra erro genérico (usa showFieldError_ se tiver)
                this.showFieldError_?.('inputEmail', t.errorNetwork || 'Erro de validação. Tente novamente.');
                this.checkStepValidationForButton();
                return;
            }

            const data = await resp.json();

            // limpa erros de servidor anteriores
            this.clearFieldError_?.('inputEmail');
            this.clearFieldError_?.('customfield2');

            // marca flags internas (assuma que você já tem serverCpfExists/serverEmailExists; se não, cria)
            this.serverCpfExists = !!data.cpf;
            this.serverEmailExists = !!data.email;

            // mostra mensagens específicas
            if (this.serverCpfExists) {
                this.showFieldError_?.('customfield2', t.errorCpfExists || 'CPF já cadastrado.');
            }
            if (this.serverEmailExists) {
                this.showFieldError_?.('inputEmail', t.errorEmailExists || 'E-mail já cadastrado.');
            }

            // atualiza o estado do botão (vai desabilitar se alguma flag for true)
            this.checkStepValidationForButton();

            // se houver duplicidade, não avança — o usuário precisa editar os campos
            if (this.serverCpfExists || this.serverEmailExists) {
                return;
            }
            }

        } catch (err) {
            console.error('Erro ao fazer requisição de validação:', err);
            this.showFieldError_?.('inputEmail', t.errorNetwork || 'Erro ao validar. Tente novamente.');
            this.checkStepValidationForButton();
            return;
        }
        }

        // se passou pela validação do step 1 (ou não era step 1), segue o fluxo normal
        if (this.currentStep < this.totalSteps) {
        this.currentStep++;
        this.showStep(this.currentStep);
        } else {
        this.submitForm();
        }

    } finally {
        // restaura o texto do botão baseado no step atual (showStep pode já ter ajustado,
        // mas asseguramos que volte ao label correto)
        if (nextBtn) {
         const t2 = this.translations || window.FormGeoI18n.getTranslation('pt-BR');

            nextBtn.textContent = (this.currentStep === this.totalSteps) ? (t2.finishButton || 'Finalizar') : (t2.nextButton || 'Próximo');

        // reavalia se o botão deve estar habilitado (considera flags de servidor)
        this.checkStepValidationForButton();
        }
    }
    }


    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.showStep(this.currentStep);
        }
    }

    // ===== CPF real (BR): valida dígito verificador =====
    isValidCpf_(value) {
        if (!value) return false;
        const cpf = String(value).replace(/\D/g, '');
        if (cpf.length !== 11) return false;

        // rejeita sequências do tipo 00000000000, 11111111111, etc.
        if (/^(\d)\1{10}$/.test(cpf)) return false;

        // DV1
        let sum = 0;
        for (let i = 0; i < 9; i++) sum += parseInt(cpf[i], 10) * (10 - i);
        let dv1 = (sum * 10) % 11;
        if (dv1 === 10) dv1 = 0;
        if (dv1 !== parseInt(cpf[9], 10)) return false;

        // DV2
        sum = 0;
        for (let i = 0; i < 10; i++) sum += parseInt(cpf[i], 10) * (11 - i);
        let dv2 = (sum * 10) % 11;
        if (dv2 === 10) dv2 = 0;
        if (dv2 !== parseInt(cpf[10], 10)) return false;

        return true;
    }


    validateField(field) {
        const group = field.closest('.form-group') || field.closest('.col-md-6');
        if (!group) return true;

        // Remove SOMENTE erros locais, preservando erros de servidor
        group.querySelectorAll('.error-message:not(.server-error)').forEach(n => n.remove());

        // Se já existe erro de servidor nesse campo, não sobrescreva a UI.
        // Ainda assim, podemos validar e retornar o boolean, mas sem mexer no DOM.
        const hasServerError = !!group.querySelector('.error-message.server-error');

        // Não “limpa” classe se existe erro de servidor
        if (!hasServerError) {
        field.classList.remove('error', 'success');
        }


        const value = field.value.trim();
        const digits = value.replace(/\D/g, '');
        const country = document.getElementById('inputCountry')?.value || 'BR';

        let isValid = true;
        let errorMessage = '';

        if (field.type === 'checkbox') {
            isValid = field.checked;
        } else if (field.required && !value) {
            isValid = false;
            errorMessage = 'Este campo é obrigatório.';
        } else if (value && field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            isValid = false;
            errorMessage = 'E-mail inválido.';
        } else if (field.id === 'customfield2') { // CPF / Doc Pessoa Física
            if (country === 'BR') {
                if (field.required && !value) {
                isValid = false; errorMessage = 'Este campo é obrigatório.';
                } else if (value && !this.isValidCpf_(value)) {
                isValid = false; errorMessage = 'CPF inválido.';
                }
            } else {
                // Fora do BR: se obrigatório, precisa ter ao menos 1 dígito; se opcional e vazio, ok
                if (field.required && digits.length < 1) {
                isValid = false; errorMessage = 'Este campo é obrigatório.';
                }
            }
        } else if (field.id === 'customfield5') { // CNPJ / Doc Pessoa Jurídica
            if (country === 'BR') {
            if ((field.required && digits.length !== 14) || (!field.required && value && digits.length !== 14)) {
                isValid = false; errorMessage = 'CNPJ inválido.';
            }
            } else {
            if (field.required && digits.length < 1) { isValid = false; errorMessage = 'Este campo é obrigatório.'; }
            }
        } else if (field.id === 'inputPostcode' && country === 'BR' && digits.length < 8) {
            isValid = false;
            errorMessage = 'CEP inválido.';
        } else if (field.id === 'customfield3') { // Data de Nascimento (DD/MM/AAAA)
        // Se estiver vazia e não for obrigatória, é válido
        if (!value) {
            isValid = !field.required;
        } else if (value.length < 10) {
            // Incompleta: não marca erro nem sucesso, e não bloqueia
            field.classList.remove('error', 'success');
            return true; // sai "neutro"
        } else {
            // Completou 10 chars: valida formato e data real
            const m = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
            if (!m) {
            isValid = false;
            errorMessage = 'Data inválida.';
            } else {
            const d = parseInt(m[1], 10);
            const mo = parseInt(m[2], 10);
            const y = parseInt(m[3], 10);
            const dt = new Date(y, mo - 1, d);
            // confere se a data “bate” (evita 31/02, etc.)
            if (dt.getFullYear() !== y || (dt.getMonth() + 1) !== mo || dt.getDate() !== d) {
                isValid = false;
                errorMessage = 'Data inválida.';
            }
            }
        }
        }


        if (!isValid) {
        if (!hasServerError) {
            field.classList.add('error');
            const errorEl = document.createElement('span');
            errorEl.className = 'error-message';
            errorEl.textContent = errorMessage;
            group.appendChild(errorEl);
        }
        } else if ((value || field.checked) && !hasServerError) {
        field.classList.add('success');
        }
        return isValid && !hasServerError; // servidor com erro mantém o false

    }

async checkStepValidationForButton() {
  const nextBtn = document.getElementById('nextBtn');
  if (!nextBtn) return;

  const currentStepEl = document.querySelector(`.form-step.step-${this.currentStep}`);
  if (!currentStepEl) return;

  const fields = currentStepEl.querySelectorAll('input[required], select[required]:not(#referralSelect), #inputPhone, #customfield18, #customfield3');
  let allValid = true;

  fields.forEach(field => {
    if (field.offsetParent !== null) {
      if (field.id === 'inputFullName') {
        const ok = this.validateAndMapFullName(field);
        if (!ok) allValid = false;
      } else {
        if (!field.value.trim() && field.type !== 'checkbox') allValid = false;
        if (field.type === 'checkbox' && !field.checked) allValid = false;
      }
    }
  });

  // Regras específicas
  const country = document.getElementById('inputCountry')?.value || 'BR';

  // Step 1: CPF/CNPJ por país
    if (this.currentStep === 1) {
    const cpfField = document.getElementById('customfield2');
    const cnpjField = document.getElementById('customfield5');
    const pessoaJuridica = document.getElementById('pessoaJuridica');
    const companyNameField = document.getElementById('inputCompanyName');
    const country = document.getElementById('inputCountry')?.value || 'BR';

    // CPF (PF): usa verificador real no BR; fora do BR exige algo apenas se required
    if (cpfField && cpfField.offsetParent !== null && !(pessoaJuridica && pessoaJuridica.checked)) {
        const cpfVal = (cpfField.value || '').trim();
        const cpfDigits = cpfVal.replace(/\D/g, '');
        let okCpf = true;

        if (country === 'BR') {
        okCpf = this.isValidCpf_(cpfVal); // ← valida DV real
        } else {
        okCpf = cpfField.required ? (cpfDigits.length >= 1) : true;
        }



        if (!okCpf) allValid = false;
    }

    if (pessoaJuridica && pessoaJuridica.checked) {
      if (cnpjField && cnpjField.offsetParent !== null) {
        const cnpjDigits = (cnpjField.value || '').replace(/\D/g, '');
        if (country === 'BR') {
          if (cnpjField.required && cnpjDigits.length !== 14) allValid = false;
        } else {
          if (cnpjField.required && cnpjDigits.length < 1) allValid = false;
        }
      }
      if (companyNameField && companyNameField.required && companyNameField.offsetParent !== null) {
        if (!companyNameField.value.trim()) allValid = false;
      }
    }
  }

  // Step 2: CEP somente obriga no BR
  if (this.currentStep === 2) {
    const cepField = document.getElementById('inputPostcode');
    if (country === 'BR' && cepField) {
      const cep = cepField.value.replace(/\D/g, '');
      if (cep.length !== 8 || cepField.classList.contains('error')) allValid = false;
    }
  }

    // bloqueia se servidor indicou duplicidade
    if (this.serverCpfExists || this.serverEmailExists) {
    allValid = false;
    }
    // Step 3: exige aceitar Termos
    if (this.currentStep === 3) {
    const tos = document.querySelector('.form-step.step-3 input[name="accepttos"]');
    if (tos && !tos.checked) {
        allValid = false;
    }
    }

  nextBtn.disabled = !allValid;
}

getFieldGroupById_(id){
  const el = document.getElementById(id);
  return el ? (el.closest('.form-group') || el.closest('.col-md-6')) : null;
}

showFieldError_(id, msg){
  const group = this.getFieldGroupById_(id);
  const field = document.getElementById(id);
  if (!group || !field) return;
  // remove erros antigos deste grupo
  group.querySelectorAll('.error-message.server-error, .error-message').forEach(n => n.remove());
  field.classList.remove('success');
  field.classList.add('error');
  const err = document.createElement('span');
  err.className = 'error-message server-error';
  err.textContent = msg;
  group.appendChild(err);
}

clearFieldError_(id){
  const group = this.getFieldGroupById_(id);
  const field = document.getElementById(id);
  if (!group || !field) return;
  group.querySelectorAll('.error-message.server-error').forEach(n => n.remove());
  // não remove mensagens de validação local (caso queira remover tudo com: '.error-message')
  field.classList.remove('error');
}

    showCepError(message) {
        const cepField = document.getElementById('inputPostcode');
        const group = cepField?.closest('.form-group') || cepField?.closest('.col-md-6');
        if (!group) return;

        const existingError = group.querySelector('.error-message');
        if (existingError) existingError.remove();

        if (message) {
            cepField.classList.add('error');
            const errorEl = document.createElement('span');
            errorEl.className = 'error-message';
            errorEl.textContent = message;
            group.appendChild(errorEl);
        } else {
            cepField.classList.remove('error');
            cepField.classList.add('success');
        }
    }

    applyCpfMask(field) { 
        let value = field.value.replace(/\D/g, ''); 
        value = value.substring(0, 11); 
        value = value.replace(/(\d{3})(\d)/, '$1.$2'); 
        value = value.replace(/(\d{3})(\d)/, '$1.$2'); 
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); 
        field.value = value; 
    }

    applyCnpjMask(field) { 
        let value = field.value.replace(/\D/g, ''); 
        value = value.substring(0, 14); 
        value = value.replace(/^(\d{2})(\d)/, '$1.$2'); 
        value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3'); 
        value = value.replace(/\.(\d{3})(\d)/, '.$1/$2'); 
        value = value.replace(/(\d{4})(\d)/, '$1-$2'); 
        field.value = value; 
    }

    applyCepMask(field) { 
        let value = field.value.replace(/\D/g, ''); 
        value = value.substring(0, 8); 
        value = value.replace(/^(\d{5})(\d)/, '$1-$2'); 
        field.value = value; 
    }

    applyZipCodeMask(field) { 
        let value = field.value.replace(/\D/g, ''); 
        value = value.substring(0, 5); 
        field.value = value; 
    }

    applyDateMask(field) { 
        let value = field.value.replace(/\D/g, ''); 
        value = value.substring(0, 8); 
        value = value.replace(/^(\d{2})(\d)/, '$1/$2'); 
        value = value.replace(/(\d{2})(\d)/, '$1/$2'); 
        field.value = value; 
    }

    submitForm() {
        console.log('[Submit] Iniciando processo de envio do formulário...');
        const form = document.querySelector('.loginForm');
        if (!form) {
            console.error('[Submit] ❌ Formulário não encontrado');
            return;
        }

        // 1) Encontre o botão de submit que tem a classe que o WHMCS injeta p/ o captcha
        const submitBtn = form.querySelector('button[type="submit"]');

        if (!submitBtn) {
            console.error('[Submit] ❌ Botão de submit do WHMCS não encontrado');
            return;
        }

        // 2) Se for reCAPTCHA invisível, o clique no botão aciona o fluxo do captcha
        //    (NÃO use form.submit(), pois isso ignora o captcha)
        console.log('[Submit] ✅ Disparando clique no botão para acionar o captcha invisível');
        submitBtn.click();
    }

    // ==============================
// NOVO: opções e placeholders
// ==============================
getReferralOptions_() {
  return [
    { value: '',               label: 'Selecione...' ,         ph: '' },
    { value: 'Redes sociais',  label: 'Redes sociais',          ph: 'Ex.: Instagram, TikTok, Facebook...' },
    { value: 'Indicação',      label: 'Indicação de amigo(a)',  ph: 'Quem indicou?' },
    { value: 'Google',         label: 'Google (Busca/Ads)',     ph: 'Ex.: palavra-chave ou origem' },
    { value: 'YouTube',        label: 'YouTube',                ph: 'Canal ou vídeo?' },
    { value: 'Blog/Artigo',    label: 'Blog/Artigo',            ph: 'Qual blog/artigo?' },
    { value: 'Evento',         label: 'Evento/Palestra',        ph: 'Qual evento?' },
    { value: 'E-mail',         label: 'E-mail/Newsletter',      ph: 'Qual campanha/lista?' },
    { value: 'Marketplace',    label: 'Marketplace',            ph: 'Qual marketplace?' },
    { value: 'Outros',         label: 'Outros',                 ph: 'Descreva...' },
  ];
}

// ======================================
// NOVO: UI do "Por onde nos conheceu"
// Usa o input hidden original (customfield157)
// ======================================
createReferralField() {
  // esconde o campo original do WHMCS mas mantém para submit
  const origGroup = this.findMoveableGroup('customfield157');
  const hiddenInput = document.getElementById('customfield157');
  if (origGroup) origGroup.style.display = 'none';
  if (hiddenInput) {
    hiddenInput.type = 'hidden';                // garante que não apareça
    hiddenInput.required = false;                // tornamos obrigatório (via validação custom)
    hiddenInput.dataset.referral = 'true';      // flag interna
  }

  const opts = this.getReferralOptions_();

  const wrap = document.createElement('div');
  wrap.className = 'form-group col-md-12';
  wrap.id = 'referralWrapper';
  wrap.innerHTML = `
    <label for="referralSelect">Por onde nos conheceu</label>
    <div class="row">
      <div class="col-md-6">
        <select id="referralSelect" class="form-control">
          ${opts.map(o => `<option value="${o.value}">${o.label}</option>`).join('')}
        </select>
      </div>
      <div class="col-md-6">
        <input id="referralDetail" class="form-control" type="text" placeholder="" style="display:none;">
      </div>
    </div>
    <span class="error-message" id="referralError"></span>
  `;

  // listeners
  const onChange = () => {
    const select = wrap.querySelector('#referralSelect');
    const detail = wrap.querySelector('#referralDetail');
    const err    = wrap.querySelector('#referralError');
    const hidden = document.getElementById('customfield157');

    // placeholder dinâmico + mostrar/ocultar detalhe
    const meta = opts.find(o => o.value === select.value) || { ph: '' };
    if (select.value) {
      detail.placeholder = meta.ph || '';
      // mostra o campo "quem/qual" para tudo que não seja vazio
      detail.style.display = (select.value ? 'block' : 'none');
    } else {
      detail.value = '';
      detail.style.display = 'none';
    }

    // atualiza hidden
    const joined = this.joinReferralValue_(select.value, detail.value);
    if (hidden) hidden.value = joined;

    // valida
    this.validateReferral_();
    this.checkStepValidationForButton();
  };

  // input/blur atualizam hidden + validação
  wrap.addEventListener('change', (e) => {
    if (e.target.id === 'referralSelect') onChange();
  });
  wrap.addEventListener('input', (e) => {
    if (e.target.id === 'referralDetail') onChange();
  });
  wrap.addEventListener('blur', (e) => {
    if (e.target.id === 'referralSelect' || e.target.id === 'referralDetail') {
      e.target.dataset.touched = 'true';
      this.validateReferral_();
      this.checkStepValidationForButton();
    }
  }, true);

  // estado inicial
  setTimeout(onChange, 0);

  return wrap;
}

// ======================================
// NOVO: junta select + detalhe no formato final
// ======================================
joinReferralValue_(sel, det) {
  const s = (sel || '').trim();
  const d = (det || '').trim();
  if (!s) return '';
  return d ? `${s} - ${d}` : s;
}

// ======================================
// NOVO: validação do bloco de referral
// Regras: select é obrigatório; se select tiver valor, "detalhe" também é obrigatório
// ======================================
validateReferral_() {
  const wrap = document.getElementById('referralWrapper');
  if (!wrap) return true;

  const select = wrap.querySelector('#referralSelect');
  const detail = wrap.querySelector('#referralDetail');
  const hidden = document.getElementById('customfield157');

  // Mantém o hidden coerente, mesmo que vazio
  if (hidden) hidden.value = this.joinReferralValue_(select?.value || '', detail?.value || '');

  // Nada de erros, nada de bloquear
  return true;
}




    // ============================================

}

new StepByStepForm();
