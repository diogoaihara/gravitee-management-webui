export class RegisterCreditCard {
    public user_id: string;
    public full_name: string;
    public email: string;
    public document: string;
    public document_type: number;
    public phone: string;
    public date_of_birth: string;
    public card_number: string;
    public card_expiration_date: any;
    public card_cvv: string;
    public card_holder_name: string;

    constructor() {
      'ngInject';
    }
  }