# Site — Obras Sociais do Centro Espírita O Consolador

Site institucional estático. Sem build, sem dependências: basta servir a pasta.

## Estrutura
```
index.html              Home (one-page com âncoras)
transparencia.html      Documentos, governança e prestação de contas
seja-voluntario.html    Frentes de voluntariado + formulário via WhatsApp
matriculas.html         Informações para as famílias
assets/css/style.css    Sistema visual completo
assets/js/main.js       Menu, reveal on scroll, lightbox
assets/img/             Fotografias e logotipo
```

## Publicação no GitHub Pages
1. Criar o repositório e enviar todo o conteúdo desta pasta na raiz.
2. Settings → Pages → Source: `Deploy from a branch` → branch `main`, pasta `/ (root)`.
3. Em Custom domain informar `oconsolador.org.br` e marcar *Enforce HTTPS*.
4. No Registro.br, apontar o domínio para os IPs do GitHub Pages
   (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153)
   e criar CNAME `www` → `<usuario>.github.io`.

## Referências abertas
O site é um modelo de trabalho. Todos os pontos que dependem de dado real estão
marcados com etiquetas `REF NN` no próprio lugar em que aparecem e listados em
`referencias.html`. O botão flutuante "Modo apresentação" oculta as marcações
para mostrar o site a terceiros.

## Pendências antes de publicar
- [ ] Chave PIX, QR Code e link de doação recorrente (o link do Instagram está fora do ar)
- [ ] Anexar os PDFs na página de Transparência
- [ ] Confirmar faixas etárias, horários e documentos na página de Matrículas
- [ ] Substituir as fotos capturadas do Instagram pelos arquivos originais em alta resolução
