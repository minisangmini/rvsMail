const app = require("./app");

PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`${PORT} 포트에서 서버가 실행 되었습니다`);
})