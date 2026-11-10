# Sequências dos fluxos principais

Revisão: 10/11/2026. Sequências de análise para a issue #7. Os participantes representam responsabilidades lógicas, não serviços implantados separadamente. As fontes Mermaid abaixo são editáveis e renderizadas pelo GitHub. Operações que gravam dados devem validar usuário interno autorizado; a matriz detalhada permanece em PD06.

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
    Producao->>Receitas: Obter composição e rendimento
    Receitas-->>Producao: Composição para preservar na OP
    Producao->>Estoque: Consultar disponibilidade de insumos
    Estoque-->>Producao: Suficiência e faltas
    Producao-->>Pedidos: OP preparada, inclusive com faltas
    Pedidos->>Dados: Gravar pedido e única OP juntos
    Dados-->>Pedidos: Confirmação ou falha sem gravação parcial
    Pedidos-->>Comercial: Pedido e OP ou erro
    Note over Pedidos,Producao: Alteração antes do início atualiza a mesma OP e necessidades
    Note over Producao,Estoque: PD12 pendente: efeito do estoque acabado no dimensionamento
```

OP manual: PCP solicita diretamente a Produção com 1..N produtos, sem pedido; reutiliza cálculo, composição preservada e verificação de faltas. Geração automática integra registrar pedido, sem caso de uso adicional.

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
    Note over Aquisicoes,Dados: Não movimenta estoque nem envia pedido ao fornecedor
```

## Recebimento

```mermaid
sequenceDiagram
    actor Estoquista
    participant Compras
    participant Estoque
    participant Dados
    participant PCP
    Estoquista->>Compras: Informar compra e quantidades recebidas por item
    Compras->>Dados: Consultar itens e total já recebido
    Dados-->>Compras: Saldo pendente
    alt Quantidade inválida ou acima do pendente
        Compras-->>Estoquista: Rejeitar sem movimentação
    else Recebimento válido
        Compras->>Estoque: Preparar entradas das quantidades efetivas
        Estoque->>Dados: Gravar recebimento e entradas conjuntamente
        Dados-->>Estoque: Confirmação ou falha sem efeitos parciais
        Estoque-->>PCP: Reavaliar disponibilidade após confirmação
        PCP-->>Estoquista: Faltas atualizadas
    end
    Note over Compras,Dados: Vários recebimentos por compra conforme RN28
```

## Início e conclusão integral

```mermaid
sequenceDiagram
    actor Operador
    participant Producao
    participant Estoque
    participant Dados
    Operador->>Producao: Iniciar OP
    Producao->>Estoque: Verificar saldo disponível e reservar conjuntamente
    alt Faltam insumos
        Estoque-->>Producao: Faltas
        Producao-->>Operador: Aguardando reposição, início bloqueado
    else Insumos suficientes
        Estoque->>Dados: Confirmar reserva e início juntos
        Dados-->>Producao: OP em produção
        Note over Estoque,Dados: Reserva sem baixa física; concorrência técnica em PD10
        Operador->>Producao: Concluir integralmente
        Producao->>Dados: Validar OP em produção e obter composição preservada
        Dados-->>Producao: Itens e necessidades
        Producao->>Estoque: Preparar baixa única e entrada de todos os acabados
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
    Pedidos-->>Expedicao: Destinatário e quantidades
    Expedicao->>Estoque: Verificar saldo acabado para todos os itens
    alt Pedido já expedido ou saldo insuficiente
        Expedicao-->>Expedidor: Bloquear sem saída
    else Atendimento integral possível
        Expedicao->>Dados: Gravar expedição do pedido e saídas conjuntamente
        Dados-->>Expedidor: Confirmação ou falha sem efeitos parciais
    end
    Note over Estoque,Dados: Acabados entram no estoque antes da expedição
```

Rastreabilidade: pedido/OP RF11–RF18 e RF25–RF27; compra/recebimento RF09–RF10 e RF36; início/conclusão RF19–RF20, RF28, RF34–RF35; expedição RF21–RF22. Cancelamento/WIP, PD12, estados completos e evento financeiro não recebem novos comportamentos nestas sequências.
