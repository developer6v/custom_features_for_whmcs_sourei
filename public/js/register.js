// JavaScript Customizado para Ajustar Layout e Funcionalidades

document.addEventListener('DOMContentLoaded', function() {
    
    // Função para ajustar títulos e textos
    function adjustTitlesAndTexts() {
        // Alterar título principal
        const pageTitle = document.querySelector('.page-title, h1');
        if (pageTitle) {
            pageTitle.textContent = 'Abra a sua conta';
        }
        
        // Alterar subtítulo da seção
        const sectionTitle = document.querySelector('.section-title');
        if (sectionTitle) {
            sectionTitle.textContent = 'Preencha os campos abaixo para criar sua conta';
        }
        
        // Ajustar texto do botão
        const submitBtn = document.querySelector('button[type="submit"] .btn-text');
        if (submitBtn) {
            submitBtn.textContent = 'Próximo';
        }
    }
    
    // Função para ajustar placeholders dos campos
    function adjustPlaceholders() {
        const fieldMappings = {
            'inputFirstName': 'Digite seu nome Completo',
            'inputLastName': '', // Será ocultado
            'inputPhone': 'Seu Número',
            'inputEmail': 'Insira seu e-mail',
            'inputCompanyName': 'Coloque seu CPF',
            'inputAddress1': 'data de nascimento'
        };
        
        Object.keys(fieldMappings).forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && fieldMappings[fieldId]) {
                field.placeholder = fieldMappings[fieldId];
            }
        });
    }
    
    // Função para reorganizar campos conforme layout de referência
    function reorganizeFields() {
        const form = document.querySelector('.loginForm');
        if (!form) return;
        
        // Criar nova estrutura
        const newStructure = document.createElement('div');
        newStructure.className = 'custom-form-structure';
        
        // Campo Nome Completo (usar o campo Nome existente)
        const firstNameGroup = document.querySelector('#inputFirstName').closest('.form-group');
        if (firstNameGroup) {
            const label = firstNameGroup.querySelector('label');
            if (label) {
                label.textContent = 'Nome Completo';
            }
            newStructure.appendChild(firstNameGroup);
        }
        
        // Linha com Número e E-mail
        const phoneGroup = document.querySelector('#inputPhone').closest('.form-group');
        const emailGroup = document.querySelector('#inputEmail').closest('.form-group');
        
        if (phoneGroup && emailGroup) {
            const row1 = document.createElement('div');
            row1.className = 'row';
            
            const col1 = document.createElement('div');
            col1.className = 'col-md-6';
            col1.appendChild(phoneGroup);
            
            const col2 = document.createElement('div');
            col2.className = 'col-md-6';
            col2.appendChild(emailGroup);
            
            row1.appendChild(col1);
            row1.appendChild(col2);
            newStructure.appendChild(row1);
        }
        
        // Linha com CPF e Data de Nascimento
        const companyGroup = document.querySelector('#inputCompanyName').closest('.form-group');
        const addressGroup = document.querySelector('#inputAddress1').closest('.form-group');
        
        if (companyGroup && addressGroup) {
            // Ajustar labels
            const companyLabel = companyGroup.querySelector('label');
            const addressLabel = addressGroup.querySelector('label');
            
            if (companyLabel) {
                companyLabel.textContent = 'CPF';
                companyLabel.classList.add('label-required');
            }
            
            if (addressLabel) {
                addressLabel.textContent = 'Data de Nascimento';
                addressLabel.classList.add('label-required');
            }
            
            // Ajustar tipo do campo de data
            const addressInput = document.getElementById('inputAddress1');
            if (addressInput) {
                addressInput.type = 'date';
                addressInput.className += ' date-input-container';
            }
            
            const row2 = document.createElement('div');
            row2.className = 'row';
            
            const col3 = document.createElement('div');
            col3.className = 'col-md-6';
            col3.appendChild(companyGroup);
            
            const col4 = document.createElement('div');
            col4.className = 'col-md-6';
            col4.appendChild(addressGroup);
            
            row2.appendChild(col3);
            row2.appendChild(col4);
            newStructure.appendChild(row2);
        }
        
        // Adicionar checkbox "Pessoa Jurídica (CNPJ)"
        const checkboxContainer = document.createElement('div');
        checkboxContainer.className = 'checkbox-container';
        checkboxContainer.innerHTML = `
            <input type="checkbox" id="pessoaJuridica" name="pessoa_juridica">
            <label for="pessoaJuridica">Pessoa Jurídica (CNPJ)</label>
        `;
        newStructure.appendChild(checkboxContainer);
        
        // Ocultar campos desnecessários
        const fieldsToHide = [
            '#inputLastName',
            '#inputCity',
            '#inputCountry',
            '#inputAddress2',
            '#stateinput',
            '#inputPostcode'
        ];
        
        fieldsToHide.forEach(selector => {
            const field = document.querySelector(selector);
            if (field) {
                const group = field.closest('.form-group, .row');
                if (group) {
                    group.style.display = 'none';
                }
            }
        });
        
        // Substituir conteúdo do formulário
        const personalInfo = document.getElementById('personalInformation');
        if (personalInfo) {
            personalInfo.innerHTML = '';
            personalInfo.appendChild(newStructure);
        }
    }
    
    // Função para ajustar campos de senha
    function adjustPasswordFields() {
        const passwordSection = document.querySelector('.using-password-strength');
        if (passwordSection) {
            passwordSection.style.display = 'none';
        }
    }
    
    // Função para adicionar funcionalidade ao checkbox
    function addCheckboxFunctionality() {
        setTimeout(() => {
            const checkbox = document.getElementById('pessoaJuridica');
            const cpfField = document.getElementById('inputCompanyName');
            const cpfLabel = document.querySelector('label[for="inputCompanyName"]');
            
            if (checkbox && cpfField && cpfLabel) {
                checkbox.addEventListener('change', function() {
                    if (this.checked) {
                        cpfLabel.textContent = 'CNPJ';
                        cpfField.placeholder = 'Coloque seu CNPJ';
                    } else {
                        cpfLabel.textContent = 'CPF';
                        cpfField.placeholder = 'Coloque seu CPF';
                    }
                });
            }
        }, 100);
    }
    
    // Função para adicionar máscara de CPF/CNPJ
    function addInputMasks() {
        setTimeout(() => {
            const cpfField = document.getElementById('inputCompanyName');
            const phoneField = document.getElementById('inputPhone');
            
            if (cpfField) {
                cpfField.addEventListener('input', function(e) {
                    let value = e.target.value.replace(/\D/g, '');
                    const checkbox = document.getElementById('pessoaJuridica');
                    
                    if (checkbox && checkbox.checked) {
                        // Máscara CNPJ: 00.000.000/0000-00
                        if (value.length <= 14) {
                            value = value.replace(/^(\d{2})(\d)/, '$1.$2');
                            value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
                            value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
                            value = value.replace(/(\d{4})(\d)/, '$1-$2');
                        }
                    } else {
                        // Máscara CPF: 000.000.000-00
                        if (value.length <= 11) {
                            value = value.replace(/(\d{3})(\d)/, '$1.$2');
                            value = value.replace(/(\d{3})(\d)/, '$1.$2');
                            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                        }
                    }
                    
                    e.target.value = value;
                });
            }
            
            if (phoneField) {
                phoneField.addEventListener('input', function(e) {
                    let value = e.target.value.replace(/\D/g, '');
                    
                    // Máscara telefone: (00) 00000-0000
                    if (value.length <= 11) {
                        value = value.replace(/^(\d{2})(\d)/, '($1) $2');
                        value = value.replace(/(\d{5})(\d)/, '$1-$2');
                    }
                    
                    e.target.value = value;
                });
            }
        }, 100);
    }
    
    // Função para melhorar a validação
    function enhanceValidation() {
        const form = document.querySelector('.loginForm');
        if (form) {
            form.addEventListener('submit', function(e) {
                const requiredFields = [
                    'inputFirstName',
                    'inputPhone', 
                    'inputEmail',
                    'inputCompanyName',
                    'inputAddress1'
                ];
                
                let isValid = true;
                
                requiredFields.forEach(fieldId => {
                    const field = document.getElementById(fieldId);
                    if (field && !field.value.trim()) {
                        field.style.borderColor = '#ef4444';
                        isValid = false;
                    } else if (field) {
                        field.style.borderColor = '#d1d5db';
                    }
                });
                
                if (!isValid) {
                    e.preventDefault();
                    alert('Por favor, preencha todos os campos obrigatórios.');
                }
            });
        }
    }
    
    // Executar todas as funções
    adjustTitlesAndTexts();
    adjustPlaceholders();
    reorganizeFields();
    adjustPasswordFields();
    addCheckboxFunctionality();
    addInputMasks();
    enhanceValidation();
    
    // Adicionar classe para identificar que o script foi carregado
    document.body.classList.add('custom-register-loaded');
});

// Função para aplicar estilos adicionais via JavaScript se necessário
function applyAdditionalStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Estilos adicionais via JavaScript */
        .custom-form-structure {
            width: 100%;
        }
        
        .custom-form-structure .form-group:last-of-type {
            margin-bottom: 24px;
        }
        
        /* Animação para o checkbox */
        .checkbox-container {
            transition: all 0.3s ease;
        }
        
        .checkbox-container:hover {
            background: rgba(99, 102, 241, 0.05);
            border-radius: 4px;
            padding: 4px;
            margin: 16px -4px;
        }
    `;
    document.head.appendChild(style);
}

// Aplicar estilos adicionais
applyAdditionalStyles();
