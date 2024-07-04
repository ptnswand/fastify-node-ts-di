import { Service } from "../configs/decorators/app-registry.decorator";

@Service()
export class AppService {

    greeting() {
        return 'Hello World'
    }
}