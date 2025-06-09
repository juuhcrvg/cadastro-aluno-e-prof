import React, { useState, useEffect, useCallback } from 'react';
import './App.css'; // Importa seu CSS

function App() {
    // --- Seus estados para alunos e professores (MANTENHA OS SEUS) ---
    const [nomeAluno, setNomeAluno] = useState('');
    const [emailAluno, setEmailAluno] = useState('');
    const [cursoAluno, setCursoAluno] = useState('');
    const [alunos, setAlunos] = useState([]);
    const [mensagemAluno, setMensagemAluno] = useState({ texto: '', tipo: '' });
    const API_URL_ALUNOS = 'http://localhost:3000/alunos';

    const [nomeProfessor, setNomeProfessor] = useState('');
    const [emailProfessor, setEmailProfessor] = useState('');
    const [disciplinaProfessor, setDisciplinaProfessor] = useState('');
    const [professores, setProfessores] = useState([]);
    const [mensagemProfessor, setMensagemProfessor] = useState({ texto: '', tipo: '' });
    const API_URL_PROFESSORES = 'http://localhost:3000/professores';

    // --- Suas funções showMessage, fetchAlunos, handleSubmitAluno, handleDeleteAluno, fetchProfessores, handleSubmitProfessor, handleDeleteProfessor ---
    // (Mantenha todas as funções exatamente como estão no App.jsx que te enviei antes)
    const showMessage = useCallback((setMsgFunc, texto, tipo) => {
        setMsgFunc({ texto, tipo });
        setTimeout(() => {
            setMsgFunc({ texto: '', tipo: '' });
        }, 5000); // Mensagem some após 5 segundos
    }, []);

    const fetchAlunos = useCallback(async () => {
        try {
            const response = await fetch(API_URL_ALUNOS);
            if (!response.ok) throw new Error('Falha ao buscar alunos.');
            const data = await response.json();
            setAlunos(data);
        } catch (err) {
            showMessage(setMensagemAluno, 'Erro ao carregar alunos: ' + err.message, 'erro');
            console.error("Erro no fetchAlunos:", err);
        }
    }, [API_URL_ALUNOS, showMessage]);

    const handleSubmitAluno = async (e) => {
        e.preventDefault();
        showMessage(setMensagemAluno, '', '');
        if (!nomeAluno || !emailAluno) {
            showMessage(setMensagemAluno, 'Nome e Email são obrigatórios para o aluno.', 'erro');
            return;
        }
        const novoAluno = { nome: nomeAluno, email: emailAluno, curso: cursoAluno };
        try {
            const response = await fetch(API_URL_ALUNOS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novoAluno),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erro ao cadastrar aluno.');
            showMessage(setMensagemAluno, `Aluno "${data.nome}" cadastrado com sucesso!`, 'sucesso');
            setNomeAluno(''); setEmailAluno(''); setCursoAluno('');
            fetchAlunos();
        } catch (err) {
            showMessage(setMensagemAluno, err.message, 'erro');
            console.error("Erro no handleSubmitAluno:", err);
        }
    };

    const handleDeleteAluno = async (alunoId, alunoNome) => {
        if (!window.confirm(`Tem certeza que deseja remover o aluno "${alunoNome}"?`)) return;
        showMessage(setMensagemAluno, '', '');
        try {
            const response = await fetch(`${API_URL_ALUNOS}/${alunoId}`, { method: 'DELETE' });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erro ao deletar aluno.');
            showMessage(setMensagemAluno, data.message || `Aluno "${alunoNome}" removido!`, 'sucesso');
            fetchAlunos();
        } catch (err) {
            showMessage(setMensagemAluno, err.message, 'erro');
            console.error("Erro no handleDeleteAluno:", err);
        }
    };

    const fetchProfessores = useCallback(async () => {
        try {
            const response = await fetch(API_URL_PROFESSORES);
            if (!response.ok) throw new Error('Falha ao buscar professores.');
            const data = await response.json();
            setProfessores(data);
        } catch (err) {
            showMessage(setMensagemProfessor, 'Erro ao carregar professores: ' + err.message, 'erro');
            console.error("Erro no fetchProfessores:", err);
        }
    }, [API_URL_PROFESSORES, showMessage]);

    const handleSubmitProfessor = async (e) => {
        e.preventDefault();
        showMessage(setMensagemProfessor, '', '');
        if (!nomeProfessor || !emailProfessor) {
            showMessage(setMensagemProfessor, 'Nome e Email são obrigatórios para o professor.', 'erro');
            return;
        }
        const novoProfessor = { nome: nomeProfessor, email: emailProfessor, disciplina: disciplinaProfessor };
        try {
            const response = await fetch(API_URL_PROFESSORES, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novoProfessor),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erro ao cadastrar professor.');
            showMessage(setMensagemProfessor, `Professor "${data.nome}" cadastrado com sucesso!`, 'sucesso');
            setNomeProfessor(''); setEmailProfessor(''); setDisciplinaProfessor('');
            fetchProfessores();
        } catch (err) {
            showMessage(setMensagemProfessor, err.message, 'erro');
            console.error("Erro no handleSubmitProfessor:", err);
        }
    };

    const handleDeleteProfessor = async (professorId, professorNome) => {
        if (!window.confirm(`Tem certeza que deseja remover o professor "${professorNome}"?`)) return;
        showMessage(setMensagemProfessor, '', '');
        try {
            const response = await fetch(`${API_URL_PROFESSORES}/${professorId}`, { method: 'DELETE' });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erro ao deletar professor.');
            showMessage(setMensagemProfessor, data.message || `Professor "${professorNome}" removido!`, 'sucesso');
            fetchProfessores();
        } catch (err) {
            showMessage(setMensagemProfessor, err.message, 'erro');
            console.error("Erro no handleDeleteProfessor:", err);
        }
    };

    useEffect(() => {
        fetchAlunos();
        fetchProfessores();
    }, [fetchAlunos, fetchProfessores]);

    return (
        <div className="container">
            <h1>Gerenciamento de Alunos e Professores</h1>

            {/* Fragmento React para agrupar form-group, hr e list-group */}
            {/* ESSA É A PARTE CRUCIAL DA ESTRUTURA PARA O LAYOUT LADO A LADO */}
            <>
                {/* Agrupador para os Formulários (lado a lado) */}
                <div className="form-group">
                    {/* --- Seção de Cadastro de Alunos --- */}
                    <form onSubmit={handleSubmitAluno} className="aluno-form">
                        <h2>Adicionar Novo Aluno</h2>
                        {mensagemAluno.texto && (
                            <div className={`mensagem ${mensagemAluno.tipo}`}>
                                {mensagemAluno.texto}
                            </div>
                        )}
                        <div>
                            <label htmlFor="nomeAluno">Nome:</label>
                            <input id="nomeAluno" type="text" value={nomeAluno} onChange={(e) => setNomeAluno(e.target.value)} placeholder="Nome completo do aluno" required />
                        </div>
                        <div>
                            <label htmlFor="emailAluno">Email:</label>
                            <input id="emailAluno" type="email" value={emailAluno} onChange={(e) => setEmailAluno(e.target.value)} placeholder="email@exemplo.com" required />
                        </div>
                        <div>
                            <label htmlFor="cursoAluno">Curso (Opcional):</label>
                            <input id="cursoAluno" type="text" value={cursoAluno} onChange={(e) => setCursoAluno(e.target.value)} placeholder="Curso do aluno" />
                        </div>
                        <button type="submit">Cadastrar Aluno</button>
                    </form>

                    {/* --- Seção de Cadastro de Professores --- */}
                    <form onSubmit={handleSubmitProfessor} className="professor-form">
                        <h2>Adicionar Novo Professor</h2>
                        {mensagemProfessor.texto && (
                            <div className={`mensagem ${mensagemProfessor.tipo}`}>
                                {mensagemProfessor.texto}
                            </div>
                        )}
                        <div>
                            <label htmlFor="nomeProfessor">Nome:</label>
                            <input id="nomeProfessor" type="text" value={nomeProfessor} onChange={(e) => setNomeProfessor(e.target.value)} placeholder="Nome completo do professor" required />
                        </div>
                        <div>
                            <label htmlFor="emailProfessor">Email:</label>
                            <input id="emailProfessor" type="email" value={emailProfessor} onChange={(e) => setEmailProfessor(e.target.value)} placeholder="email@exemplo.com" required />
                        </div>
                        <div>
                            <label htmlFor="disciplinaProfessor">Disciplina (Opcional):</label>
                            <input id="disciplinaProfessor" type="text" value={disciplinaProfessor} onChange={(e) => setDisciplinaProfessor(e.target.value)} placeholder="Disciplina do professor" />
                        </div>
                        <button type="submit">Cadastrar Professor</button>
                    </form>
                </div>

                <hr />

                {/* Agrupador para as Listas (lado a lado) */}
                <div className="list-group">
                    {/* --- Seção de Listagem de Alunos --- */}
                    <div className="lista-alunos">
                        <h2>Alunos Cadastrados</h2>
                        {alunos.length === 0 && !mensagemAluno.texto.includes("Erro ao carregar") ? (
                            <p>Nenhum aluno cadastrado ainda.</p>
                        ) : (
                            <ul>
                                {alunos.map((aluno) => (
                                    <li key={aluno.id}>
                                        <div>
                                            <strong>{aluno.nome}</strong> ({aluno.email})<br />
                                            <em>{aluno.curso || 'Curso não informado'}</em>
                                        </div>
                                        <button onClick={() => handleDeleteAluno(aluno.id, aluno.nome)} className="botao-deletar">Remover</button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* --- Seção de Listagem de Professores --- */}
                    <div className="lista-professores">
                        <h2>Professores Cadastrados</h2>
                        {professores.length === 0 && !mensagemProfessor.texto.includes("Erro ao carregar") ? (
                            <p>Nenhum professor cadastrado ainda.</p>
                        ) : (
                            <ul>
                                {professores.map((professor) => (
                                    <li key={professor.id}>
                                        <div>
                                            <strong>{professor.nome}</strong> ({professor.email})<br />
                                            <em>{professor.disciplina || 'Disciplina não informada'}</em>
                                        </div>
                                        <button onClick={() => handleDeleteProfessor(professor.id, professor.nome)} className="botao-deletar">Remover</button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </>
        </div>
    );
}

export default App;