import Professor from '../entities/professor.entity';
import ProfessorRepository from '../repositories/professor.repository';
import { FilterQuery } from '../utils/database/database';
import BusinessException from '../utils/exceptions/business.exception';
import UnauthorizedException from '../utils/exceptions/unauthorized.exception';
import Mensagem from '../utils/mensagem';
import { TipoUsuario } from '../utils/tipo-usuario.enum';
import { Validador } from '../utils/utils';

export default class ProfessorController {
  async obterPorId(id: number): Promise<Professor> {
    Validador.validarParametros([{ id }]);

    return await ProfessorRepository.obterPorId(id);
  }

  async obter(filtro: FilterQuery<Professor> = {}): Promise<Professor> {
    return await ProfessorRepository.obter(filtro);
  }

  // #pegabandeira
  async listar(filtro: FilterQuery<Professor> = {}): Promise<Professor[]> {
    return await ProfessorRepository.listar({ tipo: { $eq: TipoUsuario.PROFESSOR } });
  }

  // #pegabandeira
  async incluir(professor: Professor) {
    const { nome, email, senha } = professor;

    Validador.validarParametros([{ nome }, { email }, { senha }]);
    professor.tipo = 1;

    const emailCadastrado = await ProfessorRepository.listar({ email: { $eq: email } });
    if (emailCadastrado.length) {
      throw new BusinessException('Email já cadastrado!')
    }

    var id = await ProfessorRepository.incluir(professor);
    return new Mensagem('Professor incluido com sucesso!', {
      id,
    });
  }

  async alterar(id: number, professor: Professor) {
    const { nome, senha } = professor;

    Validador.validarParametros([{ id }, { nome }, { senha }]);

    if (professor.email != undefined || professor.email != '') {
      throw new BusinessException('Alteração do email não permitida!')
    }

    const idProfessor = await ProfessorRepository.listar({ id: { $eq: id } });

    if (!TipoUsuario.PROFESSOR && !idProfessor) {
      throw new UnauthorizedException('Você não tem permissão para alterar este cadastro!')
    }

    await ProfessorRepository.alterar({ id }, professor);

    return new Mensagem('Professor alterado com sucesso!', {
      id,
    });
  }

  async excluir(id: number) {
    Validador.validarParametros([{ id }]);

    await ProfessorRepository.excluir({ id });

    // VER PORQUE NÃO ESTÁ FUNCIONANDOOOOOOOO
    // if (!TipoUsuario.PROFESSOR) {
    //   throw new UnauthorizedException('Você não tem permissão para excluir!')
    // }

    return new Mensagem('Professor excluido com sucesso!', {
      id,
    });
  }
}
