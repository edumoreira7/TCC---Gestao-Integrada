# Decisões do Projeto

Este documento registra decisões relevantes tomadas durante o desenvolvimento do TCC.

O objetivo é manter um histórico das definições que afetam o escopo, os requisitos, a arquitetura e a implementação do sistema.

---

## Público-alvo

O sistema será desenvolvido considerando pequenas e médias empresas do setor alimentício.

A proposta não está restrita exclusivamente a restaurantes.

---

## Escopo da solução

O projeto tem como foco os processos relacionados a:

- Insumos;
- Receitas;
- Fornecedores;
- Compras;
- Pedidos de clientes;
- Produção;
- Estoque de insumos;
- Estoque de produtos acabados;
- Expedição;
- Movimentações financeiras básicas.

O objetivo não é desenvolver um ERP de abrangência geral.

---

## Ordens de produção

As ordens de produção poderão ter duas origens:

- Criação manual pelo usuário;
- Criação automática no registro de um pedido de cliente.

Cada pedido contém um ou mais produtos e deverá gerar uma única ordem de produção, mesmo quando possuir vários produtos ou já houver produtos acabados suficientes em estoque. O atendimento direto sem ordem de produção não faz parte do fluxo.

O registro do pedido gera automaticamente sua única ordem de produção, sem ação adicional do PCP. A geração integra o fluxo de registrar pedido e não constitui caso de uso separado.

Uma ordem contém um ou mais produtos e suas quantidades. Cada produto utiliza uma ficha técnica/receita com insumos, quantidades, unidades de medida e quantidade de produto resultante, necessária para dimensionar a produção.

O Comercial registra o pedido e poderá alterá-lo até antes do início da produção. Alterações que afetem uma ordem já criada devem refletir nos seus itens e no cálculo da necessidade de insumos antes do início.

A produção será concluída integralmente; produção parcial não faz parte da primeira versão.

---

## Disponibilidade de insumos

Uma ordem de produção poderá ser criada mesmo quando os insumos disponíveis não forem suficientes.

Quando houver insuficiência, a ordem deverá permanecer aguardando reposição antes de iniciar.

O sistema deverá identificar os insumos faltantes.

O PCP identifica a necessidade de reposição e aciona Compras. O registro da compra será realizado pelo usuário autorizado.

O registro da compra, com quantidades e preços dos insumos, não aumenta o estoque. A entrada ocorre somente no recebimento efetivo pelo Estoque. Após o recebimento, a disponibilidade dos insumos da ordem deverá ser reavaliada antes de liberar seu início.

---

## Movimentações da produção

Os insumos não serão descontados do estoque no momento da criação ou do início da ordem.

O consumo dos insumos será registrado na conclusão da ordem de produção.

A entrada dos produtos acabados também será registrada na conclusão.

Produtos acabados sempre passam pelo estoque antes da expedição. Ordens manuais abastecem esse estoque e não originam, por si só, uma expedição.

Cancelamento exige motivo e apuração quantitativa separada de consumo, perdas e produtos aproveitáveis. Baixar consumo e perdas uma única vez, liberar a reserva restante e registrar entrada dos aproveitáveis. Limites de divergência do DER são provisórios.

---

## Expedição

A expedição estará vinculada a um pedido e deverá registrar, no mínimo:

- Destinatário;
- Produto;
- Quantidade;
- Data.

Um pedido com vários produtos terá seus itens e quantidades registrados na expedição. Não haverá expedição parcial inicialmente. O registro da expedição gera a saída correspondente do estoque de produtos acabados.

Não fazem parte do escopo inicial o rastreamento de entregas, roteirização, gestão de frota ou integração com transportadoras.

---

## Financeiro

O controle financeiro terá escopo simplificado.

Serão registrados valores básicos das operações de compra e venda/expedição. Esses registros não representam confirmação de pagamentos ou recebimentos bancários.

