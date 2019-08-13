import React, { Component } from 'react';

import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import Container from '../../components/Container';
import { Form, SubmitButton, List } from './styles';

class Main extends Component {
  state = {
    newRepo: '',
    repositories: [],
    loading: false,
    error: null,
    errorMessage: '',
  };

  // carregar os dados do LocalStorage
  componentDidMount() {
    const repositories = localStorage.getItem('repositories');

    if (repositories) {
      // convert de string para objeto json
      this.setState({ repositories: JSON.parse(repositories) });
    }
  }

  // salvar os dados do LocalStorage
  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;

    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
      // localStorage.clear();
    }
  }

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value });
  };

  handleSubmit = async e => {
    e.preventDefault();

    this.setState({
      loading: true,
      error: null,
      errorMessage: '',
    });

    const { newRepo, repositories } = this.state;

    try {
      if (newRepo === '')
        throw new Error('Você precisa indicar um repositório');

      const duplicado = repositories.find(r => r.name === newRepo);

      if (duplicado) {
        throw new Error('Repositório duplicado');
      }

      const response = await api.get(`/repos/${newRepo}`);
      const data = {
        name: response.data.full_name,
      };

      this.setState({
        repositories: [...repositories, data],
        newRepo: '',
      });
    } catch (error) {
      this.setState({
        error: true,
        errorMessage: error.message,
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { newRepo, loading, repositories, error, errorMessage } = this.state;

    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositórios
        </h1>

        <Form onSubmit={this.handleSubmit} error={error}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Adicionar repositório"
              value={newRepo}
              onChange={this.handleInputChange}
            />
            <SubmitButton loading={loading}>
              {loading ? (
                <FaSpinner color="#fff" size={14} />
              ) : (
                <FaPlus color="#fff" size={14} />
              )}
            </SubmitButton>
          </div>
          <div className={error ? 'helpBlock' : 'invisible'}>
            {errorMessage}
          </div>
        </Form>

        <List>
          {repositories.map(repository => (
            <li key={repository.name}>
              <span>{repository.name}</span>
              <Link to={`/repository/${encodeURIComponent(repository.name)}`}>
                Detalhes
              </Link>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}

export default Main;
