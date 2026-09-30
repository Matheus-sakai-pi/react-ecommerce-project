export function Produto({ produto, adicionar, definirfuncao }) {
    return (
        <div className="card-produto">
            <img onClick={() => definirfuncao(produto)}
                src={produto.thumbnail}
                alt={produto.title}
                className="imagem-produto"
            />
            <h2 onClick={() => definirfuncao(produto)} className="titulo-produto">{produto.title}</h2>
            <p className="preco-produto">R$ {produto.price.toFixed(2)}</p>
            <button
                className="botao-adicionar"
                onClick={() => adicionar(produto)}
            >
                Adicionar ao carrinho
            </button>
        </div>
    )
}