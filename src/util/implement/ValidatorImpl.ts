import { injectable } from "inversify";
import { Validator } from "..";

@injectable()
export default class ValidatorImpl implements Validator {

    constructor() {}

    isEmail(email: string): boolean {
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        
        if(email) {
            if(email.match(mailformat)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}