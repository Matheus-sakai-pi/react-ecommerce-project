export function ItemCarrinho({ produto, remover, mais, menos }) {
    return (
        <div className='cart-item'>
            <h2>{produto.nome}</h2>
            <p>R$ {produto.price.toFixed(2)}</p>
            <button onClick={() => mais(produto)}>+</button>
            {produto.quantidade}
            <button onClick={() => menos(produto)}>-</button>
            <button className='botao-remover' onClick={() => remover(produto.id)}>Remover</button>
        </div>
    )
}