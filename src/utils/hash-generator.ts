const bcrypt = require('bcrypt');

const senha = '24bcprodutos25';
const saltRounds = 10;

bcrypt.hash(senha, saltRounds, (err, hash) => {
  if (err) {
    console.error('Erro ao gerar hash:', err);
  } else {
    console.log('HASH:', hash);
  }
});
