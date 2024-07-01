import { Controller } from "../configs/decorators/app-registry.decorator";
import { Get } from "../configs/decorators/http-request.decorator";

@Controller()
export class AppController {
    constructor() {}
    
    @Get("/")
    public healthz() {
        throw new Error('Error 555')
        return "Hello World"
    }
}