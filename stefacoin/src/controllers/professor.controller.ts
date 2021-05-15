import Professor from '../entities/professor.entity';
import ProfessorRepository from '../repositories/professor.repository';
import usuarioRepository from '../repositories/usuario.repository';
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
    return await ProfessorRepository.listar();
  }

  // #pegabandeira
  async incluir(professor: Professor, tipo:number) {
    const { nome, email, senha } = professor;

    Validador.validarParametros([{ nome }, { email }, { senha }]);
    professor.tipo = 1;

    Validador.nomeValido(professor.nome);

    /** Compara o e-mail informado e verifica se o mesmo já existe em algum cadastro do banco */
    const emailCadastrado = await ProfessorRepository.listar({ email: { $eq: email } });
    if (emailCadastrado.length) {
      throw new BusinessException('Email já cadastrado!')
    }

    var id = await ProfessorRepository.incluir(professor);
    return new Mensagem('Professor incluido com sucesso!', {
      id,
    });
  }

  async alterar(id: number, professor: Professor, uid:any) {
    const { nome, senha } = professor;
    Validador.validarParametros([{ id }, { nome }, { senha }]);

    /** Caso já exista um email cadastrado, não permite que o mesmo seja alterado */
    if (professor.email != undefined || professor.email != '') {
      throw new UnauthorizedException('Alteração do email não permitida!')
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
