import { useState, useEffect } from 'react'
import "./App.css"
import logoLoja from './assets/imagem-gerada.jpeg'

function Produto({ produto, adicionar }) {
    return (
        <div className="card-produto">
            <img
                src={produto.thumbnail}
                alt={produto.title}
                className="imagem-produto"
            />
            <h2 className="titulo-produto">{produto.title}</h2>
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

function ItemCarrinho({ produto, remover, mais, menos }) {
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

function App() {
    const [produtos, setProdutos] = useState([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState(null)
    const [texto, setTexto] = useState("")
    const [opcao, setOpcao] = useState("crescente")
    const [carrinho, setCarrinho] = useState([])
    const [carrinhoAberto, setCarrinhoAberto] = useState(false)

    useEffect(() => {
        async function pegar() {
            try {
                const pega = await fetch("https://dummyjson.com/products")
                if (!pega.ok) throw new Error("")
                const joga = await pega.json()
                setProdutos(joga.products)
            } catch (err) {
                setErro(err.message)
            } finally {
                setCarregando(false)
            }
        }
        pegar()
    }, [])

    if (carregando) {
        return <p>Carregando...</p>
    }

    if (erro) {
        return <p>Erro ao carregar os produtos...</p>
    }

    const novaLista = [...produtos]
        .filter((produto) => {
            return produto.title.toLowerCase().includes(texto.toLowerCase())
        })
        .sort((a, b) => {
            if (opcao === "crescente") {
                return a.price - b.price
            } else {
                return b.price - a.price
            }
        })

    function mais(produto) {
        setCarrinho(carrinho.map((item) => {
            if (item.id === produto.id) {
                return { ...item, quantidade: item.quantidade + 1 }
            } else {
                return item
            }
        }))
    }

    function menos(produto) {
        if (produto.quantidade === 1) {
            setCarrinho(carrinho.filter((item) => item.id !== produto.id))
        } else {
            setCarrinho(carrinho.map((item) => item.id === produto.id ? { ...item, quantidade: item.quantidade - 1 } : item))
        }
    }

    function adicionar(produto) {
        if (carrinho.some(item => item.id === produto.id)) {
            setCarrinho(carrinho.map((item) => {
                if (item.id === produto.id) {
                    return { ...item, quantidade: item.quantidade + 1 }
                } else {
                    return item
                }
            }))
        } else {
            setCarrinho([...carrinho, { "nome": produto.title, "quantidade": 1, "id": produto.id, "price": produto.price }])
        }
    }

    const total = carrinho.reduce((acc, item) => acc + (item.price * item.quantidade), 0)

    function remover(id) {
        const novoCarrinho = carrinho.filter((produto) => produto.id !== id)
        setCarrinho(novoCarrinho)
    }

    return (
    <div className='tudo'>
      <header className="cabecalho">
        <img alt='imagem-gerada' className='imagemm'src={logoLoja} ></img>
        <input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Buscar..." />

        <div className='busca-filtro'>
        <label className='label'>Ordenar:</label>
        <select onChange={(e) => setOpcao(e.target.value)} value={opcao}>
          <option value="crescente">Menor Preço</option>
          <option value="decrescente">Maior Preço</option>
        </select>
        </div>

        <button className="botao-carrinho-topo" onClick={() => setCarrinhoAberto(true)}>
          🛒 Carrinho <strong>({carrinho.reduce((acc, item) => acc + item.quantidade, 0)})</strong>
        </button>
      </header>

        <div className="container-produtos">
        {novaLista.length === 0 ? (
          <h1>Produto não encontrado</h1>
         ) : (
           novaLista.map((produto) => (
             <Produto adicionar={adicionar} key={produto.id} produto={produto} />
           ))
         )}
        </div>

      {carrinhoAberto && (
        <div className="carrinho-overlay" onClick={() => setCarrinhoAberto(false)} />
      )}

      <aside className={`carrinho-lateral ${carrinhoAberto ? 'aberto' : ''}`}>
        <div className="carrinho-header">
          <h2>Seu Carrinho</h2>
          <button className="botao-fechar" onClick={() => setCarrinhoAberto(false)}>✕</button>
        </div>

        <div className="container-carrinho">
          {carrinho.length === 0 ? (
            <p className="carrinho-vazio">O seu carrinho está vazio.</p>
          ) : (
            carrinho.map((produto) => (
              <ItemCarrinho menos={menos} mais={mais} remover={remover} key={produto.id} produto={produto} />
            ))
          )}
        </div>

        <div className="carrinho-footer">
          <h3>Total: R$ {total.toFixed(2)}</h3>
          {carrinho.length !== 0 ? <button className="botao-finalizar">Finalizar Compra</button> : <button className='botao-finalizar-zero'>Você não adicionou produtos ao carrinho</button>}
        </div>
      </aside>
    </div>
  )
}

export default App