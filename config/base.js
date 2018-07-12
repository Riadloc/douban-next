const dev = process.env.NODE_ENV !== 'production';

export default dev ? 'http://localhost:3000' : 'http://118.24.120.160:3000';
