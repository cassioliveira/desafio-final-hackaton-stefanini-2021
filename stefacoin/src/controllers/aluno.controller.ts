import Aluno from '../entities/aluno.entity';
import alunoRepository from '../repositories/aluno.repository';
import AlunoRepository from '../repositories/aluno.repository';
import { FilterQuery } from '../utils/database/database';
import BusinessException from '../utils/exceptions/business.exception';
import Mensagem from '../utils/mensagem';
import { TipoUsuario } from '../utils/tipo-usuario.enum';
import { Validador } from '../utils/utils';

export default class AlunoController {
  async obterPorId(id: number): Promise<Aluno> {
    Validador.validarParametros([{ id }]);
    return await AlunoRepository.obterPorId(id);
  }

  async obter(filtro: FilterQuery<Aluno> = {}): Promise<Aluno> {
    return await AlunoRepository.obter(filtro);
  }

  // #pegabandeira
  async listar(filtro: FilterQuery<Aluno> = {}): Promise<Aluno[]> {
    return await AlunoRepository.listar({ tipo: { $eq: TipoUsuario.ALUNO } });
  }

  // #pegabandeira
  async incluir(aluno: Aluno) {
    const { nome, formacao, idade, email, senha } = aluno;
    Validador.validarParametros([{ nome }, { formacao }, { idade }, { email }, { senha }]);
    aluno.tipo = 2;

    /** Compara o e-mail informado e verifica se o mesmo já existe em algum cadastro do banco */
    const emailCadastrado = await AlunoRepository.listar({ email: { $eq: email } });
    if (emailCadastrado.length) {
      throw new BusinessException('Email já cadastrado!')
    }

    const id = await AlunoRepository.incluir(aluno);
    return new Mensagem('Aluno incluido com sucesso!', {
      id,
    });
  }

  async alterar(id: number, aluno: Aluno) {
    const { nome, senha } = aluno;

    Validador.validarParametros([{ id }, { nome }, { senha }]);

    if (aluno.email != undefined || aluno.email != '') {
      throw new BusinessException('Alteração do email não permitida!')
    }

    await AlunoRepository.alterar({ id }, aluno);
    return new Mensagem('Aluno alterado com sucesso!', {
      id,
    });
  }

  async excluir(id: number) {
    Validador.validarParametros([{ id }]);

    await AlunoRepository.excluir({ id });
    return new Mensagem('Aluno excluido com sucesso!', {
      id,
    });
  }
}
