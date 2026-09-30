import React from 'react'
import './DetlhesProduto.css'

export function DetalhesProduto({ produto, voltar, adicionar}) {
    return (
        <div className="pagina-detalhes">
            <button className='botao-voltar' onClick={voltar}>← Voltar para a loja</button>
            <div className='detalhes-container' >
                <img src={produto.thumbnail} alt={produto.title} className='detalhes-imagens'></img>
                <div className='detalhes-info'>
                    <h2 className='detalhes-titulo'>{produto.title}</h2>
                    <p className='detalhes-categoria' >Categoria: {produto.category}</p>
                    <p className='detalhes-descricao'>{produto.description}</p>
                    <h3 className='detalhes-preco' >R$ {produto.price.toFixed(2)}</h3>
                    <button className='botao-comprar-detalhes' onClick={() => adicionar(produto)} >Adicionar ao Carrinho</button>
                </div>
            </div>
        </div>
    )
}