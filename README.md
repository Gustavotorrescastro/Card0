# 🌿 Calculadora de Impacto Ambiental — Edenred

> Ferramenta de cálculo de redução de emissões de gases de efeito estufa (GEE) na migração de cartões físicos para pagamentos digitais.

---

## 📌 Sobre o projeto

Este projeto foi desenvolvido para a **Edenred** com o objetivo de fornecer uma calculadora sustentável que demonstra, de forma clara e quantitativa, a redução do impacto ambiental ao migrar do cartão físico para o digital.

A ferramenta calcula e compara as emissões de CO₂ equivalente (CO₂e) geradas em cada transação de pagamento — considerando o ciclo de vida completo do cartão físico (produção, uso e descarte) frente ao custo ambiental do processamento digital. A metodologia segue as diretrizes do **GHG Protocol**, **IPCC**, fatores nacionais do **MCTI** e bases públicas confiáveis como **IEA** e **DEFRA**.

O escopo cobre predominantemente o **Escopo 3** de emissões (cadeia de valor), incluindo emissões diretas e indiretas relevantes para cada modalidade de pagamento.

---

## 🎯 Objetivo

Oferecer à Edenred e aos seus clientes corporativos uma ferramenta replicável, metodologicamente sólida e visualmente acessível para:

- Quantificar a pegada de carbono por transação em cartões físicos e digitais
- Comparar cenários de migração com dados contextualizados por região e matriz energética
- Apoiar decisões estratégicas de ESG com dados concretos e auditáveis
- Comunicar o impacto ambiental positivo da migração digital para stakeholders internos e externos

---

## ⚙️ Premissas técnicas

### Cartão físico
- Material: PVC convencional (~5g por cartão), PVC reciclado ou metal
- Emissões consideradas: produção do chip e antena NFC, logística de distribuição, uso e descarte (aterro, incineração ou reciclagem)
- Vida útil: 500 a 3.000 transações/ano
- Fábricas mapeadas: Colombo/PR, São Bernardo do Campo/SP e Cotia/SP
- Taxa de perda e substituição anual considerada na metodologia

### Pagamento digital
- Tecnologias: NFC, wallet, QR Code, PIX
- Emissões consideradas: consumo energético em servidores e data centers, redes de telecomunicações, processamento por camadas (emissora, bandeira, adquirente) e uso proporcional do dispositivo do usuário
- Fator de emissão ajustável por país/região (matriz elétrica brasileira predominantemente renovável)

### Metodologia
- Unidade funcional: kg CO₂e por transação individual
- Horizonte temporal: ano-base do inventário
- Abordagem: Cradle-to-Grave para físico, Cradle-to-Gate para digital
- Fontes: GHG Protocol, IPCC, MCTI, IEA, DEFRA
- Atualização anual recomendada dos fatores de emissão

---

## 🧩 Funcionalidades principais

### 1. Inteligência de Ciclo de Vida (LCA Simplificado)
Integra dados de produção, uso e descarte para uma visão completa da pegada de carbono — corrigindo o ponto cego de análises que consideram só o uso final.

### 2. Linha do Tempo de Impacto Acumulado
Mostra o impacto ambiental acumulado desde a adesão ao digital, reforçando a percepção de valor contínuo e não apenas pontual.

### 3. Simulador de Logística Reversa (Descarte Consciente)
Calcula o benefício da reciclagem de cartões físicos, indica pontos de coleta próximos e oferece opções de offset de carbono ou plantio de árvores diretamente pela interface.

### 4. Escala Dinâmica
Permite ajustar volume, frequência de uso e outros parâmetros para que os resultados reflitam o tamanho real da operação de cada empresa.

### 5. Cenários Comparativos
Compara o custo ambiental de manter cartões físicos ativos contra a migração para Apple Pay/Google Pay, com seletor de matriz energética por região para resultados precisos.

### 6. Simulador de Risco Operacional
Quantifica o que a empresa perde, ambiental e financeiramente, a cada falha do cartão físico — evidenciando que custo ambiental e custo de processo caminham juntos.

### 7. Painel de Custo/Impacto
Resumo executivo derivado automaticamente da simulação: custo estimado, risco operacional, impacto ambiental e tempo de retorno em um único painel.

---

## 🔧 Funcionalidades secundárias

### 1. Compartilhamento Social e Institucional
Exporta os resultados da simulação em formato visual (card ou stories) pronto para redes sociais corporativas ou apresentações internas.

### 2. Rastro de Decisão
Painel que mostra quais entradas mais influenciaram o resultado e por quê, sem expor a fórmula — tornando o raciocínio transparente e auditável.

### 3. Notificação de Marco Ambiental
Alertas automáticos quando a empresa atinge metas de impacto predefinidas, gerando engajamento de marca e incentivando investimentos contínuos.

### 4. Simulador de Nudging (Mudança de Comportamento)
Projeta a adesão e o retorno esperados se a empresa implementar políticas de incentivo à migração digital, ajudando o RH a planejar campanhas com base em dados.

### 5. Matriz de Custo Total (TCO) em Camadas
Estrutura os custos em três camadas — diretos, indiretos e custo de falha — revelando o custo total real que vai além do valor unitário do cartão.

### 6. Carbon Efficiency Score
Índice composto (0–100) que considera % digital, taxa de reemissão, logística, tipo de material e política de descarte — facilitando comunicação executiva, metas internas e comparação anual.

---

## 👥 Equipe

### Creative Coding (CC)

| Nome | Papel |
|---|---|
| André Borges Viana | Creative Coding |
| Arthur Moury | Creative Coding |
| Bernardo Alencar | Creative Coding |
| Breno Pereira | Creative Coding |
| Diego Ferreira Magnata | Creative Coding |
| Gustavo Castro | Creative Coding |
| Maria Augusta | Creative Coding |

### Design

| Nome | Papel |
|---|---|
| Giovanna Almeida | Design |
| Luíza Ferrari | Design |
| Maíra Estrela | Design |
| Mariana Alves | Design |
| Maria Cecília Quinderé | Design |

---

## 📡 Canais de comunicação

| Canal | Uso |
|---|---|
| **WhatsApp** | Comunicação rápida e alinhamentos do dia a dia |
| **Google Meet** | Reuniões de equipe, reviews e cerimônias |
| **ClickUp** | Gestão de tarefas, backlog e acompanhamento de entregas |
| **Figma** | Prototipação, design de interfaces e handoff |
| **Canva** | Criação de materiais de apresentação e comunicação visual |

---

## 📁 Estrutura do projeto

```
edenred-carbon-calculator/
├── README.md
├── index.html                  # Calculadora principal
├── assets/
│   ├── fonts/
│   └── icons/
├── docs/
│   ├── premissas.docx          # Premissas técnicas do projeto
│   ├── user-stories.md         # Histórias de usuário e critérios INVEST
│   └── bdd-scenarios.md        # Cenários BDD
└── design/
    └── figma-link.md           # Link para o projeto no Figma
```

---

## 📄 Licença

Projeto desenvolvido exclusivamente para a **Edenred**. Todos os direitos reservados.