As compras registram os preços dos insumos. O custo de um produto será calculado pela receita, utilizando o preço da compra efetivamente recebida mais recentemente, pela data/hora do recebimento de cada insumo, com unidades compatíveis e considerando o rendimento da receita.

O preço de venda será cadastrado manualmente. A sugestão automática de preço com base no custo fica como evolução futura.

Não estão previstos contas a pagar, contas a receber ou um sistema contábil completo. Eventos, campos, automatização e tratamento de estornos dos registros financeiros ainda precisam de detalhamento.

---

## Responsabilidades e acesso

Os perfis funcionais de referência são Comercial, PCP, Compras, Estoque, Produção, Expedição e Financeiro. A matriz detalhada de permissões e a administração dos acessos ainda serão definidas.

Uma mesma pessoa poderá acumular mais de um perfil ou conjunto de permissões. Clientes e fornecedores são entidades cadastradas, não atores com acesso ao sistema.

---

## Validação

A conclusão do projeto não dependerá da participação de uma empresa específica.

A estratégia principal deverá utilizar dados sintéticos e cenários de teste definidos a partir dos requisitos e das regras de negócio.

Caso seja possível contar com uma empresa do setor, usuários ou dados reais poderão ser utilizados como avaliação complementar, mediante autorização.

---

## Funcionalidades deliberadamente fora do escopo

Não fazem parte do escopo atual:

- Gestão de validade;
- Emissão de etiquetas de validade;
- FEFO;
- Gestão fiscal completa;
- Contabilidade completa;
- Contas a pagar e contas a receber;
- Produção e expedição parciais;
- Sugestão automática de preço de venda;
- Rastreamento logístico;
- Roteirização;
- Criação automática de pedidos de compra.

---

## Decisões ainda pendentes

Ainda deverão ser definidos:

- Matriz detalhada de permissões e administração dos perfis de referência;
- Estados completos das ordens de produção;
- Estados dos pedidos;
- Movimentações no cancelamento durante a produção, incluindo consumo efetivo, perdas e aproveitamento de produtos;
- Dados obrigatórios restantes e transições de pedidos e expedições;
- Reserva de estoque e tratamento de ordens concorrentes, já que a baixa normal ocorre somente na conclusão;
- Desempate de recebimentos e conversões entre unidades; evento de preço e fallback definidos em 15/11/2026;
- Funcionamento detalhado das movimentações financeiras;
- Consulta ao estoque de produtos acabados antes de dimensionar a necessidade de produção e seu efeito nas quantidades (PD12), preservando uma única OP automática por pedido;
- Metodologia definitiva de avaliação;
- Revisão das metas iniciais dos [RNF mensuráveis](../02-requisitos/requisitos-nao-funcionais.md), elaborados em 20/11/2026, e congelamento do protocolo após piloto.

Esses itens não devem ser considerados definidos até serem discutidos e documentados.

## Banco de dados

Em **01/11/2026**, o solicitante definiu o **PostgreSQL** como banco de dados da futura implementação. A escolha considera a modelagem relacional do domínio e a experiência prévia do solicitante e de outro integrante com essa tecnologia.

A [decisão técnica DT01](../04-arquitetura/decisoes-tecnologicas.md) detalha a justificativa e os limites da escolha. A versão, a hospedagem, o backend e a composição da base de demonstração ainda serão definidos. Esta decisão não altera o protótipo frontend nem cria uma instância real do banco.

## Registro da revisão

Em 13/10/2026, este documento foi atualizado com o resumo da discussão e a imagem do macrofluxo. Naquela revisão, foi confirmada pelo solicitante a obrigatoriedade de criar uma ordem para todo pedido, inclusive com estoque acabado suficiente. A validação coletiva do fluxo ainda estava pendente àquela data.

Em 17/10/2026, o solicitante confirmou que a revisão do grupo sobre a base consolidada no PR #13 já ocorreu. Essa confirmação atualiza o status da base e do macrofluxo; as decisões listadas como pendentes continuam abertas. O PDF de visão geral foi alinhado ao acesso exclusivamente interno e ao financeiro simplificado.

