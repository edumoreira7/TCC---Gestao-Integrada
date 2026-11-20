# Requisitos não funcionais

Revisão: **20/11/2026**. Especificação para a implementação e avaliação do TCC II. Os critérios abaixo são um plano verificável, não resultados do protótipo local nem homologação do orientador. RF e regras de negócio continuam em [escopo](escopo-e-requisitos.md). A cobertura está na [matriz de rastreabilidade](../06-testes/matriz-rastreabilidade.md).

## Requisitos e critérios de aceitação

| ID | Requisito | Critério observável e cenário |
|---|---|---|
| RNF01 | Autenticar usuários na aplicação servidora e encerrar sessões. | Em N01, requisição sem sessão, com sessão inválida ou encerrada não acessa dados nem executa comandos. Credenciais e segredos não integram o bundle público, respostas ou logs. A autenticação simulada local não atende ao requisito. |
| RNF02 | Autorizar cada ação na API conforme os perfis acumuláveis. | Em N02, testar cada linha da matriz de permissões com acesso permitido e negado, inclusive chamada direta à API. Negação não altera dados. A matriz de PD06 deve existir antes do aceite; esconder botões não é evidência suficiente. |
| RNF03 | Persistir conjuntamente os efeitos de cada operação de negócio. | Em N03/V11, injetar falhas entre gravações de pedido/OP, recebimento, conclusão, cancelamento e expedição. Após rollback não há efeitos parciais. Após confirmação todos os efeitos previstos existem e respeitam as restrições do DER. |
| RNF04 | Preservar disponibilidade e histórico em comandos concorrentes. | Em N04/V15, duas sessões disputam o mesmo saldo com sincronização do início das transações; reservas confirmadas não excedem o saldo. Repetir 20 vezes em base restaurada e registrar cada tentativa. Conflitos geram resposta recuperável, sem sobrescrita silenciosa. |
| RNF05 | Evitar efeitos duplicados em repetição de comandos de negócio. | Em N05, repetir sequencialmente e simultaneamente recebimento, conclusão, cancelamento e expedição da mesma operação. Há no máximo um efeito confirmado de cada encerramento; conclusões e cancelamentos incompatíveis não coexistem. |
| RNF06 | Preservar precisão e unidade dos cálculos. | Em N06, saldos e valores decimais coincidem com a referência na precisão declarada. Para média, desvio, ES e PR, erro absoluto de até 10⁻⁶ na unidade padrão antes do arredondamento visual. Bases temporais incompatíveis e entradas não finitas são rejeitadas. |
| RNF07 | Permitir rastrear alterações e resultados. | Em N07, cada operação testada permite identificar usuário, instante, entidade, origem e resultado. Receita publicada e cálculo estatístico mantêm versão e entradas de referência. Mudança de configuração não altera retrospectivamente registros anteriores. Não registrar senha ou conteúdo sensível desnecessário. |
| RNF08 | Responder às tarefas interativas dentro do orçamento do ensaio de carga. | Em N08, medir p50/p95 e erros separadamente por operação. Meta inicial de ensaio: p95 até 2 s para consultas e até 3 s para comandos, no perfil abaixo. Tempo de espera por conflito também é registrado. Falha funcional não pode ser descartada para melhorar o percentil. |
| RNF09 | Recuperar uma base persistida e conferir sua integridade. | Em N09, gerar backup da base de ensaio, restaurar em base vazia e comparar contagens, vínculos e totais de saldos/valores com o manifesto anterior. Registrar duração e ponto de recuperação. Não prometer RPO/RTO de produção antes de definir a operação. |
| RNF10 | Permitir executar as tarefas centrais e avaliar a usabilidade percebida. | Em N10/U01–U05, registrar conclusão sem ajuda, conclusão com ajuda, falha, erros e tempo. Nenhuma tarefa crítica pode permanecer tecnicamente impossível por defeito bloqueante na versão aceita. Aplicar SUS após as tarefas, se houver participantes. Apresentar resultados e dispersão, sem inventar corte universal de aprovação. |
| RNF11 | Apresentar falhas compreensíveis sem ocultar perda de gravação. | Em N11, entrada inválida, falta de permissão, conflito e falha de persistência apresentam mensagem relacionada à ação. O estado não é apresentado como salvo antes da confirmação; dados válidos digitados são preservados quando possível e sem exposição indevida. |
| RNF12 | Tornar testes e cálculos reproduzíveis. | Em N12, outro executor consegue preparar a base e repetir os cenários a partir de commit, comandos, versões, dados, parâmetros e sementes registrados. Referência estatística é calculada independentemente da função sob teste. |
| RNF13 | Permitir operar os formulários críticos por teclado e no ambiente web declarado. | Em N13, executar U01–U05 por teclado, com foco visível e rótulos identificáveis, nos navegadores/versões registrados no protocolo. Informação de falta/erro e estado de cartão não depende somente de cor. Registrar problemas de leitura e navegação no ensaio de uso. |

## Perfil inicial do ensaio N08

Perfil sintético proposto para dimensionar um teste reproduzível: 10 sessões concorrentes, 1.000 insumos, 200 produtos, 5.000 OPs e 50.000 movimentações. Carga: 70% consultas e 30% comandos, com massa preparada para que comandos válidos sejam executáveis. Aquecimento de 1 minuto, seguido de três execuções de 5 minutos, com restauração da base entre execuções. Medir latência do envio da requisição à resposta completa, registrando cliente, servidor, rede, CPU, memória, armazenamento, navegador e versão do PostgreSQL.

Esses números são **metas iniciais de ensaio**, escolhidas para testar uso interativo simultâneo em uma base acadêmica maior que o cenário da demonstração. Não são demanda medida da confeitaria nem capacidade certificada. Antes da avaliação definitiva, confrontar o perfil com o piloto e congelar ou revisar valores com justificativa, mantendo o histórico. Limites institucionais ou de hospedagem serão registrados. Não apresentar N08 como aprovado enquanto ambiente e execução não existirem.

## Registro e dependências

N01–N09 e N11 dependem de backend e/ou persistência; localStorage não demonstra essas garantias. N10/N13 podem começar no protótipo, identificando versão e limites. N02 depende de PD06; N04 exige mecanismo transacional de PD10. O [plano de avaliação de uso](../06-testes/avaliacao-de-uso.md) distingue funcionamento técnico, usabilidade e utilidade no contexto de uma empresa.

Cada execução registra ID, requisito, dados iniciais, procedimento, resultado esperado/observado, evidência, ambiente, versão e situação. **Planejado ou bloqueado não equivale a aprovado.**
