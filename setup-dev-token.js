// Script para configurar token de desenvolvimento
// Execute este script no console do navegador na aplicação web

console.log('🔑 Configurando token de desenvolvimento...');

// Token fixo para desenvolvimento (você pode alterar este valor)
const devToken = 'dev-token-12345';

// Armazenar no localStorage
localStorage.setItem('auth_token', devToken);

console.log('✅ Token configurado com sucesso!');
console.log('📝 Token:', devToken);
console.log('🚗 Agora você pode criar veículos na aplicação!');

// Verificar se foi salvo
const savedToken = localStorage.getItem('auth_token');
console.log('🔍 Token salvo:', savedToken);

// Testar se a aplicação reconhece o token
console.log('💡 Recarregue a página e tente criar um veículo.');
