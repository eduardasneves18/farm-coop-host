export class Cliente {
  id?: string;
  email?: string;
  password?: string;
  nome?: string;
  primeiroNome?: string;
  ultimoNome?: string;

  constructor(data: Partial<Cliente> = {}) {
    this.id = data.id;
    this.email = data.email;
    this.password = data.password;
    this.nome = data.nome;
    this.primeiroNome = data.primeiroNome;
    this.ultimoNome = data.ultimoNome;
  }

  static fromJson(json: Record<string, any>): Cliente {
    return new Cliente({
      id: json['id'],
      email: json['email'],
      password: json['senha'] || json['password'], // adaptando chave 'senha'
      nome: json['nome'],
      primeiroNome: json['primeiroNome'],
      ultimoNome: json['ultimoNome'],
    });
  }

  toJson(): Record<string, any> {
    const json: Record<string, any> = {
      id: this.id,
      email: this.email,
      password: this.password,
      nome: this.nome,
      primeiroNome: this.primeiroNome,
    };
    if (this.ultimoNome !== undefined) {
      json.ultimoNome = this.ultimoNome;
    }
    return json;
  }

  toRegisterJson(): Record<string, any> {
    return {
      nome: this.nome,
      email: this.email,
      senha: this.password, // Mantém 'senha' aqui conforme Dart
    };
  }

  toLoginJson(): Record<string, any> {
    return {
      email: this.email,
      password: this.password,
    };
  }

  toString(): string {
    return `Cliente{id: ${this.id}, email: ${this.email}, senha: ${this.password}, nome: ${this.nome}, primeiroNome: ${this.primeiroNome}, ultimoNome: ${this.ultimoNome}}`;
  }
}
