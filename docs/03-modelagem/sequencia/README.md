# Sequências dos fluxos principais

Revisão: 15/11/2026. Elaboração documental concluída; participantes e contratos representam o sistema futuro, não serviços já implementados. Sequências de análise para a issue #7. Os participantes representam responsabilidades lógicas, não serviços implantados separadamente. As fontes Mermaid abaixo são editáveis e renderizadas pelo GitHub. Operações que gravam dados devem validar usuário interno autorizado; a matriz detalhada permanece em PD06.

## Pedido e criação de OP

```mermaid
sequenceDiagram
    actor Comercial
    participant Pedidos
    participant Producao
    participant Receitas
    participant Estoque
    participant Dados
    Comercial->>Pedidos: Registrar cliente cadastrado e 1..N itens
    Pedidos->>Pedidos: Validar cliente, produtos e quantidades
    Pedidos->>Producao: Preparar única OP com todos os itens
    Producao->>Receitas: Obter versão ativa, composição e rendimento
    Receitas-->>Producao: Versão publicada imutável e composição por lote
    Producao->>Producao: Lotes = teto(solicitada / rendimento), planejada = lotes vezes rendimento
    Producao->>Producao: Agregar insumos por lotes inteiros
    Producao->>Estoque: Consultar disponibilidade de insumos
    Estoque-->>Producao: Suficiência e faltas
    Producao-->>Pedidos: OP preparada, inclusive com faltas
    Pedidos->>Dados: Gravar pedido e única OP juntos
    Dados-->>Pedidos: Confirmação ou falha sem gravação parcial
    Pedidos-->>Comercial: Pedido e OP ou erro
    Note over Pedidos,Producao: Alteração antes do início atualiza a mesma OP e necessidades
    Note over Producao,Estoque: PD12 pendente: efeito do estoque acabado no dimensionamento
```

OP manual: PCP solicita diretamente a Produção com 1..N produtos, sem pedido; reutiliza lotes inteiros, versão ativa e verificação de faltas; OP não iniciada acompanha revisões, iniciada preserva versão e plano. Geração automática integra registrar pedido, sem caso de uso adicional.

## Registro de compra

```mermaid
sequenceDiagram
    actor Compras
    participant Aquisicoes
    participant Dados
    Compras->>Aquisicoes: Informar fornecedor, insumos, quantidades e preços
    Aquisicoes->>Aquisicoes: Validar cadastros e itens
    Aquisicoes->>Dados: Gravar compra e itens
    Dados-->>Aquisicoes: Compra registrada
    Aquisicoes-->>Compras: Compra aguardando recebimento
    Note over Aquisicoes,Dados: Não movimenta estoque, não muda preço de referência e não envia pedido ao fornecedor
```

## Recebimento único integral

```mermaid
sequenceDiagram
    actor Estoquista
    participant Compras
    participant Estoque
    participant Dados
    participant PCP
    Estoquista->>Compras: Conferir todos os itens e confirmar recebimento integral
    Compras->>Dados: Consultar compra e existência de recebimento
    Dados-->>Compras: Itens e situação
    alt Já recebida ou conferência não integral
        Compras-->>Estoquista: Rejeitar sem movimentar estoque ou referência de preço
    else Primeiro recebimento integral
        Compras->>Estoque: Preparar todas as entradas e recebimento com ID e data-hora
        Estoque->>Dados: Confirmar recebimento único, congelar compra e gravar entradas juntos
        Dados-->>Estoque: Confirmação ou falha sem efeitos parciais
        Estoque->>Estoque: Referência pelo recebimento mais recente de cada insumo
        Estoque-->>PCP: Reavaliar disponibilidade após confirmação
        PCP-->>Estoquista: Faltas atualizadas
    end
    Note over Compras,Dados: Proposta de desempate por maior ID, sem recebimento usa inicial, sem preço custo indisponível
```

## Início e conclusão integral

```mermaid
sequenceDiagram
    actor Operador
    participant Producao
    participant Estoque
    participant Dados
    Operador->>Producao: Iniciar OP
    Producao->>Producao: Recalcular OP não iniciada pela receita ativa e lotes inteiros
    Producao->>Estoque: Verificar saldo disponível e reservar conjuntamente
    alt Faltam insumos
        Estoque-->>Producao: Faltas
        Producao-->>Operador: Aguardando reposição, início bloqueado
    else Insumos suficientes
        Estoque->>Dados: Confirmar reserva, início e versão utilizada juntos
        Dados-->>Producao: OP em produção
        Note over Estoque,Dados: Reserva sem baixa física, concorrência técnica em PD10
        Operador->>Producao: Concluir integralmente
        Producao->>Dados: Validar OP em produção e obter composição preservada
        Dados-->>Producao: Versão congelada, lotes e necessidades preservadas
        Producao->>Estoque: Preparar baixa única pelos lotes e entrada da quantidade planejada integral
        Estoque->>Dados: Transação: baixa, encerra reservas, entrada e conclusão
        alt Transação confirmada
            Dados-->>Operador: OP concluída e estoques atualizados
        else Falha
            Dados-->>Operador: Operação não confirmada, sem efeitos parciais
        end
    end
    Note over Producao,Dados: Repetir conclusão não pode repetir movimentos
```

