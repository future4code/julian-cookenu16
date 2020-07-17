import express from "express";
import { AddressInfo } from "net";

import { signupEndpoint } from "./endpoints/signupEndpoint";
import { loginEndpoint } from "./endpoints/loginEndpoint";
import { getProfileEndpoint } from "./endpoints/getProfileEndpoint";
import { getUserByIdEndpoint } from "./endpoints/getUserByIdEndpoint";
import { createRecipeEndpoint } from "./endpoints/createRecipeEndpoint";
import { getRecipeEndpoint } from "./endpoints/getRecipeByIdEndpoint";
import { followUserEndpoint } from "./endpoints/followUserEndpoint";
import { unfollowUserEndpoint } from "./endpoints/unfollowUserEndpoint";
import { getFeedEndpoint } from './endpoints/getFeedEndpoint';

const app = express();

app.use(express.json());

const server = app.listen(process.env.PORT || 3003, () => {
  if (server) {
    const address = server.address() as AddressInfo;
    console.log(`Server is running in http://localhost:${address.port}`);
  } else {
    console.error(`Failure upon starting server.`);
  }
});

app.post('/signup', signupEndpoint);

app.post('/login', loginEndpoint);

app.get('/user/profile', getProfileEndpoint);

app.get('/user/feed', getFeedEndpoint);

app.get('/user/:id', getUserByIdEndpoint);

app.post('/recipe', createRecipeEndpoint);

app.get('/recipe/:id', getRecipeEndpoint);

app.post('/user/follow', followUserEndpoint);

app.post('/user/unfollow', unfollowUserEndpoint);