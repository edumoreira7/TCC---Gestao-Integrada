# Fluxo Macro

## O que representa

Mostra o caminho principal do negócio e a passagem de trabalho entre as áreas. As setas indicam a continuidade do processo, e as decisões mostram alternativas, como a necessidade de repor insumos.

## Por que é importante no projeto

Cria uma referência comum para os demais diagramas e evita interpretações diferentes sobre quando comprar, produzir e movimentar estoques. Não detalha todas as exceções nem todos os estados dos registros.

## Exemplo no nosso sistema

Todo pedido gera uma única ordem de produção, mesmo com produtos acabados suficientes. A compra não aumenta o estoque; o recebimento gera a entrada e a reavaliação dos insumos. A conclusão integral registra consumo e entrada dos produtos; a expedição integral do pedido registra a saída.

## Material de referência

O [diagrama e sua documentação](README.md) apresentam a imagem, o arquivo editável e os limites do fluxo. Ordens manuais também são permitidas e não geram expedição sem pedido.
