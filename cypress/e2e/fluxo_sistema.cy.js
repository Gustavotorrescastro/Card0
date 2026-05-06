describe('Fluxo Completo: Cadastro, Login e Navegação - Card0', () => {
  
  const usuario = {
    nome: 'Godoy Teste',
    email: `teste${Math.floor(Math.random() * 1000)}@cesar.school`, // Email dinâmico para evitar erro de duplicado
    senha: 'senha123'
  };

  it('Deve realizar cadastro, login e percorrer o sistema', () => {
    
    // 1. Início no Login e ida para Cadastro
    cy.visit('http://localhost:3000/login');
    cy.contains('Cadastre-se').click();
    cy.url().should('include', '/cadastro');

    // 2. Preenchimento de Cadastro
    cy.get('input').eq(0).type(usuario.nome); 
    cy.get('input[type="email"]').type(usuario.email);
    cy.get('input[type="password"]').first().type(usuario.senha);
    cy.get('input[type="password"]').last().type(usuario.senha);

    // Captura o alerta ANTES do clique para garantir que o Cypress o aceite
    cy.on('window:alert', (text) => {
      console.log('Alert interceptado:', text);
      return true;
    });

    // Clique forçado no botão Criar Conta
    cy.contains('button', 'Criar Conta').click({ force: true });

    // 3. Login (Aguardando o redirecionamento após o cadastro)
    // Aumentei o timeout para dar tempo do banco processar e redirecionar
    cy.url({ timeout: 10000 }).should('include', '/login');
    
    cy.get('input[type="email"]').type(usuario.email);
    cy.get('input[type="password"]').type(usuario.senha);
    cy.contains('button', 'Entrar').click();

    // 4. Redirecionamento Pós-Login: Dashboard
    cy.url().should('include', '/dashboard');
    cy.contains('Impacto Total').should('be.visible');

    // 5. Navegação: Simulador de Risco Operacional
    cy.get('aside').contains('Simulador de Risco').click();
    cy.url().should('include', '/simulador-risco-operacional');
    cy.contains('Cenário Físico (Crítico)').should('be.visible');

    // 6. Navegação: Calculadora Impacto
    cy.get('aside').contains('Calculadora de Impacto').click();
    cy.url().should('include', '/calculadora-impacto');
    cy.contains('Impacto Estimado').should('be.visible');

    // 7. Navegação: Linha do Tempo
    cy.get('aside').contains('Linha do Tempo').click();
    cy.url().should('include', '/linha-do-tempo');
    
    cy.contains('ID do Usuário').parent().find('input').type('111');
    
    // CORREÇÃO: Para inputs type="date", o Cypress exige YYYY-MM-DD. 
    // O navegador se encarregará de mostrar como 10/10/2020 na tela.
    cy.contains('Data de Adesão').parent().find('input').type('2020-10-10');
    
    cy.contains('button', 'Ver Impacto').click();

    // Validação dos dados
    cy.contains('Desde 09/10/2020, você já evitou 1017.00 kg de CO₂.').should('be.visible');
    cy.contains('2.034').should('be.visible');

    // 8. Navegação: Meu Perfil
    cy.get('aside').contains('Meu Perfil').click();
    cy.url().should('include', '/perfil');

    // 9. Finalização: Sair do Sistema
    cy.get('aside').contains('Sair do Sistema').click();
    cy.url().should('include', '/login');
    cy.contains('button', 'Entrar').should('be.visible');
  });
});