module.exports = (on, config) => {
    // Modifique o arquivo do seu projeto onde o Vue está instanciado
    config.env.VUE_APP_API_URL = "http://localhost:8080";
  
    return config;
  };