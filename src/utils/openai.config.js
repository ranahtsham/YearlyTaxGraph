module.exports = {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || localStorage.getItem('OPENAI_API_KEY'),
};