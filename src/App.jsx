import { useState, useEffect } from 'react'
import "./App.css"
import logoLoja from './assets/imagem-gerada.jpeg'
import {Produto} from './components/Produto'
import {ItemCarrinho} from './components/ItemCarrinho'
import {DetalhesProduto} from './components/DetalhesProduto'

function App() {
    const [produtos, setProdutos] = useState([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState(null)
    const [texto, setTexto] = useState("")
    const [carrinhoAberto, setCarrinhoAberto] = useState(false)
    const [opcao, setOpcao] = useState("crescente")
    const [categorias, setCategorias] = useState("")
    const [fetchCategorias, setFetchCategorias] = useState([])
    const [carrinho, setCarrinho] = useState(() => {
        const salvo = localStorage.getItem('carrinho')
        return salvo ? JSON.parse(salvo) : [];
    })
    const [tela, setTela] = useState("home")
    const [produtoDetalhe, setProdutoDetalhe] = useState(null)
    const [checkoutSucesso, setCheckoutSucesso] = useState(false)

    useEffect(() => {
        async function pegar() {
            try {
                const pega = await fetch("https://dummyjson.com/products/categories")
                if (!pega.ok) throw new Error("Não consegui buscar as categorias");
                const awat = await pega.json()
                setFetchCategorias(awat)
            } catch(err) {
                setErro(err.message)
            }
        }
        pegar()
    },[])

    useEffect(() => {
        const outracosias = JSON.stringify(carrinho)
        localStorage.setItem('carrinho', outracosias)
    }, [carrinho])

    useEffect(() => {
        async function pegar() {
            try {
                const pega = await fetch("https://dummyjson.com/products")
                if (!pega.ok) throw new Error("Falha ao buscar produtos na API")
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
            return produto.category.toLowerCase().includes(categorias.toLowerCase())
        })
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

    function definirfuncao(produto) {
        setProdutoDetalhe(produto)
        setTela("detalhes")
    }

    function voltarParaHome() {
        setTela("home")
        setProdutoDetalhe(null)
    }

    const total = carrinho.reduce((acc, item) => acc + (item.price * item.quantidade), 0)

    function remover(id) {
        const novoCarrinho = carrinho.filter((produto) => produto.id !== id)
        setCarrinho(novoCarrinho)
    }

    function finalizarCompra() {
        setCarrinho([]) 
        setCarrinhoAberto(false) 
        setCheckoutSucesso(true)
    }

    return (
        <div className='tudo'>
            {tela === "home" ? (
                <>
                    <header className="cabecalho">
                        <img alt='imagem-gerada' className='imagemm' src={logoLoja} />
                        <input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Buscar..." />
                        <div className='busca-filtro'>
                            <label className='label'>Ordenar:</label>
                            <select onChange={(e) => setOpcao(e.target.value)} value={opcao}>
                                <option value="crescente">Menor Preço</option>
                                <option value="decrescente">Maior Preço</option>
                            </select>
                            <select onChange={(e) => setCategorias(e.target.value)} value={categorias}>
                                <option value="">Todas as categorias:</option>
                                {fetchCategorias.map((cat) => {
                                    const valorCat = typeof cat === 'string' ? cat : cat.slug;
                                    const nomeCat = typeof cat === 'string' ? cat : cat.name;
                                    return <option key={valorCat} value={valorCat}>{nomeCat}</option>    
                                })}
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
                                <Produto definirfuncao={definirfuncao} adicionar={adicionar} key={produto.id} produto={produto} />
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
                            {carrinho.length !== 0 ? (
                                <button className="botao-finalizar" onClick={finalizarCompra}>
                                    Finalizar Compra
                                </button>
                            ) : (
                                <button className='botao-finalizar-zero'>Você não adicionou produtos ao carrinho</button>
                            )}
                        </div>
                    </aside>
                </>
            ) : (
                <DetalhesProduto 
                    produto={produtoDetalhe} 
                    voltar={voltarParaHome} 
                    adicionar={adicionar} 
                />
            )}

            
            {checkoutSucesso && (
                <div className="modal-overlay">
                    <div className="modal-conteudo">
                        <h2>🎉 Pedido Realizado com Sucesso!</h2>
                        <p>Obrigado por comprar na nossa loja. Seu pedido foi simulado com sucesso.</p>
                        <button className="botao-fechar-modal" onClick={() => setCheckoutSucesso(false)}>
                            Voltar às Compras
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default App