## Confirmações do modelo de domínio — 20/10/2026

1. Reservar insumos no início da produção; baixa física normal na conclusão, com encerramento da reserva.
2. Preservar na OP a composição e as quantidades originais da receita, incluindo unidades e rendimento.
3. No cancelamento, apurar consumo e perdas sem sobreposição, baixar uma única vez, liberar o restante reservado e receber produtos aproveitáveis.
4. Decisão histórica substituída em 15/11/2026: recebimento único e integral por compra.

Essas decisões complementam RF34–RF36 e RN26–RN29 no escopo. Detalhes de autorização, concorrência técnica e revisão da composição após alteração de pedido permanecem explícitos.

## Alinhamento confirmado pelo grupo — 15/11/2026

Esta revisão prevalece sobre descrições históricas conflitantes. O [DER](../03-modelagem/dados/README.md) mantém o modelo de persistência proposto.

- Recebimento único integral: uma compra admite zero ou um recebimento, sempre integral; confirmar gera todas as entradas uma única vez. Registrar a compra não altera estoque nem preço de referência.
- Lotes inteiros, inclusive OP manual: lotes = teto(solicitada / rendimento); planejada = lotes × rendimento; insumos = composição por lote × lotes. Pedido de 15 com rendimento 10 gera entrada de 20 e expedição de 15; excedente de 5 fica em estoque. Uma OP automática por pedido. PD12 (abater estoque acabado) permanece pendente; a demo não abate.
- Versões publicadas da receita têm composição e rendimento imutáveis, com no máximo uma ativa por produto. OP não iniciada acompanha a ativa e recalcula; iniciada preserva versão e quantidades.
- Preço de referência: preço da compra efetivamente recebida mais recentemente, pela data/hora do recebimento; sem recebimento, preço inicial opcional; sem preço, custo indisponível. Desempate pelo maior ID de recebimento é provisório, conforme proposta do DER. Preços históricos dos pedidos são preservados.
- Cancelamento exige motivo e apuração de cada insumo reservado, inclusive zero; consumo exclui perdas. Baixa ambos uma vez, libera a reserva restante e recebe produtos aproveitáveis vinculados à mesma OP. Não admite conclusão parcial normal ou expedição parcial. Limites provisórios: consumo + perdas até reservado; aproveitamento até planejado. Rejeitar divergências sem truncar. Justificativa: evitar saldo negativo ou entrada superior ao plano enquanto a política de exceções aguarda aprovação.
- Kanban acompanha etapas por produto da OP e não movimenta estoque; conclusão integral registra baixas e entradas. Exigir todos os cards concluídos é uma escolha demonstrativa ainda sujeita a validação.
- Frontend local acadêmico, sem backend, API, autenticação real, hospedagem ou PostgreSQL em execução. Reservas virtuais e troca de estado local demonstram regras; garantias de transação, segurança e concorrência multiusuário dependem do futuro backend. PostgreSQL permanece a escolha futura (DT01).

## Direção do produto e avaliação — 20/11/2026

O grupo escolheu foco em produto e avaliação de uso, com tarefa central de planejar e acompanhar encomenda. Reposição estatística é complementar. Há possível contato com confeitaria, sem parceria, usuários, modo de produção ou histórico definidos. A conversa com o estabelecimento ainda será realizada.

[RF37–RF43](../02-requisitos/reposicao-estatistica.md), [RNF01–RNF13](../02-requisitos/requisitos-nao-funcionais.md), [matriz de cobertura](../06-testes/matriz-rastreabilidade.md) e [avaliação de uso](../06-testes/avaliacao-de-uso.md) detalham a proposta. PD13–PD15 identificam políticas e dados estatísticos/avaliação ainda pendentes. O objetivo de melhorar processos e serviço é intenção a avaliar, sem ganhos demonstrados. IA, comparação de políticas como eixo principal e validade/FEFO não foram aprovados como ampliação de escopo.
