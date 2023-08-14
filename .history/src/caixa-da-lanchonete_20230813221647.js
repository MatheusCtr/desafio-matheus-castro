
class CaixaDaLanchonete {
    validarItemCarrinho(codigo) {
      const produtos = [
          { codigo: "cafe", descricao: "Café", valor: 3.00, tipo: "principal" },
          {
            codigo: "chantily",
            descricao: "Chantily (extra do Café)",
            valor: 1.50,
            tipo: "cafe",
          },
          {
            codigo: "suco",
            descricao: "Suco Natural",
            valor: 6.20,
            tipo: "principal",
          },
          {
            codigo: "sanduiche",
            descricao: "Sanduíche",
            valor: 6.50,
            tipo: "principal",
          },
          {
            codigo: "queijo",
            descricao: "Queijo (extra do Sanduíche)",
            valor: 2.00,
            tipo: "sanduiche",
          },
          {
            codigo: "salgado",
            descricao: "Salgado",
            valor: 7.25,
            tipo: "principal",
          },
          {
            codigo: "combo1",
            descricao: "1 Suco e 1 Sanduíche",
            valor: 9.50,
            tipo: "combo",
          },
          {
            codigo: "combo2",
            descricao: "1 Café e 1 Sanduíche",
            valor: 7.50,
            tipo: "combo",
          }
        
        ];
        
      const produtoValidado = produtos.filter((p) => p.codigo == codigo)[0];
      if (produtoValidado) {
        return produtoValidado;
      }
      return false;
    }
  
    descontarFormaPagamento(metodoDePagamento, valor) {
      if (metodoDePagamento == "dinheiro") {
        let valorComDesconto = valor - valor * 0.05;
        return valorComDesconto.toFixed(2);
      } else if (metodoDePagamento == "credito") {
        let valorComDesconto = valor + valor * 0.03;
        return valorComDesconto.toFixed(2);
      } else {
        return valor.toFixed(2);
      }
    }
  
     formatarDinheiro(valor) {
      const roundedNumber = Math.round(valor * 100) / 100;
      const formattedNumber = roundedNumber.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2
      });
    
      return formattedNumber;
    }
    
  
    calcularValorDaCompra(metodoDePagamento, itens) {
      //formando o carrinho
      const carrinho = itens.map((item) => {
        let produtoTemporario = item.split(",");
        let produtoCarrinho = this.validarItemCarrinho(produtoTemporario[0]);
        let quantidade = produtoTemporario[1];
  
        return { item: produtoCarrinho, quantidade: quantidade };
      });
  
      // existem itens no carrinho
      if (carrinho.length == 0) {
        console.log("Não há itens no carrinho de compra!");
        return "Não há itens no carrinho de compra!";
      }
  
      // tratamento de erro em produtos
      let existeItensInvalidosNoCarrinho = carrinho.filter(
        (produto) => produto.item == false
      );
      if (existeItensInvalidosNoCarrinho.length > 0) {
        console.log("Item inválido!");
        return "Item inválido!";
      }
  
      //verificar se a quantidade de um item é inválida
      let quantidadeInvalida = false;
      carrinho.forEach((carrinhoItem) => {
        if (carrinhoItem.quantidade <= 0) {
          quantidadeInvalida = true;
        }
      });
      if (quantidadeInvalida) {
        console.log("Quantidade inválida!");
        return "Quantidade inválida!";
      }
  
      //existe tipos secundários ???
      let existeSecundario = carrinho.filter(
        (prod) => prod.item.tipo != "principal" && prod.item.tipo != "combo"
      );
      if (existeSecundario.length > 0) {
        //validar itens secundários
        let tiposDeItensSaoValidos = false;
        carrinho.forEach((carrinhoItem) => {
          if (
            carrinhoItem.item.tipo != "principal" &&
            carrinhoItem.item.tipo != "combo"
          ) {
            let produtoPrincipalEstaNoCarrinho = carrinho.filter(
              (prodcarrinho) => prodcarrinho.item.codigo == carrinhoItem.item.tipo
            );
            if (produtoPrincipalEstaNoCarrinho.length > 0) {
              tiposDeItensSaoValidos = true;
            }
          }
        });
  
        if (!tiposDeItensSaoValidos) {
          console.log("Item extra não pode ser pedido sem o principal");
          return "Item extra não pode ser pedido sem o principal";
        }
      }
  
      //ver se o metodo de pagamento é válido
      if (
        metodoDePagamento != "dinheiro" &&
        metodoDePagamento != "debito" &&
        metodoDePagamento != "credito"
      ) {
        console.log("Forma de pagamento inválida!");
        return "Forma de pagamento inválida!";
      }
  
      //Calcular valor do carrinho
      let valorTotalCarrinho = 0;
      carrinho.forEach((e) => {
        valorTotalCarrinho =
          valorTotalCarrinho + e.item.valor * parseInt(e.quantidade);
      });
  
      //descontar forma de pagamento
      let valorTotalCarrinhoComDesconto = this.descontarFormaPagamento(
        metodoDePagamento,
        valorTotalCarrinho
      );
  
      // formatar para padrão monetário
      let valorTotalFormatado = this.formatarDinheiro(valorTotalCarrinhoComDesconto);
  
      console.log(valorTotalFormatado);
      return valorTotalFormatado;
    }
  }
  
  export { CaixaDaLanchonete };
  
  const caixa = new CaixaDaLanchonete();
  caixa.calcularValorDaCompra("credito", ["sanduiche,3","cafe,4","queijo,2"]);
  
  