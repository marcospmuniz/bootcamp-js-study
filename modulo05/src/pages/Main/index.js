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
    validRepo: true,
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
      validRepo: true,
      errorMessage: '',
    });

    const { newRepo, repositories } = this.state;

    try {
      const duplicado = repositories.filter(
        repositorie => repositorie === newRepo
      );

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
        loading: false,
        errorMessage: '',
      });
    } catch (error) {
      this.setState({
        loading: false,
        validRepo: false,
        errorMessage: error.message,
      });
    }
  };

  render() {
    const {
      newRepo,
      loading,
      repositories,
      validRepo,
      errorMessage,
    } = this.state;

    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositórios
        </h1>

        <Form onSubmit={this.handleSubmit} validRepo={validRepo}>
          <input
            type="text"
            placeholder="Adicionar repositório"
            value={newRepo}
            onChange={this.handleInputChange}
          />
          <span className={validRepo ? `invisible` : `helpBlock`}>
            {errorMessage}
          </span>

          <SubmitButton loading={loading}>
            {loading ? (
              <FaSpinner color="#fff" size={14} />
            ) : (
              <FaPlus color="#fff" size={14} />
            )}
          </SubmitButton>
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
