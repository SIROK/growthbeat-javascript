class Application {
    private id:string;
    private name:string;
    private created:Date;

    constructor(data?:any) {
        if (data != null) this.setData(data);
    }

    setData(data:any) {
        this.id = data.id;
        this.name = data.name;
        this.created = new Date(data.created);
    }

    getId():string {
        return this.id;
    }

    getName():string {
        return this.name;
    }

    getCreated():Date {
        return this.created;
    }
}

export = Application;
