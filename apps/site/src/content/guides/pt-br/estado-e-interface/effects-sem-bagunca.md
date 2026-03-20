---
title: Effects Sem Bagunca
description: Como usar effects sem transformar sincronizacao, fetch e evento colateral numa pilha de comportamento dificil de prever.
summary: Effect bom sincroniza com o mundo externo. Effect ruim tenta controlar a tela inteira.
guideId: effects-without-the-mess
locale: pt-br
status: active
pillarId: state-and-ui-thinking
branchId: effects-and-side-effects
pubDate: 2026-01-24
updatedDate: 2026-01-26
category: Estado e interface
topic: Effects
path:
  - Estado e interface
  - Effects sem bagunca
order: 10
relationships:
  - state-ownership-without-confusion
  - server-and-client-thinking-without-confusion
tags:
  - react
  - effects
  - ui
topicIds:
  - react
relatedDeckIds: []
---

## O problema

Effect vira bagunca quando comeca a ser usado como ferramenta para consertar qualquer coisa esquisita da tela.

De repente tem `useEffect` para derivar estado, sincronizar valor que nem precisava existir e remendar ordem de execucao.

O codigo ate pode funcionar por um tempo, mas fica dificil prever quando algo roda e por que roda.

## Modelo mental

Effect nao existe para controlar render.

Effect existe para sincronizar a interface com algo de fora:

- rede
- timer
- listener
- DOM imperativo
- integracao externa

Se a logica pode acontecer durante renderizacao ou em evento de usuario, provavelmente ela nao precisa estar em effect.

## Quebrando o problema

Antes de criar um effect, tente responder:

1. qual sistema externo eu estou sincronizando?
2. isso poderia ser calculado durante render?
3. isso deveria acontecer por causa de uma interacao especifica?
4. o cleanup esta claro quando esse effect deixa de valer?

Essas perguntas eliminam muito effect desnecessario.

## Exemplo simples

Imagine este caso:

```tsx
const [filteredUsers, setFilteredUsers] = useState<User[]>([])

useEffect(() => {
  setFilteredUsers(users.filter((user) => user.name.includes(search)))
}, [users, search])
```

Isso parece normal, mas `filteredUsers` e derivado de `users` e `search`.

Ou seja: esse effect esta servindo para manter sincronizado um estado que nem precisava existir.

Uma versao melhor e calcular direto:

```tsx
const filteredUsers = users.filter((user) => user.name.includes(search))
```

Agora a leitura melhora e um ponto de sincronizacao desnecessario desaparece.

## Erros comuns

- usar effect para derivar estado
- colocar logica de evento dentro de effect sem necessidade
- depender de effect para "corrigir" ordem de render
- esquecer cleanup em timer, listener ou subscribe

## Como um senior pensa

Um senior forte nao pergunta so "qual dependencia vai no array?".

Ele pergunta:

> Eu estou sincronizando com algo externo ou so tentando compensar uma modelagem ruim de estado?

Essa pergunta costuma cortar metade dos effects antes de eles nascerem.

## O que o entrevistador quer ver

Em entrevista, isso costuma mostrar bastante maturidade:

- voce entende para que effect serve
- voce sabe diferenciar sincronizacao externa de derivacao interna
- voce pensa em cleanup e previsibilidade

Quem faz isso bem parece alguem que constroi interface com menos surpresa e menos bug de timing.

> Effect bom aproxima a tela do mundo externo. Effect ruim tenta tapar buraco de modelagem.

> Se nao existe sistema externo envolvido, talvez o effect nem precise existir.
