describe('Fluxo: Operação e Execução - Card0', () => {
  const perfilTeste = {
    name: 'Empresa Teste Cypress',
    email: 'empresa.cypress@card0.com.br',
    empresa: 'Card0 QA',
    dataNascimento: '16/05/92',
    localizacao: 'Recife-PE, Brasil',
  }

  const acessarOperacaoExecucao = () => {
    cy.visit('http://localhost:3000/lca-simplificado', {
      onBeforeLoad(win) {
        win.localStorage.setItem('userLoggedIn', 'true')
        win.localStorage.setItem('userName', perfilTeste.name)
        win.localStorage.setItem('userEmail', perfilTeste.email)
        win.localStorage.setItem('userProfile', JSON.stringify(perfilTeste))
      },
    })
  }

  const alterarRange = (indice, valor) => {
    cy.get('input[type="range"]').eq(indice).then(($range) => {
      const input = $range[0]
      const win = input.ownerDocument.defaultView
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(win.HTMLInputElement.prototype, 'value').set

      nativeInputValueSetter.call(input, String(valor))
      input.dispatchEvent(new win.Event('input', { bubbles: true }))
      input.dispatchEvent(new win.Event('change', { bubbles: true }))
    })
  }

  it('Deve validar indicadores, mapa e simulações da página', () => {
    acessarOperacaoExecucao()

    cy.url().should('include', '/lca-simplificado')
    cy.contains('Operação e execução').should('be.visible')
    cy.contains('Gerencie o ciclo de vida dos seus cartões físicos').should('be.visible')

    // Carbono gerado e árvore dinâmica
    cy.contains('Carbono gerado').should('be.visible')
    cy.get('[data-testid="carbono-gerado-valor"]').should('contain', '2.339kg')
    cy.get('[data-testid="processo-fisico-diferenca"]')
      .should('contain', 'O processo físico gera')
      .and('contain', 'kg de CO₂ a mais que o digital')
    cy.get('[data-testid="carbono-arvore"]')
      .should('contain', 'Equivalente a 150 árvores/ano')
      .and('have.attr', 'style')
      .and('contain', 'scale(1.65)')

    // Ao aumentar a quantidade de cartões, carbono e árvore também aumentam.
    alterarRange(0, 100000)
    cy.get('[data-testid="carbono-gerado-valor"]').should('contain', '17.200kg')
    cy.get('[data-testid="carbono-arvore"]')
      .should('contain', 'Equivalente a 1103 árvores/ano')
      .and('have.attr', 'style')
      .and('contain', 'scale(1.65)')
    cy.get('[data-testid="total-compensar-valor"]').should('contain', '17.200,0kg')

    // Comparação físico vs. digital
    cy.contains('Comparar impacto físico vs. digital por fase').scrollIntoView().should('be.visible')
    cy.get('[data-testid="total-ciclo-vida"]').within(() => {
      cy.contains('Total do ciclo de vida').should('be.visible')
      cy.contains('Físico').should('be.visible')
      cy.contains('Digital').should('be.visible')
      cy.contains('menor').should('be.visible')
    })

    // Simulador de logística reversa: a barra escura deve crescer com a quantidade de cartões.
    cy.contains('Simulador de logística reversa').scrollIntoView().should('be.visible')
    cy.get('[data-testid="impacto-bruto-barra"]')
      .invoke('height')
      .then((alturaInicial) => {
        alterarRange(2, 20000)
        cy.get('[data-testid="impacto-bruto-barra"]').invoke('height').should('be.gt', alturaInicial)
      })

    cy.get('[data-testid="impacto-reciclado-barra"]').should('be.visible')
    cy.contains('PVC recuperado').should('be.visible')
    cy.contains('CO₂ evitado').should('be.visible')
    cy.contains('Metais nobres').should('be.visible')

    // Mapa real de pontos de coleta
    cy.contains('Pontos de coleta para descarte seguro').scrollIntoView().should('be.visible')
    cy.get('iframe[title="Mapa real de pontos de coleta no Brasil"]')
      .should('be.visible')
      .and('have.attr', 'src')
      .and('include', 'openstreetmap.org')

    // Compensação
    cy.contains('Compensação (Carbon Offset)').scrollIntoView().should('be.visible')
    cy.contains('Total para compensar').should('be.visible')
    cy.contains('Compensar agora').should('be.visible')
  })
})