import { app, port } from "./application/app.js";

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
