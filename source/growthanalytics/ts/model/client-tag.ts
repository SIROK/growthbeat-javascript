class ClientTag {

    private clientId:string;
    private tagId:string;
    // FIXME data type
    private value:string;
    private created:Date;

    constructor(data?:any) {

        if (data == undefined)
            return;

        this.clientId = data.clientId;
        this.tagId = data.tagId;
        this.value = data.value;
        // FIXME DateUtils.foramt();
        this.created = data.created;

    }

    static create(clientId:string, tagId:string, value:string, credentialId:string, success:(clientTag:ClientTag)=>void, failure:(error:any)=>void):void {

        // FIXME if value is null
        // FIXME merge GrowthbeatCore
        //nanoajax.ajax({
        //    url: 'https://api.analytics.growthbeat.com/1/clients/',
        //    method: 'POST',
        //    body: 'clientId=' + clientId
        //    + '&tagId=' + tagId
        //    + '&value=' + value
        //    + '&credentialId=' + credentialId
        //}, (code:number, responseText:string)=> {
        //    if (code !== 200)
        //        failure('failure');
        //    success(new ClientTag(JSON.parse(responseText)));
        //});

    }

    getClientId():string {
        return this.clientId;
    }

    setClientId(clientId:string) {
        this.clientId = clientId;
    }

    getTagId():string {
        return this.tagId;
    }

    setTagId(tagId:string) {
        this.tagId = tagId;
    }

    getValue():string {
        return this.value;
    }

    setValue(value:string) {
        this.value = value;
    }

    getCreated():Date {
        return this.created;
    }

    setCreated(created:Date) {
        this.created = created;
    }

}

export = ClientTag;

