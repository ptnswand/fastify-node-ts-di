import { Controller } from "../configs/decorators/app-registry.decorator";
import { Get } from "../configs/decorators/http-request.decorator";
import { AppService } from "./app.service";

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService
    ) {}
    
    @Get("/")
    public healthz() {
        return this.appService.find()
    }
}