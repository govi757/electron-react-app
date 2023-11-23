export enum Rules {
    Required = "Required",
    EMail = "EMail",
    Password = "Password",
  }

  export class RuleValidation {
    public errorMessage = '';
    validateRequired(value: any, dataSelectorKey: string) {
        if(!value[dataSelectorKey]) {
            this.errorMessage = this.errorMessage + `${dataSelectorKey} is required \t \n`
        }
        
    }

    validateEmail(value: any, dataSelectorKey: string) {
        if (! (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value[dataSelectorKey])))
        {
            this.errorMessage =this.errorMessage +  `Please enter a valid EMail Id \n`
        }
    }

    validatePassword(value: any, dataSelectorKey: string) {
        
    }

    validateValueWithRule(value: any, dataSelectorKey: string, rules: Rules[]|undefined) {
        
        (rules||[]).forEach(rule => {
            if(rule === Rules.Required) {
                this.validateRequired(value, dataSelectorKey)
            }
            if(rule === Rules.EMail) {
                this.validateEmail(value, dataSelectorKey)
            }

            if(rule === Rules.Password) {
                this.validatePassword(value, dataSelectorKey)
            }
        });

        return this.errorMessage;
      }
  }