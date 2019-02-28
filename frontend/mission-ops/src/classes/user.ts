export class User {
    public id: string;
    public email: string;
    public phone: string;
    public administrator: boolean;
    public status: string;
    public preferredContactMethod: string;

    constructor(params: User = {} as User) {
        let {
            id = '',
            email = '',
            phone = '',
            administrator = false,
            status = '',
            preferredContactMethod = ''
        } = params;

        this.id = id;
        this.email = email;
        this.phone = phone;
        this.administrator = administrator;
        this.status = status;
        this.preferredContactMethod = preferredContactMethod;
    }
}