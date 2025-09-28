
document.addEventListener('DOMContentLoaded', function() {
    // 1. Criar a nova estrutura de layout
    const loginContainer = document.createElement('div');
    loginContainer.id = 'login-container-custom';

    const brandingPanel = document.createElement('div');
    brandingPanel.id = 'branding-panel';
    brandingPanel.innerHTML = `
        <img src="/modules/addons/custom_features_for_whmcs_sourei/public/img/logo.webp" alt="Sourei Logo" class="logo">
        <h2><strong>Bem-vindo</strong> de volta,  
    <br><strong>Seja Rei!</strong></h2>
        <p>27823+ aplicações Web em nossa arquitetura</p>
    `;


    const loginPanel = document.createElement('div' );
    loginPanel.id = 'login-panel';

    loginContainer.appendChild(brandingPanel);
    loginContainer.appendChild(loginPanel);
    document.body.appendChild(loginContainer);

    // 2. Mover o formulário existente para o novo painel
    const loginWrapper = document.querySelector('.login-wrapper');
    if (loginWrapper) {
        loginPanel.appendChild(loginWrapper);

        // 3. Modificar o formulário
        const form = loginWrapper.querySelector('.login-form');
        const emailInput = form.querySelector('#inputEmail');
        const passwordInput = form.querySelector('#inputPassword');
        const submitButton = form.querySelector('#login');
        const originalFooter = loginWrapper.querySelector('.login-footer');
        const originalLinksContainer = form.querySelector('.d-flex.space-between');

        // Alterar placeholders
        if (emailInput) emailInput.placeholder = 'Email de Cadastro';
        if (passwordInput) passwordInput.placeholder = 'Senha';

        // Adicionar ícone de olho
        const passwordGroup = passwordInput.parentElement;
        const eyeIcon = document.createElement('i');
        eyeIcon.id = 'password-toggle-icon';
        eyeIcon.className = 'fas fa-eye';
        passwordGroup.appendChild(eyeIcon);

        eyeIcon.addEventListener('click', function() {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            this.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
        });

        // Remover links originais e rodapé
        if (originalLinksContainer) originalLinksContainer.remove();
        if (originalFooter) originalFooter.remove();

        // Inserir novos elementos após o botão de entrar
        const newElementsHTML = `
            <div id="links-container">
                <a href="/password/reset">Esqueceu sua senha?</a>
                <a href="/register.php">Crie sua conta agora</a>
            </div>
           
        `;
        submitButton.insertAdjacentHTML('afterend', newElementsHTML );
    }
});