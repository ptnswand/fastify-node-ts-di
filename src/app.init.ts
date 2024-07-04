import "reflect-metadata";
import "./configs/di-container.config";
import * as dotenv from "dotenv";

dotenv.config();

import { container } from "tsyringe";
import { AppServer } from "./app.server";

// Import all controllers
import { AppController } from "./controllers/app.controller";
import { AccountController } from "./controllers/accounts/account.controller";

// Resolve App Server instance from container
const server = container.resolve(AppServer);

// Initialize the app server
server.InitializeAppServer([AppController, AccountController]);