## Expedição integral

```mermaid
sequenceDiagram
    actor Expedidor
    participant Expedicao
    participant Pedidos
    participant Estoque
    participant Dados
    Expedidor->>Expedicao: Selecionar pedido e data
    Expedicao->>Pedidos: Consultar todos os itens e expedição anterior
    Pedidos-->>Expedicao: Destinatário, quantidades e situação da OP
    Expedicao->>Estoque: Verificar saldo acabado para todos os itens
    alt OP não concluída, pedido já expedido ou saldo insuficiente
        Expedicao-->>Expedidor: Bloquear sem saída
    else Atendimento integral possível
        Expedicao->>Dados: Gravar expedição do pedido e saídas conjuntamente
        Dados-->>Expedidor: Confirmação ou falha sem efeitos parciais
    end
    Note over Estoque,Dados: Expedir solicitada do pedido, preservar excedente da planejada no estoque
```

Rastreabilidade: pedido/OP RF11–RF18 e RF25–RF27; compra/recebimento RF09–RF10 e RF36; início/conclusão RF19–RF20, RF28, RF34–RF35; expedição RF21–RF22. PD12, catálogo completo de estados, autorizações e eventos financeiros permanecem pendentes. Cancelamento quantitativo e versões seguem as decisões confirmadas abaixo; WIP formal não foi introduzido.

## Publicação de nova receita

```mermaid
sequenceDiagram
    actor Responsavel
    participant Receitas
    participant Producao
    participant Dados
    Responsavel->>Receitas: Alterar rendimento ou composição
    Receitas->>Receitas: Validar componentes e rendimento
    Receitas->>Dados: Criar versão publicada, preservar versões anteriores, ativar somente a nova
    Receitas->>Producao: Recalcular OPs não iniciadas pela nova versão e lotes inteiros
    Producao->>Dados: Atualizar referências e planejamentos pendentes
    Dados-->>Responsavel: Publicação e recálculo confirmados juntos ou falha sem efeitos parciais
    Note over Receitas,Dados: Composição e rendimento publicados são imutáveis
    Note over Producao,Dados: OP iniciada conserva versão, lotes e necessidades utilizadas
```

## Cancelamento quantitativo

```mermaid
sequenceDiagram
    actor Operador
    participant Producao
    participant Estoque
    participant Dados
    Operador->>Producao: Motivo, consumo e perdas por reserva, aproveitáveis por item da OP
    Producao->>Dados: Obter OP em andamento, reservas e planejamento congelado
    Dados-->>Producao: Vínculos e quantidades originais
    Producao->>Producao: Apurar cada reserva inclusive zero, consumo exclui perdas
    alt Encerrada, vínculos inválidos ou divergência quantitativa
        Producao-->>Operador: Rejeitar sem truncar ou movimentar
    else Apuração válida
        Producao->>Estoque: Preparar baixas de consumo e perdas sem sobreposição
        Estoque->>Dados: Baixar uma vez, liberar restante, receber aproveitáveis e cancelar juntos
        Dados-->>Operador: Cancelada com apuração ou falha sem efeitos parciais
    end
    Note over Producao,Dados: Provisório do DER: consumo mais perdas até reservado, aproveitamento até planejado
    Note over Producao,Estoque: Mesma OP, sem conclusão normal ou expedição parcial, repetição e conclusão incompatível bloqueadas
```

## Fontes e visualizações

As fontes separadas `.mmd` e os SVGs abaixo são gerados dos blocos editáveis deste documento. O [renderizador](../render_mermaid.mjs) verifica a correspondência e exporta as visualizações; manter ambos sincronizados.

- [Fonte: pedido-op](pedido-op.mmd) · [SVG](pedido-op.svg)
- [Fonte: registro-compra](registro-compra.mmd) · [SVG](registro-compra.svg)
- [Fonte: recebimento-integral](recebimento-integral.mmd) · [SVG](recebimento-integral.svg)
- [Fonte: inicio-conclusao](inicio-conclusao.mmd) · [SVG](inicio-conclusao.svg)
- [Fonte: expedicao-integral](expedicao-integral.mmd) · [SVG](expedicao-integral.svg)
- [Fonte: versao-receita](versao-receita.mmd) · [SVG](versao-receita.svg)
- [Fonte: cancelamento-quantitativo](cancelamento-quantitativo.mmd) · [SVG](cancelamento-quantitativo.svg)
