const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080;

app
    .use(express.static('./public'))
    .listen(PORT, error => {
        if (error) {
            console.error(`Error!\nPort ${PORT} can't be used.\nError message: ${error.message}`);
            process.exit(1);
        }

        console.log(`Server has started!\nServer listening ${PORT} port.`);
    });