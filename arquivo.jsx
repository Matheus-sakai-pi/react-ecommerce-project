function Produto({ produto, adicionar }) {
    return (
        <div>
            <h2>{produto.title}</h2>
            <p>R$ {produto.price}</p>
            <button onClick={() => adicionar(produto)} >Adicionar ao carrinho</button>
        </div>
    )
}

function ItemCarrinho({ produto, remover, mais, menos }) {
    return (
        <div>
            <h2>{produto.nome}</h2>
            <p>R$ {produto.price}</p>
            <button onClick={()=> mais(produto)}>+</button>
            {produto.quantidade}
            <button onClick={() => menos(produto)}>-</button>
            <button onClick={() => remover(produto.id)} >Remover</button>
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

    useEffect(()=>{
        async function pegar() {
            try {
                const pega = await fetch("https://dummyjson.com/products")
                if (!pega.ok) throw new Error("");
                
                const joga = await pega.json()
                setProdutos(joga.products)
            }
            catch(err) {
                setErro(err.message)
            }
            finally {
                setCarregando(false)
            }
        }
        pegar()
    },[])

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
        .sort((a,b) => {
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
                }
                else {
                    return item
                }
            }))
        }

        function menos(produto) {
            if (produto.quantidade === 1) {
                setCarrinho(carrinho.filter((item) => item.id !== produto.id))
            }
            else {
                setCarrinho(carrinho.map((item) => item.id === produto.id ? {...item, quantidade: item.quantidade - 1} : item))
            }
        }

        function adicionar(produto) {
            if (carrinho.some(item => item.id === produto.id)) {
                setCarrinho(carrinho.map((item) => {
                    if (item.id === produto.id) {
                        return {...item, quantidade: item.quantidade + 1}
                    }
                    else {
                        return item
                    }
                }))
            }
        
            else {
                setCarrinho([...carrinho, { "nome": produto.title, "quantidade": 1, "id": produto.id, "price": produto.price}])
            }
        }

        const total = carrinho.reduce((acc, item) => acc + (item.price * item.quantidade), 0)

        function remover(id) {
            const novoCarrinho = carrinho.filter((produto) => produto.id !== id)
            setCarrinho(novoCarrinho)
        }



    return (
        <div>
            <input value={texto} onChange={(e) => setTexto(e.target.value)} />
            <label htmlFor="escolha">Escolha a ordem de produtos</label>
            <select onChange={(e) => setOpcao(e.target.value)} value={opcao} id="escolha">
                <option value="crescente" >crescente</option>
                <option value="decrescente">decrescente</option>
            </select>
            {novaLista.map((produto)=> (
                <Produto adicionar={adicionar} key={produto.id} produto={produto}/>
            ))}
            {carrinho.map((produto) => {
                return <ItemCarrinho menos={menos} mais={mais} remover={remover} key={produto.id} produto={produto}/>
            })}
            <h1>Total do carrinho:  R$ {total}</h1>
        </div>
    )
}

export default App