exports.congratulationsEmail = {
  subject: 'Congrulations you have weeted the most words!',
  text: authorEmail =>
    `
  Hello ${authorEmail}!
  
  You have weeted the most words!
  
  Thanks!
      `
};
