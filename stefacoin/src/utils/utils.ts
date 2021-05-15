import bcrypt from 'bcryptjs';
import Usuario from '../entities/usuario.entity';
import usuarioRepository from '../repositories/usuario.repository';
import BusinessException from '../utils/exceptions/business.exception';
import UnauthorizedException from '../utils/exceptions/unauthorized.exception';
import UnexpectedException from './exceptions/unexpected.exception';

export const Validador = {
  validarParametros: (parametros: any[]) => {
    if (!parametros) return true;

    const parametrosInvalidos = parametros
      .filter((p) => {
        const attr = Object.keys(p)[0];
        return (
          p[attr] === null ||
          p[attr] === undefined ||
          (typeof p[attr] === 'number' && isNaN(p[attr])) ||
          (typeof p[attr] === 'string' && p[attr] === '')
        );
      })
      .map((p) => Object.keys(p)[0]);

    if (parametrosInvalidos.length) {
      throw new BusinessException(`Os seguintes parametros são obrigatórios: ${parametrosInvalidos.join(', ')}`);
    }
    return true;
  },

  validarSenha: (senha: string, senhaAtual: string) => {
    const isValid = bcrypt.compareSync(senha, senhaAtual);

    if (!isValid) {
      throw new UnauthorizedException('Usuário ou senha inválida.');
    }
  },

  criptografarSenha: (senha: string): string => {
    return bcrypt.hashSync(senha, 8);
  },

  /** Varre todos os objetos do tipo Usuario da lista e remove o atributo senha dos mesmos*/
  removerSenhaDaLista: (usuario: Usuario[]) => {
    usuario.filter((item) => {
      delete item.senha;
    });
    return usuario;
  },

  /** Recebe o objeto do tipo Usuario e remove o atributo senha do mesmo*/
  removerSenhaDoUsuario: (elemento: Usuario) => {
    return delete elemento.senha;
  },


  /** Verifica se o formato de e-mail informado é válido */
  validarEmail: async (email: string) => {

    //Regex baseada na especificação do W3C: https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address
    let regexEmailValido = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

    const emailCadastrado = await usuarioRepository.listar({ email });

    if (!emailCadastrado.length && !regexEmailValido.test(email)) {
      throw new BusinessException('E-mail inválido!');
    } else {
      return email;
    }
  },

  /** Verifica se o nome informado cotém apenas letras sem acento, espaços e caracteres alfabéticos acentuados, através de uma REGEX*/
  nomeValido: (nome: string) => {
    let regexNome = /^[A-zÀ-ú ]*$/

    if (!regexNome.test(nome)) {
      throw new UnexpectedException('Você informou caracteres inválidos no nome!')
    }
  }
};
